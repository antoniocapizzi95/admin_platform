/**
 * Created by Antonio on 09/10/2017.
 */
(function () {
    'use strict';




    adminplat.directive('goto', ['$location', function ($location) {
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
