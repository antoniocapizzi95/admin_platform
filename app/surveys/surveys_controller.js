/**
 * Created by Antonio on 09/10/2017.
 */
'use strict';

(function () {

    angular.module('myApp.surveys', [])
        .controller('surveysCtrl', surveysCtrl);
    surveysCtrl.$inject = ['$scope','$http','$route','$mdDialog'];

    function surveysCtrl($scope,$http,$route,$mdDialog) {

        var vm= this;

        vm.surveys = [];
        var compiledSurveys = [];

        vm.showResults = false;

        $http.get("http://localhost/mydb/getSurveys.php")
            .then(function (response) {
                var input = JSON.parse(response.data);
                vm.surveys = input.records;
            });

        vm.deleteSurvey = function(id, name) {
            var obj = {id: id};
            var param = JSON.stringify(obj);
            $http({
                method: 'POST',
                url: 'http://localhost/mydb/deleteSurvey.php',
                data: "message=" + param,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
                .then(function (response) {



                    var obj2 = {surv_name:name};
                    var param2 = JSON.stringify(obj2);
                    $http({
                        method: 'POST',
                        url: 'http://localhost/mydb/deleteAssociationBySurvName.php',
                        data: "message=" + param2,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    })
                        .then(function (response) {
                            $route.reload();

                        });



                });
        }

        vm.showResults = function (surv) {
            $http.get("http://localhost/mydb/getAnswers.php")
                .then(function (response) {
                    var input = JSON.parse(response.data);
                    compiledSurveys = input.records;
                    vm.selectedSurvName = surv.name;
                    vm.selectedAnswers = compiledSurveys.filter(function (el) {
                        return (el.object.surv_name === surv.object.name);
                    });
                    vm.showResults = true;
                });
        }

        vm.showAnswerForm = false;

        vm.showThisResult = function(ans) {
            vm.showAnswerForm = true;
            vm.thisResult = ans;
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

        function assignUsersDialogController($scope, $mdDialog, $route) {
            $scope.users = [];
            $scope.assignedUsers = [];

            $scope.getAssignedUsers =function() {
                $http.get("http://localhost/mydb/getUsers.php")
                    .then(function (response) {
                        var input = JSON.parse(response.data);
                        $scope.users = input.records;

                        var obj = {surv_name: selectSurveyAssignUsers};
                        var param = JSON.stringify(obj);
                        $http({
                            method: 'POST',
                            url: 'http://localhost/mydb/getAssociations.php',
                            data: "message=" + param,
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
                var obj = {us_id: id,surv_name:selectSurveyAssignUsers};
                var param = JSON.stringify(obj);
                $http({
                    method: 'POST',
                    url: 'http://localhost/mydb/deleteAssociation.php',
                    data: "message=" + param,
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
                        url: 'http://localhost/mydb/addAssociation.php',
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