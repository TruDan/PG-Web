/**
 * Created by truda on 13/05/2017.
 */
module.exports = function routes($stateProvider) {
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'home.html',
            controller: 'HomeController',
            controllerAs: 'home'
        });
};