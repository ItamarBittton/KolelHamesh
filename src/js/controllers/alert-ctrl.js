angular.module('RDash')
    .controller('AlertsCtrl', function AlertsCtrl($scope, $cookies) {
        $scope.alerts = JSON.parse($cookies.get('alert')) || [];

        $scope.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);
        };
    });