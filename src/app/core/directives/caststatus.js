/**
 * Created by truda on 14/05/2017.
 */

module.exports = angular.module("PikaGames.Directives.CastStatus",[])
    .factory("castIconState", function($castSender) {
    var state = {
        state: "",
        iconClass: ""
    };

    var eventListener = function(castSender, session, sessionState) {
        state.state = sessionState;
        switch (sessionState) {
            case "NO_SESSION":
                state.iconClass = "cast-inactive";
                break;
            case "SESSION_STARTING":
                state.iconClass = "cast-connect";
                break;
            case "SESSION_STARTED":
                state.iconClass = "cast-active";
                break;
            case "SESSION_START_FAILED":
                state.iconClass = "cast-warn";
                break;
            case "SESSION_ENDING":
                state.iconClass = "cast-inactive";
                break;
            case "SESSION_ENDED":
                state.iconClass = "cast-inactive";
                break;
            case "SESSION_RESUMED":
                state.iconClass = "cast-active";
                break;
        }
    };

    $castSender.onInit(function() {
        $castSender.registerListener(eventListener, true);
    });

    return state;
})
    .directive("castIcon", function(castIconState) {
        return {
            restrict: 'AC',
            template: '<svg width="24" height="24" viewBox="0 0 24 24"><path id="a" d="M1 18L1 21 4 21C4 19.3 2.7 18 1 18L1 18Z"/><path id="b" d="M1 14L1 16C3.8 16 6 18.2 6 21L8 21C8 17.1 4.9 14 1 14L1 14Z"/><path id="c" d="M1 10L1 12C6 12 10 16 10 21L12 21C12 14.9 7.1 10 1 10L1 10Z"/><path id="d" d="M21 3L3 3C1.9 3 1 3.9 1 5L1 8 3 8 3 5 21 5 21 19 14 19 14 21 21 21C22.1 21 23 20.1 23 19L23 5C23 3.9 22.1 3 21 3L21 3Z"/><path id="e" d="M5 7L5 8.6C8 8.6 13.4 14 13.4 17L19 17 19 7Z"/></svg>',
            link: function (scope, element, attr) {
                element.addClass('cast-icon');

                scope.$watch(function() { return castIconState.iconClass;}, function(newVal) {
                    element.removeClass('cast-inactive cast-warn cast-connect cast-active').addClass(newVal);
                });
            }
        };
    }).name;