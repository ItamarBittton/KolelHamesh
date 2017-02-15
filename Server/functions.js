var db = require('./database.js'),
    sql = require('./mysql.js'),
    helper = require('./helper');

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

function getStudents(req, res) {
    sql.q(`SELECT *
        FROM tb_student
        WHERE COLEL_ID = ${sql.v(13)}`,
        function (data) {
            res.send({
                students: data.results
            });
        }
    );


};

function newStudent(req, res) {
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
    var dailyRep = [];
    var dropList = {
            title: ['נוכחות'],
            options: []
        }
    sql.q(`select t1.first_name, t1.last_name, t1.phone, t2.presence
           from tb_student t1 
                left outer join tb_daily t2 on (t2.student_id = t1.id and t2.date = '${sql.v(req.params.date)}') 
           where t1.colel_id = ${sql.v(req.currentUser.colel_id)}`,
                                                         function(data){
                                                             dailyRep = data.results;
                                                             sql.q(`select * from tbk_presence_status`, function(data){
                                                                 dropList.options = data.results;
                                                                 res.send({ dailyRep, dropList, tempStudents : 3});
                                                             });
                                                         });
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
    getUser: getUser,
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