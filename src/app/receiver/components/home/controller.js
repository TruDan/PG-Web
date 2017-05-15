/**
 * Created by truda on 13/05/2017.
 */
//HomeController.$inject = ['$cookies'];

module.exports = function($cookies, $state, $castSender, $window, $rootScope) {

    $rootScope.$window = $window;
        this.cookie = $cookies.getObject('pikagames');

        if (!this.cookie) {
            this.cookie = {
                username: ""
            };
        }

        this.gameCode = "";
        this.username = this.cookie.username;


    this.saveCookie = function() {
        $cookies.putObject('pikagames', this.cookie);
    };

    this.updateUsername = function() {
        this.cookie.username = this.username;
        this.saveCookie();
    };

    this.newGame = function() {
        $castSender.requestSession();
    };

    this.joinGame = function() {
        $state.go('play', {gameId: this.gameCode});
    };
};