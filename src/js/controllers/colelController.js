angular.module('RDash')
    .controller('colelController', function ($scope, Data, $rootScope, Helper) {
        var newColel = false;
        $scope.colel = {};
        $scope.total = {
            daily: false,
            prevMonth: false
        };
        // $scope.chosenDate = new Date();
        Data.get('colels').then(updateColels);

        $scope.add = function () {
            $scope.display = true;
            $scope.colel = {
                schedule: [
                    { "start": "00:00", "end": "00:00" },
                    { "start": "00:00", "end": "00:00" },
                    { "start": "00:00", "end": "00:00" },
                    { "start": "00:00", "end": "00:00" },
                    { "start": "00:00", "end": "00:00" },
                    { "start": "00:00", "end": "00:00" }
                ],
                note: {}
            };
            $scope.colel.schedule.map(function (val) {
                val.start = '00:00';
                val.end = '00:00';
            });
            newColel = true;
        };

        $scope.edit = function (id) {
            newColel = false;
            $scope.display = true;
            $scope.colel = angular.copy($scope.colels[id]);
            $scope.colel.is_only_daily = Boolean($scope.colel.is_only_daily);
            $scope.colel.is_prev_month = Boolean($scope.colel.is_prev_month);
            $scope.colel.is_one_time_allow = Boolean($scope.colel.is_one_time_allow);
            $scope.colel.is_report_allow = Boolean($scope.colel.is_report_allow);
            $scope.colel.is_deleted = Boolean($scope.colel.is_deleted);
        };

        $scope.save = function (valid) {
            if (!valid) {
                $scope.formErrors = true;
            } else {
                var method = newColel ? 'put' : 'post';
                $scope.colel.schedule = Helper.stringifyJson($scope.colel.schedule);
                $scope.colel.note = Helper.stringifyJson($scope.colel.note);

                Data[method]('colels', { colel: $scope.colel }).then(updateColels);
                $scope.close();
            }
        };

        $scope.delete = function () {
            
            Data.post('deleteColel', { id: $scope.colel.colel_id }).then(Data.get('colels').then(updateColels));
            $scope.close();

        };

        $scope.registration = function () {

            Data.post('registrationColel', { id: $scope.colel.id }).then(Data.get('colels').then(updateColels));
            $scope.close();

        };

        $scope.close = function () {
            $scope.colel = {};
            $scope.formErrors = false;
            $scope.display = false;
        };

        function updateColels(data) {
            $scope.colels = data.colels;
            $scope.colels.forEach(function (colel) {
                colel.schedule = Helper.parseJson(colel.schedule);
                colel.note = Helper.parseJson(colel.note);
            });

            $scope.total.daily = $scope.colels.every(colel => Boolean(colel.is_only_daily));
            $scope.total.prevMonth = $scope.colels.every(colel => Boolean(colel.is_prev_month));
        }

        $scope.updateAll = function (param, value) {
            Data.post('updateAll/', {
                column: param,
                value: value
            }).then(Data.get('colels').then(updateColels));
        };

        $scope.updateAllStudents = function (date) {
            date = date.split('/');
            Data.post('updateAllStudents', { date: new Date(date[2], date[1] - 1, date[0]).getTime() }).then(function (res) {

            })
        }

        $scope.timeLapse = function (date) {
            var lastDate = new Date(date);
            var dateDiff = (Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24);

            if (dateDiff <= 2) {
                return '#5cb85c';
            } else if (dateDiff <= 7) {
                return '#f0ad4e';
            } else {
                return '#d9534f';
            }
        };

        $scope.goTo = function (colel) {
            $scope.away = true;
            // @ts-ignore
            window.open(location.origin, [colel.name, colel.password].join(';'));
        };

        $scope.$on('$viewContentLoaded', function () {
            var datePickerSettings = {
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
            };

            $("#datepicker").datepicker(datePickerSettings);
        });

    });