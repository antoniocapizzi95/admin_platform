
'use strict';
//questo è il controller che gestisce la pagina /login (ovvero login.html)
(function () {

    angular.module('myApp.login', ['ngRoute']) //viene dichiarato un modulo myApp.login a cui si associa il controller
        .controller('loginCtrl', loginCtrl);
    loginCtrl.$inject = ['$http','SettingsService','$location']; //vengono iniettati i vari servizi utili al controller
    //questo avviene per ogni controller

    function loginCtrl($http,SettingsService,$location) {

        var vm = this; //qui viene associato il controller (this) alla variabile vm

        vm.username = '';
        vm.password = ''; //qui vengono associate delle variabili al controller, queste variabili saranno disponibili sulla pagina html come Login.nomevariabile
        vm.address = 'antoniocapizzi95.altervista.org'; //di default il server address è stato settato su antoniocapizzi95.altervista.org
        vm.message = '';

        vm.login = function () { //questa è la funzione che viene eseguita quando si effettua il login
            var param = JSON.stringify({username:vm.username,password:vm.password}); //nome utente e password vengono inviati al server tramite una richiesta post a login.php
            vm.message = '';
            $http({ //il servizio $http è un servizio già integrato in AngularJS che permette di inviare richieste http
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
                    if(resp && admin) { //se resp è true e admin pure, l'utente esiste, le credenziali sono corrette e il login avviene correttamente
                        SettingsService.serverAddress = vm.address; //qui vengono settati gli attributi del servizio SettingsService (contenuto in app/components/settingsService.js), queste variabili saranno reperibili da qualsiasi controller dell'applicazione
                        SettingsService.adminUsername = vm.username;
                        SettingsService.adminPassword = vm.password;
                        SettingsService.id = id;
                        SettingsService.sidenav = true; //con questo flag si fa comparire la sidenav contenuta in index.html
                        $location.path("/surveys"); //si viene indirizzati alla pagina /surveys, cioè la pagina "Manage Surveys"

                    } else {
                        vm.username = '';
                        vm.password = '';
                        vm.message = "Username or password are incorrect";
                    }

                })
                .error(function (msg) {
                    vm.message = 'The server address is wrong'; //nel caso il server non risponde o l'indirizzo inserito è errato, compare questo messaggio
                });
            }


    }



})();