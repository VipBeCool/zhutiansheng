/**
 * horizontal-scroll.js
 * 项目案例区域的横向滚动展示
 */

(function () {
    function initHorizontalScroll() {
        const section = document.getElementById('projects');
        if (!section) return;

        const bentoGrid = section.querySelector('.projects-bento');
        if (!bentoGrid) return;

        // 将网格布局转换为横向滚动
        const cards = Array.from(bentoGrid.children);
        if (cards.length === 0) return;

        // 创建横向滚动容器
        const wrapper = document.createElement('div');
        wrapper.className = 'projects-horizontal-wrapper';

        const track = document.createElement('div');
        track.className = 'projects-horizontal-track';

        // 移动卡片到横向轨道
        cards.forEach(card => {
            track.appendChild(card);
        });

        wrapper.appendChild(track);

        // 替换原来的网格
        bentoGrid.replaceWith(wrapper);

        // 拖拽逻辑
        let isDragging = false;
        let startX = 0;
        let scrollLeft = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;
        let rafId = null;
        const maxScroll = () => track.scrollWidth - wrapper.clientWidth;

        function setTranslate(value) {
            // 限制范围
            currentTranslate = Math.max(-maxScroll(), Math.min(0, value));
            track.style.transform = `translateX(${currentTranslate}px)`;
            updateDots();
        }

        // 鼠标拖拽
        let dragMoved = false; // 标记是否真正发生了拖拽移动

        track.addEventListener('mousedown', (e) => {
            if (e.target.closest('a, button, .tag')) return;
            isDragging = true;
            dragMoved = false;
            startX = e.clientX;
            prevTranslate = currentTranslate;
            track.style.transition = 'none';
            track.style.cursor = 'grabbing';
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const diff = e.clientX - startX;
            // 只有移动超过 5px 才算拖拽
            if (Math.abs(diff) > 5) {
                dragMoved = true;
            }
            setTranslate(prevTranslate + diff);
        });

        window.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            track.style.transition = '';
            track.style.cursor = '';
            if (dragMoved) {
                snapToNearestCard();
            }
        });

        // 如果发生了拖拽，阻止后续 click 事件（防止误触弹窗）
        track.addEventListener('click', (e) => {
            if (dragMoved) {
                e.stopPropagation();
                e.preventDefault();
                dragMoved = false;
            }
        }, true);

        // 触摸拖拽
        track.addEventListener('touchstart', (e) => {
            isDragging = true;
            startX = e.touches[0].clientX;
            prevTranslate = currentTranslate;
            track.style.transition = 'none';
        }, { passive: true });

        track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const diff = e.touches[0].clientX - startX;
            setTranslate(prevTranslate + diff);
        }, { passive: true });

        track.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;
            track.style.transition = '';
            snapToNearestCard();
        });

        // 滚轮横向滚动
        wrapper.addEventListener('wheel', (e) => {
            // 只在有横向溢出时拦截滚轮
            if (track.scrollWidth <= wrapper.clientWidth) return;

            const atStart = currentTranslate >= 0;
            const atEnd = currentTranslate <= -maxScroll();

            // 在开头向上滚，或在结尾向下滚，不拦截（允许页面正常滚动）
            if ((atStart && e.deltaY < 0) || (atEnd && e.deltaY > 0)) return;

            e.preventDefault();
            const delta = e.deltaY || e.deltaX;
            track.style.transition = 'transform 0.3s ease-out';
            setTranslate(currentTranslate - delta * 1.5);
        }, { passive: false });

        // 吸附到最近的卡片
        function snapToNearestCard() {
            if (cards.length === 0) return;
            track.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';

            const gap = parseInt(getComputedStyle(track).gap) || 24;
            let accumulated = 0;
            let closestSnap = 0;
            let minDiff = Infinity;

            for (let i = 0; i < cards.length; i++) {
                const diff = Math.abs(-accumulated - currentTranslate);
                if (diff < minDiff) {
                    minDiff = diff;
                    closestSnap = -accumulated;
                }
                accumulated += cards[i].offsetWidth + gap;
            }

            setTranslate(closestSnap);
        }

        // 指示点（每张卡片一个，对应卡片顺序）
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'scroll-indicator-dots';
        cards.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.className = 'scroll-dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', () => {
                track.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
                const gap = parseInt(getComputedStyle(track).gap) || 24;
                let targetX = 0;
                for (let j = 0; j < i; j++) {
                    targetX += cards[j].offsetWidth + gap;
                }
                // 不超过最大可滚动距离
                setTranslate(-Math.min(targetX, maxScroll()));
            });
            dotsContainer.appendChild(dot);
        });
        wrapper.appendChild(dotsContainer);

        // 左右箭头 + 指示点 组合行
        const navRow = document.createElement('div');
        navRow.className = 'scroll-nav-row';

        const arrowLeft = document.createElement('button');
        arrowLeft.className = 'scroll-arrow scroll-arrow-left';
        arrowLeft.setAttribute('aria-label', '上一个项目');
        arrowLeft.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>`;

        const arrowRight = document.createElement('button');
        arrowRight.className = 'scroll-arrow scroll-arrow-right';
        arrowRight.setAttribute('aria-label', '下一个项目');
        arrowRight.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>`;

        navRow.appendChild(arrowLeft);
        navRow.appendChild(dotsContainer);
        navRow.appendChild(arrowRight);
        wrapper.appendChild(navRow);

        // 当前卡片索引
        let currentIndex = 0;

        function getCurrentIndex() {
            const gap = parseInt(getComputedStyle(track).gap) || 24;
            let accumulated = 0;
            let closestIndex = 0;
            let minDiff = Infinity;
            for (let i = 0; i < cards.length; i++) {
                const diff = Math.abs(-accumulated - currentTranslate);
                if (diff < minDiff) {
                    minDiff = diff;
                    closestIndex = i;
                }
                accumulated += cards[i].offsetWidth + gap;
            }
            return closestIndex;
        }

        function scrollToCard(index) {
            if (index < 0 || index >= cards.length) return;
            track.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
            const gap = parseInt(getComputedStyle(track).gap) || 24;
            let targetX = 0;
            for (let j = 0; j < index; j++) {
                targetX += cards[j].offsetWidth + gap;
            }
            setTranslate(-Math.min(targetX, maxScroll()));
            currentIndex = index;
            updateArrows();
        }

        function updateArrows() {
            const idx = getCurrentIndex();
            arrowLeft.classList.toggle('hidden', idx === 0);
            arrowRight.classList.toggle('hidden', idx === cards.length - 1);
        }

        arrowLeft.addEventListener('click', () => {
            scrollToCard(getCurrentIndex() - 1);
        });

        arrowRight.addEventListener('click', () => {
            scrollToCard(getCurrentIndex() + 1);
        });

        // 初始化箭头状态
        updateArrows();

        // 拖拽提示（简化，移到标题区域下方）
        const hint = document.createElement('div');
        hint.className = 'drag-hint';
        hint.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
      <span>拖拽或滚轮浏览项目</span>
    `;
        wrapper.appendChild(hint);

        function updateDots() {
            const gap = parseInt(getComputedStyle(track).gap) || 24;
            let accumulated = 0;
            let closestIndex = 0;
            let minDiff = Infinity;

            for (let i = 0; i < cards.length; i++) {
                const diff = Math.abs(-accumulated - currentTranslate);
                if (diff < minDiff) {
                    minDiff = diff;
                    closestIndex = i;
                }
                accumulated += cards[i].offsetWidth + gap;
            }

            dotsContainer.querySelectorAll('.scroll-dot').forEach((d, i) => {
                d.classList.toggle('active', i === closestIndex);
            });

            // 同步更新箭头状态
            updateArrows();
        }
    }

    window.initHorizontalScroll = function () {
        initHorizontalScroll();
    };
})();
