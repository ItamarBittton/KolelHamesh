angular.module('RDash').service("Helper", function () {
    this.parseJson = function (data) {
        try {
            var a = JSON.parse(data);
            return a;
        } catch (ex) {
            return {};
        }
    };
    
    this.stringifyJson = function (data) {
        try {
            var a = JSON.stringify(data);
            return a;
        } catch (ex) {
            return "";
        }
    };
});