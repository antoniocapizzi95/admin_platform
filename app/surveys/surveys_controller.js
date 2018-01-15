
'use strict';
//questo è il controller che gestisce la pagina /surveys (surveys.html)
(function () {

    angular.module('myApp.surveys', [])
        .controller('surveysCtrl', surveysCtrl);
    surveysCtrl.$inject = ['$http','$route','$mdDialog','SettingsService'];

    function surveysCtrl($http,$route,$mdDialog,SettingsService) {

        var vm= this;

        vm.surveys = [];
        var compiledSurveys = [];

        vm.showResult = false;

        $http.get('http://'+SettingsService.serverAddress+'/mydb/surveys.php/all') //viene presa la lista di survey dal database
            .then(function (response) {
                var input = JSON.parse(response.data);
                vm.surveys = input.records;
            });

        vm.deleteSurvey = function(id, ev) { //questa funzione viene eseguita quando si preme il tasto per cancellare le survey

            var confirm = $mdDialog.confirm() //viene lanciato una dialog per avere conferma della cancellazione
                .title('Are you sure you want to delete this survey?')
                .targetEvent(ev)
                .ok('Delete')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(function() {

                $http({ //viene richiesta la cancellazione della survey
                    method: 'DELETE',
                    url: 'http://'+SettingsService.serverAddress+'/mydb/surveys.php/'+id,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                })
                    .then(function (response) {



                        var obj2 = {surv_id:id,type:"survid"};
                        var param2 = JSON.stringify(obj2);
                        $http({ //vengono cancellati anche tutte le assegnazioni degli utenti relative alla survey cancellata
                            method: 'DELETE',
                            url: 'http://'+SettingsService.serverAddress+'/mydb/assignments.php/'+param2,
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        })
                            .then(function (response) {
                                $route.reload();

                            });
                        $http({ //vengono eliminate anche le risposte alla survey cancellata
                            method: 'DELETE',
                            url: 'http://'+SettingsService.serverAddress+'/mydb/answers.php/'+param2,
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        })
                            .then(function (response) {
                                $route.reload();

                            });



                    });
            }, function() {

            });



        }

        vm.selectedSurvName = '';
        vm.selectedAnswers = [];
        vm.thisResultSurvey; //questa variabile conterrà i dati della survey che si è scelto di visualizzare i risultati ricevuti
        vm.showResults = function (surv) { //questa funzione viene eseguita quanbo si preme il bottone per visualizzare i risultati di una survey
            $http.get('http://'+SettingsService.serverAddress+'/mydb/answers.php') //vengono prese tutte le risposte alla survey e poi vengono filtrate solo quelle relative alla surbey selezionata
                .then(function (response) {
                    var input = JSON.parse(response.data);
                    compiledSurveys = input.records;
                    vm.selectedSurvName = surv.surv_name;
                    vm.thisResultSurvey = surv;
                    vm.selectedAnswers = compiledSurveys.filter(function (el) {
                        return (el.surv_id === surv.ID);
                    });
                    vm.showResult = true;
                });
        }

        vm.questionsView; //questa variabile conterrà i dati della survey che si è scelto di visualizzare le domande contenute
        vm.showQuestion = false;
        vm.showQuestions = function (surv) { //questa funzione viene eseguita quando si preme il bottone per visualizzare le domande di una survey
            vm.questionsView = surv;
            vm.showQuestion = true;
        }

        vm.showAnswerForm = false;


        vm.showThisResult = function(ans) { //questa funzione viene eseguita quando si preme il bottone per visualizzare il dettaglio di un risultato di una survey
            vm.showAnswerForm = true;
            vm.thisResult = ans;


        }

        vm.deleteThisResult= function (id,ev) { //questa funzione viene eseguita quando si vuole cancellare un risultato di una survey

            var confirm = $mdDialog.confirm() //comparirà un dialog che chiederà conferma
                .title('Are you sure you want to delete this result?')
                .targetEvent(ev)
                .ok('Delete')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(function() {
                $http({
                    method: 'DELETE',
                    url: 'http://'+SettingsService.serverAddress+'/mydb/answers.php/'+id,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                })
                    .then(function (response) {

                        for (var i = vm.selectedAnswers.length - 1; i >= 0; --i) {
                            if (vm.selectedAnswers[i].ID == id) {
                                vm.selectedAnswers.splice(i,1);
                            }
                        }
                    });


            }, function() {

            });



        }

        var selectSurveyAssignUsers;
        vm.assignUsers = function(ev,surv_id) { //questa funzione viene eseguita quando si clicca sul bottone "assign users" per assegnare gli utenti a una survey

            selectSurveyAssignUsers = surv_id;
            $mdDialog.show({
                controller: assignUsersDialogController,
                templateUrl: 'surveys/assignmentsDialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true
            })
                .then(function() {


                }, function() {

                });
        };

        function assignUsersDialogController($scope, SettingsService) { //questa funzione funge da controller per il dialog contenuto in assignmentsDialog.html, ovvero quello che permette di assegnare gli utenti alle survey
            $scope.users = [];
            $scope.assignedUsers = [];

            $scope.getAssignedUsers =function() { //questa funzione prende tutte le assegnazioni presenti nella tabella "assignments" del db, e seleziona i soli utenti assegnati alla survey selezionata
                $http.get('http://'+SettingsService.serverAddress+'/mydb/users.php')
                    .then(function (response) {
                        var input = JSON.parse(response.data);
                        $scope.users = input.records;

                        var obj = {surv_id: selectSurveyAssignUsers,source:"ap"};
                        var param = JSON.stringify(obj);
                        $http({
                            method: 'GET',
                            url: 'http://'+SettingsService.serverAddress+'/mydb/assignments.php/'+param,
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        })
                            .then(function (response) {
                                var input = JSON.parse(response.data);
                                var resp = input.records;
                                $scope.assignedUsers = [];

                                for(var i=0; i < $scope.users.length;i++) {
                                    for(var j=0; j< resp.length;j++) {
                                        if($scope.users[i].ID == resp[j].us_id) {
                                            $scope.assignedUsers.push($scope.users[i]);
                                            break;
                                        }
                                    }
                                }


                            });
                    });
            };
            $scope.getAssignedUsers();


            $scope.deleteAssegnation = function(id) { //questa è la funzione che viene eseguita quando si preme il bottone per cancellare un utente assegnato a una survey (per cancellare l'assegnazione)
                var obj = {us_id: id,surv_id:selectSurveyAssignUsers,type:"simple"};
                var param = JSON.stringify(obj);
                $http({
                    method: 'DELETE',
                    url: 'http://'+SettingsService.serverAddress+'/mydb/assignments.php/'+param,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                })
                    .then(function (response) {
                        $scope.getAssignedUsers();

                    });

            };

            $scope.addAssegnation = function (id) { //questa è la funzione che viene eseguita quando si aggiunge un utente da assegnare alla survey
                var isPresent = false;
                for (var i=0; i < $scope.assignedUsers.length; i++) {
                    if ($scope.assignedUsers[i].ID == id)
                        isPresent = true;
                }
                if(!isPresent) {
                    var obj = {us_id: id,surv_id:selectSurveyAssignUsers};
                    var param = JSON.stringify(obj);
                    $http({
                        method: 'POST',
                        url: 'http://'+SettingsService.serverAddress+'/mydb/assignments.php',
                        data: "message=" + param,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    })
                        .then(function (response) {
                            $scope.getAssignedUsers();

                        });
                }



            }








        }



    }



})();