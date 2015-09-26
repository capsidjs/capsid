# Examples

These example ideas are taken from [react.js homepage](https://facebook.github.io/react/).

## HelloMessage

js
```js
$.cc.register('hello-message', function (elem) {

    elem.text('Hello ' + elem.attr('name'));

});
```

html
```html
<div class="hello-message" name="John"></div>
```

result
```html
<div class="hello-message hello-message-initialized" name="John">Hello John</div>
```

[DEMO](http://kt3k.github.io/class-component/demo/hello-message.html)

## Timer

js
```js
var Timer = $.cc.subclass(function (pt) {

    pt.constructor = function (elem) {

        this.elem = elem;
        this.secondsElapsed = 0;

        this.start();

    };

    pt.start = function () {

        var that = this;

        if (this.interval) {

            return;

        }

        this.interval = setInterval(function () {

            that.tick();

        }, 1000);

    };

    pt.tick = function () {

        this.secondsElapsed ++;
        this.elem.text('Seconds Elapsed:' + this.secondsElapsed);

    };

    pt.stop = function () {

        clearInterval(this.interval);

        delete this.interval;

    };

});

$.cc.assign('timer', Timer);
```

html
```html
<div class="timer"></div>
```

result
```html
<div class="timer timer-initialized">Seconds Elapsed:123</div>
```

You can stop the timer by calling `$('.timer').cc.get('timer').stop()`.

[DEMO](http://kt3k.github.io/class-component/demo/timer.html)
