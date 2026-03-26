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

// ---- View More toggle for project extras ----
document.querySelectorAll('.view-more-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const targetId = this.getAttribute('data-target');
    const extra = document.getElementById(targetId);
    const textEl = this.querySelector('.view-more-text');
    const isOpen = extra.classList.toggle('is-open');
    this.classList.toggle('is-open');
    textEl.textContent = isOpen ? 'View less' : 'View more';
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

  function getProjectImages(gridItem) {
    const projectBlock = gridItem.closest('.project-block');
    if (!projectBlock) return [];
    const items = projectBlock.querySelectorAll('.grid-item');
    return Array.from(items).map(function(item) {
      var overlaySpan = item.querySelector('.img-overlay span');
      return {
        src: item.querySelector('img').src,
        caption: overlaySpan ? overlaySpan.textContent : ''
      };
    });
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

  document.querySelectorAll('.grid-item').forEach(function(item) {
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
