angular.module('RDash')
    .controller('recomendController', function ($scope, Data, $rootScope, Notification) {
        $scope.data = {};
        $scope.reload = function (reload) {
            Data.get('recomends').then(function (data) {
                $scope.recomends = data.recomends;
                $scope.stats = data.stats;
                if (reload) Notification.success("נתונים נטענו בהצלחה!");
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
        };

        $scope.save = function (valid) {
            if (!valid) {
                $scope.formErrors = true;
            } else if (valid) {
                Data.post('recomends', { student: $scope.recomend }).then(function (result) {
                    $scope.recomends = result.recomends;
                });

                $scope.close();
            }
        };

        $scope.close = function () {
            $scope.recomend = {};
            $scope.formErrors = false;
            $scope.display = false;
        };

        $scope.whatChange = function (oldVal, newVal) {
            return (oldVal !== newVal);
        };

        $scope.action = function (originalRecomend, action) {
            var recomend = angular.copy(originalRecomend),
                newObj = recomend.data.newObj;
            
            if (recomend.req_type === "כולל") {
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
                }
            }

            if (recomend.type == "הוספה" && !recomend.approved_date) {
                recomend.data.newObj.supported_id = prompt('אנא הכנס מספר נתמך');
            }

            Data.post(action, { recomend_id: $scope.recomend_id, data: recomend }).then(function (data) {
                if (data.status) originalRecomend.status = data.status;
            });
        };

        $scope.delete = function (recomend) {
            var data = recomend.data.newObj;
            var message = [
                'אתה עומד למחוק את',
                data.first_name,
                data.last_name,
                'לצמיתות. אתה בטוח?'
            ].join(' ');

            // @ts-ignore
            if (confirm(message)) {
                Data.post('deleteStudent', { id: data.id, recomend_id: recomend.recomend_id }).then($scope.reload);
            }
        };

        $scope.toDisplay = function (key) {
            return !(key === 'is_deleted' || key === 'colel_id');
        };
    });