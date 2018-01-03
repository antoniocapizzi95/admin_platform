/**
 * Created by Antonio on 09/10/2017.
 */
'use strict';

(function () {

    angular.module('myApp.settings', [])
        .controller('settingsCtrl', settingsCtrl);
    settingsCtrl.$inject = ['SettingsService'];

    function settingsCtrl(SettingsService) {

        var vm = this;

        /*vm.adminUsername = SettingsService.adminUsername;
        vm.adminPassword = SettingsService.adminPassword;*/
        vm.serverAddress = SettingsService.serverAddress;

        vm.edit = function() {
            /*SettingsService.adminUsername = vm.adminUsername;
            SettingsService.adminPassword = vm.adminPassword;*/
            SettingsService.serverAddress = vm.serverAddress;
        }

    }



})();