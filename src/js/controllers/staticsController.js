angular.module('RDash')
    .controller('staticsController', function($scope, Data) {
        $scope.changeStaticsType = function(sortType, staticsType) {
            // if (sortType && staticsType) {
            //     $scope.secondSec = true;
            // }
        }
        $scope.statics = {};

        $scope.getStatics = function() {
            var startDate = $scope.statics.startDate.split('/');
            var endDate = $scope.statics.endDate.split('/');
            Data.get('getStatics/' + $scope.statics.staticsType +
                '/' + new Date(startDate[2], startDate[1], startDate[0]).getTime() +
                '/' + new Date(endDate[2], endDate[1], endDate[0]).getTime() +
                '/' + $scope.statics.dateType).then(function(res) {

                var chart = new CanvasJS.Chart("chartContainer", {
                    title: {
                        text: "Multi-Series Line Chart"
                    },
                    data: [{
                            type: "line",
                            showInLegend: true,
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
            })
        }

        $scope.$on('$viewContentLoaded', function() {
            $("#datepicker").datepicker({
                closeText: "סגור",
                prevText: "&#x3C;הקודם",
                nextText: "הבא&#x3E;",
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
                prevText: "&#x3C;הקודם",
                nextText: "הבא&#x3E;",
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