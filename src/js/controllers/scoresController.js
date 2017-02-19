angular.module('RDash')
    .controller('scoresController', function ($scope, Data) {
        $scope.students = [];
        $scope.dropList = {};
        $scope.UPDstud = [];
        $scope.date = new Date().toLocaleDateString('en-GB').split('/').reverse().join('-');

        Data.get('scores/' + $scope.date).then(function (data) {
            $scope.students = data.scores;
            $scope.title = data.test_type;
            $scope.options = data.options;
        });

        $scope.save = function (data) {

            $scope.UPDstud = $scope.students.filter((val) => (val.oral || val.oral === 0 || val.write));
            Data.put('scores', {score : $scope.UPDstud, date: $scope.date}).then(function(data){

            })

        }
    })