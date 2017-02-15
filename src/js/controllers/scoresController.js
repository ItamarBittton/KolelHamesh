angular.module('RDash')
    .controller('scoresController', function ($scope, Data) {
        $scope.students = [];
        $scope.dropList = {};
        $scope.UPDstud = [];

        Data.get('scores').then(function (data) {
            $scope.students = data.studentList;
            $scope.dropList = data.dropList;
        });

        $scope.save = function (data) {
            if (data) {
                $scope.UPDstud = $scope.students.filter((val) => (val.oral || val.oral === 0 || val.write));
                console.log($scope.UPDstud);
            }
        }
    })