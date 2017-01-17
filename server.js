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
            id: '1',
            username: 'שמוליק',
            password: '770',
            permission: Admin,
            token: '12345'
        },
        {
            id: '2',
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
            res.send(403);
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

app.get('/', function (req, res) {
    console.log('enter');
    res.sendFile(__dirname + "/dist/views/enter.html");
});

app.post('/login', requireRole([Admin, User]), function (req, res) {
    res.send({
        token: currentUser.token,
        link: currentUser.permission,
        UserID: currentUser.id
    });
}
);

app.get('/' + Admin, requireRole([Admin]), function (req, res) {
    console.log(Admin);
    res.sendFile(__dirname + '/dist/index.html');
});

app.get('/' + User, requireRole([User]), function (req, res) {
    console.log(User);
    res.sendFile(__dirname + '/dist/index.html');
});


app.get('/students', requireRole([Admin, User]), function (req, res) {
    res.send({
        students: db.DB.students
    });
});

app.post('/students', requireRole([Admin, User]), function (req, res) {
    // try and save object in database, and send result to client.
    if (db.ADD('students', req.body.student)) {
        res.send({
            success: 'האברך נוסף בהצלחה',
            students: db.DB.students
        });
    } else {
        res.send({
            error: 'המשתמש כבר קיים'
        });
    };
});

app.put('/students', requireRole([Admin, User]), function (req, res) {
    // Save object in database.
    db.UPD('students', req.body.id, req.body.student);

    res.send({
        success: 'האברך עודכן בהצלחה',
        students: db.DB.students
    });
});

var port = process.env.PORT || 8080;

app.listen(port, function () {
    console.log('Our app is running on http://localhost:' + port);
});