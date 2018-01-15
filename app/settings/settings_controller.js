
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
        }

        vm.edit = function() { //questa è la funzione che viene eseguita quando si preme il bottone edit che serve a cambiare l'indirizzo del server


            $http.get('http://'+vm.serverAddress+'/mydb/users.php')
                .success(function (response) {
                    SettingsService.serverAddress = vm.serverAddress;
                    vm.message = 'Server address changed';
                })
                .error(function (msg) {
                    vm.message = 'The server address is wrong';
                });


        }

    }



})();