angular
    .module('RDash').directive("myCalendar", function () {
        return {
            scope: {
                viewDate: "=",
                show: "&",
                status: '='
            },
            template: `<div class="board">
                           <div class="square"
                                ng-style="{'border-color': day.status}"
                                ng-class="{ 'selected' : (day.gerg.getDate() == currentDate.getDate() && day.gerg.getMonth() == currentDate.getMonth()) }" 
                                id="{{day.key}}"
                                ng-repeat='day in month'
                                ng-click="chooseDay(day)">
                               <div class="date">{{day.val}}<span ng-if="day.gerg" class="gerg">{{day.gerg.getDate() + "/"}}{{day.gerg.getMonth() + 1 == 0 ? 1 : day.gerg.getMonth() + 1}}</span></div>
                           </div>
                       </div>`,
            link: function (scope, element) {
                scope.$watch("status", function (newValue, oldValue) {
                    if (newValue && newValue.length && !angular.equals(newValue, oldValue)) {
                        if (!scope.viewDate) {
                            scope.viewDate = {
                                year: new Date().getFullYear(),
                                month: new Date().getMonth() + 1
                            }
                        }
                        var month = scope.viewDate.month -1,
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
                                    gerg: today,
                                    status: scope.status[currDay]
                                });
                                currDay++;
                            }
                        }
                    }    
                });

                scope.$watch("viewDate", function (newValue, oldValue) {
                    if (newValue) {
                        var month = scope.viewDate.month - 1,
                            year = scope.viewDate.year,
                            range = new Date(year, scope.viewDate.month, 0).getDate(),
                            start = new Date(year, month, 1).getDay();

                        scope.selected = false;
                        scope.currentDate = scope.currentDate || new Date();
                        scope.chooseDay = function (day) {
                            var elementsSelected = document.querySelector(".selected")
                            if (elementsSelected) elementsSelected.classList.remove("selected");
                            document.getElementById(day.key).className += ' selected';
                            day.selected = true;
                            scope.show({
                                date: day.gerg,
                                hebDate: day
                            });
                        }
                        
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
                                    gerg: today,
                                    status: scope.status[currDay]
                                });
                                currDay++;
                            }
                        }
                    }    
                });
            }
        }
    });