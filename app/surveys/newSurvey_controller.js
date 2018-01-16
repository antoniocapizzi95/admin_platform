
'use strict';
//questo è il controller che gestisce la pagina /sewSurvey(newSurvey.html)
(function () {

    angular.module('myApp.newSurvey', [])
        .controller('newSurveyCtrl', newSurveyCtrl);
    newSurveyCtrl.$inject = ['$location','$http','SettingsService'];

    function newSurveyCtrl($location,$http,SettingsService) {
        var vm = this;
        vm.newQuestionButtonFlag = true;
        vm.surveyName = "";
        vm.description = "";
        vm.newQuestion = "";
        vm.questions = []; //questo array conterrà le domande della survey

        vm.message = "";

        vm.addQuestion = function() { //questa è la funzione che viene eseguita quando si preme il bottone che serve ad aggiungere una nuova domanda
            vm.questions.push(vm.newQuestion);
            vm.newQuestion = "";
            vm.newQuestionButtonFlag = true;
        }

        vm.deleteQuestion = function (index) { //questa funzione viene eseguita quando si preme il bottone per cancellare una domanda
            vm.questions.splice(index, 1);
        }

        vm.confirm = function () { // questa è la funzione che viene eseguita quando si preme il bottone per confermare la survey creata
            if(vm.questions.length>0 && vm.surveyName != "" && vm.description !="") { //viene verificato che non manchino le informazioni obbligatorie


                $http.get('http://'+SettingsService.serverAddress+'/mydb/surveys.php/all') //vengono prese le survey dal db per controllare che la survey creata non sia già presente sul db
                    .then(function (response) {
                        var input = JSON.parse(response.data);
                        var surveys = input.records;
                        var flag = false;
                        for(var i=0; i<surveys.length;i++) {
                            if(vm.surveyName == surveys[i].surv_name) {
                                flag = true;
                                break;
                            }
                        }
                        if(!flag) {
                            sendSurvey(); //se la survey non è presente sul db, viene inviata e viene creata
                        } else {
                            vm.message = "This Survey Name already exist, choose a different Survey Name";
                        }
                    });


            } else {
                vm.message = "Required fields are empty or there aren't questions";
            }

        }

        function sendSurvey() { //questa funzione viene eseguita per inserire la nuova survey sul db con un metodo post
            var obj = {name: vm.surveyName, description: vm.description, questions: vm.questions};
            var param = JSON.stringify(obj);

            $http({
                method: 'POST',
                url: 'http://'+SettingsService.serverAddress+'/mydb/surveys.php',
                data: "message=" + param,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
                .then(function (response) {
                    $location.path("/surveys"); //quando la survey viene creata si torna alla pagina /surveys
                });
        }





    }



})();