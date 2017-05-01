angular.module('RDash').controller("dailyController", function ($scope, Data, $filter) {
    $scope.disable = false;
    $scope.dropList = [];
    $scope.isOnlyDaily = true;

    $scope.show = function (date) {
        if (date) {
            $scope.date = date;
            $scope.disable = true;

            Data.get('daily/' + $scope.date.toLocaleDateString('en-GB').split('/').reverse().join('-')).then(function (data) {
                $scope.students = data.dailyRep;

                $scope.dropList = data.dropList;

                $scope.tempStudents = {amount : data.tempStudents};
            })
        }
    }

    $scope.changeAll = function (value, valid) {
        $scope.students.forEach(x => x.presence = parseInt(value));
    }

    $scope.students = [];
    $scope.viewDate = {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1
    }

    Data.get('getProhibitions').then(function (data) {
        if (data) {
            $scope.isOnlyDaily = $scope.$parent.role === 'Admin' ? false : data.is_only_daily;
            $scope.isOneTimeAllow = $scope.$parent.role === 'Admin' ? true : data.is_one_time_allow;
            if ($scope.isOnlyDaily) {
                $scope.show(new Date());
            }
            Data.get('prevDates').then(function (data) {
                $scope.prevDates = data.prevDates;
            })
        }
    });



    $scope.changeMonth = function (currentMonth) {
        $scope.viewDate = JSON.parse(currentMonth);
    }

    $scope.save = function (valid) {
        var UPDaily = $scope.students.filter((val) => (val.presence !== null));
        var UPDStud = $scope.tempStudents.amount;
        var UPDdate = $scope.date.toLocaleDateString('en-GB').split('/').reverse().join('-');
        //document.querySelector(".selected").classList.remove("selected");

        Data.put('daily', {
            daily: UPDaily,
            oneTimeStud: UPDStud,
            date: UPDdate
        }).then(function (date) {

        });
        if ($scope.is_only_daily) {
            $scope.close();
        }
    }

    $scope.close = function () {
        $scope.students = undefined;
        $scope.definition = undefined;
        $scope.disable = false;
        document.querySelector(".selected").classList.remove("selected");
    }
});