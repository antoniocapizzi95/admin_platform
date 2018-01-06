/**
 * Created by Antonio on 17/10/2017.
 */
'use strict';

(function () {

    angular.module('myApp.newSurvey', [])
        .controller('newSurveyCtrl', newSurveyCtrl);
    newSurveyCtrl.$inject = ['$scope','$location','$http','SettingsService'];

    function newSurveyCtrl($scope,$location,$http,SettingsService) {
        var vm = this;
        vm.newQuestionButtonFlag = true;
        vm.surveyName = "";
        vm.description = "";
        vm.newQuestion = "";
        vm.questions = [];

        vm.message = "";

        vm.addQuestion = function() {
            vm.questions.push(vm.newQuestion);
            vm.newQuestion = "";
            vm.newQuestionButtonFlag = true;
        }

        vm.deleteQuestion = function (index) {
            vm.questions.splice(index, 1);
        }

        vm.confirm = function () {
            if(vm.questions.length>0 && vm.surveyName != "" && vm.description !="") {


                $http.get('http://'+SettingsService.serverAddress+'/mydb/surveys.php')
                    .then(function (response) {
                        var input = JSON.parse(response.data);
                        var surveys = input.records;
                        var flag = false;
                        for(var i=0; i<surveys.length;i++) {
                            if(vm.surveyName == surveys[i].object.name) {
                                flag = true;
                                break;
                            }
                        }
                        if(!flag) {
                            sendSurvey();
                        } else {
                            vm.message = "This Survey Name already exist, choose a different Survey Name";
                        }
                    });


            } else {
                vm.message = "Required fields are empty or there aren't questions";
            }

        }

        function sendSurvey() {
            var obj = {name: vm.surveyName, description: vm.description, questions: vm.questions};
            var param = JSON.stringify(obj);

            $http({
                method: 'POST',
                url: 'http://'+SettingsService.serverAddress+'/mydb/surveys.php',
                data: "message=" + param,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
                .then(function (response) {
                    $location.path("/surveys");
                });
        }





    }



})();