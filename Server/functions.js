var db = require('./database.js');

function getStudents(req, res) {
    res.send({
        students: db.GET('students', req.cookies.UserID)
    });
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
    db.UPD('students', req.body.id, req.body.student);

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
    var newRecomend = {
            RecomendID: db.COUNT(req.body.table),
            UserID: req.cookies.UserID,
            Type: 'הוספה',
            Requested: new Date(),
            Approved: undefined,
            TableName: req.body.table,
            Data: req.body.data
        }

    if (db.ADD('recomends', newRecomend)) {
        res.send({
            success: 'ההוספה בוצעה בהצלחה ומחכה לעדכון מנהל מערכת',
            data: db.GET(req.body.table, req.cookies.UserID)
        });
    } else {
        res.send({
            error: 'הבקשה כבר נשלחה בעבר'
        });
    };
};

function editRecomend(req, res) {
    // Save object in database.
    db.UPD('recomends', req.body.id, req.body.recomend);

    res.send({
        success: 'העדכון בוצעה בהצלחה ומחכה לעדכון מנהל מערכת',
        recomends: db.GET('recomends', req.cookies.UserID)
    });
};

function deleteRecomend(req, res) {
    // Save object in database.
    db.SUB('recomends', req.body.id);

    res.send({
        success: 'העדכון נמחק בהצלחה',
        recomends: db.GET('recomends', req.cookies.UserID)
    });
};

function approveRecomend(req, res) {

 };

function denyRecomend(req, res) {
    
 };

module.exports = {
    getStudents: getStudents,
    newStudent: newStudent,
    editStudent: editStudent,
    deleteStudent: deleteStudent,
    getRecomends: getRecomends,
    newRecomend: newRecomend,
    editRecomend: editRecomend,
    deleteRecomend: deleteRecomend,
    approveRecomend: approveRecomend,
    denyRecomend: denyRecomend
}