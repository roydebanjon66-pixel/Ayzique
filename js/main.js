/* ============================================================
   AYZIQUE — Main JavaScript
   ============================================================ */

'use strict';

// ============================================================
// CONFIG — Update these with your real contact details
// ============================================================
const CONFIG = {
  whatsappNumber: '8801XXXXXXXXX', // Replace with your WhatsApp number (no + or spaces)
  email: 'orders@ayzique.com',     // Replace with your email
  instagramHandle: '@ayzique',
};

// ============================================================
// LOADER
// ============================================================
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  // Hide loader after page is ready
  const minDelay = 2000;
  const startTime = Date.now();

  window.addEventListener('load', () => {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, minDelay - elapsed);
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, remaining);
  });

  // Failsafe
  setTimeout(() => loader.classList.add('hidden'), 4000);
}

// ============================================================
// NAVBAR
// ============================================================
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Hamburger / Mobile Nav
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ============================================================
// SCROLL REVEAL OBSERVER
// ============================================================
function initScrollReveal() {
  const elements = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-scale, .timeline-item'
  );

  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

// ============================================================
// TESTIMONIAL SLIDER
// ============================================================
function initSlider() {
  const track = document.querySelector('.testimonials-track');
  const prevBtn = document.querySelector('.slider-btn.prev');
  const nextBtn = document.querySelector('.slider-btn.next');
  const dots = document.querySelectorAll('.slider-dot');

  if (!track) return;

  const slides = track.querySelectorAll('.testimonial-slide');
  const total = slides.length;
  let current = 0;

  const goTo = (index) => {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  };

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  // Auto-slide
  let autoSlide = setInterval(() => goTo(current + 1), 5000);

  track.addEventListener('mouseenter', () => clearInterval(autoSlide));
  track.addEventListener('mouseleave', () => {
    autoSlide = setInterval(() => goTo(current + 1), 5000);
  });

  goTo(0);
}

// ============================================================
// SHOP FILTER
// ============================================================
function initShopFilter() {
  const filterTabs = document.querySelectorAll('.filter-tab');
  const productCards = document.querySelectorAll('.product-card');
  const countEl = document.querySelector('.filter-count');

  if (!filterTabs.length) return;

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const filter = tab.dataset.filter;

      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      let visible = 0;
      productCards.forEach(card => {
        const cats = card.dataset.category || '';
        const show = filter === 'all' || cats.includes(filter);
        if (show) {
          card.classList.remove('hidden');
          card.style.animation = 'none';
          card.offsetHeight; // reflow
          card.style.animation = '';
          visible++;
        } else {
          card.classList.add('hidden');
        }
      });

      if (countEl) countEl.textContent = `${visible} Products`;
    });
  });
}

// ============================================================
// ORDER MODAL
// ============================================================
function initOrderModal() {
  const overlay = document.getElementById('orderModal');
  const closeBtn = overlay?.querySelector('.modal-close');

  if (!overlay) return;

  const modalTitle = overlay.querySelector('.modal-product-name');
  const nameInput = overlay.querySelector('#orderName');
  const phoneInput = overlay.querySelector('#orderPhone');
  const sizeSelect = overlay.querySelector('#orderSize');
  const qtyInput = overlay.querySelector('#orderQty');
  const notesInput = overlay.querySelector('#orderNotes');
  const whatsappBtn = overlay.querySelector('#sendWhatsapp');
  const emailBtn = overlay.querySelector('#sendEmail');

  let currentProduct = '';
  let currentPrice = '';

  // Open Modal
  window.openOrderModal = (productName, productPrice, sizes) => {
    currentProduct = productName;
    currentPrice = productPrice;

    if (modalTitle) modalTitle.textContent = productName;

    if (sizeSelect && sizes) {
      sizeSelect.innerHTML = `<option value="">Select Size</option>`;
      sizes.forEach(s => {
        sizeSelect.innerHTML += `<option value="${s}">${s}</option>`;
      });
    }

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  // Close Modal
  const closeModal = () => {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  // Build Order Message
  const buildMessage = () => {
    const name = nameInput?.value.trim() || '—';
    const phone = phoneInput?.value.trim() || '—';
    const size = sizeSelect?.value || '—';
    const qty = qtyInput?.value || '1';
    const notes = notesInput?.value.trim() || 'None';

    return {
      name, phone, size, qty, notes,
      message:
        `*NEW ORDER — AYZIQUE*\n\n` +
        `👤 *Customer Name:* ${name}\n` +
        `📞 *Phone:* ${phone}\n` +
        `👕 *Product:* ${currentProduct}\n` +
        `💰 *Price:* ${currentPrice}\n` +
        `📏 *Size:* ${size}\n` +
        `🔢 *Quantity:* ${qty}\n` +
        `📝 *Notes:* ${notes}\n\n` +
        `_Sent via AYZIQUE Website_`
    };
  };

  // Validate
  const validate = () => {
    const name = nameInput?.value.trim();
    const phone = phoneInput?.value.trim();
    const size = sizeSelect?.value;

    if (!name) { nameInput?.focus(); alert('Please enter your name.'); return false; }
    if (!phone) { phoneInput?.focus(); alert('Please enter your phone number.'); return false; }
    if (!size) { sizeSelect?.focus(); alert('Please select a size.'); return false; }
    return true;
  };

  // WhatsApp
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
      if (!validate()) return;
      const { message } = buildMessage();
      const encoded = encodeURIComponent(message);
      window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${encoded}`, '_blank');
      closeModal();
    });
  }

  // Email
  if (emailBtn) {
    emailBtn.addEventListener('click', () => {
      if (!validate()) return;
      const { name, phone, size, qty, notes } = buildMessage();
      const subject = encodeURIComponent(`Order: ${currentProduct} — AYZIQUE`);
      const body = encodeURIComponent(
        `New Order from AYZIQUE Website\n\n` +
        `Customer Name: ${name}\n` +
        `Phone: ${phone}\n` +
        `Product: ${currentProduct}\n` +
        `Price: ${currentPrice}\n` +
        `Size: ${size}\n` +
        `Quantity: ${qty}\n` +
        `Notes: ${notes}\n\n` +
        `Sent via AYZIQUE Website`
      );
      window.location.href = `mailto:${CONFIG.email}?subject=${subject}&body=${body}`;
      closeModal();
    });
  }
}

// ============================================================
// QUICK ORDER BUTTONS (Product Cards)
// ============================================================
function initQuickOrder() {
  document.querySelectorAll('.quick-wa').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.product-card');
      const product = card?.dataset.product || 'AYZIQUE Product';
      const price = card?.dataset.price || '';
      const sizes = (card?.dataset.sizes || 'XS,S,M,L,XL,XXL').split(',');
      window.openOrderModal?.(product, price, sizes);
    });
  });

  document.querySelectorAll('.quick-email').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.product-card');
      const product = card?.dataset.product || 'AYZIQUE Product';
      const price = card?.dataset.price || '';
      const sizes = (card?.dataset.sizes || 'XS,S,M,L,XL,XXL').split(',');
      window.openOrderModal?.(product, price, sizes);
    });
  });
}

// ============================================================
// CONTACT FORM → EMAIL
// ============================================================
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('#cName')?.value.trim() || '';
    const phone = form.querySelector('#cPhone')?.value.trim() || '';
    const email = form.querySelector('#cEmail')?.value.trim() || '';
    const message = form.querySelector('#cMessage')?.value.trim() || '';

    const subject = encodeURIComponent(`Message from ${name} — AYZIQUE Website`);
    const body = encodeURIComponent(
      `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\n\nMessage:\n${message}`
    );

    window.location.href = `mailto:${CONFIG.email}?subject=${subject}&body=${body}`;
  });
}

// ============================================================
// PARALLAX (subtle)
// ============================================================
function initParallax() {
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (!parallaxEls.length) return;

  const handleScroll = () => {
    parallaxEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      const speed = parseFloat(el.dataset.parallax) || 0.3;
      const offset = (window.innerHeight / 2 - rect.top - rect.height / 2) * speed;
      el.style.transform = `translateY(${offset}px)`;
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
}

// ============================================================
// MAGNETIC BUTTONS
// ============================================================
function initMagneticButtons() {
  const btns = document.querySelectorAll('.btn-primary, .btn-outline');

  btns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

// ============================================================
// LIGHTBOX (Lookbook)
// ============================================================
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox?.querySelector('.lightbox-img');
  const closeBtn = lightbox?.querySelector('.lightbox-close');

  if (!lightbox || !lightboxImg) return;

  document.querySelectorAll('[data-lightbox]').forEach(item => {
    item.addEventListener('click', () => {
      const src = item.dataset.lightbox;
      lightboxImg.src = src;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { lightboxImg.src = ''; }, 400);
  };

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
}

// ============================================================
// LOOKBOOK CATEGORY FILTER
// ============================================================
function initLookbookFilter() {
  const catBtns = document.querySelectorAll('.lookbook-cat-btn');
  const masonryItems = document.querySelectorAll('.masonry-item');

  if (!catBtns.length) return;

  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      catBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      masonryItems.forEach(item => {
        const cat = item.dataset.category || '';
        item.style.opacity = '0';
        item.style.transform = 'scale(0.96)';
        setTimeout(() => {
          if (filter === 'all' || cat === filter) {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 50);
          } else {
            item.style.display = 'none';
          }
        }, 200);
      });
    });
  });
}

// ============================================================
// TIMELINE PROGRESS LINE
// ============================================================
function initTimelineLine() {
  const lineFill = document.querySelector('.timeline-line-fill');
  if (!lineFill) return;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      lineFill.style.height = '100%';
    }
  }, { threshold: 0.1 });

  const wrap = document.querySelector('.timeline-wrap');
  if (wrap) observer.observe(wrap);
}

// ============================================================
// CURSOR GLOW (desktop only)
// ============================================================
function initCursorGlow() {
  if (window.matchMedia('(hover: none)').matches) return;

  const cursor = document.createElement('div');
  cursor.id = 'cursor-glow';
  cursor.style.cssText = `
    position: fixed;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(127,255,212,0.04) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
    transform: translate(-50%, -50%);
    transition: opacity 0.3s ease;
  `;
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });
}

// ============================================================
// PRODUCT CARD ORDER BUTTON INIT (also attach full order buttons)
// ============================================================
function initProductButtons() {
  // Full product order buttons
  document.querySelectorAll('[data-order-wa]').forEach(btn => {
    btn.addEventListener('click', () => {
      const product = btn.dataset.orderWa;
      const price = btn.dataset.price || '';
      const sizes = (btn.dataset.sizes || 'S,M,L,XL,XXL').split(',');
      window.openOrderModal?.(product, price, sizes);
    });
  });
}

// ============================================================
// INIT ALL
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.overflow = 'hidden';

  initLoader();
  initNavbar();
  initScrollReveal();
  initSlider();
  initShopFilter();
  initOrderModal();
  initQuickOrder();
  initContactForm();
  initParallax();
  initMagneticButtons();
  initLightbox();
  initLookbookFilter();
  initTimelineLine();
  initCursorGlow();
  initProductButtons();
});
