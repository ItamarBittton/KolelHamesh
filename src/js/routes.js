'use strict';

/**
 * Route configuration for the RDash module.
 */
angular.module('RDash').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        // For unmatched routes
        $urlRouterProvider.otherwise('/');

        // Application routes
        $stateProvider
            .state('index', {
                url: '/',
                templateUrl: 'templates/dashboard.html'
            })
            .state('tables', {
                url: '/tables',
                templateUrl: 'templates/tables.html'
            })
            .state('students', {
                url: '/students',
                templateUrl: 'templates/students.html',
                controller: 'studentController'
            })
            .state('colels', {
                url: '/colels',
                templateUrl: 'templates/colel.html',
                controller: 'colelController'
            })
            .state('recomends', {
                url: '/recomends',
                templateUrl: 'templates/recomends.html',
                controller: 'recomendController'
            })
            .state('daily', {
                url: '/daily',
                templateUrl: 'templates/daily.html',
                controller: 'dailyController'
            });
    }
]);