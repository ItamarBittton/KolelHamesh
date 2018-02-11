angular.module('RDash')
    .controller('staticsController', function($scope, Data) {
        $scope.changeStaticsType = function(sortType, staticsType) {
            // if (sortType && staticsType) {
            //     $scope.secondSec = true;
            // }
        }

        $scope.getStatics = function() {
            Data.get('getStatics/' + $scope.staticsType + '/' + $scope.sortType + '/' + $scope.dateType + '/' + amountOfData)
        }

        $scope.show = function() {
        var chart = new CanvasJS.Chart("chartContainer", {
            title: {
                text: "My First Chart in CanvasJS"
            },
            data: [{
                // Change type to "doughnut", "line", "splineArea", etc.
                type: "column",
                dataPoints: [
                    { label: "apple", y: 10 },
                    { label: "orange", y: 15 },
                    { label: "banana", y: 25 },
                    { label: "mango", y: 30 },
                    { label: "grape", y: 28 }
                ]
            }]
        });
        chart.render();
        }
    });