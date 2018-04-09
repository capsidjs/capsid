# The timer

The timer example:

timer.js:

```html
<span class="timer"></span>

<script src="path/to/capsid.js"></script>
<script>
class Timer {
  __mount__ () {
    this.secondsElapsed = 0
    this.start()
  }

  /**
   * Starts the timer.
   */
  start () {
    this.interval = setInterval(() => { this.tick() }, 1000)
  }

  /**
   * Ticks the timer.
   */
  tick () {
    this.secondsElapsed++
    this.el.textContent = `Seconds Elapsed: ${this.secondsElapsed}`
  }

  /**
   * Stops the timer.
   */
  stop () {
    clearInterval(this.interval)
  }
}

capsid.def('timer', Timer)
</script>
```

See [the working demo](https://capsidjs.github.io/capsid/demo/timer.html).
