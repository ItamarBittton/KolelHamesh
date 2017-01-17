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
            $scope.student = $scope.students[id];
            $scope.student.editId = id.toString();
        }

        $scope.save = function (valid) {
            if (!valid) {
                $scope.formErrors = true;
            } else if (valid) {
                var method = $scope.student.editId ? 'put' : 'post';
                
                Data[method]('students', { id: $scope.student.editId, student: $scope.student }).then(function (result) {
                    $scope.students = data.students;
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