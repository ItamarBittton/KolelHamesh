var db = require('./database.js'),
    helper = require('./helper');

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
    var AllDaily = db.GETALL('daily');
    var AllStudents = db.GETALL('students');
    var rightDaily = [];

    for (var i = 0; i < AllDaily.length; i++) {
        for (var j = 0; j < AllStudents.length; j++) {
            if (AllDaily[i].studID === AllStudents[j].id) {
                rightDaily.push({
                    id: AllStudents[j].id,
                    first: AllStudents[j].firstName,
                    last: AllStudents[j].lastName,
                    phone: AllStudents[j].phone,
                    late: AllDaily[i].late ? AllDaily[i].late : null
                })
            }
        }

    }
    res.send({ dailyRep: rightDaily });
};

module.exports = {
    getStudents: getStudents,
    newStudent: newStudent,
    editStudent: editStudent,
    deleteStudent: deleteStudent,
    getRecomends: getRecomends,
    newRecomend: newRecomend,
    approveRecomend: approveRecomend,
    denyRecomend: denyRecomend,
    getDailyReport: getDailyReport,
}