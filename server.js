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
app.use('/files', express.static(__dirname + '/dist/files'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.get('/', function (req, res) {
    console.log('enter.html:', new Date().toISOString().slice(0, 19).replace("T"," "));
    res.sendFile(__dirname + "/dist/views/enter.html");
});

app.get('/' + Admin, f.requireRole([Admin]), sendHomePage);
app.get('/' + User, f.requireRole([User]), sendHomePage);

function sendHomePage(req, res) {
    console.log(req.currentUser.user_name, new Date());
    res.sendFile(__dirname + '/dist/index.html');
};

app.post('/login', f.requireRole([Admin, User]), f.sendCookies);

app.get('/colelSettings', f.requireRole([Admin, User]), f.getColelSettings)

app.get('/students', f.requireRole([Admin, User]), f.getStudents);
app.post('/deleteStudent', f.requireRole([Admin]), f.deleteStudent);

app.get('/colels', f.requireRole([Admin]), f.getColel);
app.put('/colels', f.requireRole([Admin]), f.newColel);
app.post('/colels', f.requireRole([Admin]), f.editColel);
app.post('/deleteColel', f.requireRole([Admin]), f.deleteColel);

app.get('/recomends', f.requireRole([Admin, User]), f.getRecomends);
app.post('/recomends', f.requireRole([Admin, User]), f.newRecomend);
app.post('/approve', f.requireRole([Admin]), f.approveRecomend);
app.post('/deny', f.requireRole([Admin]), f.denyRecomend);

app.get('/daily/:date', f.requireRole([Admin, User]), f.getDailyReport);
app.post('/daily', f.requireRole([Admin, User]), f.getDailyReport);
app.put('/daily', f.requireRole([Admin, User]), f.updateDailyReport);

app.get('/getProhibitions', f.requireRole([Admin, User]), f.isOnlyDaily);

app.get('/scores/:date', f.requireRole([Admin, User]), f.getScores);
app.put('/scores', f.requireRole([Admin, User]), f.putScores);

app.get('/colelList', f.requireRole([Admin]), f.getColelList);
app.put('/updColel', f.requireRole([Admin]), f.updColelId);

app.get('/prevDates', f.requireRole([Admin, User]), f.getPreviousDate);

app.get('/definitions', f.requireRole([Admin]), f.getDefinitions);
app.put('/definitions', f.requireRole([Admin]), f.updDefinitions);

app.get('/reports', f.requireRole([Admin]), f.getReports);
app.put('/newReport', f.requireRole([Admin]), f.newReport);

app.post('/updateAll', f.requireRole([Admin]), f.updateAll);

var port = process.env.PORT || 8080;

app.listen(port, function () {
    console.log('The Five Center is running on http://localhost:' + port);
});