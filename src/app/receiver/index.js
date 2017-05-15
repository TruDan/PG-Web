/**
 * Created by truda on 14/05/2017.
 */

let angular = require('angular');

module.exports = angular.module("PikaGames.Receiver", [
    require('../core'),

    require('./components/home'),
    require('./components/games')

]);
