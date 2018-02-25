angular.module('RDash')
    .controller('staticsController', function ($scope, Data) {
        $scope.changeStaticsType = function (sortType, staticsType) {
            // if (sortType && staticsType) {
            //     $scope.secondSec = true;
            // }
        }
        $scope.statics = {};

        $scope.getStatics = function () {
            var startDate = $scope.statics.startDate.split('/');
            var endDate = $scope.statics.endDate.split('/');
            Data.get('getStatics/' + $scope.statics.staticsType +
                '/' + new Date(startDate[2], startDate[1], startDate[0]).getTime() +
                '/' + new Date(endDate[2], endDate[1], endDate[0]).getTime() +
                '/' + $scope.statics.dateType).then(function(res){
                    console.log(res);
                })
        }

        $scope.$on('$viewContentLoaded', function () {
            $("#datepicker").datepicker({
                closeText: "סגור",
                prevText: "&#x3C;הקודם",
                nextText: "הבא&#x3E;",
                currentText: "היום",
                monthNames: ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני",
                    "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"],
                monthNamesShort: ["ינו", "פבר", "מרץ", "אפר", "מאי", "יוני",
                    "יולי", "אוג", "ספט", "אוק", "נוב", "דצמ"],
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
                    "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"],
                monthNamesShort: ["ינו", "פבר", "מרץ", "אפר", "מאי", "יוני",
                    "יולי", "אוג", "ספט", "אוק", "נוב", "דצמ"],
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

        $scope.show = function () {

            var chart = new CanvasJS.Chart("chartContainer", {
                title: {
                    text: "My First Chart in CanvasJS"
                },
                data: [{
                    // Change type to "doughnut", "line", "splineArea", etc.
                    type: "column",
                    dataPoints: [
                        { label: "apple", y: 10 },
                        { label: "orange", y: 15 },
                        { label: "banana", y: 25 },
                        { label: "mango", y: 30 },
                        { label: "grape", y: 28 }
                    ]
                }]
            });
            chart.render();
        }
    });