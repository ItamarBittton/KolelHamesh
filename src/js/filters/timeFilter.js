angular.module('RDash').filter('timeFilter', function ($filter) {
    return function (input) {
        if (typeof input !== "number" || input < 0) return "00:00";

        function pad(n) { return (n < 10 ? '0' : '') + n; }

        var hours = pad(parseInt(input));
        var minutes = pad(Math.ceil(input % 1 * 60));

        return ($filter('number')(hours) + ':' + minutes);
    };
});