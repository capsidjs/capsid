'use strict'

var subclass = require('subclassjs')
var Coelement = require('./Coelement')

/**
 * Actor is the primary coelement on a dom. A dom is able to have only one actor.
 */
var Actor = subclass(Coelement, function (pt, parent) {

    pt.constructor = function (elem) {

        parent.constructor.apply(this, arguments)

        if (elem.data('__primary_coelement') != null) {

            throw new Error('actor is already set: ' + elem.data('__primary_coelement').constructor.coelementName)

        }

        elem.data('__primary_coelement', this)

    }

})

module.exports = Actor
