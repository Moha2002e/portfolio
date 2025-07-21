// Effet bulles dynamiques modernes sur canvas 2D

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('bg');
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Paramètres des bulles
    const BUBBLE_COUNT = 40;
    const COLORS = [
        'rgba(0, 255, 255, 0.25)', // cyan
        'rgba(0, 200, 255, 0.18)', // bleu clair
        'rgba(255, 255, 255, 0.15)', // blanc
        'rgba(0, 150, 255, 0.22)', // bleu
        'rgba(0, 255, 200, 0.18)'
    ];

    // Générer les bulles
    const bubbles = Array.from({ length: BUBBLE_COUNT }, () => {
        const radius = Math.random() * 60 + 30;
        return {
            baseX: Math.random() * width,
            baseY: Math.random() * height,
            x: 0, // position courante
            y: 0,
            radius,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            speed: Math.random() * 0.5 + 0.2,
            offset: Math.random() * 1000
        };
    });

    // Initialiser la position courante
    bubbles.forEach(b => {
        b.x = b.baseX;
        b.y = b.baseY;
    });

    // Animation des bulles
    function animateBubbles(scrollY) {
        ctx.clearRect(0, 0, width, height);
        bubbles.forEach((b, i) => {
            // Calcul du déplacement selon le scroll
            const move = Math.sin((scrollY / 200) + b.offset) * 60 * b.speed;
            const moveY = Math.cos((scrollY / 180) + b.offset) * 40 * b.speed;
            // Interpolation pour retour fluide
            b.x += ((b.baseX + move) - b.x) * 0.08;
            b.y += ((b.baseY + moveY) - b.y) * 0.08;
            // Dessiner la bulle
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
            ctx.fillStyle = b.color;
            ctx.fill();
        });
    }

    // Gestion du scroll
    let lastScroll = window.scrollY;
    function onScroll() {
        lastScroll = window.scrollY;
    }
    window.addEventListener('scroll', onScroll);

    // Responsive
    window.addEventListener('resize', () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        bubbles.forEach(b => {
            b.baseX = Math.random() * width;
            b.baseY = Math.random() * height;
        });
    });

    // Boucle d'animation
    function loop() {
        animateBubbles(lastScroll);
        requestAnimationFrame(loop);
    }
    loop();

    // Lightbox pour images de projet
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    document.querySelectorAll('img[data-lightbox="true"]').forEach(img => {
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightbox.classList.remove('hidden');
        });
    });
    function closeLightbox() {
        lightbox.classList.add('hidden');
        lightboxImg.src = '';
    }
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Masquer le loader futuriste quand la page est chargée
    const loaderStart = Date.now();
    window.addEventListener('load', () => {
        const loader = document.getElementById('loader');
        const elapsed = Date.now() - loaderStart;
        const minDuration = 1500; // 3 secondes
        const hideLoader = () => {
            if (loader) {
                loader.style.opacity = '0';
                loader.style.pointerEvents = 'none';
                setTimeout(() => loader.style.display = 'none', 600);
            }
        };
        if (elapsed < minDuration) {
            setTimeout(hideLoader, minDuration - elapsed);
        } else {
            hideLoader();
        }
    });

    // Gestion du formulaire de contact moderne
    const contactForm = document.querySelector('#contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            const successMsg = document.getElementById('contact-success');
            successMsg.classList.add('hidden');
            try {
                const res = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, message })
                });
                const data = await res.json();
                if (data.success) {
                    successMsg.textContent = 'Merci pour votre message !';
                    successMsg.classList.remove('hidden');
                    contactForm.reset();
                } else {
                    successMsg.textContent = data.error || 'Erreur lors de l\'envoi.';
                    successMsg.classList.remove('hidden');
                    successMsg.classList.add('text-red-400');
                }
            } catch (err) {
                successMsg.textContent = 'Erreur lors de l\'envoi.';
                successMsg.classList.remove('hidden');
                successMsg.classList.add('text-red-400');
            }
            setTimeout(() => {
                successMsg.classList.add('hidden');
                successMsg.classList.remove('text-red-400');
            }, 4000);
        });
    }
}); 