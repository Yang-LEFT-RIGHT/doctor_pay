// js/student-dashboard.js - 修复版（集成通知系统）
class StudentDashboard {
    constructor() {
        this.init();
    }
    
    init() {
        this.checkLoginStatus();
        this.bindEvents();
        this.initCountdownTimer();
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
        document.querySelectorAll('.pending-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const taskId = item.getAttribute('data-task-id');
                window.location.href = `task-detail.html?id=${taskId}`;
            });
        });
        
        // 已确认任务点击
        document.querySelectorAll('.confirmed-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const taskId = item.getAttribute('data-task-id');
                window.location.href = `task-detail.html?id=${taskId}`;
            });
        });
        
        // 按钮点击
        document.querySelectorAll('.btn-view-detail').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const item = btn.closest('.pending-item, .confirmed-item');
                const taskId = item.getAttribute('data-task-id');
                window.location.href = `task-detail.html?id=${taskId}`;
            });
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
        const countdownElement = document.querySelector('.countdown');
        if (!countdownElement) return;
        
        const dueDate = new Date('2024-06-15');
        const now = new Date();
        const diffDays = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
        
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
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    new StudentDashboard();
});

// 全局函数
function scrollToSection(sectionId) {
    const dashboard = new StudentDashboard();
    dashboard.scrollToSection(sectionId);
}

function logout() {
    if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('docim_user');
        window.location.href = 'index.html';
    }
}