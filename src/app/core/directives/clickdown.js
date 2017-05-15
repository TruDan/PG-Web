/**
 * Created by truda on 14/05/2017.
 */
/**
 * Created by truda on 14/05/2017.
 */

module.exports = angular.module("PikaGames.Directives.ClickDown", [
])
    .directive('navbar', function() {
        return {
            restrict: "A",
            link: function(scope, element, attrs) {
                $(element).on('mousedown', function(e) {
                    element.addClass('click-down');
                })
                .on('mouseup', function(e) {
                    element.removeClass('click-down');
                });
            }
        }
    })

    .name;