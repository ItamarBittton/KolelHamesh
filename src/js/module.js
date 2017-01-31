angular.module('RDash', ['ui.bootstrap', 'ui.router', 'ngCookies', 'ui-notification', 'ui.mask'])
    .config(function (NotificationProvider) {
        NotificationProvider.setOptions({
            startTop: 20,
            startRight: 10,
            verticalSpacing: 20,
            horizontalSpacing: 20,
            positionX: 'left',
            positionY: 'bottom'
        });
    });;