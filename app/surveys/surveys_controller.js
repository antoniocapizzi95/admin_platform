/**
 * Created by Antonio on 09/10/2017.
 */
'use strict';

(function () {

    angular.module('myApp.surveys', [])
        .controller('surveysCtrl', surveysCtrl);
    surveysCtrl.$inject = ['$scope','$http','$route','$mdDialog','SettingsService'];

    function surveysCtrl($scope,$http,$route,$mdDialog,SettingsService) {

        var vm= this;

        vm.surveys = [];
        var compiledSurveys = [];

        vm.showResult = false;

        $http.get('http://'+SettingsService.serverAddress+'/mydb/surveys.php')
            .then(function (response) {
                var input = JSON.parse(response.data);
                vm.surveys = input.records;
            });

        vm.deleteSurvey = function(id, name, ev) {

            var confirm = $mdDialog.confirm()
                .title('Are you sure you want to delete this survey?')
                .targetEvent(ev)
                .ok('Delete')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(function() {
                //$scope.status = 'You decided to get rid of your debt.';
                $http({
                    method: 'DELETE',
                    url: 'http://'+SettingsService.serverAddress+'/mydb/surveys.php/'+id,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                })
                    .then(function (response) {



                        var obj2 = {surv_name:name,bySurvName:"true"};
                        var param2 = JSON.stringify(obj2);
                        $http({
                            method: 'DELETE',
                            url: 'http://'+SettingsService.serverAddress+'/mydb/associations.php/'+param2,
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        })
                            .then(function (response) {
                                $route.reload();

                            });



                    });
            }, function() {
                //$scope.status = 'You decided to keep your debt.';
            });



        }

        vm.selectedSurvName = '';
        vm.selectedAnswers = [];
        vm.showResults = function (surv) {
            $http.get('http://'+SettingsService.serverAddress+'/mydb/answers.php')
                .then(function (response) {
                    var input = JSON.parse(response.data);
                    compiledSurveys = input.records;
                    vm.selectedSurvName = surv.object.name;
                    vm.selectedAnswers = compiledSurveys.filter(function (el) {
                        return (el.object.surv_name === surv.object.name);
                    });
                    vm.showResult = true;
                });
        }

        vm.questionsView;
        vm.showQuestion = false;
        vm.showQuestions = function (surv) {
            vm.questionsView = surv;
            vm.showQuestion = true;
        }

        vm.showAnswerForm = false;

        vm.showThisResult = function(ans) {
            vm.showAnswerForm = true;
            vm.thisResult = ans;
        }

        vm.deleteThisResult= function (id,ev) {

            var confirm = $mdDialog.confirm()
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
                //$scope.status = 'You decided to keep your debt.';
            });



        }

        var selectSurveyAssignUsers;
        vm.assignUsers = function(ev,survey) {
            //FormService.setCurrDestArr(scope.question.elements);
            selectSurveyAssignUsers = survey;
            $mdDialog.show({
                controller: assignUsersDialogController,
                templateUrl: 'dialog/associationsDialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true
            })
                .then(function() {
                    //$scope.status = 'You said the information was "' + answer + '".';

                }, function() {
                    //$scope.status = 'You cancelled the dialog.';
                });
        };

        function assignUsersDialogController($scope, $mdDialog, $route, SettingsService) {
            $scope.users = [];
            $scope.assignedUsers = [];

            $scope.getAssignedUsers =function() {
                $http.get('http://'+SettingsService.serverAddress+'/mydb/users.php')
                    .then(function (response) {
                        var input = JSON.parse(response.data);
                        $scope.users = input.records;

                        var obj = {surv_name: selectSurveyAssignUsers,source:"ap"};
                        var param = JSON.stringify(obj);
                        $http({
                            method: 'GET',
                            url: 'http://'+SettingsService.serverAddress+'/mydb/associations.php/'+param,
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


            $scope.deleteAssegnation = function(id) {
                var obj = {us_id: id,surv_name:selectSurveyAssignUsers,bySurvName:"false"};
                var param = JSON.stringify(obj);
                $http({
                    method: 'DELETE',
                    url: 'http://'+SettingsService.serverAddress+'/mydb/association.php/'+param,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                })
                    .then(function (response) {
                        $scope.getAssignedUsers();

                    });

            };

            $scope.addAssegnation = function (id) {
                var isPresent = false;
                for (var i=0; i < $scope.assignedUsers.length; i++) {
                    if ($scope.assignedUsers[i].ID == id)
                        isPresent = true;
                }
                if(!isPresent) {
                    var obj = {us_id: id,surv_name:selectSurveyAssignUsers};
                    var param = JSON.stringify(obj);
                    $http({
                        method: 'POST',
                        url: 'http://'+SettingsService.serverAddress+'/mydb/associations.php',
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