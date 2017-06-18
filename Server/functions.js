var db = require('./database.js'),
    sql = require('./mysql.js'),
    helper = require('./helper'),
    xlsx = require('./xlsx.js'),
    queries = require('./queries');

// Auth Functions
function getToken() {
    var rand = Math.random().toString(36).substr(2);
    return rand + rand;
};

function requireRole(role) {
    return function (req, res, next) {
        var credentials = req.cookies.token ? req.cookies : req.body;

        getUser(credentials, function (user) {
            if (role.includes(user && user.permission)) {
                req.currentUser = user;
                next();
            } else {
                res.sendStatus(403);
            }
        });
    }
}

function getUser(credentials, callback) {
    sql.q(queries.getUser(credentials),
        function (data) {
            callback(data.results[0]);
        }
    );
};

function sendCookies(req, res) {
    res.send({
        token: req.currentUser.token,
        link: req.currentUser.permission,
        alert: [req.currentUser.note],
        user: req.currentUser.user_name
    });
};

function getStudents(req, res) {
    sql.q(queries.getStudents(req),
        function (data) {
            res.send({
                students: data.results
            });
        }
    );
};

function getColelSettings(req, res) {
    sql.q(queries.getColelSettings(req), function (data) {
        if (data.error) {
            res.send({
                error: 'לא ניתן להציג נתונים'
            })
        } else {
            res.send({
                data: data.results[0]
            })
        }
    })
}

function getRecomends(req, res) {
    sql.q(queries.getRecommends(req), function (data) {
        if (data.error) {
            res.send({
                error: 'לא ניתן להציג נתונים'
            });
        } else {
            for (var i = 0; i < data.results.length; i++) {
                data.results[i].data = JSON.parse(data.results[i].data);
            }
            res.send({
                recomends: data.results
            });
        }
    });
};

function newRecomend(req, res) {
    // try and save object in database, and send result to client.
    var recomend = req.body.data;
    if (req.body.table === 'student' || req.body.table === 'colel') {
        var date = new Date();
        var table = req.body.table;
        var newRecomend = {
            colel_update: req.currentUser.colel_id,
            requested_date: new Date().toISOString().slice(0, 19).replace("T", " "),//`${new Date(new Date().getTime()).toLocaleString()} `,
            approved_date: null,
            type: req.body.type,
            status: null,
            table_name: `tb_${table}`,
            data: JSON.stringify(recomend)
        }
        sql.q(sql.ia(`tb_recomend`, [newRecomend], true), function (data) {
            if (data.error) {
                res.send({
                    error: 'אין אפשרות להוסיף את ההמלצה'
                })
            } else {
                res.send({
                    success: 'ההמלצה הועברה בהצלחה להמשך תהליך האישור'
                })
            }
        })
    } else {
        res.send({
            error: 'אין אפשרות להוסיף את הבקשה'
        })
    }
};

function approveRecomend(req, res) {
    // Update recomendation to Approved and add date.
    var recomend_id = sql.v(req.body.data.recomend_id);

    sql.mq([queries.getRecomend(recomend_id), queries.updateRecomend(recomend_id, 1)], function (data) {
        if (data.error || data.results[0].length < 1) {
            res.send({ error: 'אירעה שגיאה' });
        } else {
            var recomend = data.results[0][0];
            recomend.data = req.body.data.data;

            if (recomend.type !== 'מחיקה') {
                if (recomend.table_name === 'tb_student') {
                    recomend.data.newObj.colel_id = recomend.colel_update;
                }
                sql.q(sql.ia(recomend.table_name, [recomend.data.newObj], (recomend.type !== 'הוספה')), function (data) {
                    if (data.error) {
                        res.send({ error: 'אירעה שגיאה בעת הוספת הנתונים החדשים' });
                    } else {
                        res.send({ status: 'אושר', success: 'הנתונים עודכנו בהצלחה!' });
                    }
                });
            } else {
                sql.q(queries.approveDelete(recomend), function (data) {
                    if (data.error) {
                        res.send({ error: 'אירעה שגיאה בעת מחיקת הנתונים' });
                    } else {
                        res.send({ status: 'אושר', success: 'הנתונים נמחקו בהצלחה!' });
                    }
                });
            }
        }
    });
};

function denyRecomend(req, res) {
    // Update recomendation to Approved and add date.
    var recomend_id = sql.v(req.body.data.recomend_id);

    sql.mq([queries.getRecomend(recomend_id), queries.updateRecomend(recomend_id, 0)], function (data) {
        if (data.error || data.results[0].length < 1) {
            res.send({ error: 'אירעה שגיאה בעת עדכון ההמלצה' });
        } else {
            res.send({ status: 'נדחה', success: 'הבקשה בוטלה בהצלחה!' });
        };
    })
};

function getDailyReport(req, res) {
    var currMonth = req.params.date.split('-')[1];
    if ((req.currentUser.permission === 'Admin') ||
        (req.currentUser.permission === 'User' && currMonth == new Date().getMonth() + 1) ||
        (req.currentUser.permission === 'User' && currMonth == new Date().getMonth() && new Date().getDate() <= 10) ||
        (req.currentUser.permission === 'User' && req.currentUser.is_only_daily === true && req.params.date.split('-')[2] == new Date().getDate())
    ) {
        sql.mq([queries.getDailyReport(req), queries.getDailyOptions(req),
                queries.getTempStudents(req), queries.getDailyCount(req, currMonth)], function (data) {
            if (data.error) {
                res.send({ error: 'אין אפשרות לצפות בנתונים בתאריך הנל' });
            } else {
                var statuses = data.results[3];
                var count = [];

                statuses.forEach(function(status) {
                    if (status.count === data.results[0].length) {
                        count[status.monthday - 1] = ('green');
                    } else {
                        count[status.monthday - 1] = ('orange');
                    }
                });

                for (var i = 0; i < new Date().getDate() - 1; i++){
                    if (!count[i] && new Date(`2017-${currMonth}-${i + 1}`).getDay() < 5) {
                        count[i] = 'red';
                    }
                };

                res.send({
                    dailyRep: data.results[0] || [],
                    dropList: { title: ['נוכחות'], options: data.results[1] || [] },
                    tempStudents: data.results[2].length != 1 ? undefined : data.results[2][0].amount,
                    status: count
                })
            }
        });
    }
};

function updateDailyReport(req, res) {
    var isAdmin = req.currentUser.permission === 'Admin',
        isUser = req.currentUser.permission === 'User',
        userMonth = req.body.date.split('-')[1],
        userDay = req.body.date.split('-')[2],
        sysMonth = new Date().getMonth() + 1,
        sysLastMonth = new Date().getMonth(),
        sysDay = new Date().getDate();

    if ((isUser && (userMonth == sysMonth) ||
        (userDay == sysDay && req.currentUser.is_only_daily) ||
        (userMonth == sysLastMonth && (sysDay <= 3 || req.currentUser.is_prev_month))) ||
        isAdmin) {

        var convertObjtoArr = [];
        req.body.daily.map((val, idx) => (convertObjtoArr.push({ student_id: val.id, date: req.body.date, presence: val.presence })));

        if (!convertObjtoArr.length) {
            res.send({ error: 'אין נתונים' });
        } else {
            var string = sql.ia('tb_daily', convertObjtoArr, true);

            if (req.body.oneTimeStud) {
                string += ';' + sql.ia('tb_onetime_student', [{
                    date: req.body.date,
                    amount: req.body.oneTimeStud,
                    colel_id: req.currentUser.colel_id
                }], true);
            }

            sql.q(string, function (data) {
                if (data.error) {
                    res.send({ error: 'אירעה שגיאה בעת עדכון הנתונים' });
                } else {
                    res.send({ success: 'הנתונים עודכנו בהצלחה!' });
                }
            });
        }
    } else {
        res.send({ error: 'אין לך הרשאה להוסיף נתונים בתאריך הנל' });
    }
};

function isOnlyDaily(req, res) {
    sql.q(queries.getColelPermissions(req), function (data) {
        res.send({ data });
    });
};

function getScores(req, res) {
    sql.mq([queries.getScores(req), queries.getTestTypes()], function (data) {
        res.send({
            scores: data.results[0] || [],
            test_type: data.results[1] || [],
            options: [{ value: 0, name: 'לא עבר' }, { value: 100, name: 'עבר' }]
        });
    });
};

function putScores(req, res) {

    var arr = [];
    var commentArr = [];
    var year = req.body.date.split('-')[0];
    var month = req.body.date.split('-')[1];

    function sliceArr(val) {
        if (val.oral !== null) {
            arr.push({
                student_id: val.id,
                year: year,
                month: month,
                score: val.oral,
                test_type: 1
            });
        }
        if (val.write !== null) {
            arr.push({
                student_id: val.id,
                year: year,
                month: month,
                score: val.write,
                test_type: 2
            });
        }
        if (val.comment) {
            commentArr.push({
                student_id: val.id,
                year: year,
                month: month,
                comment: val.comment
            })
        }
    }

    req.body.score.map(val => (sliceArr(val)));

    var query = [sql.ia('tb_score', arr, true)];
    if (commentArr.length) query.push(sql.ia('tb_comment', commentArr, true));

    sql.mq(query, function (data) {
        if (data.error) {
            res.send({ error: 'שגיאה בשמירת הנתונים' });
        } else {
            res.send({ success: 'הציונים הוזנו בהצלחה' });
        }
    });
};

function getColelList(req, res) {
    sql.q(queries.getColels(), function (data) {
        res.send({
            colelList: data.results,
            colel_id: req.currentUser.colel_id
        });
    });
}

function updColelId(req, res) {
    sql.q(queries.updateUser(req), function (data) {
        res.send({
            success: 'הפעולה בוצעה בהצלחה'
        })
    });
};

function getColel(req, res) {
    sql.q(queries.getColel(), function (data) {
        res.send({ colels: data.results });
    });
};

function editColel(req, res) {
    var reqColel = req.body.colel;
    reqColel.group_type = 1;

    sql.mq([sql.ia('tb_colel', [reqColel], true), queries.updateColel(reqColel)], function (data) {
        if (data.error) {
            res.send({ error: 'אירעה שגיאה בעת הוספת הנתונים' });
        } else {
            sql.q(queries.getColel(), function (data) {
                res.send({
                    success: 'השינויים בוצעו בהצלחה!',
                    colels: data.results
                });
            });
        }
    });
};

function newColel(req, res) {
    var reqColel = req.body.colel;
    reqColel.group_type = 1;

    var newUser = [{
        user_name: tempObject.name,
        token: getToken(),
        password: tempObject.password,
        permission: 'User',
        colel_id: data.results.insertId
    }];

    sql.mq([sql.ia('tb_colel', [reqColel], false), sql.ia('tb_user', newUser, false)], function (data) {
        if (data.error) {
            res.send({ error: 'אירעה שגיאה בעת הוספת הנתונים' });
        } else {
            sql.q(queries.getColel(), function (data) {
                res.send({
                    success: 'השינויים בוצעו בהצלחה!',
                    colels: data.results
                });
            });
        }
    });
};

function deleteColel(req, res) {
    sql.q(deleteColel(req), function (data) {
        if (data.error) {
            res.send({ error: 'אירעה שגיאה בעת מחיקת הנתונים' });
        }
        res.send({ success: 'הפעולה בוצעה בהצלחה' });
    })
};

function getPreviousDate(req, res) {
    var date = new Date().getDate();

    if (req.currentUser.permission === 'Admin') {
        sql.q(queries.prevMonths(req), function (data) {
            res.send({ prevDates: data.results });
        });
    } else if (date <= 3 || req.currentUser.is_prev_month == true) {
        sql.q(queries.prevMonth(req), function (data) {
            res.send({ prevDates: data.results });
        });
    } else {
        res.send({})
    }
}

function getDefinitions(req, res) {
    var query = [
        queries.getDefinitions(),
        queries.getFullTestTypes(),
        queries.getReports(),
        queries.getReportTypes()
    ];

    sql.mq(query, function (data) {
        if (data.error) {
            res.send({
                error: 'אין אפשרות להציג את הנתונים',
            })
        } else {
            res.send({
                definitions: data.results[0] || [],
                test_types: data.results[1] || [],
                titles: ['הגדרות חישובים', 'מבחנים'],
                reports: data.results[2] || [],
                reportTypes: data.results[3] || []
            });
        }
    });
}

function getReports(req, res) {
    sql.q(queries.getReports(), function (data) {
        if (data.error) {
            res.send({ error: 'אין אפשרות לרענן את הדוחות', });
        } else {
            res.send({
                success: 'הדוחות עודכנו בהצלחה',
                reports: data.results
            });
        }
    });
}

function updDefinitions(req, res) {
    var table_name = req.body.table_name;

    if (table_name === 'settings' || table_name === 'test_types') {
        table_name = 'tbk_' + table_name;

        sql.q(sql.ia(table_name, req.body.object, true), function (results) {
            if (results.error) {
                res.send({ error: 'אין אפשרות לעדכן את ההגדרות' });
            } else {
                res.send({ success: 'ההגדרות עודכנו בהצלחה!' });
            }
        });
    }
}

function newReport(req, res) {
    var name = req.body.type == 1 ? (req.body.colelName || req.body.colel) : req.body.type,
        path = `/files/${name}_${req.body.month}.xlsx`;

    sql.q(queries.getReport(req), function (data) {
        if (data.error) {
            res.send({ error: 'אין אפשרות לעדכן את ההגדרות' });
        } else if (data.results.length && data.results.filter(result => result.date_created === req.body.month).length) {
            res.send({
                error: 'הקובץ כבר קיים במערכת',
                url: path
            });
        } else {
            xlsx.makeReport(path, {
                report_id: req.body.type,
                colel_id: req.body.type == 1 ? req.body.colel : null,
                date_created: req.body.month,
                url: path
            }, res);
        }
    });
};

module.exports = {
    requireRole: requireRole,
    getUser: getUser,
    sendCookies: sendCookies,

    getStudents: getStudents,

    getColelSettings: getColelSettings,

    getColel: getColel,
    editColel: editColel,
    newColel: newColel,
    deleteColel: deleteColel,

    getRecomends: getRecomends,
    newRecomend: newRecomend,
    approveRecomend: approveRecomend,
    denyRecomend: denyRecomend,
    getDailyReport: getDailyReport,
    updateDailyReport: updateDailyReport,
    getScores: getScores,
    putScores: putScores,
    isOnlyDaily: isOnlyDaily,

    getColelList: getColelList,
    updColelId: updColelId,
    getPreviousDate: getPreviousDate,

    getDefinitions: getDefinitions,
    updDefinitions: updDefinitions,

    getReports: getReports,
    newReport: newReport
}
