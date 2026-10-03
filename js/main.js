/* ==========================================================================
   Digital Galaxy — interações da landing page
   ========================================================================== */

/* Prova social
   --------------------------------------------------------------------------
   Mostra a faixa de prova (abaixo do hero), a seção "Resultados" e os links
   "Resultados" do menu e do rodapé. Deixe false até os dados reais estarem
   preenchidos no index.html.
*/
const SHOW_PROOF = false;

/* Configuração de contato
   --------------------------------------------------------------------------
   PLACEHOLDER: preencha para ativar os botões de WhatsApp (hero, CTA final,
   botão flutuante no celular e rodapé) e o e-mail no rodapé.
   Enquanto estiverem vazios, esses links ficam ocultos na página.
   whatsapp: só números, com DDI e DDD. Ex.: "5511912345678"
*/
const CONFIG = {
  whatsapp: "5551989970010",
  whatsappMessage: "Olá! Vim pelo site e quero entender como a Digital Galaxy pode ajudar meu negócio.",
  email: ""
};

document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", () => {
  setupProof();
  setupPlaceholders();
  setupSmoothScroll();
  setupContactLinks();
  setupTracking();
  setupWhatsAppFloat();
  setupHeader();
  setupLogoSpin();
  setupMobileMenu();
  setupReveal();
  setupStarfields();
  setupGalaxy();
  setupHeroFold();
  setupServiceFlip();
  setupYear();
});

/* Rolagem suave ------------------------------------------------------
   Lenis (js/vendor/lenis.min.js): inércia na roda do mouse e nos links âncora.
   Desligado para quem prefere menos movimento.
*/
function setupSmoothScroll() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let lenis = null;
  if (window.Lenis && !reduceMotion) {
    const headerHeight = () => document.querySelector(".header")?.offsetHeight || 0;
    lenis = new window.Lenis({
      autoRaf: true,
      lerp: 0.075,              // menor = mais suave e com mais "deslize"
      wheelMultiplier: 0.9,
      anchors: { offset: -headerHeight() }
    });
    window.lenis = lenis;
  }

  // Logo: volta ao início da página. O #topo é o header fixo, que está sempre
  // no topo da tela, então o link sozinho não rolaria nada.
  document.querySelectorAll('a[href="#topo"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (lenis) lenis.scrollTo(0);
      else window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  });
}

/* Contato: WhatsApp e e-mail ------------------------------------------- */
function setupContactLinks() {
  if (CONFIG.whatsapp) {
    const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(CONFIG.whatsappMessage)}`;
    document.querySelectorAll(".js-whatsapp").forEach((link) => {
      link.href = url;
      link.hidden = false;
    });
    document.querySelectorAll(".js-whatsapp-item").forEach((item) => { item.hidden = false; });
    document.querySelectorAll(".js-whatsapp-label").forEach((link) => { link.textContent = `WhatsApp ${formatPhone(CONFIG.whatsapp)}`; });
  }

  if (CONFIG.email) {
    document.querySelectorAll(".js-email").forEach((link) => {
      link.href = `mailto:${CONFIG.email}`;
      link.textContent = CONFIG.email;
    });
    document.querySelectorAll(".js-email-item").forEach((item) => { item.hidden = false; });
  }
}

// "5511912345678" → "(11) 91234-5678"
function formatPhone(digits) {
  const m = digits.replace(/\D/g, "").replace(/^55(?=\d{10,11}$)/, "").match(/^(\d{2})(\d{4,5})(\d{4})$/);
  return m ? `(${m[1]}) ${m[2]}-${m[3]}` : digits;
}

/* Prova social (SHOW_PROOF) -------------------------------------------- */
function setupProof() {
  if (!SHOW_PROOF) return;
  document.querySelectorAll("[data-proof]").forEach((el) => { el.hidden = false; });
}

/* Campos a preencher ----------------------------------------------------
   Elementos com data-fill começam ocultos no HTML e só aparecem quando o
   texto não tem mais [colchetes] (ex.: preços, perguntas do FAQ, CNPJ).
*/
function setupPlaceholders() {
  document.querySelectorAll("[data-fill]").forEach((el) => {
    const text = el.textContent.trim();
    el.hidden = !text || /\[[^\]]*\]/.test(text);
  });
}

/* Rastreamento de cliques ----------------------------------------------
   Links com data-track enviam o evento para o GA4 (gtag ou dataLayer) e
   para o Meta Pixel, se estiverem instalados. Sem eles, não faz nada.
   cta_quiz leva a seção de origem em data-origin.
*/
function setupTracking() {
  document.addEventListener("click", (event) => {
    const link = event.target.closest("[data-track]");
    if (!link) return;
    const name = link.dataset.track;
    const params = { origem: link.dataset.origin || "", link_url: link.href || "" };
    if (typeof window.gtag === "function") window.gtag("event", name, params);
    else if (Array.isArray(window.dataLayer)) window.dataLayer.push({ event: name, ...params });
    if (typeof window.fbq === "function") window.fbq("trackCustom", name, params);
  });
}

/* WhatsApp flutuante (só celular) --------------------------------------
   Some enquanto o hero, o CTA final ou o rodapé estão na tela (essas áreas
   já têm o próprio WhatsApp) e quando um botão ou item clicável passa pela
   faixa de baixo da tela, onde o botão fica, para nunca cobrir nada.
*/
function setupWhatsAppFloat() {
  const button = document.querySelector(".wa-float");
  if (!button || button.hidden || !("IntersectionObserver" in window)) return;
  const hero = document.querySelector(".hero");
  const zones = new Set([hero]);
  const under = new Set();
  const update = () => button.classList.toggle("is-visible", zones.size === 0 && under.size === 0);
  const track = (set) => (entries) => {
    entries.forEach((entry) => set[entry.isIntersecting ? "add" : "delete"](entry.target));
    update();
  };

  // O hero é sticky: continua "na tela" por baixo das seções, então vale o aviso da dobra
  hero.addEventListener("hero:covered", (event) => { zones[event.detail ? "delete" : "add"](hero); update(); });
  const zoneObserver = new IntersectionObserver(track(zones));
  [".cta", ".footer"].forEach((s) => { const zone = document.querySelector(s); if (zone) zoneObserver.observe(zone); });

  // Faixa de baixo da tela (altura do botão + margem)
  const targets = document.querySelectorAll("main .btn, .service__link, .project__head, .faq__question");
  let stripObserver = null;
  const observeStrip = () => {
    if (stripObserver) stripObserver.disconnect();
    under.clear();
    const top = Math.max(window.innerHeight - 96, 0);
    stripObserver = new IntersectionObserver(track(under), { rootMargin: `-${top}px 0px 0px 0px` });
    targets.forEach((el) => stripObserver.observe(el));
  };
  observeStrip();
  window.addEventListener("resize", observeStrip);
}

/* Header com fundo ao rolar ------------------------------------------- */
function setupHeader() {
  const header = document.querySelector(".header");
  const update = () => header.classList.toggle("is-scrolled", window.scrollY > 12);
  update();
  window.addEventListener("scroll", update, { passive: true });
}

/* Estrela da logo -------------------------------------------------------
   Gira com inércia: acelera aos poucos enquanto o mouse está sobre a logo e
   desacelera suavemente ao sair, parando onde estiver (sem voltar para trás).
*/
function setupLogoSpin() {
  const brand = document.querySelector(".brand--mark");
  const star = brand && brand.querySelector(".brand__star");
  if (!star || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const MAX_SPEED = 200;      // graus por segundo
  const EASE = 3.2;           // maior = acelera e freia mais rápido
  let angle = 0, speed = 0, target = 0, last = 0, running = false;

  const tick = (now) => {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    speed += (target - speed) * (1 - Math.exp(-EASE * dt));
    angle = (angle + speed * dt) % 360;
    star.style.transform = `rotate(${angle.toFixed(2)}deg)`;
    if (target === 0 && Math.abs(speed) < 0.5) { running = false; return; }
    requestAnimationFrame(tick);
  };
  const setTarget = (value) => {
    target = value;
    if (!running) { running = true; last = performance.now(); requestAnimationFrame(tick); }
  };

  brand.addEventListener("pointerenter", () => setTarget(MAX_SPEED));
  brand.addEventListener("pointerleave", () => setTarget(0));
  brand.addEventListener("focus", () => setTarget(MAX_SPEED));
  brand.addEventListener("blur", () => setTarget(0));
}

/* Menu lateral ---------------------------------------------------------
   O hambúrguer abre um painel que desliza da direita; o fundo desfoca a
   página e a rolagem fica travada enquanto o menu está aberto.
*/
function setupMobileMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.getElementById("menu");
  const header = document.querySelector(".header");
  const overlay = document.querySelector(".menu-overlay");
  const isOpen = () => nav.classList.contains("is-open");

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    nav.classList.toggle("is-open", open);
    nav.inert = !open;
    overlay.classList.toggle("is-open", open);
    header.classList.toggle("menu-open", open);
    document.dispatchEvent(new CustomEvent("menu:toggle", { detail: open }));
    if (window.lenis) window.lenis[open ? "stop" : "start"]();
    else document.documentElement.style.overflow = open ? "hidden" : "";
  };

  toggle.addEventListener("click", () => setOpen(!isOpen()));
  overlay.addEventListener("click", () => setOpen(false));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen()) {
      setOpen(false);
      toggle.focus();
    }
  });

  // Links do menu: fecha e rola até a seção
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", (event) => {
      setOpen(false);
      const hash = link.getAttribute("href");
      if (!hash || !hash.startsWith("#")) return;
      event.preventDefault();
      const target = hash === "#topo" ? null : document.querySelector(hash);
      const top = target ? target.getBoundingClientRect().top + window.scrollY - header.offsetHeight : 0;
      if (window.lenis) window.lenis.scrollTo(top, { force: true });
      else window.scrollTo({ top, behavior: "smooth" });
    });
  });
}

/* Reveal ao rolar ----------------------------------------------------- */
function setupReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });

  // Pequeno atraso em cascata para itens lado a lado
  items.forEach((item) => {
    const siblings = Array.from(item.parentElement.children).filter((el) => el.classList.contains("reveal"));
    item.style.transitionDelay = `${Math.min(siblings.indexOf(item), 5) * 60}ms`;
    observer.observe(item);
  });
}

/* Céu estrelado minimalista ------------------------------------------- */
function setupStarfields() {
  const count = window.matchMedia("(max-width: 768px)").matches ? 18 : 36;
  const rand = (min, max) => min + Math.random() * (max - min);

  document.querySelectorAll(".starfield").forEach((sky) => {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < count; i += 1) {
      const star = document.createElement("span");
      const size = rand(1, 2.4);
      star.className = "star";
      star.style.left = `${rand(0, 100)}%`;
      star.style.top = `${rand(0, 100)}%`;
      star.style.width = star.style.height = `${size}px`;
      star.style.setProperty("--dur", `${rand(3, 7).toFixed(2)}s`);
      star.style.setProperty("--delay", `${(-rand(0, 7)).toFixed(2)}s`);
      star.style.setProperty("--max", rand(0.3, 0.85).toFixed(2));
      fragment.appendChild(star);
    }
    sky.appendChild(fragment);
  });
}

/* Galáxia espiral do hero (canvas) -------------------------------------
   Braços espirais logarítmicos feitos de estrelas e nuvens de poeira, girando
   devagar em torno de um centro escuro (onde fica o texto). Só tons de roxo.
   Os pontos são sprites suaves pré-renderizados, para um movimento fluido.
*/
function setupGalaxy() {
  const hero = document.querySelector(".hero");
  const anchor = hero && hero.querySelector(".blackhole");
  const canvas = hero && hero.querySelector(".blackhole-canvas");
  if (!anchor || !canvas || !canvas.getContext) return;

  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const TAU = Math.PI * 2;
  const ARMS = 2;
  const PITCH = 0.22;          // abertura da espiral (tan do ângulo de passo)
  const SPIN = 0.045;          // rad/s: uma volta a cada ~2 minutos e 20s
  const rand = (min, max) => min + Math.random() * (max - min);
  const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;

  // Sprites: um brilho radial por tom de roxo
  const sprite = (size, color, core) => {
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const g = c.getContext("2d");
    const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, core);
    grad.addColorStop(0.25, color);
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, size, size);
    return c;
  };
  const starSprites = [
    sprite(32, "rgba(183, 148, 255, 0.55)", "rgba(245, 238, 255, 1)"),
    sprite(32, "rgba(150, 100, 255, 0.5)", "rgba(220, 200, 255, 1)"),
    sprite(32, "rgba(120, 60, 230, 0.5)", "rgba(200, 170, 255, 1)")
  ];
  const cloudSprites = [
    sprite(128, "rgba(90, 26, 199, 0.35)", "rgba(120, 60, 230, 0.5)"),
    sprite(128, "rgba(59, 0, 142, 0.4)", "rgba(90, 26, 199, 0.5)"),
    sprite(128, "rgba(140, 90, 240, 0.25)", "rgba(183, 148, 255, 0.35)")
  ];

  let width = 0, height = 0, cx = 0, cy = 0, R = 0;
  let stars = [], clouds = [], field = [];
  let halo = null, bulge = null, core = null;
  let time = 0, start = 0, running = false, frame = 0;

  // Posição base ao longo de um braço (r em frações de R)
  const armPoint = (spread) => {
    const u = Math.random();
    const r = 1.05 + 1.9 * Math.pow(u, 1.25);
    const arm = Math.floor(Math.random() * ARMS);
    const a = (arm / ARMS) * TAU + Math.log(r) / PITCH + gauss() * spread * (0.6 + r * 0.25);
    return { r: r * (1 + gauss() * 0.05), a };
  };

  const build = () => {
    const starCount = Math.round(Math.min(Math.max(R * 4.5, 900), 3000));
    const cloudCount = Math.round(Math.min(Math.max(R * 0.6, 120), 420));
    stars = Array.from({ length: starCount }, () => {
      // 75% nos braços, 25% espalhadas pelo disco
      const p = Math.random() < 0.75 ? armPoint(0.16) : { r: 1.05 + Math.pow(Math.random(), 0.9) * 1.9, a: rand(0, TAU) };
      return { ...p, img: starSprites[Math.floor(Math.random() * 3)], size: rand(2, 6), alpha: rand(0.35, 1), phase: rand(0, TAU), tw: rand(0.3, 1.1), ...blinkProps(Math.random() < 0.35 ? 0.6 : 0) };
    });
    clouds = Array.from({ length: cloudCount }, () => {
      const p = armPoint(0.24);
      return { ...p, img: cloudSprites[Math.floor(Math.random() * 3)], size: rand(0.18, 0.42), alpha: rand(0.4, 0.85), phase: rand(0, TAU) };
    });
    // Estrelas de fundo: espalhadas pelo hero inteiro, em camadas de profundidade
    field = Array.from({ length: Math.round(Math.min(Math.max(R * 0.5, 120), 260)) }, () => ({
      r: FIELD_IN + Math.sqrt(Math.random()) * FIELD_SPAN,
      a: rand(0, TAU),
      depth: Math.random(),
      img: starSprites[Math.floor(Math.random() * 3)],
      alpha: rand(0.4, 1),
      phase: rand(0, TAU),
      tw: rand(0.4, 1.4),
      ...blinkProps(0.9)
    }));
  };

  const measure = () => {
    const h = hero.getBoundingClientRect();
    const a = anchor.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const changed = Math.abs(a.width / 2 - R) > 1;
    width = h.width; height = h.height;
    cx = a.left - h.left + a.width / 2;
    cy = a.top - h.top + a.height / 2;
    R = a.width / 2;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (changed || !stars.length) build();

    halo = ctx.createRadialGradient(cx, cy, R * 0.8, cx, cy, R * 3);
    halo.addColorStop(0, "rgba(90, 26, 199, 0.5)");
    halo.addColorStop(0.3, "rgba(59, 0, 142, 0.22)");
    halo.addColorStop(1, "rgba(59, 0, 142, 0)");

    // Brilho do bojo logo em volta do centro
    bulge = ctx.createRadialGradient(cx, cy, R * 0.95, cx, cy, R * 1.9);
    bulge.addColorStop(0, "rgba(160, 120, 255, 0)");
    bulge.addColorStop(0.12, "rgba(150, 100, 255, 0.3)");
    bulge.addColorStop(0.4, "rgba(90, 26, 199, 0.14)");
    bulge.addColorStop(1, "rgba(59, 0, 142, 0)");

    // Centro escuro com borda suave (sem anel duro)
    core = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.12);
    core.addColorStop(0, "rgba(0, 0, 0, 1)");
    core.addColorStop(0.72, "rgba(0, 0, 0, 1)");
    core.addColorStop(0.86, "rgba(2, 0, 8, 0.92)");
    core.addColorStop(1, "rgba(0, 0, 0, 0)");
  };

  // Ângulo atual: rotação lenta + leve cisalhamento periódico (as camadas
  // internas adiantam e atrasam), que dá fluidez sem desfazer os braços
  // Piscada sutil: respiração leve + um pico breve e suave de vez em quando
  const blink = (p, t) => {
    const flash = Math.pow(Math.max(0, Math.sin(t * p.blinkRate + p.blinkPhase)), 40);
    return { alpha: 0.88 + 0.12 * Math.sin(t * p.tw + p.phase) + flash * p.blinkPower, scale: 1 + flash * 0.35 };
  };
  const blinkProps = (power) => ({
    blinkRate: rand(0.3, 0.9),        // um pico a cada ~7 a 21 s
    blinkPhase: rand(0, TAU),
    blinkPower: rand(0.4, 1) * power
  });

  const FIELD_IN = 1, FIELD_SPAN = 2.6;   // faixa das estrelas de fundo (em R)

  // Estrelas de fundo: orbitam mais devagar que a galáxia (parallax pela
  // profundidade) e são puxadas para o centro, reaparecendo na borda de fora
  const drawField = (t) => {
    for (const p of field) {
      const pull = 0.012 * (0.4 + p.depth) * t;
      const r = FIELD_IN + ((((p.r - FIELD_IN - pull) % FIELD_SPAN) + FIELD_SPAN) % FIELD_SPAN);
      const a = p.a + SPIN * (0.25 + 0.5 * p.depth) * t + 0.35 / r;
      const d = R * r;
      const edge = Math.min((r - FIELD_IN) / 0.35, (FIELD_IN + FIELD_SPAN - r) / 0.35, 1);
      const b = blink(p, t);
      const s = (1.6 + p.depth * 3.2) * b.scale;
      ctx.globalAlpha = Math.min(p.alpha * edge * (0.35 + 0.65 * p.depth) * b.alpha, 1);
      ctx.drawImage(p.img, cx + Math.cos(a) * d - s / 2, cy + Math.sin(a) * d - s / 2, s, s);
    }
  };

  const angle = (p, t) => p.a + SPIN * t + 0.07 * Math.sin(t * 0.06 - p.r * 1.4);

  const draw = (t) => {
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, width, height);

    ctx.globalAlpha = 0.9 + 0.1 * Math.sin(t * 0.25);
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, width, height);

    ctx.globalCompositeOperation = "lighter";
    drawField(t);

    ctx.globalAlpha = 0.85 + 0.15 * Math.sin(t * 0.18);
    ctx.fillStyle = bulge;
    ctx.fillRect(cx - R * 2, cy - R * 2, R * 4, R * 4);

    // Nuvens de poeira e gás
    for (const c of clouds) {
      const a = angle(c, t);
      const d = R * c.r;
      const s = R * c.size * (1.15 - c.r * 0.12);
      const fade = Math.min((3 - c.r) / 0.9, 1);
      ctx.globalAlpha = c.alpha * fade * (0.85 + 0.15 * Math.sin(t * 0.2 + c.phase));
      ctx.drawImage(c.img, cx + Math.cos(a) * d - s / 2, cy + Math.sin(a) * d - s / 2, s, s);
    }

    // Estrelas: mais brilhantes perto do centro, cintilando devagar
    for (const p of stars) {
      const a = angle(p, t);
      const d = R * p.r;
      const k = Math.min(Math.max((3 - p.r) / 1.9, 0), 1);
      const b = blink(p, t);
      const s = p.size * (0.6 + k * 0.6) * b.scale;
      ctx.globalAlpha = Math.min(p.alpha * (0.35 + 0.65 * k) * b.alpha, 1);
      ctx.drawImage(p.img, cx + Math.cos(a) * d - s / 2, cy + Math.sin(a) * d - s / 2, s, s);
    }

    // Centro escuro por cima
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    ctx.fillStyle = core;
    ctx.fillRect(cx - R * 1.2, cy - R * 1.2, R * 2.4, R * 2.4);
  };

  const loop = (now) => {
    if (!start) start = now - time * 1000;
    time = (now - start) / 1000;
    draw(time);
    frame = requestAnimationFrame(loop);
  };
  const play = () => { if (!running) { running = true; start = 0; frame = requestAnimationFrame(loop); } };
  const pause = () => { running = false; cancelAnimationFrame(frame); };

  measure();
  draw(time);
  new ResizeObserver(() => { measure(); if (!running) draw(time); }).observe(hero);
  if (reduceMotion) return;
  // Só anima enquanto o hero está na tela e não foi coberto pela dobra
  let visible = false, covered = false, menuOpen = false;
  const sync = () => (visible && !covered && !menuOpen ? play() : pause());
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }).observe(hero);
  hero.addEventListener("hero:covered", (event) => { covered = event.detail; sync(); });
  // Com o menu aberto a página fica desfocada: pausar deixa a animação do menu mais leve
  document.addEventListener("menu:toggle", (event) => { menuOpen = event.detail; sync(); });
}

/* Dobra sobre o hero ---------------------------------------------------
   O hero fica preso ao topo (sticky) e a seção seguinte sobe por cima dele.
   Nesse trajeto a galáxia dá zoom (--fold) e o hero borra e escurece.
*/
function setupHeroFold() {
  const hero = document.querySelector(".hero");
  // Primeira seção visível depois do hero (a faixa de prova pode estar oculta)
  let next = hero && hero.nextElementSibling;
  while (next && next.hidden) next = next.nextElementSibling;
  if (!next) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = (v) => Math.min(Math.max(v, 0), 1);
  let covered = false, ticking = false;

  // Se o hero for mais alto que a tela, ele rola até o fim antes de travar
  const setTop = () => { hero.style.top = `${Math.min(0, window.innerHeight - hero.offsetHeight)}px`; };

  const update = () => {
    ticking = false;
    const progress = clamp(1 - next.getBoundingClientRect().top / window.innerHeight);
    if (!reduceMotion) {
      const blur = clamp((progress - 0.2) / 0.8);
      hero.style.setProperty("--fold", progress.toFixed(4));
      hero.style.filter = blur > 0.001 ? `blur(${(blur * 14).toFixed(2)}px) brightness(${(1 - blur * 0.55).toFixed(3)})` : "";
    }
    const isCovered = progress > 0.999;
    if (isCovered !== covered) {
      covered = isCovered;
      hero.classList.toggle("is-covered", covered);
      hero.dispatchEvent(new CustomEvent("hero:covered", { detail: covered }));
    }
  };
  const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };

  setTop();
  update();
  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", () => { setTop(); request(); });
}

/* Cards de serviço que viram --------------------------------------------
   "Saiba mais" vira o card e mostra o verso com a descrição; o "×" do verso
   volta para a frente. Só um card fica virado por vez.
*/
function setupServiceFlip() {
  const cards = Array.from(document.querySelectorAll(".service"));
  const setFlipped = (card, flipped) => {
    card.classList.toggle("is-flipped", flipped);
    // A face escondida sai da navegação por teclado e dos leitores de tela
    card.querySelector(".service__face--front").inert = flipped;
    card.querySelector(".service__face--back").inert = !flipped;
  };

  cards.forEach((card) => {
    // Vidro do verso: usa a imagem do próprio card, carregada só quando o card recebe atenção
    const image = card.querySelector(".service__media");
    const back = card.querySelector(".service__face--back");
    const prepareGlass = () => { if (image) back.style.setProperty("--img", `url("${image.currentSrc || image.src}")`); };
    card.addEventListener("pointerenter", prepareGlass, { once: true });
    card.addEventListener("focusin", prepareGlass, { once: true });

    card.querySelectorAll(".service__flip").forEach((button) => {
      button.addEventListener("click", () => {
        prepareGlass();
        const flipped = !card.classList.contains("is-flipped");
        cards.forEach((other) => { if (other !== card) setFlipped(other, false); });
        setFlipped(card, flipped);
        card.querySelector(flipped ? ".service__back" : ".service__link").focus({ preventScroll: true });
      });
    });
  });
}

/* Ano atual no rodapé ------------------------------------------------- */
function setupYear() {
  document.querySelectorAll(".js-year").forEach((el) => { el.textContent = new Date().getFullYear(); });
}
