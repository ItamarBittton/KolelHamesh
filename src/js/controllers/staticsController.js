angular.module('RDash')
    .controller('staticsController', function($scope, Data) {
        $scope.changeStaticsType = function(sortType, staticsType) {
            // if (sortType && staticsType) {
            //     $scope.secondSec = true;
            // }
        }
        $scope.statics = {};
        $scope.display = true;

        // test
        $scope.statics.staticsType = '2';
        $scope.statics.startDate = '01/01/2018';
        $scope.statics.endDate = '27/02/2018';
        $scope.statics.dateType = '1';
        $scope.getStatics = function() {
            var startDate = $scope.statics.startDate.split('/');
            var endDate = $scope.statics.endDate.split('/');

            $scope.display = false;
            Data.get('getStatics/' + $scope.statics.staticsType +
                '/' + new Date(startDate[2], startDate[1], startDate[0]).getTime() +
                '/' + new Date(endDate[2], endDate[1], endDate[0]).getTime() +
                '/' + $scope.statics.dateType).then(function(res) {
                $scope.oneTimeStudents = res.data[0];
                $scope.oral_score = res.data[1];
                $scope.hours = res.data[2];

                var data = [];
                var dataPoints = [];
                var currentColelId = $scope.oneTimeStudents[0].colel_id;

                for (var i = 0; i < $scope.oneTimeStudents.length; i++) {
                    var currentData = $scope.oneTimeStudents[i]
                    if (currentColelId === currentData.colel_id) {
                        dataPoints.push({ x: currentData.date, y: currentData.data })
                    } else {
                        data.push({
                            type: 'line',
                            showInLegend: true,
                            name: currentColelId + "",
                            legendText: currentColelId + "",
                            dataPoints: dataPoints
                        })
                        currentColelId = currentData.colel_id;
                        dataPoints = []

                    }
                }

                data.push({
                    type: 'line',
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
                        title: "תאריך"
                    },
                    legend: {
                        horizontalAlign: "right", // left, center ,right 
                        verticalAlign: "center", // top, center, bottom
                        markerMargin: 75,
                        maxWidth: 150
                    },
                    toolTip: {
                        shared: true,
                        contentFormatter: function(e) {
                            var str = "";
                            for (var i = 0; i < e.entries.length; i++) {
                                var temp = " <strong>" + e.entries[i].dataSeries.legendText + ":</strong>" + e.entries[i].dataPoint.y + " <br/> בתאריך:" + e.entries[i].dataPoint.x;
                                str = str.concat(temp);
                            }
                            return (str);
                        }
                    },
                    data: data
                });

                chart.render();
            })
        }

        $scope.$on('$viewContentLoaded', function() {
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

        $scope.show = function() {

            var chart = new CanvasJS.Chart("chartContainer", {
                title: {
                    text: "Multi-Series Line Chart"
                },
                data: [{
                        type: "line",
                        dataPoints: [
                            { x: 10, y: 21 },
                            { x: 20, y: 25 },
                            { x: 30, y: 20 },
                            { x: 40, y: 25 },
                            { x: 50, y: 27 },
                            { x: 60, y: 28 },
                            { x: 70, y: 28 },
                            { x: 80, y: 24 },
                            { x: 90, y: 26 }

                        ]
                    },
                    {
                        type: "line",
                        dataPoints: [
                            { x: 10, y: 31 },
                            { x: 20, y: 35 },
                            { x: 30, y: 30 },
                            { x: 40, y: 35 },
                            { x: 50, y: 35 },
                            { x: 60, y: 38 },
                            { x: 70, y: 38 },
                            { x: 80, y: 34 },
                            { x: 90, y: 44 }

                        ]
                    },
                    {
                        type: "line",
                        dataPoints: [
                            { x: 10, y: 45 },
                            { x: 20, y: 50 },
                            { x: 30, y: 40 },
                            { x: 40, y: 45 },
                            { x: 50, y: 45 },
                            { x: 60, y: 48 },
                            { x: 70, y: 43 },
                            { x: 80, y: 41 },
                            { x: 90, y: 28 }

                        ]
                    },
                    {
                        type: "line",
                        dataPoints: [
                            { x: 10, y: 71 },
                            { x: 20, y: 55 },
                            { x: 30, y: 50 },
                            { x: 40, y: 65 },
                            { x: 50, y: 95 },
                            { x: 60, y: 68 },
                            { x: 70, y: 28 },
                            { x: 80, y: 34 },
                            { x: 90, y: 14 }

                        ]
                    }
                ]
            });

            chart.render();
        }
    });