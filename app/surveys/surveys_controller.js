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

        $http.get("http://localhost/mydb/getSurveys.php")
            .then(function (response) {
                var input = JSON.parse(response.data);
                vm.surveys = input.records;
            });

        vm.deleteSurvey = function(id) {
            var obj = {id: id};
            var param = JSON.stringify(obj);
            $http({
                method: 'POST',
                url: 'http://localhost/mydb/deleteSurvey.php',
                data: "message=" + param,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
                .then(function (response) {
                    //$location.path("/surveys");
                    $route.reload();
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

        function assignUsersDialogController($scope, $mdDialog) {
            $scope.users = [];
            $scope.assignedUsers = [];
            $http.get("http://localhost/mydb/getUsers.php")
                .then(function (response) {
                    var input = JSON.parse(response.data);
                    $scope.users = input.records;

                    $http({
                        method: 'POST',
                        url: 'http://localhost/mydb/getAssociations.php',
                        data: "message=" + param,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    })
                        .then(function (response) {
                            var input = JSON.parse(response.data);
                            var resp = input.records;

                            $scope.assignedUsers = $scope.users.filter(function (elem) {
                                return elem.id == resp.us_id;
                            });

                        });
                });

            var obj = {surv_name: selectSurveyAssignUsers};
            var param = JSON.stringify(obj);




        }



    }



})();