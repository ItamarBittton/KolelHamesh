var mysql = require('mysql'),
    pool = mysql.createPool({
        host: process.env.host,
        user: process.env.user,
        password: process.env.password,
        database: process.env.database
    });

var tableStruct = {
    tb_student: [
        'id',
        'supported_id',
        'first_name',
        'last_name',
        'phone',
        'street',
        'house',
        'city',
        'bank',
        'branch',
        'account',
        'account_name',
        'colel_id'
    ],
    tb_recomend: [
        'user_update',
        'type',
        'requested_date',
        'approved_date',
        'status',
        'table_name',
        'data',
    ]
}

function validate(string) {
    var r = `/('(''|[^'])*')|(;)|(\b(ALTER|CREATE|DELETE|DROP|EXEC(UTE){0,1}|INSERT( +INTO){0,1}|MERGE|SELECT|UPDATE|UNION( +ALL){0,1})\b/g)`;
    return string ? string.toString().replace(r, "") : '';
}

function query(string, callback) {
    pool.getConnection(function (err, connection) {
        if (err) throw err;

        connection.query(string, function (error, results, fields) {
            connection.release();

            if (error) throw error;

            callback({
                results,
                fields
            });
        });
    });
}

// Code Example.
// var i = `${sql.i('tb_student', req.body.data)}`
// sql.q(`${sql.v(i)}`, function (data) {
//     console.log(data);
// })

function insert(table, object) {
    var request = `INSERT INTO ${table} (${tableStruct[table].join(', ')}) VALUES ('${Object.values(object).join("', '")}');`
    console.log(request);
    return request;
}

module.exports = {
    v: validate,
    q: query,
    i: insert
};