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
        vm.newQuestionButtonFlag = true;
        vm.surveyName = "";
        vm.description = "";
        vm.newQuestions = "";
        vm.questions = [];
        vm.addQuestion = function() {
            vm.questions.push(vm.newQuestions);
            vm.newQuestions = "";
            vm.newQuestionButtonFlag = true;
        }

        vm.deleteQuestions = function (index) {
            vm.questions.splice(index, 1);
        }

        vm.confirm = function () {
            if(vm.questions.length>0 && vm.surveyName != "" && vm.description !="") {
                var obj = {name: vm.surveyName, description: vm.description, questions: vm.questions};
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