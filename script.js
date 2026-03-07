/* ============================================
   GRANNTHALYA — Script
   ============================================ */

// --- Vercel Analytics ---
window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };

// --- Floating Gold Particles ---
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let particles = [];
  const PARTICLE_COUNT = 60;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + Math.random() * 100;
      this.size = Math.random() * 2.5 + 0.5;
      this.speedY = -(Math.random() * 0.5 + 0.15);
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.fade = Math.random() * 0.003 + 0.001;
      this.flickerSpeed = Math.random() * 0.02 + 0.01;
      this.flickerOffset = Math.random() * Math.PI * 2;
    }
    update(time) {
      this.x += this.speedX;
      this.y += this.speedY;
      // Gentle flicker
      this.currentOpacity = this.opacity * (0.6 + 0.4 * Math.sin(time * this.flickerSpeed + this.flickerOffset));
      if (this.y < -10 || this.currentOpacity <= 0) {
        this.reset();
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212, 175, 55, ${this.currentOpacity})`;
      ctx.fill();

      // Glow
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212, 175, 55, ${this.currentOpacity * 0.15})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = new Particle();
    p.y = Math.random() * canvas.height; // initial spread
    particles.push(p);
  }

  let startTime = performance.now();

  function animate() {
    const elapsed = performance.now() - startTime;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update(elapsed);
      p.draw();
    });
    requestAnimationFrame(animate);
  }
  animate();
})();


// --- Navbar scroll effect ---
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
        ticking = false;
      });
      ticking = true;
    }
  });
})();


// --- Mobile navigation ---
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

function closeNav() {
  navLinks?.classList.remove('open');
  hamburger?.classList.remove('active');
}

hamburger?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('active');
});


// --- Scroll reveal (Intersection Observer) ---
(function initReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));
})();


// --- Animated counters ---
(function initCounters() {
  const statNumbers = document.querySelectorAll('.stat-number[data-target], .community-stat[data-target]');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => observer.observe(el));

  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const format = el.dataset.format || '';
    const isDecimal = el.dataset.decimal === 'true';
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      const current = eased * target;

      let display;
      if (format === 'k') {
        display = Math.floor(current / 1000) + 'K';
      } else if (format === 'm') {
        display = (current / 1000000).toFixed(1) + 'M';
      } else if (isDecimal) {
        display = current.toFixed(1);
      } else {
        display = Math.floor(current).toString();
      }

      el.textContent = display + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }
})();


// --- Smooth scroll for anchor links ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return; // skip waitlist buttons
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 80; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


/* ============================================
   LANGUAGE (i18n) — Hindi / English
   ============================================ */
let currentLang = localStorage.getItem('antarmarg-lang') || 'en';

const translations = {
  en: {
    // Nav
    'nav.features': 'Features',
    'nav.journeys': 'Journeys',
    'nav.aiguru': 'AI Guru',
    'nav.pricing': 'Pricing',
    'nav.community': 'Community',
    'nav.joinWaitlist': 'Join Waitlist',

    // Hero
    'hero.tagline': 'Your Spiritual Companion',
    'hero.description': 'Walk the sacred inner path — where ancient wisdom meets modern devotion. A living spiritual ecosystem for daily sadhana, scripture study, guided journeys & inner transformation.',
    'hero.joinBtn': '🙏 Join the Waitlist',
    'hero.exploreBtn': '✦ Explore Features',

    // Stats
    'stats.users': 'Active Users',
    'stats.rating': 'App Rating',
    'stats.verses': 'Verses Read',
    'stats.streak': 'Max Possible',

    // Features
    'features.label': 'Sacred Features',
    'features.title': 'Everything for Your <span class="gradient-text">Spiritual Growth</span>',
    'features.subtitle': 'From ancient scriptures to AI-powered guidance — a complete ecosystem for your daily spiritual practice.',
    'feat.sacredTexts': 'Sacred Texts',
    'feat.sacredTextsDesc': 'Bhagavad Gita, Ramayana, Upanishads, Vedas — read, listen, & study with verse-by-verse commentary.',
    'feat.dailyPractice': 'Daily Practice',
    'feat.dailyPracticeDesc': 'Personalized morning & evening routines with mantras, meditation, and puja reminders.',
    'feat.stories': 'Stories & Katha',
    'feat.storiesDesc': 'Animated stories from Puranas, epics & traditions — for children and adults alike.',
    'feat.aiGuru': 'AI Guru',
    'feat.aiGuruDesc': 'Ask any spiritual question and receive wisdom rooted in authentic scriptures.',
    'feat.audio': 'Audio Library',
    'feat.audioDesc': 'Mantras, bhajans, meditation music, and guided sessions for every mood and occasion.',
    'feat.journeys': 'Spiritual Journeys',
    'feat.journeysDesc': 'Structured multi-day programs like Garbh Sanskar, Gita Challenge & Hanuman Sadhana.',
    'feat.ashram': 'Virtual Ashram',
    'feat.ashramDesc': 'A sacred digital space for community, satsang, live sessions & collective practice.',
    'feat.kundli': 'Kundli & Panchang',
    'feat.kundliDesc': 'Check daily panchang, auspicious timings, and personalized horoscope insights.',

    // Journeys
    'journeys.label': 'Spiritual Journeys',
    'journeys.title': 'Guided Paths to <span class="gradient-text">Transformation</span>',
    'journeys.subtitle': 'Structured multi-day spiritual programs designed to deepen your practice and inner connection.',

    // AI Guru
    'aiguru.label': 'AI-Powered Wisdom',
    'aiguru.title': 'Your Personal <span class="gradient-text">Spiritual Guide</span>',
    'aiguru.subtitle': 'Ask any question about dharma, scriptures, or life — receive authentic, scripture-backed wisdom instantly.',

    // Audio
    'audio.label': 'Sacred Sounds',
    'audio.title': 'Immersive <span class="gradient-text">Audio Library</span>',
    'audio.subtitle': 'From morning mantras to bedtime stories — curated audio for every moment of your spiritual day.',

    // Pricing
    'pricing.label': 'Choose Your Path',
    'pricing.title': 'Simple, Sacred <span class="gradient-text">Pricing</span>',
    'pricing.subtitle': 'Start free, upgrade when you\'re ready. Every path leads to growth.',

    // App Preview
    'preview.label': 'App Preview',
    'preview.title': 'Experience <span class="gradient-text">Antarमार्ग</span>',
    'preview.subtitle': 'A glimpse into the spiritual ecosystem that awaits you.',

    // Community
    'community.label': 'Join Our Sangha',
    'community.title': 'Walk the Path <span class="gradient-text">Together</span>',
    'community.subtitle': 'Be part of a sacred community of seekers walking the inner path of dharma.',
    'community.ytTitle': 'YouTube',
    'community.ytLabel': 'Watch & Learn',
    'community.ytDesc': 'Slokas, stories & spiritual teachings',
    'community.igTitle': 'Instagram',
    'community.igLabel': 'Daily Inspiration',
    'community.igDesc': 'Sacred verses, wisdom & community',
    'community.openTitle': 'Open to All',
    'community.openLabel': 'For Every Seeker',
    'community.openDesc': 'From beginners to devoted practitioners',
    'community.dharmaTitle': 'Rooted in Dharma',
    'community.dharmaLabel': 'Authentic Tradition',
    'community.dharmaDesc': 'Guided by Sanatana Dharma principles',

    // CTA
    'cta.title': '<span class="gradient-text">Begin Your Spiritual Journey</span>',
    'cta.subtitle': 'Join the Antar Marg waitlist today and be among the first to walk the sacred inner path toward peace, wisdom, and devotion.',
    'cta.btn': '🙏 Join Waitlist — It\'s Free',
    'cta.learn': 'Learn More',

    // Footer
    'footer.desc': 'Walk the sacred inner path — a living spiritual ecosystem for daily sadhana, devotion, scripture & inner transformation. Rooted in Sanatana Dharma.',
    'footer.features': 'Features',
    'footer.journeys': 'Journeys',
    'footer.company': 'Company',
    'footer.about': 'About Us',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.contact': 'Contact',
    'footer.copy': '© 2026 Antar Marg. All rights reserved. Made with 🙏 for Sanatana Dharma.',

    // Waitlist
    'wl.step1': 'Join',
    'wl.step2': 'About You',
    'wl.step3': 'Customize',
    'wl.title1': '🙏 Join the Antar Marg Waitlist',
    'wl.desc1': 'Capture your spot for the launch of the sacred ecosystem.',
    'wl.name': 'Full Name',
    'wl.email': 'Email Address',
    'wl.city': 'City',
    'wl.state': 'State',
    'wl.country': 'Country',
    'wl.deviceTitle': 'What device do you use?',
    'wl.deviceAndroid': 'Android',
    'wl.deviceIos': 'iPhone (iOS)',
    'wl.continue': 'Continue →',
    'wl.back': '← Back',
    'wl.title2': 'Help us personalize your journey',
    'wl.desc2': 'This helps us tailor the experience for you (Optional).',
    'wl.title3': 'What excites you most?',
    'wl.desc3': 'Select the features you\'re most interested in.',
    'wl.referral': 'How did you hear about us?',
    'wl.submit': '🙏 Join Waitlist',
    'wl.successTitle': 'Namaste! You\'re on the list!',
    'wl.successDesc': 'We\'ll notify you as soon as Antar Marg is ready.',
    'wl.close': 'Close'
  },
  hi: {
    // Nav
    'nav.features': 'विशेषताएँ',
    'nav.journeys': 'यात्राएँ',
    'nav.aiguru': 'AI गुरु',
    'nav.pricing': 'मूल्य',
    'nav.community': 'समुदाय',
    'nav.joinWaitlist': 'वेटलिस्ट जॉइन करें',

    // Hero
    'hero.tagline': 'आपका आध्यात्मिक साथी',
    'hero.description': 'पवित्र अंतर पथ पर चलें — जहाँ प्राचीन ज्ञान आधुनिक भक्ति से मिलता है। दैनिक साधना, शास्त्र अध्ययन, निर्देशित यात्राएँ और आंतरिक परिवर्तन के लिए एक जीवंत आध्यात्मिक पारिस्थितिकी तंत्र।',
    'hero.joinBtn': '🙏 वेटलिस्ट जॉइन करें',
    'hero.exploreBtn': '✦ विशेषताएँ देखें',

    // Stats
    'stats.users': 'सक्रिय उपयोगकर्ता',
    'stats.rating': 'ऐप रेटिंग',
    'stats.verses': 'श्लोक पढ़े गए',
    'stats.streak': 'अधिकतम संभव',

    // Features
    'features.label': 'पवित्र विशेषताएँ',
    'features.title': 'आपके <span class="gradient-text">आध्यात्मिक विकास</span> के लिए सब कुछ',
    'features.subtitle': 'प्राचीन शास्त्रों से लेकर AI-संचालित मार्गदर्शन तक — आपकी दैनिक आध्यात्मिक साधना के लिए एक संपूर्ण पारिस्थितिकी तंत्र।',
    'feat.sacredTexts': 'पवित्र ग्रंथ',
    'feat.sacredTextsDesc': 'भगवद गीता, रामायण, उपनिषद, वेद — श्लोक-दर-श्लोक टीका के साथ पढ़ें, सुनें और अध्ययन करें।',
    'feat.dailyPractice': 'दैनिक साधना',
    'feat.dailyPracticeDesc': 'मंत्र, ध्यान और पूजा अनुस्मारक के साथ व्यक्तिगत सुबह और शाम की दिनचर्या।',
    'feat.stories': 'कथाएँ',
    'feat.storiesDesc': 'पुराण, महाकाव्य और परंपराओं से एनिमेटेड कथाएँ — बच्चों और बड़ों दोनों के लिए।',
    'feat.aiGuru': 'AI गुरु',
    'feat.aiGuruDesc': 'कोई भी आध्यात्मिक प्रश्न पूछें और प्रामाणिक शास्त्रों पर आधारित ज्ञान प्राप्त करें।',
    'feat.audio': 'ऑडियो लाइब्रेरी',
    'feat.audioDesc': 'मंत्र, भजन, ध्यान संगीत और हर अवसर के लिए निर्देशित सत्र।',
    'feat.journeys': 'आध्यात्मिक यात्राएँ',
    'feat.journeysDesc': 'गर्भ संस्कार, गीता चैलेंज और हनुमान साधना जैसे संरचित बहु-दिवसीय कार्यक्रम।',
    'feat.ashram': 'वर्चुअल आश्रम',
    'feat.ashramDesc': 'समुदाय, सत्संग, लाइव सत्र और सामूहिक साधना के लिए एक पवित्र डिजिटल स्थान।',
    'feat.kundli': 'कुंडली और पंचांग',
    'feat.kundliDesc': 'दैनिक पंचांग, शुभ मुहूर्त और व्यक्तिगत राशिफल जानकारी देखें।',

    // Journeys
    'journeys.label': 'आध्यात्मिक यात्राएँ',
    'journeys.title': 'परिवर्तन के <span class="gradient-text">निर्देशित मार्ग</span>',
    'journeys.subtitle': 'आपकी साधना और आंतरिक संबंध को गहरा करने के लिए डिज़ाइन किए गए संरचित बहु-दिवसीय आध्यात्मिक कार्यक्रम।',

    // AI Guru
    'aiguru.label': 'AI-संचालित ज्ञान',
    'aiguru.title': 'आपका व्यक्तिगत <span class="gradient-text">आध्यात्मिक मार्गदर्शक</span>',
    'aiguru.subtitle': 'धर्म, शास्त्र या जीवन के बारे में कोई भी प्रश्न पूछें — तुरंत प्रामाणिक, शास्त्र-आधारित ज्ञान प्राप्त करें।',

    // Audio
    'audio.label': 'पवित्र ध्वनियाँ',
    'audio.title': 'इमर्सिव <span class="gradient-text">ऑडियो लाइब्रेरी</span>',
    'audio.subtitle': 'सुबह के मंत्रों से लेकर सोने की कथाओं तक — आपके आध्यात्मिक दिन के हर पल के लिए क्यूरेटेड ऑडियो।',

    // Pricing
    'pricing.label': 'अपना मार्ग चुनें',
    'pricing.title': 'सरल, पवित्र <span class="gradient-text">मूल्य</span>',
    'pricing.subtitle': 'मुफ्त में शुरू करें, तैयार होने पर अपग्रेड करें। हर मार्ग विकास की ओर ले जाता है।',

    // App Preview
    'preview.label': 'ऐप प्रीव्यू',
    'preview.title': 'अनुभव करें <span class="gradient-text">अंतरमार्ग</span>',
    'preview.subtitle': 'आपका इंतज़ार कर रहे आध्यात्मिक पारिस्थितिकी तंत्र की एक झलक।',

    // Community
    'community.label': 'हमारे संघ में शामिल हों',
    'community.title': 'साथ मिलकर <span class="gradient-text">चलें मार्ग पर</span>',
    'community.subtitle': 'धर्म के अंतर मार्ग पर चलने वाले साधकों के पवित्र समुदाय का हिस्सा बनें।',
    'community.ytTitle': 'यूट्यूब',
    'community.ytLabel': 'देखें और सीखें',
    'community.ytDesc': 'श्लोक, कथाएँ और आध्यात्मिक शिक्षा',
    'community.igTitle': 'इंस्टाग्राम',
    'community.igLabel': 'दैनिक प्रेरणा',
    'community.igDesc': 'पवित्र श्लोक, ज्ञान और समुदाय',
    'community.openTitle': 'सभी के लिए खुला',
    'community.openLabel': 'हर साधक के लिए',
    'community.openDesc': 'शुरुआती से लेकर समर्पित साधकों तक',
    'community.dharmaTitle': 'धर्म में निहित',
    'community.dharmaLabel': 'प्रामाणिक परंपरा',
    'community.dharmaDesc': 'सनातन धर्म के सिद्धांतों द्वारा निर्देशित',

    // CTA
    'cta.title': '<span class="gradient-text">अपनी आध्यात्मिक यात्रा शुरू करें</span>',
    'cta.subtitle': 'आज ही अंतर मार्ग वेटलिस्ट में शामिल हों और शांति, ज्ञान और भक्ति के पवित्र मार्ग पर चलने वाले पहले लोगों में शामिल हों।',
    'cta.btn': '🙏 वेटलिस्ट जॉइन करें — मुफ्त',
    'cta.learn': 'और जानें',

    // Footer
    'footer.desc': 'पवित्र अंतर पथ पर चलें — दैनिक साधना, भक्ति, शास्त्र और आंतरिक परिवर्तन के लिए एक जीवंत आध्यात्मिक पारिस्थितिकी तंत्र। सनातन धर्म में निहित।',
    'footer.features': 'विशेषताएँ',
    'footer.journeys': 'यात्राएँ',
    'footer.company': 'कंपनी',
    'footer.about': 'हमारे बारे में',
    'footer.privacy': 'गोपनीयता नीति',
    'footer.terms': 'सेवा की शर्तें',
    'footer.contact': 'संपर्क',
    'footer.copy': '© 2026 अंतर मार्ग। सर्वाधिकार सुरक्षित। 🙏 सनातन धर्म के लिए बनाया गया।',

    // Waitlist
    'wl.step1': 'शामिल हों',
    'wl.step2': 'आपके बारे में',
    'wl.step3': 'अनुकूलित करें',
    'wl.title1': '🙏 अंतर मार्ग वेटलिस्ट में शामिल हों',
    'wl.desc1': 'पवित्र पारिस्थितिकी तंत्र के लॉन्च के लिए अपना स्थान सुरक्षित करें।',
    'wl.name': 'पूरा नाम',
    'wl.email': 'ईमेल पता',
    'wl.city': 'शहर',
    'wl.state': 'राज्य',
    'wl.country': 'देश',
    'wl.deviceTitle': 'आप कौन सा डिवाइस इस्तेमाल करते हैं?',
    'wl.deviceAndroid': 'एंड्रॉयड',
    'wl.deviceIos': 'आईफोन (iOS)',
    'wl.continue': 'स्थान सुरक्षित करें →',
    'wl.back': '← पीछे',
    'wl.title2': 'अपनी यात्रा को निजीकृत करें',
    'wl.desc2': 'यह हमें आपके अनुभव को बेहतर बनाने में मदद करता है (वैकल्पिक)।',
    'wl.title3': 'आपको सबसे ज़्यादा क्या पसंद है?',
    'wl.desc3': 'उन सुविधाओं का चयन करें जिनमें आपकी रुचि है।',
    'wl.referral': 'आपने हमारे बारे में कैसे सुना?',
    'wl.submit': '🙏 वेटलिस्ट जॉइन करें',
    'wl.successTitle': 'नमस्ते! आप सूची में हैं!',
    'wl.successDesc': 'अंतर मार्ग तैयार होते ही हम आपको सूचित करेंगे।',
    'wl.close': 'बंद करें'
  }
};

function toggleLanguage() {
  currentLang = currentLang === 'en' ? 'hi' : 'en';
  localStorage.setItem('antarmarg-lang', currentLang);
  applyLanguage();
}

function applyLanguage() {
  const dict = translations[currentLang];
  const label = document.getElementById('langLabel');
  if (label) label.textContent = currentLang === 'en' ? 'हिंदी' : 'English';

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      if (dict[key].includes('<span')) {
        el.innerHTML = dict[key];
      } else {
        el.textContent = dict[key];
      }
    }
  });

  // Update html lang attribute
  document.documentElement.lang = currentLang === 'en' ? 'en' : 'hi';
}

// Apply saved language on load
if (currentLang !== 'en') {
  applyLanguage();
}


/* ============================================
   IMAGE MODAL
   ============================================ */
(function initImageModal() {
  const imageModal = document.getElementById('imageModal');
  const imageModalImg = document.getElementById('imageModalImg');
  const closeBtn = document.querySelector('.image-modal-close');
  const carouselImages = document.querySelectorAll('.carousel-img');

  if (imageModal && imageModalImg) {
    carouselImages.forEach(img => {
      img.addEventListener('click', () => {
        imageModalImg.src = img.src;
        imageModal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
      });
    });

    window.closeImageModal = function (e) {
      if (e && e.target !== imageModal && e.target !== closeBtn) {
        return;
      }
      imageModal.classList.remove('show');
      document.body.style.overflow = '';
      setTimeout(() => {
        if (!imageModal.classList.contains('show')) {
          imageModalImg.src = '';
        }
      }, 300);
    };
  }
})();


/* ============================================
   WAITLIST MODAL & SUPABASE
   ============================================ */

// --- Supabase Init ---
const SUPABASE_URL = 'https://zedyljklkogxcsuxdvil.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplZHlsamtsa29neGNzdXhkdmlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0NTg4NzcsImV4cCI6MjA4ODAzNDg3N30.qdi0HdbmZPLwwK6e2wXMADD_sycjhoE4AiJvTTi5k60';

let supabaseClient = null;
try {
  if (typeof supabase !== 'undefined' && SUPABASE_URL !== 'YOUR_SUPABASE_URL') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
} catch (e) {
  console.warn('Supabase not initialized:', e);
}

// --- Modal open / close ---
function openWaitlist(e) {
  if (e) e.preventDefault();
  document.getElementById('waitlistOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  // Reset to step 1
  goToStep(1, true);
}

function closeWaitlist() {
  document.getElementById('waitlistOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

// Close on overlay click (not modal)
document.getElementById('waitlistOverlay')?.addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeWaitlist();
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeWaitlist();
});

// --- Step Navigation ---
let currentStep = 1;

function goToStep(step, isReset) {
  // Validate current step before advancing
  if (!isReset && step > currentStep) {
    if (!validateStep(currentStep)) return;
  }

  currentStep = step;

  // Update panels
  document.querySelectorAll('.waitlist-panel').forEach(p => p.classList.remove('active'));
  const targetPanel = document.getElementById('waitlistStep' + step);
  if (targetPanel) targetPanel.classList.add('active');

  // Update step indicators
  document.querySelectorAll('.waitlist-step').forEach(s => {
    const sStep = parseInt(s.dataset.step);
    s.classList.remove('active', 'completed');
    if (sStep === step) s.classList.add('active');
    else if (sStep < step) s.classList.add('completed');
  });
}

function validateStep(step) {
  if (step === 1) {
    const email = document.getElementById('wl-email').value.trim();
    const deviceType = document.querySelector('input[name="device_type"]:checked');

    if (!email || !email.includes('@') || !email.includes('.')) {
      shakeField('wl-email');
      document.getElementById('wl-email').focus();
      return false;
    }
    if (!deviceType) {
      shakeField('deviceGroup');
      return false;
    }

    // Partial Submit logic
    partialSubmitWaitlist();
    return true;
  }
  return true; // Steps 2 & 3 are optional
}

async function partialSubmitWaitlist() {
  const email = document.getElementById('wl-email').value.trim();
  const deviceType = document.querySelector('input[name="device_type"]:checked')?.value;

  if (!email || !deviceType) return;

  const data = {
    email: email,
    device_type: deviceType,
    partial: true,
    signup_at: new Date().toISOString()
  };

  // Silently send to Supabase or logs
  if (supabaseClient) {
    try {
      await supabaseClient.from('waitlist').upsert([data], { onConflict: 'email' });
    } catch (e) { console.warn('Partial submit failed:', e); }
  } else {
    console.log('📋 Partial signup:', data);
  }
}

function shakeField(id) {
  const el = document.getElementById(id);
  el.style.borderColor = '#f87171';
  el.style.animation = 'shake 0.4s ease';
  setTimeout(() => {
    el.style.borderColor = '';
    el.style.animation = '';
  }, 500);
}

// Shake animation
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-6px); }
    75% { transform: translateX(6px); }
  }
`;
document.head.appendChild(shakeStyle);

// --- Submit ---
async function submitWaitlist() {
  if (!validateStep(1)) { goToStep(1); return; }

  const btn = document.getElementById('waitlistSubmitBtn');
  btn.classList.add('loading');
  btn.textContent = 'Submitting...';

  // Gather form data
  const data = {
    full_name: document.getElementById('wl-name').value.trim(),
    email: document.getElementById('wl-email').value.trim(),
    city: document.getElementById('wl-city').value.trim() || null,
    state: document.getElementById('wl-state').value.trim() || null,
    country: document.getElementById('wl-country').value.trim() || 'India',
    device_type: getCheckedValues('device_type')[0] || null,
    usage_for: getCheckedValues('usage_for'),
    interests: getCheckedValues('interests'),
    referral_source: document.getElementById('wl-referral').value || null,
  };

  // Try Supabase insert
  if (supabaseClient) {
    try {
      const { error } = await supabaseClient.from('waitlist').insert([data]);
      if (error) {
        if (error.code === '23505') {
          // Duplicate email
          alert('This email is already on our waitlist! 🙏');
          btn.classList.remove('loading');
          btn.textContent = '🙏 Join Waitlist';
          return;
        }
        throw error;
      }
    } catch (err) {
      console.error('Supabase error:', err);
      // Still show success if it's a connection issue (offline demo)
    }
  } else {
    // No Supabase — log data for demo
    console.log('📋 Waitlist signup (Supabase not configured):', data);
  }

  // Gathering referral ID or generating one
  const userId = Math.random().toString(36).substring(2, 9);
  const refLink = `https://antarmarg.com?ref=${userId}`;
  const referralInput = document.getElementById('referralLink');
  if (referralInput) referralInput.value = refLink;

  // Show success
  document.querySelectorAll('.waitlist-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('waitlistSuccess').classList.add('active');
  document.querySelector('.waitlist-steps').style.display = 'none';

  btn.classList.remove('loading');
  btn.textContent = '🙏 Join Waitlist';
}

function copyReferral() {
  const copyText = document.getElementById("referralLink");
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(copyText.value);

  const btn = event.target;
  const originalText = btn.textContent;
  btn.textContent = "Copied!";
  setTimeout(() => { btn.textContent = originalText; }, 2000);
}

function getCheckedValues(name) {
  return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`))
    .map(cb => cb.value);
}

/* ============================================
   JAPA COUNTER INTERACTION
   ============================================ */
(function initJapaCounter() {
  const japaCircle = document.querySelector('.japa-circle');
  const japaCountText = document.querySelector('.japa-count');

  if (japaCircle && japaCountText) {
    let count = 108;
    japaCircle.addEventListener('click', () => {
      // Haptic feedback if supported by browser/device
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
      count++;
      japaCountText.textContent = count;

      // Quick flash animation
      japaCircle.style.animation = 'none';
      japaCircle.offsetHeight; /* trigger reflow */
      japaCircle.style.animation = null;
    });
  }
})();

/* ============================================
   AMBIENT BACKGROUND MUSIC
   ============================================ */
(function initAmbientMusic() {
  const bgMusic = document.getElementById('bgMusic');
  const musicToggle = document.getElementById('musicToggle');
  const musicIcon = document.getElementById('musicIcon');
  let hasInteracted = false;
  let isPlaying = false;

  if (!bgMusic || !musicToggle) return;

  // Try to play on first user interaction anywhere on the page
  const startMusicOnInteract = () => {
    if (hasInteracted) return;
    hasInteracted = true;
    toggleSound(true);
    // Remove listeners once interacting
    document.removeEventListener('click', startMusicOnInteract);
    document.removeEventListener('touchstart', startMusicOnInteract);
    document.removeEventListener('scroll', startMusicOnInteract);
  };

  // Attempt to play immediately on load (may be blocked by browser)
  window.addEventListener('load', () => {
    toggleSound(true);
  });

  document.addEventListener('click', startMusicOnInteract, { once: true });
  document.addEventListener('touchstart', startMusicOnInteract, { once: true });
  document.addEventListener('scroll', startMusicOnInteract, { once: true });

  // Manual toggle
  musicToggle.addEventListener('click', (e) => {
    e.stopPropagation(); // don't trigger global click if not played yet
    hasInteracted = true;
    toggleSound(!isPlaying);
  });

  function toggleSound(play) {
    if (play) {
      bgMusic.volume = 0.3; // Gentle volume
      bgMusic.play().then(() => {
        isPlaying = true;
        musicIcon.textContent = '🔊';
        musicToggle.classList.add('playing');
        musicToggle.setAttribute('aria-label', 'Pause Background Music');
      }).catch(err => {
        console.warn('Autoplay prevented by browser:', err);
      });
    } else {
      bgMusic.pause();
      isPlaying = false;
      musicIcon.textContent = '🔇';
      musicToggle.classList.remove('playing');
      musicToggle.setAttribute('aria-label', 'Play Background Music');
    }
  }
})();

// --- Social Proof Counter ---
(function initSocialProof() {
  const counts = document.querySelectorAll('.waitlist-count');
  if (!counts.length) return;

  let baseCount = 1247;

  function updateCount() {
    baseCount += Math.floor(Math.random() * 3);
    counts.forEach(el => {
      el.textContent = baseCount.toLocaleString();
    });
    setTimeout(updateCount, 15000 + Math.random() * 30000);
  }

  updateCount();
})();
