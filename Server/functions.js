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
                if (AllDaily[j].studID === AllStudents[i].id) {
                    rightDaily.push({
                        id: AllStudents[i].id,
                        first: AllStudents[i].firstName,
                        last: AllStudents[i].lastName,
                        phone: AllStudents[i].phone,
                        late: AllDaily[j].late ? AllDaily[j].late : null
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
                late: null
            });
            
        }
        bool = true;
    }
    res.send({ dailyRep: rightDaily, presenceStatus: db.GETALL('presenceStatus') });
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