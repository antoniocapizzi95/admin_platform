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

      .when('/newSurvey', {
        templateUrl: "surveys/newSurvey.html",
        controller: 'newSurveyCtrl',
        controllerAs: 'NewSurvey'
      })

}])

.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/users'});
}]);
