var Excel = require('exceljs'),
    sql = require('./mysql.js'),
    queries = require('./queries');

function makeReport(path, userData, res) {
    var query = queries.getExcel(userData);
    sql.mq(query, function (data) {
        if (data.error) {
            res.send({
                error: 'ארעה שגיאה במהלך הנפקת הדוח'
            })
        } else {
            var workbook = new Excel.Workbook();
            workbook.creator = 'מערכת ניהול - כולל חמש';
            workbook.created = new Date();


            // Check if its דוח פרטי אברכים or דוח העברה
            if (userData.report_id === 2 || userData.report_id === 4) {

                // Define variables
                var tempResults = data.results;
                var tempFields = data.fields;
                var currentColel = '';
                var firstResult = tempResults[1];
                var firstField = tempFields[1];
                var tempArry = [];
                var fieldsTempArray = [];
                var finalResults = [];
                var tempQuery = Object.keys(query)[1];

                // Get the first colel name
                currentColel = firstResult[0]['שם כולל'];

                // Check if exist
                if (currentColel) {

                    // Push it to the first temp array
                    tempArry.push(firstResult[0]);
                    delete query[tempQuery];
                    query[currentColel] = ' ';

                    // Loop the whole 'רשימת האברכים באשר היא'
                    for (var i = 1; i < firstResult.length; i++) {

                        // Check if belong to the prev colel
                        if (firstResult[i]['שם כולל'] == currentColel) {
                            tempArry.push(firstResult[i]);
                        } else {

                            // If not, push to the final result to prev אברכים
                            // and reset the array
                            finalResults.push(tempArry);
                            tempArry = [];
                            currentColel = firstResult[i]['שם כולל'];
                            query[currentColel] = ' ';
                            tempArry.push(firstResult[i]);
                            fieldsTempArray.push(firstField)
                        }

                    }

                    // Collect the rest of the results
                    for (var i = 2; i < tempResults.length; i++) {
                        finalResults.push(tempResults[i]);
                        fieldsTempArray.push(tempFields[i]);
                    }

                    // Set the new results
                    data.results = finalResults;
                    data.fields = fieldsTempArray;
                }
            }

            // All Worksheets            
            data.results.forEach(function (result, sheetIndex) {
                // Hide "empty" keys, (Hack for if there is only one sheet).
                if (Object.keys(query)[sheetIndex] === "log") return;

                var worksheet = workbook.addWorksheet(Object.keys(query)[sheetIndex]);

                // All Columns.
                worksheet.columns = data.fields[sheetIndex].map(function (field, columnIndex) {
                    return {
                        header: field.name,
                        key: field.name,
                        width: 14,
                        style: { wrapText: true, vertical: 'middle', horizontal: 'center' }
                    }
                });

                // All Rows.                
                worksheet.addRows(data.results[sheetIndex]);

                var prevRow = undefined,
                    range = undefined;
                worksheet.eachRow(function (row, rowNumber) {
                    if (rowNumber == 1) {
                        row.eachCell(function (cell, colNumber) {
                            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC0C0C0' } };
                        });
                        row.height = 40;
                        row.font = { bold: true };
                    } else {
                        row.height = 30;
                        row.eachCell(function (cell, colNumber) {
                            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                        });

                        // Merge identical cells in izy report.
                        if (userData.report_id === 3) {
                            if (!range) {
                                range = ['E' + rowNumber];
                            }
                            if (prevRow) {
                                if (prevRow.getCell(5).value === row.getCell(5).value) {
                                    range[1] = 'E' + rowNumber;
                                } else {
                                    if (range[1]) {
                                        worksheet.mergeCells(range.join(':'));
                                    }

                                    range = ['E' + rowNumber];
                                }
                            }

                            prevRow = row;
                        }
                    }
                });
            });

            workbook.xlsx.writeFile(`./dist${path}`).then(function () {
                res.send({
                    success: 'הדוח הונפק בהצלחה!',
                    url: path
                });
            }).catch(function (err) {
                res.send({ error: 'ארעה שגיאה במהלך הנפקת הדוח' })
            });
        }
    });
}

module.exports = {
    makeReport: makeReport
};