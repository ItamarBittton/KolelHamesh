var sql = require('./mysql');

function getUser(credentials) {
    return `SELECT      t1.*, t2.note, t2.is_prev_month, t2.is_only_daily, t2.group_type
            FROM        tb_user t1 left outer join tb_colel t2 on (t1.colel_id = t2.id)
            WHERE       t1.token = ${sql.v(credentials.token || '0')} OR
                        (t1.user_name = ${sql.v(credentials.username || '0')} AND
                         t1.password = ${sql.v(credentials.password || '0')})`
};

function getStudents(req) {
    return `SELECT      t1.*, t2.name
            FROM        tb_student t1 left outer join tb_colel t2 on (t1.colel_id = t2.id)
            WHERE       t1.colel_id = ${sql.v(req.currentUser.colel_id)}
            ORDER BY    t1.last_name, t1.first_name;`;
};

function getColelSettings(req) {
    return `SELECT      t2.id, t2.name, t2.manager_name, t2.phone, t2.mail_address, t2.address, t2.schedule
            FROM        tb_user t1 join tb_colel t2 on (t1.colel_id = t2.id) 
            WHERE       t1.id = ${req.currentUser.id}`;
};

function getRecommends(req) {
    return `SELECT      t1.id as "recomend_id",
                        t3.id as "colel_id",
                        t3.name,
                        t1.type,
                        case t1.table_name 
                            when 'tb_colel' then "כולל" 
                            else "אברך" 
                            end as "req_type", 
                        t1.requested_date,
                        case t1.status
                            when 1 then "אושר"
                            when 0 then "נדחה" 
                            else "ממתין..."
                            end as "status",
                        t1.approved_date,
                        t1.data
            FROM        tb_recomend t1 
                LEFT OUTER JOIN tb_colel t3 ON (t1.colel_update = t3.id)
            WHERE       '${req.currentUser.permission}' = 'Admin' || ${req.currentUser.colel_id} = t3.id
            ORDER BY    t1.status, t1.requested_date, t1.approved_date desc`;
};

function getRecomend(recomend_id) {
    return `SELECT      * 
            FROM        tb_recomend t1
            WHERE       t1.id = ${recomend_id}`;
};

function updateRecomend(recomend_id, status) {
    return `UPDATE tb_recomend 
            SET approved_date = '${new Date().toISOString().slice(0, 19).replace("T", " ")}', 
                status = ${status}
            WHERE id = ${recomend_id}`
};

function approveDelete(recomend) {
    return `DELETE 
            FROM ${recomend.table_name} 
            WHERE id = ${recomend.data.newObj.id} AND
                  colel_id = ${recomend.data.newObj.colel_id}`
};

function getDailyReport(req) {
    return `SELECT t1.id, t1.first_name, t1.last_name, t1.phone, t2.presence
            FROM tb_student t1 
            LEFT OUTER JOIN tb_daily t2 ON (t2.student_id = t1.id AND t2.date = ${sql.v(req.params.date)}) 
            WHERE t1.colel_id = ${req.currentUser.colel_id}
            ORDER BY t1.last_name, t1.first_name`;
};

function getDailyOptions(req) {
    return `SELECT t1.id, t1.key, t1.name, t1.value
            FROM tbk_presence_status t1
            WHERE t1.group_type = ${req.currentUser.group_type} 
            ORDER BY t1.id`
};

function getDailyCount(req, month) {
    return `SELECT DAYOFMONTH(date) AS monthday, COUNT(*) AS count
            FROM tb_daily t1
            LEFT OUTER JOIN tb_student t2 ON (t1.student_id = t2.id)
            WHERE MONTH(date) = ${month} AND t2.colel_id = ${req.currentUser.colel_id}
            GROUP BY MONTH(date), DAYOFMONTH(date)`
};

function getTempStudents(req) {
    return `SELECT t1.amount
            FROM tb_onetime_student t1
            WHERE t1.colel_id = ${req.currentUser.colel_id} AND t1.date = ${sql.v(req.params.date)}`
};

function getColelPermissions(req) {
    return `SELECT t1.is_only_daily, t1.is_one_time_allow
            FROM tb_colel t1 
            WHERE t1.id = ${sql.v(req.currentUser.colel_id)}`
};

function getScores(req) {
    var year = parseInt(sql.v(parseInt(req.params.date.split('-')[0])));
    var month = parseInt(sql.v(parseInt(req.params.date.split('-')[1])));

    return `SELECT t1.id, t1.last_name, t1.first_name, t2.oral_score AS 'oral', t2.write_score AS 'write', t4.comment AS 'comment'
            FROM tb_student t1
            LEFT OUTER JOIN tb_score t2 ON (t1.id = t2.student_id AND t2.year = ${year} AND t2.month = ${month})
            LEFT OUTER JOIN tb_comment t4 ON (t1.id = t4.student_id AND t4.year = ${year} AND t4.month = ${month})
            WHERE t1.colel_id = ${req.currentUser.colel_id}
            ORDER BY t1.last_name, t1.first_name`;
};

function getTestTypes() {
    return `SELECT t1.id, t1.name, t1.min_score 
            FROM tbk_test_types t1`;
};

function getColels() {
    return `SELECT t1.id, t1.name FROM tb_colel t1`;
};

function updateUser(req) {
    return `UPDATE tb_user 
            SET colel_id = ${sql.v(req.body.currColel)} 
            WHERE id = ${req.currentUser.id}`;
};

function getColel() {
    return `SELECT t1.id,
                   t1.name,
                   t1.address, 
                   t1.mail_address, 
                   t1.phone, 
                   t1.manager_name, 
                   t1.is_only_daily, 
                   t1.is_one_time_allow, 
                   t1.is_prev_month, 
                   t1.schedule, 
                   t1.note, 
                   t2.password
            FROM tb_colel t1
            LEFT OUTER JOIN tb_user t2 ON (t1.id = t2.colel_id AND NOT t2.permission = 'Admin')
            ORDER BY t1.id, t1.name`;
};

function updateColel(reqColel, password) {
    return `UPDATE tb_user 
            SET password = ${sql.v(password)},
                user_name = ${sql.v(reqColel.name)}
            WHERE colel_id = ${sql.v(reqColel.id)} AND NOT permission = 'Admin'`;
};

function deleteColel(req) {
    return `UPDATE tb_user 
            SET colel_id = ${sql.v(req.body.currColel)}
            WHERE id = ${req.currentUser.id}`;
};

function prevMonths(req) {
    return `SELECT year(t1.date) AS year, month(t1.date) AS month 
            FROM tb_daily t1 
            WHERE t1.student_id IN (SELECT t2.id 
                                    FROM tb_student t2 
                                    WHERE t2.colel_id = ${req.currentUser.colel_id})
            GROUP BY year(t1.date), month(t1.date)`;
};

function prevMonth(req) {
    return `select year(t1.date) AS year, month(t1.date) AS month 
            FROM tb_daily t1
            WHERE TIMESTAMPDIFF(month,t1.date,CURDATE()) BETWEEN 0 AND 1 AND
                  TIMESTAMPDIFF(day,t1.date,CURDATE()) <= 32 AND
                  t1.student_id IN (SELECT t2.id 
                                    FROM tb_student t2 
                                    WHERE t2.colel_id = ${req.currentUser.colel_id})
            GROUP BY year(t1.date), month(t1.date)`;
};

function getDefinitions() {
    return `SELECT t1.group_type, t1.late, t1.per_late, t1.min_presence, t1.missed, t1.monthly_payment
            FROM tbk_settings t1`;
};

function getFullTestTypes() {
    return `SELECT t1.id, t1.name, t1.min_score, t1.value
            FROM tbk_test_types t1`;
};

function getReports() {
    return `SELECT t2.name as colel, t3.name as report, t1.date_created, t1.url
            FROM tb_report_history t1
	        LEFT OUTER JOIN tb_colel t2 ON (t1.colel_id = t2.id)
            JOIN tbk_report t3 ON (t1.report_id = t3.id)
            ORDER BY t1.date_created DESC`;
};

function getReportTypes() {
    return `SELECT id, name
            FROM tbk_report`;
};

function getReport(req) {
    return `SELECT url, date_created
            FROM tb_report_history
            WHERE report_id = ${sql.v(req.body.type || 0)}`
};

function getStats(req) {
    var colelId = (req.currentUser.permission !== 'Admin') ? `colel_id = ${req.currentUser.colel_id}` : "true";
    var t2colelID = (req.currentUser.permission !== 'Admin') ? `t2.colel_id = ${req.currentUser.colel_id}` : "true";
    return `SELECT (SELECT SUM(amount) FROM tb_onetime_student WHERE ${colelId}) AS 'extraStudents',
                   (SELECT COUNT(*) FROM tb_student WHERE ${colelId}) AS 'students',
                   (SELECT COUNT(*) FROM tb_score t1
		                       LEFT OUTER JOIN tb_student t2 ON (t1.student_id = t2.id)
                    WHERE t1.oral_score = 100 AND
                          t1.month = month(CURRENT_DATE) AND
                          ${t2colelID}) AS 'testsMonth',
                   (SELECT COUNT(*) FROM tb_score t1
		                       LEFT OUTER JOIN tb_student t2 ON (t1.student_id = t2.id)
                    WHERE t1.oral_score = 100 AND
                          ${t2colelID}) AS 'testsTotal',
                   (SELECT (COUNT(*) * 90 - SUM(t1.presence)) / 60
                    FROM (SELECT t1.student_id, t1.date, t1.presence, t2.colel_id
                          FROM tb_daily t1
		                       LEFT OUTER JOIN tb_student t2 ON (t1.student_id = t2.id)
                    WHERE t1.presence >= 0 AND 
                          year(t1.date) = year(CURRENT_DATE) AND
                          month(t1.date) = month(CURRENT_DATE) AND
                          ${t2colelID}) t1) AS 'hoursMonth',
                   (SELECT ((COUNT(*) + extraStudents) * 90 - SUM(t1.presence)) / 60
                    FROM (SELECT t1.student_id, t1.date, t1.presence, t2.colel_id
                          FROM tb_daily t1
		                       LEFT OUTER JOIN tb_student t2 ON (t1.student_id = t2.id)
                    WHERE t1.presence >= 0 AND
                          ${t2colelID}) t1) AS 'hoursTotal'`
};

function getExcel(data) {
    return [{
        "log":              `SELECT NULL LIMIT 0`,//sql.ia("tb_report_history", [data]),
        "דוח נוכחות":      ``,
        "פרטי האברכים":    `SELECT supported_id AS 'מספר נתמך',
                                    last_name AS 'שם משפחה',
                                    first_name AS 'שם פרטי',
                                    id AS 'תעודת זהות',
                                    phone AS 'טלפון',
                                    street AS 'רחוב',
                                    house AS 'בית',
                                    city AS 'עיר',
                                    bank AS 'מס בנק',
                                    branch AS 'סניף',
                                    account AS 'מס חשבון',
                                    account_nam AS 'שם בעל החשבון'
                             FROM tb_student
                             WHERE colel_id = ${data.colel_id}`,
        "סיכום מלגות":     ``,
        "milgot":           ``,
        "דוח העברה":       ``
    }, {
        "log":              `SELECT NULL LIMIT 0`,//sql.ia("tb_report_history", [data]),
        "פרטי האברכים":    `SELECT supported_id AS 'מספר נתמך',
                                    last_name AS 'שם משפחה',
                                    first_name AS 'שם פרטי',
                                    id AS 'תעודת זהות',
                                    phone AS 'טלפון',
                                    street AS 'רחוב',
                                    house AS 'בית',
                                    city AS 'עיר',
                                    bank AS 'מס בנק',
                                    branch AS 'סניף',
                                    account AS 'מס חשבון',
                                    account_nam AS 'שם בעל החשבון'
                             FROM tb_student`
    }, {
        "log":              `SELECT NULL LIMIT 0`,//sql.ia("tb_report_history", [data]),
        "milgot":           `SELECT supported_id AS 'מספר נתמך',
                                    account AS 'סכום',
                                    last_name AS 'שם להצגה',
                                    CURDATE() AS 'תאריך',
                                    colel_id AS 'חלוקת הדפסה'
                             FROM   tb_student
                             ORDER BY colel_id`
    }, {
        "log":              `SELECT NULL LIMIT 0`,//sql.ia("tb_report_history", [data]),
        "דוח העברה":       `SELECT NULL LIMIT 0`
    }][data.report_id - 1];
};

module.exports = {
    getUser:            getUser,
    getStudents:        getStudents,
    getColelSettings:   getColelSettings,
    getRecommends:      getRecommends,
    getRecomend:        getRecomend,
    updateRecomend:     updateRecomend,
    approveDelete:      approveDelete,
    getDailyReport:     getDailyReport,
    getDailyOptions:    getDailyOptions,
    getDailyCount:      getDailyCount,
    getTempStudents:    getTempStudents,
    getColelPermissions: getColelPermissions,
    getScores:          getScores,
    getTestTypes:       getTestTypes,
    getColels:          getColels,
    updateUser:         updateUser,
    getColel:           getColel,
    updateColel:        updateColel,
    deleteColel:        deleteColel,
    prevMonths:         prevMonths,
    prevMonth:          prevMonth,
    getDefinitions:     getDefinitions,
    getFullTestTypes:   getFullTestTypes,
    getReports:         getReports,
    getReportTypes:     getReportTypes,
    getReport:          getReport,
    getStats:           getStats,
    getExcel:           getExcel,
}