(function (global) {
    'use strict';

    var document = global.document,
        states = {start: 1, loading: 2, ready: 3, typesetting: 4, error: 5},
        state = states.start,
        queue = [],
        mathjaxHub,
        src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js',
        element_prototype = Object.create(HTMLElement.prototype);

    function flush_queue() {
        var typesets = [], reprocesses = [];
        queue.forEach(function (elem) {
            var elem_state = mathjaxHub.isJax(elem);
            if (elem_state < 0)
                typesets.push(elem);
            else if (elem_state > 0)
                reprocesses.push(elem);
        });
        queue = [];
        if (typesets.length || reprocesses.length) {
            state = states.typesetting;
            if (typesets.length) {
                if (typesets.length === 1) typesets = typesets[0];
                mathjaxHub.Queue(['Typeset', mathjaxHub, typesets]);
            }
            if (reprocesses.length) {
                if (reprocesses.length === 1) reprocesses = reprocesses[0];
                mathjaxHub.Queue(['Reprocess', mathjaxHub, reprocesses]);
            }
            mathjaxHub.Queue(flush_queue);
        } else
            state = states.ready;
    }

    function load_library() {
        state = states.loading;
        global.MathJax = {
            skipStartupTypeset: true,
            showMathMenu: false,
            jax: ['input/TeX', 'output/HTML-CSS'],
            TeX: {
                extensions: ['AMSmath.js', 'AMSsymbols.js', 'noErrors.js', 'noUndefined.js']
            },
            AuthorInit: function () {
                mathjaxHub = global.MathJax.Hub;
                mathjaxHub.Register.StartupHook('End', function () {
                    state = states.ready;
                    flush_queue();
                });
            }
        };
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;
        script.async = true;
        script.onerror = function () {
            console.warn("Error loading MathJax library " + src);
            state = states.error;
            queue = [];
        };
        document.head.appendChild(script);
    }

    element_prototype.attachedCallback = function () {
        if (this.hasAttribute('src'))
            src = this.getAttribute('src');
        if (!this.hasAttribute('lazy'))
            load_library();
    };

    element_prototype.typeset = function (elem) {
        if (state === states.error)
            return;
        queue.push(elem);
        if (state === states.start)
            load_library();
        else if (state === states.ready)
            flush_queue();
    };

    document.registerElement('mathjax-loader', {
        prototype: element_prototype
    });

})(window);
