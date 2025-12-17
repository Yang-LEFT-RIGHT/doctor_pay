// js/student-dashboard.js - 更新版（使用共享任务数据）
class StudentDashboard {
    constructor() {
        this.init();
    }
    
    init() {
        this.checkLoginStatus();
        this.bindEvents();
        this.initCountdownTimer();
        this.loadDashboardData();
    }
    
    checkLoginStatus() {
        const savedUser = localStorage.getItem('docim_user');
        if (!savedUser) {
            window.location.href = 'index.html';
            return false;
        }
        return true;
    }
    
    // 加载仪表板数据
    loadDashboardData() {
        if (!window.taskManager) {
            console.error('任务管理器未初始化');
            return;
        }
        
        // 更新统计数据
        this.updateStats();
        
        // 更新最近任务
        this.updateRecentTasks();
        
        // 更新待处理任务
        this.updatePendingTasks();
        
        // 更新已确认任务
        this.updateConfirmedTasks();
    }
    
    // 更新统计数据
    updateStats() {
        const stats = window.taskManager.getStats();
        
        // 更新待确认任务数
        document.querySelector('.stat-card:nth-child(1) .stat-value').textContent = stats.pendingCount;
        
        // 更新已确认任务数
        document.querySelector('.stat-card:nth-child(2) .stat-value').textContent = stats.confirmedCount;
        
        // 更新总工作时长
        document.querySelector('.stat-card:nth-child(3) .stat-value').textContent = stats.totalWorkHours + 'h';
        
        // 更新即将过期提示
        const expiringDesc = document.querySelector('.stat-card:nth-child(1) .stat-desc');
        if (stats.expiringSoonCount > 0) {
            expiringDesc.innerHTML = `<i class="fas fa-clock" style="color: #f39c12;"></i> 其中${stats.expiringSoonCount}个即将过期`;
        } else {
            expiringDesc.innerHTML = `<i class="fas fa-clock" style="color: #f39c12;"></i> 暂无即将过期任务`;
        }
    }
    
    // 更新最近任务表格
    updateRecentTasks() {
        const recentTasks = window.taskManager.getRecentTasks(4);
        const tableBody = document.querySelector('.task-table tbody');
        
        if (!tableBody || recentTasks.length === 0) return;
        
        tableBody.innerHTML = '';
        
        recentTasks.forEach(task => {
            const statusClass = task.status === 'pending' ? 'status-pending' : 
                              task.status === 'confirmed' ? 'status-confirmed' : 
                              task.status === 'rejected' ? 'status-rejected' : 'status-expired';
            
            const statusText = task.status === 'pending' ? '待确认' :
                              task.status === 'confirmed' ? '已确认' :
                              task.status === 'rejected' ? '已拒绝' : '已过期';
            
            const row = document.createElement('tr');
            row.className = 'task-row';
            row.setAttribute('data-task-id', task.id);
            
            row.innerHTML = `
                <td><span class="task-link">${task.title}</span></td>
                <td>${task.type}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>${task.deadline}</td>
                <td>${task.workload}</td>
            `;
            
            tableBody.appendChild(row);
        });
    }
    
    // 更新已确认任务列表
    updateConfirmedTasks() {
        const confirmedTasks = window.taskManager.getConfirmedTasks();
        const confirmedList = document.querySelector('.confirmed-list');
        
        if (!confirmedList) return;
        
        if (confirmedTasks.length === 0) {
            confirmedList.innerHTML = `
                <div class="empty-state" style="text-align: center; padding: 40px; color: #666;">
                    <i class="fas fa-tasks" style="font-size: 48px; color: #ddd; margin-bottom: 20px;"></i>
                    <h4 style="margin: 0 0 10px 0;">暂无已确认任务</h4>
                    <p style="margin: 0;">快去任务列表接受新任务吧</p>
                </div>
            `;
            return;
        }
        
        confirmedList.innerHTML = '';
        
        confirmedTasks.forEach(task => {
            const item = document.createElement('div');
            item.className = 'confirmed-item';
            item.setAttribute('data-task-id', task.id);
            
            item.innerHTML = `
                <div class="task-info">
                    <h4>${task.title}</h4>
                    <div class="task-meta">
                        <span><i class="far fa-calendar-alt"></i> 确认时间：${task.confirmedAt || '未记录'}</span>
                        <span><i class="fas fa-clock"></i> 工作时长：${task.workload}</span>
                        <span><i class="fas fa-calendar-check"></i> 状态：已完成</span>
                    </div>
                </div>
                <div class="task-action">
                    <button class="btn btn-view-detail">查看详情</button>
                </div>
            `;
            
            confirmedList.appendChild(item);
        });
    }
    
    bindEvents() {
        this.bindStatCardClicks();
        this.bindTaskClicks();
    }
    
    bindStatCardClicks() {
        const statCards = document.querySelectorAll('.stats-grid .stat-card[data-target]');
        statCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.stopPropagation();
                const target = card.getAttribute('data-target');
                if (target.endsWith('.html')) {
                    window.location.href = target;
                } else {
                    this.scrollToSection(target);
                }
            });
        });
    }
    
    bindTaskClicks() {
        // 表格行点击
        document.querySelectorAll('.task-row').forEach(row => {
            row.addEventListener('click', (e) => {
                e.stopPropagation();
                const taskId = row.getAttribute('data-task-id');
                window.location.href = `task-detail.html?id=${taskId}`;
            });
        });
        
        // 待处理任务点击
        document.addEventListener('click', (e) => {
            const pendingItem = e.target.closest('.pending-item');
            if (pendingItem) {
                e.stopPropagation();
                const taskId = pendingItem.getAttribute('data-task-id');
                window.location.href = `task-detail.html?id=${taskId}`;
            }
        });
        
        // 已确认任务点击
        document.addEventListener('click', (e) => {
            const confirmedItem = e.target.closest('.confirmed-item');
            if (confirmedItem) {
                e.stopPropagation();
                const taskId = confirmedItem.getAttribute('data-task-id');
                window.location.href = `task-detail.html?id=${taskId}`;
            }
        });
        
        // 查看详情按钮点击
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-view-detail');
            if (btn) {
                e.stopPropagation();
                const item = btn.closest('.pending-item, .confirmed-item');
                const taskId = item.getAttribute('data-task-id');
                window.location.href = `task-detail.html?id=${taskId}`;
            }
        });
    }
    
    scrollToSection(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            const topBarHeight = document.querySelector('.top-bar').offsetHeight;
            const offsetPosition = element.offsetTop - topBarHeight - 20;
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }
    
    initCountdownTimer() {
        // 这里可以添加倒计时逻辑
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    // 确保任务管理器已加载
    if (!window.taskManager) {
        console.warn('任务管理器未找到，将创建本地版本');
        window.taskManager = new TaskManager();
    }
    
    // 初始化仪表板
    new StudentDashboard();
    
    // 更新通知计数
    if (window.notificationSystem) {
        window.notificationSystem.updateNotificationCount();
    }
});