angular.module('RDash')
    .controller('scoresController', function ($scope, Data){
        Data.post('scores').then(function(data){
            $scope.students = data.studentList;
            $scope.dropList = data.dropList;
        });
    })