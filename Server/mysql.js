var mysql = require('mysql'),
    pool = mysql.createPool({
        host: process.env.host,
        user: process.env.user,
        password: process.env.password,
        database: process.env.database,
        multipleStatements: true
    }
    );

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
    // var r = `/('(''|[^'])*')|(;)|(\b(ALTER|CREATE|DELETE|DROP|EXEC(UTE){0,1}|INSERT( +INTO){0,1}|MERGE|SELECT|UPDATE|UNION( +ALL){0,1})\b/g)`;
    // return string ? string.toString().replace(r, "") : '';
    return pool.escape(string) || '';
}

function multiQuery(object, callback) {
    pool.getConnection(function (err, connection) {
        if (err) console.error(err);

        var string = Object.keys(object).map((k) => object[k]).join(';')
        connection.query(string, function (error, results = [], fields = []) {
            connection.release();
            if (error) throw error;

            callback({ error, results, fields });
        });
    });
}

function query(string, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            console.error('Error by the connection: ')
            console.log(err);
            console.log(process.env)
            throw err;
        } else {
            connection.query(string, function (error, results = [], fields = []) {
                connection.release();

                if (error) console.error(error);
                callback({
                    error,
                    results,
                    fields
                });
            });
        }
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
    // Validate Keys and Values.
    var keys = validate(Object.keys(array[0])),
        splitKeys = keys.split(/\s*'| |,\s*/).filter(Boolean),
        values = array.map(value => validate(Object.keys(value).map(v => Array.isArray(value[v]) ? JSON.stringify(value[v]) : value[v])));
    //array.map(value => validate(Object.keys(value).map(v => value[v])));

    // Build request string.
    var request = [
        'INSERT INTO',
        table,
        '(',
        splitKeys,
        ') VALUES ',
        values.map(value => '(' + value + ')')
        // array.map(val => `( ${Object.values(val).map(v => v ? "'" + v + "'" : 'null').join(", ")})`)
    ];

    // Upsert.
    if (duplicate) {
        request.push('ON DUPLICATE KEY UPDATE',
            splitKeys.map((x, i) => x + '=VALUES(' + x + ')'))
    }

    return request.join(' ');
}

module.exports = {
    v: validate,
    mq: multiQuery,
    q: query,
    i: insert,
    ia: insertArray
};