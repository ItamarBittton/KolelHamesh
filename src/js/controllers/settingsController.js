angular.module('RDash')
    .controller('settingsController', function ($scope, Data, $state, $cookies, Notification) {
        if ($cookies.get('link') === 'Admin') {
            $state.go('recomends');
        }

        var copy;

        // $scope.data = {
        //     address: 'חנה רובינא 23 פתח תקוה בית הכנסת חב"ד יום ג: בית כנסת בישטנא רח\' עדש שפיק פינת עזרה ונחמיה',
        //     mail_address: "יהודה הנשיא 41 פתח תקוה",
        //     phone: '054-7770847',
        //     manager_name: "מענדי גרברצ'יק",
        //     schedule: [{
        //         "start": "20:00",
        //         "end": "21:30"
        //     }, {
        //         "start": "20:00",
        //         "end": "21:30"
        //     }, {
        //         "start": "20:00",
        //         "end": "21:30"
        //     }, {
        //         "start": "20:00",
        //         "end": "21:30"
        //     }, {
        //         "start": "20:00",
        //         "end": "21:30"
        //     }, {
        //         "start": "20:00",
        //         "end": "21:30"
        //     }]
        // };

        Data.get('colelSettings').then(function (data) {
            $scope.data = data.data;
            $scope.data.schedule = JSON.parse($scope.data.schedule);
            copy = angular.copy($scope.data);
        });

        $scope.submitData = function (changed) {
            if ($scope.agree) {
                $cookies.put('agree', true);

                // var changedData = {};

                // angular.forEach($scope.data, function (value, key) {
                //     if ($scope.settingsForm[key].$dirty) {
                //         changedData[key] = value;
                //     };
                // });

                if (!angular.equals($scope.data, copy)) {
                    Data.post('recomends', {
                        data: { newObj: $scope.data, oldObj: copy },
                        table: 'colel',
                        type: 'עריכה'
                    }, function (data) {

                    });
                }
                $state.go('recomends');

            } else {
                Notification.error('חובה לאשר את הנתונים');
            }
        };
    });