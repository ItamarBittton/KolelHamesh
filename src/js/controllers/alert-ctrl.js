angular.module('RDash')
    .controller('AlertsCtrl', function AlertsCtrl($scope, $cookies) {
        $scope.alerts = []
        $scope.alerts.push(JSON.parse($cookies.get('alert')) || {});

        $scope.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);
        };
    });