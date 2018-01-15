'use strict';

//in questo file js c'è l'avvio di AngularJS

// Declare app level module which depends on views, and components
var adminplat = angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.version',
  'myApp.users',
  'myApp.surveys',
    'myApp.newSurvey',                 //qui viene definito il modulo principale dell'applicazione e vengono iniettati i vari moduli
    'myApp.settings',
  'myApp.login',
  'ngMaterial'
])
.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
      .when('/users', {
        templateUrl: "users/users.html",   //qui vengono definite le rotte e viene definito come devono essere avviate le varie pagine dell'applicazione, in questo caso quando ci troviamo in /users, viene settata la pagina users/users.html come template
        controller: 'usersCtrl',           //viene settato come controller della pagina "usersCtrl" contenuto in app/users/users_controller.js
        controllerAs: 'Users'              //e viene settato un alias per il controller in modo che sia reperibile sull'html
      })                                   //lo stesso avviene successivamente per le altre pagine
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


.controller('MainCtrl', ['SettingsService', //questo controller gestisce le parti grafiche dell'applicazione che sono sempre presenti (in particolare gestisce quando deve comparire/scomparire la sidenav)
    function (SettingsService) {

        var vm=this;
        vm.service = SettingsService;





    }])

.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/login'});  //all'avvio dell'applicazione viene messa la pagina /login
}]);
