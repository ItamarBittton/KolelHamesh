angular.module('RDash')
    .controller('studentController', function ($scope, Data) {
        Data.get('students').then(function (data) {
            $scope.students = data.students;
        })

        $scope.student = {};
        $scope.isNew = false;
        $scope.editId = null;
        $scope.add = function () {
            $scope.isNew = $scope.display = true;
            $scope.student = {};
        };

        $scope.edit = function (id) {
            $scope.isNew = false;
            $scope.display = true;
            $scope.student = angular.copy($scope.students[id]);
            $scope.editId = id.toString();
        }

        $scope.save = function (valid, toDelete) {
            var type = '';

            delete $scope.student.name;
            var data = {
                oldObj: null,
                newObj: $scope.student
            }
            if (toDelete) {
                type = 'מחיקה';
            } else if ($scope.isNew) {
                type = 'הוספה';
            } else {
                type = 'עריכה';
                data.oldObj = $scope.students[$scope.editId];
            }


            if (!valid) {
                $scope.formErrors = true;
            } else if (valid) {

                Data.post('recomends', { data: data, table: 'student', type: type }).then(function (result) {

                });

                $scope.close();
            }
        }

        $scope.deleteStud = function (valid) {
            if (!valid) {
                $scope.formErrors = true;
            } else if (valid) {
                $scope.student.schedule = JSON.stringify($scope.student.schedule);
                Data.post('recomends', { data: $scope.student, table: 'student', type: 'מחיקה' }).then(function (result) {

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