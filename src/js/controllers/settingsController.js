angular.module('RDash')
    .controller('settingsController', function ($scope, Data, $state, $rootScope, Notification) {
        $scope.data = {
            start: ['', '20:00', '20:00', '20:00', '20:00', '20:00'],
            end: ['', '21:30', '21:30', '21:30', '21:30', '21:30'],
            shulName: 'בית כנסת חב"ד',
            street: "רבי עקיבא",
            number: '4',
            city: 'אשדוד',
            comments: ''
        }

        $scope.submitData = function () {
            if ($scope.agree) {
                $rootScope.agree = true;
                $state.go('students');
            } else {
                Notification.error('חובה לאשר את הנתונים');
            }
        };
    })