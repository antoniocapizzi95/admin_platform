/**
 * Created by Antonio on 09/10/2017.
 */
'use strict';

(function () {

    angular.module('myApp.users', [])
        .controller('usersCtrl', usersCtrl);
    usersCtrl.$inject = ['$scope','$http','$route'];

    function usersCtrl($scope,$http,$route) {

        $scope.users = [];
        $scope.addUserButtonShow = true;
        $scope.newUsername;
        $scope.newPassword;
        $http.get("http://localhost/mydb/getUsers.php")
            .then(function (response) {
                var input = JSON.parse(response.data);
                $scope.users = input.records;
            });

        $scope.addUser = function () {
            var param = JSON.stringify({username:$scope.newUsername,password:$scope.newPassword});

            $http({
                method: 'POST',
                url: 'http://localhost/mydb/addUser.php',
                data: "message=" + param,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
                .then(function (response) {
                    $scope.addUserButtonShow = true;
                    $route.reload();
                });
        }

        $scope.deleteUser = function (id) {
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