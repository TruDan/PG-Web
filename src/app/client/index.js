'use strict';
/**
 * Created by truda on 13/05/2017.
 */

let angular = require('angular');

module.exports = angular.module("PikaGames.Client", [
    require('../core'),

    require('./directives/joystick'),

    require('./components/navbar'),

    require('./components/home'),
    require('./components/games'),
    require('./components/play')

]);
