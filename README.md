# &lt;math-tex&gt;

A Custom Element for typesetting math written in \(La\)TeX, using [MathJax](http://mathjax.org).

See the [demo page](http://janmarthedal.github.io/math-tex/).

## Get started

Make `math-tex.html` and `mathjax-loader.html` available (placed under `src/`) and
load `math-tex.html` using an HTML Import in the head of your page,

    <link rel="import" href="math-tex.html">

To have support for the (modern) browsers who don't have Custom Elements, Shadow DOM and
HTML imports available natively, [download](https://github.com/Polymer/platform/releases)
`platform.js` (a [Polymer](http://www.polymer-project.org/docs/start/platform.html) library) and insert

    <script src="platform.js"></script>

in your page head (preferable as the first script).

## Usage

To insert math inline, write something like `<math-tex>x^2+2x-8</math-tex>`.

To render math in display/block style, add the attribute `mode="display"`:

    <math-tex mode="display">\sum_{k=1}^n k = \frac{n(n+1)}{2}</math-tex>

By default, the MathJax library will be loaded when the first `<math-tex>` element is created. To start
loading the library earlier, for instance in the head of the page, you can put

    <mathjax-loader></mathjax-loader>

where you would like the load to start.
