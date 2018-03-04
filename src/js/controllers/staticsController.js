angular.module('RDash')
    .controller('staticsController', function($scope, Data) {

        Data.get('colelList').then(function(res) {
            $scope.colelList = res.colelList;
        })

        $scope.statics = {};
        $scope.display = true;
        $scope.chartTypes = [
            { desc: "קווי", val: "line", type: 1 },
            { desc: "מדורג", val: "stepLine", type: 1 },
            { desc: "קווי מעוגל", val: "spline", type: 1 },
            { desc: "מנוקד", val: "scatter", type: 1 },
            { desc: "שטח מסומן", val: "stackedArea", type: 1 },
            { desc: "שורות", val: "stackedBar", type: 1 },
        ]

        $scope.staticTypes = [
            {desc: "אברכים נוספים", val: 0},
            {desc: "מאמרים בעל-פה", val: 1},
            {desc: "שעות לימוד", val: 2}
        ];

        $scope.colelList = [];
        $scope.statics.outputColelList = [];
        $scope.currentChart = JSON.stringify({ val: 'line', type: 1 });
        $scope.currentData;

        // test
        // $scope.statics.staticsType = '2';
        // $scope.statics.startDate = '01/01/2018';
        // $scope.statics.endDate = '27/02/2018';
        // $scope.statics.dateType = '1';

        $scope.restart = function() {
            $scope.display = true;

            // $scope.statics.staticsType = '';
            // $scope.statics.startDate = '';
            // $scope.statics.endDate = '';
            // $scope.statics.dateType = '';
        }

        $scope.changeStaticType = function(staticType){
            $scope.currentData = $scope.data[staticType || 0];
            $scope.renderChart($scope.currentChart, $scope.currentData)
        }

        $scope.changeChart = function(chartType) {
            $scope.currentChart = chartType || $scope.currentChart;
            $scope.renderChart($scope.currentChart, $scope.currentData)
        }

        $scope.renderChart = function(chartType, dataType) {
            chartType = chartType === null ? {} : JSON.parse(chartType);

            var data = [];
            var dataPoints = [];
            var dataType = dataType;
            var currentColelId = dataType[0].colel_id;

            var currentData;

            dataType.forEach(function(tempData) {
                currentData = tempData;
                if(currentData.colel_id != currentColelId){
                    data.push({
                        type: chartType.val,
                        showInLegend: true,
                        name: currentColelId + "",
                        legendText: currentColelId + "",
                        dataPoints: dataPoints
                    })
                    currentColelId = currentData.colel_id;
                    dataPoints = [];
                }

                dataPoints.push({ x: new Date(currentData.date), y: currentData.data });

            });

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
                    labelFormatter: function(e) {
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
                    contentFormatter: function(e) {
                        var str = "";
                        for (var i = 0; i < e.entries.length; i++) {
                            var temp = $scope.role === 'User' ? '' : " <strong>" + e.entries[i].dataSeries.legendText + ":</strong>" +  e.entries[i].dataPoint.y + " <br/>";
                            str = str.concat(temp);
                        }
                        return (str);
                    }
                },
                data: data
            });

            if($scope.role === "User"){
                chart.options.axisY.valueFormatString = " "
            }

            chart.render();
        }

        $scope.getStatics = function() {
            var startDate = $scope.statics.startDate.split('/');
            var endDate = $scope.statics.endDate.split('/');

            $scope.display = false;
            Data.post('getStatics', {
                colelList: $scope.statics.outputColelList,
                startDate: new Date(startDate[2], startDate[1] - 1, startDate[0]).getTime(),
                endDate: new Date(endDate[2], endDate[1] - 1, endDate[0]).getTime(),
                dateType: $scope.statics.dateType
            }).then(function(res) {
                $scope.data = res.data;
                $scope.currentData = $scope.data[0];
                // $scope.oneTimeStudents = res.data[0];
                // $scope.oral_score = res.data[1];
                // $scope.hours = res.data[2];

                $scope.renderChart($scope.currentChart, $scope.currentData);

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

    });