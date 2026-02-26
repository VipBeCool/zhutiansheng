/* ============================================
   动画逻辑 — 滚动触发、计数器、雷达图
   ============================================ */

(function () {
    'use strict';

    // === 滚动淡入 Intersection Observer ===
    function initRevealAnimations() {
        const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

        if (!revealElements.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => observer.observe(el));
    }

    // === 数字计数器动画 ===
    function initCounters() {
        const counters = document.querySelectorAll('.stat-number[data-target]');
        if (!counters.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.getAttribute('data-target'));
                    animateCounter(el, target);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(el => observer.observe(el));
    }

    function animateCounter(element, target) {
        const duration = 2000;
        const startTime = performance.now();
        const startValue = 0;

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // easeOutExpo 缓动
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const current = Math.floor(startValue + (target - startValue) * eased);

            element.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    // === 打字机效果 ===
    function initTypingEffect() {
        const element = document.getElementById('typingText');
        if (!element) return;

        const phrases = [
            'AI + FinTech Product Architect',
            '全栈型产品经理',
            'PM 中的极客',
            'Agent / RAG 实践者',
            '从 0 到 1 的创造者'
        ];

        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let isPaused = false;

        function type() {
            const currentPhrase = phrases[phraseIndex];

            if (isPaused) {
                isPaused = false;
                isDeleting = true;
                setTimeout(type, 500);
                return;
            }

            if (isDeleting) {
                element.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;

                if (charIndex === 0) {
                    isDeleting = false;
                    phraseIndex = (phraseIndex + 1) % phrases.length;
                    setTimeout(type, 300);
                    return;
                }
                setTimeout(type, 30);
            } else {
                element.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;

                if (charIndex === currentPhrase.length) {
                    isPaused = true;
                    setTimeout(type, 2500);
                    return;
                }
                setTimeout(type, 60);
            }
        }

        // 延迟启动
        setTimeout(type, 1200);
    }

    // === 技能雷达图 ===
    function initRadarChart() {
        const canvas = document.getElementById('radarCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const size = 400;
        const center = size / 2;
        const radius = 150;

        // 高 DPI 支持
        const dpr = window.devicePixelRatio || 1;
        canvas.width = size * dpr;
        canvas.height = size * dpr;
        canvas.style.width = size + 'px';
        canvas.style.height = size + 'px';
        ctx.scale(dpr, dpr);

        const labels = ['产品设计', 'AI/LLM', '数据分析', 'UI/UX', '工程实践'];
        const values = [0.95, 0.88, 0.85, 0.82, 0.78];
        const sides = labels.length;
        const angleStep = (Math.PI * 2) / sides - Math.PI / 2;

        // 获取顶点坐标
        function getPoint(index, scale) {
            const angle = (index * Math.PI * 2) / sides - Math.PI / 2;
            return {
                x: center + Math.cos(angle) * radius * scale,
                y: center + Math.sin(angle) * radius * scale
            };
        }

        // 绘制网格
        function drawGrid() {
            const levels = [0.2, 0.4, 0.6, 0.8, 1.0];
            levels.forEach(level => {
                ctx.beginPath();
                for (let i = 0; i <= sides; i++) {
                    const p = getPoint(i % sides, level);
                    if (i === 0) ctx.moveTo(p.x, p.y);
                    else ctx.lineTo(p.x, p.y);
                }
                ctx.closePath();
                ctx.strokeStyle = 'rgba(79, 70, 229, 0.12)';
                ctx.lineWidth = 1;
                ctx.stroke();
            });

            // 绘制轴线
            for (let i = 0; i < sides; i++) {
                const p = getPoint(i, 1);
                ctx.beginPath();
                ctx.moveTo(center, center);
                ctx.lineTo(p.x, p.y);
                ctx.strokeStyle = 'rgba(79, 70, 229, 0.08)';
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }

        // 绘制数据区域
        function drawData(progress) {
            ctx.beginPath();
            for (let i = 0; i <= sides; i++) {
                const idx = i % sides;
                const p = getPoint(idx, values[idx] * progress);
                if (i === 0) ctx.moveTo(p.x, p.y);
                else ctx.lineTo(p.x, p.y);
            }
            ctx.closePath();

            // 渐变填充
            const gradient = ctx.createRadialGradient(center, center, 0, center, center, radius);
            gradient.addColorStop(0, 'rgba(79, 70, 229, 0.25)');
            gradient.addColorStop(1, 'rgba(6, 182, 212, 0.08)');
            ctx.fillStyle = gradient;
            ctx.fill();

            // 边框
            ctx.strokeStyle = 'rgba(79, 70, 229, 0.6)';
            ctx.lineWidth = 2;
            ctx.stroke();

            // 数据点
            for (let i = 0; i < sides; i++) {
                const p = getPoint(i, values[i] * progress);
                ctx.beginPath();
                ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
                ctx.fillStyle = '#4F46E5';
                ctx.fill();
                ctx.strokeStyle = 'rgba(79, 70, 229, 0.4)';
                ctx.lineWidth = 6;
                ctx.stroke();
            }
        }

        // 绘制标签
        function drawLabels() {
            ctx.font = '13px Inter, sans-serif';
            ctx.fillStyle = 'rgba(240, 240, 245, 0.7)';
            ctx.textAlign = 'center';

            for (let i = 0; i < sides; i++) {
                const p = getPoint(i, 1.2);
                ctx.fillText(labels[i], p.x, p.y + 5);
            }
        }

        // 动画绘制
        let progress = 0;
        let drawn = false;

        function draw() {
            ctx.clearRect(0, 0, size, size);
            drawGrid();
            drawData(progress);
            drawLabels();
        }

        function animateRadar() {
            if (progress < 1) {
                progress += 0.02;
                draw();
                requestAnimationFrame(animateRadar);
            } else {
                progress = 1;
                draw();
            }
        }

        // 观察可见性
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !drawn) {
                    drawn = true;
                    animateRadar();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        observer.observe(canvas);

        // 先画静态网格
        draw();
    }

    // === 导出初始化函数 ===
    window.initAnimations = function () {
        initRevealAnimations();
        initCounters();
        initTypingEffect();
        initRadarChart();
    };
})();
