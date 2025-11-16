(function () {
  const onReady = () => {
    enhanceCodeBlocks();
    renderMermaid();
    enhanceToc();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
})();

function enhanceCodeBlocks() {
  const blocks = document.querySelectorAll('.highlight');
  if (!blocks.length) return;

  const canCopy = !!(navigator.clipboard && navigator.clipboard.writeText);

  blocks.forEach((block) => {
    if (block.dataset.enhanced === 'true') return;
    const pre = block.querySelector('pre');
    const code = pre ? pre.querySelector('code') : null;
    if (!pre || !code) return;

    const lang = (
      code.getAttribute('data-lang') ||
      (code.className.match(/language-([\w-]+)/) || [null, 'text'])[1]
    ).toUpperCase();

    const meta = document.createElement('div');
    meta.className = 'code-block-meta';
    const label = document.createElement('span');
    label.textContent = lang;
    meta.appendChild(label);

    if (canCopy) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'code-copy-btn';
      btn.setAttribute('aria-label', 'Copy code block');
      btn.innerHTML =
        '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"></rect><path d="M6 16H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v1"></path></svg>';
      btn.addEventListener('click', () => {
        navigator.clipboard
          .writeText(code.innerText)
          .then(() => setCopyButtonState(btn, 'copied'))
          .catch(() => setCopyButtonState(btn, 'error'));
      });
      meta.appendChild(btn);
    }

    block.insertBefore(meta, pre);
    block.dataset.enhanced = 'true';
  });
}

function setCopyButtonState(button, state) {
  button.classList.remove('copied', 'error');
  button.classList.add(state);
  setTimeout(() => button.classList.remove(state), 2000);
}

function renderMermaid() {
  const codes = document.querySelectorAll('code.language-mermaid');
  if (!codes.length) return;

  const diagrams = Array.from(codes).map((code) => {
    const container = document.createElement('div');
    container.className = 'mermaid';
    container.textContent = code.textContent;
    const highlightParent = code.closest('.highlight');
    if (highlightParent) {
      highlightParent.replaceWith(container);
    } else if (code.parentNode) {
      code.parentNode.replaceWith(container);
    }
    return { el: container, text: code.textContent };
  });

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  const run = () => {
    const theme = prefersDark.matches ? 'dark' : 'default';
    diagrams.forEach((diagram) => {
      diagram.el.textContent = diagram.text;
    });
    if (window.mermaid) {
      window.mermaid.initialize({ startOnLoad: false, theme });
      window.mermaid.run({ nodes: diagrams.map((diagram) => diagram.el) });
    }
  };

  if (window.mermaid) {
    run();
  } else {
    const interval = setInterval(() => {
      if (window.mermaid) {
        clearInterval(interval);
        run();
      }
    }, 100);
    setTimeout(() => clearInterval(interval), 5000);
  }

  prefersDark.addEventListener('change', () => {
    if (window.mermaid) run();
  });
}

function enhanceToc() {
  const tocNav = document.querySelector('.toc-container nav');
  if (!tocNav) return;

  const links = Array.from(tocNav.querySelectorAll('a[href^="#"]'));
  if (!links.length || !('IntersectionObserver' in window)) return;

  const targets = links
    .map((link) => {
      const id = decodeURIComponent(link.getAttribute('href') || '').replace('#', '');
      const section = document.getElementById(id);
      return section ? { link, section } : null;
    })
    .filter(Boolean);

  if (!targets.length) return;

  let activeLink = null;
  const setActive = (nextLink) => {
    if (activeLink === nextLink) return;
    if (activeLink) activeLink.classList.remove('active');
    if (nextLink) nextLink.classList.add('active');
    activeLink = nextLink;
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries
        .filter((item) => item.isIntersecting)
        .sort((a, b) => a.target.offsetTop - b.target.offsetTop)[0];
      if (!entry) return;
      const match = targets.find((target) => target.section === entry.target);
      if (match) setActive(match.link);
    },
    { rootMargin: '-55% 0px -35% 0px', threshold: [0, 0.5, 1] }
  );

  targets.forEach((target) => observer.observe(target.section));
  setActive(targets[0].link);

  links.forEach((link) => {
    link.addEventListener('click', () => setActive(link));
  });
}
