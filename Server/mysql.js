var mysql = require('mysql'),
    pool = mysql.createPool({
        host: '***',
        user: '***',
        password: '***',
        database: '***'
    });

function validate(string) {
    var r = `/('(''|[^'])*')|(;)|(\b(ALTER|CREATE|DELETE|DROP|EXEC(UTE){0,1}|INSERT( +INTO){0,1}|MERGE|SELECT|UPDATE|UNION( +ALL){0,1})\b/g)`;
    return string.toString().replace(r, "");
}

function query(string, callback) {
    pool.getConnection(function (err, connection) {
        connection.query(string, function (error, results, fields) { 
            connection.release();

            if (error) throw error;

            callback({ results, fields });
        });
    });
}

module.exports = {
    v: validate,
    q: query
};