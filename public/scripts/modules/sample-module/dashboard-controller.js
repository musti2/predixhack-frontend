/*jshint -W117 */
/*jshint -W106 */
define(['angular',
    './../../modules/sample-module/sample-module'
], function (angular, controllers) {
    'use strict';

    // Controller definition
    controllers.controller('DashboardCtrl',
        ['$interval', '$scope', '$state', 'uaaService', function ($interval, $scope, $state, uaaService) {
        // PUBLIC METHODS AND VARS (in $scope)
        // ======================
        var token;
        var fireEl = document.getElementsByClassName('flame');
        var combobox = combobox || document.querySelector('.asset-box');
        var flames = document.querySelector('.fire');
        
        flames.style.display = 'none';

        $scope.spinnerHidden = false;

        for(var i=0; i<fireEl.length; i++) {
            fireEl[i].style.animationIterationCount = 0;
            fireEl[i].style.backgroundImage = 'none';
            fireEl[1].style.backgroundImage = 'linear-gradient(to bottom left, #ffc800, #ffffff)';
        }

        var refreshData = function() {
            // Assign to scope within callback to avoid data flickering on screen
            // get token for timeseries service
            uaaService.timeseries().$promise.then(function (response){
                if(response.access_token) {
                    token = response.access_token;
                    // get temperature data
                    $.ajax({

                        contentType: 'application/json',
                        type: 'POST',
                        data: '{"tags":[{"name":["canary_1.temp","canary_1.humd", "canary_1.flame", "canary_1.emergency"]}]}',
                        url: 'https://time-series-store-predix.run.aws-usw02-pr.ice.predix.io/v1/datapoints/latest',
                        headers: {
                            'Predix-Zone-Id': '4f6146a9-017b-401e-9d1a-17d765e15ba8',
                            'Authorization': token,
                            'Content-Type':'application/json'
                        },
                        success: function (data) {
                            var tags = data.tags;
                            tags.forEach(function (v){
                                v.data = v.results[0].values[0];
                            });

                            var currentTemp = tags[0].data;
                            var currentHumidity = tags[1].data;
                            var flameData = tags[2].data;
                            var emergency = tags[3].data;

                            if (flameData[1] === 1){
                                for(var i=0; i<fireEl.length; i++) {
                                    fireEl[i].style.animationIterationCount = 'infinite';
                                    fireEl[0].style.backgroundImage = 'linear-gradient(to bottom left, rgba(255, 34, 0, 0.9), rgba(255, 106, 0, 0.7))';
                                    fireEl[1].style.backgroundImage = 'linear-gradient(to bottom left, rgba(255, 106, 0, 0.1), rgba(255, 200, 0, 0.1))';
                                    fireEl[2].style.backgroundImage = 'linear-gradient(to bottom left, #ffc800, #ffffff)';
                                    fireEl[3].style.backgroundImage = 'linear-gradient(to bottom left, rgba(255, 255, 255, 0.3), rgba(0, 55, 255, 0.9))';
                                }
                            }
                            if (emergency[1] === 1){
                                alert('EMERGENCY!');
                            }

                            updateText.innerHTML = moment(flameData[0]).format('llll');

                            $scope.$temperature = [
                                {label: 'Temperature', value: currentTemp[1], class:'thin bar_green', showValues: true, unit: '&deg;C', tooltip: true},
                                {label: 'Humidity', value: currentHumidity[1], class:'thin', showValues: true, unit: '%', tooltip: true}
                            ];
                            flames.style.display = 'block';
                            $scope.$apply();
                        },

                        error: function (jqXHR, textStatus, errorThrown) {
                            // Here's where you handle an error response.
                            // Note that if the error was due to a CORS issue,
                            // this function will still fire, but there won't be any additional
                            // information about the error.
                            console.log('There was an error making the request. - with status ' + errorThrown);
                        }
                    });
                } else {
                    console.log('no token');
                    return;
                }
            });
        };
        // init
        refreshData();
        // set interval
        var promise = $interval(refreshData, 60000);
        // get token from uaa, for asset service
        uaaService.asset().$promise.then(function (data){
            var assetToken = data.access_token;
            var assetAjax = document.createElement('iron-ajax');
            assetAjax.url = 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/Pi';
            assetAjax.handleAs = 'json';
            assetAjax.headers = {
                'Predix-Zone-Id': '58c5ef88-a029-43bf-a2cc-459d2eb88a99',
                'Authorization': assetToken,
                'Content-Type':'application/json'
            };
            assetAjax.generateRequest();
            assetAjax.addEventListener('response', function(evt) {
                // console.log(evt.detail.response);
                combobox.items = evt.detail.response;
                combobox.value = evt.detail.response[0].value.toString();
            });
        });
        // add event listener to combobox
        combobox.addEventListener('selected-item-changed', function() {
            var label = combobox.querySelector('label');
            label.innerHTML = 'Selected Asset:';
            $scope.selectedDeck = '';
            if (combobox.selectedItem !== null){
                var asset = combobox.selectedItem;
                if (asset.label === 'Sydney-Pi'){
                    $scope.selectedDeck = '../elements/canary-1-deck.html';
                    $scope.spinnerHidden = true;
                } else if (asset.label.includes('2')){
                    $scope.selectedDeck = '../elements/canary-2-deck.html';
                    $scope.spinnerHidden = true;
                }
                $scope.$apply();
            } else {
                return;
            }
        });
        // Cancel interval on page changes
        $scope.$on('$destroy', function(){
            if (angular.isDefined(promise)) {
                $interval.cancel(promise);
                promise = undefined;
            }
        });
    }]);
});
