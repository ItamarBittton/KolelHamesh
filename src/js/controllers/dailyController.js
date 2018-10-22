angular.module('RDash').controller("dailyController", function ($scope, Data, $filter) {
    $scope.disable = true;
    $scope.dropList = [];
    $scope.isOnlyDaily = true;
    $scope.status = [];
    $scope.dates = {};
    var dateFormat = "dd/mm/yy";

    $scope.show = function (date) {
        if (date) {
            $scope.date = date;
            $scope.disable = true;

            Data.get('daily/' + $scope.date.toLocaleDateString('en-GB').split('/').reverse().join('-')).then(function (data) {
                $scope.students = data.dailyRep;
                $scope.dropList = data.dropList;
                $scope.tempStudents = { amount: data.tempStudents };
                $scope.status = data.status;
            });
        }
    };

    $scope.copyDates = function () {
        var copyStart = $scope.dates.copyStartDate.split('/');
        var copyEnd = $scope.dates.copyEndDate.split('/');
        var pasteStart = $scope.dates.pasteStartDate.split('/');
        var pasteEnd = $scope.dates.pasteEndDate.split('/');

        Data.post('copyDates', {
            copyStartDate: new Date(copyStart[2], copyStart[1] - 1, copyStart[0]).getTime(),
            copyEndDate: new Date(copyEnd[2], copyEnd[1] - 1, copyEnd[0]).getTime(),
            pasteStartDate: new Date(pasteStart[2], pasteStart[1] - 1, pasteStart[0]).getTime(),
            pasteEndDate: new Date(pasteEnd[2], pasteEnd[1] - 1, pasteEnd[0]).getTime(),
        }).then(function (res) {
            $scope.data = res.data;
            $scope.currentData = $scope.data[0];
            // $scope.oneTimeStudents = res.data[0];
            // $scope.oral_score = res.data[1];
            // $scope.hours = res.data[2];

            $scope.renderChart($scope.currentChart, $scope.currentData);

        })
    }

    $scope.viewDate = {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1
    };

    $scope.changeAll = function (value) {
        $scope.students.forEach(function (x) {
            if (x.is_deleted === 0) {
                x.presence = parseInt(value)
            }
        });
    };

    $scope.students = [];
    $scope.role = $scope.$parent.role;
    Data.get('getProhibitions').then(function (data) {
        if (data) {
            $scope.isOnlyDaily = $scope.$parent.role === 'Admin' ? false : data.is_only_daily;
            $scope.isOneTimeAllow = $scope.$parent.role === 'Admin' || data.is_one_time_allow;
            $scope.reportMonths = data.reportMonths;
            $scope.showStudents = true;
            $scope.show(new Date());

            Data.get('prevDates').then(function (data) {
                $scope.prevDates = data.prevDates;
            });
        }
    });

    $scope.changeMonth = function (currentMonth) {
        if (currentMonth) {
            currentMonth = JSON.parse(currentMonth);
            $scope.viewDate = currentMonth;
            $scope.show(new Date(currentMonth.year, currentMonth.month - 1))
        }
    };

    $scope.lockMonth = function () {
        if (!$scope.checkIfMonth()) {
            Data.post('setLockedMonth', { date: $scope.viewDate }).then(function (data) {
                console.log(data);
            })
        }
    };

    $scope.checkIfMonth = function () {
        var viewDate = $scope.viewDate;
        var bool = false;
        $scope.reportMonths.forEach(function (val) {
            if (val.year == viewDate.year && val.month == viewDate.month) {
                bool = true;
            }
        });

        return bool;
    }

    $scope.save = function (valid) {
        if (!valid) {
            $scope.formErrors = true;
        } else {
            $scope.formErrors = undefined;
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
    };

    $scope.onloadFun = function () {

        var datePickerSettings = {
            closeText: "סגור",
            prevText: "הקודם",
            nextText: "הבא",
            currentText: "היום",
            monthNames: ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני",
                "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"
            ],
            monthNamesShort: ["ינו", "פבר", "מרץ", "אפר", "מאי", "יוני",
                "יולי", "אוג", "ספט", "אוק", "נוב", "דצמ"
            ],
            dayNames: ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"],
            dayNamesShort: ["א'", "ב'", "ג'", "ד'", "ה'", "ו'", "שבת"],
            dayNamesMin: ["א'", "ב'", "ג'", "ד'", "ה'", "ו'", "שבת"],
            weekHeader: "Wk",
            dateFormat: dateFormat,
            firstDay: 0,
            isRTL: true,
            showMonthAfterYear: false,
            yearSuffix: ""
        };

        var copyStartDate = $("#copyStartDate").datepicker(datePickerSettings).on("change", function () {
            copyEndDate.datepicker("option", "minDate", getDate(this));
        });
        var copyEndDate = $("#copyEndDate").datepicker(datePickerSettings).on("change", function () {
            copyStartDate.datepicker("option", "maxDate", getDate(this));
        });
        var pasteStartDate = $("#pasteStartDate").datepicker(datePickerSettings).on("change", function () {
            pasteEndDate.datepicker("option", "minDate", getDate(this));
        });
        var pasteEndDate = $("#pasteEndDate").datepicker(datePickerSettings).on("change", function () {
            pasteStartDate.datepicker("option", "maxDate", getDate(this));
        });
    };

    function getDate(element) {
        var date;
        try {
            date = $.datepicker.parseDate(dateFormat, element.value);
        } catch (error) {
            date = null;
        }

        return date;
    }

    $scope.close = function () {
        $scope.formErrors = undefined;
        $scope.students = undefined;
        $scope.definition = undefined;
        $scope.disable = false;
        document.querySelector(".selected").classList.remove("selected");
    };
});