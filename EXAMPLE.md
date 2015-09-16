
# HelloMessage

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

# Timer

js
```js
var Timer = $.cc.subclass(function (pt) {

    pt.constructor = function () {

        this.secondsElapsed = 0;

        var that = this;

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
<div class="timer timer-initialized">elapsed: 123</div>
```

