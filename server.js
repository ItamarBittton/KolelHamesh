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

app.get('/' + Admin, f.requireRole([Admin]), sendHomePage);
app.get('/' + User, f.requireRole([User]), sendHomePage);

function sendHomePage(req, res) {
    console.log(User);
    res.sendFile(__dirname + '/dist/index.html');
};

app.post('/login', f.requireRole([Admin, User]), f.sendCookies);

app.get('/students', f.requireRole([Admin, User]), f.getStudents);
app.post('/students', f.requireRole([Admin]), f.newStudent);
app.put('/students', f.requireRole([Admin]), f.editStudent);
app.delete('/students', f.requireRole([Admin]), f.deleteStudent);

app.get('/recomends', f.requireRole([Admin, User]), f.getRecomends);
app.post('/recomends', f.requireRole([User]), f.newRecomend);
app.post('/approve', f.requireRole([Admin]), f.approveRecomend);
app.post('/deny', f.requireRole([Admin]), f.denyRecomend);

app.post('/daily', f.requireRole([Admin, User]), f.getDailyReport);
//app.put('/daily', f.requireRole([Admin, User]), f.updateDailyReport);

app.post('/scores', f.requireRole([Admin, User]), f.getScores);

var port = process.env.PORT || 8080;

app.listen(port, function () {
    console.log('Our app is running on http://localhost:' + port);
});