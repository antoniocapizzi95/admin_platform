'use strict';
//questo è il controller che gestisce la pagina /users (users.html)
(function () {

    angular.module('myApp.users', ['ngRoute'])
        .controller('usersCtrl', usersCtrl);
    usersCtrl.$inject = ['$http','$route','SettingsService','$mdDialog'];

    function usersCtrl($http,$route,SettingsService,$mdDialog) {

        var vm = this;

        vm.users = []; //questo array conterrà la liste degli utenti presa dal database
        vm.addUserButtonShow = true;
        vm.newUsername = '';
        vm.newPassword = '';
        vm.rePsw = '';

        vm.message = '';

        $http.get('http://'+SettingsService.serverAddress+'/mydb/users.php') //con questa richiesta get vengono presi tutti gli utenti (non admin) presenti sul db
            .then(function (response) {
                var input = JSON.parse(response.data);
                vm.users = input.records; //e vengono messi nell'array vm.users
            });

        vm.addUser = function () { //questa è la funzione che viene eseguita quando si aggiunge un utente
            if(vm.newPassword == vm.rePsw && vm.newPassword!='') { //si ricorda che le variabili che contengono la password o l'username, anche se all'inizio sono state dichiarate come stringa vuota, vengono scritte in runtime a seconda di quello che si scrive sui text box grazie alla direttiva ng-model
                vm.message = '';
                var isPresent = false;
                for(var i=0; i<vm.users.length; i++) {
                    if(vm.users[i].username == vm.newUsername) { //viene controllato se il nome utente è già presente
                        isPresent = true;
                        break;
                    }
                }
                if(!isPresent) {
                    var param = JSON.stringify({username:vm.newUsername,password:vm.newPassword,admin:0}); //se l'utente non è presente viene aggiunto al db con una richiesta post a users.php

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
                    vm.newUsername = "";
                    vm.newPassword = "";

                    vm.message = "This user already exist";
                }
            } else {
                vm.message = 'Password incorrect or empty';
            }



        };

        vm.cancelAdd = function() {
            vm.addUserButtonShow = true;
            vm.newUsername = "";
            vm.newPassword = "";
        }

        vm.deleteUser = function (id,ev) { //questa è la funzione che viene eseguita quando si cancella un utente

            var confirm = $mdDialog.confirm() //comparirà un dialog per confermare se si è sicuri di voler cancellare l'utente selezionato
                .title('Are you sure you want to delete this user?')
                .targetEvent(ev)
                .ok('Delete')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(function() {
                $http({                //viene fatta una richiesta delete a users.php in cui gli si passa l'id nell'url per cancellare l'utente
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

                                $route.reload(); //questa funzione serve a ricaricare la pagina in modo che si aggiorni senza l'utente che è stato cancellato
                            });
                    });


            }, function() {

            });


        }

        vm.showEditUser = false;
        vm.editUsername = '';
        vm.editPassword = '';
        var editID;
        vm.editUser = function(usr) { //questa è la funzione che viene seguita quando si preme il tasto per modificare un utente
            vm.showEditUser = true;
            vm.editUsername = usr.username;
            vm.editPassword = usr.password;
            editID = usr.ID;
        }

        vm.confirmEditUser = function() { //questa funzione viene eseguita quando si preme il bottone per confermare la modifica di un utente

            if(vm.editPassword == vm.rePsw && vm.editPassword!='') {
                vm.message = '';
                var isPresent = false;
                for(var i=0; i<vm.users.length; i++) {
                    if(vm.users[i].username == vm.newUsername) { //viene controllato se il nome utente è già presente
                        isPresent = true;
                        break;
                    }
                }
                if(!isPresent) {
                    var obj = {id:editID, username: vm.editUsername, password: vm.editPassword};
                    var param = JSON.stringify(obj);

                    $http({
                        method: 'PUT',
                        url: 'http://'+SettingsService.serverAddress+'/mydb/users.php/'+param,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    })
                        .then(function (response) {
                            $route.reload();
                        });
                } else {
                    vm.editUsername = "";
                    vm.editPassword = "";

                    vm.message = "This user already exist";
                }
            } else {
                vm.message = 'Password incorrect or empty';
            }
        }
        vm.cancelEdit = function() {
            vm.showEditUser = false;
            vm.editUsername = '';
            vm.editPassword = '';
            vm.rePsw = '';
        }





    }



})();