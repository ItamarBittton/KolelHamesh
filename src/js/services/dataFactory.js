// This service connects to our REST API
angular.module('RDash').factory("Data", function ($http, Notification) {

    var serviceBase = '/';

    var obj = {};
    var alertMessage = function (data) {
        if (data.success) Notification.success(data.success);
        if (data.error) Notification.error(data.error);
    }
    obj.get = function (q, external) {
        var path = external ? q : serviceBase + q;
        return $http.get(path).then(function (results) {
            alertMessage(results.data);
            return results.data;
        });
    };
    obj.post = function (q, object) {
        return $http.post(serviceBase + q, object).then(function (results) {
            alertMessage(results.data);
            return results.data;
        });
    };
    obj.put = function (q, object) {
        return $http.put(serviceBase + q, object).then(function (results) {
            alertMessage(results.data);
            return results.data;
        });
    };
    obj.delete = function (q) {
        return $http.delete(serviceBase + q).then(function (results) {
            alertMessage(results.data);
            return results.data;
        });
    };

    return obj;
});