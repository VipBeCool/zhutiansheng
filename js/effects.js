/**
 * effects.js
 * P0 交互增强：滚动进度条 + 3D 倾斜卡片 + 自定义光标 + 磁吸按钮
 */

// ============================================
//  滚动进度条
// ============================================
function initScrollProgress() {
    // 创建进度条元素
    const bar = document.createElement('div');
    bar.className = 'scroll-progress-bar';
    document.body.appendChild(bar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width = progress + '%';
    }, { passive: true });
}

// ============================================
//  3D 倾斜卡片
// ============================================
function initTiltCards() {
    const cards = document.querySelectorAll('.project-card, .bento-card, .stat-item');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // 计算旋转角度（最大8度）
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;

            // 计算光泽位置
            const glareX = (x / rect.width) * 100;
            const glareY = (y / rect.height) * 100;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.setProperty('--glare-x', glareX + '%');
            card.style.setProperty('--glare-y', glareY + '%');
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            card.style.setProperty('--glare-x', '50%');
            card.style.setProperty('--glare-y', '50%');
        });
    });
}

// ============================================
//  自定义光标
// ============================================
function initCustomCursor() {
    // 移动端不需要光晕效果
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);

    // 光晕跟随鼠标
    document.addEventListener('mousemove', (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    });

    // 悬浮交互元素时光晕放大
    const interactiveElements = document.querySelectorAll('a, button, .btn, .project-card, .bento-card, .stat-item, .nav-link, .tag');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            glow.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            glow.classList.remove('cursor-hover');
        });
    });

    // 保留默认箭头光标，不隐藏
}

// ============================================
//  磁吸按钮
// ============================================
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .nav-cta');

    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // 磁吸偏移（最大10px）
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
}

// ============================================
//  鼠标粒子拖尾（Canvas 实现，高性能）
// ============================================
function initParticleTrail() {
    // 移动端不需要粒子拖尾
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'particleTrailCanvas';
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    });

    const POOL_SIZE = 20;
    const COLORS = [
        '#4F46E5', '#06B6D4', '#8B5CF6', '#EC4899',
        '#10B981', '#F59E0B', '#6366F1', '#14B8A6'
    ];
    const particles = [];
    let mouseX = 0, mouseY = 0;
    let prevMouseX = 0, prevMouseY = 0;
    let animId = null;

    // 初始化粒子池
    for (let i = 0; i < POOL_SIZE; i++) {
        particles.push({
            x: 0, y: 0,
            vx: 0, vy: 0,
            life: 0, maxLife: 0,
            size: 0, color: '#fff',
            active: false
        });
    }

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }, { passive: true });

    function spawnParticle() {
        const dx = mouseX - prevMouseX;
        const dy = mouseY - prevMouseY;
        const dist = dx * dx + dy * dy;
        // 增大阈值，减少粒子生成频率
        if (dist < 25) return;

        prevMouseX = mouseX;
        prevMouseY = mouseY;

        const p = particles.find(p => !p.active);
        if (!p) return;

        p.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        p.size = Math.random() * 3 + 1.5;
        p.life = Math.random() * 25 + 15;
        p.maxLife = p.life;
        p.x = mouseX + (Math.random() - 0.5) * 6;
        p.y = mouseY + (Math.random() - 0.5) * 6;
        p.vx = (Math.random() - 0.5) * 1;
        p.vy = Math.random() * -0.8 - 0.3;
        p.active = true;
    }

    function tick() {
        ctx.clearRect(0, 0, w, h);
        let hasActive = false;

        spawnParticle();

        for (const p of particles) {
            if (!p.active) continue;
            hasActive = true;

            p.life--;
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.02;

            const progress = p.life / p.maxLife;
            const r = p.size * progress;
            const alpha = progress * 0.7;

            if (r > 0.2) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
                ctx.fillStyle = p.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba').replace('#', '');
                // 用 hex 的方式
                ctx.globalAlpha = alpha;
                ctx.fillStyle = p.color;
                ctx.fill();
                ctx.globalAlpha = 1;
            }

            if (p.life <= 0) {
                p.active = false;
            }
        }

        // 只在有活跃粒子或鼠标在动时继续，否则停止
        const mouseMoved = (mouseX !== prevMouseX || mouseY !== prevMouseY);
        if (hasActive || mouseMoved) {
            animId = requestAnimationFrame(tick);
        } else {
            animId = null;
        }
    }

    // 鼠标移动时启动动画
    document.addEventListener('mousemove', () => {
        if (!animId) {
            animId = requestAnimationFrame(tick);
        }
    }, { passive: true });
}

// ============================================
//  Spotlight 聚光灯效果
// ============================================
function initSpotlight() {
    // 移动端不需要聚光灯
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const skillsSection = document.getElementById('skills');
    if (!skillsSection) return;

    // 给技能区域添加 spotlight 容器
    const grid = skillsSection.querySelector('.skills-grid');
    if (!grid) return;

    grid.classList.add('spotlight-container');

    // 创建遮罩层
    const mask = document.createElement('div');
    mask.className = 'spotlight-mask';
    grid.appendChild(mask);

    // 鼠标跟随
    grid.addEventListener('mousemove', (e) => {
        const rect = grid.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        grid.style.setProperty('--spotlight-x', x + '%');
        grid.style.setProperty('--spotlight-y', y + '%');
    });
}

// ============================================
//  滚动驱动 SVG 路径绘制（职业旅程时间线）
// ============================================
function initScrollDraw() {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;

    const svg = timeline.querySelector('.timeline-svg');
    const track = svg?.querySelector('.timeline-track');
    const draw = svg?.querySelector('.timeline-draw');
    if (!svg || !track || !draw) return;

    const items = timeline.querySelectorAll('.timeline-item');
    if (items.length === 0) return;

    // 移动端不启用 SVG 路径动画，保持简单样式
    if (window.matchMedia('(pointer: coarse)').matches) {
        // 移动端恢复静态竖线样式
        svg.style.display = 'none';
        timeline.style.setProperty('--show-static-line', '1');
        items.forEach(item => item.classList.add('node-active'));
        return;
    }

    let pathLength = 0;
    let nodePositions = []; // 每个节点在路径上的百分比位置

    // 根据节点实际 DOM 位置动态生成 SVG path
    function buildPath() {
        const timelineRect = timeline.getBoundingClientRect();
        const scrollTop = timeline.scrollTop || 0;

        // 收集每个节点的 Y 坐标（相对 timeline）
        const points = [];
        items.forEach((item) => {
            const itemRect = item.getBoundingClientRect();
            // 节点圆点在 item 顶部偏移 6px + 6px（半径）处
            const y = itemRect.top - timelineRect.top + scrollTop + 12;
            points.push(y);
        });

        if (points.length === 0) return;

        // 生成直线路径，严格沿竖直方向对齐节点圆点中心
        const x = 6; // SVG 横坐标中心 = 圆点中心
        let d = `M ${x} ${points[0]}`;

        for (let i = 1; i < points.length; i++) {
            const currY = points[i];
            d += ` L ${x} ${currY}`;
        }

        track.setAttribute('d', d);
        draw.setAttribute('d', d);

        // 获取路径总长度
        pathLength = draw.getTotalLength();

        // 设置 dasharray/offset
        draw.style.strokeDasharray = pathLength;
        draw.style.strokeDashoffset = pathLength;

        // 计算每个节点在路径上的归一化位置
        nodePositions = points.map((y) => {
            const startY = points[0];
            const endY = points[points.length - 1];
            return (y - startY) / (endY - startY);
        });
    }

    // 根据滚动进度绘制路径
    function updateDraw() {
        if (pathLength === 0) return;

        const timelineRect = timeline.getBoundingClientRect();
        const windowH = window.innerHeight;

        // 用 timeline 容器的位置直接计算进度
        // 从 timeline 顶部进入视口 70% 位置开始，到 timeline 底部到达视口 30% 位置结束
        const startTrigger = windowH * 0.7;
        const endTrigger = windowH * 0.3;

        const scrolled = startTrigger - timelineRect.top;
        const total = timelineRect.height - (windowH - startTrigger) + endTrigger;
        let progress = Math.max(0, Math.min(1, scrolled / Math.max(total, 1)));

        // 绘制路径
        const offset = pathLength * (1 - progress);
        draw.style.strokeDashoffset = offset;

        // 激活已到达的节点（降低阈值更容易触发）
        items.forEach((item, i) => {
            // 第一个节点：只要开始绘制就激活
            // 其余节点：进度到达节点位置的 80% 时激活
            const threshold = i === 0 ? 0.02 : nodePositions[i] * 0.8;
            if (progress >= threshold) {
                item.classList.add('node-active');
            } else {
                item.classList.remove('node-active');
            }
        });
    }

    // 构建路径
    buildPath();

    // 滚动监听（requestAnimationFrame 节流）
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateDraw();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // 窗口尺寸变化时重新计算
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            buildPath();
            updateDraw();
        }, 200);
    });

    // 初始状态
    updateDraw();
}

// ============================================
//  初始化所有特效
// ============================================
window.initEffects = function () {
    initScrollProgress();
    initTiltCards();
    initCustomCursor();
    initMagneticButtons();
    initParticleTrail();
    initSpotlight();
    initScrollDraw();
};
