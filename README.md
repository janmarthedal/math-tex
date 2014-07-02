math-tex
========

A [polymer](http://polymer-project.org) element for typesetting math written in \(La\)TeX, using [MathJax](http://mathjax.org).

See the [demo](http://janmarthedal.github.io/math-tex/components/math-tex/demo.html).

## Get started

To use on your page [download](https://github.com/Polymer/platform/releases) `platform.js` and `math-tex.html`.

Then make sure

    <script src="platform.js"></script>

is present in your page head (adjust path as needed), followed by

    <link rel="import" href="math-tex.html">

## Usage

To insert math inline, write something like `<math-tex>x^2+2x-8</math-tex>`.

To render math in display/block style, add the attribute `mode="display"`:

    <math-tex mode="display">\sum_{k=1}^n k = \frac{n(n+1)}{2}</math-tex>

By default, the MathJax library will be loaded when the first `<math-tex>` tag is met. To start loading the library earlier, for instance in the head of the page, you can put

    <math-tag-setup></math-tag-setup>

where you would like the load to start (it will not block loading the rest of the page).
