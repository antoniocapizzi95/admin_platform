'use strict';

// Declare app level module which depends on views, and components
var adminplat = angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.version',
  'myApp.users',
  'myApp.surveys',
    'myApp.newSurvey',
    'myApp.settings',
  'myApp.login',
  'ngMaterial'
])
.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
      .when('/users', {
        templateUrl: "users/users.html",
        controller: 'usersCtrl',
        controllerAs: 'Users'
      })
      .when('/surveys', {
        templateUrl: "surveys/surveys.html",
        controller: 'surveysCtrl',
        controllerAs: 'Surveys'
      })
      .when('/settings', {
        templateUrl: "settings/settings.html",
        controller: 'settingsCtrl',
        controllerAs: 'Settings'
      })

      .when('/login', {
          templateUrl: "login/login.html",
          controller: 'loginCtrl',
          controllerAs: 'Login'
      })

      .when('/newSurvey', {
        templateUrl: "surveys/newSurvey.html",
        controller: 'newSurveyCtrl',
        controllerAs: 'NewSurvey'
      })

}])


.controller('MainCtrl', ['SettingsService',
    function (SettingsService) {

        var vm=this;
        vm.service = SettingsService;





    }])

.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/login'});
}]);
