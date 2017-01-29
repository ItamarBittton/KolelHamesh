'use strict';

/**
 * Route configuration for the RDash module.
 */
angular.module('RDash').config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

        // For unmatched routes
        $urlRouterProvider.otherwise('/');

        // Application routes
        $stateProvider
            // דף הבית    
            .state('index', {
                url: '/',
                templateUrl: 'templates/settings.html',
                controller: 'settingsController'
            })
            // למחוק
            .state('tables', {
                url: '/tables',
                templateUrl: 'templates/tables.html'
            })
            // אברכים
            .state('students', {
                url: '/students',
                templateUrl: 'templates/students.html',
                controller: 'studentController'
            })
            // כוללים
            .state('colels', {
                url: '/colels',
                templateUrl: 'templates/colel.html',
                controller: 'colelController'
            })
            // רשימת המלצות
            .state('recomends', {
                url: '/recomends',
                templateUrl: 'templates/recomends.html',
                controller: 'recomendController'
            })
            // דוח נוכחות
            .state('daily', {
                url: '/daily',
                templateUrl: 'templates/daily.html',
                controller: 'dailyController'
            })
            // ציונים
            .state('scores', {
                url: '/scores',
                templateUrl: 'templates/scores.html',
                controller: 'scoresController'
            });
    }
]);