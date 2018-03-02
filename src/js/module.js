angular.module('RDash', [
    'ui.bootstrap',
    'ui.router',
    'ngCookies',
    'ui-notification',
    'ui.mask',
    'ngMaterial',
    'angularUtils.directives.dirPagination',
    'zt.angular-loading',
    'isteven-multi-select'
]).config(function (NotificationProvider, $qProvider, $mdDateLocaleProvider) {
    $mdDateLocaleProvider.formatDate = function (date) {

        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();

        return day + '/' + (monthIndex + 1) + '/' + year;

    };
    $qProvider.errorOnUnhandledRejections(false);
    NotificationProvider.setOptions({
        startTop: 20,
        startRight: 10,
        verticalSpacing: 20,
        horizontalSpacing: 20,
        positionX: 'left',
        positionY: 'bottom'
    });
});