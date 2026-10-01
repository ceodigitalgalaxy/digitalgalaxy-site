/* ==========================================================================
   Digital Galaxy — interações da landing page
   ========================================================================== */

/* Configuração de contato
   --------------------------------------------------------------------------
   PLACEHOLDER: preencha para ativar os botões de WhatsApp e o e-mail no rodapé.
   Enquanto estiverem vazios, esses links ficam ocultos na página.
   whatsapp: só números, com DDI e DDD. Ex.: "5511912345678"
*/
const CONFIG = {
  whatsapp: "",
  whatsappMessage: "Olá! Vim pelo site da Digital Galaxy e quero entender como vocês podem ajudar o meu negócio.",
  email: ""
};

document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", () => {
  setupContactLinks();
  setupHeader();
  setupMobileMenu();
  setupReveal();
  setupStarfields();
  setupYear();
});

/* Contato: WhatsApp e e-mail ------------------------------------------- */
function setupContactLinks() {
  if (CONFIG.whatsapp) {
    const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(CONFIG.whatsappMessage)}`;
    document.querySelectorAll(".js-whatsapp").forEach((link) => {
      link.href = url;
      link.hidden = false;
    });
    document.querySelectorAll(".js-whatsapp-item").forEach((item) => { item.hidden = false; });
  }

  if (CONFIG.email) {
    document.querySelectorAll(".js-email").forEach((link) => {
      link.href = `mailto:${CONFIG.email}`;
      link.textContent = CONFIG.email;
    });
    document.querySelectorAll(".js-email-item").forEach((item) => { item.hidden = false; });
  }
}

/* Header com fundo ao rolar ------------------------------------------- */
function setupHeader() {
  const header = document.querySelector(".header");
  const update = () => header.classList.toggle("is-scrolled", window.scrollY > 12);
  update();
  window.addEventListener("scroll", update, { passive: true });
}

/* Menu mobile --------------------------------------------------------- */
function setupMobileMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.getElementById("menu");
  const header = document.querySelector(".header");

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    nav.classList.toggle("is-open", open);
    header.classList.toggle("menu-open", open);
  };

  toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
  nav.addEventListener("click", (event) => { if (event.target.closest("a")) setOpen(false); });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      setOpen(false);
      toggle.focus();
    }
  });
  // Volta ao estado normal ao passar para o layout de desktop
  window.matchMedia("(min-width: 1025px)").addEventListener("change", (event) => { if (event.matches) setOpen(false); });
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

/* Ano atual no rodapé ------------------------------------------------- */
function setupYear() {
  document.querySelectorAll(".js-year").forEach((el) => { el.textContent = new Date().getFullYear(); });
}
