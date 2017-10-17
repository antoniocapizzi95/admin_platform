/**
 * Created by Antonio on 17/10/2017.
 */
'use strict';

(function () {

    angular.module('myApp.newSurvey', [])
        .controller('newSurveyCtrl', newSurveyCtrl);
    newSurveyCtrl.$inject = ['$scope','$location','$http'];

    function newSurveyCtrl($scope,$location,$http) {
        var vm = this;
        vm.newAnswerButtonFlag = true;
        vm.surveyName = "";
        vm.description = "";
        vm.newAnswer = "";
        vm.answers = [];
        vm.addAnswer = function() {
            vm.answers.push(vm.newAnswer);
            vm.newAnswer = "";
            vm.newAnswerButtonFlag = true;
        }

        vm.deleteAnswer = function (index) {
            vm.answers.splice(index, 1);
        }

        vm.confirm = function () {
            if(vm.answers.length>0 && vm.surveyName != "" && vm.description !="") {
                var obj = {name: vm.surveyName, description: vm.description, answers: vm.answers};
                var param = JSON.stringify(obj);

                $http({
                    method: 'POST',
                    url: 'http://localhost/mydb/addSurvey.php',
                    data: "message=" + param,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                })
                    .then(function (response) {
                        $location.path("/surveys");
                    });
            }

        }





    }



})();