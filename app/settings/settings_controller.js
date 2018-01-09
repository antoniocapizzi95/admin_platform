/**
 * Created by Antonio on 09/10/2017.
 */
'use strict';

(function () {

    angular.module('myApp.settings', [])
        .controller('settingsCtrl', settingsCtrl);
    settingsCtrl.$inject = ['SettingsService','$http'];

    function settingsCtrl(SettingsService,$http) {

        var vm = this;

        /*vm.adminUsername = SettingsService.adminUsername;
        vm.adminPassword = SettingsService.adminPassword;*/
        vm.serverAddress = SettingsService.serverAddress;
        vm.message = '';

        vm.edit = function() {
            /*SettingsService.adminUsername = vm.adminUsername;
            SettingsService.adminPassword = vm.adminPassword;*/

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