angular
    .module('RDash').directive("myCalendar", function () {
        return {
            scope: {
                viewDate: "=",
                show: "&"
            },
            template: `<div class="board">
                           <div class="square" ng-repeat='day in month' ng-click="show({date : day.gerg})">
                               <div class="date">{{day.val}}<span class="gerg">{{day.gerg.getDate()}}</span></div>
                           </div>
                       </div>`,
            link: function (scope) {
                var month = scope.viewDate.month - 1,
                    year = scope.viewDate.year,
                    range = new Date(year, scope.viewDate.month, 0).getDate(),
                    start = new Date(year, month, 1).getDay();

                scope.month = [];
                var currDay = 0;
                for (var i = 0; i < 35; i++) {
                    if (i < start || i >= range + start) {
                        scope.month.push({
                            key: i
                        });
                    } else {
                        var today = new Date(year, month, currDay + 1),
                            HebDate = new Hebcal.HDate(new Date(today)).toString('h').split(' ').slice(0, 2).join(' ');
                        scope.month.push({
                            key: i,
                            val: HebDate,
                            gerg: today
                        });
                        currDay++;
                    }
                }
            }
        }
    });