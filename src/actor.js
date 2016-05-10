import Coelement from './coelement'

/**
 * Actor is the primary coelement on a dom. A dom is able to have only one actor.
 */
export default class Actor extends Coelement {

    constructor(elem) {

        super(elem)

        if (elem.data('__primary_coelement') != null) {

            throw new Error('actor is already set: ' + elem.data('__primary_coelement').constructor.coelementName)

        }

        elem.data('__primary_coelement', this)

    }

}
