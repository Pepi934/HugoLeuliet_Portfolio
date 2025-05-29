document.addEventListener('DOMContentLoaded', function() {
    // Menu toggle functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        sidebar.classList.toggle('active');
    });

    // Submenu toggle functionality
    const menuItems = document.querySelectorAll('.has-submenu');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Check if the click was on the submenu
            if (e.target.tagName === 'LI' && e.target.parentElement.classList.contains('submenu')) {
                return;
            }
            
            // Close other open submenus
            if (!this.classList.contains('active')) {
                menuItems.forEach(otherItem => {
                    if (otherItem !== this) {
                        otherItem.classList.remove('active');
                        otherItem.querySelector('.submenu').classList.remove('active');
                    }
                });
            }
            
            this.classList.toggle('active');
            const submenu = this.querySelector('.submenu');
            submenu.classList.toggle('active');
        });
    });

    // Content switching functionality
    const contentItems = document.querySelectorAll('[data-content]');
    const contents = document.querySelectorAll('.content');
    const defaultContent = document.querySelector('.content.active');
    
    contentItems.forEach(item => {
        item.addEventListener('click', function() {
            // If it's a submenu item, get the data-content attribute
            const contentId = this.getAttribute('data-content');
            
            // Hide all contents
            contents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Show the selected content
            document.getElementById(contentId).classList.add('active');
            
            // Close the mobile menu if open
            if (window.innerWidth <= 992) {
                menuToggle.classList.remove('active');
                sidebar.classList.remove('active');
            }
        });
    });

document.querySelectorAll('.audio-player').forEach(player => {
    const audio = player.querySelector('.music-player');
    const playBtn = player.querySelector('.play-btn');
    const pauseBtn = player.querySelector('.pause-btn');
    const progressBar = player.querySelector('.progress-bar');
    const progress = player.querySelector('.progress');
    const currentTimeEl = player.querySelector('.current-time');
    const durationEl = player.querySelector('.duration');
    const volumeSlider = player.querySelector('.volume-slider');
    const volumeBtn = player.querySelector('.volume-btn');

    // Play
    playBtn.addEventListener('click', () => {
        // Pause all other players
        document.querySelectorAll('.audio-player audio').forEach(a => {
            if (a !== audio) {
                a.pause();
                a.currentTime = 0;
                a.parentElement.querySelector('.play-btn').classList.remove('hidden');
                a.parentElement.querySelector('.pause-btn').classList.add('hidden');
            }
        });
        audio.play();
        playBtn.classList.add('hidden');
        pauseBtn.classList.remove('hidden');
    });

    // Pause
    pauseBtn.addEventListener('click', () => {
        audio.pause();
        playBtn.classList.remove('hidden');
        pauseBtn.classList.add('hidden');
    });

    // Update progress
    audio.addEventListener('timeupdate', () => {
        const percent = (audio.currentTime / audio.duration) * 100;
        progress.style.width = percent + '%';
        currentTimeEl.textContent = formatTime(audio.currentTime);
    });

    // Set duration
    audio.addEventListener('loadedmetadata', () => {
        durationEl.textContent = formatTime(audio.duration);
    });

    // Seek
    progressBar.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percent = x / rect.width;
        audio.currentTime = percent * audio.duration;
    });

    // Volume
    volumeSlider.addEventListener('input', () => {
        audio.volume = volumeSlider.value;
    });

    // Mute/unmute
    volumeBtn.addEventListener('click', () => {
        audio.muted = !audio.muted;
        volumeBtn.innerHTML = audio.muted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
    });

    // Reset on end
    audio.addEventListener('ended', () => {
        playBtn.classList.remove('hidden');
        pauseBtn.classList.add('hidden');
        progress.style.width = '0%';
        currentTimeEl.textContent = '0:00';
    });

    // Helper
    function formatTime(sec) {
        if (isNaN(sec)) return '0:00';
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }

    // Pour gérer le changement d'état si l'utilisateur utilise les contrôles natifs
    audio.addEventListener('play', () => {
        playBtn.classList.add('hidden');
        pauseBtn.classList.remove('hidden');
    });
    audio.addEventListener('pause', () => {
        pauseBtn.classList.add('hidden');
        playBtn.classList.remove('hidden');
    });
});

    // Form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Message envoyé! Merci pour votre contact.');
            this.reset();
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Close submenus when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.sidebar') && !e.target.closest('.menu-toggle')) {
            menuToggle.classList.remove('active');
            sidebar.classList.remove('active');
        }
    });

    // Dark Mode Toggle
const darkModeToggle = document.getElementById('dark-mode-toggle');
const htmlElement = document.documentElement;

// Vérifier le mode au chargement
if (localStorage.getItem('darkMode') === 'true') {
    htmlElement.classList.add('dark-mode');
}

// Basculer le mode sombre
darkModeToggle.addEventListener('click', () => {
    htmlElement.classList.toggle('dark-mode');
    const isDark = htmlElement.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);

    // Mettre à jour l'icône
    document.querySelector('.fa-moon').classList.toggle('hidden', isDark);
    document.querySelector('.fa-sun').classList.toggle('hidden', !isDark);
});

// Synchroniser avec la préférence système
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('darkMode')) {
        htmlElement.classList.toggle('dark-mode', e.matches);
    }
});

// Lightbox pour les galeries
document.querySelectorAll('.gallery img').forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', function () {
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = lightbox.querySelector('.lightbox-img');
        const lightboxCaption = lightbox.querySelector('.lightbox-caption');
        lightboxImg.src = this.src;
        lightboxImg.alt = this.alt;
        lightboxCaption.textContent = this.getAttribute('data-caption') || this.alt || '';
        lightbox.classList.add('active');
        document.body.classList.add('lightbox-open');
    });
});

document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
document.getElementById('lightbox').addEventListener('click', function(e) {
    if (e.target === this) closeLightbox();
});
function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
    document.body.classList.remove('lightbox-open');
}
});


