define(['angular', './sample-module'], function(angular, module) {
    'use strict';

    /**
     * PredixAssetService is a sample service that integrates with Predix Asset Server API
     */
    module.factory('timeSeriesService', ['$q', '$http', 'uaaService', function($q, $http, uaaService) {
        // var serviceUrl = '//3.185.126.104/share/newData.otd.js';

        // var tsUrl = 'https://time-series-store-predix.run.aws-usw02-pr.ice.predix.io/v1/datapoints';
        var token;
         // call uaa service and fetch token for time series service
        uaaService.timeseries(function (response){

            if(response.accessToken) {
                token = response.accessToken;
            } else {
                console.log('no token');
                return;
            }
        });

    }]);
});