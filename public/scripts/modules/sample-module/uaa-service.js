define(['angular', './sample-module'], function(angular, module) {
    'use strict';

    /**
     * PredixAssetService is a sample service that integrates with Predix Asset Server API
     */
    module.factory('uaaService', ['$q', '$resource', function($q, $resource) {
        // var serviceUrl = '//3.185.126.104/share/newData.otd.js';

        var uaaUrl = 'https://16946739-93fd-40ed-b61e-a12cf7b3d0b8.predix-uaa.run.aws-usw02-pr.ice.predix.io/oauth/token';
        var assetAuth = btoa('asset-client:secret');
        var tsAuth = btoa('ts-client:secret');

        return $resource(uaaUrl, {},
        {
            'asset': {
                method: 'GET',
                headers: {
                    'Authorization': 'Basic '+assetAuth
                },
                params: {
                    'grant_type':'client_credentials',
                    'client_id':'asset-client'
                },
                cache: false,
                isArray: false
            },
            'timeseries': {
                method: 'GET',
                headers: {
                    'Authorization': 'Basic '+tsAuth
                },
                params: {
                    'grant_type':'client_credentials',
                    'client_id':'ts-client'
                },
                cache: false,
                isArray: false
            }
        });

    }]);
});