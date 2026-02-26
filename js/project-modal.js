/**
 * 项目详情弹窗模块
 * 点击项目卡片弹出详细内容
 */
window.initProjectModal = function () {

    // 项目详细数据（来自简历）
    const PROJECTS = {
        agent: {
            icon: '🤖',
            category: 'AI · Agent · LLM',
            title: '企业信贷流水分析 Agent',
            period: '2025.09 – 至今 · 江苏省联合征信',
            background: '针对银行信贷流水审核效率低、欺诈风险隐蔽及数据非结构化痛点，构建基于LLM的智能分析Agent。融合OCR与大模型推理能力实现流水标准化清洗，通过风控模型识别异常并量化经营画像，辅助机构授信决策。',
            highlights: [
                '<strong>规则引擎与特征工程</strong>：遵循"交易摘要分析 > 风险规则判定 > 经营行为画像"业务流向，建立包含造假识别、集中度分析、关联交易在内的11大类200+风控规则，以多维交易图谱形式还原企业真实经营性现金流。',
                '<strong>Agent流程编排</strong>：搭建"分类-计算-写作"多阶协同Agent架构，利用CoT思维链增强模型对复杂经营逻辑验证等的推理能力，实现从原始数据到专业分析报告的端到端自动化。',
                '<strong>效率提升</strong>：将单笔业务审查耗时从2小时压缩至5-10分钟，大幅提升审批效率。'
            ],
            tags: ['Agent 架构', 'CoT 推理', '风控引擎', 'OCR', 'Prompt Engineering', 'LLM'],
            metrics: [
                { value: '200+', label: '风控规则' },
                { value: '11类', label: '规则分类' },
                { value: '2h→5min', label: '审查耗时' },
                { value: '端到端', label: '自动化' }
            ]
        },

        marketing: {
            icon: '📊',
            category: 'AI · 营销 · Data',
            title: '智能营销平台',
            period: '2023.09 – 至今 · 江苏省联合征信',
            background: '针对信贷展业获客成本高、人工尽调低效及风控滞后痛点，建设数据+AI驱动的智能营销平台。引入LLM重构客户触达与风险识别链路，解决系统支持缺失难题，实现营销精准化与风控前置化，大幅提升展业人效。',
            highlights: [
                '<strong>营销获客智能体</strong>：梳理客户洞察 > 营销触达 > 前置风控服务链路，从征信资质、融资意向、风控评级三个维度构建智能营销体，预设规则自动圈选目标客户。',
                '<strong>多Agent场景</strong>：结合业务场景开发线上触达、尽调助手、咨询问答多个Agent，覆盖展业全链路。',
                '<strong>征信产品服务集成</strong>：将地图获客、产业链获客、关系图谱、风险预警等多个征信产品及模型能力整合进营销平台整体pipeline。'
            ],
            tags: ['LLM', '智能获客', '风控前置', '数据驱动', 'Agent'],
            metrics: [
                { value: '2W', label: '月匹配客户' },
                { value: '3维度', label: '智能圈选' },
                { value: '多Agent', label: '场景覆盖' }
            ]
        },

        'ai-cs': {
            icon: '💬',
            category: 'AI · NLP · Agent',
            title: 'AI 客服 "苏晓惠"',
            period: '2024.11 – 2025.04 · 江苏省联合征信',
            background: '原客服系统NLP泛化能力差、会话缺乏连贯，借助大模型技术优化意图理解、情绪识别，打造成支持多轮对话的Agent问答助手，在政策解读、流程咨询、产品推荐等方面提高应答效率，提供拟人的对话体验。',
            highlights: [
                '<strong>Prompt调优</strong>：结合意图识别设计不同提示词模版，定义角色/技能/限制和few-shot，提升模型指令理解和输出。',
                '<strong>RAG知识库和意图管理</strong>：参与数据预处理、切片策略定义、向量存储更新、pipeline设计，实现RAG问答；借助LLM对线上问答数据自动生成代表问、相似问并管理意图分类，提升意图覆盖率。',
                '<strong>多轮对话设计</strong>：通过会话历史记录、关键信息提取、对话状态管理、中断逻辑设置等，实现多轮对话能力。',
                '<strong>评测优化</strong>：主导产品评估体系定义，跟踪badcase逆向排查分析。通过问题分类补全、意图节点优化、引入小模型SFT+Lora微调及提示词分层拆分等持续优化。'
            ],
            tags: ['RAG', 'SFT微调', '多轮对话', 'Prompt', '意图管理', '评测体系'],
            metrics: [
                { value: '85%', label: 'FAQ命中率' },
                { value: '↓25%', label: '转接率' },
                { value: '↑50%', label: '满意度提升' },
                { value: 'Lora', label: '微调优化' }
            ]
        },

        fund: {
            icon: '📈',
            category: '金融 · 增长 · 运营',
            title: '"固收+"理财业务增长',
            period: '2019.04 – 2021.07 · 京东科技',
            background: '京东固收理财SKU种类多、选择难，部分产品转化和持仓数据差。围绕产品标签和客户画像，规划千人千面的"固收+"频道，整合各业务持仓、统一流程体验，通过业务间交叉营销，品类平均渗透率提升70%。',
            highlights: [
                '<strong>构建精准营销体系</strong>：基于营销场景和业务流程，规划落地标签体系，设计标签管理、人群包圈选、人群分析、用户分群等模块，通过搭建人群圈选能力与营销活动、优惠券、触达渠道等模块打通，实现对用户的精准营销。',
                '<strong>营销工具能力建设</strong>：搭建营销活动、优惠券、消息触达、营销统计等模块，支持发红包、灌券、拼团、老带新等营销活动的配置与管理，挖掘APP内外部流量。',
                '<strong>数据运营</strong>：构建业务数据指标体系，包括营销转化漏斗、触达漏斗、人群分析等，优化营销配置和策略。'
            ],
            tags: ['增长策略', '精准营销', '标签体系', '数据运营', '用户分群'],
            metrics: [
                { value: '70%', label: '渗透率提升' },
                { value: '160W', label: '导流用户' },
                { value: '20W', label: '拉新开户' },
                { value: '9W', label: '首投转化' }
            ]
        },

        bank: {
            icon: '🏦',
            category: '金融 · 平台 · 交易',
            title: '"银行精选" F2B2C 存款平台',
            period: '2018.02 – 2021.07 · 京东科技',
            background: '事业部战略项目，接保本存款应对理财破刚兑。梳理各行存款产品形态、交易结构和计结息规则，形成用户端电子户开户、充值提现、交易、持仓、赎回及后台端产品管理、机构管理、营销管理、对账管理等功能的完整平台。',
            highlights: [
                '<strong>产品矩阵管理</strong>：设计在线交易流程，接入标准产品，联合银行设计结构和权益创新的"智能存款"，结合场景设计定存、转存和比价投顾功能。SKU占比10%的智能存款，平台保有占比超70%。',
                '<strong>会员权益体系搭建</strong>：含加息/红包券、人群标签圈选、策略编排，管控用户触达频控和消息策略，实现精细化营销触达，整体营销券码投放使用量67%。',
                '<strong>异业合作</strong>：API服务接入外部场景生态，推动远洋地产购房验资、电信商城分期购机等项目落地，拉新占比12%。'
            ],
            tags: ['平台架构', '智能存款', '0-1搭建', '异业合作', '交易系统', '营销体系'],
            metrics: [
                { value: '2000亿', label: 'AUM' },
                { value: '400万', label: '持仓户' },
                { value: '15亿/日', label: 'GMV' },
                { value: '67%', label: '营销使用率' }
            ]
        }
    };

    // 创建弹窗容器
    const overlay = document.createElement('div');
    overlay.className = 'project-modal-overlay';
    overlay.innerHTML = '<div class="project-modal"></div>';
    document.body.appendChild(overlay);

    const modal = overlay.querySelector('.project-modal');

    // 渲染弹窗内容
    function renderModal(key) {
        var p = PROJECTS[key];
        if (!p) return;

        var tagsHtml = p.tags.map(function (t) {
            return '<span class="tag tag-glow">' + t + '</span>';
        }).join('');

        var highlightsHtml = p.highlights.map(function (h) {
            return '<li>' + h + '</li>';
        }).join('');

        var metricsHtml = p.metrics.map(function (m) {
            return '<div class="project-modal-metric">' +
                '<div class="project-modal-metric-value">' + m.value + '</div>' +
                '<div class="project-modal-metric-label">' + m.label + '</div>' +
                '</div>';
        }).join('');

        modal.innerHTML =
            '<button class="project-modal-close" aria-label="关闭">✕</button>' +
            '<div class="project-modal-header">' +
            '  <div class="project-modal-icon">' + p.icon + '</div>' +
            '  <div class="project-modal-header-info">' +
            '    <span class="project-modal-category">' + p.category + '</span>' +
            '    <h3 class="project-modal-title">' + p.title + '</h3>' +
            '    <div class="project-modal-period">' + p.period + '</div>' +
            '  </div>' +
            '</div>' +
            '<div class="project-modal-body">' +
            '  <div class="project-modal-bg">' + p.background + '</div>' +
            '  <h4 class="project-modal-section-title">核心工作</h4>' +
            '  <ul class="project-modal-highlights">' + highlightsHtml + '</ul>' +
            '  <div class="project-modal-tags">' + tagsHtml + '</div>' +
            '  <div class="project-modal-metrics">' + metricsHtml + '</div>' +
            '</div>';

        // 重新绑定关闭按钮
        modal.querySelector('.project-modal-close').addEventListener('click', closeModal);
    }

    // 打开弹窗
    function openModal(key) {
        renderModal(key);
        modal.scrollTop = 0;
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // 关闭弹窗
    function closeModal() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // 绑定卡片点击事件
    document.querySelectorAll('.project-card[data-project]').forEach(function (card) {
        card.addEventListener('click', function () {
            var key = this.getAttribute('data-project');
            openModal(key);
        });
    });

    // 点击遮罩关闭
    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closeModal();
    });

    // ESC 关闭
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeModal();
        }
    });
};
