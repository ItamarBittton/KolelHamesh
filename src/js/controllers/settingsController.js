angular.module('RDash')
    .controller('settingsController', function ($scope, Data, $state, $cookies, Notification) {
        if ($cookies.get('link') === 'Admin') {
            $state.go('recomends');
        }
        
        $scope.data = {
            shulName: 'בית כנסת חב"ד',
            street: "רבי עקיבא",
            number: '4',
            city: 'אשדוד',
            comments: '',
            start1: '20:00',
            start2: '20:00',
            start3: '20:00',
            start4: '20:00',
            start5: '20:00',
            start6: '20:00',
            end1: '21:30',
            end2: '21:30',
            end3: '21:30',
            end4: '21:30',
            end5: '21:30',
            end6: '21:30'
        }

        $scope.submitData = function (changed) {
            if ($scope.agree) {
                $cookies.put('agree', true);

                var changedData = {};

                angular.forEach($scope.data, function (value, key) {
                    if ($scope.settingsForm[key].$dirty) {
                        changedData[key] = value;
                    };
                });

                if (!angular.equals({}, changedData)) {
                    Data.post('recomends', {
                        data: changedData,
                        table: 'colels',
                        editId: true
                    })
                };

                $state.go('students');
            } else {
                Notification.error('חובה לאשר את הנתונים');
            }
        };
    })