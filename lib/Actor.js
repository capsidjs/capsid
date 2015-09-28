

var subclass = require('subclassjs');

/**
 * Actor is the primary coelement on a dom. A dom is able to have only one actor.
 */
var Actor = subclass(function (pt) {

    pt.constructor = function (elem) {

        this.elem = elem;

        if (elem.data('__primary_coelement') != null) {

            throw new Error('actor is already set: ' + elem.data('__primary_coelement').constructor.coelementName);

        };

        elem.data('__primary_coelement', this);

    };

});


module.exports = Actor;
