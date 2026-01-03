/**
 * Lusion-inspired Interactive Effects
 * Smooth scrolling, magnetic effects, scroll animations, text reveals
 */

class InteractiveEffects {
    constructor() {
        this.cursor = null;
        this.cursorDot = null;
        this.targetX = 0;
        this.targetY = 0;
        this.currentX = 0;
        this.currentY = 0;
        this.scrollY = 0;
        this.lastScrollY = 0;

        this.init();
    }

    init() {
        this.createCursor();
        this.initSmoothScroll();
        this.initScrollAnimations();
        this.initMagneticElements();
        this.initTextReveal();
        this.initParallax();
        this.initImageHoverEffects();
        this.animate();
    }

    // ========================
    // CUSTOM CURSOR (DISABLED)
    // ========================
    createCursor() {
        // Custom cursor disabled - use normal system cursor
        return;
    }

    // ========================
    // SMOOTH SCROLL (Lenis-like)
    // ========================
    initSmoothScroll() {
        // Apply smooth scroll to HTML
        document.documentElement.style.scrollBehavior = 'smooth';

        // Track scroll for parallax
        window.addEventListener('scroll', () => {
            this.scrollY = window.scrollY;
        }, { passive: true });
    }

    // ========================
    // SCROLL ANIMATIONS
    // ========================
    initScrollAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };

        const animateOnScroll = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Add stagger delay based on position
                    const delay = entry.target.dataset.delay || 0;
                    entry.target.style.transitionDelay = `${delay}ms`;
                    entry.target.classList.add('in-view');
                    animateOnScroll.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all animatable elements
        document.querySelectorAll('.animate-on-scroll, .project-card, .timeline-item, .skill-category, .blog-card').forEach((el, index) => {
            el.dataset.delay = index * 100;
            el.classList.add('scroll-animate');
            animateOnScroll.observe(el);
        });

        // Special observer for hero/header elements
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('hero-visible');
                    heroObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.blog-post__header, .about-header, .contact').forEach(el => {
            heroObserver.observe(el);
        });
    }

    // ========================
    // MAGNETIC ELEMENTS
    // ========================
    initMagneticElements() {
        const magneticElements = document.querySelectorAll('.social-link, .nav__logo, .cta-link, .project-card__link');

        magneticElements.forEach(el => {
            el.classList.add('magnetic');

            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                const deltaX = (e.clientX - centerX) * 0.3;
                const deltaY = (e.clientY - centerY) * 0.3;

                el.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = 'translate(0, 0)';
            });
        });
    }

    // ========================
    // TEXT REVEAL ANIMATION
    // ========================
    initTextReveal() {
        const headings = document.querySelectorAll('h1:not(.no-reveal)');

        headings.forEach(heading => {
            // Don't process if already processed
            if (heading.classList.contains('text-revealed')) return;
            heading.classList.add('text-revealed');

            const text = heading.textContent;
            const words = text.split(' ');

            heading.innerHTML = words.map((word, wordIndex) => {
                const chars = word.split('').map((char, charIndex) => {
                    const delay = (wordIndex * 50) + (charIndex * 30);
                    return `<span class="char" style="animation-delay: ${delay}ms">${char}</span>`;
                }).join('');
                return `<span class="word">${chars}</span>`;
            }).join(' ');

            heading.classList.add('reveal-text');
        });
    }

    // ========================
    // PARALLAX EFFECTS
    // ========================
    initParallax() {
        const parallaxElements = document.querySelectorAll('.about-photo, .project-card__image');

        parallaxElements.forEach(el => {
            el.classList.add('parallax-element');
        });

        // Mouse-based parallax for hero images
        document.addEventListener('mousemove', (e) => {
            const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
            const moveY = (e.clientY - window.innerHeight / 2) * 0.01;

            document.querySelectorAll('.about-photo').forEach(el => {
                el.style.transform = `translate(${moveX}px, ${moveY}px) scale(1)`;
            });
        }, { passive: true });
    }

    // ========================
    // IMAGE HOVER EFFECTS
    // ========================
    initImageHoverEffects() {
        const projectCards = document.querySelectorAll('.project-card');

        projectCards.forEach(card => {
            const image = card.querySelector('.project-card__image');
            if (!image) return;

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;

                image.style.transform = `scale(1.05) translate(${x * 10}px, ${y * 10}px)`;
            });

            card.addEventListener('mouseleave', () => {
                image.style.transform = 'scale(1) translate(0, 0)';
            });
        });
    }

    // ========================
    // ANIMATION LOOP
    // ========================
    animate() {
        // Smooth cursor follow
        if (this.cursor) {
            this.currentX += (this.targetX - this.currentX) * 0.15;
            this.currentY += (this.targetY - this.currentY) * 0.15;

            this.cursor.style.left = `${this.currentX}px`;
            this.cursor.style.top = `${this.currentY}px`;
        }

        // Scroll-based effects
        const scrollDelta = this.scrollY - this.lastScrollY;
        this.lastScrollY = this.scrollY;

        // Subtle rotation based on scroll velocity
        if (this.cursor && Math.abs(scrollDelta) > 1) {
            this.cursor.style.transform = `translate(-50%, -50%) scaleY(${1 + Math.min(Math.abs(scrollDelta) * 0.01, 0.3)})`;
        }

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for page transition
    setTimeout(() => {
        new InteractiveEffects();
    }, 100);
});

// Also initialize on Astro page transitions
document.addEventListener('astro:page-load', () => {
    new InteractiveEffects();
});
