(function() {
    'use strict';

    var states = {start: 1, loading: 2, ready: 3, error: 4},
        state = states.start,
        typesetting = false,
        queue = [],
        src = 'https://cdn.mathjax.org/mathjax/latest/MathJax.js',
        element_prototype = Object.create(HTMLElement.prototype);

    function process_queue() {
        var typesets = [], reprocesses = [];
        queue.forEach(function (elem) {
            var state = MathJax.Hub.isJax(elem);
            if (state === -1)
                typesets.push(elem);
            else if (state === 1)
                reprocesses.push(elem);
        });
        queue = [];
        if (typesets.length) {
            if (typesets.length === 1) typesets = typesets[0];
            MathJax.Hub.Queue(['Typeset', MathJax.Hub, typesets]);
        }
        if (reprocesses.length) {
            if (reprocesses.length === 1) reprocesses = reprocesses[0];
            MathJax.Hub.Queue(['Reprocess', MathJax.Hub, reprocesses]);
        }
        if (typesets.length || reprocesses.length)
            MathJax.Hub.Queue(process_queue);
        else
            typesetting = false;
    }

    function check_queue() {
        if (state === states.ready && !typesetting) {
            typesetting = true;
            process_queue();
        }
    }

    function load_library() {
        state = states.loading;
        MathJax = {
            skipStartupTypeset: true,
            jax: ['input/TeX', 'output/HTML-CSS'],
            AuthorInit: function () {
                MathJax.Hub.Register.StartupHook('End', function () {
                    state = states.ready;
                    check_queue();
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
        if (!this.hasAttribute('lazyload'))
            load_library();
    };

    element_prototype.typeset = function (elem) {
        if (state === states.error)
            return;
        queue.push(elem);
        if (state === state.ready)  // lazy load
            load_library();
        else
            check_queue();
    };

    document.registerElement('mathjax-loader', {
        prototype: element_prototype
    });

})();
