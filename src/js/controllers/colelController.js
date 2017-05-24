angular.module('RDash')
    .controller('colelController', function ($scope, Data, $rootScope) {
        Data.get('colels').then(function (data) {
            $scope.colels = data.colels;
            $scope.colels.forEach(x => x.schedule = JSON.parse(x.schedule));
        })
        
        $scope.colel = {};
        $scope.newColel = false;

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
            };
            $scope.colel.schedule.map(function(val){
                val.start = '00:00';
                val.end = '00:00';
            })
            $scope.newColel = true;
        };

        $scope.edit = function (id) {
            $scope.newColel = false;
            $scope.display = true;
            $scope.colel = angular.copy($scope.colels[id]);
            $scope.colel.is_only_daily = $scope.colel.is_only_daily ? true : false;
            $scope.colel.is_prev_month = $scope.colel.is_prev_month ? true : false;
            $scope.colel.is_one_time_allow = $scope.colel.is_one_time_allow ? true : false;
            $scope.colel.note = JSON.parse($scope.colel.note);
        }

        $scope.save = function (valid) {
            if (!valid) {
                $scope.formErrors = true;
            } else if (valid) {
                var method = $scope.newColel ? 'put' : 'post';
                $scope.colel.schedule = JSON.stringify($scope.colel.schedule);
                $scope.colel.note = JSON.stringify($scope.colel.note);

                Data[method]('colels', { colel: $scope.colel }).then(function (result) {
                    $scope.colels = result.colels;
                    $scope.colels.forEach(x => x.schedule = JSON.parse(x.schedule));
                });
                $scope.close();
                
            }
        }

        $scope.close = function () {
            $scope.colel = {};
            $scope.formErrors = false;
            $scope.display = false;
        }

        $scope.action = function (index, action) {
            Data.post(action, { editId: $scope.editId, data: $scope.colels[index] }).then(function (data) {
                if (data.colels) $scope.colels = data.colels;
                $scope.editId = undefined;
            });
        };
    });