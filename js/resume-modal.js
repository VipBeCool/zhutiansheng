/**
 * 简历弹窗模块
 * 双通道：微信二维码 + 口令下载
 * 口令算法：(月+日) 拼接 (周+时)，周日=7，不补0
 */
window.initResumeModal = function () {
    // 微信二维码图片
    var qrImageHTML = '<img src="assets/images/wechat-qr.png" alt="微信二维码" width="176" height="176">';

    // 简历文件路径
    var resumePath = 'assets/resume/zhutiansheng-resume.pdf';

    // 创建弹窗 DOM
    var overlay = document.createElement('div');
    overlay.className = 'resume-modal-overlay';
    overlay.innerHTML =
        '<div class="resume-modal">' +
        '<button class="resume-modal-close" aria-label="关闭">✕</button>' +
        '<h3 class="resume-modal-title">📋 获取我的简历</h3>' +

        // 方式一：口令下载
        '<div class="resume-modal-section">' +
        '<p class="resume-modal-section-label">🔑 口令下载</p>' +
        '<p class="resume-modal-section-desc">输入口令，即刻下载完整简历</p>' +
        '<div class="resume-modal-code-row">' +
        '<input type="text" class="resume-modal-code-input" placeholder="输入口令" maxlength="4" autocomplete="off">' +
        '<button class="resume-modal-code-btn">下载</button>' +
        '</div>' +
        '<p class="resume-modal-code-msg"></p>' +
        '<p class="resume-modal-code-hint">💡 口令获取方式：添加微信或关注公众号</p>' +
        '</div>' +

        // 分隔线
        '<div class="resume-modal-divider">或</div>' +

        // 方式二：微信二维码
        '<div class="resume-modal-section">' +
        '<p class="resume-modal-section-label">💬 微信获取</p>' +
        '<div class="resume-modal-qr">' + qrImageHTML + '</div>' +
        '<p class="resume-modal-hint">微信扫一扫 · 备注 <span>「简历」</span></p>' +
        '</div>' +

        // 底部链接
        '<a class="resume-modal-contact" href="#contact">📞 查看联系方式</a>' +
        '</div>';

    document.body.appendChild(overlay);

    var closeBtn = overlay.querySelector('.resume-modal-close');
    var codeInput = overlay.querySelector('.resume-modal-code-input');
    var codeBtn = overlay.querySelector('.resume-modal-code-btn');
    var codeMsg = overlay.querySelector('.resume-modal-code-msg');

    // 生成当前口令：(月+日) 拼接 (周+时)，周日=7
    function generateCode() {
        var now = new Date();
        var part1 = now.getMonth() + 1 + now.getDate();   // 月+日
        var dow = now.getDay();                             // 0=周日
        var part2 = (dow === 0 ? 7 : dow) + now.getHours(); // 周+时
        return String(part1) + String(part2);
    }

    // 验证口令并下载
    function verifyAndDownload() {
        var input = codeInput.value.trim();
        if (!input) {
            showMsg('请输入口令', 'error');
            codeInput.focus();
            return;
        }
        if (input === generateCode()) {
            showMsg('✅ 验证成功，正在下载...', 'success');
            // 触发下载
            var a = document.createElement('a');
            a.href = resumePath;
            a.download = '朱天胜-产品经理简历.pdf';
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            // 1.5 秒后清空
            setTimeout(function () {
                codeInput.value = '';
                codeMsg.textContent = '';
                codeMsg.className = 'resume-modal-code-msg';
            }, 1500);
        } else {
            showMsg('❌ 口令不正确，请重新输入', 'error');
            codeInput.value = '';
            codeInput.focus();
        }
    }

    // 显示提示消息
    function showMsg(text, type) {
        codeMsg.textContent = text;
        codeMsg.className = 'resume-modal-code-msg ' + type;
    }

    // 绑定事件
    codeBtn.addEventListener('click', verifyAndDownload);
    codeInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') verifyAndDownload();
    });

    // 打开弹窗
    function openModal(e) {
        e.preventDefault();
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        // 自动聚焦到口令输入框
        setTimeout(function () { codeInput.focus(); }, 350);
    }

    // 关闭弹窗
    function closeModal() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        codeInput.value = '';
        codeMsg.textContent = '';
        codeMsg.className = 'resume-modal-code-msg';
    }

    // 绑定所有「获取简历」按钮
    document.querySelectorAll('.nav-cta, [data-resume-modal]').forEach(function (btn) {
        btn.addEventListener('click', openModal);
    });

    // 关闭按钮
    closeBtn.addEventListener('click', closeModal);

    // 点击遮罩层关闭
    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closeModal();
    });

    // 查看联系方式
    var contactLink = overlay.querySelector('.resume-modal-contact');
    if (contactLink) {
        contactLink.addEventListener('click', function (e) {
            e.preventDefault();
            closeModal();
            var target = document.querySelector('#contact');
            if (target) {
                var navHeight = document.getElementById('navbar')?.offsetHeight || 72;
                var top = target.getBoundingClientRect().top + window.scrollY - navHeight + 60;
                window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
            } else {
                window.location.href = 'index.html#contact';
            }
        });
    }

    // ESC 关闭
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeModal();
        }
    });
};
