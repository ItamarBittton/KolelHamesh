angular.module('RDash').controller("reportsController", function ($scope, Data, Notification) {

    // $scope.dates = [new Date().toISOString().slice(0, 7)];
    // if (new Date().getDate() < 4) {
    //     $scope.dates.push((function () {
    //         var x = new Date();
    //         x.setDate(1);
    //         x.setMonth(x.getMonth());
    //         return x.toISOString().slice(0, 7)
    //     })());
    // }

    Data.get('definitions').then(function (data) {
        $scope.definitions = data.definitions;
        $scope.test_types = data.test_types;
        $scope.titles = data.titles;
        $scope.reports = data.reports;
        $scope.reportTypes = data.reportTypes;

        $scope.data = {
            colel: null,
            type: null
        };

        Data.get('prevDates').then(function (data) {
            $scope.dates = data.prevDates;
        });
    });

    $scope.f = function (def) {
        console.log(def);
    };

    $scope.refresh = function () {
        $scope.refreshing = true;
        Data.get('reports').then(function (data) {
            $scope.reports = data.reports;
            $scope.refreshing = false;
        });
    };

    $scope.save = function (table_name, object) {
        Data.put('definitions', { table_name, object });
    };

    $scope.changeMonth = function (selected) {
        if (selected) $scope.data.month = selected;
    };

    $scope.changeColel = function (selected) {
        selected = selected || {};
        $scope.data.colel = selected.id;
        $scope.data.colelName = selected.name;

        $scope.data.type = null;
        $scope.data.typeName = null;
    };

    $scope.changeType = function (selected) {
        $scope.data.type = selected.id;
        $scope.data.typeName = selected.name;

        $scope.data.colel = null;
        $scope.data.colelName = null;
    };

    $scope.newReport = function (type) {
        if (!type || !type.id || !$scope.data.month || (type.id == 1 && !$scope.data.colel)) {
            Notification.warning("חסרים נתונים בכדי להנפיק דוח");
        } else {
            $scope.data.type = type.id;

            Data.put('newReport', $scope.data).then(function (res) {
                if (res.success) {
                    $scope.reports.push({
                        report: $scope.reportTypes[$scope.data.type - 1].name,
                        colel: $scope.data.colelName,
                        date_created: $scope.data.month,
                        url: res.url
                    });
                } else {
                    Notification.warning('לא ניתן היה להפיק את הדוח');
                }
            });
        }
    };
});