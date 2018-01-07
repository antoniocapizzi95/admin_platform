/**
 * Created by Antonio on 09/10/2017.
 */
'use strict';

(function () {

    angular.module('myApp.users', ['ngRoute'])
        .controller('usersCtrl', usersCtrl);
    usersCtrl.$inject = ['$scope','$http','$route','SettingsService'];

    function usersCtrl($scope,$http,$route,SettingsService) {

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
                    var param = JSON.stringify({username:vm.newUsername,password:vm.newPassword});

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

        vm.deleteUser = function (id) {

            $http({
                method: 'DELETE',
                url: 'http://'+SettingsService.serverAddress+'/mydb/users.php/'+id,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
                .then(function (response) {

                    $route.reload();
                });
        }





    }



})();