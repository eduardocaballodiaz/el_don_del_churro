/* Product photography: select the HTML image immediately; load each card independently. */
(() => {
  'use strict';

  const families = {
    fine: { label: 'CHURROS FINOS', type: 'Churros finos', files: ['plain', 'coffee', 'chocolate'], alts: ['Churros finos dorados sobre un plato de cerámica', 'Churros finos con café en taza verde oliva', 'Churros finos con chocolate cremoso'] },
    wheel: { label: 'CHURROS DE RUEDA', type: 'Churros de rueda', files: ['wheel', 'wheel-coffee', 'wheel-chocolate'], alts: ['Porciones curvas de churros de rueda, doradas y esponjosas', 'Churros de rueda con café en taza verde oliva', 'Churros de rueda acompañados de chocolate cremoso'] }
  };
  const TIMEOUT_MS = 10000;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const productButtons = [...document.querySelectorAll('.menu-card .product-image')];
  const familyButtons = [...document.querySelectorAll('[data-kind]')];
  const selection = document.querySelector('.type-selection');
  const productGrid = document.querySelector('.menu-grid');
  const picker = document.querySelector('.type-picker');

  // Resolve only after an actual successful load. Neither cached candidates nor
  // Image.decode support are prerequisites, and every request has a deadline.
  function loadPhoto(url) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.decoding = 'async';
      image.loading = 'eager';
      let finished = false;
      let timer;
      function finish(error) {
        if (finished) return;
        finished = true;
        clearTimeout(timer);
        image.onload = null;
        image.onerror = null;
        if (error) reject(error);
        else resolve(image);
      }
      image.onload = () => finish(image.naturalWidth > 0 ? null : new Error('image-load'));
      image.onerror = () => finish(new Error('image-load'));
      timer = setTimeout(() => finish(new Error('image-timeout')), TIMEOUT_MS);
      image.src = url;
      if (image.complete && image.naturalWidth > 0) queueMicrotask(() => finish(null));
    });
  }

  function retryUrl(url, retry) {
    if (!retry) return url;
    const result = new URL(url, document.baseURI);
    result.searchParams.set('photo_retry', `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
    return result.href;
  }

  if (selection && productGrid && picker && productButtons.length === 3 && familyButtons.length) {
    let activeKind = familyButtons.find(button => button.getAttribute('aria-pressed') === 'true')?.dataset.kind || 'fine';
    const message = selection.querySelector('span');
    const label = selection.querySelector('strong');
    const suffixes = ['', ' + café', ' + chocolate'];
    const prices = ['3,00 €', '4,50 €', '5,50 €'];
    const records = productButtons.map((button, index) => {
      const status = document.createElement('span');
      status.className = 'product-photo-status';
      status.setAttribute('role', 'status');
      status.hidden = true;
      button.append(status);
      const retry = document.createElement('button');
      retry.type = 'button';
      retry.className = 'product-photo-retry';
      retry.textContent = 'Reintentar foto';
      retry.hidden = true;
      button.insertAdjacentElement('afterend', retry);
      const images = new Map();
      for (const image of button.querySelectorAll('img[data-product-kind]')) {
        const kind = image.dataset.productKind;
        images.set(kind, {
          image,
          url: `assets/${families[kind].files[index]}-960.webp`,
          state: image.complete ? (image.naturalWidth > 0 ? 'loaded' : 'error') : 'loading',
          timer: null
        });
      }
      return { button, index, images, status, retry, visible: false };
    });

    function stopTimer(item) {
      clearTimeout(item.timer);
      item.timer = null;
    }

    function startTimer(record, item) {
      if (item.timer || !record.visible || item.state !== 'loading') return;
      item.timer = setTimeout(() => {
        item.timer = null;
        if (record.images.get(activeKind) !== item || !record.visible) return;
        item.state = item.image.complete && item.image.naturalWidth > 0 ? 'loaded' : 'timeout';
        renderStatus(record);
      }, TIMEOUT_MS);
    }

    function renderStatus(record) {
      const item = record.images.get(activeKind);
      if (!item) return;
      if (item.image.complete && item.image.naturalWidth > 0) item.state = 'loaded';
      else if (item.image.complete && item.image.naturalWidth === 0 && item.state === 'loading') item.state = 'error';
      const failed = item.state === 'error' || item.state === 'timeout';
      record.status.classList.toggle('is-error', failed);
      record.status.hidden = item.state === 'loaded';
      record.retry.hidden = !failed;
      record.retry.setAttribute('aria-label', `Reintentar foto: ${families[activeKind].type}${suffixes[record.index]}`);
      if (item.state === 'loaded') {
        stopTimer(item);
        record.button.removeAttribute('aria-busy');
      } else if (failed) {
        stopTimer(item);
        record.button.removeAttribute('aria-busy');
        record.status.textContent = item.state === 'timeout' ? 'Esta foto está tardando en cargar.' : 'No se ha podido cargar esta foto.';
      } else {
        record.status.textContent = 'Cargando foto…';
        record.button.setAttribute('aria-busy', 'true');
        startTimer(record, item);
      }
    }

    function selectKind(kind, explicit = true) {
      if (!families[kind]) return;
      activeKind = kind;
      const family = families[kind];
      productGrid.dataset.selectedKind = kind;
      productGrid.classList.remove('is-changing');
      productGrid.removeAttribute('aria-busy');
      familyButtons.forEach(button => {
        button.setAttribute('aria-pressed', String(button.dataset.kind === kind));
        button.removeAttribute('aria-busy');
        button.classList.remove('is-loading');
      });
      records.forEach(record => {
        for (const [imageKind, item] of record.images) {
          item.image.hidden = imageKind !== kind;
          if (imageKind !== kind) stopTimer(item);
        }
        const selected = record.images.get(kind);
        if (!selected) return;
        if (explicit || record.visible) {
          selected.image.loading = 'eager';
          selected.image.fetchPriority = 'auto';
        }
        record.button.dataset.photo = selected.url;
        record.button.dataset.description = `${family.type}${suffixes[record.index]} · ${prices[record.index]}`;
        renderStatus(record);
      });
      label.textContent = family.label;
      message.textContent = 'Elige una imagen para cambiar de tipo.';
    }

    records.forEach(record => {
      for (const [kind, item] of record.images) {
        item.image.addEventListener('load', () => {
          item.state = item.image.naturalWidth > 0 ? 'loaded' : 'error';
          stopTimer(item);
          if (kind === activeKind) renderStatus(record);
        });
        item.image.addEventListener('error', () => {
          item.state = 'error';
          stopTimer(item);
          if (kind === activeKind) renderStatus(record);
        });
      }
      record.retry.addEventListener('click', () => {
        const item = record.images.get(activeKind);
        if (!item) return;
        stopTimer(item);
        item.state = 'loading';
        item.url = retryUrl(`assets/${families[activeKind].files[record.index]}-960.webp`, true);
        item.image.removeAttribute('srcset');
        item.image.removeAttribute('sizes');
        item.image.loading = 'eager';
        item.image.fetchPriority = 'auto';
        item.image.src = item.url;
        record.button.dataset.photo = item.url;
        renderStatus(record);
      });
    });

    familyButtons.forEach(button => button.addEventListener('click', () => selectKind(button.dataset.kind)));
    selectKind(activeKind, false);

    // Fetch both families shortly before the selector approaches the screen.
    // Timers belong only to the selected image in an actually visible card.
    function warmPhotos() {
      records.forEach(record => record.images.forEach(item => {
        item.image.fetchPriority = 'low';
        item.image.loading = 'eager';
      }));
    }
    if ('IntersectionObserver' in window) {
      const warmObserver = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        warmPhotos();
        warmObserver.disconnect();
      }, { rootMargin: '700px 0px' });
      warmObserver.observe(picker);
      const visibilityObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          const record = records.find(item => item.button === entry.target);
          record.visible = entry.isIntersecting;
          if (!record.visible) record.images.forEach(stopTimer);
          else renderStatus(record);
        });
      }, { threshold: 0.01 });
      records.forEach(record => visibilityObserver.observe(record.button));
    } else {
      warmPhotos();
      records.forEach(record => {
        const box = record.button.getBoundingClientRect();
        record.visible = box.top < innerHeight && box.bottom > 0;
        renderStatus(record);
      });
    }
  }

  const dialog = document.querySelector('.photo-dialog');
  let photo = document.querySelector('#photo-image');
  if (!dialog || !photo) return;
  const stage = document.createElement('div');
  stage.className = 'gallery-image-stage';
  photo.replaceWith(stage);
  stage.append(photo);
  const status = document.createElement('div');
  status.className = 'gallery-status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  const statusText = document.createElement('p');
  const galleryRetry = document.createElement('button');
  galleryRetry.type = 'button';
  galleryRetry.className = 'button button-dark gallery-retry';
  galleryRetry.textContent = 'Reintentar imagen';
  galleryRetry.hidden = true;
  status.append(statusText, galleryRetry);
  stage.append(status);
  let photoTrigger;
  let snapshot;
  let galleryRequest = 0;

  async function showPhoto(nextSnapshot, retry = false) {
    const thisRequest = ++galleryRequest;
    snapshot = nextSnapshot;
    const url = retryUrl(snapshot.url, retry);
    photo.hidden = true;
    status.hidden = false;
    galleryRetry.hidden = true;
    statusText.textContent = 'Cargando imagen…';
    dialog.setAttribute('aria-busy', 'true');
    try {
      const image = await loadPhoto(url);
      if (thisRequest !== galleryRequest || !dialog.open) return;
      image.id = 'photo-image';
      image.alt = nextSnapshot.alt;
      image.width = image.naturalWidth;
      image.height = image.naturalHeight;
      photo.replaceWith(image);
      photo = image;
      status.hidden = true;
    } catch (error) {
      if (thisRequest !== galleryRequest || !dialog.open) return;
      statusText.textContent = error.message === 'image-timeout' ? 'La imagen está tardando demasiado en cargar. Puedes reintentar.' : 'No se ha podido cargar la imagen. Puedes reintentar.';
      galleryRetry.hidden = false;
    } finally {
      if (thisRequest === galleryRequest) dialog.removeAttribute('aria-busy');
    }
  }

  document.querySelectorAll('[data-photo]').forEach(button => button.addEventListener('click', () => {
    photoTrigger = button;
    const nextSnapshot = { url: button.dataset.photo, alt: (button.querySelector('img:not([hidden])') || button.querySelector('img')).alt };
    document.querySelector('#photo-title').textContent = button.dataset.title;
    document.querySelector('#photo-description').textContent = button.dataset.description;
    if (!dialog.open) dialog.showModal();
    document.body.classList.add('dialog-open');
    showPhoto(nextSnapshot);
  }));
  galleryRetry.addEventListener('click', () => {
    if (snapshot && dialog.open) showPhoto(snapshot, true);
  });
  document.querySelector('.dialog-close')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    galleryRequest += 1;
    dialog.removeAttribute('aria-busy');
    document.body.classList.remove('dialog-open');
    photoTrigger?.focus({ preventScroll: true });
  });
})();
