// js/faq.js - 常见问题页面JavaScript

// 常见问题数据
const faqData = [
    {
        id: 1,
        question: "如何重置管理员密码？",
        answer: "<p>重置管理员密码的步骤：</p><ol><li>如果是超级管理员忘记密码，请联系系统技术支持团队获取特殊重置链接</li><li>如果是普通管理员忘记密码，超级管理员可以在<strong>管理员管理</strong>页面进行密码重置</li><li>管理员登录后，可以在个人设置中自行修改密码</li></ol><p><strong>注意：</strong>出于安全考虑，系统不会通过邮件发送密码明文。</p>",
        category: "login",
        views: 245,
        helpful: 189,
        notHelpful: 12,
        hotness: 5,
        tags: ["密码", "登录", "账户"]
    },
    {
        id: 2,
        question: "任务津贴如何计算？",
        answer: "<p>任务津贴根据以下公式计算：</p><p><strong>总津贴 = 基础津贴 × 工作量系数 × 质量系数</strong></p><ul><li><strong>基础津贴：</strong>根据任务类型预设的标准津贴</li><li><strong>工作量系数：</strong>根据任务复杂度和耗时确定（0.8-1.2）</li><li><strong>质量系数：</strong>根据任务完成质量评估确定（0.5-1.5）</li></ul><p>津贴标准可以在系统设置中调整，也可以为单个任务设置特殊津贴。</p>",
        category: "stipend",
        views: 198,
        helpful: 156,
        notHelpful: 8,
        hotness: 4,
        tags: ["津贴", "计算", "费用"]
    },
    {
        id: 3,
        question: "博士生没有确认任务怎么办？",
        answer: "<p>当博士生未在规定时间内确认任务时，可以采取以下措施：</p><ol><li><strong>系统自动提醒：</strong>系统会在任务分配后24小时和48小时自动发送提醒通知</li><li><strong>手动联系：</strong>管理员可以通过系统内的消息功能或邮件联系博士生</li><li><strong>重新分配：</strong>如果博士生无法联系或明确拒绝，管理员可以取消任务并重新分配给其他博士生</li><li><strong>调整确认时间：</strong>在系统设置中可以调整任务确认的默认时间限制</li></ol>",
        category: "task",
        views: 176,
        helpful: 142,
        notHelpful: 5,
        hotness: 4,
        tags: ["确认", "通知", "任务分配"]
    },
    {
        id: 4,
        question: "如何导出统计数据？",
        answer: "<p>导出统计数据的步骤：</p><ol><li>进入<strong>统计分析</strong>页面</li><li>选择需要导出的数据范围和类型（任务统计、学生统计、津贴统计等）</li><li>点击页面右上角的<strong>导出</strong>按钮</li><li>选择导出格式（Excel、PDF或CSV）</li><li>系统会生成文件并开始下载</li></ol><p><strong>提示：</strong>可以根据日期范围筛选数据，导出特定时间段内的统计信息。</p>",
        category: "report",
        views: 154,
        helpful: 128,
        notHelpful: 3,
        hotness: 3,
        tags: ["导出", "统计", "报表"]
    },
    {
        id: 5,
        question: "系统支持批量导入博士生信息吗？",
        answer: "<p>是的，系统支持通过Excel模板批量导入博士生信息：</p><ol><li>在<strong>博士生管理</strong>页面，点击<strong>批量导入</strong>按钮</li><li>下载Excel模板文件</li><li>按照模板格式填写博士生信息（姓名、学号、专业、导师、邮箱等）</li><li>上传填写完成的Excel文件</li><li>系统会验证数据格式并显示导入结果</li></ol><p><strong>注意：</strong>如果遇到重复数据，系统会提示是否覆盖或跳过。建议在导入前先导出现有数据进行核对。</p>",
        category: "student",
        views: 143,
        helpful: 135,
        notHelpful: 2,
        hotness: 3,
        tags: ["批量导入", "Excel", "博士生"]
    },
    {
        id: 6,
        question: "如何设置任务自动提醒？",
        answer: "<p>设置任务自动提醒的方法：</p><ol><li>进入<strong>系统设置</strong> → <strong>常规设置</strong></li><li>找到<strong>任务提醒提前天数</strong>设置项</li><li>设置希望在任务截止前多少天发送提醒通知（默认3天）</li><li>保存设置后，系统会自动在设置的时间点发送提醒</li></ol><p><strong>其他提醒设置：</strong></p><ul><li>可以在<strong>通知设置</strong>中配置提醒方式（站内消息、邮件、移动推送）</li><li>可以为不同类型的任务设置不同的提醒策略</li><li>可以设置紧急任务的额外提醒</li></ul>",
        category: "system",
        views: 132,
        helpful: 118,
        notHelpful: 4,
        hotness: 2,
        tags: ["提醒", "通知", "自动化"]
    },
    {
        id: 7,
        question: "登录时提示账户被锁定怎么办？",
        answer: "<p>如果登录时提示账户被锁定，可以按照以下步骤解决：</p><ol><li><strong>等待自动解锁：</strong>账户锁定通常是暂时的，一般30分钟后会自动解锁</li><li><strong>联系超级管理员：</strong>如果急需使用，可以联系超级管理员手动解锁账户</li><li><strong>检查登录尝试：</strong>查看系统日志，确认是否有异常登录尝试</li><li><strong>修改密码：</strong>如果怀疑账户安全有问题，解锁后立即修改密码</li></ol><p><strong>预防措施：</strong>可以在系统设置中调整账户锁定策略，如设置连续失败尝试次数和锁定时间。</p>",
        category: "login",
        views: 128,
        helpful: 112,
        notHelpful: 6,
        hotness: 2,
        tags: ["锁定", "安全", "登录"]
    },
    {
        id: 8,
        question: "任务状态有哪些？各自代表什么意思？",
        answer: "<p>系统中共有以下几种任务状态：</p><ul><li><strong>待确认：</strong>任务已发布，博士生尚未确认接受</li><li><strong>已确认：</strong>博士生已确认接受任务</li><li><strong>进行中：</strong>博士生正在执行任务</li><li><strong>已完成：</strong>任务已完成，等待管理员审核</li><li><strong>已审核：</strong>管理员已审核通过，可以发放津贴</li><li><strong>已过期：</strong>任务超过截止日期未完成</li><li><strong>已取消：</strong>任务被管理员或博士生取消</li></ul><p>不同状态的任务在列表中会以不同颜色标识，便于快速识别。</p>",
        category: "task",
        views: 121,
        helpful: 108,
        notHelpful: 3,
        hotness: 2,
        tags: ["状态", "任务", "流程"]
    },
    {
        id: 9,
        question: "如何添加新的任务类型？",
        answer: "<p>添加新任务类型的步骤：</p><ol><li>进入<strong>系统设置</strong> → <strong>高级设置</strong></li><li>找到<strong>任务类型管理</strong>部分</li><li>点击<strong>添加新类型</strong>按钮</li><li>填写类型名称、描述、默认津贴标准等信息</li><li>保存设置后，新类型会出现在任务发布的选择列表中</li></ol><p><strong>注意事项：</strong></p><ul><li>每个任务类型可以设置不同的津贴计算规则</li><li>可以为不同类型设置不同的审批流程</li><li>可以设置类型的可见性（哪些管理员可以使用）</li><li>已存在的任务类型不能删除，但可以停用</li></ul>",
        category: "system",
        views: 118,
        helpful: 102,
        notHelpful: 2,
        hotness: 2,
        tags: ["任务类型", "设置", "配置"]
    },
    {
        id: 10,
        question: "博士生毕业后如何处理其账户？",
        answer: "<p>博士生毕业后的账户处理流程：</p><ol><li>在<strong>博士生管理</strong>页面，找到该博士生</li><li>点击<strong>编辑</strong>按钮，将状态修改为<strong>已毕业</strong></li><li>系统会提示进行以下操作：<ul><li>确认所有任务已完成或已转移</li><li>确认津贴已全部结算</li><li>备份博士生的所有数据记录</li></ul></li><li>确认后，博士生的账户会被归档</li><li>归档后，博士生不能再登录系统，但历史记录仍可查询</li></ol><p><strong>数据保留：</strong>根据系统设置的数据保留期限，毕业生的数据会保留相应时间，之后可以手动或自动清理。</p>",
        category: "student",
        views: 115,
        helpful: 98,
        notHelpful: 1,
        hotness: 1,
        tags: ["毕业", "归档", "账户管理"]
    }
];

// 分类统计
const categoryStats = {
    all: faqData.length,
    login: faqData.filter(item => item.category === 'login').length,
    task: faqData.filter(item => item.category === 'task').length,
    student: faqData.filter(item => item.category === 'student').length,
    stipend: faqData.filter(item => item.category === 'stipend').length,
    system: faqData.filter(item => item.category === 'system').length,
    report: faqData.filter(item => item.category === 'report').length
};

// 当前状态
let currentCategory = 'all';
let currentSearchQuery = '';
let activeFAQId = null;
let userVotes = JSON.parse(localStorage.getItem('faq_votes') || '{}');

document.addEventListener('DOMContentLoaded', function() {
    console.log('常见问题页面加载完成');
    
    // 初始化通知系统
    if (!window.notificationSystem) {
        window.notificationSystem = new NotificationSystem();
    }
    
    // 更新通知计数
    updateNotificationCount();
    
    // 初始化页面
    initFAQPage();
    
    // 绑定事件
    bindEvents();
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
    const searchInput = document.getElementById('faqSearch');
    let searchTimeout;
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchFAQ();
            }, 300);
        });
        
        // 搜索框回车键支持
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchFAQ();
            }
        });
    }
    
    // 问题提交表单
    const questionForm = document.getElementById('questionForm');
    if (questionForm) {
        questionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitQuestion();
        });
    }
}

function initFAQPage() {
    // 更新分类统计
    updateCategoryStats();
    
    // 加载热门问题
    loadHotQuestions();
    
    // 加载问题列表
    filterFAQ('all');
}

function updateCategoryStats() {
    // 更新分类卡片上的计数
    Object.keys(categoryStats).forEach(category => {
        const countElement = document.querySelector(`[data-category="${category}"] .category-count`);
        if (countElement) {
            countElement.textContent = `${categoryStats[category]} 个问题`;
        }
    });
}

function loadHotQuestions() {
    const hotQuestionsGrid = document.getElementById('hotQuestionsGrid');
    if (!hotQuestionsGrid) return;
    
    // 按热度排序（根据浏览量和好评率）
    const hotQuestions = [...faqData]
        .sort((a, b) => {
            const scoreA = (a.views * 0.3) + (a.helpful * 0.5) + (a.hotness * 20);
            const scoreB = (b.views * 0.3) + (b.helpful * 0.5) + (b.hotness * 20);
            return scoreB - scoreA;
        })
        .slice(0, 6); // 只显示前6个
    
    hotQuestionsGrid.innerHTML = '';
    
    if (hotQuestions.length === 0) {
        hotQuestionsGrid.innerHTML = '<p class="no-hot-questions">暂无热门问题</p>';
        return;
    }
    
    hotQuestions.forEach(faq => {
        const categoryClass = getCategoryClass(faq.category);
        const categoryText = getCategoryText(faq.category);
        
        // 生成热度图标
        const heatIcons = generateHeatIcons(faq.hotness);
        
        const questionCard = document.createElement('div');
        questionCard.className = 'hot-question-card';
        questionCard.onclick = () => toggleFAQ(faq.id);
        
        questionCard.innerHTML = `
            <div class="hot-question-header">
                <h4 class="hot-question-title">${faq.question}</h4>
                <span class="hot-question-category ${categoryClass}">${categoryText}</span>
            </div>
            <div class="hot-question-preview">${faq.answer.replace(/<[^>]*>/g, '').substring(0, 100)}...</div>
            <div class="hot-question-footer">
                <div class="hot-question-stats">
                    <span class="hot-question-stat">
                        <i class="fas fa-eye"></i> ${faq.views}
                    </span>
                    <span class="hot-question-stat">
                        <i class="fas fa-thumbs-up"></i> ${faq.helpful}
                    </span>
                </div>
                <div class="hot-question-hotness">
                    ${heatIcons}
                </div>
            </div>
        `;
        
        hotQuestionsGrid.appendChild(questionCard);
    });
}

function generateHeatIcons(hotness) {
    let icons = '';
    for (let i = 0; i < 5; i++) {
        if (i < hotness) {
            icons += '<i class="fas fa-fire heat-icon"></i>';
        } else {
            icons += '<i class="far fa-fire"></i>';
        }
    }
    return icons;
}

function filterFAQ(category) {
    currentCategory = category;
    currentSearchQuery = '';
    
    // 更新分类卡片激活状态
    document.querySelectorAll('.category-card').forEach(card => {
        if (card.getAttribute('data-category') === category) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }
    });
    
    // 过滤问题
    let filteredQuestions;
    if (category === 'all') {
        filteredQuestions = faqData;
    } else {
        filteredQuestions = faqData.filter(item => item.category === category);
    }
    
    // 更新显示信息
    updateFilterInfo(filteredQuestions.length);
    
    // 显示问题列表
    displayFAQList(filteredQuestions);
    
    // 隐藏无结果提示
    document.getElementById('noResults').style.display = 'none';
    
    // 清除搜索框
    const searchInput = document.getElementById('faqSearch');
    if (searchInput) {
        searchInput.value = '';
    }
    
    // 隐藏清除按钮
    const searchClearBtn = document.querySelector('.search-clear');
    if (searchClearBtn) {
        searchClearBtn.style.display = 'none';
    }
}

function updateFilterInfo(count) {
    const filterInfo = document.getElementById('filterInfo');
    if (filterInfo) {
        const categoryText = getCategoryText(currentCategory);
        filterInfo.textContent = `显示${categoryText} ${count} 个问题`;
    }
}

function displayFAQList(questions) {
    const faqList = document.getElementById('faqList');
    if (!faqList) return;
    
    faqList.innerHTML = '';
    
    if (questions.length === 0) {
        // 显示无结果提示
        document.getElementById('noResults').style.display = 'block';
        return;
    }
    
    // 按ID排序（或者可以按其他规则排序）
    const sortedQuestions = [...questions].sort((a, b) => b.id - a.id);
    
    sortedQuestions.forEach(faq => {
        const categoryClass = getCategoryClass(faq.category);
        const categoryText = getCategoryText(faq.category);
        const isActive = activeFAQId === faq.id;
        const userVote = userVotes[faq.id] || null;
        
        const faqItem = document.createElement('div');
        faqItem.className = `faq-item ${isActive ? 'active' : ''}`;
        faqItem.dataset.faqId = faq.id;
        
        // 如果有搜索词，高亮显示
        let highlightedQuestion = faq.question;
        let highlightedAnswer = faq.answer;
        
        if (currentSearchQuery) {
            const regex = new RegExp(`(${currentSearchQuery})`, 'gi');
            highlightedQuestion = faq.question.replace(regex, '<mark>$1</mark>');
            highlightedAnswer = highlightTextInHTML(faq.answer, currentSearchQuery);
        }
        
        faqItem.innerHTML = `
            <div class="faq-question" onclick="toggleFAQ(${faq.id})">
                <div class="question-content">
                    <div class="question-title">${highlightedQuestion}</div>
                    <div class="question-meta">
                        <span class="question-category ${categoryClass}">${categoryText}</span>
                        <span><i class="far fa-eye"></i> ${faq.views}</span>
                        <span><i class="far fa-thumbs-up"></i> ${faq.helpful}</span>
                    </div>
                </div>
                <div class="question-icon">
                    <i class="fas fa-chevron-down"></i>
                </div>
            </div>
            <div class="faq-answer" style="${isActive ? '' : 'display: none;'}">
                <div class="answer-content">
                    ${highlightedAnswer}
                </div>
                <div class="answer-actions">
                    <span>这个回答对您有帮助吗？</span>
                    <button class="action-btn ${userVote === 'helpful' ? 'active' : ''}" onclick="voteFAQ(${faq.id}, 'helpful')">
                        <i class="fas fa-thumbs-up"></i> 有帮助 (${faq.helpful})
                    </button>
                    <button class="action-btn ${userVote === 'notHelpful' ? 'active' : ''}" onclick="voteFAQ(${faq.id}, 'notHelpful')">
                        <i class="fas fa-thumbs-down"></i> 没帮助 (${faq.notHelpful})
                    </button>
                </div>
            </div>
        `;
        
        faqList.appendChild(faqItem);
    });
}

function highlightTextInHTML(html, searchText) {
    if (!searchText) return html;
    
    const regex = new RegExp(`(${searchText})`, 'gi');
    
    // 替换HTML标签内的文本内容，但保持标签完整
    return html.replace(/>([^<]+)</g, function(match, text) {
        return '>' + text.replace(regex, '<mark>$1</mark>') + '<';
    });
}

function searchFAQ() {
    const searchInput = document.getElementById('faqSearch');
    const searchClearBtn = document.querySelector('.search-clear');
    const query = searchInput.value.trim().toLowerCase();
    
    currentSearchQuery = query;
    
    if (!query) {
        clearSearch();
        return;
    }
    
    // 显示清除按钮
    if (searchClearBtn) {
        searchClearBtn.style.display = 'block';
    }
    
    // 在所有问题中搜索
    const searchResults = faqData.filter(faq => {
        return faq.question.toLowerCase().includes(query) ||
               faq.answer.toLowerCase().includes(query) ||
               faq.tags.some(tag => tag.toLowerCase().includes(query));
    });
    
    // 更新显示信息
    updateSearchInfo(searchResults.length, query);
    
    // 显示搜索结果
    displayFAQList(searchResults);
    
    // 如果没有结果，显示提示
    const noResults = document.getElementById('noResults');
    const searchQueryText = document.getElementById('searchQueryText');
    
    if (searchResults.length === 0) {
        noResults.style.display = 'block';
        if (searchQueryText) {
            searchQueryText.textContent = query;
        }
    } else {
        noResults.style.display = 'none';
    }
    
    // 重置分类筛选状态
    document.querySelectorAll('.category-card').forEach(card => {
        card.classList.remove('active');
    });
}

function updateSearchInfo(count, query) {
    const filterInfo = document.getElementById('filterInfo');
    if (filterInfo) {
        filterInfo.textContent = `搜索"${query}"找到 ${count} 个相关问题`;
    }
}

function clearSearch() {
    const searchInput = document.getElementById('faqSearch');
    const searchClearBtn = document.querySelector('.search-clear');
    
    if (searchInput) {
        searchInput.value = '';
    }
    
    if (searchClearBtn) {
        searchClearBtn.style.display = 'none';
    }
    
    // 恢复之前的分类筛选
    filterFAQ(currentCategory);
}

function toggleFAQ(faqId) {
    const faqItem = document.querySelector(`[data-faq-id="${faqId}"]`);
    const answerSection = faqItem?.querySelector('.faq-answer');
    
    if (!faqItem || !answerSection) return;
    
    // 如果点击的是已经展开的问题，关闭它
    if (activeFAQId === faqId) {
        faqItem.classList.remove('active');
        answerSection.style.display = 'none';
        activeFAQId = null;
        return;
    }
    
    // 关闭其他展开的问题
    document.querySelectorAll('.faq-item.active').forEach(item => {
        if (item.dataset.faqId !== faqId.toString()) {
            item.classList.remove('active');
            item.querySelector('.faq-answer').style.display = 'none';
        }
    });
    
    // 打开当前问题
    faqItem.classList.add('active');
    answerSection.style.display = 'block';
    activeFAQId = faqId;
    
    // 增加浏览量（模拟）
    const faq = faqData.find(item => item.id === faqId);
    if (faq) {
        faq.views++;
        
        // 更新热门问题显示
        loadHotQuestions();
        
        // 更新当前问题的显示（如果可见）
        const viewsElement = faqItem.querySelector('.faq-question .fa-question-meta span:nth-child(2)');
        if (viewsElement) {
            viewsElement.innerHTML = `<i class="far fa-eye"></i> ${faq.views}`;
        }
    }
}

function voteFAQ(faqId, voteType) {
    const faq = faqData.find(item => item.id === faqId);
    if (!faq) return;
    
    // 检查用户是否已经投过票
    const userVote = userVotes[faqId];
    
    // 如果用户已经投过相同的票，取消投票
    if (userVote === voteType) {
        if (voteType === 'helpful') {
            faq.helpful--;
        } else {
            faq.notHelpful--;
        }
        delete userVotes[faqId];
    } else {
        // 如果用户投了不同的票，先取消之前的投票
        if (userVote === 'helpful') {
            faq.helpful--;
        } else if (userVote === 'notHelpful') {
            faq.notHelpful--;
        }
        
        // 记录新的投票
        if (voteType === 'helpful') {
            faq.helpful++;
        } else {
            faq.notHelpful++;
        }
        userVotes[faqId] = voteType;
    }
    
    // 保存投票记录到本地存储
    localStorage.setItem('faq_votes', JSON.stringify(userVotes));
    
    // 更新UI
    updateFAQVotes(faqId);
    
    // 更新热门问题显示
    loadHotQuestions();
}

function updateFAQVotes(faqId) {
    const faq = faqData.find(item => item.id === faqId);
    if (!faq) return;
    
    const faqItem = document.querySelector(`[data-faq-id="${faqId}"]`);
    if (!faqItem) return;
    
    // 更新投票按钮
    const helpfulBtn = faqItem.querySelector('.action-btn:nth-child(2)');
    const notHelpfulBtn = faqItem.querySelector('.action-btn:nth-child(3)');
    const userVote = userVotes[faqId];
    
    if (helpfulBtn) {
        helpfulBtn.innerHTML = `<i class="fas fa-thumbs-up"></i> 有帮助 (${faq.helpful})`;
        helpfulBtn.classList.toggle('active', userVote === 'helpful');
    }
    
    if (notHelpfulBtn) {
        notHelpfulBtn.innerHTML = `<i class="fas fa-thumbs-down"></i> 没帮助 (${faq.notHelpful})`;
        notHelpfulBtn.classList.toggle('active', userVote === 'notHelpful');
    }
    
    // 更新列表中的显示
    const metaHelpful = faqItem.querySelector('.faq-question .fa-question-meta span:nth-child(3)');
    if (metaHelpful) {
        metaHelpful.innerHTML = `<i class="far fa-thumbs-up"></i> ${faq.helpful}`;
    }
}

function toggleCategories() {
    const categoriesGrid = document.getElementById('categoriesGrid');
    const toggleBtn = document.querySelector('.categories-header .btn-icon i');
    
    if (categoriesGrid.classList.contains('collapsed')) {
        categoriesGrid.classList.remove('collapsed');
        toggleBtn.classList.remove('fa-chevron-down');
        toggleBtn.classList.add('fa-chevron-up');
    } else {
        categoriesGrid.classList.add('collapsed');
        toggleBtn.classList.remove('fa-chevron-up');
        toggleBtn.classList.add('fa-chevron-down');
    }
}

function refreshHotQuestions() {
    // 模拟刷新热门问题
    showToast('正在刷新热门问题...', 'info');
    
    setTimeout(() => {
        // 可以在这里添加实际的刷新逻辑
        loadHotQuestions();
        showToast('热门问题已刷新', 'success');
    }, 500);
}

function suggestQuestion() {
    // 滚动到问题提交区域
    const submissionSection = document.querySelector('.question-submission');
    if (submissionSection) {
        submissionSection.scrollIntoView({ behavior: 'smooth' });
        
        // 高亮表单
        submissionSection.style.animation = 'highlight 2s';
        setTimeout(() => {
            submissionSection.style.animation = '';
        }, 2000);
    }
}

function submitQuestion() {
    const form = document.getElementById('questionForm');
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        showToast('请填写所有必填字段', 'error');
        return;
    }
    
    const category = document.getElementById('questionCategory').value;
    const priority = document.getElementById('questionPriority').value;
    const title = document.getElementById('questionTitle').value;
    const detail = document.getElementById('questionDetail').value;
    const email = document.getElementById('contactEmail').value;
    
    // 模拟提交问题
    console.log('提交新问题:', { category, priority, title, detail, email });
    
    // 显示成功消息
    showToast('问题已提交成功！我们的技术支持团队会尽快回复您。', 'success');
    
    // 重置表单
    resetForm();
    
    // 模拟添加到FAQ列表（实际应用中应该发送到服务器）
    setTimeout(() => {
        // 这里可以添加实际的后端交互逻辑
        console.log('问题已添加到待处理列表');
    }, 1000);
}

function resetForm() {
    const form = document.getElementById('questionForm');
    if (form) {
        form.reset();
        form.classList.remove('was-validated');
    }
}

function getCategoryClass(category) {
    const categoryClasses = {
        'login': 'login',
        'task': 'task',
        'student': 'student',
        'stipend': 'stipend',
        'system': 'system',
        'report': 'report'
    };
    return categoryClasses[category] || '';
}

function getCategoryText(category) {
    const categoryTexts = {
        'all': '全部',
        'login': '登录与账户',
        'task': '任务管理',
        'student': '博士生管理',
        'stipend': '津贴管理',
        'system': '系统设置',
        'report': '统计报表'
    };
    return categoryTexts[category] || category;
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