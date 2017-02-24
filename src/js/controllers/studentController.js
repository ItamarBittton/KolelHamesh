angular.module('RDash')
    .controller('studentController', function ($scope, Data) {
        Data.get('students').then(function (data) {
            $scope.students = data.students;
        })

        $scope.student = {};

        $scope.add = function () {
            $scope.display = true;
        };

        $scope.edit = function (id) {
            $scope.display = true;
            $scope.student = angular.copy($scope.students[id]);
            $scope.student.editId = id.toString();
        }

        $scope.save = function (valid) {
            if (!valid) {
                $scope.formErrors = true;
            } else if (valid) {
                $scope.student.schedule = JSON.stringify($scope.student.schedule);
                Data.post('recomends', { data: $scope.student, table: 'student' }).then(function (result) {
                    
                });

                $scope.close();
            }
        }

        $scope.close = function () {
            $scope.student = {};
            $scope.formErrors = false;
            $scope.display = false;
        }
    });