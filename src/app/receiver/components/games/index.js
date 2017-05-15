/**
 * Created by truda on 13/05/2017.
 */

module.exports = angular.module('PikaGames.Receiver.Components.Games', [
    require('./games.html')
])
.config(require('./route'))
.controller('GamesController', require('./controller'))
.name;