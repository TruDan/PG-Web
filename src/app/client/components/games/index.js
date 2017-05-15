/**
 * Created by truda on 13/05/2017.
 */

module.exports = angular.module('PikaGames.Client.Components.Games', [
    require('./games.html')
])
.config(require('./route'))
.controller('GamesController', require('./controller'))
.name;