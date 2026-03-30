// ---- Mobile nav toggle ----
(function() {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  var isOpen = false;
  var OPEN_STYLES = 'display:flex;flex-direction:column;position:absolute;top:72px;left:0;right:0;background:rgba(246,244,240,0.97);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);padding:1.5rem clamp(1.25rem,4vw,3rem);gap:1.5rem;border-bottom:1px solid #ECEAE4;list-style:none;z-index:99';

  toggle.onclick = function() {
    isOpen = !isOpen;
    links.style.cssText = isOpen ? OPEN_STYLES : '';
    toggle.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
  };

  links.querySelectorAll('a').forEach(function(a) {
    a.addEventListener('click', function() {
      isOpen = false;
      links.style.cssText = '';
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', false);
    });
  });
}());

// ---- Intersection Observer for reveal animations ----
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -60px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

document.querySelectorAll('.reveal, .stagger-children').forEach(el => {
  observer.observe(el);
});

// ---- Navbar hide on scroll down, show on scroll up ----
let lastScroll = 0;
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;
  if (currentScroll > lastScroll && currentScroll > 120) {
    nav.style.transform = 'translateY(-100%)';
  } else {
    nav.style.transform = 'translateY(0)';
  }
  lastScroll = currentScroll;
}, { passive: true });

// ---- Smooth scroll for anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ---- View More toggle for project extras + editorial sections ----
document.querySelectorAll('.view-more-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const block = this.closest('.project-block');
    const textEl = this.querySelector('.view-more-text');

    // Toggle project-extra (old mosaic grid extras)
    const targetId = this.getAttribute('data-target');
    const extra = targetId ? document.getElementById(targetId) : null;

    // Toggle project-editorial (new editorial sections)
    const editorial = block ? block.querySelector('.project-editorial') : null;

    let isOpen = false;
    if (extra) { isOpen = extra.classList.toggle('is-open'); }
    if (editorial) { isOpen = editorial.classList.toggle('is-open'); }

    this.classList.toggle('is-open', isOpen);
    textEl.textContent = isOpen ? 'Show less' : 'View more';
  });
});

// ---- Lightbox ----
(function() {
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const lbCaption = document.getElementById('lightbox-caption');
  const lbCounter = document.getElementById('lightbox-counter');
  const lbClose = document.getElementById('lightbox-close');
  const lbPrev = document.getElementById('lightbox-prev');
  const lbNext = document.getElementById('lightbox-next');

  let currentImages = [];
  let currentIndex = 0;

  function getProjectImages(clickedEl) {
    const projectBlock = clickedEl.closest('.project-block');
    if (!projectBlock) return [];

    // Collect from both grid-items and ed-img elements
    var images = [];
    var items = projectBlock.querySelectorAll('.grid-item, .ed-img');
    items.forEach(function(item) {
      var img = item.querySelector('img');
      if (!img) return;
      var overlaySpan = item.querySelector('.img-overlay span');
      var descP = item.querySelector('.img-desc p');
      var caption = overlaySpan ? overlaySpan.textContent : (descP ? descP.textContent : '');
      images.push({ src: img.src, caption: caption });
    });
    return images;
  }

  function showImage(index) {
    if (index < 0 || index >= currentImages.length) return;
    currentIndex = index;
    lbImg.src = currentImages[index].src;
    lbImg.alt = currentImages[index].caption;
    lbCaption.textContent = currentImages[index].caption;
    lbCounter.textContent = (index + 1) + ' / ' + currentImages.length;
    lbPrev.style.display = currentImages.length <= 1 ? 'none' : '';
    lbNext.style.display = currentImages.length <= 1 ? 'none' : '';
    lbCounter.style.display = currentImages.length <= 1 ? 'none' : '';
  }

  function openLightbox(gridItem) {
    currentImages = getProjectImages(gridItem);
    var clickedSrc = gridItem.querySelector('img').src;
    var startIndex = currentImages.findIndex(function(img) { return img.src === clickedSrc; });
    showImage(startIndex >= 0 ? startIndex : 0);
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  // Lightbox click on grid items and editorial images
  document.querySelectorAll('.grid-item, .ed-img').forEach(function(item) {
    item.style.cursor = 'pointer';
    item.addEventListener('click', function(e) {
      e.preventDefault();
      openLightbox(this);
    });
  });

  lbClose.addEventListener('click', closeLightbox);

  lbPrev.addEventListener('click', function() {
    showImage((currentIndex - 1 + currentImages.length) % currentImages.length);
  });

  lbNext.addEventListener('click', function() {
    showImage((currentIndex + 1) % currentImages.length);
  });

  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', function(e) {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') {
      showImage((currentIndex - 1 + currentImages.length) % currentImages.length);
    }
    if (e.key === 'ArrowRight') {
      showImage((currentIndex + 1) % currentImages.length);
    }
  });
})();

// ---- Email obfuscation (anti-harvester) ----
(function() {
  var el = document.getElementById('contact-email');
  if (!el) return;
  var u = 'contact';
  var d = 'nataliapatkiewicz.com';
  el.href = 'mai' + 'lto:' + u + '@' + d;
  el.textContent = u + '@' + d;
})();
