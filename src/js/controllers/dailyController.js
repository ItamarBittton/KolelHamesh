angular.module('RDash').controller("dailyController", function ($scope, Data) {
    $scope.disable = false;
    $scope.definition = [];
    $scope.show = function (date) {
        if (date) {

            $scope.disable = true;
            

            Data.get('daily').then(function (data) {
               $scope.students = data;
               $scope.definition = ['בזמן', 'מאחר']
            })

            
        }
    }
    
    $scope.students = [];
    $scope.viewDate = {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1
    }
});