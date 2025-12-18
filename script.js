/* Mega Landing — vanilla JS (menu, gallery, reveal, modal) */
(() => {
  const $ = (q, el=document) => el.querySelector(q);
  const $$ = (q, el=document) => Array.from(el.querySelectorAll(q));

  // Year
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile menu
  const burger = $(".burger");
  const menu = $("#menuMobile");
  if (burger && menu) {
    burger.addEventListener("click", () => {
      const expanded = burger.getAttribute("aria-expanded") === "true";
      burger.setAttribute("aria-expanded", String(!expanded));
      menu.hidden = expanded;
      document.body.style.overflow = expanded ? "" : "hidden";
    });

    $$("#menuMobile a").forEach(a => {
      a.addEventListener("click", () => {
        burger.setAttribute("aria-expanded", "false");
        menu.hidden = true;
        document.body.style.overflow = "";
      });
    });
  }

  // Smooth scroll (with offset for sticky header)
  const header = $(".topbar");
  const headerH = () => header ? header.getBoundingClientRect().height : 0;

  $$('a[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      const y = window.scrollY + target.getBoundingClientRect().top - headerH() - 10;
      window.scrollTo({ top: y, behavior: "smooth" });
    });
  });

  // Reveal on scroll
  const revealEls = $$(".reveal");
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("isVisible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => io.observe(el));

  // Gallery
  const galleryImgs = [
    { src: "./assets/inside-1.png", alt: "Área de treino da Mega Academia" },
    { src: "./assets/inside-2.png", alt: "Área de musculação com iluminação neon" },
    { src: "./assets/inside-3.png", alt: "Equipamentos de musculação em espaço amplo" },
    { src: "./assets/treadmills.png", alt: "Área de cardio com esteiras" },
    { src: "./assets/hero-exterior.png", alt: "Fachada da Mega Academia" },
  ];

  const mainImg = $("#galleryMainImg");
  const thumbs = $$(".thumb");
  let idx = 0;

  function setGallery(i) {
    idx = (i + galleryImgs.length) % galleryImgs.length;
    if (mainImg) {
      mainImg.src = galleryImgs[idx].src;
      mainImg.alt = galleryImgs[idx].alt;
    }
    thumbs.forEach((t, ti) => t.classList.toggle("isActive", ti === idx));
  }

  $$("[data-thumb]").forEach(btn => {
    btn.addEventListener("click", () => {
      const i = Number(btn.getAttribute("data-thumb"));
      if (!Number.isNaN(i)) setGallery(i);
    });
  });

  $$("[data-gallery]").forEach(btn => {
    btn.addEventListener("click", () => {
      const dir = btn.getAttribute("data-gallery");
      if (dir === "prev") setGallery(idx - 1);
      if (dir === "next") setGallery(idx + 1);
    });
  });

  // Keyboard gallery
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") setGallery(idx - 1);
    if (e.key === "ArrowRight") setGallery(idx + 1);
  });

  // Modal
  const modal = $("#planModal");
  const modalTitle = $("#modalTitle");
  const modalDesc = $("#modalDesc");
  const modalRows = $("#modalRows");
  const modalPill = $("#modalPill");

  const planData = {
    mensal: {
      pill: "Plano Mensal",
      title: "Plano Mensal — R$ 169,90/mês",
      desc: "Liberdade para pagar mês a mês. Ótimo para começar e ajustar a rotina.",
      rows: [
        ["Valor", "R$ 169,90 por mês"],
        ["Pagamento", "Pix/espécie ou débito/crédito na máquina"],
        ["Observações", "Taxas obrigatórias: adesão, (re)matrícula e avaliação física (bioimpedância)."],
      ],
    },
    anual: {
      pill: "Plano Anual",
      title: "Plano Anual — R$ 125,17/mês (recorrência)",
      desc: "Para quem quer constância e economia. Recorrência no cartão com opção de PIX com desconto.",
      rows: [
        ["Recorrência", "R$ 125,17 no cartão de crédito recorrente"],
        ["Opção PIX", "A partir da 2ª parcela: 15% de desconto até o 5º dia útil (R$ 106,39)"],
        ["Após o prazo", "Mensalidade segue normalmente no cartão de crédito"],
      ],
    },
    small: {
      pill: "Plano Small (Trimestral)",
      title: "Plano Small — R$ 397,00/trimestre",
      desc: "Atendimento personalizado / Emagrecimento total.",
      rows: [
        ["Valor", "R$ 397,00 (trimestral)"],
        ["Pagamento", "Pix/espécie ou débito/crédito na máquina; também no crédito recorrente"],
        ["Foco", "Atendimento personalizado"],
      ],
    },
  };

  function openModal(key) {
    const data = planData[key];
    if (!data || !modal) return;

    modalPill.textContent = data.pill;
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.desc;

    modalRows.innerHTML = data.rows.map(([k, v]) => `
      <div class="row"><strong>${k}</strong><span>${v}</span></div>
    `).join("");

    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    // focus close
    const closeBtn = $('.modalCard [data-close-modal]');
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  $$("[data-open-modal]").forEach(btn => {
    btn.addEventListener("click", () => openModal(btn.getAttribute("data-open-modal")));
  });

  $$("[data-close-modal]").forEach(btn => btn.addEventListener("click", closeModal));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  // Close modal by clicking outside card (backdrop already does that)
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // subtle topbar shadow on scroll
  const blurHeader = () => {
    if (!header) return;
    header.style.boxShadow = window.scrollY > 6 ? "0 12px 40px rgba(0,0,0,.35)" : "none";
  };
  blurHeader();
  window.addEventListener("scroll", blurHeader, { passive: true });

  // Preload gallery
  galleryImgs.forEach(i => { const img = new Image(); img.src = i.src; });

  // Init
  setGallery(0);
})();

// WhatsApp form -> opens wa.me with prefilled message
(() => {
  const form = document.getElementById("wppForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = (document.getElementById("wppNome")?.value || "").trim();
    const assunto = document.getElementById("wppAssunto")?.value || "";
    const horario = document.getElementById("wppHorario")?.value || "";
    const extra = (document.getElementById("wppMsg")?.value || "").trim();

    const partes = [];
    if (nome) partes.push(`Olá! Me chamo ${nome}.`);
    if (assunto) partes.push(assunto);
    if (horario) partes.push(`Melhor horário pra contato: ${horario}`);
    if (extra) partes.push(`Mensagem: ${extra}`);

    const msg = partes.join(" ");
    const base = "https://wa.me/556198265790";
    const url = `${base}?text=${encodeURIComponent(msg)}`;

    window.open(url, "_blank", "noopener");
  });
})();
