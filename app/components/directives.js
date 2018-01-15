
(function () {
    'use strict';


    adminplat.directive('goto', ['$location', function ($location) { //qui è dichiarata la direttiva goto che inserita nei bottoni permette di cambiare location in modo semplice
        return {
            link: function (scope, element, attrs) {
                element.on('click', function () {
                    scope.$apply(function () {
                        $location.path(attrs.goto);
                    });
                });
            }
        };
    }]);


}());
