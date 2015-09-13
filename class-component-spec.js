

before(function () {

    $.CC.register('foo', function (elem) {

        elem.attr('is_foo', 'true');

    });

    $.CC.register('bar', function (elem) {

        elem.attr('is_bar', 'true');

    });

});

describe('$.CC.init', function () {
    'use strict';

    beforeEach(function () {

        $('body').empty();

    });

    it('initializes the class component of the given name', function () {

        var foo = $('<div class="foo" />').appendTo(document.body);

        $.CC.init('foo');

        expect(foo.attr('is_foo')).to.equal('true');

    });


    it('initializes multiple class components', function () {

        var foo = $('<div class="foo" />').appendTo('body');
        var bar = $('<div class="bar" />').appendTo('body');

        $.CC.init(['foo', 'bar']);

        expect(foo.attr('is_foo')).to.equal('true');
        expect(bar.attr('is_bar')).to.equal('true');

    });

    it('initializes multiple class componet by class names separated by whitespaces', function () {

        var foo = $('<div class="foo" />').appendTo('body');
        var bar = $('<div class="bar" />').appendTo('body');

        $.CC.init('foo bar');

        expect(foo.attr('is_foo')).to.equal('true');
        expect(bar.attr('is_bar')).to.equal('true');

    });

});
