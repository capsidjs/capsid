# What's wrong about AngularJS

## Ugly markups
## unnecessary binding
## immature model interation
## Different lifecycles of dom and view are complicated and unintuitive.

# What's wrong about React

## So big

Virtual dom is no doubt great technology itself but the problem is that it's so big and we don't like big thing in frontend. Big structure is big chance of strange bugs. This means we could waste lots of time and resources for debugging strange bug from deep inside of the React.

## Without JSX, it's utterly full of code smells.

React says usage of JSX is optional. It's true. There's simple alternative way to write React component in bare js. But if did so, the source code will be full of long method calls of React APIs and they are nothing but a bunch of code smells.

Virtually we need to use JSX as well and that makes code organization quite messy.

## Different lifecycles of dom and react component

It's actually quite complicated and unintuitive aspect of React. We need to "mount" react component to dom.

# What's wrong about Polymer

## The basic concept is great.

## Basic elements are strange and sound quite nonsensical.

What's iron, neon, gold, silver and platinum? Why did they appear in Polymer standard library. They suddenly appeared at version 1.0 of the framework and we couldn't see what was the process for deciding them. It just suddenly appeared.

## We are betrayed of the promise that there going to be "meaningful" markups again.

We don't call things like `<iron-blah-blah>` or `<neon-blah-blah>` meaningful because those names are utterly nonsense. They are totally irrelavant of html or dom api and seem totally unfamiliar to the developers who have experience of browser programming.

## The process of library development doesn't seem open

Basic elements are very important because it's basic vocabulary of Polymer world. But it seems that very small number of people in Google quite arbitrarily decided those names. We couldn't observe any visible discussion about the process of design choices before the release of version 1.0.

## Relys lots on WebComponents spec, espcecially shadow dom, but it doesn't seem smooth.

## Relying on unreliable technology and process.

It used to rely on shadow dom and now seems to rely on something called ShadyDom, but there is no documentation of it and therefore the technology stack of Polymer is now sort of mystery. If you had a strange bug deep inside the polymer source code, then the debugging of it could be really time consuming and fruitless.
