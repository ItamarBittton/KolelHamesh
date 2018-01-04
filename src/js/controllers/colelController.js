angular.module('RDash')
    .controller('colelController', function ($scope, Data, $rootScope, Helper) {
        Data.get('colels').then(updateColels);

        $scope.colel = {};
        $scope.newColel = false;
        $scope.openLastMonth = 0;
        $scope.openDaily = 0;

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
            $scope.newColel = true;
        };

        $scope.edit = function (id) {
            $scope.newColel = false;
            $scope.display = true;
            $scope.colel = angular.copy($scope.colels[id]);
            $scope.colel.is_only_daily = Boolean($scope.colel.is_only_daily);
            $scope.colel.is_prev_month = Boolean($scope.colel.is_prev_month);
            $scope.colel.is_one_time_allow = Boolean($scope.colel.is_one_time_allow);
            //$scope.colel.note = Helper.parseJson($scope.colel.note);
        };

        $scope.save = function (valid) {
            if (!valid) {
                $scope.formErrors = true;
            } else if (valid) {
                var method = $scope.newColel ? 'put' : 'post';
                $scope.colel.schedule = Helper.stringifyJson($scope.colel.schedule);
                $scope.colel.note = Helper.stringifyJson($scope.colel.note);

                Data[method]('colels', { colel: $scope.colel }).then(updateColels);
                $scope.close();
            }
        };

        $scope.close = function () {
            $scope.colel = {};
            $scope.formErrors = false;
            $scope.display = false;
        };

        // $scope.action = function (index, action) {
        //     Data.post(action, { editId: $scope.editId, data: $scope.colels[index] }).then(function (data) {
        //         if (data.colels) $scope.colels = data.colels;
        //         $scope.editId = undefined;
        //     });
        // };

        function updateColels(data) {
            $scope.colels = data.colels;
            $scope.colels.forEach(function (colel) {
                colel.schedule = Helper.parseJson(colel.schedule);
                colel.note = Helper.parseJson(colel.note);
            });
        }

        $scope.updateAllColelsToLastMonthOpen = function () {
            $scope.openLastMonth = ($scope.openLastMonth + 1) % 2;
            Data.get('updateAllColelsToLastMonthOpen/' + $scope.openLastMonth).then(function (data) {
                // TODO: seems like an error.
                getColels();
            });
        };

        $scope.updateAllColelsToDailyOpen = function () {
            $scope.openDaily = ($scope.openDaily + 1) % 2;
            Data.get('updateAllColelsToDailyOpen/' + $scope.openDaily).then(function (data) {
                // TODO: seems like an error.
                getColels();
            });
        };

        $scope.subDays = function (date) {
            return Math.round(Math.abs((new Date().getTime() - new Date(date).getTime()) / (86400000)));
        };
    });