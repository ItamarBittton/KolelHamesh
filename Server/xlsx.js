var Excel = require('exceljs'),
    sql = require('./mysql.js'),
    queries = require('./queries');

function placeSomthingOnTheSheet(workSheet, keyToSum, letterOfCellToPlace, numberOfCellToPlace, val) {


    workSheet.getCell(letterOfCellToPlace + numberOfCellToPlace).value = 'סה"כ ' + keyToSum;
    workSheet.getCell(String.fromCharCode(letterOfCellToPlace.charCodeAt(0) + 1) + numberOfCellToPlace).value = val;
}

function createMonthTable(result, worksheet) {
    var table = [],
        fields = [
            { name: "שם משפחה", width: 14 },
            { name: "שם פרטי", width: 14 },
            { name: "מס זהות", width: 14 },
            { name: "טלפון", width: 14 },
        ];

    result.forEach(function (r, i) {
        var currDate = r.date.getDate();
        // Add date to fields.
        if (!fields.filter(x => x.name === currDate)[0]) {
            fields.push({ name: currDate, width: 4 });
        }

        // Check if current student exists.
        var curr = table.filter(x => x["מס זהות"] === r.id)[0];

        if (curr) {
            curr[currDate] = r.presence;
        } else {
            table.push({
                "שם משפחה": r.last_name,
                "שם פרטי": r.first_name,
                "מס זהות": r.id,
                "טלפון": r.phone,
                [currDate]: r.presence
            });
        }
    });

    // All Columns.
    worksheet.columns = fields.map(function (field, columnIndex) {
        return {
            header: field.name,
            key: field.name,
            width: field.width,
            style: { wrapText: true, vertical: 'middle', horizontal: 'center' }
        };
    });

    return table;
}

function makeReport(path, userData, res) {
    var query = queries.getExcel(userData);
    sql.mq(query, function (data) {
        if (data.error) {
            res.send({
                error: 'ארעה שגיאה במהלך הנפקת הדוח'
            });
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
                var fieldsTempArray = new Array(1);
                var finalResults = new Array(1);
                var tempQuery = Object.keys(query)[1];

                // Get the first colel name
                currentColel = firstResult[0]['שם כולל'];

                // Check if exist
                if (currentColel) {

                    // Push it to the first temp array
                    tempArry.push(firstResult[0]);
                    delete query[tempQuery];
                    if (query["סיכום מלגות ופרטי כוללים"]) {
                        delete query["סיכום מלגות ופרטי כוללים"];
                    }
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
                            fieldsTempArray.push(firstField);
                        }
                    }

                    // Push one last time every last result
                    finalResults.push(tempArry);
                    query[currentColel] = ' ';
                    fieldsTempArray.push(firstField);

                    // Collect the rest of the results
                    for (var j = 2; j < tempResults.length; j++) {
                        finalResults.push(tempResults[j]);
                        fieldsTempArray.push(tempFields[j]);
                    }

                    // Set the new results
                    data.results = finalResults;
                    data.fields = fieldsTempArray;
                    query["סיכום מלגות ופרטי כוללים"] = ' ';
                }
            }

            // All Worksheets            
            data.results.forEach(function (result, sheetIndex) {
                // Hide "empty" keys, (Hack for if there is only one sheet).
                if (Object.keys(query)[sheetIndex] === "log") return;
                var worksheet = workbook.addWorksheet(Object.keys(query)[sheetIndex], { views: [{ rightToLeft: true }] });

                if (Object.keys(query)[sheetIndex] === "דוח נוכחות") {
                    data.results[sheetIndex] = createMonthTable(result, worksheet);
                } else {

                    // All Columns.
                    worksheet.columns = data.fields[sheetIndex].map(function (field, columnIndex) {
                        return {
                            header: field.name,
                            key: field.name,
                            width: 14,
                            style: { wrapText: true, vertical: 'middle', horizontal: 'center' }
                        };
                    });
                }

                // All Rows.                
                worksheet.addRows(data.results[sheetIndex]);

                var prevRow;
                var range;
                var arrOfAllQueries = [
                    "log",
                    "פרטי האברכים",
                    "milgot",
                    "דוח נוכחות",
                    "סיכום מלגות ופרטי כוללים"
                ];

                if (arrOfAllQueries.indexOf(Object.keys(query)[sheetIndex]) == -1) {

                    var cellCurrentStart = 'N';
                    var typeToSum = [
                        "לתשלום נוכחות",
                        "מבחן בכתב",
                        'מבחן בע"פ',
                        ' '
                    ];

                    if (Object.keys(query)[sheetIndex] == "סיכום מלגות") {
                        cellCurrentStart = 'T';

                        // setSettingsToCell(worksheet)

                        cellCurrentStart = 'R';
                    }

                    var fullSum = 0;
                    var arrToSum = data.results[sheetIndex];
                    for (var i = 0; i < 3; i++) {

                        var sum = 0;
                            

                        for (var j = 0; j < arrToSum.length; j++) {
                            sum += arrToSum[j][typeToSum[i]];
                        }

                        placeSomthingOnTheSheet(worksheet, typeToSum[i], cellCurrentStart, i + 2, sum);

                        fullSum += sum;
                    }

                    placeSomthingOnTheSheet(worksheet, typeToSum[i], cellCurrentStart, i + 2, fullSum);

                }

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
                            if (cell.value === 'חג') cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFB00' } };
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

            if(!userData.is_admin){
                workbook.removeWorksheet(2);
                workbook.removeWorksheet(3);
                workbook.removeWorksheet(4);
            }

            workbook.xlsx.writeFile(`./dist${path}`).then(function () {
                // if(!userData.is_admin){
                //     res.download(`./dist${path}`)
                // } else {
                    res.send({
                        success: 'הדוח הונפק בהצלחה!',
                        url: path
                    });
                // }
            }).catch(function (err) {
                res.send({ error: 'ארעה שגיאה במהלך הנפקת הדוח' });
            });
        }
    });
}

module.exports = {
    makeReport: makeReport
};