var db = require('./database.js'),
    sql = require('./mysql.js'),
    helper = require('./helper');

function requireRole(role) {
    return function (req, res, next) {
        var credentials = req.cookies.token ? req.cookies : req.body;

        getUser(credentials, function (user) {
            if (role.indexOf(user && user.permission) != -1) {
                currentUser = user;
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
        token: currentUser.token,
        link: currentUser.permission,
        UserID: currentUser.id,
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
        WHERE COLEL_ID = ${sql.v(req.cookies.UserID)};`,
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

    // })
    // try and save object in database, and send result to client.
    if (db.ADD('students', req.body.student)) {
        res.send({
            success: 'האברך נוסף בהצלחה',
            students: db.GET('students', req.cookies.UserID)
        });
    } else {
        res.send({
            error: 'המשתמש כבר קיים'
        });
    };
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
    var id = req.body.editId,
        newRecomend = {
            id: db.COUNT('recomends'),
            UserID: req.cookies.UserID,
            editId: req.body.editId,
            Type: id ? 'עדכון' : 'הוספה',
            Requested: new Date(),
            Approved: undefined,
            TableName: req.body.table,
            Data: req.body.data
        }
    newRecomend.Data.UserID = newRecomend.UserID;

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

    // if('Admin' ||
    //    'User' && req.body.date.getMonth() === new Date().getMonth() ||
    //    'User' && db.get('monthlyStatus', req.body.date, req.cookies.UserID) !== null){

    // }

    var AllDaily = db.GETALL('daily');
    var AllStudents = db.GETALL('students');
    var rightDaily = [];
    var bool = true;

    for (var i = 0; i < AllStudents.length; i++) {
        for (var j = 0; j < AllDaily.length; j++) {
            if (new Date(req.body.date).getMonth() === AllDaily[j].date.getMonth() &&
                new Date(req.body.date).getDate() === AllDaily[j].date.getDate()) {
                if (AllDaily[j].studID === AllStudents[i].id && AllStudents[i].UserID === req.cookies.UserID) {
                    rightDaily.push({
                        id: AllStudents[i].id,
                        first: AllStudents[i].firstName,
                        last: AllStudents[i].lastName,
                        phone: AllStudents[i].phone,
                        val: AllDaily[j].late ? AllDaily[j].late : null
                    });
                    bool = false;
                }
            }
        }
        if (bool) {
            rightDaily.push({
                id: AllStudents[i].id,
                first: AllStudents[i].firstName,
                last: AllStudents[i].lastName,
                phone: AllStudents[i].phone,
                val: null
            });

        }
        bool = true;
    }
    res.send({
        dailyRep: rightDaily,
        dropList: {
            title: ['נוכחות'],
            options: [db.GETALL('presenceStatus')]
        },
        tempStudents: 3
    });
};

function getScores(req, res) {
    var students = db.GETALL('students');
    var studentList = [];
    students.map((val) => (studentList.push({
        id: val.id,
        first: val.firstName,
        last: val.lastName,
        phone: val.phone,
        oral: null,
        write: null
    })));
    res.send({
        studentList: studentList,
        dropList: {
            title: ['מבחן בכתב', 'מבחן בעל פה'],
            options: [{
                name: 'לא עבר',
                value: 0
            },
            {
                name: 'עבר',
                value: 100
            }
            ]
        }
    })
}

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
    getScores: getScores
}