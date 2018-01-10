
'use strict';

(function () {

    angular.module('myApp.login', ['ngRoute'])
        .controller('loginCtrl', loginCtrl);
    loginCtrl.$inject = ['$http','SettingsService','$location'];

    function loginCtrl($http,SettingsService,$location) {

        var vm = this;

        vm.username = '';
        vm.password = '';
        vm.address = 'antoniocapizzi95.altervista.org';
        vm.message = '';

        vm.login = function () {
            var param = JSON.stringify({username:vm.username,password:vm.password});
            vm.message = '';
            $http({
                method: 'POST',
                url: 'http://'+vm.address+'/mydb/login.php',
                data: "message=" + param,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
                .success(function (response) {
                    var input = JSON.parse(response);
                    var resp = input.records[0].result;
                    var id = input.records[0].id;
                    var admin = input.records[0].admin;
                    if(resp && admin) {
                        SettingsService.serverAddress = vm.address;
                        SettingsService.adminUsername = vm.username;
                        SettingsService.adminPassword = vm.password;
                        SettingsService.id = id;
                        SettingsService.sidenav = true;
                        $location.path("/surveys");

                    } else {
                        vm.username = '';
                        vm.password = '';
                        vm.message = "Username or password are incorrect";
                    }

                })
                .error(function (msg) {
                    vm.message = 'The server address is wrong';
                });
            }


    }



})();