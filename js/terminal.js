/**
 * terminal.js
 * 命令行终端彩蛋 — 仿终端交互界面
 */

(function () {
    // 命令数据库
    const COMMANDS = {
        help: {
            desc: '显示可用命令列表',
            run: () => [
                '<span class="cmd-accent">可用命令：</span>',
                '',
                '  <span class="cmd-text">whoami</span>        了解我是谁',
                '  <span class="cmd-text">skills</span>        查看技能清单',
                '  <span class="cmd-text">experience</span>    工作经历',
                '  <span class="cmd-text">projects</span>      核心项目',
                '  <span class="cmd-text">blog</span>          最新文章',
                '  <span class="cmd-text">contact</span>       联系方式',
                '  <span class="cmd-text">links</span>         社交链接',
                '  <span class="cmd-text">neofetch</span>      系统信息（彩蛋）',
                '  <span class="cmd-text">clear</span>         清屏',
                '  <span class="cmd-text">exit</span>          关闭终端',
                '',
                '<span class="cmd-warn">提示：输入命令名称后回车执行</span>'
            ]
        },

        whoami: {
            desc: '个人介绍',
            run: () => [
                '',
                '  <span class="cmd-accent">朱天胜 (Kevin Zhu)</span>',
                '  ──────────────────────',
                '  <span class="cmd-info">职位：</span>   资深产品经理 / AI+FinTech Product Architect',
                '  <span class="cmd-info">经验：</span>   14+ 年行业经验',
                '  <span class="cmd-info">专长：</span>   AI Agent · 金融科技 · 智能营销 · 征信数据',
                '  <span class="cmd-info">标签：</span>   PM 中的极客 · 全栈型产品经理',
                '  <span class="cmd-info">状态：</span>   <span class="cmd-text">● Open to Opportunities</span>',
                ''
            ]
        },

        skills: {
            desc: '技能清单',
            run: (args) => {
                const allSkills = [
                    { cat: 'AI & LLM', items: ['Agent/RAG 架构', 'Prompt Engineering', '模型微调(SFT+LoRA)', '评测体系', 'Dify/Coze'] },
                    { cat: '数据驱动', items: ['指标体系', '用户画像', '营销漏斗', 'A/B测试', '数据运营'] },
                    { cat: '设计能力', items: ['UI/UX设计', 'Figma/Sketch', '产品原型', 'PPT认证设计师'] },
                    { cat: '工程实践', items: ['Cursor/Vibe Coding', '前端开发', 'API设计', '技术方案评审'] },
                    { cat: '金融业务', items: ['信贷全周期', '财富管理', '征信产品', '支付清结算'] },
                    { cat: '增长运营', items: ['用户增长', '精准营销', '转化优化', '权益体系'] }
                ];

                if (args === '--top' || args === '-t') {
                    return [
                        '',
                        '  <span class="cmd-accent">Top 5 技能：</span>',
                        '  1. AI Agent/RAG 架构设计',
                        '  2. 产品全链路管理（0→1→N）',
                        '  3. 数据驱动运营增长',
                        '  4. UI/UX 设计与工程实践',
                        '  5. 金融科技业务理解',
                        ''
                    ];
                }

                const lines = ['', '  <span class="cmd-accent">技能矩阵：</span>', ''];
                allSkills.forEach(s => {
                    lines.push(`  <span class="cmd-warn">▸ ${s.cat}</span>`);
                    lines.push(`    ${s.items.join(' · ')}`);
                    lines.push('');
                });
                return lines;
            }
        },

        experience: {
            desc: '工作经历',
            run: (args) => {
                const jobs = [
                    { period: '2022.09 – 至今', company: '江苏省联合征信', role: '征信数据产品经理', highlight: 'AI Agent · 智能营销 · 流水分析' },
                    { period: '2021.08 – 2022.09', company: '统信软件技术', role: '用户产品经理', highlight: 'UOS 生态 · OA 应用' },
                    { period: '2016.03 – 2021.07', company: '京东科技 / 京东金融', role: '金融科技产品经理 P7', highlight: '千亿AUM · 银行精选 · 理财增长' },
                    { period: '2014.09 – 2016.03', company: '宽连十方', role: '商业化产品经理', highlight: 'SaaS · 运营商项目' },
                    { period: '2011.07 – 2014.09', company: '春宇/苏宁', role: '电商产品经理', highlight: '电商平台 · 供应链' }
                ];

                if (args === '--latest' || args === '-l') {
                    const j = jobs[0];
                    return [
                        '',
                        `  <span class="cmd-accent">${j.company}</span>`,
                        `  ${j.role} | ${j.period}`,
                        `  <span class="cmd-info">${j.highlight}</span>`,
                        ''
                    ];
                }

                const lines = ['', '  <span class="cmd-accent">职业旅程：</span>', ''];
                jobs.forEach(j => {
                    lines.push(`  <span class="cmd-warn">${j.period}</span>  ${j.company}`);
                    lines.push(`  ${j.role}`);
                    lines.push(`  <span class="cmd-info">${j.highlight}</span>`);
                    lines.push('');
                });
                return lines;
            }
        },

        projects: {
            desc: '核心项目',
            run: () => [
                '',
                '  <span class="cmd-accent">核心项目：</span>',
                '',
                '  <span class="cmd-text">[1]</span> 企业信贷流水分析 Agent',
                '      LLM + OCR + 200+ 风控规则 | 审查 2h→5min',
                '',
                '  <span class="cmd-text">[2]</span> 智能营销平台',
                '      数据+AI驱动 | 月匹配客户 2W 家',
                '',
                '  <span class="cmd-text">[3]</span> AI 客服 "苏晓惠"',
                '      RAG + SFT微调 | 满意度↑50%',
                '',
                '  <span class="cmd-text">[4]</span> "银行精选" F2B2C 存款平台',
                '      AUM 2000亿 | 持仓户 400万 | 日GMV 15亿',
                '',
                '  <span class="cmd-text">[5]</span> "固收+"理财增长',
                '      渗透率↑70% | 导流 160W 用户',
                ''
            ]
        },

        contact: {
            desc: '联系方式',
            run: () => [
                '',
                '  <span class="cmd-accent">联系方式：</span>',
                '',
                '  📧 邮箱    vipbecool@qq.com',
                '  📱 电话    186-6272-2418',
                '  💼 状态    <span class="cmd-text">● Open to Opportunities</span>',
                '',
                '  <span class="cmd-warn">期待与您探讨 AI+金融科技的无限可能！</span>',
                ''
            ]
        },

        blog: {
            desc: '博客文章',
            run: () => [
                '',
                '  <span class="cmd-accent">最新文章：</span>',
                '',
                '  <span class="cmd-text">[1]</span> AI Agent 设计模式与实战经验',
                '      <span class="cmd-info">2025-02 · #AI #Agent #架构</span>',
                '',
                '  <span class="cmd-text">[2]</span> Prompt Engineering 从入门到生产级',
                '      <span class="cmd-info">2025-01 · #AI #Prompt #实战</span>',
                '',
                '  <span class="cmd-text">[3]</span> 产品经理如何用 Cursor 做 POC',
                '      <span class="cmd-info">2025-01 · #工程实践 #效率</span>',
                '',
                '  <span class="cmd-warn">输入 open blog 或点击导航访问完整博客</span>',
                ''
            ]
        },

        links: {
            desc: '社交链接',
            run: () => [
                '',
                '  <span class="cmd-accent">社交链接：</span>',
                '',
                '  GitHub    github.com/kevinzhu',
                '  LinkedIn  linkedin.com/in/kevinzhu',
                '  Email     vipbecool@qq.com',
                ''
            ]
        },

        neofetch: {
            desc: '系统信息',
            run: () => [
                '',
                '  <span class="cmd-accent">      ╱╲</span>        <span class="cmd-text">kevin@portfolio</span>',
                '  <span class="cmd-accent">     ╱  ╲</span>       ────────────────',
                '  <span class="cmd-accent">    ╱    ╲</span>      <span class="cmd-info">OS:</span>      Portfolio v2.0',
                '  <span class="cmd-accent">   ╱  ▲   ╲</span>     <span class="cmd-info">Host:</span>    朱天胜',
                '  <span class="cmd-accent">  ╱  ╱ ╲   ╲</span>    <span class="cmd-info">Kernel:</span>  AI+FinTech',
                '  <span class="cmd-accent"> ╱  ╱   ╲   ╲</span>   <span class="cmd-info">Shell:</span>   PM/5.0-极客',
                '  <span class="cmd-accent">╱__╱     ╲___╲</span>  <span class="cmd-info">DE:</span>      Vanilla CSS',
                '                   <span class="cmd-info">WM:</span>      HTML + JS',
                '                   <span class="cmd-info">Uptime:</span>  14 years',
                '                   <span class="cmd-info">Memory:</span>  ∞ ideas / 24h',
                '',
                '  <span style="color:#ff5f56">██</span><span style="color:#ffbd2e">██</span><span style="color:#27c93f">██</span><span style="color:#06B6D4">██</span><span style="color:#4F46E5">██</span><span style="color:#8B5CF6">██</span><span style="color:#EC4899">██</span>',
                ''
            ]
        },

        clear: {
            desc: '清屏',
            run: () => '__CLEAR__'
        },

        exit: {
            desc: '关闭终端',
            run: () => '__EXIT__'
        }
    };

    // 欢迎信息
    const WELCOME = [
        '<span class="cmd-accent">╔══════════════════════════════════════════════════╗</span>',
        '<span class="cmd-accent">║</span>  <span class="cmd-text">Kevin Zhu · AI+FinTech Product Architect</span>        <span class="cmd-accent">║</span>',
        '<span class="cmd-accent">║</span>  <span class="cmd-info">欢迎来到我的终端！输入 help 查看可用命令。</span>      <span class="cmd-accent">║</span>',
        '<span class="cmd-accent">╚══════════════════════════════════════════════════╝</span>',
        ''
    ];

    let isOpen = false;
    let overlay, body, input;
    let commandHistory = [];
    let historyIndex = -1;

    // 创建终端 DOM
    function createTerminal() {
        overlay = document.createElement('div');
        overlay.className = 'terminal-overlay';
        overlay.innerHTML = `
      <div class="terminal-window">
        <div class="terminal-header">
          <span class="terminal-dot red"></span>
          <span class="terminal-dot yellow"></span>
          <span class="terminal-dot green"></span>
          <span class="terminal-title">kevin@portfolio ~ zsh</span>
        </div>
        <div class="terminal-body" id="terminalBody"></div>
      </div>
    `;
        document.body.appendChild(overlay);

        body = overlay.querySelector('#terminalBody');

        // 点击遮罩关闭
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeTerminal();
        });

        // 关闭按钮
        overlay.querySelector('.terminal-dot.red').addEventListener('click', closeTerminal);

        // 创建终端提示按钮
        const hint = document.createElement('div');
        hint.className = 'terminal-hint';
        hint.innerHTML = '<span>⌨️</span> <kbd>Ctrl</kbd> + <kbd>`</kbd> 打开终端';
        hint.addEventListener('click', toggleTerminal);
        document.body.appendChild(hint);
    }

    // 添加输出行
    function addOutput(lines) {
        if (Array.isArray(lines)) {
            lines.forEach(line => {
                const div = document.createElement('div');
                div.className = 'terminal-output-line';
                div.innerHTML = line;
                body.appendChild(div);
            });
        }
        addInputLine();
        body.scrollTop = body.scrollHeight;
    }

    // 添加输入行
    function addInputLine() {
        const line = document.createElement('div');
        line.className = 'terminal-input-line';
        line.innerHTML = `
      <span class="user-at">kevin</span><span style="color:rgba(255,255,255,0.3)">@</span><span class="dir-path">portfolio</span>
      <span class="dollar">$</span>
    `;
        input = document.createElement('input');
        input.className = 'terminal-input';
        input.type = 'text';
        input.autocomplete = 'off';
        input.spellcheck = false;

        input.addEventListener('keydown', handleInput);
        line.appendChild(input);
        body.appendChild(line);
        input.focus();
    }

    // 处理输入
    function handleInput(e) {
        if (e.key === 'Enter') {
            const cmd = input.value.trim();
            input.disabled = true;

            if (cmd) {
                commandHistory.push(cmd);
                historyIndex = commandHistory.length;
                executeCommand(cmd);
            } else {
                addInputLine();
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                input.value = commandHistory[historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                input.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                input.value = '';
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            // 简单自动补全
            const partial = input.value.trim().toLowerCase();
            const matches = Object.keys(COMMANDS).filter(c => c.startsWith(partial));
            if (matches.length === 1) {
                input.value = matches[0];
            }
        }
    }

    // 执行命令
    function executeCommand(rawCmd) {
        const parts = rawCmd.trim().split(/\s+/);
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1).join(' ');

        if (cmd === 'open' && args === 'blog') {
            window.location.href = 'blog.html';
            return;
        }

        if (COMMANDS[cmd]) {
            const result = COMMANDS[cmd].run(args);
            if (result === '__CLEAR__') {
                body.innerHTML = '';
                addInputLine();
                return;
            }
            if (result === '__EXIT__') {
                closeTerminal();
                return;
            }
            addOutput(result);
        } else {
            addOutput([
                `<span class="cmd-error">zsh: command not found: ${cmd}</span>`,
                '<span class="cmd-info">输入 <span class="cmd-text">help</span> 查看可用命令</span>',
                ''
            ]);
        }
    }

    // 打开终端
    function openTerminal() {
        isOpen = true;
        body.innerHTML = '';
        addOutput(WELCOME);
        overlay.classList.add('active');
        setTimeout(() => input && input.focus(), 300);
    }

    // 关闭终端
    function closeTerminal() {
        isOpen = false;
        overlay.classList.remove('active');
    }

    // 切换
    function toggleTerminal() {
        isOpen ? closeTerminal() : openTerminal();
    }

    // 快捷键监听
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === '`') {
            e.preventDefault();
            toggleTerminal();
        }
        if (e.key === 'Escape' && isOpen) {
            closeTerminal();
        }
    });

    // 初始化
    window.initTerminal = function () {
        createTerminal();
    };
})();
