# MVP

`capsid` suppose the use of [MVP (Model View Presenter) pattern](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93presenter) or [Passive View](https://martinfowler.com/eaaDev/PassiveScreen.html).

In `capsid`, DOM works as *(Passive) View*, component works as *Presenter*, and *Model* is any data. Still we are open about how to organize the data, we recommend the use of [DDD](https://en.wikipedia.org/wiki/Domain-driven_design) or its simpler variant for design the data handling of your app.

In `capsid`, each (*component*, *dom*, *data*) triple forms the MVP unit and they naturally have tree structure based on document dom tree structure. This is similar to HMVC or PAC patterns.
