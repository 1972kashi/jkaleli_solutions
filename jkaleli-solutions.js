 // Service details data
/* jkaleli-solutions.js */

/* -----------------------------
   Data
----------------------------- */
const serviceData = {
  uiux:      { icon: "🎨", title: "UI/UX Design", desc: "We design intuitive, user-friendly interfaces that enhance customer experiences and drive engagement." },
  webdesign: { icon: "🖥️", title: "Web Design", desc: "We craft beautiful, responsive websites that capture your brand identity and leave a lasting impression." },
  webdev:    { icon: "💻", title: "Web Development", desc: "From custom applications to complex systems, we build scalable and secure solutions tailored to your business needs." },
  appdev:    { icon: "📱", title: "App Development", desc: "From custom applications to complex systems, we build scalable and secure mobile solutions tailored to your business needs." },
  startup:   { icon: "🧠", title: "Startup Ideas", desc: "We help you validate, refine, and launch your startup concept — turning raw ideas into actionable plans and MVPs." },
  seo:       { icon: "🔍", title: "SEO Optimization", desc: "Optimize your digital presence and boost your visibility with our data-driven SEO strategies." }
};

/* -----------------------------
   Footer injection
----------------------------- */
const footerIds = ["home-footer", "portfolio-footer", "about-footer", "services-footer"];

function injectFooterInto(footerId) {
  const tpl = document.getElementById("footer-tpl");
  const mount = document.getElementById(footerId);
  if (!tpl || !mount) return;

  mount.innerHTML = "";
  mount.appendChild(tpl.content.cloneNode(true));
}

function injectFooterForPage(pageName) {
  footerIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = "";
  });
  injectFooterInto(`${pageName}-footer`);
}

/* -----------------------------
   Navigation + active state
----------------------------- */
function setActiveNav(pageName) {
  document.querySelectorAll("nav .nav-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.page === pageName);
  });
}

function showPage(pageName) {
  const page = document.getElementById(`page-${pageName}`);
  if (!page) return;

  document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"));
  page.classList.add("active");

  setActiveNav(pageName);
  injectFooterForPage(pageName);

  // keep UX consistent (optional)
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* -----------------------------
   Portfolio filtering
----------------------------- */
function filterPortfolio(category, clickedBtn) {
  document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
  if (clickedBtn) clickedBtn.classList.add("active");

  document.querySelectorAll(".portfolio-item").forEach((item) => {
    const matches = category === "all" || item.dataset.cat === category;
    item.style.display = matches ? "flex" : "none";
  });
}

/* -----------------------------
   Service detail modal
----------------------------- */
function openDetail(key) {
  const d = serviceData[key];
  if (!d) return;

  const icon = document.getElementById("detail-icon");
  const title = document.getElementById("detail-title");
  const desc = document.getElementById("detail-desc");
  const modal = document.getElementById("service-detail");

  if (!icon || !title || !desc || !modal) return;

  icon.textContent = d.icon;
  title.textContent = d.title;
  desc.textContent = d.desc;

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function closeDetail() {
  const modal = document.getElementById("service-detail");
  if (!modal) return;

  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

/* -----------------------------
   Background particle network
----------------------------- */
function initParticleNetwork() {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  function size() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  size();

  const particleCount = Math.min(50, Math.floor(window.innerWidth / 30));
  const particles = [];
  const connectionDistance = 150;

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.radius = Math.random() * 1.5;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.color = Math.random() > 0.7 ? "rgba(255,255,255,0.6)" : "rgba(0,229,209,0.4)";
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

      this.x = Math.max(0, Math.min(canvas.width, this.x));
      this.y = Math.max(0, Math.min(canvas.height, this.y));
    }
    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) particles.push(new Particle());

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          ctx.strokeStyle = `rgba(0,229,209,${0.2 * (1 - dist / connectionDistance)})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animate);
  }

  animate();
  window.addEventListener("resize", size);
}

/* -----------------------------
   Scroll reveal (kept)
----------------------------- */
const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("reveal");
      revealObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

function triggerScrollReveal() {
  document
    .querySelectorAll(
      ".feature-card, .highlight-card, .value-card, .benefit-card, " +
      ".testimonial-card, .service-icon-card, .portfolio-item, .service-card"
    )
    .forEach((el) => {
      el.classList.remove("reveal");
      revealObserver.observe(el);
    });
}

/* -----------------------------
   Event wiring (no inline onclick)
----------------------------- */
function wireEvents() {
  // Nav buttons
  document.querySelectorAll("nav .nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => showPage(btn.dataset.page));
  });

  // Any element that navigates via data-page (home cards, footer links, hire buttons, etc)
  document.addEventListener("click", (e) => {
    const navTarget = e.target.closest("[data-page]");
    if (navTarget) {
      e.preventDefault();
      showPage(navTarget.dataset.page);
      return;
    }

    const filterBtn = e.target.closest(".filter-btn");
    if (filterBtn) {
      filterPortfolio(filterBtn.dataset.category, filterBtn);
      return;
    }

    const svc = e.target.closest("[data-service]");
    if (svc && svc.classList.contains("service-card")) {
      openDetail(svc.dataset.service);
      return;
    }

    const benefit = e.target.closest(".benefit-card[data-service]");
    if (benefit) {
      openDetail(benefit.dataset.service);
      return;
    }

    const close = e.target.closest("[data-close-detail]");
    if (close) {
      closeDetail();
      return;
    }

    // click outside content closes modal (optional)
    if (e.target.id === "service-detail") closeDetail();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDetail();
  });
}

/* -----------------------------
   Init
----------------------------- */
function init() {
  // Ensure footer on initial active page
  const activePage = document.querySelector(".page.active");
  const name = activePage?.id?.replace("page-", "") || "home";
  setActiveNav(name);
  injectFooterForPage(name);

  wireEvents();

  try { initParticleNetwork(); } catch (_) {}
  triggerScrollReveal();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

const overlay = document.getElementById('modal-overlay');
const mImg = document.getElementById('modal-img');
const mTitle = document.getElementById('modal-title');
const mText = document.getElementById('modal-text');

// Detect touch devices
const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

function openModal(el) {
  const title = el.getAttribute('data-title');
  const text = el.getAttribute('data-text');
  const imgPath = el.getAttribute('img');

  mTitle.innerText = title;
  mText.innerText = text;
  mImg.style.backgroundImage = `url('${imgPath}')`;
  
  overlay.classList.add('active');
}

function closeModal() {
  overlay.classList.remove('active');
}

// Select only the step numbers as triggers
const triggers = document.querySelectorAll('.step-number');

triggers.forEach(num => {
  if (isTouch) {
    // Mobile: Tap to open
    num.addEventListener('click', (e) => {
      e.stopPropagation();
      openModal(num);
    });
  } else {
    // Laptop: Hover to open, leave to close
    num.addEventListener('mouseenter', () => openModal(num));
    num.addEventListener('mouseleave', closeModal);
  }
});

// For mobile: Tap overlay background to close
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) closeModal();
});