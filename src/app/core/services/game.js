/**
 * Created by truda on 13/05/2017.
 */

module.exports = angular.module("app.game",[
    require('./deepstream'),
    require('./cast')

])
    .provider("$game", GameProvider).name;


function GameProvider() {

    this.$get = ["$deepstream", "$castSender", "$castReceiver", "$state", function($deepstream, $castSender, $castReceiver, $state) {
        return new GameService($deepstream, $castSender, $castReceiver, $state);
    }];
}


function GameService($deepstream, $castSender, $castReceiver, $state) {

    var castNamespace = 'urn:x-cast:games.pika';

     /* Cast Sender */
    var castListener = function(castSender, session, sessionState) {
        console.log(sessionState, sessionState.toString());
        if(sessionState === "SESSION_STARTED") {
            // go to game page
            $state.go('games');
            castSender.sendMessage(castNamespace, {command: "go", data: {state: "games"}, requestId: -1});
        }
    };

    $castSender.registerListener(castListener);


    /* Cast Receiver */
    function castMessageListener(context) {
        var message = context.message;
        if(typeof(message.command) === 'undefined'
            || typeof(message.data) === 'undefined'
            || typeof(message.requestId) === 'undefined') {
            return;
        }

        var cmd = message.command;
        var args = message.data;
        var requestId = message.requestId;

        var response = {success: false, data: "Empty Response"};
        switch(cmd) {
            case 'go':
                response = commands.go(args);
                break;
        }

        response.requestId = requestId;

        console.log("Command: ", message, response);
        context.respond(response);
    }

    /* Command Handlers */
    var cmdError = function(msg) {
        return {success: false, data: msg};
    };

    var cmdSuccess = function(msg) {
        return {success: true, data: msg || ""};
    };

    var commands = {};

    commands.go = function(args) {
        if(typeof(args.state) === 'undefined')
            return cmdError("Invalid Arguments");

        $state.go(args.state);
        return cmdSuccess();
    };


    this.join = function(username, gameCode) {
        this.username = username;
        this.gameCode = gameCode;
        $deepstream.joinGame(this.gameCode, this.onJoin.bind(this));
    };

    this.onJoin = function() {
        $state.go('play');
    };

    this.getGame = function() {
        return $deepstream.getGame();
    };

    this.getPlayer = function() {
        return $deepstream.getPlayer();
    };

    this.input = function(inputName, inputData) {
        $deepstream.setPlayer('inputs.' + inputName, inputData);
    };

    $deepstream.login();

    $castReceiver.registerMessageListener(castNamespace, castMessageListener);
}