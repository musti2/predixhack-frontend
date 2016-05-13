/*jshint -W117 */
/*jshint -W109 */
/*jshint -W098 */
/**
 * Load controllers, directives, filters, services before bootstrapping the application.
 * NOTE: These are named references that are defined inside of the config.js RequireJS configuration file.
 */
define([
    'jquery',
    'angular',
    'main',
    'routes',
    'interceptors',
    'px-datasource',
    'ng-bind-polymer',
    'angular-resource',
    'px-timeseries'
], function ($, angular) {
    'use strict';

    /**
     * Application definition
     * This is where the AngularJS application is defined and all application dependencies declared.
     * @type {module}
     */
    var predixApp = angular.module('predixApp', [
        'app.routes',
        'app.interceptors',
        'sample.module',
        'predix.datasource',
        'px.ngBindPolymer',
        'ngResource'
    ]);

    /**
     * Main Controller
     * This controller is the top most level controller that allows for all
     * child controllers to access properties defined on the $rootScope.
     */
    predixApp.controller('MainCtrl', ['$scope', '$rootScope', '$state', '$location', 'PredixUserService','uaaService',
        function ($scope, $rootScope, $state, $location, predixUserService, uaaService) {

        $scope.navTemplateUrl = 'views/navbar.html';

        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
            if (angular.isObject(error) && angular.isString(error.code)) {
                switch (error.code) {
                    case 'UNAUTHORIZED':
                        //redirect
                        predixUserService.login(toState);
                        break;
                    default:
                        //go to other error state
                }
            }
            else {
                // unexpected error
            }
        });
        $rootScope.$state = $state;

        var header = $('.cd-main-header'),
            sidebar = $('.cd-side-nav'),
            sidebarTrigger = $('.cd-nav-trigger'),
            topNavigation = $('.cd-top-nav'),
            notifications = $('.notifications');
        var resizing = false;

        $(window).on('resize', function(){
            if( !resizing ) {
                window.requestAnimationFrame(moveNavigation);
                resizing = true;
            }
        });

        sidebarTrigger.on('click', function(event){
            event.preventDefault();
            $([sidebar, sidebarTrigger]).toggleClass('nav-is-visible');
        });

        notifications.children('a').on('click', function(event){
            var subMenu = notifications.children('ul');
            subMenu.toggleClass('hidden');
        });

        function checkMQ() {
            //check if mobile or desktop device
            return window.getComputedStyle(document.querySelector('.cd-main-content'), '::before').getPropertyValue('content').replace(/'/g, "").replace(/"/g, "");
        }

        function moveNavigation(){
            var mq = checkMQ(); //this function returns mobile,tablet or desktop 

            if ( mq === 'mobile' && topNavigation.parents('.cd-side-nav').length === 0 ) { //topNavigation = $('.cd-top-nav')
                detachElements();
                topNavigation.appendTo(sidebar); //sidebar = $('.cd-side-nav')
            } else if ( ( mq === 'tablet' || mq === 'desktop') && topNavigation.parents('.cd-side-nav').length > 0 ) {
                detachElements();
                topNavigation.appendTo(header.find('.cd-nav'));
            }
            resizing = false;
        }

        function detachElements() {
            topNavigation.detach();//topNavigation = $('.cd-top-nav')
        }
        moveNavigation();

        var updateText = document.getElementById('updateText');

    }]);

    //Set on window for debugging
    window.predixApp = predixApp;

    //Return the application  object
    return predixApp;
});
