/**
 * blog.js — 博客列表 + 文章渲染 + TIL 碎片笔记
 * 依赖：marked.js（CDN 引入）
 */

(function () {
  let posts = [];
  let tilItems = [];
  let currentTag = 'all';
  let searchQuery = '';
  let currentTab = 'articles'; // 'articles' | 'til'

  // 判断当前是列表页还是文章页
  function getView() {
    const hash = window.location.hash;
    if (hash.startsWith('#/post/')) {
      return { type: 'article', slug: hash.replace('#/post/', '') };
    }
    return { type: 'list' };
  }

  // 文章数据后备（file:// 下 fetch 不可用时使用）
  const POSTS_FALLBACK = [
    {
      "slug": "ai-agent-design-patterns",
      "title": "AI Agent 设计模式与实战经验",
      "date": "2025-02-10",
      "tags": ["AI", "Agent", "架构设计"],
      "summary": "从流水分析 Agent 的实战出发，总结多阶协同 Agent 架构的设计模式、Prompt 工程技巧和评测体系搭建经验。",
      "readTime": 8,
      "file": "ai-agent-design-patterns.md"
    },
    {
      "slug": "prompt-engineering-production",
      "title": "Prompt Engineering：从入门到生产级",
      "date": "2025-01-20",
      "tags": ["AI", "Prompt", "实战"],
      "summary": "系统梳理 Prompt Engineering 的核心方法论，包括 CoT 思维链、Few-shot、结构化输出，以及在生产环境中的稳定性优化策略。",
      "readTime": 12,
      "file": "prompt-engineering-production.md"
    },
    {
      "slug": "pm-cursor-poc",
      "title": "产品经理如何用 Cursor 做 POC",
      "date": "2025-01-05",
      "tags": ["工程实践", "效率工具", "产品思维"],
      "summary": "作为产品经理，我如何借助 Cursor + Vibe Coding 快速验证产品想法，从构思到可交互 Demo 仅需半天。一个\"极客 PM\"的工程实践分享。",
      "readTime": 6,
      "file": "pm-cursor-poc.md"
    }
  ];

  const TIL_FALLBACK = [
    { "date": "2025-02-13", "content": "CSS `clip-path` 配合伪元素可以实现非常惊艳的 Glitch 文字故障效果，关键是用两个伪元素分别做红/青色偏移。", "tags": ["前端", "CSS"] },
    { "date": "2025-02-12", "content": "发现 Claude 3.5 在结构化输出（JSON mode）上比 GPT-4 更稳定，特别是嵌套层级较深时，幻觉率明显更低。", "tags": ["AI", "Prompt"] },
    { "date": "2025-02-11", "content": "Cursor 的 Agent 模式真的好用！可以让 AI 自主决定要读哪些文件、做哪些改动，而不是每一步都需要手动指定。", "tags": ["工具", "AI"] },
    { "date": "2025-02-10", "content": "Dify 的 Workflow 节点现在支持条件分支和循环了，可以实现更复杂的 Agent 逻辑，不再需要写代码胶水。", "tags": ["AI", "Agent"] },
    { "date": "2025-02-09", "content": "产品经理做 POC 的最大价值不是代码本身，而是通过实际构建来验证想法可行性，这个过程本身就能发现 PRD 中的盲区。", "tags": ["产品", "思考"] },
    { "date": "2025-02-08", "content": "requestAnimationFrame + 对象池是前端粒子动画的标配方案。50个粒子完全不会影响帧率，比 setTimeout 流畅太多。", "tags": ["前端", "性能"] },
    { "date": "2025-02-07", "content": "RAG 中的 Chunk 划分策略对检索质量影响巨大。按语义段落切分 + 重叠窗口的效果远好于简单的固定长度切分。", "tags": ["AI", "RAG"] },
    { "date": "2025-02-06", "content": "Figma 的 Auto Layout + Component Properties 组合使用，可以让设计系统的维护成本降低 80%。一改全改，真正的 Single Source of Truth。", "tags": ["设计", "Figma"] }
  ];

  // 加载文章索引
  async function loadPosts() {
    try {
      const res = await fetch('posts/index.json?v=' + Date.now());
      posts = await res.json();
      return posts;
    } catch (err) {
      console.warn('fetch 加载文章失败，使用内嵌数据:', err.message);
      posts = POSTS_FALLBACK;
      return posts;
    }
  }

  // 加载 TIL 碎片
  async function loadTIL() {
    try {
      const res = await fetch('data/til.json?v=' + Date.now());
      tilItems = await res.json();
      return tilItems;
    } catch (err) {
      console.warn('fetch 加载 TIL 失败，使用内嵌数据:', err.message);
      tilItems = TIL_FALLBACK;
      return tilItems;
    }
  }

  // 获取所有标签
  function getAllTags() {
    const tagSet = new Set();
    posts.forEach(p => p.tags.forEach(t => tagSet.add(t)));
    return Array.from(tagSet);
  }

  // 筛选文章
  function filterPosts() {
    return posts.filter(p => {
      const matchTag = currentTag === 'all' || p.tags.includes(currentTag);
      const matchSearch = !searchQuery ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchTag && matchSearch;
    });
  }

  // 渲染 TIL 碎片时间线
  function renderTILTimeline() {
    if (tilItems.length === 0) {
      return `
                <div class="blog-empty">
                    <div class="blog-empty-icon">📝</div>
                    <h3>暂无碎片笔记</h3>
                    <p>敬请期待</p>
                </div>
            `;
    }

    return `
            <div class="til-timeline">
                ${tilItems.map(item => `
                    <div class="til-card">
                        <div class="til-date">${item.date}</div>
                        <div class="til-content">${item.content}</div>
                        <div class="til-tags">
                            ${item.tags.map(t => `<span class="tag tag-glow btn-sm">${t}</span>`).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
  }

  // 渲染文章列表
  function renderList() {
    const app = document.getElementById('blogApp');
    const filtered = filterPosts();
    const tags = getAllTags();

    app.innerHTML = `
      <div class="blog-page">
        <div class="container">
          <div class="blog-header">
            <span class="section-label">✦ Blog</span>
            <h1 class="section-title">思考与 <span class="gradient-text">实践</span></h1>
            <p class="section-subtitle">AI · 产品思维 · 工程实践 · 学习笔记</p>
          </div>

          <!-- Tab 切换 -->
          <div class="blog-tabs">
            <button class="blog-tab ${currentTab === 'articles' ? 'active' : ''}" data-tab="articles">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
              文章 <span class="tab-count">${posts.length}</span>
            </button>
            <button class="blog-tab ${currentTab === 'til' ? 'active' : ''}" data-tab="til">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 20h9"/>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
              碎片 <span class="tab-count">${tilItems.length}</span>
            </button>
          </div>

          ${currentTab === 'articles' ? `
            <div class="blog-filters">
              <div class="blog-search">
                <svg class="blog-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input type="text" id="blogSearchInput" placeholder="搜索文章..." value="${searchQuery}">
              </div>
              <div class="blog-tags-filter">
                <button class="blog-tag-btn ${currentTag === 'all' ? 'active' : ''}" data-tag="all">全部</button>
                ${tags.map(t => `<button class="blog-tag-btn ${currentTag === t ? 'active' : ''}" data-tag="${t}">${t}</button>`).join('')}
              </div>
            </div>

            <div class="blog-grid" id="blogGrid">
              ${filtered.length > 0 ? filtered.map(renderCard).join('') : `
                <div class="blog-empty">
                  <div class="blog-empty-icon">📝</div>
                  <h3>没有找到匹配的文章</h3>
                  <p>试试其他关键词或标签</p>
                </div>
              `}
            </div>
          ` : renderTILTimeline()}
        </div>
      </div>
    `;

    // 绑定事件
    bindListEvents();
  }

  // 渲染单个文章卡片
  function renderCard(post) {
    return `
      <article class="blog-card" data-slug="${post.slug}">
        <div class="blog-card-meta">
          <span class="blog-card-date">📅 ${post.date}</span>
          <span class="blog-card-readtime">⏱️ ${post.readTime} 分钟</span>
        </div>
        <h2 class="blog-card-title">${post.title}</h2>
        <p class="blog-card-summary">${post.summary}</p>
        <div class="blog-card-tags">
          ${post.tags.map(t => `<span class="tag tag-glow">${t}</span>`).join('')}
        </div>
        <div class="blog-card-arrow">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>
      </article>
    `;
  }

  // 渲染文章详情
  async function renderArticle(slug) {
    const post = posts.find(p => p.slug === slug);
    if (!post) {
      window.location.hash = '';
      return;
    }

    const app = document.getElementById('blogApp');

    // 加载 Markdown
    let markdown = '';
    try {
      const res = await fetch(`posts/${post.file}`);
      markdown = await res.text();
    } catch (err) {
      markdown = '# 文章加载失败\n\n请稍后重试。';
    }

    // 用 marked 渲染
    const html = typeof marked !== 'undefined' ? marked.parse(markdown) : markdown;

    app.innerHTML = `
      <div class="article-page">
        <div class="container">
          <a class="article-back" href="blog.html">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            返回文章列表
          </a>

          <article>
            <div class="article-header">
              <div class="blog-card-meta">
                <span class="blog-card-date">📅 ${post.date}</span>
                <span class="blog-card-readtime">⏱️ ${post.readTime} 分钟阅读</span>
              </div>
              <h1 class="article-title">${post.title}</h1>
              <div class="blog-card-tags" style="margin-bottom: 24px;">
                ${post.tags.map(t => `<span class="tag tag-glow">${t}</span>`).join('')}
              </div>
              <p class="article-summary">${post.summary}</p>
            </div>
            <div class="article-content" id="articleContent">
              ${html}
            </div>
          </article>
        </div>
      </div>
    `;

    // 滚动到顶部
    window.scrollTo(0, 0);
  }

  // 绑定列表事件
  function bindListEvents() {
    // Tab 切换
    document.querySelectorAll('.blog-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        currentTab = tab.dataset.tab;
        renderList();
      });
    });

    // 搜索
    const searchInput = document.getElementById('blogSearchInput');
    if (searchInput) {
      let debounceTimer;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          searchQuery = e.target.value;
          renderList();
          // 重新聚焦搜索框
          const newInput = document.getElementById('blogSearchInput');
          if (newInput) {
            newInput.focus();
            newInput.setSelectionRange(newInput.value.length, newInput.value.length);
          }
        }, 300);
      });
    }

    // 标签筛选
    document.querySelectorAll('.blog-tag-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentTag = btn.dataset.tag;
        renderList();
      });
    });

    // 文章卡片点击
    document.querySelectorAll('.blog-card').forEach(card => {
      card.addEventListener('click', () => {
        const slug = card.dataset.slug;
        window.location.hash = '#/post/' + slug;
      });
    });
  }

  // 路由变化
  function onRouteChange() {
    const view = getView();
    if (view.type === 'article') {
      renderArticle(view.slug);
    } else {
      renderList();
    }
  }

  // 初始化
  async function init() {
    await Promise.all([loadPosts(), loadTIL()]);
    onRouteChange();
    window.addEventListener('hashchange', onRouteChange);
  }

  // 页面加载后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

