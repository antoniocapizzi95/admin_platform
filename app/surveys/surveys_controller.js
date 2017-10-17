/**
 * Created by Antonio on 09/10/2017.
 */
'use strict';

(function () {

    angular.module('myApp.surveys', [])
        .controller('surveysCtrl', surveysCtrl);
    surveysCtrl.$inject = ['$scope','$http'];

    function surveysCtrl($scope,$http) {

        var vm= this;

        vm.surveys = [];

        $http.get("http://localhost/mydb/getSurveys.php")
            .then(function (response) {
                var input = JSON.parse(response.data);
                vm.surveys = input.records;
            });



    }



})();