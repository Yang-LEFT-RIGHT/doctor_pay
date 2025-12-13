// js/manual.js - 管理员手册页面JavaScript

// 手册章节数据
const chapters = [
    { id: 'chapter1', title: '第1章 系统概述', progress: 0 },
    { id: 'chapter2', title: '第2章 工作台管理', progress: 20 },
    { id: 'chapter3', title: '第3章 任务管理', progress: 40 },
    { id: 'chapter4', title: '第4章 博士生管理', progress: 60 },
    { id: 'chapter5', title: '第5章 统计分析', progress: 70 },
    { id: 'chapter6', title: '第6章 系统设置', progress: 80 },
    { id: 'chapter7', title: '第7章 管理员管理', progress: 90 },
    { id: 'chapter8', title: '第8章 故障排除', progress: 95 },
    { id: 'appendix', title: '附录', progress: 100 }
];

// 模拟的搜索索引数据
const searchIndex = [
    { id: 'chapter1-1', chapter: '第1章', title: '系统简介', content: 'DocIM Stipend 是专为高校设计的博士生助教/代管任务管理系统', chapterId: 'chapter1' },
    { id: 'chapter1-2', chapter: '第1章', title: '主要功能模块', content: '系统包含任务管理、博士生管理、统计分析、系统设置四大模块', chapterId: 'chapter1' },
    { id: 'chapter2-1', chapter: '第2章', title: '工作台布局', content: '管理员工作台包含顶部导航栏、侧边栏、主内容区和全局页脚', chapterId: 'chapter2' },
    { id: 'chapter2-2', chapter: '第2章', title: '数据概览', content: '工作台首页显示待处理任务、进行中任务、总博士生数等关键统计数据', chapterId: 'chapter2' },
    { id: 'chapter3-1', chapter: '第3章', title: '任务发布流程', content: '发布新任务的完整步骤包括进入发布页面、填写信息、选择博士生、确认发布', chapterId: 'chapter3' },
    { id: 'chapter3-2', chapter: '第3章', title: '任务状态说明', content: '任务状态包括待确认、已确认、进行中、已完成、已审核等', chapterId: 'chapter3' },
    { id: 'chapter3-3', chapter: '第3章', title: '津贴计算公式', content: '总津贴 = 基础津贴 × 工作量系数 × 质量系数', chapterId: 'chapter3' },
    { id: 'chapter4-1', chapter: '第4章', title: '博士生信息管理', content: '博士生信息包括基本信息、学业信息、联系信息等字段', chapterId: 'chapter4' },
    { id: 'chapter4-2', chapter: '第4章', title: '博士生状态跟踪', content: '博士生状态包括活跃、忙碌、休假、已毕业等', chapterId: 'chapter4' }
];

let currentChapterIndex = 0;
let isSearching = false;
let searchQuery = '';

document.addEventListener('DOMContentLoaded', function() {
    console.log('管理员手册页面加载完成');
    
    // 初始化通知系统
    if (!window.notificationSystem) {
        window.notificationSystem = new NotificationSystem();
    }
    
    // 更新通知计数
    updateNotificationCount();
    
    // 绑定事件
    bindEvents();
    
    // 初始化目录
    initTOC();
    
    // 初始化章节进度
    updateChapterProgress();
    
    // 初始化滚动监听
    initScrollSpy();
});

function updateNotificationCount() {
    if (window.notificationSystem) {
        const unreadCount = window.notificationSystem.notifications.filter(n => !n.read).length;
        document.getElementById('notificationCount').textContent = unreadCount;
        document.getElementById('sidebarNotificationCount').textContent = unreadCount;
    }
}

function bindEvents() {
    // 搜索输入防抖
    const searchInput = document.getElementById('manualSearch');
    let searchTimeout;
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchManual();
            }, 300);
        });
    }
    
    // 搜索框回车键支持
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchManual();
            }
        });
    }
    
    // 目录链接点击
    document.querySelectorAll('.toc-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const chapterId = this.getAttribute('href').substring(1);
            scrollToChapter(chapterId);
        });
    });
}

function initTOC() {
    // 为所有章节添加ID
    document.querySelectorAll('.manual-chapter').forEach((chapter, index) => {
        if (!chapter.id) {
            chapter.id = chapters[index]?.id || `chapter${index + 1}`;
        }
    });
}

function toggleToc() {
    const tocContent = document.getElementById('tocContent');
    const toggleBtn = document.querySelector('.toc-header .btn-icon i');
    
    if (tocContent.classList.contains('collapsed')) {
        tocContent.classList.remove('collapsed');
        toggleBtn.classList.remove('fa-chevron-down');
        toggleBtn.classList.add('fa-chevron-up');
    } else {
        tocContent.classList.add('collapsed');
        toggleBtn.classList.remove('fa-chevron-up');
        toggleBtn.classList.add('fa-chevron-down');
    }
}

function initScrollSpy() {
    const chapters = document.querySelectorAll('.manual-chapter');
    const tocLinks = document.querySelectorAll('.toc-link');
    
    if (chapters.length === 0 || tocLinks.length === 0) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '-100px 0px -100px 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !isSearching) {
                const chapterId = entry.target.id;
                updateCurrentChapter(chapterId);
                updateActiveTocLink(chapterId);
                updateChapterProgress();
            }
        });
    }, observerOptions);
    
    chapters.forEach(chapter => {
        observer.observe(chapter);
    });
}

function updateCurrentChapter(chapterId) {
    const chapter = chapters.find(c => c.id === chapterId);
    if (chapter) {
        currentChapterIndex = chapters.indexOf(chapter);
    }
}

function updateActiveTocLink(chapterId) {
    // 移除所有活跃状态
    document.querySelectorAll('.toc-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // 添加当前章节活跃状态
    const activeLink = document.querySelector(`.toc-link[href="#${chapterId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
        
        // 确保父级展开
        const parentLi = activeLink.closest('li');
        const parentUl = parentLi?.parentElement;
        const parentLink = parentUl?.previousElementSibling;
        
        if (parentLink && parentLink.classList.contains('toc-link')) {
            parentLink.classList.add('active');
        }
    }
}

function updateChapterProgress() {
    const progressElement = document.getElementById('chapterProgress');
    const currentChapterElement = document.getElementById('currentChapter');
    
    if (currentChapterIndex >= 0 && currentChapterIndex < chapters.length) {
        const chapter = chapters[currentChapterIndex];
        const progress = chapter.progress;
        
        if (progressElement) {
            progressElement.style.width = `${progress}%`;
        }
        
        if (currentChapterElement) {
            currentChapterElement.textContent = chapter.title;
        }
    }
}

function scrollToChapter(chapterId) {
    const chapterElement = document.getElementById(chapterId);
    if (!chapterElement) return;
    
    // 如果不是搜索状态，更新当前章节
    if (!isSearching) {
        updateCurrentChapter(chapterId);
        updateActiveTocLink(chapterId);
        updateChapterProgress();
    }
    
    // 平滑滚动到章节
    chapterElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
    
    // 如果目录是折叠状态，展开它
    const tocContent = document.getElementById('tocContent');
    if (tocContent.classList.contains('collapsed')) {
        toggleToc();
    }
}

function searchManual() {
    const searchInput = document.getElementById('manualSearch');
    const searchClearBtn = document.querySelector('.search-clear');
    const query = searchInput.value.trim().toLowerCase();
    
    if (!query) {
        clearSearch();
        return;
    }
    
    searchQuery = query;
    isSearching = true;
    
    // 显示清除按钮
    if (searchClearBtn) {
        searchClearBtn.style.display = 'block';
    }
    
    // 搜索索引数据
    const results = searchIndex.filter(item => {
        return item.title.toLowerCase().includes(query) || 
               item.content.toLowerCase().includes(query) ||
               item.chapter.toLowerCase().includes(query);
    });
    
    // 显示搜索结果
    displaySearchResults(results, query);
    
    // 隐藏手册内容
    document.querySelectorAll('.manual-chapter').forEach(chapter => {
        chapter.style.display = 'none';
    });
    
    // 显示搜索结果区域
    const searchResults = document.getElementById('searchResults');
    if (searchResults) {
        searchResults.style.display = 'block';
    }
    
    // 更新导航按钮状态
    updateNavigationButtons();
}

function displaySearchResults(results, query) {
    const resultsList = document.getElementById('resultsList');
    if (!resultsList) return;
    
    resultsList.innerHTML = '';
    
    if (results.length === 0) {
        resultsList.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h4>未找到相关内容</h4>
                <p>没有找到与"${query}"相关的文档内容</p>
                <button class="btn-secondary" onclick="clearSearch()">返回手册</button>
            </div>
        `;
        return;
    }
    
    results.forEach(result => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        
        // 高亮搜索词
        let highlightedTitle = result.title;
        let highlightedContent = result.content;
        
        if (query) {
            const regex = new RegExp(`(${query})`, 'gi');
            highlightedTitle = result.title.replace(regex, '<span class="highlight">$1</span>');
            highlightedContent = result.content.replace(regex, '<span class="highlight">$1</span>');
        }
        
        resultItem.innerHTML = `
            <div class="result-title">${highlightedTitle}</div>
            <div class="result-preview">${highlightedContent}</div>
            <div class="result-meta">
                <i class="fas fa-book"></i> ${result.chapter}
            </div>
        `;
        
        // 点击搜索结果跳转到对应章节
        resultItem.style.cursor = 'pointer';
        resultItem.addEventListener('click', () => {
            clearSearch();
            setTimeout(() => {
                scrollToChapter(result.chapterId);
            }, 100);
        });
        
        resultsList.appendChild(resultItem);
    });
}

function clearSearch() {
    const searchInput = document.getElementById('manualSearch');
    const searchClearBtn = document.querySelector('.search-clear');
    const searchResults = document.getElementById('searchResults');
    
    if (searchInput) {
        searchInput.value = '';
    }
    
    if (searchClearBtn) {
        searchClearBtn.style.display = 'none';
    }
    
    if (searchResults) {
        searchResults.style.display = 'none';
    }
    
    // 显示所有章节内容
    document.querySelectorAll('.manual-chapter').forEach(chapter => {
        chapter.style.display = 'block';
    });
    
    isSearching = false;
    searchQuery = '';
    
    // 更新导航按钮状态
    updateNavigationButtons();
    
    // 恢复滚动监听
    if (currentChapterIndex >= 0) {
        const currentChapter = chapters[currentChapterIndex];
        if (currentChapter) {
            updateActiveTocLink(currentChapter.id);
            updateChapterProgress();
        }
    }
}

function prevChapter() {
    if (isSearching) {
        clearSearch();
        return;
    }
    
    if (currentChapterIndex > 0) {
        currentChapterIndex--;
        const prevChapter = chapters[currentChapterIndex];
        scrollToChapter(prevChapter.id);
    }
}

function nextChapter() {
    if (isSearching) {
        clearSearch();
        return;
    }
    
    if (currentChapterIndex < chapters.length - 1) {
        currentChapterIndex++;
        const nextChapter = chapters[currentChapterIndex];
        scrollToChapter(nextChapter.id);
    }
}

function updateNavigationButtons() {
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (isSearching) {
        if (prevBtn) prevBtn.textContent = '返回手册';
        if (nextBtn) nextBtn.style.visibility = 'hidden';
    } else {
        if (prevBtn) {
            prevBtn.innerHTML = '<i class="fas fa-arrow-left"></i> 上一章';
            prevBtn.disabled = currentChapterIndex === 0;
        }
        
        if (nextBtn) {
            nextBtn.innerHTML = '下一章 <i class="fas fa-arrow-right"></i>';
            nextBtn.style.visibility = 'visible';
            nextBtn.disabled = currentChapterIndex === chapters.length - 1;
        }
    }
}

function printManual() {
    console.log('打印管理员手册');
    
    showToast('正在准备打印...', 'info');
    
    // 在实际应用中，这里会生成适合打印的版本
    // 这里我们使用浏览器的打印功能
    setTimeout(() => {
        window.print();
    }, 500);
}

function showAddForm() {
    showToast('此功能将在完整版本中提供', 'info');
}

function downloadTemplate() {
    showToast('正在下载Excel模板...', 'info');
    
    setTimeout(() => {
        // 模拟下载Excel模板
        const templateContent = `博士生信息导入模板\n姓名,学号,专业,导师,邮箱,手机\n请按照此格式填写`;
        const blob = new Blob([templateContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', url);
        linkElement.setAttribute('download', '博士生信息导入模板.txt');
        linkElement.click();
        
        showToast('模板已下载', 'success');
    }, 1000);
}

function viewPending() {
    showToast('此功能将在完整版本中提供', 'info');
}

function showToast(message, type = 'info') {
    if (window.notificationSystem) {
        window.notificationSystem.showToast(message, type);
    } else {
        alert(message);
    }
}

function logout() {
    if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('docim_user');
        window.location.href = 'index.html';
    }
}