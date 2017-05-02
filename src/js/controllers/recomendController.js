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

        $scope.whatChange = function(key, recomendKey){
            return (JSON.stringify($scope.recomends[recomendKey].data.newObj) != JSON.stringify(newVal[key]))
        }
        
        $scope.action = function (index, action) {
            Data.post(action, { recomend_id: $scope.recomend_id, data: $scope.recomends[index] }).then(function (data) {
                if (data.status) $scope.recomends[index].status = data.status;
            });
        };
    });