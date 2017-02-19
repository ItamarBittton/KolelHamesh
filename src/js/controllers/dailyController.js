angular.module('RDash').controller("dailyController", function ($scope, Data) {
    $scope.disable = false;
    $scope.dropList = [];
    $scope.isOnlyDaily = false;

    $scope.show = function (date) {
        if (date) {
            $scope.date = date;
            $scope.disable = true;


            Data.get('daily/' + $scope.date.toLocaleDateString('en-GB').split('/').reverse().join('-')).then(function (data) {
                $scope.students = data.dailyRep;
                $scope.dropList = data.dropList;
                $scope.tempStudents = data.tempStudents;
            })

        }
    }

    $scope.students = [];
    $scope.viewDate = {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1
    }

    Data.get('isOnlyDaily').then(function(data){
        if(data.data == true){
            $scope.isOnlyDaily = data.data;
            $scope.show(new Date());
        }
        

});

    $scope.save = function (valid) {
        var UPDaily = $scope.students.filter((val) => (val.presence !== null));
        var UPDStud = $scope.tempStudents;
        var UPDdate = $scope.date.toLocaleDateString('en-GB').split('/').reverse().join('-')
        // var method = $scope.editId ? 'put' : 'post';

        // Data[method]('colels', { id: $scope.editId, student: $scope.colel }).then(function (result) {
        //     $scope.colels = data.colels;
        // });
        Data.put('daily', { daily: UPDaily, oneTimeStud: UPDStud ,date : UPDdate}).then(function (date) {

        });

        $scope.close();
    }

    $scope.close = function () {
        $scope.students = undefined;
        $scope.definition = undefined;
        $scope.disable = false;
    }
});