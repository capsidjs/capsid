const $ = require('jquery')
global.jQuery = $
const {expect} = require('chai')

require('../src/class-component')

describe('$.cc', () => {
    'use strict'

    before(() => {
        $.cc('foo', elem => {
            elem.attr('is_foo', 'true')
        })

        $.cc('bar', elem => {
            elem.attr('is_bar', 'true')
        })
    })

    it('throws an error when the first param is not a string', () => {
        expect(() => {
            $.cc(null, () => {})
        }).to.throw(Error)
    })

    it('throws an error when the second param is not a function', () => {
        expect(() => {
            $.cc('register-test2', null)
        }).to.throw(Error)
    })

    describe('init', () => {
        beforeEach(() => {
            $('body').empty()
        })

        it('initializes the class component of the given name', () => {
            const foo = $('<div class="foo" />').appendTo(document.body)

            $.cc.init('foo')

            expect(foo.attr('is_foo')).to.equal('true')
        })

        it('initializes multiple class components', () => {
            const foo = $('<div class="foo" />').appendTo('body')
            const bar = $('<div class="bar" />').appendTo('body')

            $.cc.init(['foo', 'bar'])

            expect(foo.attr('is_foo')).to.equal('true')
            expect(bar.attr('is_bar')).to.equal('true')
        })

        it('initializes multiple class componet by class names separated by whitespaces', () => {
            const foo = $('<div class="foo" />').appendTo('body')
            const bar = $('<div class="bar" />').appendTo('body')

            $.cc.init('foo bar')

            expect(foo.attr('is_foo')).to.equal('true')
            expect(bar.attr('is_bar')).to.equal('true')
        })

        it('throws an error when the given name of class-component is not registered', () => {
            expect(() => {
                $.cc.init('does-not-exist')
            }).to.throw(Error)
        })
    })

    it('registers a class component of the given name', () => {
        $.cc('assign-test0', class Class0 {})

        expect($.cc.__manager__.ccc['assign-test0']).to.be.exist
    })

    it('sets coelementName property to the given construtor', () => {
        class Class0 {}

        $.cc('assgin-test1', Class0)

        expect(Class0.coelementName).to.equal('assgin-test1')
    })

    it('sets __coelement:class-name data property when the class component is initialized', () => {
        class Class1 {}

        $.cc('assign-test2', Class1)

        const elem = $('<div class="assign-test2" />').appendTo('body')

        $.cc.init('assign-test2', 'body')

        expect(elem.data('__coelement:assign-test2')).to.be.instanceof(Class1)
    })

    it('sets coelement.elem as the base jquery element', () => {
        class Class2 {}

        $.cc('elem-test', Class2)

        const elem = $('<div class="elem-test" />').appendTo('body')

        $.cc.init('elem-test')

        const coelem = elem.cc.get('elem-test')

        expect(coelem.elem[0]).to.equal(elem[0])
    })

    it('binds event handlers if the event decorators are present', done => {
        class Class3 {
            handler() {
                done()
            }
        }

        $.cc.event('click', '.inner')(Class3.prototype, 'handler')

        $.cc('elem-test3', Class3)

        const elem = $('<div class="elem-test3"><span class="inner"></span></div>').appendTo('body')

        $.cc.init('elem-test3')

        elem.find('.inner').trigger('click')
    })

    describe('Coelement', () => {
        it('sets the first argument to elem property', () => {
            const elem = $('<div />')

            const actor = new $.cc.Coelement(elem)

            expect(actor.elem).to.equal(elem)
        })
    })

    describe('component(className)', () => {
        it('works as a class decorator and registers the class as a class component of the given name', () => {
            class Cls {
                constructor(elem) {
                    elem.attr('this-is', 'decorated-component')
                }
            }

            $.cc.component('decorated-component')(Cls)

            const elem = $('<div />')

            elem.cc.init('decorated-component')

            expect(elem.attr('this-is')).to.equal('decorated-component')
        })
    })
})

describe('$.fn.cc', () => {
    class Spam {
        construtor(elem) {
            elem.attr('is_spam', 'true')
        }
    }

    before(() => {
        $.cc('spam', Spam)
    })

    it('is a function', () => {
        const elem = $('<div />')

        expect(elem.cc).to.be.a('function')
    })

    it('initializes the class compenents of the given names', () => {
        const elem = $('<div/>').cc('foo bar')

        expect(elem.attr('is_foo')).to.equal('true')
        expect(elem.attr('is_bar')).to.equal('true')
    })

    it('initializes the class components which the element has the name of', () => {
        const elem = $('<div class="foo bar" />').cc()

        expect(elem.attr('is_foo')).to.equal('true')
        expect(elem.attr('is_bar')).to.equal('true')
    })

    it('does nothing if it does not have the class component names', () => {
        const elem = $('<div class="foo-x bar-x" />').cc()

        expect(elem.attr('is_foo')).to.be.undefined
        expect(elem.attr('is_bar')).to.be.undefined

        const elem0 = $('<div class="" />').cc()

        expect(elem0.attr('is_foo')).to.be.undefined
        expect(elem0.attr('is_bar')).to.be.undefined
    })

    describe('init', () => {
        it('inserts the given class name into the element', () => {
            const elem = $('<div />')

            elem.cc.init('spam')

            expect(elem.hasClass('spam')).to.be.true
        })

        it('sets the coelement if it has a coelemental', () => {
            const elem = $('<div />')

            elem.cc.init('spam')

            expect(elem.cc.get('spam')).to.exists
            expect(elem.cc.get('spam')).to.be.instanceof(Spam)
        })

        it('returns the coelement if it has a coelement', () => {
            const elem = $('<div />')

            expect(elem.cc.init('spam')).to.be.instanceof(Spam)
        })
    })

    describe('get', () => {
        it('gets the coelement of the given name', () => {
            const elem = $('<div class="spam" />').appendTo('body')

            $.cc.init()

            expect(elem.cc.get('spam')).to.exist
            expect(elem.cc.get('spam')).to.be.instanceof(Spam)
        })

        it('throws an error when the corresponding coelement is unavailable', () => {
            const elem = $('<div class="does-not-exist" />').appendTo('body')

            $.cc.init()

            expect(() => {
                elem.cc.get('does-not-exist')
            }).to.throw()
        })

        it('throws an error when the elem is empty dom selectioin', () => {
            expect(() => {
                $('#nothing').cc.get('something')
            }).to.throw()
        })
    })
})
