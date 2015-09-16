# class-component framework

# Public APIs

## Static APIs

These are accessible through `$.cc` namespace.

- $.cc.register(className, func);
- $.cc.assign(className, constructor)
- $.cc.init(className, element);

## Instance APIs

These are accessible through jQuery object's `.cc` property.

- $.fn.cc.get(className);
- $.fn.cc.getActor();
- $.fn.cc.init(className);

# Concepts

## HTML Component

An HTML Component is a group of html elements which has some special functions in addition to usual dom function.

## Class Component

A Class Component is a group of html elements which has some special functions and is characterize by its `html class name`.

Class-component framework helps developers define class components in the above sense.

## Coelement

A Coelement is a type of js class which is meant to accompany an html element and characterize its behavior as an HTML Component.
