// Smooth scroll for internal links
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const targetId = link.getAttribute('href');
  if (targetId.length > 1) {
    const el = document.querySelector(targetId);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
});

// Active nav highlight on scroll
const navLinks = Array.from(document.querySelectorAll('.main-nav a'));
const sections = navLinks.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const id = '#' + entry.target.id;
    const link = navLinks.find((l) => l.getAttribute('href') === id);
    if (link) {
            if (entry.isIntersecting) {
        navLinks.forEach((l) => l.classList.remove('active'));
        link.classList.add('active');
                }
            }
        });
}, { rootMargin: '-25% 0px -70% 0px', threshold: [0, 0.2, 0.5, 1] });
sections.forEach((sec) => observer.observe(sec));

// Back to top button
const backToTop = document.getElementById('backToTop');
const toggleBackToTop = () => {
  if (window.scrollY > 400) backToTop.classList.add('show');
  else backToTop.classList.remove('show');
};
window.addEventListener('scroll', toggleBackToTop);
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Shrink header on scroll
const header = document.querySelector('.site-header');
const handleScroll = () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
};
window.addEventListener('scroll', handleScroll);

// Theme toggle (persist to localStorage)
const themeToggle = document.getElementById('themeToggle');
const THEME_KEY = 'enso_theme';
const applyTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
};
const saved = localStorage.getItem(THEME_KEY);
if (saved) applyTheme(saved);
themeToggle?.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem(THEME_KEY, next);
});

// Update footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Animate probability bars when they come into view
const animateBars = () => {
  const probBars = document.querySelectorAll('.prob-fill, .impact-fill, .anomaly-bar');
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animationDelay = Math.random() * 0.3 + 's';
        entry.target.style.animationName = 'fillBar';
        entry.target.style.animationDuration = '1.2s';
        entry.target.style.animationFillMode = 'forwards';
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  
  probBars.forEach((bar) => barObserver.observe(bar));
};

// Add CSS animation for bars
const style = document.createElement('style');
style.textContent = `
  @keyframes fillBar {
    from { width: 0; height: 0; }
    to { width: var(--final-width, 100%); height: var(--final-height, 100%); }
  }
  .prob-fill, .impact-fill { --final-width: var(--width); }
  .anomaly-bar { --final-height: var(--height); }
`;
document.head.appendChild(style);

// Set CSS custom properties for animation targets
document.querySelectorAll('.prob-fill, .impact-fill').forEach((el) => {
  const width = el.style.width;
  el.style.setProperty('--width', width);
  el.style.width = '0';
});

document.querySelectorAll('.anomaly-bar').forEach((el) => {
  const height = el.style.height;
  el.style.setProperty('--height', height);
  el.style.height = '0';
});

// Counter animation for statistics
const animateCounters = () => {
  const statNumbers = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const finalValue = target.textContent;
        let current = 0;
        const increment = parseFloat(finalValue) / 60;
        const isTemperature = finalValue.includes('°C');
        const isPercentage = finalValue.includes('%');
        const isYears = finalValue.includes('ปี');
        
        target.textContent = isTemperature ? '0°C' : isPercentage ? '0%' : isYears ? '0 ปี' : '0';
        
        const timer = setInterval(() => {
          current += increment;
          if (current >= parseFloat(finalValue)) {
            target.textContent = finalValue;
            clearInterval(timer);
          } else {
            const displayValue = Math.floor(current * 10) / 10;
            target.textContent = isTemperature ? `${displayValue}°C` : 
                               isPercentage ? `${Math.floor(current)}%` : 
                               isYears ? `${Math.floor(current)}-${Math.floor(current)+5} ปี` : 
                               displayValue;
          }
        }, 16);
        
        counterObserver.unobserve(target);
      }
    });
  }, { threshold: 0.5 });
  
  statNumbers.forEach((el) => counterObserver.observe(el));
};

// Enhanced hover effects for cards
const enhanceCardInteractions = () => {
  document.querySelectorAll('.stat-card, .region-card, .gallery-item').forEach((card) => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = card.classList.contains('stat-card') ? 'scale(1.02)' : 
                           card.classList.contains('region-card') ? 'translateY(-2px)' : 
                           'scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'none';
    });
  });
};

// Initialize all interactive features
const initInteractivity = () => {
  setTimeout(() => {
    animateBars();
    animateCounters();
    enhanceCardInteractions();
  }, 100);
};

// Start interactivity when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initInteractivity);
} else {
  initInteractivity();
}

// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach((el) => revealObserver.observe(el));

// FAQ accordion
document.querySelectorAll('.faq-q').forEach((btn) => {
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    const answer = btn.nextElementSibling;
    if (answer) {
      const isHidden = answer.hasAttribute('hidden');
      if (isHidden) answer.removeAttribute('hidden');
      else answer.setAttribute('hidden', '');
    }
  });
});

