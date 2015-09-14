
var $ = global.jQuery = require('jquery');
require('./class-component');

describe('$.cc', function () {
    'use strict';

    before(function () {

        $.cc.register('foo', function (elem) {

            elem.attr('is_foo', 'true');

        });

        $.cc.register('bar', function (elem) {

            elem.attr('is_bar', 'true');

        });

    });

    describe('init', function () {

        beforeEach(function () {

            $('body').empty();

        });

        it('initializes the class component of the given name', function () {

            var foo = $('<div class="foo" />').appendTo(document.body);

            $.cc.init('foo');

            expect(foo.attr('is_foo')).to.equal('true');

        });


        it('initializes multiple class components', function () {

            var foo = $('<div class="foo" />').appendTo('body');
            var bar = $('<div class="bar" />').appendTo('body');

            $.cc.init(['foo', 'bar']);

            expect(foo.attr('is_foo')).to.equal('true');
            expect(bar.attr('is_bar')).to.equal('true');

        });

        it('initializes multiple class componet by class names separated by whitespaces', function () {

            var foo = $('<div class="foo" />').appendTo('body');
            var bar = $('<div class="bar" />').appendTo('body');

            $.cc.init('foo bar');

            expect(foo.attr('is_foo')).to.equal('true');
            expect(bar.attr('is_bar')).to.equal('true');

        });

    });

    describe('assign', function () {

        it('registers a class component of the given name', function () {

            $.cc.assign('assign-test0', function () {});

            expect($.cc.__manager__.ccc['assign-test0']).to.be.exist;

        });

        it('sets coelementName property to the given construtor', function () {

            var Class0 = function () {};

            $.cc.assign('assgin-test1', Class0);

            expect(Class0.coelementName).to.equal('assgin-test1');

        });

        it('sets __coelement:class-name data property when the class component is initialized', function () {

            var Class1 = function () {};

            $.cc.assign('assign-test2', Class1);

            var elem = $('<div class="assign-test2" />').appendTo('body');

            $.cc.init('assign-test2', 'body');

            expect(elem.data('__coelement:assign-test2')).to.be.instanceof(Class1);

        });

    });

    describe('subscribe', function () {

        it('is a function', function () {

            expect($.cc.subclass).to.be.a('function');

        });

    });

    describe('Actor', function () {

        it('is a function', function () {

            expect($.cc.Actor).to.be.a('function');

        });

    });

});

describe('$.fn.cc', function () {
    'use strict';

    var Spam = $.cc.subclass(function (pt) {

        pt.construtor = function () {

            elem.attr('is_ham', 'true');

        };

    });

    var Ham = $.cc.subclass($.cc.Actor, function (pt) {});

    before(function () {

        $.cc.assign('spam', Spam);

        $.cc.assign('ham', Ham);

    });

    it('is a ClassComponentConfiguration', function () {

        var elem = $('<div />');

        expect(elem.cc).to.exist;
        expect(elem.cc).to.be.instanceof(require('./lib/ClassComponentContext'));

    });

    describe('init', function () {

        it('inserts the given class name into the element', function () {

            var elem = $('<div />');

            elem.cc.init('spam');

            expect(elem.hasClass('spam')).to.be.true;

        });

        it('sets the coelement if it has a coelemental', function () {

            var elem = $('<div />');

            elem.cc.init('spam');

            expect(elem.cc.get('spam')).to.exists;
            expect(elem.cc.get('spam')).to.be.instanceof(Spam);

        });

        it('returns the coelement if it has a coelement', function () {

            var elem = $('<div />');

            expect(elem.cc.init('spam')).to.be.instanceof(Spam);

        });

    });

    describe('get', function () {

        it('gets the coelement of the given name', function () {

            var elem = $('<div class="spam" />').appendTo('body');

            $.cc.init();

            expect(elem.cc.get('spam')).to.exist;
            expect(elem.cc.get('spam')).to.be.instanceof(Spam);

        });

        it('throws an error when the corresponding coelement is unavailable', function () {

            var elem = $('<div class="does-not-exist" />').appendTo('body');

            $.cc.init();

            expect(function () {

                elem.cc.get('does-not-exist');

            }).to.throw();

        });

    });

    describe('getActor', function () {

        it('gets the actor', function () {

            var elem = $('<div class="ham" />').appendTo('body');

            $.cc.init();

            expect(elem.cc.getActor()).to.be.instanceof(Ham);

        });

    });

});
