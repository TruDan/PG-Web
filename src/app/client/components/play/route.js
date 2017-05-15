/**
 * Created by truda on 13/05/2017.
 */
module.exports = function routes($stateProvider) {
    $stateProvider
        .state('play', {
            url: '/play',
            templateUrl: 'play.html',
            controller: 'PlayController',
            controllerAs: 'play'
        });
};