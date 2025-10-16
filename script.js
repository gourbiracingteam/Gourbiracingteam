// ===== LOADER =====
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 1000);
});

// ===== MENU MOBILE =====
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Fermer le menu mobile lors du clic sur un lien
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// ===== NAVIGATION SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== HERO SLIDER =====
const heroSlides = document.querySelectorAll('.hero-slide');
let currentSlide = 0;

function nextSlide() {
    heroSlides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % heroSlides.length;
    heroSlides[currentSlide].classList.add('active');
}

// Change de slide toutes les 5 secondes
setInterval(nextSlide, 5000);

// ===== ANIMATIONS AU SCROLL =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Appliquer aux sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    fadeInObserver.observe(section);
});

// Animation des cartes d'équipe
const teamObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}, observerOptions);

document.querySelectorAll('.team-member, .histoire-card, .objectifs-section').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    teamObserver.observe(card);
});

// ===== GALERIE PHOTOS - FILTRES =====
const filterButtons = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Retirer la classe active de tous les boutons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Ajouter la classe active au bouton cliqué
        button.classList.add('active');

        const filter = button.getAttribute('data-filter');

        galleryItems.forEach(item => {
            if (filter === 'all' || item.getAttribute('data-category') === filter) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    });
});

// ===== LIGHTBOX POUR GALERIE =====
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.querySelector('.lightbox-img');
const lightboxCaption = document.querySelector('.lightbox-caption');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');

let currentImageIndex = 0;
let visibleImages = [];

function updateVisibleImages() {
    visibleImages = Array.from(galleryItems).filter(item => {
        return window.getComputedStyle(item).display !== 'none';
    });
}

galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        updateVisibleImages();
        currentImageIndex = visibleImages.indexOf(item);
        showLightbox(item);
    });
});

function showLightbox(item) {
    const img = item.querySelector('img');
    const caption = item.querySelector('.gallery-overlay p');
    
    lightboxImg.src = img.src;
    lightboxCaption.textContent = caption ? caption.textContent : '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

lightboxClose.addEventListener('click', closeLightbox);

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

lightboxPrev.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex - 1 + visibleImages.length) % visibleImages.length;
    showLightbox(visibleImages[currentImageIndex]);
});

lightboxNext.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex + 1) % visibleImages.length;
    showLightbox(visibleImages[currentImageIndex]);
});

// Navigation au clavier dans la lightbox
document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('active')) {
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            lightboxPrev.click();
        } else if (e.key === 'ArrowRight') {
            lightboxNext.click();
        }
    }
});

// ===== BOUTON "VOIR PLUS" POUR LA GALERIE =====
const loadMoreBtn = document.getElementById('loadMore');
let itemsToShow = 16;
let currentItems = 16;

// Cacher les éléments supplémentaires au chargement
galleryItems.forEach((item, index) => {
    if (index >= itemsToShow) {
        item.classList.add('hidden');
    }
});

loadMoreBtn.addEventListener('click', () => {
    currentItems += 8;
    let itemsShown = 0;
    
    galleryItems.forEach((item, index) => {
        if (itemsShown < currentItems && item.classList.contains('hidden')) {
            item.classList.remove('hidden');
            itemsShown++;
        }
    });

    // Cacher le bouton si tous les éléments sont visibles
    const hiddenItems = document.querySelectorAll('.gallery-item.hidden');
    if (hiddenItems.length === 0) {
        loadMoreBtn.style.display = 'none';
    }
});

// ===== FORMULAIRE DE CONTACT =====
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;

        // Créer le lien mailto
        const mailtoLink = `mailto:alexane.fournie17@gmail.com?subject=${encodeURIComponent(subject + ' - ' + name)}&body=${encodeURIComponent(message + '\n\nDe: ' + name + '\nEmail: ' + email)}`;
        
        // Ouvrir le client mail
        window.location.href = mailtoLink;
        
        // Message de confirmation
        alert('Votre client mail va s\'ouvrir. Si cela ne fonctionne pas, contactez-nous directement à alexane.fournie17@gmail.com');
        
        // Réinitialiser le formulaire
        contactForm.reset();
    });
}

// ===== GESTION DU HEADER AU SCROLL =====
let lastScroll = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > lastScroll && currentScroll > 100) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }

    lastScroll = currentScroll;
});

// ===== NAVIGATION ACTIVE =====
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 100)) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active-link');
        if (item.getAttribute('href') === `#${current}`) {
            item.classList.add('active-link');
        }
    });
});

// ===== BOUTON SCROLL TO TOP =====
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===== ANIMATION DU COMPTEUR DE PRIX =====
const animatePrice = () => {
    const priceElement = document.querySelector('.price');
    if (!priceElement) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetPrice = 300;
                let currentPrice = 0;
                const increment = targetPrice / 50;
                const duration = 1500;
                const stepTime = duration / 50;

                const counter = setInterval(() => {
                    currentPrice += increment;
                    if (currentPrice >= targetPrice) {
                        currentPrice = targetPrice;
                        clearInterval(counter);
                    }
                    priceElement.innerHTML = Math.floor(currentPrice) + '<span class="currency">€</span>';
                }, stepTime);

                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(priceElement);
};

animatePrice();

// ===== ANIMATION DES STATISTIQUES =====
const animateStats = () => {
    const stats = document.querySelectorAll('.stat-item strong');
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;
                let currentValue = 0;
                
                // Extraire le nombre (peut contenir +)
                const numMatch = finalValue.match(/\d+/);
                if (numMatch) {
                    const number = parseInt(numMatch[0]);
                    const increment = number / 30;
                    const hasPlus = finalValue.includes('+');
                    
                    const counter = setInterval(() => {
                        currentValue += increment;
                        if (currentValue >= number) {
                            currentValue = number;
                            clearInterval(counter);
                        }
                        target.textContent = hasPlus ? '+' + Math.floor(currentValue) : Math.floor(currentValue);
                    }, 50);
                }
                
                statsObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => statsObserver.observe(stat));
};

animateStats();

// ===== PARALLAXE SUBTIL SUR LE HERO =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero && scrolled < hero.offsetHeight) {
        const heroContent = document.querySelector('.hero-content');
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// ===== LAZY LOADING POUR LES IMAGES =====
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== CONTRÔLES VIDÉO AMÉLIORÉS =====
document.querySelectorAll('video').forEach(video => {
    video.addEventListener('play', () => {
        // Mettre en pause les autres vidéos
        document.querySelectorAll('video').forEach(v => {
            if (v !== video) {
                v.pause();
            }
        });
    });
});

// ===== EASTER EGG - TRIPLE CLIC SUR LE LOGO =====
let logoClickCount = 0;
let logoClickTimer;

const logo = document.querySelector('.logo');
if (logo) {
    logo.addEventListener('click', () => {
        logoClickCount++;
        
        clearTimeout(logoClickTimer);
        
        if (logoClickCount === 3) {
            // Animation spéciale
            document.body.style.animation = 'rainbow 3s linear';
            
            // Confettis ou effet spécial
            createConfetti();
            
            setTimeout(() => {
                document.body.style.animation = '';
            }, 3000);
            
            logoClickCount = 0;
        }
        
        logoClickTimer = setTimeout(() => {
            logoClickCount = 0;
        }, 500);
    });
}

function createConfetti() {
    const colors = ['#e74c3c', '#3498db', '#f39c12', '#2ecc71', '#9b59b6'];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = '-10px';
        confetti.style.opacity = '1';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '9999';
        confetti.style.borderRadius = '50%';
        
        document.body.appendChild(confetti);

        const duration = Math.random() * 3 + 2;
        const rotation = Math.random() * 360;
        
        confetti.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
            { transform: `translateY(${window.innerHeight}px) rotate(${rotation}deg)`, opacity: 0 }
        ], {
            duration: duration * 1000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });

        setTimeout(() => {
            confetti.remove();
        }, duration * 1000);
    }
}

// ===== CONSOLE MESSAGE =====
console.log('%c🏍️ GOURBI RACING TEAM 🏍️', 'font-size: 24px; color: #e74c3c; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);');
console.log('%cDes pilotes, des motos & des circuits !', 'font-size: 16px; color: #3498db; font-style: italic;');
console.log('%c✨ Site web développé avec passion', 'font-size: 12px; color: #2c3e50;');
console.log('%c📸 Photos : Benjamin Dessolle Photographe', 'font-size: 11px; color: #7f8c8d;');

// ===== AJOUTER DES STYLES DYNAMIQUES =====
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
    
    .active-link {
        background: rgba(231, 76, 60, 0.2) !important;
        color: var(--primary-red) !important;
    }
`;
document.head.appendChild(style);

// ===== PERFORMANCE - DÉSACTIVER LES ANIMATIONS SUR MOBILE SI NÉCESSAIRE =====
if (window.innerWidth < 768 && 'requestIdleCallback' in window) {
    requestIdleCallback(() => {
        // Réduire les animations sur mobile pour de meilleures performances
        document.body.classList.add('reduced-motion');
    });
}

// ===== ACCESSIBILITÉ - GESTION DU FOCUS =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

// ===== DÉTECTION DE LA CONNEXION INTERNET =====
window.addEventListener('online', () => {
    console.log('✅ Connexion Internet rétablie');
});

window.addEventListener('offline', () => {
    console.log('❌ Pas de connexion Internet');
    alert('Attention : Vous semblez être hors ligne. Certaines fonctionnalités peuvent ne pas fonctionner.');
});

// ===== INITIALISATION =====
console.log('✅ Site initialisé avec succès');