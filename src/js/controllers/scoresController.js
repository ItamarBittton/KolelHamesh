angular.module('RDash')
    .controller('scoresController', function ($scope, Data){
        $scope.students = [];
        $scope.dropList = {};
        
        Data.post('scores').then(function(data){
            $scope.students = data.studentList;
            $scope.dropList = data.dropList;
        });

        $scope.save = function(data){
            console.log(data);
        }
    })