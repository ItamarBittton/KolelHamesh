angular.module('RDash').controller("reportsController", function ($scope, Data){
    
    Data.get('definitions').then(function(data){
        $scope.definitions = data.definitions;
        $scope.test_types = data.test_types;
        $scope.titles = data.titles;
        $scope.reports = data.reports;
    });

    $scope.save = function (table_name, object) {
        Data.put('definitions', { table_name, object });
    };

    $scope.newReport = function (index) {
        var data = {
            date: $scope.currentMonth,
            type: $scope.reports[index]
        }

        Data.put('newReport', data).then(function (res) {
            debugger;
         });
    }
})