/**
 * Created by truda on 13/05/2017.
 */
//HomeController.$inject = ['$cookies'];

module.exports = function($cookies, $state, $castSender, $window, $scope, $game) {

    $scope.castInProgress = false;


    $castSender.registerListener(function(castSender, session, sessionState) {
        console.log(sessionState);
        if(sessionState === 'SESSION_STARTING') {
            $scope.castInProgress = true;
            $scope.$apply();
        }
        else {
            $scope.castInProgress = false;
            $scope.$apply();
        }
    });

        this.cookie = $cookies.getObject('pikagames');

        if (!this.cookie) {
            this.cookie = {
                username: ""
            };
        }

    $scope.gameCode = "";
    $scope.username = this.cookie.username;


    this.saveCookie = function() {
        $cookies.putObject('pikagames', this.cookie);
    };

    this.updateUsername = function() {
        this.cookie.username = $scope.username;
        this.saveCookie();
    };

    this.newGame = function() {
        $castSender.requestSession();
    };

    this.joinGame = function() {
        $game.join($scope.username, $scope.gameCode.toUpperCase());
    };
};