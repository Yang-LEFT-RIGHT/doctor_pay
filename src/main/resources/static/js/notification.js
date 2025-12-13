// js/notification.js - 修复版，确保在所有页面都能工作
class NotificationSystem {
    constructor() {
        console.log('NotificationSystem 初始化开始');
        this.notifications = this.loadNotifications();
        this.init();
    }
    
    init() {
        console.log('通知系统初始化');
        this.bindEvents();
        this.renderNotifications();
        this.updateNotificationCount();
    }
    
    // 加载通知数据 - 修复版：确保正确处理空数组
    loadNotifications() {
        console.log('加载通知数据');
        const saved = localStorage.getItem('docim_notifications');
        
        // 如果本地存储中没有数据，使用默认数据
        if (!saved) {
            console.log('本地存储中没有通知数据，使用默认数据');
            const defaultData = this.getDefaultNotifications();
            localStorage.setItem('docim_notifications', JSON.stringify(defaultData));
            return defaultData;
        }
        
        try {
            const parsed = JSON.parse(saved);
            console.log('成功解析通知数据，数量:', parsed.length);
            
            // 如果是空数组，也使用默认数据
            if (Array.isArray(parsed) && parsed.length === 0) {
                console.log('通知数据为空数组，使用默认数据');
                const defaultData = this.getDefaultNotifications();
                localStorage.setItem('docim_notifications', JSON.stringify(defaultData));
                return defaultData;
            }
            
            return parsed;
        } catch (error) {
            console.error('解析通知数据失败:', error);
            const defaultData = this.getDefaultNotifications();
            localStorage.setItem('docim_notifications', JSON.stringify(defaultData));
            return defaultData;
        }
    }
    
    // 获取默认通知数据
    getDefaultNotifications() {
        const now = new Date();
        return [
            {
                id: Date.now() + 1,
                title: '新任务分配通知',
                message: '您已被分配《数据结构》课程助教任务，请在6月15日前确认',
                type: 'task',
                icon: 'fas fa-tasks',
                time: now.toISOString().replace('T', ' ').substring(0, 16),
                read: false,
                link: 'task-detail.html?id=1'
            },
            {
                id: Date.now() + 2,
                title: '任务即将过期提醒',
                message: '实验室设备维护任务确认即将过期，请及时处理',
                type: 'alert',
                icon: 'fas fa-exclamation-triangle',
                time: new Date(now.getTime() - 3600000).toISOString().replace('T', ' ').substring(0, 16),
                read: false,
                link: 'task-detail.html?id=2'
            },
            {
                id: Date.now() + 3,
                title: '系统更新通知',
                message: '奖学金管理系统已更新至v2.1.0，新增任务统计分析功能',
                type: 'system',
                icon: 'fas fa-cogs',
                time: new Date(now.getTime() - 7200000).toISOString().replace('T', ' ').substring(0, 16),
                read: false,
                link: 'guide.html'
            },
            {
                id: Date.now() + 4,
                title: '任务完成确认',
                message: '您的论文评审辅助任务已完成，请确认工作时长',
                type: 'success',
                icon: 'fas fa-check-circle',
                time: new Date(now.getTime() - 86400000).toISOString().replace('T', ' ').substring(0, 16),
                read: true,
                link: 'task-detail.html?id=4'
            },
            {
                id: Date.now() + 5,
                title: '学术会议提醒',
                message: '下周将举办国际学术会议，请确认您的参与时间',
                type: 'task',
                icon: 'fas fa-calendar-alt',
                time: new Date(now.getTime() - 172800000).toISOString().replace('T', ' ').substring(0, 16),
                read: true,
                link: 'task-detail.html?id=3'
            }
        ];
    }
    
    // 绑定事件 - 修复版：确保按钮能正确找到
    bindEvents() {
        console.log('绑定通知事件');
        
        // 延迟绑定，确保DOM完全加载
        setTimeout(() => {
            const notificationBtn = document.getElementById('notificationBtn');
            const notificationPanel = document.getElementById('notificationPanel');
            const notificationOverlay = document.getElementById('notificationOverlay');
            
            console.log('查找通知元素:');
            console.log('notificationBtn:', notificationBtn);
            console.log('notificationPanel:', notificationPanel);
            console.log('notificationOverlay:', notificationOverlay);
            
            if (notificationBtn) {
                console.log('找到通知按钮，绑定点击事件');
                notificationBtn.addEventListener('click', (e) => {
                    console.log('通知按钮被点击');
                    e.stopPropagation();
                    this.toggleNotificationPanel();
                });
            } else {
                console.error('未找到通知按钮元素 #notificationBtn');
                // 尝试重新查找
                const retryBtn = document.querySelector('.notification-btn');
                console.log('尝试通过类名查找通知按钮:', retryBtn);
                if (retryBtn) {
                    console.log('通过类名找到通知按钮，绑定事件');
                    retryBtn.id = 'notificationBtn'; // 添加ID以便后续使用
                    retryBtn.addEventListener('click', (e) => {
                        console.log('通知按钮被点击');
                        e.stopPropagation();
                        this.toggleNotificationPanel();
                    });
                }
            }
            
            if (notificationOverlay) {
                notificationOverlay.addEventListener('click', () => {
                    console.log('遮罩层被点击');
                    this.hideNotificationPanel();
                });
            }
            
            // 标记所有已读
            const markAllReadBtn = document.getElementById('markAllReadBtn');
            if (markAllReadBtn) {
                markAllReadBtn.addEventListener('click', () => {
                    console.log('标记所有已读');
                    this.markAllAsRead();
                });
            }
            
            // 清空所有通知
            const clearAllBtn = document.getElementById('clearAllBtn');
            if (clearAllBtn) {
                clearAllBtn.addEventListener('click', () => {
                    console.log('清空所有通知');
                    if (confirm('确定要清空所有通知吗？')) {
                        this.clearAllNotifications();
                    }
                });
            }
            
            // 点击页面其他地方关闭通知面板
            document.addEventListener('click', (e) => {
                const panel = document.getElementById('notificationPanel');
                const btn = document.getElementById('notificationBtn');
                
                if (!panel?.contains(e.target) && !btn?.contains(e.target)) {
                    this.hideNotificationPanel();
                }
            });
            
            // 阻止通知面板内的点击事件冒泡
            if (notificationPanel) {
                notificationPanel.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
            }
        }, 100); // 延迟100ms确保DOM完全加载
    }
    
    // 切换通知面板显示/隐藏
    toggleNotificationPanel() {
        console.log('切换通知面板');
        const notificationPanel = document.getElementById('notificationPanel');
        const notificationOverlay = document.getElementById('notificationOverlay');
        
        if (!notificationPanel || !notificationOverlay) {
            console.error('找不到通知面板或遮罩层元素');
            return;
        }
        
        if (notificationPanel.classList.contains('active')) {
            this.hideNotificationPanel();
        } else {
            this.showNotificationPanel();
        }
    }
    
    showNotificationPanel() {
        console.log('显示通知面板');
        const notificationPanel = document.getElementById('notificationPanel');
        const notificationOverlay = document.getElementById('notificationOverlay');
        
        if (notificationPanel && notificationOverlay) {
            notificationPanel.classList.add('active');
            notificationOverlay.classList.add('active');
        }
    }
    
    hideNotificationPanel() {
        console.log('隐藏通知面板');
        const notificationPanel = document.getElementById('notificationPanel');
        const notificationOverlay = document.getElementById('notificationOverlay');
        
        if (notificationPanel && notificationOverlay) {
            notificationPanel.classList.remove('active');
            notificationOverlay.classList.remove('active');
        }
    }
    
    // 渲染通知列表
    renderNotifications() {
        console.log('渲染通知列表');
        const notificationList = document.getElementById('notificationList');
        if (!notificationList) {
            console.error('找不到通知列表元素');
            return;
        }
        
        if (this.notifications.length === 0) {
            notificationList.innerHTML = `
                <div class="notification-empty">
                    <i class="far fa-bell-slash"></i>
                    <p>暂无通知</p>
                </div>
            `;
            return;
        }
        
        notificationList.innerHTML = this.notifications.map(notification => `
            <div class="notification-item ${notification.read ? 'read' : 'unread'}" 
                 data-id="${notification.id}" data-link="${notification.link || '#'}">
                <div class="notification-item-content">
                    <div class="notification-icon ${notification.type}">
                        <i class="${notification.icon}"></i>
                    </div>
                    <div class="notification-details">
                        <div class="notification-title">
                            <span>${notification.title}</span>
                            <span class="notification-time">${this.formatTime(notification.time)}</span>
                        </div>
                        <div class="notification-message">${notification.message}</div>
                        <div class="notification-meta">
                            <span class="notification-type ${notification.type}">
                                ${this.getTypeText(notification.type)}
                            </span>
                        </div>
                        ${!notification.read ? '<div class="notification-unread-dot"></div>' : ''}
                    </div>
                </div>
                ${notification.link ? `
                <div class="notification-actions-item">
                    <button class="notification-action-btn" onclick="event.stopPropagation(); notificationSystem.markAsRead(${notification.id})">
                        <i class="fas fa-check"></i> 标记已读
                    </button>
                    <button class="notification-action-btn primary" onclick="event.stopPropagation(); notificationSystem.openNotificationLink(${notification.id})">
                        <i class="fas fa-external-link-alt"></i> 查看详情
                    </button>
                </div>
                ` : ''}
            </div>
        `).join('');
        
        // 绑定通知项点击事件
        document.querySelectorAll('.notification-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.notification-action-btn')) {
                    const id = parseInt(item.getAttribute('data-id'));
                    const link = item.getAttribute('data-link');
                    this.openNotification(id, link);
                }
            });
        });
    }
    
    // 打开通知链接
    openNotification(id, link) {
        this.markAsRead(id);
        
        if (link && link !== '#') {
            this.hideNotificationPanel();
            setTimeout(() => {
                window.location.href = link;
            }, 300);
        }
    }
    
    openNotificationLink(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification && notification.link) {
            this.hideNotificationPanel();
            setTimeout(() => {
                window.location.href = notification.link;
            }, 300);
        }
    }
    
    // 标记为已读
    markAsRead(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification && !notification.read) {
            notification.read = true;
            this.saveNotifications();
            this.renderNotifications();
            this.updateNotificationCount();
        }
    }
    
    // 标记所有为已读
    markAllAsRead() {
        let changed = false;
        this.notifications.forEach(notification => {
            if (!notification.read) {
                notification.read = true;
                changed = true;
            }
        });
        
        if (changed) {
            this.saveNotifications();
            this.renderNotifications();
            this.updateNotificationCount();
        }
    }
    
    // 清空所有通知
    clearAllNotifications() {
        this.notifications = [];
        this.saveNotifications();
        this.renderNotifications();
        this.updateNotificationCount();
    }
    
    // 保存通知数据
    saveNotifications() {
        localStorage.setItem('docim_notifications', JSON.stringify(this.notifications));
    }
    
    // 更新通知计数
    updateNotificationCount() {
        const unreadCount = this.notifications.filter(n => !n.read).length;
        console.log('更新通知计数，未读数量:', unreadCount);
        
        // 更新右上角徽章
        const notificationCount = document.getElementById('notificationCount');
        if (notificationCount) {
            notificationCount.textContent = unreadCount;
            notificationCount.style.display = unreadCount > 0 ? 'flex' : 'none';
        } else {
            console.log('未找到通知计数元素 #notificationCount');
        }
        
        // 更新侧边栏徽章
        const sidebarBadge = document.getElementById('sidebarNotificationCount');
        if (sidebarBadge) {
            sidebarBadge.textContent = unreadCount;
            sidebarBadge.style.display = unreadCount > 0 ? 'flex' : 'none';
        }
    }
    
    // 添加新通知
    addNotification(title, message, type = 'system', link = null) {
        const newNotification = {
            id: Date.now(),
            title,
            message,
            type,
            icon: this.getIconByType(type),
            time: this.getCurrentTime(),
            read: false,
            link
        };
        
        this.notifications.unshift(newNotification);
        this.saveNotifications();
        this.renderNotifications();
        this.updateNotificationCount();
        
        // 显示提示
        this.showNotificationToast(title, message);
        
        return newNotification.id;
    }
    
    // 显示通知提示
    showNotificationToast(title, message) {
        const toast = document.createElement('div');
        toast.className = 'notification-toast';
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas fa-bell"></i>
            </div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        });
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.classList.remove('show');
                setTimeout(() => {
                    if (toast.parentNode) {
                        document.body.removeChild(toast);
                    }
                }, 300);
            }
        }, 5000);
        
        toast.addEventListener('click', (e) => {
            if (!e.target.closest('.toast-close')) {
                this.toggleNotificationPanel();
            }
        });
    }
    
    // 辅助方法
    formatTime(timeString) {
        const time = new Date(timeString);
        const now = new Date();
        const diffMs = now - time;
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffMins < 1) {
            return '刚刚';
        } else if (diffMins < 60) {
            return `${diffMins}分钟前`;
        } else if (diffHours < 24) {
            return `${diffHours}小时前`;
        } else if (diffDays < 7) {
            return `${diffDays}天前`;
        } else {
            return time.toLocaleDateString('zh-CN');
        }
    }
    
    getCurrentTime() {
        const now = new Date();
        return now.toISOString().replace('T', ' ').substring(0, 16);
    }
    
    getTypeText(type) {
        const typeMap = {
            'task': '任务通知',
            'system': '系统通知',
            'alert': '重要提醒',
            'success': '完成通知'
        };
        return typeMap[type] || '通知';
    }
    
    getIconByType(type) {
        const iconMap = {
            'task': 'fas fa-tasks',
            'system': 'fas fa-cogs',
            'alert': 'fas fa-exclamation-triangle',
            'success': 'fas fa-check-circle'
        };
        return iconMap[type] || 'fas fa-bell';
    }
    
    // 显示通用提示
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = 'notification-toast';
        toast.style.borderLeftColor = type === 'success' ? '#2ecc71' : 
                                     type === 'error' ? '#e74c3c' : 
                                     type === 'warning' ? '#f39c12' : '#3498db';
        
        toast.innerHTML = `
            <div class="toast-icon" style="color: ${type === 'success' ? '#2ecc71' : 
                                          type === 'error' ? '#e74c3c' : 
                                          type === 'warning' ? '#f39c12' : '#3498db'}">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 
                                 type === 'error' ? 'exclamation-circle' : 
                                 type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        });
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.classList.remove('show');
                setTimeout(() => {
                    if (toast.parentNode) {
                        document.body.removeChild(toast);
                    }
                }, 300);
            }
        }, 3000);
    }
}

// 初始化通知系统 - 修复版：确保全局可用
let notificationSystem;

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM加载完成，初始化通知系统');
    
    // 确保全局notificationSystem变量被正确设置
    try {
        notificationSystem = new NotificationSystem();
        window.notificationSystem = notificationSystem;
        console.log('通知系统初始化成功');
    } catch (error) {
        console.error('通知系统初始化失败:', error);
        console.error(error.stack);
    }
});