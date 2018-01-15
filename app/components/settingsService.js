//in questo file js è presente la dichiarazione del servizio SettingsService che contiene tutte le variabili che devono essere a disposizione di tutti i controller
angular.module('myApp')
    .factory('SettingsService', function () {

        this.adminUsername = '';
        this.adminPassword = '';
        this.serverAddress = 'antoniocapizzi95.altervista.org';
        this.id;
        this.sidenav = false;

        return {
            adminUsername : this.adminUsername,
            adminPassword: this.adminPassword,
            serverAddress: this.serverAddress,
            id: this.id,
            sidenav: this.sidenav
        };
    });