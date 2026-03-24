// script.js
document.addEventListener('DOMContentLoaded', function() {
    // 1. Плавная прокрутка к якорям
    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 2. Бургер-меню
    const burgerBtn = document.getElementById('burger-btn');
    const nav = document.getElementById('nav');
    if (burgerBtn) {
        burgerBtn.addEventListener('click', () => {
            burgerBtn.classList.toggle('active');
            nav.classList.toggle('active');
        });
    }

    // 3. Кнопка поделиться (улучшенная версия)
    const shareBtn = document.getElementById('share-btn');
    const shareDropdown = document.getElementById('share-dropdown');
    if (shareBtn) {
        shareBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            shareDropdown.classList.toggle('show');
        });

        document.addEventListener('click', (e) => {
            if (!shareBtn.contains(e.target) && !shareDropdown.contains(e.target)) {
                shareDropdown.classList.remove('show');
            }
        });

        const shareOptions = document.querySelectorAll('.share-option');
        const currentUrl = window.location.href;
        const pageTitle = document.title;

        shareOptions.forEach(option => {
            option.addEventListener('click', function(e) {
                e.preventDefault();
                const shareType = this.dataset.share;
                let shareUrl = '';

                if (shareType === 'vk') {
                    shareUrl = `https://vk.com/share.php?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(pageTitle)}`;
                } else if (shareType === 'telegram') {
                    shareUrl = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(pageTitle)}`;
                } else if (shareType === 'whatsapp') {
                    shareUrl = `https://wa.me/?text=${encodeURIComponent(pageTitle + ' ' + currentUrl)}`;
                } else if (shareType === 'ok') {
                    shareUrl = `https://connect.ok.ru/offer?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(pageTitle)}`;
                } else if (this.id === 'copy-link') {
                    navigator.clipboard.writeText(currentUrl).then(() => {
                        alert('Ссылка скопирована!');
                    }).catch(err => {
                        console.error('Ошибка копирования:', err);
                    });
                    shareDropdown.classList.remove('show');
                    return;
                }

                if (shareUrl) {
                    window.open(shareUrl, '_blank', 'width=600,height=400');
                }
                shareDropdown.classList.remove('show');
            });
        });

        if (navigator.share) {
            shareBtn.addEventListener('click', (e) => {
                e.preventDefault();
                navigator.share({
                    title: pageTitle,
                    url: currentUrl
                }).catch(console.error);
                shareDropdown.classList.remove('show');
            });
        }
    }

    // 4. Кнопка "Наверх"
    const scrollBtn = document.getElementById('scrollTopBtn');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollBtn.style.display = 'flex';
        } else {
            scrollBtn.style.display = 'none';
        }
    });
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 5. Анимация появления
    const animatedElements = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // 6. Закрытие бургер-меню после клика по ссылке
    const navLinks = document.querySelectorAll('.nav-list a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            burgerBtn.classList.remove('active');
            nav.classList.remove('active');
        });
    });
});