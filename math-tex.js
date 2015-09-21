/*
Typesets math written in (La)TeX, using [MathJax](http://mathjax.org).

##### Example

    <math-tex>c = \sqrt{a^2 + b^2}</math-tex>

##### Example

    <math-tex mode="display">\sum_{k=1}^n k = \frac{n (n + 1)}{2}</math-tex>

@element math-tex
@version 0.3.0
@homepage http://github.com/janmarthedal/math-tex/
*/
(function() {
    'use strict';

    var TAG_NAME = 'math-tex',
        HANDLER_TAG_NAME = 'mathjax-loader',
        mutation_config = {childList: true, characterData: true, attributes: true},
        handler,
        element_prototype = Object.create(HTMLElement.prototype);

    function check_handler() {
        if (handler || (handler = document.querySelector(HANDLER_TAG_NAME))) return;
        handler = document.createElement(HANDLER_TAG_NAME);
        if (!handler || typeof handler.typeset !== 'function') {
            console.warn(['no', HANDLER_TAG_NAME, 'element defined;', TAG_NAME, 'element will not work'].join(' '));
            handler = undefined;
        } else
            document.head.appendChild(handler);
    }

    element_prototype.createdCallback = function () {
        check_handler();
        if (!handler) return;
        var script = document.createElement('script');
        this.createShadowRoot().appendChild(script);
        this._private = {jax: script};
    };

    element_prototype.attachedCallback = function () {
        var elem = this;
        if (!handler) return;
        if (this.textContent.trim())
            this.update();
        this._private.observer = new MutationObserver(function () {
            elem.update();
        });
        this._private.observer.observe(this, mutation_config);
    };

    element_prototype.detachedCallback = function () {
        if (this._private) {
            this._private.observer.disconnect();
            delete this._private;
        }
    }

    element_prototype.update = function () {
        var script = this._private.jax;
        script.type = this.getAttribute('display') === 'block' ? 'math/tex; mode=display' : 'math/tex';
        script.textContent = this.textContent;
        handler.typeset(script);
    }

    document.registerElement(TAG_NAME, {prototype: element_prototype});

})();
