# &lt;math-tex&gt;

A Custom Element for typesetting math written in \(La\)TeX, using
[MathJax](http://mathjax.org).

See the [demo page](http://janmarthedal.github.io/math-tex/).

## Get started

Make `math-tex.js` and `mathjax-loader.js` available and load both in the head
of your page,

    <script src="mathjax-loader.js"></script>
    <script src="math-tex.js"></script>

(make sure to concatenate and minify for production use). To have support for
many browsers who don't yet have Custom Elements, Shadow DOM and
MutationObservers available natively, [download](https://github.com/webcomponents/webcomponentsjs)
a polyfill library and insert something like

    <script src="node_modules/webcomponents.js/webcomponents.min.js"></script>

in your page head (preferable as the first script).

## Usage

To insert math inline, write something like `<math-tex>x^2+2x-8</math-tex>`.

To render math in display/block style, add the attribute `display="block"`:

    <math-tex display="block">\sum_{k=1}^n k = \frac{n(n+1)}{2}</math-tex>

By default, the MathJax library will be loaded when the first `<math-tex>` element is created. To start
loading the library earlier, for instance in the head of the page, you can put

    <mathjax-loader></mathjax-loader>

where you would like the load to start.
