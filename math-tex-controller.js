(function (global) {
  'use strict';
    
  if (!('customElements' in global)) return;

  const document = global.document,
    states = {start: 1, loading: 2, ready: 3, typesetting: 4, error: 5};
  let mathjaxHub,
    typesets = [],
    state = states.start,
    src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js';

  function flush_typesets() {
    if (!typesets.length) return;
    const jaxs = [], items = [];
    typesets.forEach(function(item) {
      const script = document.createElement('script'),
        div = document.createElement('div');
      script.type = item[1] ? 'math/tex; mode=display' : 'math/tex';
      script.text = item[0];
      div.style.position = 'fixed';
      div.appendChild(script);
      document.body.appendChild(div);
      jaxs.push(script);
      items.push([div, item[2]]);
    });
    typesets = [];
    mathjaxHub.Queue(['Typeset', mathjaxHub, jaxs]);
    mathjaxHub.Queue(function() {
      items.forEach(function(item) {
        const div = item[0];
        const result = div.firstElementChild.tagName === 'SPAN' ? div.firstElementChild : null;
        item[1](result);
        document.body.removeChild(div);
      });
      flush_typesets();
    });
  }

  function load_library() {
    state = states.loading;
    global.MathJax = {
      skipStartupTypeset: true,
      showMathMenu: false,
      jax: ['input/TeX', 'output/CommonHTML'],
      TeX: {
        extensions: ['AMSmath.js', 'AMSsymbols.js', 'noErrors.js', 'noUndefined.js']
      },
      AuthorInit: function () {
        mathjaxHub = global.MathJax.Hub;
        mathjaxHub.Register.StartupHook('End', function() {
          state = states.ready;
          console.log('mathjax ready');
          flush_typesets();
        });
      }
    };
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    script.async = true;
    script.onerror = function () {
        console.warn('Error loading MathJax library ' + src);
        state = states.error;
        typesets = [];
    };
    document.head.appendChild(script);
  }

  class MathTexController extends HTMLElement {

    connectedCallback() {
      console.log('math-tex-controller connected');
      if (this.hasAttribute('src'))
        src = this.getAttribute('src');
      if (!this.hasAttribute('lazy'))
        load_library();
    }

    typeset(math, displayMode, cb) {
      if (state === states.error)
        return;
      typesets.push([math, displayMode, cb]);
      if (state === states.start)
        load_library();
      else if (state === states.ready)
        flush_typesets();
    }

  }

  global.customElements.define('math-tex-controller', MathTexController);
    
})(window);
