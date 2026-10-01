const navbar = document.querySelector('.navbar');
const education = document.querySelector('#education');
const progress = document.querySelector('.scroll-progress');
const fadeItems = document.querySelectorAll(
    '.content section > .titlewhite,' +
    '.content section > .paragraph,' +
    '.content section > .figure,' +
    '.content section > .titlegray,' +
    '.content section > .education-list,' +
    '.content section > .skills-container,' +
    '.content section > .featured-project-card,' +
    '.content section > .experience-card,' +
    '.content section > .contact-links,' +
    '.content footer > *'
);
const navLinks = [...document.querySelectorAll('.navbar a')];
const sections = [...document.querySelectorAll('.content section[id]')];
const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

const ambients = {
    one: document.querySelector('.ambient-one'),
    two: document.querySelector('.ambient-two'),
    three: document.querySelector('.ambient-three'),
    four: document.querySelector('.ambient-four')
};

document.documentElement.classList.add('js-ready');

fadeItems.forEach((item, index) => {
    item.classList.add('fade-in');
    item.style.setProperty('--fade-delay', `${Math.min((index % 4) * 70, 210)}ms`);
});

function updateScrollUI() {
    const scrollTop = window.scrollY;
    const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const percentage = (scrollTop / maxScroll) * 100;
    const progressAmount = Math.min(percentage, 100);

    if (progress) progress.style.width = `${progressAmount}%`;

    if (navbar && education) {
        navbar.classList.toggle('transparent', scrollTop > education.offsetTop - 80);
    }

    if (reduceMotion) return;

    const t = scrollTop / Math.max(window.innerHeight, 1);
    const p = progressAmount / 100;

    if (ambients.one) {
        ambients.one.style.transform = `translate3d(${Math.sin(t * 0.9) * 26}px, ${t * 55}px, 0) scale(${1 + p * 0.10})`;
        ambients.one.style.opacity = `${0.24 + p * 0.08}`;
    }
    if (ambients.two) {
        ambients.two.style.transform = `translate3d(${Math.cos(t * 0.7) * -34}px, ${-t * 40}px, 0) scale(${1.02 + p * 0.10})`;
        ambients.two.style.opacity = `${0.20 + p * 0.07}`;
    }
    if (ambients.three) {
        ambients.three.style.transform = `translate3d(${Math.sin(t * 0.55 + 1.4) * 48}px, ${-t * 70}px, 0) scale(${0.98 + p * 0.16})`;
        ambients.three.style.opacity = `${0.11 + p * 0.05}`;
    }
    if (ambients.four) {
        ambients.four.style.transform = `translate3d(${Math.cos(t * 0.8) * 24}px, ${t * 88}px, 0) scale(${0.96 + p * 0.12})`;
        ambients.four.style.opacity = `${0.09 + p * 0.04}`;
    }
}

let ticking = false;
window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
        updateScrollUI();
        ticking = false;
    });
}, { passive: true });
updateScrollUI();

if ('IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -50px 0px'
    });

    fadeItems.forEach(item => fadeObserver.observe(item));
} else {
    fadeItems.forEach(item => item.classList.add('is-visible'));
}

if ('IntersectionObserver' in window && sections.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
        const visible = entries
            .filter(entry => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.toggle('active', href === `#${visible.target.id}`);
        });
    }, {
        threshold: [0.15, 0.35, 0.6],
        rootMargin: '-18% 0px -60% 0px'
    });

    sections.forEach(section => sectionObserver.observe(section));
}


if (reduceMotion) {
    Object.values(ambients).forEach(ambient => {
        if (ambient) ambient.style.animation = 'none';
    });
}
