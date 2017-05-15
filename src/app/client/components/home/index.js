/**
 * Created by truda on 13/05/2017.
 */

module.exports = angular.module('PikaGames.Client.Components.Home', [
    require('./home.html')
])
.config(require('./route'))
.controller('HomeController', require('./controller'))
.name;