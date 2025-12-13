// 仪表盘专用功能
class Dashboard {
    constructor() {
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.loadData();
        this.startAutoRefresh();
    }
    
    bindEvents() {
        // 任务卡片悬停效果
        document.querySelectorAll('.task-card').forEach(card => {
            card.addEventListener('mouseenter', this.onTaskCardHover);
            card.addEventListener('mouseleave', this.onTaskCardLeave);
        });
        
        // 进度条动画
        this.animateProgressBars();
        
        // 统计数据更新按钮
        const refreshBtn = document.querySelector('.refresh-stats');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshStats());
        }
    }
    
    onTaskCardHover(e) {
        const card = e.currentTarget;
        card.style.transform = 'translateY(-8px)';
        card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
    }
    
    onTaskCardLeave(e) {
        const card = e.currentTarget;
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    }
    
    animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-fill');
        progressBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0';
            setTimeout(() => {
                bar.style.width = width;
            }, 300);
        });
    }
    
    loadData() {
        // 模拟加载数据
        this.simulateLoading();
    }
    
    simulateLoading() {
        const loadingElements = document.querySelectorAll('.stat-value, .stat-desc');
        loadingElements.forEach(el => {
            const originalText = el.textContent;
            el.textContent = '加载中...';
            setTimeout(() => {
                el.textContent = originalText;
            }, 500);
        });
    }
    
    refreshStats() {
        // 模拟刷新动画
        const stats = document.querySelectorAll('.stat-card');
        stats.forEach((card, index) => {
            card.style.opacity = '0.5';
            setTimeout(() => {
                card.style.opacity = '1';
                card.classList.add('pulse');
                setTimeout(() => card.classList.remove('pulse'), 1000);
            }, index * 100);
        });
        
        // 在实际应用中，这里会调用API更新数据
        console.log('Refreshing dashboard stats...');
    }
    
    startAutoRefresh() {
        // 每5分钟自动刷新一次
        setInterval(() => {
            this.refreshStats();
        }, 5 * 60 * 1000);
    }
}

// 初始化仪表盘
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
});