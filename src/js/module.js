angular.module('RDash', [
    'ui.bootstrap',
    'ui.router',
    'ngCookies',
    'ui-notification',
    'ui.mask',
    'ngMaterial',
    'angularUtils.directives.dirPagination',
    'zt.angular-loading'
]).config(function (NotificationProvider, $qProvider) {
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