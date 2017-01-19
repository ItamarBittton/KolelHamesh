angular
    .module('RDash').directive("myCalendar", function () {
        return {
            scope: {
                viewDate: "=",
                show: "&"
            },
            template: `<div class="board">
                           <div class="square" ng-repeat='day in month' ng-click="show({date : day.gerg})">
                               <div class="date">{{day.val}}</div>
                           </div>
                       </div>`,
            link: function (scope) {
                var month = scope.viewDate.month,
                    year = scope.viewDate.year,
                    range = new Date(year, month - 1, 0).getDate(),
                    start = new Date(year, month - 1, 1).getDay();

                scope.month = [];
                for (var i = 0; i < 35; i++) {
                    if (i < start || i > range) {
                        scope.month.push({
                            key: i
                        });
                    } else {
                        var today = new Date(year, month - 1, i + 1),
                            HebDate = new Hebcal.HDate(new Date(today)).toString('h').split(' ').slice(0, 2).join(' ');
                        scope.month.push({
                            key: i,
                            val: HebDate,
                            gerg: today
                        });
                    }
                }
            }
        }
    });