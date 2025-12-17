// js/contact-init.js - 联系反馈页面初始化脚本
(function() {
    'use strict';
    
    // 防止重复加载
    if (window.contactInit) return;
    window.contactInit = true;
    
    console.log('contact-init.js 加载完成');
    
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOMContentLoaded - 开始初始化联系反馈页面');
        
        // 1. 检查登录状态并初始化界面
        initUserInterface();
        
        // 2. 绑定事件监听器
        bindEventListeners();
        
        // 3. 初始化联系反馈功能
        if (typeof initContactPage === 'function') {
            initContactPage();
        }
    });
    
    // 初始化用户界面
    function initUserInterface() {
        // 使用 theme.js 提供的辅助函数
        const userData = getCurrentUser ? getCurrentUser() : checkAuth();
        
        if (!userData) {
            console.log('未登录或用户数据无效，跳转到登录页');
            window.location.href = 'index.html';
            return;
        }
        
        console.log('用户数据:', userData);
        
        // 设置用户类型
        const userType = userData.type || 'student'; // 默认为博士生
        const userName = userData.name;
        const userRole = userData.role || (userType === 'admin' ? '管理员' : '博士生');
        
        console.log(`当前用户: ${userName} (${userRole})`);
        
        // 生成顶部导航栏
        generateTopBar(userType, userName, userRole);
        
        // 生成侧边栏
        generateSidebar(userType);
        
        // 更新页脚链接
        updateFooterLinks(userType);
        
        // 预填表单信息
        prefillContactForm(userData);
        
        // 初始化通知按钮
        initNotificationButton();
    }
    
    // 生成顶部导航栏
    function generateTopBar(userType, userName, userRole) {
        const topBarContainer = document.getElementById('topBarContainer');
        
        let mainNavLinks = '';
        let userDashboardLink = '';
        
        if (userType === 'admin') {
            // 管理员导航
            userDashboardLink = 'admin-dashboard.html';
            mainNavLinks = `
                <a href="${userDashboardLink}" class="nav-item">
                    <i class="fas fa-tachometer-alt"></i> 工作台首页
                </a>
                <a href="admin-management.html" class="nav-item">
                    <i class="fas fa-user-shield"></i> 管理员管理
                </a>
            `;
        } else {
            // 博士生导航
            userDashboardLink = 'student-dashboard.html';
            mainNavLinks = `
                <a href="${userDashboardLink}" class="nav-item">
                    <i class="fas fa-tasks"></i> 个人首页
                </a>
                <a href="profile.html" class="nav-item">
                    <i class="fas fa-user-circle"></i> 个人信息
                </a>
            `;
        }
        
        topBarContainer.innerHTML = `
            <div class="top-bar">
                <a href="${userDashboardLink}" class="logo">
                    <i class="fas fa-graduation-cap"></i>
                    <span>DocIM</span> Stipend
                </a>
                
                <div class="main-nav">
                    ${mainNavLinks}
                </div>
                
                <div class="top-tools">
                    <div class="user-info">
                        <span class="role-badge">${userRole}</span>
                        <span id="username">${userName}</span>
                    </div>
                    
                    <button class="notification-btn" id="notificationBtn">
                        <i class="fas fa-bell"></i>
                        <span class="notification-badge" id="notificationCount">0</span>
                    </button>
                    
                    <button class="logout-btn" id="logoutBtn">
                        <i class="fas fa-sign-out-alt"></i>
                        退出
                    </button>
                </div>
            </div>
        `;
    }
    
    // 生成侧边栏
    function generateSidebar(userType) {
        const sidebarContainer = document.getElementById('sidebarContainer');
        
        let sidebarItems = '';
        
        if (userType === 'admin') {
            // 管理员侧边栏
            sidebarItems = `
                <nav class="sidebar-nav">
                    <a href="admin-dashboard.html" class="sidebar-item">
                        <i class="fas fa-tachometer-alt"></i>
                        <span>工作台首页</span>
                    </a>
                    <a href="task-list-admin.html" class="sidebar-item">
                        <i class="fas fa-list-ul"></i>
                        <span>任务管理</span>
                    </a>
                    <a href="student-list.html" class="sidebar-item">
                        <i class="fas fa-users"></i>
                        <span>博士生管理</span>
                    </a>
                    <a href="stats-overview.html" class="sidebar-item">
                        <i class="fas fa-chart-bar"></i>
                        <span>统计分析</span>
                    </a>
                    <a href="system-settings.html" class="sidebar-item">
                        <i class="fas fa-cog"></i>
                        <span>系统设置</span>
                    </a>
                    <a href="admin-management.html" class="sidebar-item">
                        <i class="fas fa-user-shield"></i>
                        <span>管理员管理</span>
                    </a>
                    <a href="notification-center.html" class="sidebar-item">
                        <i class="fas fa-bell"></i>
                        <span>通知中心</span>
                        <span class="sidebar-badge" id="sidebarNotificationCount">0</span>
                    </a>
                </nav>
            `;
        } else {
            // 博士生侧边栏
            sidebarItems = `
                <nav class="sidebar-nav">
                    <a href="student-dashboard.html" class="sidebar-item">
                        <i class="fas fa-home"></i>
                        <span>工作台首页</span>
                    </a>
                    <a href="task-list.html" class="sidebar-item">
                        <i class="fas fa-list-ul"></i>
                        <span>任务列表</span>
                    </a>
                    <a href="statistics.html" class="sidebar-item">
                        <i class="fas fa-chart-bar"></i>
                        <span>个人统计</span>
                    </a>
                    <a href="notification-center.html" class="sidebar-item">
                        <i class="fas fa-bell"></i>
                        <span>通知中心</span>
                        <span class="sidebar-badge" id="sidebarNotificationCount">0</span>
                    </a>
                </nav>
            `;
        }
        
        sidebarContainer.innerHTML = `
            <div class="sidebar">
                ${sidebarItems}
            </div>
        `;
    }
    
    // 更新页脚链接
    function updateFooterLinks(userType) {
        const guideLink = document.getElementById('guideLink');
        const manualLink = document.getElementById('manualLink');
        const faqLink = document.getElementById('faqLink');
        
        if (userType === 'admin') {
            guideLink.href = 'admin-guide.html';
            manualLink.href = 'admin-manual.html';
            faqLink.href = 'admin-faq.html';
        } else {
            guideLink.href = 'guide.html';
            manualLink.href = 'manual.html';
            faqLink.href = 'faq.html';
        }
    }
    
    // 预填表单信息
    function prefillContactForm(userData) {
        setTimeout(() => {
            const contactNameInput = document.getElementById('contactName');
            const contactEmailInput = document.getElementById('contactEmail');
            
            if (contactNameInput && !contactNameInput.value) {
                contactNameInput.value = userData.name || '';
            }
            
            if (contactEmailInput && !contactEmailInput.value) {
                if (userData.email) {
                    contactEmailInput.value = userData.email;
                } else if (userData.id) {
                    contactEmailInput.value = `${userData.id}@docim.edu.cn`;
                }
            }
            
            // 如果是博士生，自动填充电话
            if (userData.type === 'student') {
                const contactPhoneInput = document.getElementById('contactPhone');
                if (contactPhoneInput && !contactPhoneInput.value && userData.phone) {
                    contactPhoneInput.value = userData.phone;
                }
            }
        }, 100);
    }
    
    // 初始化通知按钮
    function initNotificationButton() {
        const notificationBtn = document.getElementById('notificationBtn');
        const notificationPanel = document.getElementById('notificationPanel');
        const notificationOverlay = document.getElementById('notificationOverlay');
        
        if (notificationBtn && notificationPanel) {
            notificationBtn.addEventListener('click', function() {
                notificationPanel.classList.toggle('show');
                if (notificationOverlay) {
                    notificationOverlay.classList.toggle('show');
                }
            });
        }
        
        if (notificationOverlay) {
            notificationOverlay.addEventListener('click', function() {
                const panel = document.getElementById('notificationPanel');
                if (panel) {
                    panel.classList.remove('show');
                    notificationOverlay.classList.remove('show');
                }
            });
        }
    }
    
    // 检查登录状态的辅助函数
    function checkAuth() {
        try {
            const savedUser = localStorage.getItem('docim_user');
            if (!savedUser) return null;
            
            const userData = JSON.parse(savedUser);
            
            // 确保有 name 字段
            if (!userData.name) return null;
            
            // 确保有 type 字段
            if (!userData.type) {
                if (userData.role && (userData.role.includes('管理') || userData.role.includes('admin'))) {
                    userData.type = 'admin';
                } else {
                    userData.type = 'student';
                }
                localStorage.setItem('docim_user', JSON.stringify(userData));
            }
            
            return userData;
        } catch (error) {
            console.error('认证检查失败:', error);
            return null;
        }
    }
    
    // 绑定事件监听器
    function bindEventListeners() {
        // 绑定退出按钮
        document.addEventListener('click', function(e) {
            if (e.target.id === 'logoutBtn' || e.target.closest('#logoutBtn')) {
                logout();
            }
        });
        
        // 绑定渠道按钮
        document.querySelectorAll('.channel-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const action = this.getAttribute('data-action');
                handleChannelAction(action);
            });
        });
        
        // 绑定格式按钮
        document.querySelectorAll('.format-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const format = this.getAttribute('data-format');
                if (typeof formatText === 'function') {
                    formatText(format);
                }
            });
        });
        
        // 绑定其他按钮
        document.getElementById('saveDraftBtn')?.addEventListener('click', saveDraft);
        document.getElementById('loadDraftBtn')?.addEventListener('click', loadDraft);
        document.getElementById('previewBtn')?.addEventListener('click', previewFeedback);
        document.getElementById('refreshStatusBtn')?.addEventListener('click', refreshStatus);
    }
    
    // 处理渠道按钮动作
    function handleChannelAction(action) {
        switch (action) {
            case 'support':
                // 滚动到技术支持相关区域
                const supportChannel = document.querySelector('.channel-card:nth-child(1)');
                if (supportChannel) {
                    supportChannel.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    supportChannel.style.animation = 'highlight 2s';
                    setTimeout(() => {
                        supportChannel.style.animation = '';
                    }, 2000);
                }
                break;
                
            case 'suggestion':
                // 设置反馈类型为建议
                const suggestionType = document.getElementById('feedbackType');
                if (suggestionType) {
                    suggestionType.value = 'suggestion';
                    if (typeof updateFormFields === 'function') {
                        updateFormFields();
                    }
                }
                // 滚动到表单
                const feedbackForm = document.querySelector('.feedback-form');
                if (feedbackForm) {
                    feedbackForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                break;
                
            case 'bug':
                // 设置反馈类型为问题报告
                const bugType = document.getElementById('feedbackType');
                if (bugType) {
                    bugType.value = 'bug';
                    if (typeof updateFormFields === 'function') {
                        updateFormFields();
                    }
                }
                // 滚动到表单
                const form = document.querySelector('.feedback-form');
                if (form) {
                    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                break;
        }
    }
    
    // 退出登录
    function logout() {
        if (confirm('确定要退出登录吗？')) {
            localStorage.removeItem('docim_user');
            window.location.href = 'index.html';
        }
    }
})();