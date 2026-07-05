/**
 * ═══════════════════════════════════════════════════════════════
 * ANIMATIONS.JS - Advanced UI Animation System
 * ═══════════════════════════════════════════════════════════════
 */

const Animations = {
    /**
     * Initialize all animations
     */
    init() {
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupLoadingAnimations();
        this.setupCounterAnimations();
        this.setupParticleEffects();
    },

    /**
     * Fade in elements on scroll
     */
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all cards and sections
        document.querySelectorAll('.stat-card, .glass-card, .hologram-card, .neon-card').forEach(el => {
            observer.observe(el);
        });
    },

    /**
     * Setup hover effects with transitions
     */
    setupHoverEffects() {
        // Card tilt effect
        document.querySelectorAll('.stat-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            });
        });

        // Ripple effect on buttons
        document.querySelectorAll('.neon-button, .glass-button, .hologram-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');
                
                button.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });
    },

    /**
     * Animated loading states
     */
    setupLoadingAnimations() {
        window.showLoading = (container) => {
            const loader = document.createElement('div');
            loader.className = 'hologram-loading';
            loader.id = 'dynamic-loader';
            container.appendChild(loader);
        };

        window.hideLoading = () => {
            const loader = document.getElementById('dynamic-loader');
            if (loader) {
                loader.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => loader.remove(), 300);
            }
        };
    },

    /**
     * Animated number counters
     */
    setupCounterAnimations() {
        window.animateCounter = (element, target, duration = 2000, suffix = '') => {
            const start = 0;
            const increment = target / (duration / 16);
            let current = start;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                element.textContent = Math.floor(current) + suffix;
            }, 16);
        };
    },

    /**
     * Particle system for backgrounds
     */
    setupParticleEffects() {
        window.createParticles = (container, count = 50) => {
            const particles = document.createElement('div');
            particles.className = 'hologram-particles';
            
            for (let i = 0; i < count; i++) {
                const particle = document.createElement('div');
                particle.className = 'hologram-particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
                particle.style.animationDelay = (Math.random() * 2) + 's';
                particles.appendChild(particle);
            }
            
            container.appendChild(particles);
        };
    },

    /**
     * Smooth scroll to element
     */
    smoothScrollTo(element, duration = 1000) {
        const targetPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    },

    /**
     * Typewriter effect
     */
    typeWriter(element, text, speed = 50) {
        let i = 0;
        element.textContent = '';
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    },

    /**
     * Glitch effect
     */
    glitchEffect(element, duration = 300) {
        element.classList.add('hologram-glitch');
        setTimeout(() => {
            element.classList.remove('hologram-glitch');
        }, duration);
    },

    /**
     * Progress bar animation
     */
    animateProgress(progressBar, target, duration = 1000) {
        let current = 0;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            progressBar.style.width = current + '%';
        }, 16);
    },

    /**
     * Flash notification
     */
    flashNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `glass-alert glass-alert-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            min-width: 300px;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    },

    /**
     * Pulse element
     */
    pulse(element, count = 3) {
        let pulseCount = 0;
        const interval = setInterval(() => {
            element.style.transform = 'scale(1.1)';
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 200);
            
            pulseCount++;
            if (pulseCount >= count) clearInterval(interval);
        }, 400);
    },

    /**
     * Shake element
     */
    shake(element, duration = 500) {
        element.style.animation = `shake ${duration}ms ease`;
        setTimeout(() => {
            element.style.animation = '';
        }, duration);
    },

    /**
     * Fade in element
     */
    fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        let opacity = 0;
        const increment = 16 / duration;
        
        const timer = setInterval(() => {
            opacity += increment;
            if (opacity >= 1) {
                opacity = 1;
                clearInterval(timer);
            }
            element.style.opacity = opacity;
        }, 16);
    },

    /**
     * Fade out element
     */
    fadeOut(element, duration = 300) {
        let opacity = 1;
        const decrement = 16 / duration;
        
        const timer = setInterval(() => {
            opacity -= decrement;
            if (opacity <= 0) {
                opacity = 0;
                element.style.display = 'none';
                clearInterval(timer);
            }
            element.style.opacity = opacity;
        }, 16);
    },

    /**
     * Slide in from direction
     */
    slideIn(element, direction = 'left', duration = 300) {
        const translations = {
            left: 'translateX(-100%)',
            right: 'translateX(100%)',
            top: 'translateY(-100%)',
            bottom: 'translateY(100%)'
        };
        
        element.style.transform = translations[direction];
        element.style.display = 'block';
        
        setTimeout(() => {
            element.style.transition = `transform ${duration}ms ease`;
            element.style.transform = 'translate(0, 0)';
        }, 10);
    },

    /**
     * Matrix rain effect
     */
    createMatrixRain(container) {
        const chars = '01';
        const fontSize = 14;
        const columns = Math.floor(container.offsetWidth / fontSize);
        
        const matrix = document.createElement('div');
        matrix.className = 'hologram-matrix';
        
        for (let i = 0; i < columns; i++) {
            const column = document.createElement('div');
            column.style.position = 'absolute';
            column.style.left = (i * fontSize) + 'px';
            
            for (let j = 0; j < 20; j++) {
                const char = document.createElement('div');
                char.className = 'hologram-matrix-char';
                char.textContent = chars[Math.floor(Math.random() * chars.length)];
                char.style.animationDuration = (Math.random() * 2 + 1) + 's';
                char.style.animationDelay = (Math.random() * 2) + 's';
                column.appendChild(char);
            }
            
            matrix.appendChild(column);
        }
        
        container.appendChild(matrix);
    },

    /**
     * Neon pulse animation
     */
    neonPulse(element, color = '#00ffff', duration = 2000) {
        element.style.animation = `neonPulse ${duration}ms infinite`;
        element.style.setProperty('--neon-color', color);
    }
};

// CSS for additional animations
const animationStyles = `
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }

    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }

    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: rippleEffect 0.6s linear;
        pointer-events: none;
    }

    @keyframes rippleEffect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    .animate-fade-in {
        animation: fadeIn 0.6s ease;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

// Inject animation styles
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);

// Initialize animations when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Animations.init());
} else {
    Animations.init();
}

// Export for use in other modules
window.Animations = Animations;