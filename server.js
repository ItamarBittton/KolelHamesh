var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var Admin = 'Admin';
var User = 'User';
var currentUser;
var db = require('./Server/database.js');
var f = require('./Server/functions.js');

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

app.get('/students', requireRole([Admin, User]), f.getStudents);
app.post('/students', requireRole([Admin]), f.newStudent);
app.put('/students', requireRole([Admin]), f.editStudent);
app.delete('/students', requireRole([Admin]), f.deleteStudent);

app.get('/recomends', requireRole([Admin, User]), f.getRecomends);
app.post('/recomends', requireRole([User]), f.newRecomend);
app.post('/approve', requireRole([Admin]), f.approveRecomend);
app.post('/deny', requireRole([Admin]), f.denyRecomend);

app.post('/daily', requireRole([Admin, User]), f.getDailyReport);
app.put('/daily', requireRole([Admin, User]));

app.post('/scores', requireRole([Admin, User]), f.getScores);

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

function sendHomePage(req, res) {
    console.log(User);
    res.sendFile(__dirname + '/dist/index.html');
};

var port = process.env.PORT || 8080;

app.listen(port, function () {
    console.log('Our app is running on http://localhost:' + port);
});