'use strict';
/**
 * Created by truda on 13/05/2017.
 */
require('jquery');
require('jquery-easing');

require('angular-ui-router');
require('angular-cookies');

require('materialize');

let angular = require('angular');

module.exports = angular.module("PikaGames", [
    'ui.router',
    'ngCookies',

    require('./directives/clickdown'),
    require('./directives/caststatus'),
    require('./directives/collapsible'),
    require('./services/cast'),
    require('./services/game'),
    require('./directives/material')
])
    .config(require('./config/routes'))
    .run(function($game) {

    }).name;

