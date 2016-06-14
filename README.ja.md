# class-component.js v9.1.2 <img align="right" src="http://kt3k.github.io/class-component/asset/class-component.svg" />

[![Build Status](https://travis-ci.org/kt3k/class-component.svg?branch=master)](https://travis-ci.org/kt3k/class-component) [![Coverage Status](https://coveralls.io/repos/kt3k/class-component/badge.svg?branch=master&service=github)](https://coveralls.io/github/kt3k/class-component?branch=master)

> Special html class tool

class-component.js は特殊な機能を持った html class を作るためのツールです。特殊な機能を持った html class というのは、例えば、bootstrap の *modal* クラスが、html に `.modal` を指定するだけで、その dom がモーダルとして機能するというのと同じように、html になんらかのクラスを指定することで、特定の振る舞いをする class という意味です。このライブラリはそのような特殊クラスを定義することを支援するツールです。

class-component.js は jQuery plugin です。$.cc と $.fn.cc の2つの名前空間を使います。

現在の class-component.js のサイズは 4.9K (minified) です。

## インストール

### npm の場合

```sh
npm install --save class-component
```

```js
global.jQuery = require('jquery');
require('class-component');
```

### bower の場合

```sh
bower install --save jquery class-component
```

```html
<script src="path/to/jquery.js"></script>
<script src="path/to/class-component.js"></script>
```

### 直接使う

dist.min.js をダウンロードして以下のうように読み込んでください。

```html
<script src="path/to/jquery.js"></script>
<script src="path/to/class-component.js"></script>
```
**注**: class-component.js は jQuery plugin なので、jQuery をまず読み込んでください。

## API

### `$.cc` 名前空間

#### `$.cc.register(className, func)`

func を className のクラスコンポネント初期化関数として登録します。className のクラスが html
上にあった場合に、func がその dom (の jQuery オブジェクト) を第１引数として呼ばれます。

- className `String` クラス名 (この名前のクラスがクラスコンポネントとして機能します)
- func `Function` このクラスコンポネントの初期化関数

```js
$.cc.register('clear-btn', function (elem) {

    elem.on('click', function () {

        elem.trigger('item-clear');

    });

});
```

```html
<li class="clear-btn"></li>
```

上の例では、clear-btn クラスは初期化時に click のイベントハンドラーが設定されて、item-clear イベントを発行するように設定されます。

#### `$.cc.assign(className, constructor)`

$.cc.register と似ていますが若干違います。
className に対して、constructor をコエレメントのコンストラクタとして登録します。コエレメントのコンストラクタは、className クラスの初期化時にその dom の jQuery オブジェクトを第１引数として呼ばれます。コエレメントのインスタンスは、dom の中に保存され、dom.cc.get(className) で取得することができます。

- className `String` クラス名
- constructor `Function` コエレメントのコンストラクタ

```js

class TodoItem {

    constructor() { /* ... */ }

    complete() { /* ... */ }

    uncomplete() { /* ... */ }

}

$.cc.assign('todo-item', TodoItem);
```

```html
<li class="todo-item"></li>
```

#### `$.cc.init(className, element)`

element 以下にある、className のクラスコンポネントを初期化します。element 省略時はページ全体で初期化します。引数を全て省略すると、ページ全体の全てのクラスコンポネントを初期化します。動的にクラスコンポネントをページ内に追加した場合、このメソッドを使って初期化してください。多重の初期化は自動的に防がれるので、既に初期化された範囲を気にする必要はありません。

- className `String` 初期化するクラス名 (省略可)
- element `HTMLElement|String` 初期化する範囲の dom (省略可)

#### `$.cc.subclass(parent, func)`

クラスを定義するためのユティリティ関数。詳しくは [subclass repository](https://github.com/kt3k/subclass) 参照。

```js
var MyClass = $.cc.subclass(function (pt) {

    pt.constructor = function () { /* ... */ };

    pt.method = function () { /* ... */ };

});
```

以上のスクリプトは以下の es6 スクリプトとほぼ同値です。

```js
class MyClass {

    constructor() { /* ... */ }

    method() { /* ... */ }

}
```

### `$.fn.cc` namespace

#### `$.fn.cc.get(className)`

className のコエレメントがあれば取得します。なければ例外を投げます。

- className `String` 取得するクラス名

```js
var todoItem = elem.cc.get('todo-item');

todoItem.update({id: 'milk', title: 'Buy a milk'});
```

#### `$.fn.cc.init(className)`

このメソッドが呼ばれた dom を className 名のクラスコンポネントとして初期化します。(クラス名も自動的に追加されます) 動的に特定のクラスコンポネントを生成したい場合に使います。与えられたクラス名のクラスコンポネントが存在しない場合例外を投げます。

- className `String` 初期化するクラス名

```js
// Creates `todo-app` in #main
$('<div />').appendTo('#main').cc.init('todo-app');
```

上の例では `<div>` 要素が追加されて、`todo-app` クラスコンポネントとして初期化されます。

## Glossary

### クラスコンポネント Class Component

<img align="right" width="300" src="http://kt3k.github.io/class-component/asset/the-diagram.svg" />

クラスコンポネントは特殊な振る舞いを持った html クラスです。特定のクラス名を与えることで、特定の振る舞いを持つ html クラスのことをクラスコンポネントと呼びます。class-component.js はこの意味でのクラスコンポネントを定義するためのサポートツールです。

### コエレメント Coelement (双対要素)

(co- は、"対の" という意味の接頭辞です。例 sine / cosine, tangent / cotangent など)

コエレメントはエレメント (生 dom) と対になって、クラスコンポネントを定義するクラスです。コエレメントからは this.elem で、エレメントからは、elem.cc.get(className) で、相互に参照可能です。

## 使用例

- [Simple examples](https://github.com/kt3k/class-component/blob/master/EXAMPLE.md)
- [TodoMVC](https://github.com/kt3k/class-component-todomvc)

## ライセンス

MIT
