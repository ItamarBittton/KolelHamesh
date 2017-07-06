(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function () {
    angular.module('zt.angular-loading', []);
    require('./loading.provider.js');
    require('./loading.directive.js');
})();
},{"./loading.directive.js":2,"./loading.provider.js":3}],2:[function(require,module,exports){
(function() {
    angular.module('zt.angular-loading')
        .directive('loading', function ($http, $timeout, Loading) {
            return {
                priority: -1000,
                restrict: 'A',
                link: function ($scope, elm, attrs)
                {
                    var self = this;
                    self.latencyThresholdReached = false;
                    self.latencyTimeoutSet = false;
                    $scope.isLoading = function () {
                        var numRequests;
                        if (Loading.forceLoading) {
                            return true;
                        }
                        self.setLatencyTimeout();
                        numRequests = self.calcNumRequests();
                        self.resetTimeout(numRequests);
                        return numRequests > 0;
                    };
                    self.resetTimeout = function(numRequests) {
                        if (numRequests === 0 && self.latencyThresholdReached === true) {
                            self.latencyTimeoutSet = false;
                            self.latencyThresholdReached = false;
                        }
                    };
                    self.setLatencyTimeout = function() {
                        if (!self.latencyTimeoutSet) {
                            $timeout(function() {
                                self.latencyThresholdReached = true;
                            }, Loading.latencyThreshold);
                            self.latencyTimeoutSet = true;
                        }
                    };
                    self.calcNumRequests = function() {
                        var numRequests = 0;
                        for (var i = $http.pendingRequests.length - 1; i >= 0; i--) {
                            if (Loading.requestTypes.indexOf($http.pendingRequests[i].method) < 0) {
                                continue;
                            }
                            if ($http.pendingRequests[i].hideLoading) {
                                continue;
                            }
                            if (self.latencyThresholdReached) {
                                numRequests += 1;
                            }
                        }
                        return numRequests;
                    };
                    $scope.$watch($scope.isLoading, function(status)
                    {
                        if (status) {
                            elm[0].style.visibility = 'visible';
                        } else {
                            elm[0].style.visibility = 'hidden';
                        }
                    });
                }
            };
        });
})();
},{}],3:[function(require,module,exports){
(function () {
    angular.module('zt.angular-loading')
        .provider('Loading', function Loading() {
            this.requestTypes = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
            this.latencyThreshold = 0;
            this.show = function() {
                this.forceLoading = true;
            }.bind(this);
            this.hide = function() {
                this.forceLoading = false;
            }.bind(this);
            this.$get = ['$timeout', function($timeout) {
                var self = this;
                self.showFor = function(milliseconds) {
                    self.show();
                    $timeout(function() {
                        self.hide();
                    }, milliseconds);
                }.bind(this);
                return self;
            }];
        });
})();
},{}]},{},[1])