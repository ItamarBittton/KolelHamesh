var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var Admin = 'Admin';
var User = 'User';
var currentUser;
var db = require('./database.js');

var Users = {
    userList: [
        {
            id: '0',
            username: 'שמוליק',
            password: '770',
            permission: Admin,
            token: '12345'
        },
        {
            id: '1',
            username: 'שלום',
            password: '770',
            permission: User,
            token: '65432'
        }
    ]
}

app.use('/javascript', express.static(__dirname + '/dist/js'));
app.use('/image', express.static(__dirname + '/dist/img'));
app.use('/lib', express.static(__dirname + '/dist/lib'));
app.use('/templates', express.static(__dirname + '/dist/templates'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.get('/', function (req, res) {
    console.log('enter');
    res.sendFile(__dirname + "/dist/views/enter.html");
});

app.get('/' + Admin, requireRole([Admin]), sendHomePage);
app.get('/' + User, requireRole([User]), sendHomePage);

app.post('/login', requireRole([Admin, User]), sendCookies);

app.get('/students', requireRole([Admin, User]), getStudents);
app.post('/students', requireRole([Admin]), newStudent);
app.put('/students', requireRole([Admin]), editStudent);
app.delete('/students', requireRole([Admin]), deleteStudent);

app.get('/recomends', requireRole([Admin, User]), getRecomends);
app.post('/recomends', requireRole([User]), newRecomend);
app.put('/recomends', requireRole([User]), editRecomend);
app.delete('/recomends', requireRole([User]), deleteRecomend);

function requireRole(role) {
    return function (req, res, next) {
        var a = false;
        for (i in role) {
            var credentials = req.cookies.token ? req.cookies : req.body;

            if (validate(credentials, role[i])) {
                a = true;
                next();
            }
        }
        if (!a)
            res.sendStatus(403);
    }
}

function validate(credentials, key) {
    currentUser = Users.userList.filter(function (value) {
        return value.token === credentials.token;
    })[0];

    if (!currentUser) {
        currentUser = Users.userList.filter(function (value) {
            return (value.username === credentials.username && value.password === credentials.password);
        })[0];
    }

    if (currentUser) return (currentUser.permission === key);
}

function sendCookies(req, res) {
    res.send({
        token: currentUser.token,
        link: currentUser.permission,
        UserID: currentUser.id
    });
};

function sendHomePage(req, res) {
    console.log(User);
    res.sendFile(__dirname + '/dist/index.html');
};

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
    if (db.ADD('recomends', req.body.recomend)) {
        res.send({
            success: 'ההוספה בוצעה בהצלחה ומחכה לעדכון מנהל מערכת',
            recomends: db.GET('recomends', req.cookies.UserID)
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

var port = process.env.PORT || 8080;

app.listen(port, function () {
    console.log('Our app is running on http://localhost:' + port);
});