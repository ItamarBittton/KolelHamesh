angular.module('RDash').controller("reportsController", function ($scope, Data){
    
    Data.get('definitions').then(function(data){
        $scope.definitions = data.definitions;
        $scope.test_type = data.test_type;
        $scope.titles = data.titles;
    });
})