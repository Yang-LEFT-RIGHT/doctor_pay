// js/notification-detail.js - 修复版（移除内联样式，让CSS控制）
class NotificationDetail {
    constructor() {
        this.notificationId = null;
        this.notification = null;
        this.init();
    }
    
    init() {
        console.log('NotificationDetail 初始化开始');
        
        try {
            // 检查登录状态
            if (!this.checkAuth()) {
                return;
            }
            
            // 获取通知ID
            this.notificationId = this.getNotificationIdFromURL();
            if (!this.notificationId) {
                this.showError('未找到通知ID');
                window.location.href = 'notification-center.html';
                return;
            }
            
            // 绑定事件
            this.bindEvents();
            
            // 加载通知详情
            this.loadNotificationDetail();
            
            // 初始化通知系统
            this.initNotificationSystem();
            
            console.log('NotificationDetail 初始化完成');
            
        } catch (error) {
            console.error('NotificationDetail 初始化失败:', error);
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
            
            // 更新用户名显示
            const user = JSON.parse(userData);
            const usernameElement = document.getElementById('username');
            if (usernameElement) {
                usernameElement.textContent = user.name + (user.role === 'student' ? '博士' : '老师');
            }
            
            return true;
            
        } catch (error) {
            console.error('认证检查失败:', error);
            return false;
        }
    }
    
    getNotificationIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        
        // 如果是数字ID，转换为整数
        if (id && !isNaN(id)) {
            return parseInt(id);
        }
        
        return id;
    }
    
    initNotificationSystem() {
        // 确保通知系统已初始化
        if (!window.notificationSystem) {
            console.log('初始化通知系统...');
            window.notificationSystem = new NotificationSystem();
        } else {
            console.log('通知系统已存在，使用现有实例');
        }
    }
    
    bindEvents() {
        console.log('绑定通知详情事件...');
        
        // 标记为已读按钮
        const markAsReadBtn = document.getElementById('markAsReadBtn');
        if (markAsReadBtn) {
            markAsReadBtn.addEventListener('click', () => {
                this.markAsRead();
            });
        }
        
        // 删除通知按钮
        const deleteBtn = document.getElementById('deleteNotificationBtn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                this.deleteNotification();
            });
        }
        
        // 相关操作按钮
        const relatedActionBtn = document.getElementById('relatedActionBtn');
        if (relatedActionBtn) {
            relatedActionBtn.addEventListener('click', () => {
                this.performRelatedAction();
            });
        }
    }
    
    loadNotificationDetail() {
        console.log('加载通知详情，ID:', this.notificationId);
        
        if (!window.notificationSystem) {
            console.error('通知系统未初始化');
            return;
        }
        
        // 查找通知
        this.notification = window.notificationSystem.notifications.find(
            n => n.id == this.notificationId
        );
        
        if (!this.notification) {
            this.showError('未找到指定的通知');
            this.renderNotFound();
            return;
        }
        
        // 渲染通知详情
        this.renderNotificationDetail();
        
        // 加载相关通知
        this.loadRelatedNotifications();
        
        // 标记为已读（如果是未读状态）
        if (!this.notification.read && window.notificationSystem) {
            window.notificationSystem.markAsRead(this.notification.id);
        }
    }
    
    renderNotificationDetail() {
        if (!this.notification) return;
        
        // 更新通知类型徽章
        const typeBadge = document.getElementById('notificationTypeBadge');
        if (typeBadge) {
            typeBadge.className = `notification-type-badge ${this.notification.type}`;
            typeBadge.innerHTML = `
                <i class="${this.notification.icon}"></i>
                <span>${window.notificationSystem?.getTypeText(this.notification.type) || '通知'}</span>
            `;
        }
        
        // 更新状态徽章
        const statusElement = document.getElementById('notificationStatus');
        if (statusElement) {
            statusElement.innerHTML = `
                <span class="status-badge ${this.notification.read ? 'read' : 'unread'}">
                    ${this.notification.read ? '已读' : '未读'}
                </span>
            `;
        }
        
        // 更新标题
        const titleElement = document.getElementById('notificationTitle');
        if (titleElement) {
            titleElement.textContent = this.notification.title;
        }
        
        // 更新时间
        const timeElement = document.getElementById('notificationTime');
        if (timeElement) {
            timeElement.textContent = window.notificationSystem?.formatTime(this.notification.time) || this.notification.time;
        }
        
        // 更新ID
        const idElement = document.getElementById('notificationId');
        if (idElement) {
            idElement.textContent = `N${String(this.notification.id).slice(-4)}`;
        }
        
        // 更新消息内容
        const messageElement = document.getElementById('notificationMessage');
        if (messageElement) {
            messageElement.textContent = this.notification.message;
        }
        
        // 更新详情信息
        this.renderNotificationDetails();
        
        // 更新相关操作按钮
        this.updateActionButton();
    }
    
    renderNotificationDetails() {
        const detailsContainer = document.getElementById('notificationDetails');
        if (!detailsContainer) return;
        
        // 根据通知类型显示不同的详情信息
        let detailsHTML = '';
        
        switch (this.notification.type) {
            case 'task':
                detailsHTML = `
                    <div class="detail-section">
                        <h3>
                            <i class="fas fa-info-circle"></i>
                            任务信息
                        </h3>
                        <div class="detail-grid">
                            <div class="detail-item">
                                <div class="detail-label">
                                    <i class="far fa-calendar-alt"></i>
                                    截止日期
                                </div>
                                <div class="detail-value">2024-06-15</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">
                                    <i class="far fa-clock"></i>
                                    预计工时
                                </div>
                                <div class="detail-value">20 小时</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">
                                    <i class="fas fa-user-tie"></i>
                                    负责人
                                </div>
                                <div class="detail-value">张三</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h3>
                            <i class="fas fa-list-check"></i>
                            工作要求
                        </h3>
                        <div class="detail-item">
                            <div class="detail-value task-requirements">
                                <ul>
                                    <li>批改每周作业（约30份）</li>
                                    <li>组织每周一次答疑课</li>
                                    <li>协助课堂管理</li>
                                    <li>编写实验指导材料</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                `;
                break;
                
            case 'system':
                detailsHTML = `
                    <div class="detail-section">
                        <h3>
                            <i class="fas fa-cogs"></i>
                            维护信息
                        </h3>
                        <div class="detail-grid">
                            <div class="detail-item">
                                <div class="detail-label">
                                    <i class="far fa-calendar-alt"></i>
                                    维护时间
                                </div>
                                <div class="detail-value">2024-06-15 02:00-04:00</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">
                                    <i class="fas fa-clock"></i>
                                    预计时长
                                </div>
                                <div class="detail-value">2 小时</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">
                                    <i class="fas fa-exclamation-triangle"></i>
                                    影响范围
                                </div>
                                <div class="detail-value">全系统暂停服务</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">
                                    <i class="fas fa-info-circle"></i>
                                    维护类型
                                </div>
                                <div class="detail-value">例行维护</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h3>
                            <i class="fas fa-lightbulb"></i>
                            建议措施
                        </h3>
                        <div class="detail-item">
                            <div class="detail-value maintenance-suggestions">
                                <ul>
                                    <li>请在维护开始前保存好工作进度</li>
                                    <li>维护期间请勿尝试访问系统</li>
                                    <li>维护完成后如有问题请联系技术支持</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                `;
                break;
                
            case 'alert':
                detailsHTML = `
                    <div class="detail-section">
                        <h3>
                            <i class="fas fa-exclamation-triangle"></i>
                            提醒信息
                        </h3>
                        <div class="detail-grid">
                            <div class="detail-item">
                                <div class="detail-label">
                                    <i class="far fa-calendar-alt"></i>
                                    截止日期
                                </div>
                                <div class="detail-value">2024-06-10</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">
                                    <i class="fas fa-bell"></i>
                                    紧急程度
                                </div>
                                <div class="detail-value">高</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">
                                    <i class="fas fa-tasks"></i>
                                    任务状态
                                </div>
                                <div class="detail-value">待确认</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">
                                    <i class="fas fa-user-check"></i>
                                    确认状态
                                </div>
                                <div class="detail-value">未确认</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h3>
                            <i class="fas fa-hourglass-end"></i>
                            过期提醒
                        </h3>
                        <div class="detail-item">
                            <div class="detail-value expiration-warning">
                                <p>
                                    <i class="fas fa-exclamation-circle"></i>
                                    此任务即将过期，请及时处理以免影响津贴发放。
                                </p>
                            </div>
                        </div>
                    </div>
                `;
                break;
                
            case 'success':
                detailsHTML = `
                    <div class="detail-section">
                        <h3>
                            <i class="fas fa-check-circle"></i>
                            完成信息
                        </h3>
                        <div class="detail-grid">
                            <div class="detail-item">
                                <div class="detail-label">
                                    <i class="far fa-calendar-alt"></i>
                                    完成日期
                                </div>
                                <div class="detail-value">2024-06-05</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">
                                    <i class="fas fa-clock"></i>
                                    实际工时
                                </div>
                                <div class="detail-value">25 小时</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">
                                    <i class="fas fa-user-shield"></i>
                                    管理员确认
                                </div>
                                <div class="detail-value">是</div>
                            </div>
                        </div>
                    </div>
                `;
                break;
                
            default:
                detailsHTML = `
                    <div class="detail-section">
                        <h3>
                            <i class="fas fa-info-circle"></i>
                            通知信息
                        </h3>
                        <div class="detail-grid">
                            <div class="detail-item">
                                <div class="detail-label">
                                    <i class="fas fa-calendar-alt"></i>
                                    发送时间
                                </div>
                                <div class="detail-value">${this.notification.time}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">
                                    <i class="fas fa-bell"></i>
                                    通知类型
                                </div>
                                <div class="detail-value">${window.notificationSystem?.getTypeText(this.notification.type) || '系统通知'}</div>
                            </div>
                        </div>
                    </div>
                `;
        }
        
        detailsContainer.innerHTML = detailsHTML;
    }
    
    updateActionButton() {
        const actionBtn = document.getElementById('relatedActionBtn');
        if (!actionBtn) return;
        
        let buttonText = '查看详情';
        let buttonIcon = 'fas fa-external-link-alt';
        let onClick = () => this.goToRelatedPage();
        
        switch (this.notification.type) {
            case 'task':
                buttonText = '查看任务';
                buttonIcon = 'fas fa-tasks';
                break;
            case 'alert':
                buttonText = '立即处理';
                buttonIcon = 'fas fa-bolt';
                break;
            case 'success':
                buttonText = '查看任务记录';
                buttonIcon = 'fas fa-history';
                break;
        }
        
        actionBtn.innerHTML = `<i class="${buttonIcon}"></i> ${buttonText}`;
        actionBtn.onclick = onClick;
    }
    
    loadRelatedNotifications() {
        const relatedContainer = document.getElementById('relatedNotifications');
        if (!relatedContainer || !window.notificationSystem) return;
        
        // 查找相关通知（相同类型、最近的3条）
        const related = window.notificationSystem.notifications
            .filter(n => n.id !== this.notification.id && n.type === this.notification.type)
            .slice(0, 3)
            .sort((a, b) => new Date(b.time) - new Date(a.time));
        
        if (related.length === 0) {
            relatedContainer.innerHTML = `
                <div class="related-empty">
                    暂无相关通知
                </div>
            `;
            return;
        }
        
        relatedContainer.innerHTML = related.map(notification => `
            <div class="related-item">
                <div class="related-item-content">
                    <div class="related-item-icon ${notification.type}">
                        <i class="${notification.icon}"></i>
                    </div>
                    <div class="related-item-title">${notification.title}</div>
                    <div class="related-item-time">
                        ${window.notificationSystem.formatTime(notification.time)}
                    </div>
                </div>
                <a href="notification-detail.html?id=${notification.id}" class="related-item-action">
                    <i class="fas fa-eye"></i>
                    查看
                </a>
            </div>
        `).join('');
    }
    
    markAsRead() {
        if (!window.notificationSystem || !this.notification) return;
        
        window.notificationSystem.markAsRead(this.notification.id);
        
        // 更新状态显示
        const statusElement = document.getElementById('notificationStatus');
        if (statusElement) {
            statusElement.innerHTML = `
                <span class="status-badge read">
                    已读
                </span>
            `;
        }
        
        // 禁用按钮
        const markAsReadBtn = document.getElementById('markAsReadBtn');
        if (markAsReadBtn) {
            markAsReadBtn.disabled = true;
            markAsReadBtn.innerHTML = '<i class="fas fa-check"></i> 已标记为已读';
        }
        
        // 显示提示
        this.showToast('通知已标记为已读', 'success');
    }
    
    deleteNotification() {
        if (!window.notificationSystem || !this.notification) return;
        
        if (confirm('确定要删除这条通知吗？此操作不可撤销。')) {
            // 从数组中移除
            window.notificationSystem.notifications = window.notificationSystem.notifications.filter(
                n => n.id !== this.notification.id
            );
            
            // 保存到localStorage
            window.notificationSystem.saveNotifications();
            window.notificationSystem.updateNotificationCount();
            
            // 跳转回通知中心
            setTimeout(() => {
                window.location.href = 'notification-center.html';
            }, 500);
        }
    }
    
    performRelatedAction() {
        switch (this.notification.type) {
            case 'task':
                window.location.href = 'task-list.html';
                break;
            case 'success':
                window.location.href = 'statistics.html';
                break;
            default:
                // 默认跳转到通知中心
                window.location.href = 'notification-center.html';
        }
    }
    
    goToRelatedPage() {
        // 根据通知类型跳转到相应页面
        this.performRelatedAction();
    }
    
    renderNotFound() {
        const container = document.querySelector('.notification-detail');
        if (!container) return;
        
        container.innerHTML = `
            <div class="notification-not-found">
                <div class="not-found-icon">
                    <i class="far fa-bell-slash"></i>
                </div>
                <h2 class="not-found-title">通知未找到</h2>
                <p class="not-found-message">
                    您要查看的通知可能已被删除或不存在。
                </p>
                <a href="notification-center.html" class="btn-primary">
                    <i class="fas fa-arrow-left"></i>
                    返回通知中心
                </a>
            </div>
        `;
    }
    
    showToast(message, type) {
        if (window.notificationSystem) {
            window.notificationSystem.showToast(message, type);
        } else {
            alert(message);
        }
    }
    
    showError(message) {
        alert(message);
    }
}

// 全局函数
function logout() {
    if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('docim_user');
        window.location.href = 'index.html';
    }
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('通知详情页面加载完成');
    
    // 初始化通知详情
    window.notificationDetail = new NotificationDetail();
    
    // 初始化通知系统（如果尚未初始化）
    if (!window.notificationSystem) {
        window.notificationSystem = new NotificationSystem();
    }
});