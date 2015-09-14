

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

    });

    describe('subscribe', function () {
        'use strict';

        it('is a function', function () {

            expect($.cc.subclass).to.be.a('function');

        });

    });

    describe('Coelement', function () {

        it('is a function', function () {

            expect($.cc.Coelement).to.be.a('function');

        });

    });

    describe('Actor', function () {

        it('is a function', function () {

            expect($.cc.Actor).to.be.a('function');

        });

    });

});
