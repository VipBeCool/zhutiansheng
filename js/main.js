/**
 * main.js — 主入口
 * 初始化所有模块
 */
document.addEventListener('DOMContentLoaded', function () {

    // 初始化导航
    if (typeof window.initNavigation === 'function') {
        window.initNavigation();
    }

    // 初始化动画
    if (typeof window.initAnimations === 'function') {
        window.initAnimations();
    }

    // 初始化交互特效（进度条 / 3D倾斜 / 自定义光标 / 磁吸按钮）
    if (typeof window.initEffects === 'function') {
        window.initEffects();
    }

    // 初始化命令行终端
    if (typeof window.initTerminal === 'function') {
        window.initTerminal();
    }

    // 初始化项目横向滚动
    if (typeof window.initHorizontalScroll === 'function') {
        window.initHorizontalScroll();
    }

    // 初始化书架
    if (typeof window.initBookshelf === 'function') {
        window.initBookshelf();
    }

    // 初始化简历弹窗
    if (typeof window.initResumeModal === 'function') {
        window.initResumeModal();
    }

    // 初始化项目详情弹窗
    if (typeof window.initProjectModal === 'function') {
        window.initProjectModal();
    }

    // 初始化职业旅程展开
    if (typeof window.initCareerExpand === 'function') {
        window.initCareerExpand();
    }

    // 初始化关于我双面切换
    if (typeof window.initAboutToggle === 'function') {
        window.initAboutToggle();
    }

    // 页面加载完成标记
    document.body.classList.add('loaded');

    // 修正从子页面跳转时 hash 锚点滚动位置
    if (window.location.hash) {
        var hash = window.location.hash;
        // 等待 reveal 动画和布局稳定后再修正位置
        setTimeout(function () {
            var target = document.querySelector(hash);
            if (!target) return;
            var navHeight = document.getElementById('navbar')?.offsetHeight || 72;
            var top = target.getBoundingClientRect().top + window.scrollY - navHeight + 60;
            window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
        }, 800);
    }

    // 控制台欢迎信息
    console.log('%c🚀 Kevin Zhu · AI+FinTech Product Architect',
        'color: #4F46E5; font-size: 16px; font-weight: bold;');
    console.log('%c本站由产品经理独立设计与开发 · 按 Ctrl+` 打开终端彩蛋',
        'color: #06B6D4; font-size: 12px;');
});
