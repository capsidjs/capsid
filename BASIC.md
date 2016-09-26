# The features

- View initialization
- Component initialization
- No models

# The basic concept

## Dom

Dom, Document Object Model, is distinguished from markups. Markups are string representation of dom objects using tags like `<div></div>`, `<p></p>` etc. Doms are evaluated result of markups in a sense.

Dom is sometimes called Element depending on the context. The meaning is basically the same.

## View

View is the same as Dom in class-component.js. Template is a way for generating *markups* in a systematic manner but not a view itself and should not be it. `class-component.js` discourages to use Templates as a part of View, on the other hand it encourages to use Dom itself as View.

## Coelement

Coelement is similar to Controller of MVC or Presenter of MVP. Coelement accompanies the dom (or Element). A colement accompanies always a single dom. A single dom can be accompanied by multiple coelements. The link between Element (=Dom) and Coelement is decided by the html class which the dom has. For example if `foo` is registered colement name then the `<div class="foo"></foo>` is automatically accompanied by the *foo coelement*.

## class-component

A pair of an element and a coelement in accompany relationship is called class-component.

## Model

There is no concept of models in `class-component.js`. A domain model is something which should be implemented out of GUI context. So class-component does not support building models. They should be defined somewhere isolated from GUI programming.
