(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const states = new Map();
  const overflow = window.CSS?.supports('overflow', 'clip') ? 'clip' : 'hidden';
  let nextId = 0;

  const pixels = value => Number.parseFloat(value) || 0;

  function closedHeight(state) {
    const box = getComputedStyle(state.details);
    const summary = getComputedStyle(state.summary);
    return state.summary.getBoundingClientRect().height
      + pixels(summary.marginTop) + pixels(summary.marginBottom)
      + pixels(box.paddingTop) + pixels(box.paddingBottom)
      + pixels(box.borderTopWidth) + pixels(box.borderBottomWidth);
  }

  function settle(state) {
    // Clear the callback first: cancelling a superseded animation must not finish it.
    if (state.animation) {
      state.animation.onfinish = null;
      state.animation.cancel();
      state.animation = null;
    }
    if (!state.wanted && state.content.contains(document.activeElement)) {
      state.summary.focus({ preventScroll: true });
    }
    state.details.open = state.wanted;
    state.summary.setAttribute('aria-expanded', String(state.wanted));
    state.content.inert = false; // Native closed details already hide their contents.
    state.details.style.height = state.original.height;
    state.details.style.overflow = state.original.overflow;
    state.details.style.boxSizing = state.original.boxSizing;
    state.details.classList.remove('is-animating');
  }

  function change(state, wanted, options = {}) {
    const previousWanted = state.wanted;
    if (!options.resize && previousWanted === wanted && state.details.open === wanted && !state.animation) return;

    // Read the animated box before cancelling, so fast reversals start exactly here.
    let start = state.details.getBoundingClientRect().height;
    if (options.start !== undefined) start = options.start;
    else if (!state.animation && wanted && !previousWanted) start = closedHeight(state);

    if (state.animation) {
      state.animation.onfinish = null;
      state.animation.cancel();
      state.animation = null;
    }
    state.wanted = wanted;
    state.summary.setAttribute('aria-expanded', String(wanted));

    if (!wanted && state.content.contains(document.activeElement)) {
      state.summary.focus({ preventScroll: true });
    }
    // Avoid tabbing into a panel on its way to being closed. Its summary stays usable.
    state.content.inert = !wanted;
    state.details.style.boxSizing = 'border-box';
    state.details.style.overflow = overflow;
    state.details.open = true;
    state.details.style.height = 'auto';
    const end = wanted ? state.details.getBoundingClientRect().height : closedHeight(state);
    state.details.style.height = `${start}px`;

    if (options.animate === false || reducedMotion.matches || !state.details.animate || Math.abs(end - start) < 1) {
      settle(state);
      return;
    }

    state.details.classList.add('is-animating');
    const animation = state.details.animate([
      { height: `${start}px` },
      { height: `${end}px` }
    ], {
      duration: Math.min(380, Math.max(180, Math.abs(end - start) * 0.9)),
      easing: 'cubic-bezier(.22, .75, .24, 1)',
      fill: 'both'
    });
    state.animation = animation;
    animation.onfinish = () => {
      if (state.animation === animation) settle(state);
    };
  }

  function initialize(details) {
    if (states.has(details)) return;
    const summary = [...details.children].find(child => child.tagName === 'SUMMARY');
    if (!summary) return;

    const content = document.createElement('div');
    content.className = 'accordion-content';
    do { content.id = `don-accordion-${++nextId}`; } while (document.getElementById(content.id));
    // Move existing nodes, preserving their listeners and their original order.
    for (const node of [...details.childNodes]) {
      if (node !== summary) content.append(node);
    }
    details.append(content);
    details.classList.add('accordion-enhanced');
    summary.setAttribute('aria-controls', content.id);
    summary.setAttribute('aria-expanded', String(details.open));

    const state = {
      details, summary, content, wanted: details.open, animation: null,
      original: {
        height: details.style.height,
        overflow: details.style.overflow,
        boxSizing: details.style.boxSizing
      }
    };
    states.set(details, state);

    summary.addEventListener('click', event => {
      // A link embedded in a summary keeps its own action. Native Enter and Space
      // produce a click too, so no duplicate keyboard handler is needed.
      if (event.defaultPrevented || event.target.closest('a,button,input,select,textarea')) return;
      event.preventDefault();
      change(state, !state.wanted);
    });

    new MutationObserver(() => {
      if (details.open === state.wanted) return;
      if (state.animation && details.open) return; // Kept open during an animated close.

      const wanted = details.open;
      let start;
      if (!state.animation && !wanted) {
        // An outside script removed [open]. Restore it before the next paint to
        // measure the expanded height, then perform the requested animated close.
        details.open = true;
        start = details.getBoundingClientRect().height;
      }
      change(state, wanted, { start });
    }).observe(details, { attributes: true, attributeFilter: ['open'] });

    if ('ResizeObserver' in window) {
      const resize = new ResizeObserver(() => {
        if (state.animation) change(state, state.wanted, { resize: true });
      });
      resize.observe(summary);
      resize.observe(content);
    }
  }

  function revealHash(animate = true) {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    const ancestors = [];
    for (let node = target; node; node = node.parentElement) {
      if (node.tagName === 'DETAILS') ancestors.unshift(node);
    }
    for (const details of ancestors) {
      initialize(details);
      const state = states.get(details);
      if (state) change(state, true, { animate });
    }
  }

  document.querySelectorAll('details').forEach(initialize);
  revealHash(false);
  window.addEventListener('hashchange', () => revealHash());
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
    // Repeated clicks on the current hash do not fire hashchange. Opening here
    // also lets native anchor scrolling see the panel before moving to it.
    let id;
    try { id = decodeURIComponent(url.hash.slice(1)); } catch { return; }
    const target = document.getElementById(id);
    const details = target?.closest('details');
    if (details) {
      initialize(details);
      const state = states.get(details);
      if (state) change(state, true);
    }
  });

  const onMotionChange = () => {
    if (reducedMotion.matches) {
      for (const state of states.values()) {
        if (state.animation) settle(state);
      }
    }
  };
  if (reducedMotion.addEventListener) reducedMotion.addEventListener('change', onMotionChange);
  else reducedMotion.addListener(onMotionChange);
})();
