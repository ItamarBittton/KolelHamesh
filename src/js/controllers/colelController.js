angular.module('RDash')
    .controller('colelController', function ($scope, Data, $rootScope) {
        Data.get('colels').then(function (data) {
            $scope.colels = data.colels;
        })

        $scope.colel = {};

        $scope.add = function () {
            $scope.display = true;
        };

        $scope.edit = function (id) {
            $scope.display = true;
            $scope.colel = $scope.colels[id];
            $scope.editId = id.toString();
        }

        $scope.save = function (valid) {
            if (!valid) {
                $scope.formErrors = true;
            } else if (valid) {
                var method = $scope.editId ? 'put' : 'post';

                Data[method]('colels', { id: $scope.editId, student: $scope.colel }).then(function (result) {
                    $scope.colels = data.colels;
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