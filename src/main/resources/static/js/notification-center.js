// js/notification-center.js - 通知中心页面JavaScript
class NotificationCenter {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = 5;
        this.currentFilter = 'all';
        this.currentType = 'all';
        this.init();
    }
    
    init() {
        console.log('NotificationCenter 初始化开始');
        
        try {
            // 检查登录状态
            if (!this.checkAuth()) {
                return;
            }
            
            // 绑定事件
            this.bindEvents();
            
            // 初始化通知系统
            this.initNotificationSystem();
            
            // 加载数据
            this.loadData();
            
            // 加载设置
            this.loadSettings();
            
            console.log('NotificationCenter 初始化完成');
            
        } catch (error) {
            console.error('NotificationCenter 初始化失败:', error);
            this.showError('页面初始化失败，请刷新重试');
        }
    }
    
    checkAuth() {
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
    
    initNotificationSystem() {
        // 确保通知系统已初始化
        if (!window.notificationSystem) {
            console.log('初始化通知系统...');
            window.notificationSystem = new NotificationSystem();
        } else {
            console.log('通知系统已存在，使用现有实例');
        }
        
        // 更新通知计数
        this.updateNotificationStats();
    }
    
    bindEvents() {
        console.log('绑定通知中心事件...');
        
        // 刷新按钮
        const refreshBtn = document.getElementById('refreshNotificationsBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshNotifications();
            });
        }
        
        // 筛选按钮
        document.querySelectorAll('.filter-btn[data-filter]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.setFilter(btn.dataset.filter);
            });
        });
        
        document.querySelectorAll('.filter-btn[data-type]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.setTypeFilter(btn.dataset.type);
            });
        });
        
        // 分页按钮
        const prevBtn = document.getElementById('prevPageBtn');
        const nextBtn = document.getElementById('nextPageBtn');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.prevPage();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.nextPage();
            });
        }
        
        // 标记全部已读
        const markAllReadBtn = document.getElementById('markAllReadBtnCenter');
        if (markAllReadBtn) {
            markAllReadBtn.addEventListener('click', () => {
                this.markAllAsRead();
            });
        }
        
        // 清空已读通知
        const clearAllBtn = document.getElementById('clearAllBtnCenter');
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', () => {
                this.clearReadNotifications();
            });
        }
        
        // 设置开关
        const settingSwitches = document.querySelectorAll('.settings-grid input[type="checkbox"]');
        settingSwitches.forEach(switchInput => {
            switchInput.addEventListener('change', () => {
                this.saveSettings();
            });
        });
    }
    
    loadData() {
        console.log('加载通知数据...');
        this.updateNotificationStats();
        this.renderNotifications();
    }
    
    updateNotificationStats() {
        if (!window.notificationSystem) {
            console.warn('通知系统未初始化');
            return;
        }
        
        const notifications = window.notificationSystem.notifications;
        
        // 统计数据 - 删除任务通知统计
        const total = notifications.length;
        const unread = notifications.filter(n => !n.read).length;
        const readNotifications = notifications.filter(n => n.read).length;
        
        // 更新统计显示
        document.getElementById('total-notifications').textContent = total;
        document.getElementById('unread-notifications').textContent = unread;
        document.getElementById('read-notifications').textContent = readNotifications;
    }
    
    renderNotifications() {
        if (!window.notificationSystem) {
            console.warn('通知系统未初始化');
            return;
        }
        
        const container = document.getElementById('notificationsContainer');
        if (!container) return;
        
        let filteredNotifications = [...window.notificationSystem.notifications];
        
        // 应用状态筛选
        if (this.currentFilter === 'unread') {
            filteredNotifications = filteredNotifications.filter(n => !n.read);
        } else if (this.currentFilter === 'read') {
            filteredNotifications = filteredNotifications.filter(n => n.read);
        }
        
        // 应用类型筛选 - 移除重要提醒类型
        if (this.currentType !== 'all') {
            filteredNotifications = filteredNotifications.filter(n => n.type === this.currentType);
        }
        
        // 按时间倒序排序
        filteredNotifications.sort((a, b) => new Date(b.time) - new Date(a.time));
        
        // 分页计算
        const totalItems = filteredNotifications.length;
        const totalPages = Math.ceil(totalItems / this.itemsPerPage) || 1;
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageNotifications = filteredNotifications.slice(startIndex, endIndex);
        
        // 更新分页信息
        document.getElementById('currentPage').textContent = this.currentPage;
        document.getElementById('totalPages').textContent = totalPages;
        
        const prevBtn = document.getElementById('prevPageBtn');
        const nextBtn = document.getElementById('nextPageBtn');
        
        if (prevBtn) prevBtn.disabled = this.currentPage <= 1;
        if (nextBtn) nextBtn.disabled = this.currentPage >= totalPages;
        
        // 渲染通知列表
        if (pageNotifications.length === 0) {
            container.innerHTML = `
                <div class="notifications-empty">
                    <div class="notifications-empty-icon">
                        <i class="far fa-bell-slash"></i>
                    </div>
                    <h3>暂无通知</h3>
                    <p>当前筛选条件下没有通知，尝试调整筛选条件或添加新通知</p>
                    <button class="btn-primary" onclick="addTestNotification()">
                        <i class="fas fa-plus"></i>
                        添加测试通知
                    </button>
                </div>
            `;
            return;
        }
        
        container.innerHTML = pageNotifications.map(notification => `
            <div class="notification-item-full ${notification.read ? 'read' : 'unread'}" 
                 data-id="${notification.id}">
                <div class="notification-header-full">
                    <div class="notification-title-full">
                        <div class="notification-icon-full ${notification.type}">
                            <i class="${notification.icon}"></i>
                        </div>
                        <div class="notification-title-text">${notification.title}</div>
                    </div>
                    <div class="notification-time-full">
                        ${window.notificationSystem.formatTime(notification.time)}
                    </div>
                </div>
                
                <div class="notification-content-full">
                    <div class="notification-message-full">${notification.message}</div>
                    <div class="notification-meta-full">
                        <span class="notification-type-full ${notification.type}">
                            ${window.notificationSystem.getTypeText(notification.type)}
                        </span>
                        <span>•</span>
                        <span>${notification.read ? '已读' : '未读'}</span>
                    </div>
                </div>
                
                <div class="notification-actions-full">
                    ${!notification.read ? `
                    <button class="notification-action-full" onclick="notificationCenter.markAsRead(${notification.id})">
                        <i class="fas fa-check"></i>
                        标记为已读
                    </button>
                    ` : ''}
                    
                    <button class="notification-action-full primary" onclick="notificationCenter.openNotificationDetail(${notification.id})">
                        <i class="fas fa-external-link-alt"></i>
                        查看详情
                    </button>
                    
                    <button class="notification-action-full" onclick="notificationCenter.deleteNotification(${notification.id})">
                        <i class="fas fa-trash-alt"></i>
                        删除通知
                    </button>
                </div>
            </div>
        `).join('');
        
        // 绑定通知项点击事件
        document.querySelectorAll('.notification-item-full').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.notification-action-full')) {
                    const id = parseInt(item.getAttribute('data-id'));
                    this.openNotificationDetail(id);
                }
            });
        });
    }
    
    setFilter(filter) {
        console.log('设置筛选器:', filter);
        
        // 更新按钮状态
        document.querySelectorAll('.filter-btn[data-filter]').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.querySelector(`.filter-btn[data-filter="${filter}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
        
        // 更新筛选条件
        this.currentFilter = filter;
        this.currentPage = 1;
        this.renderNotifications();
    }
    
    setTypeFilter(type) {
        console.log('设置类型筛选:', type);
        
        // 更新按钮状态
        document.querySelectorAll('.filter-btn[data-type]').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.querySelector(`.filter-btn[data-type="${type}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
        
        // 更新筛选条件
        this.currentType = type;
        this.currentPage = 1;
        this.renderNotifications();
    }
    
    prevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.renderNotifications();
        }
    }
    
    nextPage() {
        const totalItems = this.getFilteredNotifications().length;
        const totalPages = Math.ceil(totalItems / this.itemsPerPage) || 1;
        
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.renderNotifications();
        }
    }
    
    getFilteredNotifications() {
        if (!window.notificationSystem) return [];
        
        let filtered = [...window.notificationSystem.notifications];
        
        // 应用状态筛选
        if (this.currentFilter === 'unread') {
            filtered = filtered.filter(n => !n.read);
        } else if (this.currentFilter === 'read') {
            filtered = filtered.filter(n => n.read);
        }
        
        // 应用类型筛选 - 移除重要提醒类型
        if (this.currentType !== 'all') {
            filtered = filtered.filter(n => n.type === this.currentType);
        }
        
        return filtered;
    }
    
    refreshNotifications() {
        console.log('刷新通知...');
        
        // 重新加载通知数据
        if (window.notificationSystem) {
            window.notificationSystem.notifications = window.notificationSystem.loadNotifications();
            window.notificationSystem.saveNotifications();
        }
        
        this.updateNotificationStats();
        this.renderNotifications();
        
        // 显示刷新提示
        this.showToast('通知已刷新', 'success');
    }
    
    markAsRead(id) {
        if (window.notificationSystem) {
            window.notificationSystem.markAsRead(id);
            this.updateNotificationStats();
            this.renderNotifications();
        }
    }
    
    markAllAsRead() {
        if (window.notificationSystem) {
            window.notificationSystem.markAllAsRead();
            this.updateNotificationStats();
            this.renderNotifications();
            
            this.showToast('所有通知已标记为已读', 'success');
        }
    }
    
    clearReadNotifications() {
        if (!window.notificationSystem) return;
        
        if (confirm('确定要清空所有已读通知吗？此操作不可撤销。')) {
            const newNotifications = window.notificationSystem.notifications.filter(n => !n.read);
            window.notificationSystem.notifications = newNotifications;
            window.notificationSystem.saveNotifications();
            
            this.updateNotificationStats();
            this.renderNotifications();
            
            this.showToast('已读通知已清空', 'success');
        }
    }
    
    deleteNotification(id) {
        if (!window.notificationSystem) return;
        
        if (confirm('确定要删除这条通知吗？此操作不可撤销。')) {
            const notification = window.notificationSystem.notifications.find(n => n.id === id);
            if (!notification) return;
            
            // 从数组中移除
            window.notificationSystem.notifications = window.notificationSystem.notifications.filter(n => n.id !== id);
            window.notificationSystem.saveNotifications();
            
            this.updateNotificationStats();
            this.renderNotifications();
            
            this.showToast('通知已删除', 'success');
        }
    }
    
    openNotificationDetail(id) {
        // 标记为已读
        this.markAsRead(id);
        
        // 跳转到通知详情页面
        window.location.href = `notification-detail.html?id=${id}`;
    }
    
    loadSettings() {
        console.log('加载通知设置...');
        
        try {
            const savedSettings = localStorage.getItem('notification_settings');
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                
                // 更新开关状态 - 移除重要提醒开关
                Object.keys(settings).forEach(key => {
                    const switchElement = document.getElementById(`${key}Switch`);
                    if (switchElement) {
                        switchElement.checked = settings[key];
                    }
                });
            }
        } catch (error) {
            console.error('加载设置失败:', error);
        }
    }
    
    saveSettings() {
        console.log('保存通知设置...');
        
        // 移除重要提醒设置
        const settings = {
            taskNotifications: document.getElementById('taskNotificationsSwitch')?.checked || false,
            systemNotifications: document.getElementById('systemNotificationsSwitch')?.checked || false,
            successNotifications: document.getElementById('successNotificationsSwitch')?.checked || false
        };
        
        try {
            localStorage.setItem('notification_settings', JSON.stringify(settings));
            this.showToast('通知设置已保存', 'success');
        } catch (error) {
            console.error('保存设置失败:', error);
            this.showToast('保存设置失败', 'error');
        }
    }
    
    showToast(message, type) {
        if (window.notificationSystem) {
            window.notificationSystem.showToast(message, type);
        } else {
            // 简单提示
            alert(message);
        }
    }
    
    showError(message) {
        alert(message);
    }
}

// 全局函数
function addTestNotification() {
    if (!window.notificationSystem) {
        alert('通知系统未初始化');
        return;
    }
    
    const testMessages = [
        {
            title: '新任务分配通知',
            message: '您已被分配《数据结构》课程助教任务，请在6月15日前确认任务详情并开始工作。任务预计需要完成20小时的助教工作，包括批改作业、辅导学生和协助课堂管理。',
            type: 'task',
            details: {
                taskName: '《数据结构》课程助教',
                deadline: '2024-06-15',
                estimatedHours: 20,
                requirements: '批改作业、辅导学生、协助课堂管理'
            }
        },
        {
            title: '系统维护通知',
            message: '系统将于本周六凌晨2:00-4:00进行例行维护，届时系统将暂时无法访问。请提前安排好您的工作，以免影响任务进度。',
            type: 'system',
            details: {
                maintenanceTime: '2024-06-15 02:00-04:00',
                impact: '系统暂时无法访问',
                suggestion: '请提前安排好工作'
            }
        },
        {
            title: '任务完成确认通知',
            message: '您的论文评审辅助工作已完成，导师已确认您的工作成果。相关津贴将在3个工作日内发放至您的账户。',
            type: 'success',
            details: {
                taskName: '论文评审辅助工作',
                completionDate: '2024-06-05',
                stipendAmount: '¥800',
                paymentStatus: '待发放'
            }
        }
    ];
    
    const randomMessage = testMessages[Math.floor(Math.random() * testMessages.length)];
    const id = window.notificationSystem.addNotification(
        randomMessage.title,
        randomMessage.message,
        randomMessage.type,
        `notification-detail.html?id=${Date.now()}`
    );
    
    // 刷新通知中心
    if (window.notificationCenter) {
        window.notificationCenter.refreshNotifications();
    }
    
    console.log('添加测试通知成功，ID:', id);
}

function resetNotificationSettings() {
    if (confirm('确定要恢复默认通知设置吗？')) {
        const switches = document.querySelectorAll('.settings-grid input[type="checkbox"]');
        switches.forEach(switchInput => {
            switchInput.checked = true; // 默认全部开启
        });
        
        if (window.notificationCenter) {
            window.notificationCenter.saveSettings();
        } else {
            alert('设置已恢复为默认值');
        }
    }
}

function saveNotificationSettings() {
    if (window.notificationCenter) {
        window.notificationCenter.saveSettings();
    }
}

function logout() {
    if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('docim_user');
        window.location.href = 'index.html';
    }
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('通知中心页面加载完成');
    
    // 初始化通知中心
    window.notificationCenter = new NotificationCenter();
    
    // 初始化通知系统（如果尚未初始化）
    if (!window.notificationSystem) {
        window.notificationSystem = new NotificationSystem();
    }
});