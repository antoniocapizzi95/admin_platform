/**
 * Created by Antonio on 09/10/2017.
 */
'use strict';

(function () {

    angular.module('myApp.users', ['ngRoute'])
        .controller('usersCtrl', usersCtrl);
    usersCtrl.$inject = ['$scope','$http','$route'];

    function usersCtrl($scope,$http,$route) {

        var vm = this;

        vm.users = [];
        vm.addUserButtonShow = true;
        vm.newUsername;
        vm.newPassword;
        $http.get("http://localhost/mydb/getUsers.php")
            .then(function (response) {
                var input = JSON.parse(response.data);
                vm.users = input.records;
            });

        vm.addUser = function () {
            var param = JSON.stringify({username:vm.newUsername,password:vm.newPassword});

            $http({
                method: 'POST',
                url: 'http://localhost/mydb/addUser.php',
                data: "message=" + param,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
                .then(function (response) {
                    vm.addUserButtonShow = true;
                    $route.reload();
                });
        }

        vm.deleteUser = function (id) {
            var param = JSON.stringify({id:id});

            $http({
                method: 'POST',
                url: 'http://localhost/mydb/deleteUser.php',
                data: "message=" + param,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
                .then(function (response) {

                    $route.reload();
                });
        }





    }



})();