/**
 * message-wall.js
 * 访客弹幕留言墙 — 弹幕飘动 + 输入发送 + localStorage 持久化
 */

(function () {
    'use strict';

    // ========================
    //  预置留言（模拟真实访客口吻）
    // ========================
    const PRESET_MESSAGES = [
        { nick: '产品人', text: '千亿AUM的产品经理，太猛了 🔥', avatar: '🧑‍💼' },
        { nick: 'AI 爱好者', text: '大模型 + 金融，这个方向太好了', avatar: '🤖' },
        { nick: '路过的PM', text: '网站做得真好看，全栈PM的实力', avatar: '✨' },
        { nick: '匿名', text: '从京东到征信，每一步都很扎实', avatar: '💎' },
        { nick: '同行', text: '智能营销方向值得深耕！', avatar: '🎯' },
        { nick: '前端er', text: '暗色科技风太酷了，收藏了', avatar: '🌙' },
        { nick: '银行客户', text: 'Agent+RAG 做风控，很有前景', avatar: '🏦' },
        { nick: '创业者', text: '14年经验太扎实了，学习了', avatar: '🚀' },
        { nick: 'Kevin粉丝', text: '简历都能做成这样，佩服！', avatar: '👏' },
        { nick: '技术PM', text: '流水分析那个项目很有意思', avatar: '📊' },
        { nick: '浏览者', text: '互联网人必备的个人品牌', avatar: '💡' },
        { nick: '面试官', text: '产品sense很强，一看就懂业务', avatar: '👀' },
        { nick: '深圳PM', text: '京东P7，征信数据PM，厉害', avatar: '⚡' },
        { nick: '设计师', text: '这个时间线动画效果太精致了', avatar: '🎨' },
        { nick: '数据人', text: '1400万企业数据资产，很有价值', avatar: '📈' },
    ];

    // 弹幕颜色池
    const COLORS = ['indigo', 'cyan', 'emerald', 'amber', 'violet', 'rose'];

    // 配置
    const TRACK_COUNT = 8;       // 弹幕轨道数
    const TRACK_HEIGHT = 44;     // 单轨道高度(px)
    const AUTO_INTERVAL = 2000;  // 自动发射间隔(ms)
    const MIN_SPEED = 10;        // 最慢速度(s)
    const MAX_SPEED = 18;        // 最快速度(s)
    const LOCAL_STORAGE_KEY = 'guestbook_messages';

    let stage = null;
    let autoTimer = null;
    let presetIndex = 0;
    let trackLastUsed = new Array(TRACK_COUNT).fill(0); // 记录每条轨道上次使用时间

    // ========================
    //  初始化
    // ========================
    function init() {
        stage = document.querySelector('.danmaku-stage');
        if (!stage) return;

        // 绑定发送按钮
        const sendBtn = document.getElementById('danmakuSend');
        const msgInput = document.getElementById('danmakuMsg');
        const nickInput = document.getElementById('danmakuNick');

        if (sendBtn) {
            sendBtn.addEventListener('click', () => sendMessage(nickInput, msgInput));
        }
        if (msgInput) {
            msgInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    sendMessage(nickInput, msgInput);
                }
            });
        }

        // 加载 localStorage 中的历史留言
        const userMsgs = loadUserMessages();

        // 合并预置留言和历史留言，打乱顺序
        const allMessages = [
            ...PRESET_MESSAGES.map(m => ({ ...m, isUser: false })),
            ...userMsgs.map(m => ({ ...m, isUser: true })),
        ];
        shuffleArray(allMessages);

        // 初始发射一波弹幕（填满画布）
        const initialBatch = Math.min(6, allMessages.length);
        for (let i = 0; i < initialBatch; i++) {
            setTimeout(() => {
                const msg = allMessages[i];
                fireDanmaku(msg.nick, msg.text, msg.avatar, msg.isUser);
            }, i * 400);
        }

        // 开始自动轮播
        presetIndex = initialBatch % allMessages.length;
        startAutoPlay(allMessages);

        // 更新统计
        updateStats(userMsgs.length);

        // IntersectionObserver：仅当区域可见时才播放
        const section = document.getElementById('guestbook');
        if (section && 'IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        resumeAutoPlay(allMessages);
                    } else {
                        pauseAutoPlay();
                    }
                });
            }, { threshold: 0.1 });
            observer.observe(section);
        }
    }

    // ========================
    //  弹幕发射
    // ========================
    function fireDanmaku(nick, text, avatar, isUser = false) {
        if (!stage) return;

        const el = document.createElement('div');
        el.className = 'danmaku-item';

        // 选颜色
        const color = isUser ? 'indigo' : COLORS[Math.floor(Math.random() * COLORS.length)];
        el.setAttribute('data-color', color);
        if (isUser) el.setAttribute('data-user', 'true');

        // 随机速度
        const speed = MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED);
        el.style.setProperty('--speed', `${speed}s`);

        // 选轨道（优先选最久未使用的）
        const track = pickTrack();
        const topOffset = 8 + track * TRACK_HEIGHT;
        el.style.top = `${topOffset}px`;
        el.style.right = `-500px`; // 从右侧画布外开始

        // 构建内容
        el.innerHTML = `
            <span class="danmaku-avatar">${avatar || '💬'}</span>
            <span class="danmaku-nick">${escapeHtml(nick)}</span>
            <span class="danmaku-text">${escapeHtml(text)}</span>
        `;

        stage.appendChild(el);

        // 动画结束后移除
        el.addEventListener('animationend', () => el.remove());
    }

    // 选择轨道：优先选最久未使用的
    function pickTrack() {
        const now = Date.now();
        let bestTrack = 0;
        let bestTime = Infinity;

        for (let i = 0; i < TRACK_COUNT; i++) {
            if (now - trackLastUsed[i] > bestTime) continue;
            if (now - trackLastUsed[i] >= bestTime) continue;
            bestTrack = i;
            bestTime = now - trackLastUsed[i];
        }

        // 找最久未使用的
        let oldestTrack = 0;
        let oldestTime = trackLastUsed[0];
        for (let i = 1; i < TRACK_COUNT; i++) {
            if (trackLastUsed[i] < oldestTime) {
                oldestTime = trackLastUsed[i];
                oldestTrack = i;
            }
        }

        trackLastUsed[oldestTrack] = now;
        return oldestTrack;
    }

    // ========================
    //  自动轮播
    // ========================
    function startAutoPlay(allMessages) {
        if (allMessages.length === 0) return;
        autoTimer = setInterval(() => {
            const msg = allMessages[presetIndex % allMessages.length];
            fireDanmaku(msg.nick, msg.text, msg.avatar, msg.isUser);
            presetIndex++;
        }, AUTO_INTERVAL);
    }

    function pauseAutoPlay() {
        clearInterval(autoTimer);
        autoTimer = null;
    }

    function resumeAutoPlay(allMessages) {
        if (autoTimer) return;
        startAutoPlay(allMessages);
    }

    // ========================
    //  用户发送留言
    // ========================
    function sendMessage(nickInput, msgInput) {
        const nick = (nickInput?.value || '').trim() || '匿名访客';
        const text = (msgInput?.value || '').trim();

        if (!text) {
            // 输入框抖动提示
            msgInput?.focus();
            msgInput?.parentElement?.classList.add('shake');
            setTimeout(() => msgInput?.parentElement?.classList.remove('shake'), 500);
            return;
        }

        if (text.length > 50) {
            showToast('留言最长 50 个字哦 ✍️');
            return;
        }

        // 保存到 localStorage
        const userMsgs = loadUserMessages();
        const newMsg = { nick, text, avatar: '💬', time: Date.now() };
        userMsgs.push(newMsg);
        saveUserMessages(userMsgs);

        // 立即发射弹幕
        fireDanmaku(nick, text, '💬', true);

        // 清空输入框
        msgInput.value = '';
        msgInput.focus();

        // 提示
        showToast('留言已发射 🚀');

        // 更新统计
        updateStats(userMsgs.length);
    }

    // ========================
    //  localStorage 操作
    // ========================
    function loadUserMessages() {
        try {
            const data = localStorage.getItem(LOCAL_STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    }

    function saveUserMessages(msgs) {
        try {
            // 最多保留 100 条
            const trimmed = msgs.slice(-100);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(trimmed));
        } catch {
            // localStorage 满了就算了
        }
    }

    // ========================
    //  UI 辅助
    // ========================
    function showToast(msg) {
        const existing = document.querySelector('.danmaku-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'danmaku-toast';
        toast.textContent = msg;
        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }

    function updateStats(userCount) {
        const statsEl = document.querySelector('.danmaku-stats');
        if (statsEl) {
            const total = PRESET_MESSAGES.length + userCount;
            statsEl.innerHTML = `已有 <span>${total}</span> 条留言在飞 ✦`;
        }
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }

    // ========================
    //  启动
    // ========================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
