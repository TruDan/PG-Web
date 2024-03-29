/**
 * Created by truda on 13/05/2017.
 */
'use strict';

var $ = require('jquery');

function collapsible($timeout) {
    return {
        restrict: 'E',
        link: function(scope, element, attrs) {
            var defaults = {
                accordion: undefined,
                onOpen: undefined,
                onClose: undefined
            };

            var options = $.extend(defaults);

            element.addClass('collapsible');

            $(element).each(function() {

                var $this = $(element);

                var $panel_headers = $(element).find('> li > .collapsible-header');

                var collapsible_type = $this.data("collapsible");

                /****************
                 Helper Functions
                 ****************/

                // Accordion Open
                function accordionOpen(object) {
                    $panel_headers = $this.find('> li > .collapsible-header');
                    if (object.hasClass('active')) {
                        object.parent().addClass('active');
                    }
                    else {
                        object.parent().removeClass('active');
                    }
                    if (object.parent().hasClass('active')){
                        object.siblings('.collapsible-body').stop(true,false).slideDown({ duration: 350, easing: "easeOutQuart", queue: false, complete: function() {$(this).css('height', '');}});
                    }
                    else{
                        object.siblings('.collapsible-body').stop(true,false).slideUp({ duration: 350, easing: "easeOutQuart", queue: false, complete: function() {$(this).css('height', '');}});
                    }

                    $panel_headers.not(object).removeClass('active').parent().removeClass('active');

                    // Close previously open accordion elements.
                    $panel_headers.not(object).parent().children('.collapsible-body').stop(true,false).each(function() {
                        if ($(this).is(':visible')) {
                            $(this).slideUp({
                                duration: 350,
                                easing: "easeOutQuart",
                                queue: false,
                                complete:
                                    function() {
                                        $(this).css('height', '');
                                        execCallbacks($(this).siblings('.collapsible-header'));
                                    }
                            });
                        }
                    });
                }

                // Expandable Open
                function expandableOpen(object) {
                    if (object.hasClass('active')) {
                        object.parent().addClass('active');
                    }
                    else {
                        object.parent().removeClass('active');
                    }
                    if (object.parent().hasClass('active')){
                        object.siblings('.collapsible-body').stop(true,false).slideDown({ duration: 350, easing: "easeOutQuart", queue: false, complete: function() {$(this).css('height', '');}});
                    }
                    else {
                        object.siblings('.collapsible-body').stop(true,false).slideUp({ duration: 350, easing: "easeOutQuart", queue: false, complete: function() {$(this).css('height', '');}});
                    }
                }

                // Open collapsible. object: .collapsible-header
                function collapsibleOpen(object, noToggle) {
                    if (!noToggle) {
                        object.toggleClass('active');
                    }

                    if (options.accordion || collapsible_type === "accordion" || collapsible_type === undefined) { // Handle Accordion
                        accordionOpen(object);
                    } else { // Handle Expandables
                        expandableOpen(object);
                    }

                    $(element).has('li.active').addClass('collapsible-open');
                    $(element).not(':has(li.active)').removeClass('collapsible-open');

                    execCallbacks(object);
                }

                // Handle callbacks
                function execCallbacks(object) {
                    if (object.hasClass('active')) {
                        if (typeof(options.onOpen) === "function") {
                            options.onOpen.call(this, object.parent());
                        }
                    } else {
                        if (typeof(options.onClose) === "function") {
                            options.onClose.call(this, object.parent());
                        }
                    }
                }

                /**
                 * Check if object is children of panel header
                 * @param  {Object}  object Jquery object
                 * @return {Boolean} true if it is children
                 */
                function isChildrenOfPanelHeader(object) {

                    var panelHeader = getPanelHeader(object);

                    return panelHeader.length > 0;
                }

                /**
                 * Get panel header from a children element
                 * @param  {Object} object Jquery object
                 * @return {Object} panel header object
                 */
                function getPanelHeader(object) {

                    return object.closest('li > .collapsible-header');
                }


                // Turn off any existing event handlers
                function removeEventHandlers() {
                    $this.off('click.collapse', '> li > .collapsible-header');
                }

                /*****  End Helper Functions  *****/
                removeEventHandlers();

                // Add click handler to only direct collapsible header children
                $this.on('click.collapse', '> li > .collapsible-header', function(e) {
                    var element = $(e.target);

                    if (isChildrenOfPanelHeader(element)) {
                        element = getPanelHeader(element);
                    }

                    collapsibleOpen(element);
                });


                // Open first active
                if (options.accordion || collapsible_type === "accordion" || collapsible_type === undefined) { // Handle Accordion
                    collapsibleOpen($panel_headers.filter('.active').first(), true);

                } else { // Handle Expandables
                    $panel_headers.filter('.active').each(function() {
                        collapsibleOpen($(this), true);
                    });
                }

            });
        }
    };
}

module.exports = angular.module('app.directives.collapsible', [])
    .directive('collapsible', collapsible)
    .name;