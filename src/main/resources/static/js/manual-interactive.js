// js/manual-interactive.js - 用户手册交互功能

class UserManual {
    constructor() {
        this.currentChapter = 'chapter1';
        this.readingProgress = 15;
        this.bookmarkedSections = new Set();
        this.init();
    }
    
    init() {
        this.checkLoginStatus();
        this.bindEvents();
        this.initTOC();
        this.updateReadingProgress();
        this.loadBookmarks();
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
        // 打印功能
        const printBtn = document.getElementById('printBtn');
        if (printBtn) {
            printBtn.addEventListener('click', () => this.printManual());
        }
        
        // 下载功能
        const downloadBtn = document.getElementById('downloadBtn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.downloadManual());
        }
        
        // 书签功能
        const bookmarkBtn = document.getElementById('bookmarkBtn');
        if (bookmarkBtn) {
            bookmarkBtn.addEventListener('click', () => this.toggleBookmark());
        }
        
        // 章节选择
        const chapterSelect = document.getElementById('chapterSelect');
        if (chapterSelect) {
            chapterSelect.addEventListener('change', (e) => {
                this.navigateToChapter(e.target.value);
            });
        }
        
        // 翻页按钮
        const prevPageBtn = document.getElementById('prevPageBtn');
        const nextPageBtn = document.getElementById('nextPageBtn');
        
        if (prevPageBtn) {
            prevPageBtn.addEventListener('click', () => this.navigateToPrevChapter());
        }
        
        if (nextPageBtn) {
            nextPageBtn.addEventListener('click', () => this.navigateToNextChapter());
        }
        
        // 标记为已读
        const markReadBtn = document.querySelector('.btn-mark-read');
        if (markReadBtn) {
            markReadBtn.addEventListener('click', () => this.markChapterAsRead());
        }
        
        // 目录搜索
        const manualSearch = document.getElementById('manualSearch');
        if (manualSearch) {
            manualSearch.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchManual(e.target.value);
                }
            });
        }
        
        // 滚动监听
        window.addEventListener('scroll', () => {
            this.highlightCurrentSection();
            this.updateReadingProgress();
        });
    }
    
    initTOC() {
        // 初始化目录展开/收起
        document.querySelectorAll('.toc-section-header').forEach(header => {
            header.addEventListener('click', (e) => {
                const section = e.currentTarget.parentElement;
                section.classList.toggle('active');
                
                const toggleBtn = section.querySelector('.section-toggle');
                if (toggleBtn) {
                    toggleBtn.style.transform = section.classList.contains('active') 
                        ? 'rotate(180deg)' 
                        : 'rotate(0deg)';
                }
            });
        });
        
        // 初始化目录项点击
        document.querySelectorAll('.toc-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = item.getAttribute('href');
                this.scrollToSection(targetId);
                this.setActiveTOCItem(item);
            });
        });
        
        // 目录切换按钮
        const tocToggle = document.getElementById('tocToggle');
        if (tocToggle) {
            tocToggle.addEventListener('click', () => {
                const sidebar = document.querySelector('.manual-sidebar');
                sidebar.classList.toggle('collapsed');
                tocToggle.innerHTML = sidebar.classList.contains('collapsed')
                    ? '<i class="fas fa-chevron-right"></i>'
                    : '<i class="fas fa-bars"></i>';
            });
        }
        
        // 默认展开第一个章节
        const firstSection = document.querySelector('.toc-section');
        if (firstSection) {
            firstSection.classList.add('active');
        }
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
            
            // 更新当前章节
            const chapterElement = element.closest('.manual-chapter');
            if (chapterElement) {
                this.currentChapter = chapterElement.id;
                this.updateChapterSelect();
            }
        }
    }
    
    setActiveTOCItem(activeItem) {
        document.querySelectorAll('.toc-item').forEach(item => {
            item.classList.remove('active');
        });
        activeItem.classList.add('active');
    }
    
    highlightCurrentSection() {
        const sections = document.querySelectorAll('.chapter-section');
        const scrollPosition = window.pageYOffset + 100;
        
        let currentSection = null;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section;
            }
        });
        
        if (currentSection) {
            const sectionId = currentSection.id;
            const tocItem = document.querySelector(`a[href="#${sectionId}"]`);
            if (tocItem) {
                this.setActiveTOCItem(tocItem);
            }
        }
    }
    
    updateReadingProgress() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = Math.round((scrollTop / docHeight) * 100);
        
        this.readingProgress = Math.min(Math.max(scrollPercent, 0), 100);
        
        const progressFill = document.getElementById('readingProgress');
        const progressText = document.getElementById('progressText');
        
        if (progressFill) {
            progressFill.style.width = `${this.readingProgress}%`;
        }
        
        if (progressText) {
            progressText.textContent = `${this.readingProgress}%`;
        }
    }
    
    printManual() {
        // 在实际应用中，这里会调用浏览器的打印功能
        // 这里我们只是显示一个提示
        this.showToast('正在准备打印...', 'info');
        
        setTimeout(() => {
            // 模拟打印准备
            this.showToast('请使用浏览器的打印功能 (Ctrl+P)', 'success');
        }, 500);
    }
    
    downloadManual() {
        // 在实际应用中，这里会生成并下载PDF
        // 这里我们只是显示一个提示
        this.showToast('正在生成PDF文档...', 'info');
        
        setTimeout(() => {
            this.showToast('PDF文档已准备就绪，开始下载...', 'success');
            
            // 模拟下载过程
            const downloadLink = document.createElement('a');
            downloadLink.href = '#';
            downloadLink.download = 'DocIM-Stipend-用户手册-v2.1.0.pdf';
            downloadLink.click();
        }, 1000);
    }
    
    toggleBookmark() {
        const currentSection = this.getCurrentSection();
        if (!currentSection) return;
        
        const sectionId = currentSection.id;
        const bookmarkBtn = document.getElementById('bookmarkBtn');
        
        if (this.bookmarkedSections.has(sectionId)) {
            this.bookmarkedSections.delete(sectionId);
            bookmarkBtn.innerHTML = '<i class="far fa-bookmark"></i> 添加书签';
            this.showToast('书签已移除', 'info');
        } else {
            this.bookmarkedSections.add(sectionId);
            bookmarkBtn.innerHTML = '<i class="fas fa-bookmark"></i> 取消书签';
            this.showToast('已添加到书签', 'success');
        }
        
        this.saveBookmarks();
    }
    
    loadBookmarks() {
        const savedBookmarks = JSON.parse(localStorage.getItem('manual_bookmarks') || '[]');
        this.bookmarkedSections = new Set(savedBookmarks);
        
        // 更新书签按钮状态
        const currentSection = this.getCurrentSection();
        if (currentSection && this.bookmarkedSections.has(currentSection.id)) {
            const bookmarkBtn = document.getElementById('bookmarkBtn');
            if (bookmarkBtn) {
                bookmarkBtn.innerHTML = '<i class="fas fa-bookmark"></i> 取消书签';
            }
        }
    }
    
    saveBookmarks() {
        localStorage.setItem('manual_bookmarks', JSON.stringify([...this.bookmarkedSections]));
    }
    
    getCurrentSection() {
        const sections = document.querySelectorAll('.chapter-section');
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
    
    navigateToChapter(chapterId) {
        const chapterElement = document.getElementById(chapterId);
        if (chapterElement) {
            this.scrollToSection(`#${chapterId}`);
            this.currentChapter = chapterId;
        }
    }
    
    navigateToPrevChapter() {
        const chapters = ['chapter1', 'chapter2', 'chapter3', 'chapter4', 'chapter5', 'chapter6', 'appendix'];
        const currentIndex = chapters.indexOf(this.currentChapter);
        
        if (currentIndex > 0) {
            const prevChapter = chapters[currentIndex - 1];
            this.navigateToChapter(prevChapter);
        } else {
            this.showToast('已经是第一章节', 'info');
        }
    }
    
    navigateToNextChapter() {
        const chapters = ['chapter1', 'chapter2', 'chapter3', 'chapter4', 'chapter5', 'chapter6', 'appendix'];
        const currentIndex = chapters.indexOf(this.currentChapter);
        
        if (currentIndex < chapters.length - 1) {
            const nextChapter = chapters[currentIndex + 1];
            this.navigateToChapter(nextChapter);
        } else {
            this.showToast('已经是最后章节', 'info');
        }
    }
    
    updateChapterSelect() {
        const chapterSelect = document.getElementById('chapterSelect');
        if (chapterSelect) {
            chapterSelect.value = this.currentChapter;
        }
    }
    
    markChapterAsRead() {
        const currentChapter = document.getElementById(this.currentChapter);
        if (!currentChapter) return;
        
        const readChapters = JSON.parse(localStorage.getItem('manual_read_chapters') || '[]');
        
        if (!readChapters.includes(this.currentChapter)) {
            readChapters.push(this.currentChapter);
            localStorage.setItem('manual_read_chapters', JSON.stringify(readChapters));
            this.showToast('章节已标记为已读', 'success');
            
            // 更新阅读进度
            const totalChapters = 7; // 7个章节
            const readPercent = Math.round((readChapters.length / totalChapters) * 100);
            this.readingProgress = Math.max(this.readingProgress, readPercent);
            
            const progressFill = document.getElementById('readingProgress');
            const progressText = document.getElementById('progressText');
            
            if (progressFill) {
                progressFill.style.width = `${this.readingProgress}%`;
            }
            
            if (progressText) {
                progressText.textContent = `${this.readingProgress}%`;
            }
        } else {
            this.showToast('本章节已经标记为已读', 'info');
        }
    }
    
    searchManual(query) {
        if (!query.trim()) {
            this.showToast('请输入搜索关键词', 'info');
            return;
        }
        
        const searchTerm = query.toLowerCase();
        const sections = document.querySelectorAll('.chapter-section');
        let found = false;
        
        // 清除之前的高亮
        this.clearHighlights();
        
        sections.forEach(section => {
            const content = section.textContent.toLowerCase();
            if (content.includes(searchTerm)) {
                found = true;
                
                // 高亮显示搜索结果
                this.highlightText(section, searchTerm);
                
                // 滚动到第一个匹配结果
                if (!this.hasScrolledToSearch) {
                    this.scrollToSection(`#${section.id}`);
                    this.hasScrolledToSearch = true;
                }
            }
        });
        
        if (found) {
            this.showToast(`找到相关内容，已高亮显示关键词"${query}"`, 'success');
        } else {
            this.showToast(`未找到包含"${query}"的内容`, 'warning');
        }
    }
    
    highlightText(element, query) {
        const regex = new RegExp(`(${this.escapeRegExp(query)})`, 'gi');
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
        const nodes = [];
        
        let node;
        while (node = walker.nextNode()) {
            if (node.parentElement.tagName !== 'SCRIPT' && 
                node.parentElement.tagName !== 'STYLE' &&
                regex.test(node.textContent)) {
                nodes.push(node);
            }
        }
        
        nodes.forEach(node => {
            const span = document.createElement('span');
            span.className = 'search-highlight';
            span.innerHTML = node.textContent.replace(regex, '<mark class="highlight-match">$1</mark>');
            node.parentNode.replaceChild(span, node);
        });
    }
    
    clearHighlights() {
        document.querySelectorAll('.search-highlight').forEach(highlight => {
            highlight.outerHTML = highlight.innerHTML;
        });
    }
    
    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
function navigateToManualSection(sectionId) {
    const manual = new UserManual();
    manual.scrollToSection(sectionId);
}

function logout() {
    if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('docim_user');
        window.location.href = 'index.html';
    }
}

// 添加搜索高亮样式
const style = document.createElement('style');
style.textContent = `
    .search-highlight {
        background-color: transparent;
    }
    
    .highlight-match {
        background-color: #fff3cd;
        padding: 2px 4px;
        border-radius: 3px;
        font-weight: 500;
        color: #856404;
    }
    
    .manual-sidebar.collapsed {
        width: 60px;
    }
    
    .manual-sidebar.collapsed .manual-toc > *:not(.toc-header) {
        display: none;
    }
    
    .manual-sidebar.collapsed .toc-header h3 {
        display: none;
    }
    
    .manual-sidebar.collapsed .toc-header {
        justify-content: center;
        padding: 24px 0;
    }
    
    @media (max-width: 1200px) {
        .manual-sidebar.collapsed {
            width: 100%;
        }
        
        .manual-sidebar.collapsed .manual-toc > *:not(.toc-header) {
            display: block;
        }
        
        .manual-sidebar.collapsed .toc-header h3 {
            display: flex;
        }
        
        .manual-sidebar.collapsed .toc-header {
            justify-content: space-between;
            padding: 24px;
        }
    }
`;
document.head.appendChild(style);

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    new UserManual();
});