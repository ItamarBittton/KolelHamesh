angular.module('RDash').controller("dailyController", function ($scope, Data) {
    $scope.disable = false;
    $scope.dropList = [];
    $scope.show = function (date) {
        if (date) {

            $scope.disable = true;


            Data.post('daily', { date }).then(function (data) {
                $scope.students = data.dailyRep;
                $scope.dropList = data.dropList;
            })


        }
    }

    $scope.students = [];
    $scope.viewDate = {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1
    }

    $scope.save = function (valid) {
        var UPDaily = $scope.students.filter((val) => (val.late !== null));
        // var method = $scope.editId ? 'put' : 'post';

        // Data[method]('colels', { id: $scope.editId, student: $scope.colel }).then(function (result) {
        //     $scope.colels = data.colels;
        // });
        Data.put('daily', {daily : UPDaily}).then(function(date){

        });

        $scope.close();
    }

    $scope.close = function () {
        $scope.students = undefined;
        $scope.definition = undefined;
        $scope.disable = false;
    }
});