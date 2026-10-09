/* =========================================
   HIỆU ỨNG CHUYỂN ĐỘNG CAO CẤP (RE-TRIGGER)
   - Hiệu ứng xuất hiện LẶP LẠI mỗi khi cuộn tới
   - Tự động ẩn khi cuộn ra khỏi tầm nhìn
   ========================================= */

document.addEventListener('DOMContentLoaded', function() {

    /* =========================================
       1. SCROLL REVEAL - RE-TRIGGER (LẶP LẠI)
       ========================================= */
    
    // Lấy tất cả các phần tử cần hiệu ứng
    const revealElements = document.querySelectorAll(
        '.section-label, .stat-box, .service-card, ' +
        '.feedback h2, .feedback .desc, .more-results, ' +
        '.about-text, .about-image, ' +
        '.faq-item, .contact-text, .contact-info-box, ' +
        '.footer-content, .services h2, .faq h2, .contact h2, ' +
        '.about h2, .services-grid, .stats-grid, .social-buttons'
    );

    // Thêm class reveal ban đầu
    revealElements.forEach(el => {
        el.classList.add('reveal');
    });

    // Áp dụng hướng khác nhau cho từng loại phần tử
    document.querySelectorAll('.about-text').forEach(el => {
        el.classList.remove('reveal');
        el.classList.add('reveal-left');
    });
    document.querySelectorAll('.about-image').forEach(el => {
        el.classList.remove('reveal');
        el.classList.add('reveal-right');
    });
    document.querySelectorAll('.contact-text').forEach(el => {
        el.classList.remove('reveal');
        el.classList.add('reveal-left');
    });
    document.querySelectorAll('.contact-info-box').forEach(el => {
        el.classList.remove('reveal');
        el.classList.add('reveal-right');
    });

    // Stagger cho services-grid
    document.querySelectorAll('.services-grid').forEach(el => {
        el.classList.add('stagger-children');
    });

    // Stagger cho stats-grid
    document.querySelectorAll('.stats-grid').forEach(el => {
        el.classList.add('stagger-children');
    });

    // Stagger cho FAQ
    document.querySelectorAll('.faq .container').forEach(el => {
        // Không stagger container mà stagger từng item
    });

    // Hàm kiểm tra và áp dụng hiệu ứng - CHẠY LẶP LẠI
    const checkReveal = () => {
        const windowHeight = window.innerHeight;
        const revealPoint = 100; // Khoảng cách kích hoạt
        const hidePoint = -50;   // Khoảng cách để ẩn lại

        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const elementTop = rect.top;
            const elementBottom = rect.bottom;

            // Nếu phần tử nằm trong tầm nhìn (từ dưới lên)
            if (elementTop < windowHeight - revealPoint && elementBottom > 0) {
                el.classList.add('revealed');
            } 
            // Nếu phần tử đã ra khỏi tầm nhìn (cuộn xuống dưới hoặc lên trên)
            else if (elementTop > windowHeight || elementBottom < hidePoint) {
                el.classList.remove('revealed');
            }
        });

        // Xử lý riêng cho các phần tử stagger
        document.querySelectorAll('.stagger-children').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < windowHeight - revealPoint && rect.bottom > 0) {
                el.classList.add('revealed');
            } else if (rect.top > windowHeight || rect.bottom < hidePoint) {
                el.classList.remove('revealed');
            }
        });

        // Xử lý cho các section có đường viền
        document.querySelectorAll('.services, .feedback, .about, .faq, .contact').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < windowHeight - 100 && rect.bottom > 0) {
                el.classList.add('revealed');
            } else {
                el.classList.remove('revealed');
            }
        });
    };

    // Chạy lần đầu
    window.addEventListener('load', checkReveal);
    setTimeout(checkReveal, 100);
    setTimeout(checkReveal, 500);

    // Chạy mỗi khi cuộn (có throttle để mượt hơn)
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                checkReveal();
                ticking = false;
            });
            ticking = true;
        }
    });

    /* =========================================
       2. HEADER ẨN/HIỆN KHI CUỘN
       ========================================= */
    const header = document.querySelector('header');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        // Thêm class scrolled khi cuộn xuống
        if (currentScrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Ẩn header khi cuộn xuống, hiện khi cuộn lên
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            header.classList.add('header-hidden');
        } else {
            header.classList.remove('header-hidden');
        }

        lastScrollY = currentScrollY;
    });

    /* =========================================
       3. ĐẾM SỐ CHO STATS
       ========================================= */
        /* =========================================
       3. ĐẾM SỐ CHO STATS (ĐÃ SỬA LỖI HOÀN TOÀN)
       ========================================= */
    
    // Lấy tất cả các thẻ h3 trong stat-box
    const statBoxes = document.querySelectorAll('.stat-box h3');
    
    // Lưu giá trị gốc của từng stat box vào mảng
    // Điều này cực kỳ quan trọng để không bị mất giá trị gốc
    const originalValues = [];
    statBoxes.forEach((box, index) => {
        originalValues[index] = box.textContent.trim();
    });

    // Biến đánh dấu đã đếm xong chưa (chỉ đếm 1 lần duy nhất)
    let statsCounted = false;

    const countUp = (element, originalText) => {
        // Phân tích giá trị gốc
        const hasPlus = originalText.includes('+');
        const hasPercent = originalText.includes('%');
        const numberMatch = originalText.match(/\d+/);
        
        // Nếu không có số (như "+ FPS"), giữ nguyên
        if (!numberMatch) {
            element.textContent = originalText;
            return;
        }
        
        const target = parseInt(numberMatch[0]);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCount = () => {
            current += step;
            if (current < target) {
                let displayText = '';
                if (hasPlus && hasPercent) {
                    displayText = `+${Math.floor(current)}%`;
                } else if (hasPlus) {
                    displayText = `+${Math.floor(current)}`;
                } else if (hasPercent) {
                    displayText = `${Math.floor(current)}%`;
                } else {
                    displayText = `${Math.floor(current)}`;
                }
                element.textContent = displayText;
                requestAnimationFrame(updateCount);
            } else {
                // Khi đếm xong, giữ nguyên giá trị gốc
                element.textContent = originalText;
            }
        };
        updateCount();
    };

    const checkStats = () => {
        const statsSection = document.querySelector('.stats-grid');
        if (!statsSection) return;
        
        const rect = statsSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // CHỈ ĐẾM 1 LẦN DUY NHẤT khi lần đầu cuộn tới
        if (rect.top < windowHeight - 100 && !statsCounted) {
            statsCounted = true;
            statBoxes.forEach((box, index) => {
                countUp(box, originalValues[index]);
            });
        }
        
        // KHÔNG RESET SỐ KHI CUỘN RA KHỎI TẦM NHÌN
        // Số sẽ giữ nguyên giá trị sau khi đếm xong
    };

    window.addEventListener('scroll', checkStats);
    window.addEventListener('load', checkStats);
    setTimeout(checkStats, 200);

    /* =========================================
       4. PARALLAX NHẸ CHO HERO VÀ LOGO
       ========================================= */
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        // Parallax cho logo placeholder
        const logo = document.querySelector('.logo-placeholder');
        if (logo) {
            const rate = scrolled * -0.05;
            logo.style.transform = `translateY(${rate}px) rotate(-10deg)`;
        }

        // Parallax cho hero content
        const heroContent = document.querySelector('.hero .container');
        if (heroContent && scrolled < 800) {
            const rate = scrolled * 0.3;
            heroContent.style.transform = `translateY(${rate}px)`;
            heroContent.style.opacity = 1 - (scrolled / 800);
        }

        // Hiệu ứng nền hero mờ dần
        const hero = document.querySelector('.hero');
        if (hero) {
            if (scrolled > 100) {
                hero.classList.add('scrolled-bg');
            } else {
                hero.classList.remove('scrolled-bg');
            }
        }
    });

    /* =========================================
       5. HIỆU ỨNG CHO CÁC CON SỐ KHI HOVER
       ========================================= */
    document.querySelectorAll('.stat-box').forEach(box => {
        box.addEventListener('mouseenter', function() {
            const h3 = this.querySelector('h3');
            if (h3) {
                h3.style.transform = 'scale(1.15)';
                h3.style.textShadow = '0 0 30px rgba(59, 130, 246, 0.8)';
            }
        });
        box.addEventListener('mouseleave', function() {
            const h3 = this.querySelector('h3');
            if (h3) {
                h3.style.transform = 'scale(1)';
                h3.style.textShadow = 'none';
            }
        });
    });

    /* =========================================
       6. HIỆU ỨNG CHO CÁC ĐƯỜNG VIỀN SECTION
       ========================================= */
    // Đã xử lý trong checkReveal

    /* =========================================
       7. SMOOTH SCROLL CHO CÁC LIÊN KẾT NEO
       ========================================= */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    /* =========================================
       8. HIỆU ỨNG CHO CÁC ĐƯỜNG VIỀN SECTION
       ========================================= */
    // Khi section vào tầm nhìn, đường viền trên cùng sẽ mở rộng
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            } else {
                entry.target.classList.remove('revealed');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.services, .feedback, .about, .faq, .contact').forEach(section => {
        sectionObserver.observe(section);
    });
});

