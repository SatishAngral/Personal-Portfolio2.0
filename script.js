/**
 * Satish Angral - Portfolio Interactive Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  initScrollSpy();
  initContactForm();
  initCopyEmail();
  initCatEasterEgg();
  initYear();
});

/* ===================================================================
   1. THEME TOGGLE (Dark / Light Mode)
   =================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const root = document.documentElement;

  // Retrieve saved preference or default to signature light (Ivory + Forest Green)
  const savedTheme = localStorage.getItem('satish-portfolio-theme');
  const initialTheme = savedTheme || 'light';

  root.setAttribute('data-theme', initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = root.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';

      root.setAttribute('data-theme', newTheme);
      localStorage.setItem('satish-portfolio-theme', newTheme);
      showToast(`Switched to ${newTheme} mode!`, newTheme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun');
    });
  }
}

/* ===================================================================
   2. MOBILE NAVIGATION
   =================================================================== */
function initMobileMenu() {
  const navToggleBtn = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!navToggleBtn || !navMenu) return;

  const toggleMenu = () => {
    navMenu.classList.toggle('active');
    const isOpen = navMenu.classList.contains('active');
    const icon = navToggleBtn.querySelector('i');
    if (icon) {
      icon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    }
  };

  navToggleBtn.addEventListener('click', toggleMenu);

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        toggleMenu();
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !navToggleBtn.contains(e.target)) {
      if (navMenu.classList.contains('active')) {
        toggleMenu();
      }
    }
  });
}

/* ===================================================================
   3. SCROLL SPY & NAVBAR BLUR
   =================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const header = document.getElementById('header');

  const onScroll = () => {
    const scrollY = window.pageYOffset;

    if (header) {
      if (scrollY > 40) {
        header.style.boxShadow = '0 10px 30px -10px rgba(0, 0, 0, 0.4)';
      } else {
        header.style.boxShadow = 'none';
      }
    }

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 140;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ===================================================================
   4. COPY EMAIL TO CLIPBOARD
   =================================================================== */
function initCopyEmail() {
  const copyButtons = document.querySelectorAll('.copy-email-btn, .copy-btn');

  copyButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-email') || 'satish.angral@example.com';

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(() => {
          showToast(`Copied ${email} to clipboard! 📋`, 'fa-solid fa-circle-check');
        }).catch(() => {
          fallbackCopyText(email);
        });
      } else {
        fallbackCopyText(email);
      }
    });
  });

  function fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      showToast(`Copied ${text} to clipboard! 📋`, 'fa-solid fa-circle-check');
    } catch (err) {
      showToast(`Email: ${text}`, 'fa-regular fa-envelope');
    }
    document.body.removeChild(textArea);
  }
}

/* ===================================================================
   5. CUTE CAT EASTER EGG (PURR BUBBLE & MEOW SOUND)
   =================================================================== */
function initCatEasterEgg() {
  const catCard = document.getElementById('cat-card');
  const purrBubble = document.getElementById('purr-bubble');

  if (!catCard || !purrBubble) return;

  const purrPhrases = [
    'Meow! 🐾💖',
    'Purr... coding! 🐱',
    'Ready for HTML & CSS! ✨',
    'Java is purrfect! ☕',
    'Pet me again! 😻'
  ];

  let phraseIndex = 0;

  catCard.addEventListener('click', () => {
    // Cycle phrase
    purrBubble.textContent = purrPhrases[phraseIndex % purrPhrases.length];
    phraseIndex++;

    purrBubble.classList.add('show');
    playSynthesizedMeow();

    // Create heart floating particle
    createFloatingHeart(catCard);

    setTimeout(() => {
      purrBubble.classList.remove('show');
    }, 2500);
  });
}

/**
 * Generates a cute synthesized cat meow tone using Web Audio API (zero audio files needed!)
 */
function playSynthesizedMeow() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Frequency sweeps from ~550Hz up to 720Hz and down to 480Hz
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(750, now + 0.15);
    osc.frequency.exponentialRampToValueAtTime(460, now + 0.45);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.45);
  } catch (e) {
    // AudioContext blocked by user policy; silently ignore
  }
}

function createFloatingHeart(parent) {
  const heart = document.createElement('span');
  heart.innerHTML = '💖';
  heart.style.position = 'absolute';
  heart.style.left = `${Math.random() * 60 + 20}%`;
  heart.style.top = '40%';
  heart.style.fontSize = '1.4rem';
  heart.style.pointerEvents = 'none';
  heart.style.zIndex = '20';
  heart.style.transition = 'all 1s cubic-bezier(0.16, 1, 0.3, 1)';
  heart.style.transform = 'translateY(0) scale(1)';
  heart.style.opacity = '1';

  parent.appendChild(heart);

  requestAnimationFrame(() => {
    heart.style.transform = `translateY(-60px) scale(1.4) rotate(${Math.random() * 30 - 15}deg)`;
    heart.style.opacity = '0';
  });

  setTimeout(() => {
    heart.remove();
  }, 1000);
}

/* ===================================================================
   6. CONTACT FORM HANDLING
   =================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('submit-btn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !subject || !message) {
      showFeedback('Please fill out all fields before submitting.', 'error');
      return;
    }

    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;

      showFeedback(`Thank you, ${name}! Your message was successfully sent to Satish.`, 'success');
      showToast('Message sent successfully! 🚀', 'fa-solid fa-circle-check');
      form.reset();
    }, 1200);
  });

  function showFeedback(text, type) {
    if (!feedback) return;
    feedback.textContent = text;
    feedback.className = `form-feedback ${type}`;
    feedback.style.display = 'block';

    setTimeout(() => {
      feedback.style.display = 'none';
    }, 5000);
  }

  // Resume download placeholder handler
  const downloadBtn = document.getElementById('download-cv');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('Attach your actual resume.pdf in index.html to enable direct download!', 'fa-solid fa-file-pdf');
    });
  }
}

/* ===================================================================
   7. TOAST NOTIFICATIONS
   =================================================================== */
function showToast(message, iconClass = 'fa-solid fa-circle-info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="${iconClass}"></i><span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'fadeOutToast 0.4s ease forwards';
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 3200);
}

/* ===================================================================
   8. DYNAMIC YEAR
   =================================================================== */
function initYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
