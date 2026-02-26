/**
 * bookshelf.js
 * 书架模块：从 JSON 加载书单，渲染 3D 书架
 */

window.initBookshelf = function () {
    const container = document.getElementById('bookshelfContainer');
    if (!container) return;

    fetch('data/books.json')
        .then(res => res.json())
        .then(books => renderBookshelf(books, container))
        .catch(err => console.warn('书架加载失败:', err));
};

function renderBookshelf(books, container) {
    const shelf = document.createElement('div');
    shelf.className = 'bookshelf';

    books.forEach(book => {
        const item = document.createElement('div');
        item.className = 'book-item';

        // 生成星星评分
        const stars = Array.from({ length: 5 }, (_, i) =>
            `<span class="star ${i < book.rating ? '' : 'empty'}">${i < book.rating ? '★' : '★'}</span>`
        ).join('');

        item.innerHTML = `
            <div class="book-cover">
                <div class="book-face" style="--book-color: ${book.color}; background: linear-gradient(135deg, ${book.color} 0%, ${adjustColor(book.color, -30)} 100%);">
                    <span class="book-emoji">${book.cover}</span>
                    <div class="book-title">${book.title}</div>
                    <div class="book-author">${book.author}</div>
                </div>
            </div>
            <div class="book-info">
                <div class="book-rating">${stars}</div>
                <div class="book-quote">"${book.quote}"</div>
                <span class="book-tag">${book.tag}</span>
            </div>
        `;

        shelf.appendChild(item);
    });

    container.appendChild(shelf);

    // 添加书架底板
    const shelfBoard = document.createElement('div');
    shelfBoard.className = 'bookshelf-shelf';
    container.appendChild(shelfBoard);

    // 添加拖拽提示
    const hint = document.createElement('div');
    hint.className = 'bookshelf-hint';
    hint.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
        左右滑动浏览更多
    `;
    container.appendChild(hint);
}

// 颜色加深工具函数
function adjustColor(hex, amount) {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
    const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
    return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
}
