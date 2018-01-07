angular.module('RDash')
    .controller('colelController', function ($scope, Data, $rootScope, Helper) {
        var newColel = false;
        $scope.colel = {};
        $scope.total = {
            daily: false,
            prevMonth: false
        };
        
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
            var message = [
                'אתה עומד למחוק את כולל',
                $scope.colel.name,
                'עם שם המשתמש שלו לצמיתות. אתה בטוח?'
            ].join(' ');

            // @ts-ignore
            if (confirm(message)) {
                Data.post('deleteColel', { id: $scope.colel.id }).then(Data.get('colels').then(updateColels));
                $scope.close();
            }
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

        $scope.timeLapse = function (date) {
            var lastDate = new Date(date);
            var dateDiff = (Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
            
            if (dateDiff <= 2) {
                return 'OliveDrab';
            } else if (dateDiff <= 7) {
                return 'Orange';
            } else {
                return 'OrangeRed';
            }
        };

        $scope.goTo = function (colel) {
            $scope.away = true;
            // @ts-ignore
            window.open(location.origin, [colel.name, colel.password].join(';'));
        };
    });