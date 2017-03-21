angular.module('RDash').filter('inputfilter', function () {
    return function (item) {
        if (!item) return "";
        if (!item.schedule) return item;

        item.schedule.forEach(function (a, b) {
            item[b] = a.start + ' - ' + a.end;
        });

        delete item.schedule;

        return item;
    };
});