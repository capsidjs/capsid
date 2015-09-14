

var subclass = require('subclassjs');

/**
 * Coelement is the additional function of the dom element. A coelement is bound to the element and works together with it.
 */
var Coelement = subclass(function (pt) {

    pt.constructor = function (elem) {

        this.elem = elem;

        // embeds coelement in the jquery object
        // to make it possible to reference coelement from the element.
        this.elem.data('__coelement:' + this.constructor.coelementName, this);

    };

});

module.exports = Coelement;
