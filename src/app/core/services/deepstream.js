/**
 * Created by truda on 13/05/2017.
 */
var deepstream = require('deepstream.io-client-js');
var $ = require('jquery');

module.exports = angular.module("app.deepstream",[])
    .provider("$deepstream", DeepStreamProvider).name;


function DeepStreamProvider() {

    var url = window.location.hostname + ':3002';

    this.setUrl = function(newUrl) {
        url = newUrl;
    };

    this.$get = [function() {
        return new DeepStreamService(url);
    }];
}


function DeepStreamService(url) {
    this.id = -1;
    this.record = null;
    this.gameRecord = null;
    this.gameId = null;

    this.login = function() {
        this._deepstream = deepstream(url).login({}, this._onLogin.bind(this));
    };

    this._onLogin = function() {
        this.id = this._deepstream.getUid();
    };

    this.joinGame = function(gameId, callback) {
        this.gameId = gameId;
        this.callback = callback;

        this._getGame(gameId, this._onGameFetch.bind(this));
    };

    this._onGameFetch = function(gameRecord) {
        this.gameRecord = gameRecord;

        this._getPlayer(this.id, this._onPlayerFetch.bind(this));
    };

    this._onPlayerFetch = function(playerRecord) {
        this.record = playerRecord;

        this.record.set({
            id: this.id,
            gameId: "",
            name: "",
            active: false,
            inputs: {}
        });

        var _this = this;
        this.record.once('delete', function() {
            // player disconnect

            if(_this.gameId !== null) {
                _this.leaveGame();
            }
        });

        this._deepstream.event.subscribe("game/" + this.gameId + "/players/" + this.id, function() {});

        if($.isFunction(this.callback)) {
            this.callback.call(this);
        }
    };

    this._getGame = function(gameId, callback) {
        this._deepstream.record.getRecord("game/" + gameId).whenReady(callback);
    };

    this._getPlayer = function(playerId, callback) {
        this._deepstream.record.getRecord("player/" + playerId).whenReady(callback);
    };

    this.leaveGame = function() {
        this._deepstream.event.unsubscribe("game/" + this.gameId + "/players/" + this.id);
        this.gameId = null;
    };

    this.setPlayer = function(name, value) {
        //console.log("Setting ", name, value);
        this.record.set(name, value);
    };

    this.getGame = function() {
        return this.gameRecord.get();
    };

    this.getPlayer = function() {
        return this.record.get();
    }

}