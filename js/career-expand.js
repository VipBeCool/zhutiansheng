/**
 * career-expand.js
 * 职业旅程详情展开功能 — 点击展开/收起更多工作内容
 */
window.initCareerExpand = function () {

    // 各段工作的详细数据（来自简历）
    var CAREERS = {
        lhzx: {
            duties: '负责将征信数据资产产品化，设计评分模型与画像报告等产品，构建覆盖信贷全周期的智能营销与风控解决方案。',
            highlights: [
                '主导<strong>企业信贷流水分析Agent</strong>，搭建多阶协同Agent架构，将单笔业务审查从2小时压缩至5分钟',
                '建设<strong>智能营销平台</strong>，整合征信产品能力，每月帮助合作机构匹配客户企业近2W家',
                '打造<strong>AI客服"苏晓惠"</strong>，FAQ命中率提升至85%，人工转接率降低至25%，满意度提升50%'
            ],
            metrics: [
                { value: '3个', label: 'AI项目落地' },
                { value: '200+', label: '风控规则' },
                { value: '2W/月', label: '客户匹配' }
            ]
        },

        tongxin: {
            duties: '负责对标企微的UOS内置OA应用（邮箱+IM）产品设计、生态应用镜像管理及插件管理平台系统规划。',
            highlights: [
                '全新改版邮箱应用，<strong>用户增长30%</strong>',
                '应用商店下载量较上版本<strong>翻倍</strong>，在UOS V20版本中活跃占比超<strong>80%</strong>',
                '负责生态应用镜像管理及插件管理平台的系统规划'
            ],
            metrics: [
                { value: '↑30%', label: '用户增长' },
                { value: '×2', label: '下载翻倍' },
                { value: '80%', label: '活跃占比' }
            ]
        },

        jd: {
            duties: '"银行精选"存款平台PM，负责平台搭建、产品引入和创设；负责保险理财、券商理财、养老保障等固收理财产品设计。',
            highlights: [
                '<strong>"银行精选"存款平台</strong>0-1搭建，持仓户400万，日GMV 15亿，AUM 2000亿',
                '推出理财日历、复投/转仓/定投等投资工具，<strong>AUM提升至150亿</strong>，频道日活由70万提升至120万',
                '负责<strong>"工银小白"数字银行</strong>业务，货基保有5亿，开户拉新100万',
                '主导信用卡还款、转账、缴费等<strong>支付生态</strong>产品，实现定期还款、场景理财、代偿分期等多个产品的0-1'
            ],
            metrics: [
                { value: '2000亿', label: 'AUM' },
                { value: '400万', label: '持仓户' },
                { value: '15亿/日', label: 'GMV' },
                { value: '120万', label: '日活' }
            ]
        },

        kuanlian: {
            duties: '负责运营商工单平台、OA管理平台等SaaS系统设计和项目支持。',
            highlights: [
                '完成对<strong>中国移动</strong>和<strong>博西集团</strong>等重点项目交付',
                '负责运营商工单平台的全流程设计与上线'
            ],
            metrics: [
                { value: '2个', label: '重点项目' },
                { value: 'SaaS', label: '系统设计' }
            ]
        },

        chunyu: {
            duties: '负责大宗商品电商Chemon云化工及春宇供应链管理平台的产品设计工作。',
            highlights: [
                '<strong>0-1完成</strong>大宗商品电商系统设计和上线',
                '春宇供应链管理平台的产品设计与项目推进'
            ],
            metrics: [
                { value: '0→1', label: '系统上线' },
                { value: 'B2B', label: '电商平台' }
            ]
        },

        suning: {
            duties: '负责苏宁C店开放平台项目商家入驻管理产品设计工作。',
            highlights: [
                '搭建并维护苏宁易购<strong>用户评价体系</strong>',
                '设计<strong>商家评级考核体系</strong>，完成商家入驻全流程的0-1搭建与上线'
            ],
            metrics: [
                { value: '0→1', label: '入驻系统' },
                { value: '评价+评级', label: '双体系搭建' }
            ]
        }
    };

    var keys = ['lhzx', 'tongxin', 'jd', 'kuanlian', 'chunyu', 'suning'];
    var items = document.querySelectorAll('.timeline-item');

    items.forEach(function (item, index) {
        var key = keys[index];
        if (!key || !CAREERS[key]) return;

        var data = CAREERS[key];

        // 给 timeline-item 添加 data 属性
        item.setAttribute('data-career', key);

        // 构建展开内容 HTML
        var highlightsHtml = data.highlights.map(function (h) {
            return '<li>' + h + '</li>';
        }).join('');

        var metricsHtml = data.metrics.map(function (m) {
            return '<div class="career-expand-metric">' +
                '<span class="career-expand-metric-value">' + m.value + '</span>' +
                '<span class="career-expand-metric-label">' + m.label + '</span>' +
                '</div>';
        }).join('');

        var expandHtml =
            '<div class="career-expand">' +
            '  <div class="career-expand-inner">' +
            '    <div class="career-expand-duties">' + data.duties + '</div>' +
            '    <ul class="career-expand-highlights">' + highlightsHtml + '</ul>' +
            '    <div class="career-expand-metrics">' + metricsHtml + '</div>' +
            '  </div>' +
            '</div>';

        // 创建展开按钮
        var btn = document.createElement('button');
        btn.className = 'career-expand-btn';
        btn.innerHTML = '<span class="career-expand-btn-text">查看详情</span><span class="career-expand-btn-icon">↓</span>';

        // 在 timeline-highlights 后面插入
        var highlights = item.querySelector('.timeline-highlights');
        if (highlights) {
            highlights.insertAdjacentHTML('afterend', expandHtml);
            highlights.insertAdjacentElement('afterend', btn);
            // 按钮要在展开区域前面
            var expandEl = item.querySelector('.career-expand');
            item.insertBefore(btn, expandEl);
        }

        // 点击事件
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            var expand = item.querySelector('.career-expand');
            var inner = expand.querySelector('.career-expand-inner');
            var isOpen = item.classList.contains('career-expanded');

            if (isOpen) {
                // 收起
                expand.style.maxHeight = expand.scrollHeight + 'px';
                // 触发 reflow
                expand.offsetHeight;
                expand.style.maxHeight = '0';
                item.classList.remove('career-expanded');
                btn.querySelector('.career-expand-btn-text').textContent = '查看详情';
            } else {
                // 展开
                expand.style.maxHeight = inner.scrollHeight + 20 + 'px';
                item.classList.add('career-expanded');
                btn.querySelector('.career-expand-btn-text').textContent = '收起';
            }
        });
    });
};
