/**
 * Created by truda on 13/05/2017.
 */

module.exports = function routing($urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');
};