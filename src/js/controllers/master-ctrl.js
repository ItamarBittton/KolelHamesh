/**
 * Master Controller
 */

angular.module('RDash')
    .controller('MasterCtrl', function MasterCtrl($scope, $cookies, $rootScope, translate, $location, Data, $state) {
        /**
         * Sidebar Toggle & Cookie Control
         */
        var mobileView = 992;
        var watch = false;
        $scope.currMonth;

        $scope.userName = $cookies.get('user') || 'משתמש';

        $scope.downloadReport = function(chosenMonth) {
            console.log($scope.currMonth)
        }

        $scope.getWidth = function() {
            return window.innerWidth;
        };

        $scope.logout = function() {
            // Clear all cookies.
            document.cookie.split(";").forEach(function(c) {
                document.cookie = c.replace(/^ +/, "").replace(
                    /=.*/, "=;expires=" + new Date().toUTCString() +
                    ";path=/");
            });

            window.location.href = '/';
        };

        $scope.$watch($scope.getWidth, function(newValue, oldValue) {
            if (newValue >= mobileView) {
                if (angular.isDefined($cookies.get('toggle'))) {
                    $scope.toggle = !$cookies.get('toggle') ? false : true;
                } else {
                    $scope.toggle = true;
                }
            } else {
                $scope.toggle = false;
            }

        });

        $scope.toggleSidebar = function() {
            $scope.toggle = !$scope.toggle;
            $cookies.put('toggle', $scope.toggle);
        };

        $scope.isAgreed = function() {
            return $cookies.get('agree');
        };

        $scope.role = $cookies.get('link');
        $rootScope.t = translate;

        window.onresize = function() {
            $scope.$apply();
        };

        $scope.changedColel = function(e) {

            Data.put('updColel', { currColel: this.currColel }).then(function(data) {
                $state.reload();
            });
        };

        if ($scope.role == 'Admin') {
            Data.get('colelList').then(function(data) {
                $scope.currColel = data.colel_id;
                $scope.colelList = data.colelList;
            });
        } else {
            Data.get('getLockedMonths').then(function(data) {
                $scope.reportMonths = data.reportMonths;
            })
        }

        var state;
        $("select.form-control").click(function(event) {
            var isMenu = $(this).parent().find('ul').text();
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                if (isMenu == "") {
                    window.location = $(this).attr('href');
                } else {
                    if (!state) {
                        state = true;
                        return false;
                    } else {
                        state = false;
                        window.location = $(this).attr('href');
                    }
                }
            } else {
                window.location = $(this).attr('href');
            }
        });
    });