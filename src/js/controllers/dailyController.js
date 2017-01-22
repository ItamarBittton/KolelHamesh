angular.module('RDash').controller("dailyController", function ($scope, Data) {
    $scope.disable = false;
    $scope.definition = [];
    $scope.show = function (date) {
        if (date) {

            $scope.disable = true;
            

        Data.post('daily', {date}).then(function (data) {
               $scope.students = data.dailyRep;
               $scope.definition = data.presenceStatus;
            })

            
        }
    }
    
    $scope.students = [];
    $scope.viewDate = {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1
    }
});