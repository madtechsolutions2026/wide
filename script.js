// WIDE FILM - Interactive JavaScript Engine

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize AOS Animations
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 80,
            easing: 'ease-out-cubic'
        });
    }

    // 2. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // 3. Ambient Gold Dust Particle Animation
    initAmbientCanvas();

    // 4. Gallery Category Filtering
    initGalleryFilter();

    // 5. Quote Calculator Live Update
    initEstimator();
});

// Ambient Particles Canvas
function initAmbientCanvas() {
    const canvas = document.getElementById('ambientCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const numParticles = Math.min(width > 768 ? 45 : 20, 60);

    for (let i = 0; i < numParticles; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2 + 0.5,
            vx: (Math.random() - 0.5) * 0.3,
            vy: -Math.random() * 0.4 - 0.1,
            alpha: Math.random() * 0.6 + 0.2,
            gold: Math.random() > 0.3 ? '#DFC180' : '#F3E7C4'
        });
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.gold;
            ctx.globalAlpha = p.alpha;
            ctx.fill();

            p.x += p.vx;
            p.y += p.vy;

            if (p.y < 0) {
                p.y = height + 10;
                p.x = Math.random() * width;
            }
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
        });

        requestAnimationFrame(draw);
    }

    draw();
}

// Video Playback Controls
function toggleVideoPlay(videoId, btn) {
    const video = document.getElementById(videoId);
    if (!video) return;

    if (video.paused) {
        video.play();
        if (btn) {
            btn.innerHTML = '<i class="fa-solid fa-pause text-xs"></i> <span>Pause</span>';
            btn.classList.add('bg-white', 'text-black');
        }
    } else {
        video.pause();
        if (btn) {
            btn.innerHTML = '<i class="fa-solid fa-play text-xs"></i> <span>Play Film</span>';
            btn.classList.remove('bg-white', 'text-black');
        }
    }
}

function toggleMute(videoId, btn) {
    const video = document.getElementById(videoId);
    if (!video) return;

    video.muted = !video.muted;
    if (video.muted) {
        btn.innerHTML = '<i class="fa-solid fa-volume-xmark text-sm"></i>';
    } else {
        btn.innerHTML = '<i class="fa-solid fa-volume-high text-sm"></i>';
    }
}

// Video Lightbox Modal
function openVideoModal(src, title) {
    const modal = document.getElementById('videoModal');
    const player = document.getElementById('modalVideoPlayer');
    const titleEl = document.getElementById('modalVideoTitle');

    if (modal && player) {
        player.src = src;
        titleEl.textContent = title || 'WIDE FILM Cinematic Showcase';
        modal.classList.remove('hidden');
        player.play();
    }
}

function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    const player = document.getElementById('modalVideoPlayer');
    if (modal && player) {
        player.pause();
        player.src = '';
        modal.classList.add('hidden');
    }
}

// Photo Lightbox
function openLightbox(src, title, subtitle) {
    const lightbox = document.getElementById('photoLightbox');
    const img = document.getElementById('lightboxImg');
    const titleEl = document.getElementById('lightboxTitle');
    const subtitleEl = document.getElementById('lightboxSubtitle');

    if (lightbox && img) {
        img.src = src;
        titleEl.textContent = title || '';
        subtitleEl.textContent = subtitle || '';
        lightbox.classList.remove('hidden');
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('photoLightbox');
    if (lightbox) {
        lightbox.classList.add('hidden');
    }
}

// Close modals on Escape key or outside click
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeVideoModal();
        closeLightbox();
    }
});

// Gallery Filter Logic
function initGalleryFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Interactive Estimate Calculator
function initEstimator() {
    const form = document.getElementById('estimatorForm');
    if (!form) return;

    const eventInputs = form.querySelectorAll('input[name="eventType"]');
    const drone = document.getElementById('addonDrone');
    const album = document.getElementById('addonAlbum');
    const reel = document.getElementById('addonReel');
    const summaryEl = document.getElementById('estimateResultSummary');

    function updateSummary() {
        let selectedEvent = '1-Day Wedding';
        eventInputs.forEach(input => {
            if (input.checked) selectedEvent = input.value;
        });

        const addons = [];
        if (drone && drone.checked) addons.push('Drone');
        if (album && album.checked) addons.push('Heirloom Album');
        if (reel && reel.checked) addons.push('Same-Day Reel');

        let summaryText = selectedEvent;
        if (addons.length > 0) {
            summaryText += ' + ' + addons.join(' + ');
        }

        if (summaryEl) {
            summaryEl.textContent = summaryText;
        }
    }

    eventInputs.forEach(i => i.addEventListener('change', updateSummary));
    if (drone) drone.addEventListener('change', updateSummary);
    if (album) album.addEventListener('change', updateSummary);
    if (reel) reel.addEventListener('change', updateSummary);

    updateSummary();
}

// Send WhatsApp Estimate
function sendWhatsAppEstimate() {
    const summaryEl = document.getElementById('estimateResultSummary');
    const summary = summaryEl ? summaryEl.textContent : 'Custom Wedding Package';

    const message = `Hi WIDE FILM! 📸✨%0A%0AI used your website estimator and would like to check availability and get an exact quote for:%0A👉 *${summary}*%0A%0ALocation: Hyderabad / Destination%0APlease let me know your open dates!`;
    const whatsappUrl = `https://wa.me/919665351481?text=${message}`;
    window.open(whatsappUrl, '_blank');
}

// Form Submission with Direct WhatsApp Connect
function submitInquiryForm(e) {
    e.preventDefault();

    const name = document.getElementById('formName').value;
    const phone = document.getElementById('formPhone').value;
    const date = document.getElementById('formDate').value;
    const location = document.getElementById('formLocation').value;
    const service = document.getElementById('formService').value;
    const notes = document.getElementById('formNotes').value;

    const successMsg = document.getElementById('formSuccessMessage');
    if (successMsg) successMsg.classList.remove('hidden');

    const formattedMessage = `*NEW WEDDING INQUIRY - WIDE FILM* 💍✨%0A%0A` +
        `👤 *Client Name:* ${encodeURIComponent(name)}%0A` +
        `📞 *Phone/WhatsApp:* ${encodeURIComponent(phone)}%0A` +
        `📅 *Event Date:* ${encodeURIComponent(date)}%0A` +
        `📍 *Venue / Location:* ${encodeURIComponent(location)}%0A` +
        `🎬 *Package / Service:* ${encodeURIComponent(service)}%0A` +
        (notes ? `📝 *Notes:* ${encodeURIComponent(notes)}%0A` : '') +
        `%0A_Sent via WIDE FILM official website._`;

    const whatsappUrl = `https://wa.me/919665351481?text=${formattedMessage}`;

    setTimeout(() => {
        window.open(whatsappUrl, '_blank');
    }, 600);
}
