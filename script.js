// ===========================
// 1. LOADER (préchargement images)
// ===========================
function preloadImages(callback) {
    const images = Array.from(document.images);
    const extraSrcs = [
        // Ajoute ici les images chargées dynamiquement ou en JS si besoin
    ];
    extraSrcs.forEach(src => {
        const img = new Image();
        img.src = src;
        images.push(img);
    });

    let loaded = 0;
    const total = images.length;
    if (total === 0) callback();

    images.forEach(img => {
        if (img.complete) {
            loaded++;
            if (loaded === total) callback();
        } else {
            img.addEventListener('load', () => {
                loaded++;
                if (loaded === total) callback();
            });
            img.addEventListener('error', () => {
                loaded++;
                if (loaded === total) callback();
            });
        }
    });
}

// ===========================
// 2. DOMContentLoaded : Initialisation globale
// ===========================
document.addEventListener('DOMContentLoaded', function() {
    const intro = document.getElementById('intro-animation');
    const loader = document.getElementById('loader');
    const container = document.querySelector('.container');

    // Synchronisation intro + loader
    let introDone = false;
    let loaderDone = false;

    function showSite() {
        if (introDone && loaderDone) {
            container.style.display = '';
        }
    }

    // Intro animée (5s)
    if (intro && container) {
        container.style.display = 'none';
        setTimeout(() => {
            intro.style.opacity = 0;
            intro.style.pointerEvents = 'none';
            setTimeout(() => {
                intro.style.display = 'none';
                introDone = true;
                showSite();
            }, 700); // correspond à la durée du transition: opacity
        }, 5000); // 5 secondes d'animation
    } else {
        introDone = true;
    }

    // Loader (max 3s)
    if (loader && container) {
        loader.style.display = 'flex';
        let finished = false;
        function finishLoading() {
            if (finished) return;
            finished = true;
            loader.style.opacity = 0;
            setTimeout(() => {
                loader.style.display = 'none';
                loaderDone = true;
                showSite();
            }, 500);
        }
        setTimeout(finishLoading, 3000);
        preloadImages(finishLoading);
    } else {
        loaderDone = true;
    }

    // 2.2 Menu burger & sidebar responsive
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            sidebar.classList.toggle('active');
        });
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.sidebar') && !e.target.closest('.menu-toggle')) {
                menuToggle.classList.remove('active');
                sidebar.classList.remove('active');
            }
        });
    }

    // 2.3 Sous-menus sidebar
    const menuItems = document.querySelectorAll('.has-submenu');
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (e.target.tagName === 'LI' && e.target.parentElement.classList.contains('submenu')) return;
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

    // 2.4 Navigation entre rubriques (content switching)
    const contentItems = document.querySelectorAll('[data-content]');
    const contents = document.querySelectorAll('.content');
    contentItems.forEach(item => {
        item.addEventListener('click', function() {
            const contentId = this.getAttribute('data-content');
            contents.forEach(content => content.classList.remove('active'));
            document.getElementById(contentId).classList.add('active');
            // Scroll en haut du content-area
            const contentArea = document.querySelector('.content-area');
            if (contentArea) {
                contentArea.scrollTo({ top: 0, behavior: 'smooth' });
            }
            if (window.innerWidth <= 992 && menuToggle && sidebar) {
                menuToggle.classList.remove('active');
                sidebar.classList.remove('active');
            }
        });
    });

    

    // 2.6 Formulaire de contact (alerte) - à désactiver si tu utilises Formspree
    // const contactForm = document.querySelector('.contact-form');
    // if (contactForm) {
    //     contactForm.addEventListener('submit', function(e) {
    //         e.preventDefault();
    //         alert('Message envoyé! Merci pour votre contact.');
    //         this.reset();
    //     });
    // }

    // 2.7 Smooth scroll pour les liens internes
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

    // 2.8 Dark mode (init, toggle, synchro système)
    const htmlElement = document.documentElement;
    if (localStorage.getItem('darkMode') === 'true') {
        htmlElement.classList.add('dark-mode');
    }
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            htmlElement.classList.toggle('dark-mode');
            const isDark = htmlElement.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDark);
            document.querySelector('.fa-moon').classList.toggle('hidden', isDark);
            document.querySelector('.fa-sun').classList.toggle('hidden', !isDark);
            setTimeout(updateIntroForMode, 10);
        });
    }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('darkMode')) {
            htmlElement.classList.toggle('dark-mode', e.matches);
            setTimeout(updateIntroForMode, 10);
        }
    });

    // 2.9 Lightbox (galeries, WebApp, Estafette Gourmande)
    function openLightbox(src, alt, caption) {
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = lightbox.querySelector('.lightbox-img');
        const lightboxCaption = lightbox.querySelector('.lightbox-caption');
        lightboxImg.src = src;
        lightboxImg.alt = alt;
        lightboxCaption.textContent = caption || alt || '';
        lightbox.classList.add('active');
        document.body.classList.add('lightbox-open');
    }
    document.querySelectorAll('.gallery img, .lightbox-trigger').forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', function () {
            openLightbox(
                this.src,
                this.alt,
                this.getAttribute('data-caption') || this.alt
            );
        });
    });
    document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    document.getElementById('lightbox').addEventListener('click', function(e) {
        if (e.target === this) closeLightbox();
    });

    // 2.10 Accueil sur clic du nom
    const nameEl = document.querySelector('.name');
    if (nameEl) {
        nameEl.addEventListener('click', function() {
            document.querySelectorAll('.content').forEach(el => el.classList.remove('active'));
            document.getElementById('default').classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 2.11 Découvrir : clic sur une miniature => affiche la rubrique correspondante
    document.querySelectorAll('.discover-item').forEach(item => {
        item.addEventListener('click', function() {
            const rubrique = this.getAttribute('data-rubrique');
            if (rubrique) {
                document.querySelectorAll('.content').forEach(el => el.classList.remove('active'));
                const target = document.getElementById(rubrique);
                if (target) {
                    target.classList.add('active');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }
        });
    });

    // Intro animation : adapte image et texte selon le mode
    function updateIntroForMode() {
        const isDark = document.documentElement.classList.contains('dark-mode');
        const introImg = document.getElementById('intro-signature-img');
        const introText = document.getElementById('intro-text');
        const aboutImg = document.getElementById('about-signature-img');
        if (introImg) {
            introImg.src = isDark ? 'Image/signature/whitesign.png' : 'Image/signature/sign.png';
        }
        if (introText) {
            introText.style.color = isDark ? '#fff' : '#111';
        }
        if (aboutImg) {
            aboutImg.src = isDark ? 'Image/signature/whitesign.png' : 'Image/signature/sign.png';
        }
    }
    updateIntroForMode();

    // Music streaming player logic
    document.querySelectorAll('#glaneurs-musique .music-track').forEach(track => {
        const audio = track.querySelector('.music-player');
        const playBtn = track.querySelector('.play-btn');
        const pauseBtn = track.querySelector('.pause-btn');
        const volumeSlider = track.querySelector('.volume-slider');
        const volumeBtn = track.querySelector('.volume-btn');
        const shareBtn = track.querySelector('.share-btn');

        const progressBar = track.querySelector('.progress-bar');
        const progress = track.querySelector('.progress');
        const progressHandle = track.querySelector('.progress-handle');
        const currentTimeEl = track.querySelector('.current-time');
        const durationEl = track.querySelector('.duration');
        
        function formatTime(sec) {
            if (isNaN(sec)) return '0:00';
            const m = Math.floor(sec / 60);
            const s = Math.floor(sec % 60).toString().padStart(2, '0');
            return `${m}:${s}`;
        }

        // Play/pause logic
        playBtn.addEventListener('click', () => {
            // Pause all other tracks before playing the new one
            document.querySelectorAll('#glaneurs-musique .music-player').forEach(otherAudio => {
                if (otherAudio !== audio) {
                    otherAudio.pause();
                }
            });
            audio.play();
        });

        pauseBtn.addEventListener('click', () => {
            audio.pause();
        });

        // Update UI based on audio events
        audio.addEventListener('play', () => {
            playBtn.classList.add('hidden');
            pauseBtn.classList.remove('hidden');
            track.classList.add('active-track');
        });

        audio.addEventListener('pause', () => {
            pauseBtn.classList.add('hidden');
            playBtn.classList.remove('hidden');
            track.classList.remove('active-track');
        });
        
        audio.addEventListener('ended', () => {
            pauseBtn.classList.add('hidden');
            playBtn.classList.remove('hidden');
            track.classList.remove('active-track');
            progress.style.width = '0%';
            progressHandle.style.left = '0%';
            currentTimeEl.textContent = '0:00';
        });

        // Progress bar logic
        audio.addEventListener('loadedmetadata', () => {
            durationEl.textContent = formatTime(audio.duration);
        });

        audio.addEventListener('timeupdate', () => {
            currentTimeEl.textContent = formatTime(audio.currentTime);
            if (audio.duration) {
                const percent = (audio.currentTime / audio.duration) * 100;
                progress.style.width = percent + '%';
                progressHandle.style.left = `calc(${percent}% - 6px)`; 
            }
        });

        // Seek functionality
        progressBar.addEventListener('click', (e) => {
            const rect = progressBar.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percent = x / rect.width;
            audio.currentTime = percent * audio.duration;
        });

        let isDragging = false;
        let wasPlayingBeforeDrag = false;

        progressHandle.addEventListener('mousedown', (e) => {
            isDragging = true;
            wasPlayingBeforeDrag = !audio.paused;
            if (wasPlayingBeforeDrag) {
                audio.pause();
            }
            document.body.style.userSelect = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const rect = progressBar.getBoundingClientRect();
            let x = e.clientX - rect.left;
            x = Math.max(0, Math.min(x, rect.width));
            const percent = x / rect.width;
            audio.currentTime = percent * audio.duration;
        });

        document.addEventListener('mouseup', (e) => {
            if (isDragging) {
                isDragging = false;
                if (wasPlayingBeforeDrag) {
                    audio.play();
                }
                document.body.style.userSelect = '';
            }
        });

        // Volume
        volumeSlider.addEventListener('input', () => {
            audio.volume = volumeSlider.value;
        });
        volumeBtn.addEventListener('click', () => {
            audio.muted = !audio.muted;
            volumeBtn.innerHTML = audio.muted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
        });

        // Share
        shareBtn.addEventListener('click', () => {
            const url = window.location.href.split('#')[0] + '#glaneurs-musique';
            if (navigator.share) {
                navigator.share({
                    title: document.title,
                    url: url
                });
            } else {
                navigator.clipboard.writeText(url);
                shareBtn.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    shareBtn.innerHTML = '<i class="fas fa-share-alt"></i>';
                }, 1200);
            }
        });
    });

    document.querySelectorAll('.download-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const href = btn.getAttribute('href');
            const filename = href.split('/').pop();
            const a = document.createElement('a');
            a.href = href;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
    });

    document.querySelectorAll('.music-track').forEach(track => {
        const volumeBtn = track.querySelector('.volume-btn');
        const volumeSlider = track.querySelector('.volume-slider');
        let hideTimeout;

        function showSlider() {
            volumeSlider.style.opacity = '1';
            volumeSlider.style.pointerEvents = 'auto';
            clearTimeout(hideTimeout);
            hideTimeout = setTimeout(hideSlider, 5000);
        }
        function hideSlider() {
            volumeSlider.style.opacity = '0';
            volumeSlider.style.pointerEvents = 'none';
        }

        volumeBtn.addEventListener('mouseenter', showSlider);
        volumeSlider.addEventListener('mouseenter', showSlider);
        volumeBtn.addEventListener('mouseleave', () => {
            hideTimeout = setTimeout(hideSlider, 5000);
        });
        volumeSlider.addEventListener('mouseleave', () => {
            hideTimeout = setTimeout(hideSlider, 5000);
        });
        volumeBtn.addEventListener('focus', showSlider);
        volumeSlider.addEventListener('focus', showSlider);
        volumeBtn.addEventListener('blur', () => {
            hideTimeout = setTimeout(hideSlider, 5000);
        });
        volumeSlider.addEventListener('blur', () => {
            hideTimeout = setTimeout(hideSlider, 5000);
        });
    });
});

// ===========================
// 3. Fonctions utilitaires (hors DOMContentLoaded)
// ===========================
function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
    document.body.classList.remove('lightbox-open');
}


