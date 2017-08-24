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
            GROUP BY year(t1.date), month(t1.date)`;
};

function prevMonth(req) {
    return `select year(t1.date) AS year, month(t1.date) AS month 
            FROM tb_daily t1
            WHERE TIMESTAMPDIFF(month,t1.date,CURDATE()) BETWEEN 0 AND 1 AND
                  TIMESTAMPDIFF(day,t1.date,CURDATE()) <= 60 AND
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
    data.date_created = data.date_created.split('-'),
        year = parseInt(data.date_created[1]),
        month = parseInt(data.date_created[0]);

    return [{
        "log": `SELECT NULL LIMIT 0`,//sql.ia("tb_report_history", [data]),
        "דוח נוכחות": `SELECT t1.date,
                               t3.id AS 'id',
                               t2.key AS 'presence',
                               t3.last_name AS 'last_name', 
                               t3.first_name AS 'first_name', 
                               t3.phone AS 'phone'
                        FROM tb_daily t1
                        LEFT OUTER JOIN tbk_presence_status t2 ON (t1.presence = t2.value AND group_type = 1)
                        LEFT OUTER JOIN tb_student t3 ON (t1.student_id = t3.id)
                        WHERE MONTH(t1.date) = ${month} AND YEAR(t1.date) = ${year} AND t3.colel_id = ${data.colel_id}
                        ORDER BY t1.date, t3.last_name, t3.first_name`,
        "פרטי האברכים": `SELECT t1.supported_id AS 'מספר נתמך',
                                    t1.last_name AS 'שם משפחה',
                                    t1.first_name AS 'שם פרטי',
                                    t1.id AS 'תעודת זהות',
                                    t1.phone AS 'טלפון',
                                    t1.street AS 'רחוב',
                                    t1.house AS 'בית',
                                    t1.city AS 'עיר',
                                    t1.bank AS 'מס בנק',
                                    t1.branch AS 'סניף',
                                    t1.account AS 'מס חשבון',
                                    t1.account_name AS 'שם בעל החשבון'
                             FROM tb_student t1
                             WHERE t1.colel_id = ${data.colel_id}
                             order by t1.last_name`,
        "סיכום מלגות": `SELECT t1.name AS 'שם כולל',
                                t1.last_name AS 'שם משפחה',
                                t1.first_name AS 'שם פרטי',
                                t1.id AS 'תעודת זהות',
                                t1.phone AS 'מספר פלאפון',
                                t1.street AS 'כתובת',
                                t1.late AS 'איחורים בדקות',
                                t1.missed AS 'חיסורים בימים',
                                t1.appMissed AS 'חיסורים באישור',
                                t1.present AS 'ימי נוכחות',
                                t1.comment AS 'חריגים',
                                t1.monthlyPayment AS 'לתשלום נוכחות',
                                CASE WHEN t1.monthlyPayment = 0 THEN 0 ELSE t1.writeTest END 'מבחן בכתב',
                                CASE WHEN t1.monthlyPayment = 0 THEN 0 ELSE t1.oralTest END 'מבחן בע"פ',
                                CASE WHEN t1.monthlyPayment = 0 THEN 0 ELSE (t1.monthlyPayment + t1.writeTest + t1.oralTest) END 'סה"כ לתשלום'
                            FROM ${bigString(month, year, data.colel_id)} t1`,

        "milgot": `SELECT t1.supported_id AS 'מספר נתמך',
                                    case when t1.monthlyPayment = 0 then 0 else (t1.monthlyPayment + t1.writeTest + t1.oralTest) end 'סכום',
                                    concat( t1.last_name, ' ', t1.first_name) AS 'שם להצגה',
                                    '${month + '-' + year}' AS 'תאריך',
                                    t1.name AS 'חלוקת הדפסה'
                             FROM ${bigString(month, year, data.colel_id)} t1`,
                             

        "דוח העברה": `select t1.name as 'שם כולל',
                                t1.last_name as 'שם משפחה',
                                t1.first_name as 'שם פרטי',
                                t1.id as 'תעודת זהות',
                                t1.phone as 'מספר פלאפון',
                                t1.city AS 'עיר',
                                t1.street as 'כתובת',
                                t1.house as 'בית',
                                t1.monthlyPayment as 'לתשלום נוכחות',
                                case when t1.monthlyPayment = 0 then 0 else t1.writeTest end 'מבחן בכתב',
                                case when t1.monthlyPayment = 0 then 0 else t1.oralTest end 'מבחן בע"פ',
                                case when t1.monthlyPayment = 0 then 0 else (t1.monthlyPayment + t1.writeTest + t1.oralTest) end 'סה"כ לתשלום'
                            from ${bigString(month, year, data.colel_id)} t1`,
                            "סיכומים והגדרות": ''
    }, {
        "log": `SELECT NULL LIMIT 0`,//sql.ia("tb_report_history", [data]),
        "פרטי האברכים": `SELECT t2.name as "שם כולל",
                                    t1.supported_id AS 'מספר נתמך',
                                    t1.last_name AS 'שם משפחה',
                                    t1.first_name AS 'שם פרטי',
                                    t1.id AS 'תעודת זהות',
                                    t1.phone AS 'טלפון',
                                    t1.street AS 'רחוב',
                                    t1.house AS 'בית',
                                    t1.city AS 'עיר',
                                    t1.bank AS 'מס בנק',
                                    t1.branch AS 'סניף',
                                    t1.account AS 'מס חשבון',
                                    t1.account_name AS 'שם בעל החשבון'
                             FROM tb_student t1 left outer join tb_colel t2 on (t1.colel_id = t2.id)
                             order by t1.colel_id`
    }, {
        "log": `SELECT NULL LIMIT 0`,//sql.ia("tb_report_history", [data]),
        "milgot": `SELECT t1.supported_id AS 'מספר נתמך',
                                    case when t1.monthlyPayment = 0 then 0 else (t1.monthlyPayment + t1.writeTest + t1.oralTest) end 'סכום',
                                    concat( t1.last_name, ' ', t1.first_name) AS 'שם להצגה',
                                    '${month + '-' + year}' AS 'תאריך',
                                    t1.name AS 'חלוקת הדפסה'
                             FROM   ${bigString(month, year, '0 or 1 = 1')} t1`
    }, {
        "log": `SELECT NULL LIMIT 0`,//sql.ia("tb_report_history", [data]),
        "דוח העברה": `select t1.name as 'שם כולל',
                                t1.last_name as 'שם משפחה',
                                t1.first_name as 'שם פרטי',
                                t1.id as 'תעודת זהות',
                                t1.phone as 'מספר פלאפון',
                                t1.street as 'כתובת',
                                t1.house as 'בית',
                                t1.city AS 'עיר',
                                t1.monthlyPayment as 'לתשלום נוכחות',
                                case when t1.monthlyPayment = 0 then 0 else t1.writeTest end 'מבחן בכתב',
                                case when t1.monthlyPayment = 0 then 0 else t1.oralTest end 'מבחן בע"פ',
                                case when t1.monthlyPayment = 0 then 0 else (t1.monthlyPayment + t1.writeTest + t1.oralTest) end 'סה"כ לתשלום'
                            from ${bigString(month, year, '0 or 1 = 1')} t1`
        ,
        "סיכום מלגות ופרטי כוללים": `select t1.name as "שם הכולל",
sum(t1.monthlyPayment) as "סך הכול מלגות",
	   t1.colel_address as "כתובת הכולל",
	   t1.manager_name as "שם אחראי",
	   t1.manager_phone as "טלפון"
        from ${bigString(month, year, ' 0 or 1 = 1')} t1
        group by t1.name, t1.colel_address, t1.manager_name, t1.manager_phone`
    }][data.report_id - 1];
};

function bigString(month, year, colel_id) {
    return `(select t7.id as "colel_id",
					t7.name,
					t7.manager_name,
					t7.phone as "manager_phone",
					t7.address as "colel_address",
                    t1.supported_id,
                    t1.last_name,
                    t1.first_name,
                    t1.id,
                    t1.phone,
                    t1.city,
                    t1.street,
                    t1.house,
                    t3.late,
                    t4.missed,
                    t5.appMissed,
                    t2.present,
                    t9.comment,
                    case 
                    when IFNULL(t2.present,0) < t8.min_presence then 0 
                    else (t8.monthly_payment - (IFNULL(t4.missed, 0) * t8.missed) - (IFNULL(t3.late,0)/t8.per_late * t8.late)) end 'monthlyPayment',
                    case when t6.write_score < t8.min_score_write_test or t6.write_score is null
                    then 0 
                    else t8.payment_write_test end 'writeTest',
                    case when t6.oral_score < t8.min_score_oral_test or t6.oral_score is null
                    then 0 
                    else t8.payment_oral_test end 'oralTest'

                from tb_student t1 
                                    left outer join (select t2.student_id, count(t2.student_id) as 'present'
                                        from tb_daily t2
                                        where t2.presence >= 0 and month(t2.date) = ${month} 
                                        group by t2.student_id) t2 on (t1.id = t2.student_id)

                                    left outer join (select t2.student_id, sum(t2.presence) as 'late'
                                        from tb_daily t2
                                        where t2.presence > 0 and month(t2.date) = ${month}
                                        group by t2.student_id) t3 on (t1.id = t3.student_id)

                                    left outer join (select t2.student_id, count(t2.student_id) as 'missed'
                                        from tb_daily t2
                                        where t2.presence = -1 and month(t2.date) = ${month}
                                        group by t2.student_id) t4 on (t1.id = t4.student_id)

                                    left outer join (select t2.student_id, count(t2.student_id) as 'appMissed'
                                        from tb_daily t2
                                        where t2.presence = -2 and month(t2.date) = ${month}
                                        group by t2.student_id) t5 on (t1.id = t5.student_id)

                                    left outer join tb_score t6
                                        on (t6.year = ${year} and 
                                            t6.month = ${month} and
                                            t1.id = t6.student_id)

                                    left outer join tb_colel t7 on (t1.colel_id = t7.id)

                                    left outer join tbk_settings t8 on (t7.group_type = t8.group_type)
                                    
                                    left outer join tb_comment t9 
                                        on (t9.year = ${year} and
                                            t9.month = ${month} and
                                            t1.id = t9.student_id)
                where t1.colel_id = ${colel_id}
                order by t7.name, t1.last_name
                )`
}

module.exports = {
    getUser: getUser,
    getStudents: getStudents,
    getColelSettings: getColelSettings,
    getRecommends: getRecommends,
    getRecomend: getRecomend,
    updateRecomend: updateRecomend,
    approveDelete: approveDelete,
    getDailyReport: getDailyReport,
    getDailyOptions: getDailyOptions,
    getDailyCount: getDailyCount,
    getTempStudents: getTempStudents,
    getColelPermissions: getColelPermissions,
    getScores: getScores,
    getTestTypes: getTestTypes,
    getColels: getColels,
    updateUser: updateUser,
    getColel: getColel,
    updateColel: updateColel,
    deleteColel: deleteColel,
    prevMonths: prevMonths,
    prevMonth: prevMonth,
    getDefinitions: getDefinitions,
    getFullTestTypes: getFullTestTypes,
    getReports: getReports,
    getReportTypes: getReportTypes,
    getReport: getReport,
    getStats: getStats,
    getExcel: getExcel,
}