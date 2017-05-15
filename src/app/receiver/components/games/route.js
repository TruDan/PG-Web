/**
 * Created by truda on 13/05/2017.
 */
module.exports = function routes($stateProvider) {
    $stateProvider
        .state('games', {
            url: '/games',
            templateUrl: 'games.html',
            controller: 'GamesController',
            controllerAs: 'games'
        });
};