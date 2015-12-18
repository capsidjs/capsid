# class-component.js

class-component.js は一回だけ初期化されることが保証されるカスタムな html class を作るためのツールです。

class-component.js is a tool for creating a custom html class which is assured to be initialized once and only once with your custom function.

# 背景
# Background

### class に特定の機能をバインドする

よくあるテクニック

This is a common technique.

**例A**
```js
$('.help-mark').on('mouseover', function () {
  $(this).addClass('show-help-tooltip');
});

$('.help-mark').on('mouseout', function () {
  $(this).removeClass('show-help-tooltip');
});
```
この例は、`help-mark` クラスの dom にマウスを当てると `show-help-tooltip` クラスが付加されて、マウスを外すと `show-help-tooltip` クラスが外されます。

In this example, when the user moves the mouse on the `help-mark` class element, it gets `show-help-tooltip` and when the user moves the mouse out of it, `show-help-tooltip` class is removed from the element.

### 上の例の何が問題か?
### What's wrong about the above example?

静的なページの場合、上のコードには何の問題もありませんが、ページが動的で、動的に追加される要素の中に `help-mark` が入っている可能性がある場合、状況がややこしくなります。

If the page is completely static, then the above code doesn't have any problem. However, if the page is dynamic, it can get messy.

**例A** のコードが走った後に、`help-mark` クラスを持った要素が動的に画面内に追加される場合、上の初期化を再度かける必要が出てきますが、単純に **例A** を再度実行してしまうと、同じハンドラーが多重にバインドされてしまいます。そこで次のような例を考えてみます。

**例B**
```
function initHelpMark(range) {
  $('.help-mark', range).on('mouseover', function () {
    $(this).addClass('show-help-tooltip');
  });

  $('.help-mark', range).on('mouseout', function () {
    $(this).removeClass('show-help-tooltip');
  });
}
```
上の initHelpMark 関数を使って、ページロード時に `initHelpMark()` を呼んで、動的要素追加時に `initHelpMark(appendedDom)` を呼べば、正しく `help-mark` クラス要素を初期化できることになります。(ただし、appendedDom は追加された dom の範囲を正しく指定する。)

この方法には以下のような問題があります。

- 1 関数を作る必要がある。
- 2 関数を正しいタイミングで呼ぶ必要がある。
- 3 初期化する範囲を正しく指定する必要がある。

特に、3. については、動的な dom 追加をするコードがどこにあるかすぐに特定できないような場合には、単に面倒というだけでなく、そもそも非常に困難です。そこで、この問題に対応するために、例えば、以下のような対策を取ることが考えられます。

**例C**
(初期化したことを `help-mark-initialized` クラスで表現する)
```
function initHelpMark() {
  $('.help-mark:not(.help-mark-initialized)').on('mouseover', function () {
    $(this).addClass('show-help-tooltip');
  });

  $('.help-mark:not(.help-mark-initialized)').on('mouseout', function () {
    $(this).removeClass('show-help-tooltip');
  });

  $('.help-mark').addClass('.help-mark-initialized');
}
```

上の例では、初期化済みの `help-mark` クラス要素に `help-mark-initilized` クラスを付加し、`help-mark-initilized` が付いている `help-mark` はもう初期化しないという方法を取っています。この方法で、ページに動的更新があったタイミングで常に `initHelpMark()` を呼べば、すべての `help-mark` が 1度づつだけ正しく初期化されている状態が保証されます。(上の 3. の問題が解消されます。)

ここまでで、動的に追加される可能性のあるクラスを正しく初期化する方法を検討しました。

## class-component.js

**例C** の書き方をすれば、動的に追加される可能性のある `help-mark` クラスをほぼ正しく初期化できそうということがわかりましたが、上のコードは本来やりたかったシンプルな書き方 (**例A**) に比べると大分面倒になっています。すべてのカスタムな機能を持った html クラスについて上のようなまわりくどい初期化処理を毎回書くのはあまりにも煩わしいです。

この状況を解決して、簡単な記法で、正しく class に対して特定の機能をバインドするための手段を提供するのが、 class-component.js の目的です。

上の `help-mark` の初期化は class-componet を使って次のようにかけます。(class-componet.js の関数は $.cc 名前空間以下を利用します)

**例D** (class-component を使った `help-mark` の定義)
```
$.cc.register('help-mark', function (elem) {

  elem.on('mouseover', function () {
    $(this).addClass('show-help-tooltip');
  });

  elem.on('mouseout', function () {
    $(this).removeClass('show-help-tooltip');
  });

});
```

上の定義を書くことで、ページロード時には自動的に `.help-mark` 要素が初期化されます。また動的にロードした場合は `$.cc.init()` を呼ぶことで、未初期化の `.help-mark` を見つけて自動的に初期化します。(多重初期化されることはありません)

以上が、class-component.js の基本的な使い方です。

### 例D の別の見方 (class-component としての `help-mark`)

ここまで、動的に追加される特殊 class を正しく初期化するという観点から **例D** を説明しましたが、別の見方で見ると、**例D** は `help-mark` クラスを持った html 要素は常にどのような振る舞いを持つべきかということ記述していると見ることが出来ます。つまりは、**例D** を `help-mark` クラス要素の振る舞いの定義と見なすことが出来ます。その観点で見た場合の、`.help-mark` は通常の機能に追加で上の定義で拡張された機能を持った dom 要素と考えることが出来ます。そのように捉えた場合の、拡張された dom としてのクラス要素のことをここではクラスコンポネント (class-component) と呼ぶこととします。

# 応用編

## $.cc.assign

オブジェクト指向的に class-component を定義する
TBD

# class-component のテスト

class-component は unit test に向いている
TBD

# class-component のドキュメント

class-component はどのようにドキュメントすべきか。polymer element のようにドキュメントすべき。
TBD

# License

MIT
