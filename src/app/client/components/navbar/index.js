/**
 * Created by truda on 14/05/2017.
 */

module.exports = angular.module("PikaGames.Client.Components.Navbar", [
    require('./navbar.html')
])
    .directive('navbar', function() {
        return {
            restrict: "E",
            replace: true,
            controller: "NavbarController",
            templateUrl: 'navbar.html'
        }
    })

    .controller("NavbarController", function($scope, $castSender) {

        $scope.cast = function() {
            $castSender.requestSession();
        }

    })

.name;