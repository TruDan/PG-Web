/**
 * Created by truda on 13/05/2017.
 */

//import './play.scss';

var ctrl = require('./controller');

module.exports = angular.module('PikaGames.Client.Components.Play',[
    require('./play.html')
])
.config(require('./route'))
.controller('PlayController', ctrl)
.name;