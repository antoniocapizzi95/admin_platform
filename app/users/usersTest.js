/**
 * Created by Antonio on 14/10/2017.
 */
'use strict';
describe('testModule module', function(){
    beforeEach(module('myApp.users'));

    describe('test users_controller', function(){
        var scope, testCont, route, http;

        beforeEach(inject(function($rootScope,$http, $route, $controller) {
            scope = $rootScope.$new();
            route = $route;
            http = $http;
            testCont = $controller('usersCtrl', {$scope: scope, $route: route,$http: http});

        }));

        it('addUser function is defined', function(){

            expect(testCont.addUser).toBeDefined();

        });
    });
});