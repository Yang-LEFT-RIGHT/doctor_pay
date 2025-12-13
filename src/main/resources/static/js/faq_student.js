// js/faq.js - 常见问题页面交互
document.addEventListener('DOMContentLoaded', function() {
    console.log('常见问题页面加载完成');
    
    // 初始化FAQ交互
    initFAQInteraction();
    
    // 初始化分类过滤
    initCategoryFilter();
    
    // 初始化搜索功能
    initSearch();
    
    // 更新通知计数
    updateNotificationCount();
});

function updateNotificationCount() {
    if (window.notificationSystem) {
        const unreadCount = window.notificationSystem.notifications.filter(n => !n.read).length;
        document.getElementById('notificationCount').textContent = unreadCount;
        document.getElementById('sidebarNotificationCount').textContent = unreadCount;
    }
}

function initFAQInteraction() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const toggleBtn = item.querySelector('.faq-toggle');
        const question = item.querySelector('.faq-question');
        
        // 为问题和切换按钮添加点击事件
        [toggleBtn, question].forEach(element => {
            element.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleFAQItem(item);
            });
        });
    });
    
    // 默认展开第一个FAQ项
    if (faqItems.length > 0) {
        setTimeout(() => {
            faqItems[0].classList.add('expanded');
        }, 300);
    }
}

function toggleFAQItem(item) {
    const isExpanded = item.classList.contains('expanded');
    
    // 关闭所有其他FAQ项
    if (!isExpanded) {
        document.querySelectorAll('.faq-item.expanded').forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('expanded');
            }
        });
    }
    
    // 切换当前项
    item.classList.toggle('expanded');
}

function initCategoryFilter() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const faqItems = document.querySelectorAll('.faq-item');
    const categories = document.querySelectorAll('.faq-category');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // 更新活动按钮
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 过滤显示内容
            if (category === 'all') {
                // 显示所有内容
                faqItems.forEach(item => {
                    item.style.display = 'block';
                    item.style.opacity = '1';
                });
                categories.forEach(cat => {
                    cat.style.display = 'block';
                });
            } else {
                // 隐藏所有FAQ项和分类
                faqItems.forEach(item => {
                    item.style.display = 'none';
                    item.style.opacity = '0';
                });
                categories.forEach(cat => {
                    cat.style.display = 'none';
                });
                
                // 显示匹配的分类
                const targetCategory = document.getElementById(`${category}-category`);
                if (targetCategory) {
                    targetCategory.style.display = 'block';
                    
                    // 显示该分类下的FAQ项
                    const matchingItems = targetCategory.querySelectorAll(`.faq-item[data-category="${category}"]`);
                    matchingItems.forEach(item => {
                        setTimeout(() => {
                            item.style.display = 'block';
                            setTimeout(() => {
                                item.style.opacity = '1';
                            }, 10);
                        }, 10);
                    });
                }
                
                // 展开该分类的第一个FAQ项
                const firstItem = targetCategory?.querySelector('.faq-item');
                if (firstItem) {
                    setTimeout(() => {
                        document.querySelectorAll('.faq-item.expanded').forEach(item => {
                            item.classList.remove('expanded');
                        });
                        firstItem.classList.add('expanded');
                    }, 100);
                }
            }
        });
    });
}

function initSearch() {
    const searchInput = document.getElementById('faqSearch');
    const searchBtn = document.querySelector('.search-btn');
    
    // 搜索按钮点击事件
    searchBtn.addEventListener('click', searchFAQ);
    
    // 输入框回车事件
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchFAQ();
        }
    });
}

function searchFAQ() {
    const searchInput = document.getElementById('faqSearch');
    const query = searchInput.value.trim().toLowerCase();
    
    if (!query) {
        // 如果搜索框为空，重置显示
        document.querySelectorAll('.faq-category').forEach(cat => {
            cat.style.display = 'block';
        });
        document.querySelectorAll('.faq-item').forEach(item => {
            item.style.display = 'block';
            item.style.opacity = '1';
        });
        return;
    }
    
    // 隐藏所有FAQ项和分类
    document.querySelectorAll('.faq-category').forEach(cat => {
        cat.style.display = 'none';
    });
    
    let foundItems = false;
    
    // 搜索所有FAQ项
    document.querySelectorAll('.faq-item').forEach(item => {
        const question = item.querySelector('h3').textContent.toLowerCase();
        const answer = item.querySelector('.faq-answer-content')?.textContent.toLowerCase() || '';
        
        if (question.includes(query) || answer.includes(query)) {
            // 显示包含该FAQ项的分类
            const parentCategory = item.closest('.faq-category');
            if (parentCategory) {
                parentCategory.style.display = 'block';
            }
            
            // 显示该FAQ项
            item.style.display = 'block';
            item.style.opacity = '1';
            item.classList.add('highlighted');
            
            // 高亮搜索关键词
            highlightText(item, query);
            
            foundItems = true;
        } else {
            item.style.display = 'none';
            item.classList.remove('highlighted');
        }
    });
    
    // 如果没有找到结果，显示提示
    if (!foundItems) {
        showNoResultsMessage(query);
    }
    
    // 重置分类按钮状态
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector('.category-btn[data-category="all"]').classList.add('active');
}

function highlightText(element, query) {
    const question = element.querySelector('h3');
    const answer = element.querySelector('.faq-answer-content');
    
    if (question) {
        const originalText = question.textContent;
        const highlighted = originalText.replace(
            new RegExp(query, 'gi'),
            match => `<span class="search-highlight">${match}</span>`
        );
        question.innerHTML = highlighted;
    }
    
    if (answer) {
        const originalText = answer.textContent;
        const highlighted = originalText.replace(
            new RegExp(query, 'gi'),
            match => `<span class="search-highlight">${match}</span>`
        );
        answer.innerHTML = highlighted;
    }
}

function showNoResultsMessage(query) {
    // 创建没有结果的提示信息
    const faqContainer = document.querySelector('.faq-container');
    const existingNoResults = document.querySelector('.no-results-message');
    
    if (existingNoResults) {
        existingNoResults.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'no-results-message';
    messageDiv.innerHTML = `
        <div class="no-results-content">
            <i class="fas fa-search"></i>
            <h3>未找到相关结果</h3>
            <p>没有找到与"<strong>${query}</strong>"相关的问题</p>
            <div class="suggestions">
                <p>建议：</p>
                <ul>
                    <li>检查拼写是否正确</li>
                    <li>尝试使用其他关键词</li>
                    <li>浏览相关分类查找答案</li>
                    <li>或直接联系技术支持</li>
                </ul>
            </div>
            <button class="btn-reset-search" onclick="resetSearch()">重新搜索</button>
        </div>
    `;
    
    faqContainer.appendChild(messageDiv);
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .no-results-message {
            background-color: var(--bg-primary);
            border-radius: var(--radius-lg);
            padding: 40px;
            text-align: center;
            margin: 20px 0;
            border: 2px solid var(--border-light);
        }
        
        .no-results-content i {
            font-size: 48px;
            color: var(--text-secondary);
            margin-bottom: 20px;
        }
        
        .no-results-content h3 {
            font-size: 20px;
            color: var(--text-primary);
            margin-bottom: 10px;
        }
        
        .no-results-content p {
            color: var(--text-secondary);
            margin-bottom: 20px;
        }
        
        .suggestions {
            text-align: left;
            max-width: 400px;
            margin: 20px auto;
            padding: 20px;
            background-color: var(--bg-tertiary);
            border-radius: var(--radius-md);
        }
        
        .suggestions p {
            font-weight: 600;
            margin-bottom: 10px;
        }
        
        .btn-reset-search {
            background-color: var(--secondary-color);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: var(--radius-md);
            font-weight: 500;
            cursor: pointer;
            transition: all var(--transition-normal);
            margin-top: 20px;
        }
        
        .btn-reset-search:hover {
            background-color: #2980b9;
        }
        
        .search-highlight {
            background-color: #fff3cd;
            padding: 2px 4px;
            border-radius: 3px;
            font-weight: 600;
        }
    `;
    
    document.head.appendChild(style);
}

function resetSearch() {
    const searchInput = document.getElementById('faqSearch');
    searchInput.value = '';
    
    // 移除搜索结果消息
    const noResultsMsg = document.querySelector('.no-results-message');
    if (noResultsMsg) {
        noResultsMsg.remove();
    }
    
    // 移除高亮样式
    document.querySelectorAll('.search-highlight').forEach(el => {
        const parent = el.parentElement;
        parent.textContent = parent.textContent;
    });
    
    // 重置显示
    document.querySelectorAll('.faq-category').forEach(cat => {
        cat.style.display = 'block';
    });
    document.querySelectorAll('.faq-item').forEach(item => {
        item.style.display = 'block';
        item.style.opacity = '1';
        item.classList.remove('highlighted');
    });
    
    // 重置分类按钮
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector('.category-btn[data-category="all"]').classList.add('active');
}

// 全局函数
function logout() {
    if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('docim_user');
        window.location.href = 'index.html';
    }
}