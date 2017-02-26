angular.module('RDash')
    .controller('recomendController', function ($scope, Data, $rootScope) {
        Data.get('recomends').then(function (data) {
            $scope.recomends = data.recomends;
            
        })

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
                var method = $scope.editId ? 'put' : 'post';

                Data[method]('recomends', { id: $scope.editId, student: $scope.recomend }).then(function (result) {
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

        $scope.action = function (index, action) {
            Data.post(action, { editId: $scope.editId, data: $scope.recomends[index] }).then(function (data) {
                if (data.recomends) $scope.recomends = data.recomends;
                $scope.editId = undefined;
            });
        };
    });