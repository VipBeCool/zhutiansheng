/* ============================================
   导航和滚动逻辑
   ============================================ */

(function () {
    'use strict';

    // === 导航栏滚动效果 ===
    function initNavbar() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        let lastScrollY = 0;
        let ticking = false;

        function onScroll() {
            if (!ticking) {
                requestAnimationFrame(() => {
                    if (window.scrollY > 50) {
                        navbar.classList.add('scrolled');
                    } else {
                        navbar.classList.remove('scrolled');
                    }
                    lastScrollY = window.scrollY;
                    ticking = false;
                });
                ticking = true;
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true });

        // 滚动条自动隐藏：滚动时显示，停止 1.2s 后淡出
        let scrollbarTimer = null;
        window.addEventListener('scroll', function () {
            document.documentElement.classList.add('is-scrolling');
            clearTimeout(scrollbarTimer);
            scrollbarTimer = setTimeout(function () {
                document.documentElement.classList.remove('is-scrolling');
            }, 1200);
        }, { passive: true });
    }

    // === 移动端菜单切换 ===
    function initMobileMenu() {
        const toggle = document.getElementById('navToggle');
        const links = document.getElementById('navLinks');
        if (!toggle || !links) return;

        toggle.addEventListener('click', () => {
            links.classList.toggle('open');
            toggle.classList.toggle('active');

            // 汉堡动画
            const spans = toggle.querySelectorAll('span');
            if (links.classList.contains('open')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            }
        });

        // 点击链接后关闭菜单
        links.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                links.classList.remove('open');
                toggle.classList.remove('active');
                const spans = toggle.querySelectorAll('span');
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            });
        });
    }

    // === 平滑滚动 ===
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const target = document.querySelector(targetId);
                if (!target) return;

                const navHeight = document.getElementById('navbar')?.offsetHeight || 72;
                // 跳过 section 顶部大部分 padding，让标题区域紧贴导航栏下方
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight + 60;

                window.scrollTo({
                    top: Math.max(0, targetPosition),
                    behavior: 'smooth'
                });
            });
        });
    }

    // === 活跃导航高亮 ===
    function initActiveNavHighlight() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        if (!sections.length || !navLinks.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navLinks.forEach(link => {
                        const href = link.getAttribute('href');
                        // 只对页内锚点链接切换 active，不影响子页面链接
                        if (href && href.startsWith('#')) {
                            link.classList.remove('active');
                            if (href === '#' + id) {
                                link.classList.add('active');
                            }
                        }
                    });
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '-80px 0px -50% 0px'
        });

        sections.forEach(section => observer.observe(section));
    }

    // === 鼠标追踪光晕（已由 effects.js cursor-glow 替代）===
    function initMouseGlow() {
        const glow = document.getElementById('mouseGlow');
        if (glow) glow.style.display = 'none';
        return;

        let mouseX = 0, mouseY = 0;
        let glowX = 0, glowY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function updateGlow() {
            // 平滑跟随
            glowX += (mouseX - glowX) * 0.08;
            glowY += (mouseY - glowY) * 0.08;

            glow.style.left = glowX + 'px';
            glow.style.top = glowY + 'px';

            requestAnimationFrame(updateGlow);
        }

        updateGlow();
    }

    // === 导出初始化 ===
    window.initNavigation = function () {
        initNavbar();
        initMobileMenu();
        initSmoothScroll();
        initActiveNavHighlight();
        initMouseGlow();
    };
})();
