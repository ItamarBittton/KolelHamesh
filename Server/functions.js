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

function twoDigits(d) {
    if (0 <= d && d < 10) return "0" + d.toString();
    if (-10 < d && d < 0) return "-0" + (-1 * d).toString();
    return d.toString();
}

Date.prototype.toMysqlFormat = function () {
    return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
};

function requireRole(role) {
    return function (req, res, next) {
        var credentials = req.cookies.token ? req.cookies : req.body;

        getUser(credentials, function (user) {
            if (role.includes(user && user.permission)) {
                req.currentUser = user;
                if (req.currentUser.permission === 'User') {
                    sql.q(`update tb_user set last_login = '${new Date().toMysqlFormat()}' where id = ${req.currentUser.id}`, function (data) {
                        next();
                    })
                } else {
                    next();
                }
            } else {
                res.sendStatus(403);
            }
        });
    }
}

function getUser(credentials, callback) {
    try {
        sql.q(queries.getUser(credentials),
            function (data) {
                callback(data.results[0]);
            }
        );
    } catch (err) {
        console.log(err);
    }
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
    sql.mq([queries.getRecommends(req), queries.getStats(req)], function (data) {
        if (data.error) {
            res.send({
                error: 'לא ניתן להציג נתונים'
            });
        } else {
            for (var i = 0; i < data.results[0].length; i++) {
                data.results[0][i].data = JSON.parse(data.results[0][i].data);
            }
            res.send({
                recomends: data.results[0],
                stats: data.results[1][0]
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
        (req.currentUser.permission === 'User' && req.currentUser.is_only_daily === true && req.params.date.split('-')[2] == new Date().getDate()) ||
        (req.currentUser.permission === 'User' && req.currentUser.is_prev_month == true && currMonth == new Date().getMonth())
    ) {
        sql.mq([queries.getDailyReport(req), queries.getDailyOptions(req),
        queries.getTempStudents(req), queries.getDailyCount(req, currMonth)], function (data) {
            if (data.error) {
                res.send({ error: 'אין אפשרות לצפות בנתונים בתאריך הנל' });
            } else {
                var statuses = data.results[3];
                var count = [];

                statuses.forEach(function (status) {
                    if (status.count === data.results[0].length) {
                        count[status.monthday - 1] = ('green');
                    } else {
                        count[status.monthday - 1] = ('orange');
                    }
                });

                for (var i = 0; i < new Date().getDate() - 1; i++) {
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
        sysLastMonth = new Date().getMonth() || 12,
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
        res.send({
            is_only_daily: data.results[0].is_only_daily,
            is_one_time_allow: data.results[0].is_one_time_allow
        });
    });
};

function getScores(req, res) {
    sql.mq([queries.getScores(req), queries.getTestTypes()], function (data) {
        res.send({
            scores: data.results[0] || [],
            test_type: data.results[1] || []
        });
    });
};

function putScores(req, res) {

    var arr = [];
    var commentArr = [];
    var year = req.body.date.split('-')[0];
    var month = req.body.date.split('-')[1];

    function sliceArr(val) {
        if (val.oral !== null || val.write !== null) {
            arr.push({
                student_id: val.id,
                year: year,
                month: month,
                oral_score: val.oral,
                write_score: val.write
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

    var Colel = {
        id: reqColel.id,
        name: reqColel.name,
        address: reqColel.address,
        mail_address: reqColel.mail_address,
        phone: reqColel.phone,
        manager_name: reqColel.manager_name,
        is_only_daily: reqColel.is_only_daily || false,
        is_prev_month: reqColel.is_prev_month || false,
        is_one_time_allow: reqColel.is_one_time_allow || false,
        schedule: reqColel.schedule,
        note: reqColel.note || false,
        group_type: 1
    };

    sql.mq([sql.ia('tb_colel', [Colel], true), queries.updateColel(Colel, reqColel.password)], function (data) {
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

    var newColel = {
        name: reqColel.name,
        address: reqColel.address,
        mail_address: reqColel.mail_address,
        phone: reqColel.phone,
        manager_name: reqColel.manager_name,
        is_only_daily: reqColel.is_only_daily || false,
        is_prev_month: reqColel.is_prev_month || false,
        is_one_time_allow: reqColel.is_one_time_allow || false,
        schedule: reqColel.schedule,
        note: reqColel.note || false,
        group_type: 1
    };

    sql.q(sql.ia('tb_colel', [newColel], false), function (data) {
        if (data.error) {
            res.send({ error: 'אירעה שגיאה בעת הוספת הנתונים' });
        } else {
            var newUser = [{
                user_name: reqColel.name,
                token: getToken(),
                password: reqColel.password,
                permission: 'User',
                colel_id: data.results.insertId
            }];

            sql.mq([queries.getColel(), sql.ia('tb_user', newUser, false)], function (data) {
                res.send({
                    success: 'השינויים בוצעו בהצלחה!',
                    colels: data.results[0]
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


function updateAllColelsToLastMonthOpen(req, res) {
    const val = req.params.val != 0 ? 1 : 0;

    sql.q(`UPDATE tb_colel SET is_prev_month = ${val}`, function (data) {
        if (data.error) {
            res.send({
                error: 'היתה בעיה בעת עדכון הנתונים'
            });
        }
        else {
            res.send({
                success: 'הבקשה בוצעה בהצלחה'
            })
        }
    })
}

function updateAllColelsToDailyOpen(req, res) {
    const val = req.params.val != 0 ? 1 : 0;

    sql.q(`UPDATE tb_colel SET is_only_daily = ${val}`, function (data) {
        if (data.error) {
            res.send({
                error: 'היתה בעיה בעת עדכון הנתונים'
            });
        }
        else {
            res.send({
                success: 'הבקשה בוצעה בהצלחה'
            })
        }
    })
}

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
                definitions: data.results[0][0] || [],
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
    var name = req.body.type == 1 ? (req.body.colelName) : req.body.typeName,
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
                colel_id: req.body.colel,
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
    newReport: newReport,


    updateAllColelsToLastMonthOpen: updateAllColelsToLastMonthOpen,
    updateAllColelsToDailyOpen: updateAllColelsToDailyOpen
}
