/**
 * Created by truda on 14/05/2017.
 */

module.exports = angular.module('app.material.input',[])
    .directive('inputField', ["$timeout", function ($timeout) {
    var inputLabelIdCounter = 0;
    return {
        transclude: true,
        scope: {},
        link: function (scope, element) {
            $timeout(function () {
                var input = element.find("> > input, > > textarea");
                var label = element.find("> > label");

                if (input.length == 1 && label.length == 1 && !input.attr("id") && !label.attr("for")) {
                    var id = "angularMaterializeID" + inputLabelIdCounter++;
                    input.attr("id", id);
                    label.attr("for", id);
                }

                Materialize.updateTextFields();

                // The "> > [selector]", is to restrict to only those tags that are direct children of the directive element. Otherwise we might hit to many elements with the selectors.

                // Triggering autoresize of the textareas.
                element.find("> > .materialize-textarea").each(function () {
                    var that = $(this);
                    that.addClass("materialize-textarea");
                    that.trigger("autoresize");
                    var model = that.attr("ng-model");
                    if (model) {
                        scope.$parent.$watch(model, function (a, b) {
                            if (a !== b) {
                                $timeout(function () {
                                    that.trigger("autoresize");
                                });
                            }
                        });
                    }
                });

                // Adding char-counters.
                element.find('> > .materialize-textarea, > > input').each(function (index, countable) {
                    countable = angular.element(countable);
                    if (!countable.siblings('span[class="character-counter"]').length) {
                        countable.characterCounter();
                    }
                });
            });
        },
        template: '<div ng-transclude class="input-field"></div>'
    };
}]).name;