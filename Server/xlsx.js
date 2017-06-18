var Excel = require('exceljs'),
    sql = require('./mysql.js'),
    style = require('./xslx-styles');

function makeReport(path, data, res) {

    var queries = {
        students: `SELECT supported_id, last_name, first_name, id, phone, street, house, city, bank, branch, account, account_name
                        FROM tb_student
                        WHERE colel_id = ${data.colel_id}`,
        log: undefined //sql.ia("tb_report_history", [data])
    };
    sql.mq(queries, function (data) {
        if (data.error) {
            res.send({
                error: 'אין אפשרות לעדכן את ההגדרות'
            })
        } else {
            var workbook = new Excel.Workbook();
            workbook.creator = 'כולל חמש';
            workbook.created = new Date();

            var worksheet = workbook.addWorksheet('פרטי האברכים', {
                properties: {
                    tabColor: { argb: '8A2BE2' }
                }
                // ,
                // views: [{ rightToLeft: 1 }],
            });

            worksheet.columns = [
                { header: 'מספר\r\nנתמך', key: 'supported_id', width: 6.89, style: style(['multiCentered', 'regularBorder']) },
                { header: 'שם משפחה', key: 'last_name', width: 11.33, style: style(['header']) },
                { header: 'שם פרטי', key: 'first_name', width: 11.33, style: style(['regularBorder']) },
                { header: 'מספר זהות', key: 'id', width: 11.22, style: style(['regularBorder']) },
                { header: 'טלפון', key: 'phone', width: 12.56, style: style(['regularBorder']) },
                { header: 'רחוב', key: 'street', width: 18.67, style: style(['regularBorder']) },
                { header: 'בית', key: 'house', width: 6.33, style: style(['regularBorder']) },
                { header: 'עיר', key: 'city', width: 18.89, style: style(['regularBorder']) },
                { header: 'מס בנק', key: 'bank', width: 7.11, style: style(['regularBorder']) },
                { header: 'סניף', key: 'branch', width: 8.56, style: style(['regularBorder']) },
                { header: 'מס חשבון', key: 'account', width: 14.89, style: style(['regularBorder']) },
                { header: 'שם בעל החשבון', key: 'account_name', width: 14.89, style: style(['regularBorder']) }
            ];

            // worksheet.addRows(data.results[0]);
            worksheet.addRows(data.results);

            worksheet.eachRow(function (row, i) {
                if (i == 1) {
                    row.height = 40;
                } else {
                    row.height = 30;
                }
            });

            workbook.xlsx.writeFile(`./dist${path}`).then(function () {
                res.send({
                    success: 'הקובץ נשמר בהצלחה!',
                    url: path
                });
            }).catch(function (err) { console.log(err) });
        }
    });
}

module.exports = {
    makeReport: makeReport
};