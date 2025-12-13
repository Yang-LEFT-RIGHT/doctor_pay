// js/guide.js - 使用指南页面交互功能

class GuidePage {
    constructor() {
        this.init();
    }
    
    init() {
        this.checkLoginStatus();
        this.bindEvents();
        this.initFAQ();
        this.initSidebarScroll();
        this.updateProgress();
    }
    
    checkLoginStatus() {
        const savedUser = localStorage.getItem('docim_user');
        if (!savedUser) {
            window.location.href = 'index.html';
            return false;
        }
        return true;
    }
    
    bindEvents() {
        // 搜索功能
        const searchBtn = document.querySelector('.search-btn');
        const searchInput = document.getElementById('guideSearch');
        
        if (searchBtn && searchInput) {
            searchBtn.addEventListener('click', () => this.searchGuide());
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.searchGuide();
            });
        }
        
        // 侧边栏搜索
        const sidebarSearchBtn = document.querySelector('.sidebar-search-btn');
        if (sidebarSearchBtn) {
            sidebarSearchBtn.addEventListener('click', () => {
                document.getElementById('guideSearch').focus();
            });
        }
        
        // 导航点击
        document.querySelectorAll('.guide-nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const target = item.getAttribute('href');
                if (target.startsWith('#')) {
                    this.scrollToSection(target);
                    this.setActiveNavItem(item);
                }
            });
        });
        
        // 标记为已学
        const markLearnedBtn = document.querySelector('.btn-primary');
        if (markLearnedBtn) {
            markLearnedBtn.addEventListener('click', () => this.markAsLearned());
        }
        
        // 收藏功能
        const bookmarkBtn = document.querySelector('.btn-secondary');
        if (bookmarkBtn) {
            bookmarkBtn.addEventListener('click', () => this.toggleBookmark());
        }
        
        // 滚动时高亮导航
        window.addEventListener('scroll', () => this.highlightActiveSection());
    }
    
    initFAQ() {
        document.querySelectorAll('.faq-item').forEach(item => {
            const toggle = item.querySelector('.faq-toggle');
            toggle.addEventListener('click', () => {
                item.classList.toggle('active');
                toggle.innerHTML = item.classList.contains('active') 
                    ? '<i class="fas fa-chevron-up"></i>' 
                    : '<i class="fas fa-chevron-down"></i>';
            });
        });
    }
    
    initSidebarScroll() {
        const sidebar = document.querySelector('.guide-sidebar');
        if (!sidebar) return;
        
        // 监听滚动以更新学习进度
        window.addEventListener('scroll', () => {
            const scrollPercent = this.getScrollProgress();
            this.updateProgressBar(scrollPercent);
        });
    }
    
    getScrollProgress() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = scrollTop / docHeight;
        return Math.min(Math.max(scrollPercent, 0), 1);
    }
    
    updateProgressBar(percent) {
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.width = `${percent * 100}%`;
        }
    }
    
    updateProgress() {
        const learnedItems = JSON.parse(localStorage.getItem('guide_learned') || '[]');
        const totalSections = document.querySelectorAll('.guide-section').length;
        const progress = learnedItems.length / totalSections * 100;
        
        const progressText = document.querySelector('.progress-text');
        if (progressText) {
            progressText.textContent = `${Math.round(progress)}% 已学完`;
        }
        
        this.updateProgressBar(progress / 100);
    }
    
    searchGuide() {
        const searchInput = document.getElementById('guideSearch');
        const query = searchInput.value.trim().toLowerCase();
        
        if (!query) {
            this.showToast('请输入搜索关键词', 'info');
            return;
        }
        
        // 搜索所有指南内容
        const sections = document.querySelectorAll('.guide-section');
        let found = false;
        
        sections.forEach(section => {
            const content = section.textContent.toLowerCase();
            if (content.includes(query)) {
                found = true;
                this.scrollToSection(`#${section.id}`);
                
                // 高亮显示搜索关键词
                this.highlightText(section, query);
            }
        });
        
        if (!found) {
            this.showToast('未找到相关内容，请尝试其他关键词', 'warning');
        }
    }
    
    highlightText(element, query) {
        // 移除之前的高亮
        element.querySelectorAll('.highlight').forEach(highlight => {
            highlight.outerHTML = highlight.textContent;
        });
        
        // 高亮新关键词
        const regex = new RegExp(`(${query})`, 'gi');
        element.innerHTML = element.innerHTML.replace(regex, '<mark class="highlight">$1</mark>');
    }
    
    scrollToSection(sectionId) {
        const element = document.querySelector(sectionId);
        if (element) {
            const topBarHeight = document.querySelector('.top-bar').offsetHeight;
            const offsetPosition = element.offsetTop - topBarHeight - 20;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }
    
    setActiveNavItem(activeItem) {
        document.querySelectorAll('.guide-nav-item').forEach(item => {
            item.classList.remove('active');
        });
        activeItem.classList.add('active');
    }
    
    highlightActiveSection() {
        const sections = document.querySelectorAll('.guide-section');
        const scrollPosition = window.pageYOffset + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                const navItem = document.querySelector(`a[href="#${section.id}"]`);
                if (navItem && !navItem.classList.contains('active')) {
                    this.setActiveNavItem(navItem);
                }
            }
        });
    }
    
    markAsLearned() {
        const currentSection = this.getCurrentSection();
        if (!currentSection) return;
        
        const learnedItems = JSON.parse(localStorage.getItem('guide_learned') || '[]');
        const sectionId = currentSection.id;
        
        if (!learnedItems.includes(sectionId)) {
            learnedItems.push(sectionId);
            localStorage.setItem('guide_learned', JSON.stringify(learnedItems));
            this.showToast('已标记为已学习', 'success');
            this.updateProgress();
        } else {
            this.showToast('本节已标记为已学习', 'info');
        }
    }
    
    toggleBookmark() {
        const currentSection = this.getCurrentSection();
        if (!currentSection) return;
        
        const bookmarks = JSON.parse(localStorage.getItem('guide_bookmarks') || '[]');
        const sectionId = currentSection.id;
        const sectionTitle = currentSection.querySelector('.section-title').textContent;
        
        const index = bookmarks.findIndex(b => b.id === sectionId);
        
        const bookmarkBtn = document.querySelector('.btn-secondary');
        if (index === -1) {
            bookmarks.push({ id: sectionId, title: sectionTitle, date: new Date().toISOString() });
            bookmarkBtn.innerHTML = '<i class="fas fa-bookmark"></i> 取消收藏';
            this.showToast('已添加到收藏夹', 'success');
        } else {
            bookmarks.splice(index, 1);
            bookmarkBtn.innerHTML = '<i class="far fa-bookmark"></i> 收藏本页';
            this.showToast('已从收藏夹移除', 'info');
        }
        
        localStorage.setItem('guide_bookmarks', JSON.stringify(bookmarks));
    }
    
    getCurrentSection() {
        const sections = document.querySelectorAll('.guide-section');
        const scrollPosition = window.pageYOffset + 100;
        
        for (let section of sections) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                return section;
            }
        }
        
        return sections[0];
    }
    
    showToast(message, type = 'info') {
        if (window.notificationSystem) {
            window.notificationSystem.showToast(message, type);
        } else {
            alert(message);
        }
    }
}

// 全局函数
function scrollToGuideSection(sectionId) {
    const guide = new GuidePage();
    guide.scrollToSection(sectionId);
}

function logout() {
    if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('docim_user');
        window.location.href = 'index.html';
    }
}

// 添加高亮样式
const style = document.createElement('style');
style.textContent = `
    .highlight {
        background-color: #fff3cd;
        padding: 2px 4px;
        border-radius: 3px;
        font-weight: 500;
    }
    
    mark.highlight {
        background-color: rgba(255, 193, 7, 0.3);
        color: inherit;
    }
`;
document.head.appendChild(style);

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    new GuidePage();
});