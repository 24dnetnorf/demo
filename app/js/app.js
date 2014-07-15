'use strict';

/**
 *
 *
 */

(function(){

    /**
     *
     * @param $scope
     * @param $http
     * @constructor
     */
    var SearchController = function($rootScope, $http){
        $rootScope.searchTerm = '';

        $rootScope.search = function(){
            if(this.searchTerm.length > 0){
                var url = 'http://api.openweathermap.org/data/2.5/weather';
                var configs = { params: { 'q':this.searchTerm , 'units':'imperial'} };

                var promise = $http.get(url, configs);

                promise
                    .success(function(data){

                        // Trigger map refresh
                        var args = { "latitude" : data.coord.lat, "longitude" : data.coord.lon };
                        $rootScope.$broadcast('refreshMap', args);

                        $rootScope.city = { 'name':data.name, 'temperature':data.main.temp }

                    })
                    .error();
            }
        }
    }

    var MapController = function($rootScope){
        $rootScope.map = {
            center: {
                latitude: 37.77,
                longitude: -122.42
            },
            zoom: 11,
            pan: true
        };

        $rootScope.$on('refreshMap', function(event, args){
            $rootScope.map = {
                center: {
                    latitude:args.latitude,
                    longitude:args.longitude
                },
                zoom: 11,
                pan: true,
                refresh: true
            }
        });
    }

    /**
     *
     */
    var init = function(){
        /**
         * Instantiate app
         */
        var app = angular.module('app', ['google-maps']);

        /**
         * Register controllers
         */
        app.controller('searchController', SearchController);
        app.controller('mapController', MapController);
    }

    init();
})();