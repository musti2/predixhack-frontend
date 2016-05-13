define(['angular', './sample-module'], function(angular, sampleModule) {
    'use strict';

    sampleModule.directive('barGroup', ['$window', '$timeout', function($window) {
        return {
                restrict: 'E',
                replace: true,
                scope: {
                    source: '='
                },
                link: function (scope, element, attrs) {
                    scope.element = element;
                    var checkAndRefreshBars = function () {
                        angular.forEach(scope.bars, function (bar) {
                            var docViewTop = $window.pageYOffset;
                            var docViewBottom = docViewTop + $window.innerHeight;
                            var elemTop = bar.element[0].getBoundingClientRect().top + docViewTop;
                            var elemBottom = elemTop + bar.element[0].offsetHeight;
                            if (docViewBottom > elemBottom - 45) {
                                bar.element.css('width', bar.value / scope.maxValue * 100 + '%');
                            }
                        });
                    };
                    var refreshBars = function () {
                        scope.bars = [];
                        var barElements = scope.element.children(),
                            replaceElement = angular.element('<div class="bar_group"></div>');
                        scope.maxValue = attrs.max || 0;
                        if (scope.source) {
                            scope.bars = scope.source;
                        } else {
                            angular.forEach(barElements, function (barElement) {
                                var barValue = parseFloat(barElement.attributes.nodeValue);
                                var newBar = {value: barValue};
                                if (barElement.attributes.label) {
                                    newBar.label = barElement.attributes.label.value;
                                }
                                if (barElement.attributes.showValues) {
                                    newBar.showValues = true;
                                }
                                if (barElement.attributes.tooltip) {
                                    newBar.tooltip = true;
                                }
                                if (barElement.attributes.unit) {
                                    newBar.unit = barElement.attributes.unit.value;
                                }
                                if (barElement.attributes.class) {
                                    newBar.class = barElement.attributes.class.value;
                                }

                                scope.bars.push(newBar);
                            });
                        }


                        angular.forEach(scope.bars, function (bar) {
                            var barElement = angular.element('<div class="bar_group__bar"></div>');

                            if (bar.class) {
                                barElement.addClass(bar.class);
                            }
                            if (bar.label) {
                                replaceElement.append('<p class="b_label">' + bar.label + '</p>');
                            }

                            if (bar.tooltip) {
                                barElement.css('margin-bottom', '40px');
                                barElement.append('<div class="b_tooltip"><span>' + bar.value + '</span><div class="b_tooltip--tri"></div></div>');
                            }
                            if (bar.showValues) {
                                barElement.css('margin-bottom', '40px');
                                if (bar.unit) {
                                    barElement.append('<p class="bar_label_min">0 ' + bar.unit + '</p>');
                                    barElement.append('<p class="bar_label_max">' + scope.maxValue + ' ' + bar.unit + '</p>');
                                } else {
                                    barElement.append('<p class="bar_label_min">0</p>');
                                    barElement.append('<p class="bar_label_max">' + scope.maxValue + '</p>');
                                }
                            }
                            bar.element = barElement;
                            replaceElement.append(barElement);

                            if (scope.maxValue < bar.value) {
                                scope.maxValue = bar.value;
                            }
                        });
                        scope.element.empty();
                        scope.element.append(replaceElement);

                        checkAndRefreshBars();
                        angular.element($window).unbind('scroll', checkAndRefreshBars);
                        angular.element($window).bind('scroll', checkAndRefreshBars);

                    };

                    refreshBars();

                    scope.$watch('source', function (newValue, oldValue) {
                        if (newValue !== oldValue) {
                            refreshBars();
                        }
                    });

                }
            };
    }]);

    return sampleModule;
});
    