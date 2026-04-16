// ===== Ember Particle System =====
const canvas = document.getElementById('ember-canvas');
const ctx = canvas.getContext('2d');
let embers = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Ember {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 10;
        this.size = Math.random() * 3 + 1;
        this.speedY = -(Math.random() * 1.5 + 0.3);
        this.speedX = (Math.random() - 0.5) * 0.8;
        this.opacity = Math.random() * 0.7 + 0.3;
        this.fadeRate = Math.random() * 0.003 + 0.001;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = Math.random() * 0.03 + 0.01;
        // Colors: orange to gold
        const colors = [
            [255, 106, 0],
            [232, 115, 42],
            [200, 168, 78],
            [255, 157, 0],
            [255, 200, 50],
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.wobble += this.wobbleSpeed;
        this.x += this.speedX + Math.sin(this.wobble) * 0.3;
        this.y += this.speedY;
        this.opacity -= this.fadeRate;

        if (this.opacity <= 0 || this.y < -20) {
            this.reset();
        }
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = `rgb(${this.color[0]}, ${this.color[1]}, ${this.color[2]})`;
        ctx.shadowColor = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, 0.5)`;
        ctx.shadowBlur = this.size * 3;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Create embers
const EMBER_COUNT = 35;
for (let i = 0; i < EMBER_COUNT; i++) {
    const ember = new Ember();
    ember.y = Math.random() * canvas.height; // Start spread out
    embers.push(ember);
}

function animateEmbers() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    embers.forEach(ember => {
        ember.update();
        ember.draw();
    });
    requestAnimationFrame(animateEmbers);
}
animateEmbers();

// ===== Navbar scroll effect =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== Mobile menu toggle =====
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = navToggle.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
    }
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
    });
});

// ===== Scroll Reveal =====
const revealElements = document.querySelectorAll('section:not(#hero), .souls-panel, .stat-category, .item-card, .lore-item, .summon-card');
revealElements.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger the animation slightly
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 80);
            }
        });
    },
    { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
);

revealElements.forEach(el => revealObserver.observe(el));

// ===== Stat Bar Fill Animation =====
const statRows = document.querySelectorAll('.stat-row');
const statObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    },
    { threshold: 0.3 }
);

statRows.forEach(row => statObserver.observe(row));

// ===== Bonfire mouse interaction =====
const bonfire = document.querySelector('.bonfire');
if (bonfire) {
    document.addEventListener('mousemove', (e) => {
        const rect = bonfire.getBoundingClientRect();
        const bonfireX = rect.left + rect.width / 2;
        const bonfireY = rect.top + rect.height / 2;
        const dx = e.clientX - bonfireX;
        const dy = e.clientY - bonfireY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 300) {
            const intensity = 1 - (distance / 300);
            const glow = bonfire.querySelector('.bonfire-glow');
            if (glow) {
                glow.style.opacity = 0.7 + intensity * 0.5;
                glow.style.transform = `translateX(-50%) scale(${1 + intensity * 0.3})`;
            }
        }
    });
}

// ===== Item card hover glow effect =====
document.querySelectorAll('.item-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(200, 168, 78, 0.04) 0%, var(--bg-card) 50%)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.background = '';
    });
});

// ===== Parallax on hero =====
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const hero = document.querySelector('.hero-content');
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.15}px)`;
        hero.style.opacity = 1 - (scrolled / (window.innerHeight * 0.8));
    }
});

// ===== Nav active link highlight =====
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 100;
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav-links a[href="#${id}"]`);
        if (link) {
            if (scrollPos >= top && scrollPos < top + height) {
                link.style.color = 'var(--gold)';
            } else {
                link.style.color = '';
            }
        }
    });
});
