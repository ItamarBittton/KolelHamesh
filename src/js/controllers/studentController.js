angular.module('RDash')
    .controller('studentController', function ($scope, Data) {
        Data.get('students').then(function (data) {
            $scope.students = data.students;
        })

        $scope.student = {};
        $scope.isNew = false;
        $scope.add = function () {
            $scope.isNew = $scope.display = true;
            $scope.student = {};
        };

        $scope.edit = function (id) {
            $scope.isNew = false;
            $scope.display = true;
            $scope.student = angular.copy($scope.students[id]);
            // $scope.student.editId = id.toString();
        }

        $scope.save = function (valid, toDelete) {
            var type = '';
            var students = JSON.parse(JSON.stringify($scope.students));
            if (toDelete) {
                type = 'מחיקה';
            } else if($scope.isNew){
                type = 'הוספה';
            }  else {
                type = 'עריכה';
            }
            delete $scope.student.name;
            if (!valid) {
                $scope.formErrors = true;
            } else if (valid) {
                $scope.student.schedule = JSON.stringify($scope.student.schedule);
                Data.post('recomends', { data: $scope.student, table: 'student', type: type }).then(function (result) {

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