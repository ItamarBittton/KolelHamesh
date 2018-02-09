angular.module('RDash')
.controller('staticsController', function ($scope, Data) {
    $scope.changeStaticsType = function(sortType, staticsType){
        if(sortType && staticsType) {
            $scope.secondSec = true;
        }
    }
});