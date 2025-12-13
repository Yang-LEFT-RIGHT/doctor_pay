// js/guide.js - 修复版
document.addEventListener('DOMContentLoaded', function() {
    console.log('使用指南页面加载完成');
    
    // 初始化页面
    initGuidePage();
});

function initGuidePage() {
    // 检查登录状态
    checkLoginStatus();
    
    // 初始化通知系统
    if (!window.notificationSystem) {
        window.notificationSystem = new NotificationSystem();
    }
    
    // 更新通知计数
    updateNotificationCount();
    
    // 绑定事件
    bindGuideEvents();
    
    // 初始化滚动监听
    initScrollSpy();
    
    // 初始化导航
    initGuideNavigation();
}

function checkLoginStatus() {
    try {
        const userData = localStorage.getItem('docim_user');
        if (!userData) {
            console.warn('用户未登录，跳转到登录页');
            window.location.href = 'index.html';
            return false;
        }
        return true;
    } catch (error) {
        console.error('认证检查失败:', error);
        return false;
    }
}

function updateNotificationCount() {
    if (window.notificationSystem) {
        const unreadCount = window.notificationSystem.notifications.filter(n => !n.read).length;
        const notificationCount = document.getElementById('notificationCount');
        if (notificationCount) {
            notificationCount.textContent = unreadCount;
        }
    }
}

function bindGuideEvents() {
    // 搜索功能
    const searchInput = document.getElementById('guideSearch');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', () => performSearch(searchInput.value));
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch(searchInput.value);
        });
    }
    
    // 收藏按钮
    const bookmarkBtn = document.querySelector('.btn-secondary');
    if (bookmarkBtn) {
        bookmarkBtn.addEventListener('click', toggleBookmark);
    }
    
    // 标记为已学按钮
    const markLearnedBtn = document.querySelector('.btn-primary');
    if (markLearnedBtn) {
        markLearnedBtn.addEventListener('click', markAsLearned);
    }
    
    // 侧边栏搜索按钮
    const sidebarSearchBtn = document.querySelector('.sidebar-search-btn');
    if (sidebarSearchBtn) {
        sidebarSearchBtn.addEventListener('click', focusSearch);
    }
}

function performSearch(keyword) {
    if (!keyword || keyword.trim() === '') {
        showToast('请输入搜索关键词', 'warning');
        return;
    }
    
    // 移除之前的高亮
    removeHighlights();
    
    // 高亮匹配的文本
    const term = keyword.trim().toLowerCase();
    const contentElements = document.querySelectorAll('.guide-card-body, .step-content, .feature-content, .role-features');
    let matchCount = 0;
    
    contentElements.forEach(element => {
        const html = element.innerHTML;
        const regex = new RegExp(`(${term})`, 'gi');
        if (regex.test(html)) {
            element.innerHTML = html.replace(regex, '<span class="highlight">$1</span>');
            matchCount++;
        }
    });
    
    if (matchCount > 0) {
        showToast(`找到 ${matchCount} 个匹配结果`, 'success');
        // 滚动到第一个匹配结果
        const firstHighlight = document.querySelector('.highlight');
        if (firstHighlight) {
            firstHighlight.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }
    } else {
        showToast('未找到匹配内容', 'info');
    }
}

function removeHighlights() {
    const highlights = document.querySelectorAll('.highlight');
    highlights.forEach(highlight => {
        const parent = highlight.parentNode;
        parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
    });
}

function toggleBookmark() {
    const btn = document.querySelector('.btn-secondary');
    const isBookmarked = btn.classList.contains('bookmarked');
    
    if (isBookmarked) {
        btn.classList.remove('bookmarked');
        btn.innerHTML = '<i class="far fa-bookmark"></i> 收藏本页';
        showToast('已取消收藏', 'info');
    } else {
        btn.classList.add('bookmarked');
        btn.innerHTML = '<i class="fas fa-bookmark"></i> 已收藏';
        showToast('已收藏本页', 'success');
    }
}

function markAsLearned() {
    const btn = document.querySelector('.btn-primary');
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    if (!btn.classList.contains('completed')) {
        // 更新进度条
        const currentProgress = parseInt(progressFill.style.width) || 0;
        const newProgress = Math.min(currentProgress + 25, 100);
        
        progressFill.style.width = `${newProgress}%`;
        progressText.textContent = `${newProgress}% 已学完`;
        
        // 更新按钮状态
        btn.classList.add('completed');
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-check-circle"></i> 已完成学习';
        
        showToast('本节内容已完成学习', 'success');
    }
}

function focusSearch() {
    const searchInput = document.getElementById('guideSearch');
    if (searchInput) {
        searchInput.focus();
    }
}

function initScrollSpy() {
    const sections = document.querySelectorAll('.guide-section');
    const navItems = document.querySelectorAll('.guide-nav-item');
    
    const observerOptions = {
        root: null,
        rootMargin: '-100px 0px -100px 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${sectionId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
}

function initGuideNavigation() {
    const navItems = document.querySelectorAll('.guide-nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // 移除所有active类
                navItems.forEach(nav => nav.classList.remove('active'));
                // 添加当前active类
                this.classList.add('active');
                // 滚动到目标区域
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'guide-toast';
    
    const icon = type === 'success' ? 'check-circle' : 
                 type === 'warning' ? 'exclamation-triangle' : 'info-circle';
    
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // 设置样式
    toast.style.backgroundColor = type === 'success' ? '#2ecc71' : 
                                 type === 'warning' ? '#f39c12' : '#3498db';
    
    document.body.appendChild(toast);
    
    // 3秒后移除
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            if (toast.parentNode) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// 返回工作台
function goToDashboard() {
    window.location.href = 'student-dashboard.html';
}

// 退出登录
function logout() {
    if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('docim_user');
        window.location.href = 'index.html';
    }
}

// 暴露函数给全局作用域
window.goToDashboard = goToDashboard;
window.logout = logout;