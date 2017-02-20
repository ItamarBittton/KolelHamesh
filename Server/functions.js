var db = require('./database.js'),
    sql = require('./mysql.js'),
    helper = require('./helper');

function requireRole(role) {
    return function (req, res, next) {
        var credentials = req.cookies.token ? req.cookies : req.body;

        getUser(credentials, function (user) {
            if (role.indexOf(user && user.permission) != -1) {
                req.currentUser = user;
                next();
            } else {
                res.sendStatus(403);
            }
        });
    }
}

function getUser(credentials, callback) {
    sql.q(`SELECT *
           FROM tb_user
           WHERE token = ${sql.v(credentials.token || '0')} OR
                 (user_name = '${sql.v(credentials.username || '0')}' AND
                  password = '${sql.v(credentials.password || '0')}')`,
        function (data) {
            callback(data.results[0]);
        }
    );
};

function sendCookies(req, res) {
    res.send({
        token: req.currentUser.token,
        link: req.currentUser.permission,
        UserID: req.currentUser.id,
        alert: [{
            type: 'success',
            msg: 'Another alert!'
        }, {
            type: 'warning',
            msg: 'Another alert!'
        }]
    });
};

function getStudents(req, res) {
    sql.q(`SELECT *
        FROM tb_student
        WHERE COLEL_ID = ${sql.v(req.currentUser.colel_id)};`,
        function (data) {
            res.send({
                students: data.results
            });
        }
    );
};

function newStudent(req, res) {
    // sql.q(`INSERT INTO `tb_student` (`id`, `supported_id`, `first_name`, `last_name`, `phone`, `street`, `house`, `city`, `bank`, `branch`, `account`, `account_name`, `colel_id`)
    //        VALUES ('204305660', '', 'שלום', 'אופן', '770555215', 'החרובים', '8', 'מכבים', '05', '552', '152455', 'שלום אופן', '13');`,
    //     function (data) { 

    // INSERT INTO `tb_recomend` (`user_update`, `type`, `requested_date`, `approved_date`, `status`, `table_name`, `data`) VALUES ('13', 'הוספה', '2017-02-01 00:00:00', NULL, NULL, 'Students', '{"first_name":"יוסי"}')
    var i = `${sql.i('tb_recomend', req.body.data)}`
    sql.q(`${sql.v(i)}`, function (data) {
        console.log(data);
    })

    // })
    // try and save object in database, and send result to client.
    // if (db.ADD('students', req.body.student)) {
    //     res.send({
    //         success: 'האברך נוסף בהצלחה',
    //         students: db.GET('students', req.cookies.UserID)
    //     });
    // } else {
    //     res.send({
    //         error: 'המשתמש כבר קיים'
    //     });
    // };
};

function editStudent(req, res) {
    // Save object in database.
    db.UPD('students', req.body.student, req.body.id);

    res.send({
        success: 'האברך עודכן בהצלחה',
        students: db.GET('students', req.cookies.UserID)
    });
};

function deleteStudent(req, res) {
    // Save object in database.
    db.SUB('students', req.body.id);

    res.send({
        success: 'האברך נמחק בהצלחה',
        students: db.GET('students', req.cookies.UserID)
    });
};

function getRecomends(req, res) {
    res.send({
        recomends: db.GET('recomends', req.cookies.UserID)
    });
};

function newRecomend(req, res) {
    // try and save object in database, and send result to client.
    var id = req.body.data.editId,
        newRecomend = {
            user_update: sql.v(req.currentUser.colel_id),
            type: id ? 'עדכון' : 'הוספה',
            requested_date: new Date().toDateString(),
            approved_date: null,
            status: null,
            table_name: req.body.table,
            data: sql.v(JSON.stringify(req.body.data))
        }

    sql.q(`${sql.i('tb_recomend', newRecomend)}`, function (data) {
        console.log(data);
    })

    if (db.ADD('recomends', newRecomend)) {
        res.send({
            success: 'ה' + newRecomend.Type + ' בוצעה בהצלחה ומחכה לעדכון מנהל מערכת',
            data: db.GET(req.body.table, req.cookies.UserID)
        });
    } else {
        res.send({
            error: 'הבקשה כבר נשלחה בעבר'
        });
    };
};

function approveRecomend(req, res) {
    // Update recomendation to Approved and add date.
    var d = req.body.data;
    var newRecomend = helper.merge(db.getByID('recomends', d.id), d)
    newRecomend.status = 'אושר';
    newRecomend.Approved = new Date();

    var method = d.Type === 'עדכון' ? 'UPD' : 'ADD'
    // Post data to relevant table.
    if (db[method](d.TableName, d.Data, d.Data.id)) {
        db.UPD('recomends', newRecomend, d.id);
        res.send({
            success: 'הבקשה אושרה בהצלחה',
            recomends: db.GET('recomends', req.cookies.UserID)
        });
    } else {
        res.send({
            error: 'האברך כבר קיים במערכת'
        });
    };
};

function denyRecomend(req, res) {
    // Update recomendation to Approved and add date.
    var d = req.body.data;
    var newRecomend = helper.merge(db.getByID('recomends', d.id), d)
    newRecomend.status = 'נדחה';
    newRecomend.Approved = new Date();
    db.UPD('recomends', newRecomend, d.id);

    res.send({
        success: 'הבקשה נדחתה בהצלחה',
        recomends: db.GET('recomends', req.cookies.UserID)
    });
};


function getDailyReport(req, res) {

    if ((req.currentUser.permission === 'Admin') ||
        (req.currentUser.permission === 'User' && req.params.date.split('-')[1] == new Date().getMonth() + 1) ||
        (req.currentUser.permission === 'User' && req.params.date.split('-')[1] == new Date().getMonth() && new Date().getDate() <= 3)
        //||      (req.currentUser.permission === 'User' && data.results[0] === true && req.params.date.split('-')[2] == new Date().getDate())
    ) {

        var dailyRep = [];
        var dropList = {
            title: ['נוכחות'],
            options: []
        }
        sql.q(`select t1.id, t1.first_name, t1.last_name, t1.phone, t2.presence
                       from tb_student t1 
                       left outer join tb_daily t2 on (t2.student_id = t1.id and t2.date = '${sql.v(req.params.date)}') 
                       where t1.colel_id = ${sql.v(req.currentUser.colel_id)}`,
            function (data) {
                dailyRep = data.results;
                sql.q(`select * from tbk_presence_status`, function (data) {
                    dropList.options = data.results;
                    res.send({
                        dailyRep,
                        dropList,
                        tempStudents: 3
                    });
                });
            });
    }


    // var AllDaily = db.GETALL('daily');
    // var AllStudents = db.GETALL('students');
    // var rightDaily = [];
    // var bool = true;

    // for (var i = 0; i < AllStudents.length; i++) {
    //     for (var j = 0; j < AllDaily.length; j++) {
    //         if (new Date(req.body.date).getMonth() === AllDaily[j].date.getMonth() &&
    //             new Date(req.body.date).getDate() === AllDaily[j].date.getDate()) {
    //             if (AllDaily[j].studID === AllStudents[i].id && AllStudents[i].UserID === req.cookies.UserID) {
    //                 rightDaily.push({
    //                     id: AllStudents[i].id,
    //                     first: AllStudents[i].firstName,
    //                     last: AllStudents[i].lastName,
    //                     phone: AllStudents[i].phone,
    //                     val: AllDaily[j].late ? AllDaily[j].late : null
    //                 });
    //                 bool = false;
    //             }
    //         }
    //     }
    //     if (bool) {
    //         rightDaily.push({
    //             id: AllStudents[i].id,
    //             first: AllStudents[i].firstName,
    //             last: AllStudents[i].lastName,
    //             phone: AllStudents[i].phone,
    //             val: null
    //         });

    //     }
    //     bool = true;
    // }
    // res.send({
    //     dailyRep: rightDaily,
    //     dropList: {
    //         title: ['נוכחות'],
    //         options: [db.GETALL('presenceStatus')]
    //     },
    //     tempStudents: 3
    // });
};

function updateDailyReport(req, res) {
    var convertObjtoArr = [];
    req.body.daily.map((val, idx) => (convertObjtoArr.push([sql.v(val.id), "'" + sql.v(req.body.date) + "'", sql.v(val.presence)])));
    sql.q(`INSERT INTO tb_daily (student_id,date,presence) VALUES ${convertObjtoArr.map((val, idx) => (`(${val})`))}
    ON DUPLICATE KEY UPDATE date=VALUES(date), presence=VALUES(presence)`, function (data) {
            res.send({
                success: 'הדוח עודכן בהצלחה'
            });
        })

};

function isOnlyDaily(req, res) {
    sql.q(`select t1.is_only_daily 
            from tb_colel t1 
            where t1.id = ${sql.v(req.currentUser.colel_id)}`,
        function (d) {
            var data = d.results[0].is_only_daily;
            res.send({
                data
            });
        });
}

function getScores(req, res) {
    var scores = [];
    var year = sql.v(req.params.date.split('-')[0]);
    var month = sql.v(req.params.date.split('-')[1]);
    sql.q(`select t1.id, t1.first_name, t1.last_name, t2.score as 'oral', t3.score as 'write'
    from tb_student t1 
    left outer join tb_score t2 on (t1.id = t2.student_id and t2.year = ${year} and t2.month = ${month} and t2.test_type = 1)
    left outer join tb_score t3 on (t1.id = t3.student_id and t3.year = ${year} and t3.month = ${month} and t3.test_type = 2)
    where t1.colel_id = ${req.currentUser.colel_id}`, function (data) {

            scores = data.results;
            sql.q(`select t1.id, t1.name from tbk_test_types t1`, function (data) {
                var test_type = data.results;
                res.send({
                    scores,
                    test_type,
                    options: [{
                        value: 0,
                        name: 'לא עבר'
                    }, {
                        value: 100,
                        name: 'עבר'
                    }]
                });
            })

        })

    // var students = db.GETALL('students');
    // var studentList = [];
    // students.map((val) => (studentList.push({
    //     id: val.id,
    //     first: val.firstName,
    //     last: val.lastName,
    //     phone: val.phone,
    //     oral: null,
    //     write: null
    // })));
    // res.send({
    //     studentList: studentList,
    //     dropList: {
    //         title: ['מבחן בכתב', 'מבחן בעל פה'],
    //         options: [{
    //             name: 'לא עבר',
    //             value: 0
    //         },
    //         {
    //             name: 'עבר',
    //             value: 100
    //         }
    //         ]
    //     }
    // })
}

// function sliceArr(val) {
//     var
//     return
// }

function putScores(req, res) {

    var arr = [];
    var year = req.body.date.split('-')[0];
    var month = req.body.date.split('-')[1];

    function sliceArr(val) {
        if (val.oral !== null) {
            arr.push([sql.v(val.id), sql.v(year), sql.v(month), sql.v(val.oral), 1]);
        }
        if (val.write !== null) {
            arr.push([sql.v(val.id), sql.v(year), sql.v(month), sql.v(val.write), 2]);
        }

    }

    req.body.score.map(val => (sliceArr(val)));

    sql.q(`insert into tb_score (student_id, year, month, score, test_type) VALUES ${arr.map((val, idx) => (`(${val})`))}
    ON DUPLICATE KEY UPDATE score=VALUES(score), test_type=VALUES(test_type)`, function (data) {
            res.send({
                success: 'הציונים הוזנו בהצלחה'
            });
        })

}
function getColelList(req, res) {
    sql.q(`select t1.id, t1.name from tb_colel t1`, function (data) {
        res.send({ colelList: data.results, colel_id: req.currentUser.colel_id });
    });
}

function updColelId(req, res) {
    sql.q(`update tb_user set colel_id = ${sql.v(req.body.currColel)} where id = ${req.currentUser.id}`, function (data) {
        res.send({ success: 'הפעולה בוצעה בהצלחה' })
    })
};

module.exports = {
    requireRole: requireRole,
    getUser: getUser,
    sendCookies: sendCookies,
    getStudents: getStudents,
    newStudent: newStudent,
    editStudent: editStudent,
    deleteStudent: deleteStudent,
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
}