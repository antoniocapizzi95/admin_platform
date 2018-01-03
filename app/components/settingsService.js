angular.module('myApp')
    .factory('SettingsService', function () {

        /*this.adminUsername = 'admin';
        this.adminPassword = 'admin';*/
        this.serverAddress = 'antoniocapizzi95.altervista.org';
        //this.id;

        return {
           /* adminUsername : this.adminUsername,
            adminPassword: this.adminPassword,*/
            serverAddress: this.serverAddress
            //id: this.id
        };
    });