angular.module('RDash').filter('timeFilter', function () {
    return function (input) {
        if (typeof input !== "number" || input < 0) return "00:00";

        function pad(n) { return (n < 10 ? '0' : '') + n; }

        var hours = parseInt(input);
        var minutes = Math.ceil(input % 1 * 60);

        return (pad(hours) + ':' + pad(minutes));
    }
});