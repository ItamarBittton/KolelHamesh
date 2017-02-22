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
    ],
    tb_colel: [
        'id',
        'name',
        'address',
        'mail_address',
        'phone',
        'manager_name',
        'is_only_daily',
        'is_prev_month',
        'schedule',
        'note'
    ]
}

function validate(string) {
    var r = `/('(''|[^'])*')|(;)|(\b(ALTER|CREATE|DELETE|DROP|EXEC(UTE){0,1}|INSERT( +INTO){0,1}|MERGE|SELECT|UPDATE|UNION( +ALL){0,1})\b/g)`;
    return string ? string.toString().replace(r, "") : '';
}

function query(string, callback) {
    pool.getConnection(function (err, connection) {
        connection.on('error', function (err) {
            console.log(err.code); // 'ER_BAD_DB_ERROR' 
        });

        connection.query(string, function (error, results, fields) {
            connection.release();

            if (error) console.error(error);

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

function insertArray(table, array, duplicate) {
    var keys = Object.keys(array[0]).map(x => validate(x));
    array.map(x => Object.values(x).map(y => validate(y)));

    var request = [
        'INSERT INTO',
        table,
        '(',
        keys.join(', '),
        ') VALUES ',
        array.map(val => `('` + Object.values(val).join("', '") + "') ")
    ];

    if (duplicate) {
        request.push('ON DUPLICATE KEY UPDATE',
            array.map((x, i) => keys[i] + '=VALUES(' + keys[i] + ')'))
    }

    return request.join(' ');
}

module.exports = {
    v: validate,
    q: query,
    i: insert,
    ia: insertArray
};