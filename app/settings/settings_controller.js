
'use strict';
//questo è il controller che gestisce la pagina /settings (settings.html)
(function () {

    angular.module('myApp.settings', [])
        .controller('settingsCtrl', settingsCtrl);
    settingsCtrl.$inject = ['SettingsService','$http','$location'];

    function settingsCtrl(SettingsService,$http,$location) {

        var vm = this;

        vm.adminUsername = SettingsService.adminUsername; //username e password dell'admin vengono presi dal servizio SettingsService contenuto in app/components/settingsService.js
        vm.serverAddress = SettingsService.serverAddress;
        vm.message = '';

        vm.logout = function () { //questa è la funzione che viene eseguita quando si clicca sul bottone logout
            SettingsService.adminUsername = '';
            SettingsService.adminPassword = '';
            SettingsService.id = undefined;
            SettingsService.sidenav = false;
            $location.path('/login');
        };

        vm.edit = function() { //questa è la funzione che viene eseguita quando si preme il bottone edit che serve a cambiare l'indirizzo del server


            $http.get('http://'+vm.serverAddress+'/mydb/users.php')
                .success(function (response) {


                    login(SettingsService.adminUsername,SettingsService.adminPassword);
                })
                .error(function (msg) {
                    vm.message = 'The server address is wrong';
                });


        };

        function login(us,psw) {
            var param = JSON.stringify({username:us,password:psw});
            vm.message = '';
            $http({
                method: 'POST',
                url: 'http://'+vm.serverAddress+'/mydb/login.php',
                data: "message=" + param,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
                .success(function (response) {
                    var input = JSON.parse(response);
                    var resp = input.records[0].result;
                    var id = input.records[0].id;
                    var admin = input.records[0].admin;
                    if(resp && admin) {
                        SettingsService.serverAddress = vm.serverAddress; //viene settato il nuovo indirizzo del server
                        vm.message = 'Server changed successfully';


                    } else {
                        vm.message = 'The server address is wrong, or the user is not present on server, please do logout';
                    }

                })
                .error(function (msg) {
                    vm.message = 'The server address is wrong';
                });
        }

    }



})();