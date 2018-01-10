/**
 * Created by Antonio on 09/10/2017.
 */
'use strict';

(function () {

    angular.module('myApp.users', ['ngRoute'])
        .controller('usersCtrl', usersCtrl);
    usersCtrl.$inject = ['$scope','$http','$route','SettingsService','$mdDialog'];

    function usersCtrl($scope,$http,$route,SettingsService,$mdDialog) {

        var vm = this;

        vm.users = [];
        vm.addUserButtonShow = true;
        vm.newUsername = '';
        vm.newPassword = '';
        vm.rePsw = '';

        vm.message = '';

        $http.get('http://'+SettingsService.serverAddress+'/mydb/users.php')
            .then(function (response) {
                var input = JSON.parse(response.data);
                vm.users = input.records;
            });

        vm.addUser = function () {
            if(vm.newPassword == vm.rePsw && vm.newPassword!='') {
                vm.message = '';
                var isPresent = false;
                for(var i=0; i<vm.users.length; i++) {
                    if(vm.users[i].username == vm.newUsername) {
                        isPresent = true;
                        break;
                    }
                }
                if(!isPresent) {
                    var param = JSON.stringify({username:vm.newUsername,password:vm.newPassword,admin:0});

                    $http({
                        method: 'POST',
                        url: 'http://'+SettingsService.serverAddress+'/mydb/users.php',
                        data: "message=" + param,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    })
                        .then(function (response) {
                            vm.addUserButtonShow = true;
                            $route.reload();
                        });
                } else {
                    vm.addUserButtonShow = true;
                    vm.newUsername = "";
                    vm.newPassword = "";

                    vm.message = "This user already exist";
                }
            } else {
                vm.message = 'Password incorrect or empty';
            }



        };

        vm.deleteUser = function (id,ev) {

            var confirm = $mdDialog.confirm()
                .title('Are you sure you want to delete this user?')
                .targetEvent(ev)
                .ok('Delete')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(function() {
                $http({
                    method: 'DELETE',
                    url: 'http://'+SettingsService.serverAddress+'/mydb/users.php/'+id,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                })
                    .then(function (response) {
                        var obj = {us_id:id, type: "usid"};
                        var param = JSON.stringify(obj);

                        $http({
                            method: 'DELETE',
                            url: 'http://'+SettingsService.serverAddress+'/mydb/assignments.php/'+param,
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





    }



})();