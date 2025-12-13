// 主JavaScript文件
class DashboardSystem {
    constructor() {
        this.init();
    }
    
    init() {
        this.checkLoginStatus();
        this.bindEvents();
        this.initComponents();
        this.showWelcomeMessage();
    }
    
    // 检查登录状态
    checkLoginStatus() {
        const savedUser = localStorage.getItem('docim_user') || localStorage.getItem('currentUser');
        
        if (!savedUser) {
            window.location.href = 'index.html';
            return false;
        }
        
        // 统一存储为 docim_user
        if (localStorage.getItem('currentUser') && !localStorage.getItem('docim_user')) {
            localStorage.setItem('docim_user', savedUser);
            localStorage.removeItem('currentUser');
        }
        
        return true;
    }
    
    // 绑定事件
    bindEvents() {
        // 通知按钮
        const notificationBtn = document.querySelector('.notification-btn');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', () => this.showNotifications());
        }
        
        // 表格行悬停效果
        this.initTableHover();
        
        // 卡片悬停效果
        this.initCardHover();
    }
    
    // 初始化组件
    initComponents() {
        this.updateNotificationCount();
        this.initCountdownTimer();
        this.initPendingTasks();
    }
    
    // 显示欢迎消息
    showWelcomeMessage() {
        const userData = this.getUserData();
        if (userData) {
            console.log(`欢迎回来，${userData.name}博士！`);
            // 可以添加一个toast通知
            this.showToast(`欢迎回来，${userData.name}博士！系统已就绪。`);
        }
    }
    
    // 获取用户数据
    getUserData() {
        try {
            const savedUser = localStorage.getItem('docim_user');
            return savedUser ? JSON.parse(savedUser) : {
                name: "张三",
                role: "博士生",
                id: "S2023001",
                email: "zhangsan@university.edu.cn"
            };
        } catch (e) {
            return null;
        }
    }
    
    // 更新通知计数
    updateNotificationCount(count = 3) {
        const badge = document.querySelector('.notification-badge');
        if (badge) {
            badge.textContent = count;
            if (count > 0) {
                badge.style.display = 'flex';
                badge.classList.add('pulse');
            } else {
                badge.style.display = 'none';
            }
        }
    }
    
    // 显示通知
    showNotifications() {
        const notifications = [
            {
                id: 1,
                title: '任务即将过期',
                message: '《数据结构》课程助教任务确认即将过期',
                time: '2小时前',
                type: 'warning'
            },
            {
                id: 2,
                title: '津贴发放提醒',
                message: '您有津贴待发放，请确认银行账户信息',
                time: '1天前',
                type: 'info'
            },
            {
                id: 3,
                title: '新任务分配',
                message: '您已被分配新的实验数据整理任务',
                time: '2天前',
                type: 'success'
            }
        ];
        
        // 创建通知面板
        const notificationPanel = document.createElement('div');
        notificationPanel.className = 'notification-panel';
        notificationPanel.innerHTML = `
            <div class="notification-header">
                <h3>通知中心</h3>
                <span class="notification-count">${notifications.length} 条通知</span>
                <button class="close-notifications">&times;</button>
            </div>
            <div class="notification-list">
                ${notifications.map(notif => `
                    <div class="notification-item ${notif.type}">
                        <div class="notification-icon">
                            <i class="fas fa-${notif.type === 'warning' ? 'exclamation-triangle' : 
                                               notif.type === 'info' ? 'info-circle' : 
                                               'check-circle'}"></i>
                        </div>
                        <div class="notification-content">
                            <h4>${notif.title}</h4>
                            <p>${notif.message}</p>
                            <span class="notification-time">${notif.time}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="notification-footer">
                <button class="btn-mark-read">标记所有为已读</button>
            </div>
        `;
        
        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .notification-panel {
                position: fixed;
                top: 80px;
                right: 30px;
                width: 380px;
                max-height: 500px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.15);
                z-index: 1001;
                overflow: hidden;
                animation: slideDown 0.3s ease;
            }
            
            .notification-header {
                padding: 20px;
                background: var(--primary-color);
                color: white;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .notification-header h3 {
                margin: 0;
                font-size: 18px;
            }
            
            .notification-count {
                background: rgba(255,255,255,0.2);
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
            }
            
            .close-notifications {
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.2s;
            }
            
            .close-notifications:hover {
                background: rgba(255,255,255,0.1);
            }
            
            .notification-list {
                max-height: 400px;
                overflow-y: auto;
            }
            
            .notification-item {
                padding: 16px 20px;
                border-bottom: 1px solid var(--border-light);
                display: flex;
                gap: 15px;
                transition: background 0.2s;
            }
            
            .notification-item:hover {
                background: var(--bg-tertiary);
            }
            
            .notification-item.warning .notification-icon {
                background: rgba(243, 156, 18, 0.1);
                color: var(--warning-color);
            }
            
            .notification-item.info .notification-icon {
                background: rgba(52, 152, 219, 0.1);
                color: var(--secondary-color);
            }
            
            .notification-item.success .notification-icon {
                background: rgba(46, 204, 113, 0.1);
                color: var(--success-color);
            }
            
            .notification-icon {
                width: 40px;
                height: 40px;
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                flex-shrink: 0;
            }
            
            .notification-content {
                flex: 1;
            }
            
            .notification-content h4 {
                margin: 0 0 5px 0;
                font-size: 15px;
                color: var(--text-primary);
            }
            
            .notification-content p {
                margin: 0 0 5px 0;
                font-size: 14px;
                color: var(--text-secondary);
                line-height: 1.4;
            }
            
            .notification-time {
                font-size: 12px;
                color: var(--text-light);
            }
            
            .notification-footer {
                padding: 15px 20px;
                text-align: center;
                border-top: 1px solid var(--border-light);
            }
            
            .btn-mark-read {
                background: var(--secondary-color);
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .btn-mark-read:hover {
                background: #2980b9;
                transform: translateY(-2px);
            }
            
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(notificationPanel);
        
        // 绑定事件
        notificationPanel.querySelector('.close-notifications').addEventListener('click', () => {
            notificationPanel.remove();
            style.remove();
        });
        
        notificationPanel.querySelector('.btn-mark-read').addEventListener('click', () => {
            this.updateNotificationCount(0);
            this.showToast('所有通知已标记为已读');
            notificationPanel.remove();
            style.remove();
        });
        
        // 点击外部关闭
        setTimeout(() => {
            const closeOnClickOutside = (e) => {
                if (!notificationPanel.contains(e.target) && 
                    !document.querySelector('.notification-btn').contains(e.target)) {
                    notificationPanel.remove();
                    style.remove();
                    document.removeEventListener('click', closeOnClickOutside);
                }
            };
            document.addEventListener('click', closeOnClickOutside);
        }, 100);
    }
    
    // 初始化倒计时
    initCountdownTimer() {
        const countdownElement = document.querySelector('.countdown');
        if (!countdownElement) return;
        
        const dueDate = new Date('2024-06-15');
        const now = new Date();
        const diffTime = dueDate - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays > 0) {
            countdownElement.innerHTML = `<i class="fas fa-clock"></i> 剩余${diffDays}天`;
        } else if (diffDays === 0) {
            countdownElement.innerHTML = `<i class="fas fa-clock"></i> 今天到期`;
            countdownElement.style.backgroundColor = 'var(--accent-color)';
        } else {
            countdownElement.innerHTML = `<i class="fas fa-clock"></i> 已过期`;
            countdownElement.style.backgroundColor = 'var(--accent-color)';
        }
    }
    
    // 初始化待处理任务
    initPendingTasks() {
        const pendingItems = document.querySelectorAll('.pending-item');
        pendingItems.forEach((item, index) => {
            // 添加延迟显示的动画
            item.style.animationDelay = `${index * 0.1}s`;
            item.classList.add('animate-in');
        });
    }
    
    // 初始化表格悬停效果
    initTableHover() {
        const tableRows = document.querySelectorAll('.task-table tbody tr');
        tableRows.forEach(row => {
            row.addEventListener('mouseenter', () => {
                row.style.transform = 'translateX(2px)';
            });
            row.addEventListener('mouseleave', () => {
                row.style.transform = 'translateX(0)';
            });
        });
    }
    
    // 初始化卡片悬停效果
    initCardHover() {
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px)';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(-5px)';
            });
        });
    }
    
    // 显示Toast消息
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 
                              type === 'warning' ? 'exclamation-triangle' : 
                              type === 'error' ? 'times-circle' : 
                              'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // 添加样式
        if (!document.querySelector('#toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
                .toast {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    background: white;
                    padding: 16px 24px;
                    border-radius: 8px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    z-index: 9999;
                    animation: slideInRight 0.3s ease, fadeOut 0.3s ease 4.7s forwards;
                    border-left: 4px solid var(--secondary-color);
                    max-width: 400px;
                }
                
                .toast.success {
                    border-left-color: var(--success-color);
                }
                
                .toast.warning {
                    border-left-color: var(--warning-color);
                }
                
                .toast.error {
                    border-left-color: var(--accent-color);
                }
                
                .toast i {
                    font-size: 20px;
                }
                
                .toast.success i {
                    color: var(--success-color);
                }
                
                .toast.warning i {
                    color: var(--warning-color);
                }
                
                .toast.error i {
                    color: var(--accent-color);
                }
                
                .toast.info i {
                    color: var(--secondary-color);
                }
                
                .toast span {
                    font-size: 15px;
                    color: var(--text-primary);
                }
                
                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                @keyframes fadeOut {
                    to {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(toast);
        
        // 5秒后自动移除
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 5000);
    }
    
    // 退出登录
    logout() {
        if (confirm('确定要退出登录吗？')) {
            localStorage.removeItem('docim_user');
            this.showToast('已成功退出登录', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    window.dashboard = new DashboardSystem();
});

// 全局退出函数（保持兼容性）
function logout() {
    if (window.dashboard) {
        window.dashboard.logout();
    } else {
        if (confirm('确定要退出登录吗？')) {
            localStorage.removeItem('docim_user');
            window.location.href = 'index.html';
        }
    }
}