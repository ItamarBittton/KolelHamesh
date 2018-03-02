angular.module('RDash')
    .controller('staticsController', function ($scope, Data) {

        Data.get('colelList').then(function(res) {
            $scope.colelList = res.colelList;
        })
        
        $scope.changeStaticsType = function (sortType, staticsType) {
            // if (sortType && staticsType) {
            //     $scope.secondSec = true;
            // }
        }
        $scope.statics = {};
        $scope.display = true;
        $scope.chartTypes = [
            { desc: "קווי", val: "line", type: 1 },
            { desc: "מדורג", val: "stepLine", type: 1 },
            { desc: "קווי מעוגל", val: "spline", type: 1 },
            { desc: "מנוקד", val: "scatter", type: 1 },
            { desc: "שטח מסומן", val: "stackedArea", type: 1 },
            { desc: "שורות", val: "stackedBar", type: 1 },
            { desc: "עמודות טווח", val: "rangeColumn", type: 1 },

        ]

        $scope.colelList = [];

        // test
        $scope.statics.staticsType = '2';
        $scope.statics.startDate = '01/01/2018';
        $scope.statics.endDate = '27/02/2018';
        $scope.statics.dateType = '1';

        $scope.restart = function () {
            $scope.display = true;
        }

        $scope.renderChart = function (chartType) {
            chartType = chartType === null ? {} : JSON.parse(chartType);

            var data = [];
            var dataPoints = [];
            var currentColelId = $scope.oneTimeStudents[0].colel_id;

            for (var i = 0; i < $scope.oneTimeStudents.length; i++) {
                var currentData = $scope.oneTimeStudents[i]
                if (currentColelId === currentData.colel_id) {
                    dataPoints.push({ x: new Date(currentData.date), y: currentData.data })
                } else {
                    data.push({
                        type: chartType.val,
                        showInLegend: true,
                        name: currentColelId + "",
                        legendText: currentColelId + "",
                        dataPoints: dataPoints
                    })
                    currentColelId = currentData.colel_id;
                    if (i < $scope.oneTimeStudents.length - 1) {
                        dataPoints = []
                    }

                }
            }

            data.push({
                type: chartType.val,
                showInLegend: true,
                name: currentColelId + "",
                legendText: currentColelId + "",
                dataPoints: dataPoints
            })

            var chart = new CanvasJS.Chart("chartContainer", {
                title: {
                    text: "סיכום"
                },
                axisY: {
                    title: "כמות"
                },
                axisX: {
                    title: "תאריך",
                    labelFormatter: function (e) {
                        var str = "";

                        if ($scope.statics.dateType == 1) {
                            str += "DD/"
                        }
                        if ($scope.statics.dateType == 1 || $scope.statics.dateType == 2) {
                            str += "MM/"
                        }

                        return CanvasJS.formatDate(e.value, str + "YY");
                    },
                    labelAngle: 0.01
                },
                legend: {
                    horizontalAlign: "right", // left, center ,right 
                    verticalAlign: "center", // top, center, bottom
                    markerMargin: 75,
                    itemWidth: 150
                },
                toolTip: {
                    shared: true,
                    contentFormatter: function (e) {
                        var str = "";
                        for (var i = 0; i < e.entries.length; i++) {
                            var temp = " <strong>" + e.entries[i].dataSeries.legendText + ":</strong>" + e.entries[i].dataPoint.y + " <br/>";
                            str = str.concat(temp);
                        }
                        return (str);
                    }
                },
                data: data
            });

            chart.render();
        }

        $scope.getStatics = function () {
            var startDate = $scope.statics.startDate.split('/');
            var endDate = $scope.statics.endDate.split('/');

            $scope.display = false;
            Data.get('getStatics/' + $scope.statics.staticsType +
                '/' + new Date(startDate[2], startDate[1] - 1, startDate[0]).getTime() +
                '/' + new Date(endDate[2], endDate[1] - 1, endDate[0]).getTime() +
                '/' + $scope.statics.dateType).then(function (res) {
                    $scope.oneTimeStudents = res.data[0];
                    $scope.oral_score = res.data[1];
                    $scope.hours = res.data[2];

                    $scope.renderChart(JSON.stringify({ val: 'line', type: 1 }));

                })
        }

        $scope.$on('$viewContentLoaded', function () {
            $("#datepicker").datepicker({
                closeText: "סגור",
                prevText: "הקודם",
                nextText: "הבא",
                currentText: "היום",
                monthNames: ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני",
                    "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"
                ],
                monthNamesShort: ["ינו", "פבר", "מרץ", "אפר", "מאי", "יוני",
                    "יולי", "אוג", "ספט", "אוק", "נוב", "דצמ"
                ],
                dayNames: ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"],
                dayNamesShort: ["א'", "ב'", "ג'", "ד'", "ה'", "ו'", "שבת"],
                dayNamesMin: ["א'", "ב'", "ג'", "ד'", "ה'", "ו'", "שבת"],
                weekHeader: "Wk",
                dateFormat: "dd/mm/yy",
                firstDay: 0,
                isRTL: true,
                showMonthAfterYear: false,
                yearSuffix: ""
            });
            $("#endDatepicker").datepicker({
                closeText: "סגור",
                prevText: "הקודם",
                nextText: "הבא",
                currentText: "היום",
                monthNames: ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני",
                    "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"
                ],
                monthNamesShort: ["ינו", "פבר", "מרץ", "אפר", "מאי", "יוני",
                    "יולי", "אוג", "ספט", "אוק", "נוב", "דצמ"
                ],
                dayNames: ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"],
                dayNamesShort: ["א'", "ב'", "ג'", "ד'", "ה'", "ו'", "שבת"],
                dayNamesMin: ["א'", "ב'", "ג'", "ד'", "ה'", "ו'", "שבת"],
                weekHeader: "Wk",
                dateFormat: "dd/mm/yy",
                firstDay: 0,
                isRTL: true,
                showMonthAfterYear: false,
                yearSuffix: ""
            });
        });

    });