// js/admin-dashboard.js - 管理员工作台JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('管理员工作台页面加载完成');
    
    // 初始化通知系统
    if (!window.notificationSystem) {
        window.notificationSystem = new NotificationSystem();
    }
    
    // 更新通知计数
    updateNotificationCount();
    
    // 更新用户名
    updateUsername();
    
    // 绑定事件
    bindEvents();
    
    // 加载统计数据
    loadStats();
});

function updateNotificationCount() {
    if (window.notificationSystem) {
        const unreadCount = window.notificationSystem.notifications.filter(n => !n.read).length;
        document.getElementById('unreadCount').textContent = unreadCount;
        document.getElementById('notificationCount').textContent = unreadCount;
        document.getElementById('sidebarNotificationCount').textContent = unreadCount;
    }
}

// function updateUsername() {
//     try {
//         const userData = localStorage.getItem('docim_user');
//         if (userData) {
//             const user = JSON.parse(userData);
//             const usernameElement = document.getElementById('username');
//             if (usernameElement) {
//                 // 修改这里：将"教授"改为"老师"
//                 usernameElement.textContent = user.name + (user.role === 'admin' ? '老师' : '博士');
//             }
//         }
//     } catch (error) {
//         console.error('更新用户名失败:', error);
//     }
// }

function bindEvents() {
    // 统计卡片点击事件
    document.querySelectorAll('.stat-card[data-target]').forEach(card => {
        card.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            if (target.startsWith('#')) {
                // 页面内跳转
                const element = document.querySelector(target);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                // 页面跳转
                window.location.href = target;
            }
        });
    });
    
    // 任务卡片点击事件
    document.querySelectorAll('.task-card').forEach(card => {
        card.addEventListener('click', function(e) {
            // 如果点击的不是按钮，则跳转到任务详情
            if (!e.target.closest('.task-actions') && !e.target.closest('button')) {
                const taskId = this.getAttribute('data-task-id');
                window.location.href = `task-detail-admin.html?id=${taskId}`;
            }
        });
    });
    
    // 待处理项目点击事件
    document.querySelectorAll('.pending-item, .stipend-item').forEach(item => {
        item.addEventListener('click', function(e) {
            if (!e.target.closest('.task-action') && !e.target.closest('button')) {
                const taskId = this.getAttribute('data-task-id');
                if (taskId) {
                    window.location.href = `task-detail-admin.html?id=${taskId}`;
                }
            }
        });
    });
    
    // 按钮事件
    document.querySelectorAll('.btn-view-detail').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const taskId = this.closest('.pending-item').getAttribute('data-task-id');
            window.location.href = `task-process.html?id=${taskId}`;
        });
    });
    
    // 任务操作按钮
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const taskId = this.closest('.task-card').getAttribute('data-task-id');
            editTask(taskId);
        });
    });
    
    document.querySelectorAll('.btn-view').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const taskId = this.closest('.task-card').getAttribute('data-task-id');
            viewTask(taskId);
        });
    });
    
    document.querySelectorAll('.btn-stats').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const taskId = this.closest('.task-card').getAttribute('data-task-id');
            viewTaskStats(taskId);
        });
    });
}

function loadStats() {
    // 这里可以添加从API获取统计数据的逻辑
    console.log('加载管理员统计信息');
    
    // 示例数据
    const stats = {
        pendingTasks: 7,
        confirmedTasks: 18,
        totalStipend: '¥32,400',
        paidStipend: '¥24,800',
        totalStudents: 15,
        activeStudents: 12,
        pendingStipend: '¥2,000'
    };
    
    // 更新UI
    setTimeout(() => {
        // 这里可以添加实际的数据更新逻辑
        console.log('统计数据已加载', stats);
    }, 1000);
}

function editTask(taskId) {
    console.log('编辑任务:', taskId);
    window.location.href = `task-edit.html?id=${taskId}`;
}

function viewTask(taskId) {
    console.log('查看任务详情:', taskId);
    window.location.href = `task-detail-admin.html?id=${taskId}`;
}

function viewTaskStats(taskId) {
    console.log('查看任务统计:', taskId);
    window.location.href = `task-stats.html?id=${taskId}`;
}

function logout() {
    if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('docim_user');
        window.location.href = 'index.html';
    }
}

// 全局函数
function refreshDashboard() {
    console.log('刷新工作台数据');
    loadStats();
    
    // 显示刷新提示
    if (window.notificationSystem) {
        window.notificationSystem.showToast('工作台数据已刷新', 'success');
    }
}