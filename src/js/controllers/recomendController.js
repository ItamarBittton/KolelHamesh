angular.module('RDash')
    .controller('recomendController', function ($scope, Data, $rootScope, Notification) {
        $scope.reload = function (reload) {
            Data.get('recomends').then(function (data) {
                $scope.recomends = data.recomends;
                if (reload) Notification.success("נתונים נטענו בהצלחה!")
            });
        };
        $scope.reload();
        $scope.recomend = {};

        $scope.add = function () {
            $scope.display = true;
        };

        $scope.edit = function (id) {
            $scope.display = true;
            $scope.recomend = $scope.recomends[id];
            $scope.editId = id.toString();
        }

        $scope.save = function (valid) {
            if (!valid) {
                $scope.formErrors = true;
            } else if (valid) {
                // var method = $scope.editId ? 'put' : 'post';
                // if (toDelete) {
                //     method = 'delete';
                // }
                // var method = toDelete ? 'delete' : 'post';
                Data.post('recomends', { student: $scope.recomend }).then(function (result) {
                    $scope.recomends = data.recomends;
                });

                $scope.close();
            }
        }

        $scope.close = function () {
            $scope.recomend = {};
            $scope.formErrors = false;
            $scope.display = false;
        }

        $scope.whatChange = function (oldVal, newVal) {
            return (oldVal !== newVal)
        }

        $scope.action = function (index, action) {
            var recomend = angular.copy($scope.recomends[index]),
                newObj = recomend.data.newObj;
            
            newObj.schedule = [];
            
            for (var i = 0; i < 7; i++) {
                if (newObj[i]) {
                    var time = newObj[i].split(' - ');
                    newObj.schedule.push({
                        start: time[0],
                        end: time[1]
                    });
                    delete newObj[i];
                }
            };

            Data.post(action, { recomend_id: $scope.recomend_id, data: recomend }).then(function (data) {
                if (data.status) $scope.recomends[index].status = data.status;
            });
        };
    });