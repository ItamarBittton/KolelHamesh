var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    Admin = 'Admin',
    User = 'User',
    currentUser,
    f = require('./Server/functions.js');

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

// app.get('/' + Admin, requireRole([Admin]), sendHomePage);
// app.get('/' + User, requireRole([User]), sendHomePage);

// app.post('/login', requireRole([Admin, User]), sendCookies);

// app.get('/students', requireRole([Admin, User]), f.getStudents);
// app.post('/students', requireRole([Admin]), f.newStudent);
// app.put('/students', requireRole([Admin]), f.editStudent);
// app.delete('/students', requireRole([Admin]), f.deleteStudent);

// app.get('/recomends', requireRole([Admin, User]), f.getRecomends);
// app.post('/recomends', requireRole([User]), f.newRecomend);
// app.post('/approve', requireRole([Admin]), f.approveRecomend);
// app.post('/deny', requireRole([Admin]), f.denyRecomend);

// app.get('/daily/:date', requireRole([Admin, User]), f.getDailyReport);
// //app.put('/daily', requireRole([Admin, User]), f.updateDailyReport);

// app.get('/isOnlyDaily',  requireRole([Admin, User]), f.isOnlyDaily);

// app.post('/scores', requireRole([Admin, User]), f.getScores);

// function validate(credentials, key) {

//     currentUser = Users.userList.filter(function (value) {
//         return value.token === credentials.token;
//     })[0];

//     if (!currentUser) {
//         currentUser = Users.userList.filter(function (value) {
//             return (value.username === credentials.username && value.password === credentials.password);
//         })[0];
//     }

app.get('/' + Admin, f.requireRole([Admin]), sendHomePage);
app.get('/' + User, f.requireRole([User]), sendHomePage);

function sendHomePage(req, res) {
    console.log(req.currentUser.user_name);
    res.sendFile(__dirname + '/dist/index.html');
};

app.post('/login', f.requireRole([Admin, User]), f.sendCookies);

app.get('/students', f.requireRole([Admin, User]), f.getStudents);
app.post('/students', f.requireRole([Admin]), f.newStudent);
app.put('/students', f.requireRole([Admin]), f.editStudent);
app.delete('/students', f.requireRole([Admin]), f.deleteStudent);

app.get('/colels', f.requireRole([Admin]), f.getColel);
app.put('/colels', f.requireRole([Admin]), f.editColel);

app.get('/recomends', f.requireRole([Admin, User]), f.getRecomends);
app.post('/recomends', f.requireRole([Admin, User]), f.newRecomend);
app.post('/approve', f.requireRole([Admin]), f.approveRecomend);
app.post('/deny', f.requireRole([Admin]), f.denyRecomend);

app.get('/daily/:date', f.requireRole([Admin, User]), f.getDailyReport);
app.post('/daily', f.requireRole([Admin, User]), f.getDailyReport);
app.put('/daily', f.requireRole([Admin, User]), f.updateDailyReport);

app.get('/isOnlyDaily', f.requireRole([Admin, User]), f.isOnlyDaily);

app.get('/scores/:date', f.requireRole([Admin, User]), f.getScores);
app.put('/scores', f.requireRole([Admin, User]), f.putScores);

app.get('/colelList', f.requireRole([Admin]), f.getColelList);
app.put('/updColel', f.requireRole([Admin]), f.updColelId);

app.get('/prevDates', f.requireRole([Admin, User]), f.getPreviousDate);

var port = process.env.PORT || 8080;

app.listen(port, function () {
    console.log('Our app is running on http://localhost:' + port);
});