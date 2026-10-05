/* Pure static storefront. No credentials, payments, trackers, or server calls. */
(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const asText = (value, fallback = '') => typeof value === 'string' || typeof value === 'number' ? String(value) : fallback;
  const escapeHTML = (value) => asText(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const knownIcons = ['chatgpt', 'claude', 'gemini', 'grok'];
  const knownTags = ['creation', 'coding', 'research'];
  let activeFilter = 'all';
  let toastTimer;
  const toastElement = $('#toast');

  function normalizeConfig(input) {
    const source = input && typeof input === 'object' ? input : {};
    const brand = source.brand || {};
    const hero = source.hero || {};
    const contact = source.contact || {};
    const footer = source.footer || {};
    const usedIds = new Set();
    return {
      demoMode: source.demoMode !== false,
      brand: {
        name: asText(brand.name, 'AI 优选'), english: asText(brand.english, 'AI SELECT'),
        tagline: asText(brand.tagline, '你的 AI 工具补给站'),
        pageTitle: asText(brand.pageTitle, 'AI 服务展示'),
        description: asText(brand.description, 'AI 服务与套餐展示')
      },
      theme: { accent: /^#[0-9a-f]{6}$/i.test(source.theme?.accent || '') ? source.theme.accent : '#c6f36b' },
      notice: asText(source.notice),
      hero: {
        eyebrow: asText(hero.eyebrow, 'AI TOOLS. ONE PLACE.'),
        titleLine1: asText(hero.titleLine1, '好用的 AI，'), titleLine2: asText(hero.titleLine2, '从这里开始。'),
        description: asText(hero.description)
      },
      storeUrl: asText(source.storeUrl),
      contact: { wechat: asText(contact.wechat).trim(), email: asText(contact.email).trim(), note: asText(contact.note) },
      products: (Array.isArray(source.products) ? source.products : []).slice(0, 40).map((p, index) => {
        p = p && typeof p === 'object' ? p : {};
        let id = /^[a-z0-9_-]+$/i.test(asText(p.id)) ? asText(p.id) : `product-${index}`;
        if (usedIds.has(id)) id = `${id}-${index}`;
        usedIds.add(id);
        return {
          id, name: asText(p.name, 'AI 服务'), provider: asText(p.provider),
          icon: knownIcons.includes(p.icon) ? p.icon : 'generic',
          badge: asText(p.badge), description: asText(p.description),
          price: asText(p.price).trim(), currency: asText(p.currency, '¥'), unit: asText(p.unit, '起 / 月'),
          tags: Array.isArray(p.tags) ? p.tags.filter(tag => knownTags.includes(tag)) : [],
          features: Array.isArray(p.features) ? p.features.map(value => asText(value)).slice(0, 8) : [],
          purchaseUrl: asText(p.purchaseUrl), detail: asText(p.detail)
        };
      }),
      faq: (Array.isArray(source.faq) ? source.faq : []).slice(0, 30).map(item => ({ question: asText(item?.question), answer: asText(item?.answer) })),
      footer: {
        description: asText(footer.description), disclaimer: asText(footer.disclaimer),
        copyright: asText(footer.copyright, '2026 AI 优选'),
        filingText: asText(footer.filingText), filingUrl: asText(footer.filingUrl)
      }
    };
  }

  let config = normalizeConfig(window.SITE_CONFIG);

  function safeExternalUrl(value) {
    if (!value || !value.trim()) return '';
    try {
      const url = new URL(value.trim());
      // Absolute HTTPS addresses only; never execute javascript: / data: / file:.
      if (url.protocol !== 'https:' || !url.hostname || url.username || url.password) return '';
      return url.href;
    } catch { return ''; }
  }

  function productUrl(product) {
    // An explicitly supplied but invalid product URL must NOT silently redirect elsewhere.
    return product?.purchaseUrl.trim() ? safeExternalUrl(product.purchaseUrl) : safeExternalUrl(config.storeUrl);
  }

  function iconMarkup(name) {
    let paths = '';
    if (name === 'chatgpt') {
      paths = '<g fill="none" stroke="currentColor" stroke-width="1.65">' + Array.from({ length: 6 }, (_, i) => `<ellipse cx="16" cy="10.5" rx="5.2" ry="7.4" transform="rotate(${i * 60} 16 16)"/>`).join('') + '</g>';
    } else if (name === 'claude') {
      paths = '<g fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round">' + Array.from({ length: 12 }, (_, i) => `<path d="M16 3.5V10" transform="rotate(${i * 30} 16 16)"/>`).join('') + '</g><circle cx="16" cy="16" r="4.5" fill="currentColor"/>';
    } else if (name === 'gemini') {
      paths = '<path class="gemini-shape" fill="currentColor" d="M16 1.8C18.8 11.5 20.5 13.2 30.2 16 20.5 18.8 18.8 20.5 16 30.2 13.2 20.5 11.5 18.8 1.8 16 11.5 13.2 13.2 11.5 16 1.8Z"/>';
    } else if (name === 'grok') {
      paths = '<path d="m24 5-15 21M11 6H6l14 20h6L11 6Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>';
    } else {
      paths = '<path d="m16 3 4 9 9 4-9 4-4 9-4-9-9-4 9-4Z" fill="none" stroke="currentColor" stroke-width="2"/>';
    }
    return `<svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">${paths}</svg>`;
  }

  function renderIcons() {
    $$('[data-icon]').forEach(element => { element.innerHTML = iconMarkup(element.dataset.icon); });
  }

  function setText(selector, value) {
    const element = $(selector);
    if (element) element.textContent = value;
  }

  function renderGrid() {
    const products = config.products.filter(product => activeFilter === 'all' || product.tags.includes(activeFilter));
    $('#product-grid').innerHTML = products.length ? products.map(product => {
      const href = productUrl(product);
      const price = product.price
        ? `<span class="currency">${escapeHTML(product.currency)}</span><span class="number">${escapeHTML(product.price)}</span><span class="unit">${escapeHTML(product.unit)}</span>`
        : '<span class="price-unset">咨询客服</span>';
      return `<article class="product-card" data-product-id="${escapeHTML(product.id)}">
        <div class="card-top"><span class="brand-icon icon-${escapeHTML(product.icon)}">${iconMarkup(product.icon)}</span>${product.badge ? `<span class="card-badge">${escapeHTML(product.badge)}</span>` : ''}</div>
        <p class="card-provider">${escapeHTML(product.provider)}</p><h3>${escapeHTML(product.name)}</h3>
        <p class="card-description">${escapeHTML(product.description)}</p>
        <div class="card-price">${price}</div><p class="price-caption">${config.demoMode ? '示例价格 · 上线前请核实' : '实际成交价格以商城为准'}</p>
        <div class="card-rule"></div><ul class="feature-list">${product.features.map(feature => `<li>${escapeHTML(feature)}</li>`).join('')}</ul>
        <a href="${escapeHTML(href || '#plans')}" ${href ? 'target="_blank" rel="noopener noreferrer"' : ''} data-buy="${escapeHTML(product.id)}" class="button card-buy" aria-label="购买 ${escapeHTML(product.name)}${href ? '（在新标签页打开外部商城）' : '（购买入口待配置）'}">立即购买 <span aria-hidden="true">↗</span></a>
        <button class="card-detail" data-detail="${escapeHTML(product.id)}" aria-label="查看 ${escapeHTML(product.name)} 套餐详情">了解套餐详情 →</button>
      </article>`;
    }).join('') : '<div class="empty-state">当前分类还没有配置服务，请查看其他分类。</div>';
    setText('#result-count', `${products.length} 项服务`);
    $$('[data-filter]').forEach(button => {
      const active = button.dataset.filter === activeFilter;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }

  function render() {
    document.title = config.brand.pageTitle;
    $('meta[name="description"]').content = config.brand.description;
    $('meta[name="robots"]').content = config.demoMode ? 'noindex, nofollow' : 'index, follow';
    document.documentElement.style.setProperty('--accent', config.theme.accent);
    $$('[data-brand]').forEach(element => { element.textContent = config.brand.name; });
    $$('[data-tagline]').forEach(element => { element.textContent = config.brand.tagline; });
    $('#notice-bar').hidden = !config.notice.trim();
    setText('#notice-text', config.notice);
    setText('#hero-eyebrow', config.hero.eyebrow);
    setText('#hero-line1', config.hero.titleLine1);
    setText('#hero-line2', config.hero.titleLine2);
    setText('#hero-description', config.hero.description);
    setText('#footer-description', config.footer.description);
    setText('#footer-disclaimer', config.footer.disclaimer);
    setText('#copyright', `© ${config.footer.copyright}`);
    setText('#price-disclaimer', config.demoMode ? '当前价格为排版示例。实际价格、权益与交易条件以外部商城为准；本站不收取款项。' : '实际价格、权益与交易条件以外部商城为准；本站不收取款项。');
    const filing = $('#filing-link');
    const filingUrl = safeExternalUrl(config.footer.filingUrl);
    filing.hidden = !config.footer.filingText.trim();
    filing.textContent = config.footer.filingText;
    if (filingUrl) { filing.href = filingUrl; filing.target = '_blank'; filing.rel = 'noopener noreferrer'; }
    else { filing.removeAttribute('href'); filing.removeAttribute('target'); }
    setText('#contact-note', config.contact.note);
    setText('#wechat-value', config.contact.wechat || '待设置客服微信');
    $('#copy-wechat').disabled = !config.contact.wechat;
    setText('#contact-footnote', config.contact.wechat ? '联系时请说明商品名称和需求，不要发送密码或验证码。' : '当前为展示样稿，请在本地编辑器中填入你自己的客服微信。');
    const email = $('#email-link');
    const validEmail = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(config.contact.email);
    email.hidden = !validEmail;
    if (validEmail) { email.href = `mailto:${encodeURIComponent(config.contact.email).replace(/%40/g, '@')}`; email.textContent = `或发送邮件至 ${config.contact.email}`; }
    else { email.removeAttribute('href'); email.textContent = ''; }
    $('#faq-list').innerHTML = config.faq.map((faq, index) => `<details${index === 0 ? ' open' : ''}><summary>${escapeHTML(faq.question)}</summary><p>${escapeHTML(faq.answer)}</p></details>`).join('');
    renderGrid();
    renderIcons();
  }

  function closeDialogs() { $$('dialog[open]').forEach(dialog => dialog.close()); }
  function openDialog(id) {
    closeDialogs();
    const dialog = $(`#${id}`);
    dialog.showModal();
    document.body.style.overflow = 'hidden';
  }
  function openProduct(id) {
    const product = config.products.find(item => item.id === id);
    if (!product) return;
    setText('#product-title', product.name);
    setText('#detail-provider', product.provider);
    setText('#detail-description', product.description);
    setText('#detail-copy', product.detail);
    $('#detail-icon').className = `brand-icon icon-${product.icon}`;
    $('#detail-icon').innerHTML = iconMarkup(product.icon);
    $('#detail-price').innerHTML = product.price ? `${escapeHTML(product.currency)} ${escapeHTML(product.price)} <small>${escapeHTML(product.unit)}${config.demoMode ? ' · 示例价' : ''}</small>` : '咨询客服';
    const link = $('#detail-buy');
    const url = productUrl(product);
    link.dataset.buy = product.id;
    link.href = url || '#plans';
    if (url) { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
    else { link.removeAttribute('target'); link.removeAttribute('rel'); }
    openDialog('product-dialog');
  }

  function openLegal(kind) {
    const title = kind === 'privacy' ? '隐私说明' : '服务说明';
    const paragraphs = kind === 'privacy' ? [
      '本展示页面未接入统计、广告追踪、账号登录、支付表单或订单数据库。页面代码不会主动向本站服务器上传你输入的个人信息。',
      '网站托管商可能按其自身政策处理访问日志等信息。你点击购买、发送邮件或添加客服后，相关数据处理由对应平台或服务商负责，请另行查阅其政策。',
      '本地编辑器仅用于在你自己的设备中编辑和导出公开网站配置，不是线上管理后台，也不会将草稿上传到服务器。',
      '本说明描述的是当前源码实现。运营方新增统计、表单或其他功能后，应更新实际使用的数据处理说明。'
    ] : [
      '本站仅提供 AI 服务信息展示及外部购买入口，不处理付款、订单、交付或退款。相关流程由你实际下单的平台及商品服务商处理。',
      config.demoMode ? '当前页面仍保留示例价格，展示内容不构成正式报价。购买按钮会打开已配置的外部商城，实际商品、价格与交易规则请以商城为准。' : '展示信息仅供了解服务，实际价格、可用权益、适用条件和售后政策以外部商城对应商品说明为准。',
      config.footer.disclaimer,
      '购买前请核对商品名称、价格、周期、地区与账号条件、交付方式以及售后规则。不要向任何人发送账号密码或验证码。'
    ];
    setText('#legal-title', title);
    $('#legal-copy').innerHTML = paragraphs.filter(Boolean).map(text => `<p>${escapeHTML(text)}</p>`).join('');
    openDialog('legal-dialog');
  }

  function showToast(message) {
    clearTimeout(toastTimer);
    const parent = $('dialog[open]') || document.body;
    parent.appendChild(toastElement);
    toastElement.textContent = message;
    toastElement.classList.add('show');
    toastTimer = setTimeout(() => toastElement.classList.remove('show'), 3000);
  }

  async function copyWechat() {
    if (!config.contact.wechat) return;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(config.contact.wechat);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = config.contact.wechat;
        textarea.setAttribute('readonly', '');
        textarea.style.cssText = 'position:fixed;left:-9999px;top:0;';
        ($('#contact-dialog') || document.body).appendChild(textarea);
        textarea.select();
        const copied = document.execCommand('copy');
        textarea.remove();
        if (!copied) throw new Error('Clipboard unavailable');
      }
      showToast('微信号已复制，请打开微信添加好友');
    } catch { showToast('自动复制未成功，请手动选中并复制上方微信号'); }
  }

  function setMobileMenu(open) {
    $('#mobile-nav').hidden = !open;
    $('#menu-toggle').setAttribute('aria-expanded', String(open));
    $('#menu-toggle').setAttribute('aria-label', open ? '关闭导航菜单' : '打开导航菜单');
  }

  document.addEventListener('click', event => {
    const target = event.target.closest('button, a');
    if (!target) return;
    if (target.hasAttribute('data-contact')) { event.preventDefault(); openDialog('contact-dialog'); }
    else if (target.hasAttribute('data-close')) { target.closest('dialog')?.close(); }
    else if (target.hasAttribute('data-detail')) { openProduct(target.dataset.detail); }
    else if (target.hasAttribute('data-buy')) {
      const product = config.products.find(item => item.id === target.dataset.buy);
      if (!productUrl(product)) { event.preventDefault(); openDialog('setup-dialog'); }
    } else if (target.hasAttribute('data-filter')) { activeFilter = target.dataset.filter; renderGrid(); }
    else if (target.hasAttribute('data-legal')) { openLegal(target.dataset.legal); }
    else if (target.id === 'menu-toggle') { setMobileMenu(target.getAttribute('aria-expanded') !== 'true'); }
    if (target.closest('#mobile-nav')) setMobileMenu(false);
  });
  $('#copy-wechat').addEventListener('click', copyWechat);
  document.addEventListener('keydown', event => { if (event.key === 'Escape') setMobileMenu(false); });
  window.addEventListener('resize', () => { if (window.innerWidth > 700) setMobileMenu(false); });
  $$('dialog').forEach(dialog => {
    dialog.addEventListener('close', () => { if (!$('dialog[open]')) document.body.style.overflow = ''; });
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
  });

  // Live preview messages are accepted only from the opening editor, in explicit preview mode.
  const isPreview = new URLSearchParams(window.location.search).get('preview') === '1';
  const previewPeer = window.parent !== window ? window.parent : window.opener;
  if (isPreview && previewPeer) {
    window.addEventListener('message', event => {
      if (event.source !== previewPeer) return;
      const sameOrigin = event.origin === window.location.origin;
      const localFile = window.location.protocol === 'file:' && event.origin === 'null';
      if (!sameOrigin && !localFile) return;
      if (event.data?.type !== 'AI_STORE_PREVIEW' || !event.data.config) return;
      config = normalizeConfig(event.data.config);
      render();
    });
  }
  render();
  if (isPreview && previewPeer) previewPeer.postMessage({ type: 'AI_STORE_READY' }, window.location.origin === 'null' ? '*' : window.location.origin);
})();
