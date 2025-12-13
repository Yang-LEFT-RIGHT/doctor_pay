// js/statistics.js - 修复版

class StatisticsManager {
    constructor() {
        this.charts = {
            trendChart: null,
            typeChart: null
        };
        this.currentPeriod = 'semester'; // 默认本学期
        this.semesterTarget = 400; // 本学期任务量目标：400小时
        this.init();
    }
    
    init() {
        console.log('StatisticsManager 开始初始化...');
        
        try {
            // 检查必要元素
            if (!this.checkRequiredElements()) {
                this.showError('页面元素加载失败，请刷新重试');
                return;
            }
            
            // 绑定事件
            this.bindEvents();
            
            // 更新用户名 - 先调用这个
            this.updateUserInfo();
            
            // 初始化图表
            this.initCharts();
            
            // 加载初始数据
            this.loadStatisticsData(this.currentPeriod);
            
            console.log('StatisticsManager 初始化完成');
            
        } catch (error) {
            console.error('StatisticsManager 初始化失败:', error);
            this.showError('页面初始化失败，请刷新重试');
        }
    }
    
    checkRequiredElements() {
        const required = [
            'taskTrendChart',
            'taskTypeChart',
            'task-details'
        ];
        
        for (const id of required) {
            if (!document.getElementById(id)) {
                console.error(`元素 #${id} 不存在`);
                return false;
            }
        }
        return true;
    }
    
    bindEvents() {
        console.log('绑定事件...');
        
        // 时间筛选按钮
        document.querySelectorAll('.time-tag').forEach(tag => {
            tag.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // 移除所有active类
                document.querySelectorAll('.time-tag').forEach(t => t.classList.remove('active'));
                
                // 添加active类到当前点击的标签
                tag.classList.add('active');
                
                // 获取周期并加载数据
                const period = tag.getAttribute('data-period');
                this.currentPeriod = period;
                this.loadStatisticsData(period);
            });
        });
        
        // 刷新按钮
        const refreshBtn = document.querySelector('.tool-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.refreshData();
            });
        }
    }
    
    updateUserInfo() {
        try {
            // 从localStorage获取用户信息
            const userData = localStorage.getItem('docim_user');
            const usernameElement = document.getElementById('username');
            
            if (!usernameElement) {
                console.warn('用户名元素未找到');
                return;
            }
            
            if (userData) {
                try {
                    const user = JSON.parse(userData);
                    let displayName = user.name || '用户';
                    
                    // 根据角色添加后缀
                    if (user.role === 'student' || user.role === '博士生') {
                        displayName += '博士';
                    } else if (user.role === 'teacher' || user.role === '老师') {
                        displayName += '老师';
                    } else {
                        // 如果没有明确的角色，默认为博士（因为这是博士生系统）
                        displayName += '博士';
                    }
                    
                    usernameElement.textContent = displayName;
                    console.log('用户名更新为:', displayName);
                    
                } catch (parseError) {
                    console.warn('解析用户数据失败，使用默认用户名:', parseError);
                    usernameElement.textContent = '张三博士';
                }
            } else {
                // 如果没有用户数据，使用默认
                console.warn('未找到用户数据，使用默认用户名');
                usernameElement.textContent = '张三博士';
            }
            
        } catch (error) {
            console.warn('更新用户信息失败:', error);
            // 确保无论如何都显示一个用户名
            const usernameElement = document.getElementById('username');
            if (usernameElement) {
                usernameElement.textContent = '张三博士';
            }
        }
    }
    
    initCharts() {
        console.log('初始化图表...');
        
        try {
            // 检查Chart.js是否加载
            if (typeof Chart === 'undefined') {
                throw new Error('Chart.js 未加载');
            }
            
            // 1. 任务量趋势图（按学期/学年）
            const trendCtx = document.getElementById('taskTrendChart').getContext('2d');
            this.charts.trendChart = new Chart(trendCtx, {
                type: 'line',
                data: {
                    labels: ['9月', '10月', '11月', '12月', '1月', '2月'],
                    datasets: [{
                        label: '任务量 (小时)',
                        data: [45, 68, 72, 85, 65, 50],
                        borderColor: '#3498db',
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.3,
                        pointBackgroundColor: '#3498db',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 6,
                        pointHoverRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: {
                        duration: 1000
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: '任务量趋势',
                            font: {
                                size: 16,
                                weight: '600'
                            },
                            color: '#2c3e50',
                            padding: {
                                bottom: 20
                            }
                        },
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `任务量: ${context.parsed.y} 小时`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)'
                            },
                            title: {
                                display: true,
                                text: '任务量 (小时)',
                                font: {
                                    size: 14,
                                    weight: '600'
                                }
                            },
                            ticks: {
                                callback: function(value) {
                                    return value + ' 小时';
                                }
                            }
                        },
                        x: {
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)'
                            },
                            title: {
                                display: true,
                                text: '月份',
                                font: {
                                    size: 14,
                                    weight: '600'
                                }
                            }
                        }
                    }
                }
            });

            // 2. 任务类型分布图
            const typeCtx = document.getElementById('taskTypeChart').getContext('2d');
            this.charts.typeChart = new Chart(typeCtx, {
                type: 'doughnut',
                data: {
                    labels: ['课程助教', '实验管理', '科研助理', '行政助理'],
                    datasets: [{
                        data: [45, 25, 20, 10],
                        backgroundColor: [
                            'rgba(52, 152, 219, 0.8)',
                            'rgba(46, 204, 113, 0.8)',
                            'rgba(155, 89, 182, 0.8)',
                            'rgba(243, 156, 18, 0.8)'
                        ],
                        borderColor: [
                            'rgba(52, 152, 219, 1)',
                            'rgba(46, 204, 113, 1)',
                            'rgba(155, 89, 182, 1)',
                            'rgba(243, 156, 18, 1)'
                        ],
                        borderWidth: 2,
                        hoverOffset: 10
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: '任务类型分布',
                            font: {
                                size: 16,
                                weight: '600'
                            },
                            color: '#2c3e50',
                            padding: {
                                bottom: 20
                            }
                        },
                        legend: {
                            position: 'right',
                            labels: {
                                padding: 20,
                                usePointStyle: true,
                                font: {
                                    size: 13
                                }
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const label = context.label || '';
                                    const value = context.parsed || 0;
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = Math.round((value / total) * 100);
                                    return `${label}: ${value} 小时 (${percentage}%)`;
                                }
                            }
                        }
                    },
                    cutout: '60%'
                }
            });
            
            console.log('图表初始化成功');
            
        } catch (error) {
            console.error('图表初始化错误:', error);
            this.showChartError();
        }
    }
    
    loadStatisticsData(period) {
        console.log(`加载数据，周期: ${period}`);
        
        // 显示加载状态
        this.showLoading();
        
        // 模拟异步加载
        setTimeout(() => {
            try {
                // 获取数据
                const data = this.getDataByPeriod(period);
                
                // 更新UI
                this.updateOverviewCards(data.overview);
                this.updateCharts(data.charts);
                this.updateDetailsTable(data.details);
                
                console.log(`数据加载完成，周期: ${period}`);
                
            } catch (error) {
                console.error('数据加载失败:', error);
                this.showDataError();
            }
        }, 300);
    }
    
    getDataByPeriod(period) {
        // 根据不同的统计周期返回数据
        const dataMap = {
            semester: {
                overview: {
                    currentTaskHours: "320 小时",
                    completedTasks: "12",
                    completionRate: "85%",
                    remainingTarget: "68 小时"
                },
                charts: {
                    trend: [45, 68, 72, 85, 65, 50],
                    trendLabels: ["9月", "10月", "11月", "12月", "1月", "2月"],
                    typeDistribution: [45, 25, 20, 10] // 课程助教, 实验管理, 科研助理, 行政助理
                },
                details: [
                    { date: "2024-02-15", taskName: "《数据结构》课程助教", taskType: "ta", hours: 8, status: "completed" },
                    { date: "2024-02-10", taskName: "实验室设备维护管理", taskType: "lab", hours: 6, status: "completed" },
                    { date: "2024-02-08", taskName: "学术会议组织协助", taskType: "admin", hours: 12, status: "completed" },
                    { date: "2024-02-05", taskName: "实验数据整理与分析", taskType: "research", hours: 10, status: "completed" },
                    { date: "2024-02-01", taskName: "论文评审辅助工作", taskType: "research", hours: 8, status: "completed" },
                    { date: "2024-01-28", taskName: "本科生课程辅导", taskType: "ta", hours: 6, status: "completed" }
                ]
            },
            year: {
                overview: {
                    currentTaskHours: "650 小时",
                    completedTasks: "24",
                    completionRate: "92%",
                    remainingTarget: "58 小时"
                },
                charts: {
                    trend: [120, 145, 165, 180, 160, 175, 155, 170, 185, 190, 200, 210],
                    trendLabels: ["3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月", "1月", "2月"],
                    typeDistribution: [40, 30, 20, 10]
                },
                details: [
                    { date: "2024-02-15", taskName: "《数据结构》课程助教", taskType: "ta", hours: 8, status: "completed" },
                    { date: "2024-01-20", taskName: "《机器学习》课程助教", taskType: "ta", hours: 12, status: "completed" },
                    { date: "2023-12-15", taskName: "学院网站内容维护", taskType: "admin", hours: 6, status: "completed" },
                    { date: "2023-11-10", taskName: "实验数据采集", taskType: "research", hours: 10, status: "completed" },
                    { date: "2023-10-05", taskName: "科研项目文档整理", taskType: "research", hours: 8, status: "completed" },
                    { date: "2023-09-20", taskName: "本科生毕业设计指导", taskType: "ta", hours: 15, status: "completed" }
                ]
            },
            all: {
                overview: {
                    currentTaskHours: "1,850 小时",
                    completedTasks: "68",
                    completionRate: "96%",
                    remainingTarget: "75 小时"
                },
                charts: {
                    trend: [180, 220, 240, 260, 280, 300, 320, 350],
                    trendLabels: ["2020学年", "2021学年", "2022学年", "2023学年", "2024上", "2024下", "2025上", "2025下"],
                    typeDistribution: [35, 30, 25, 10]
                },
                details: [
                    { date: "2024-02-15", taskName: "《数据结构》课程助教", taskType: "ta", hours: 8, status: "completed" },
                    { date: "2023-12-10", taskName: "国家级项目研究助理", taskType: "research", hours: 120, status: "completed" },
                    { date: "2023-06-20", taskName: "实验室暑期值班", taskType: "lab", hours: 80, status: "completed" },
                    { date: "2023-06-15", taskName: "《计算机视觉》课程助教", taskType: "ta", hours: 20, status: "completed" },
                    { date: "2022-05-10", taskName: "《算法分析》课程助教", taskType: "ta", hours: 96, status: "completed" },
                    { date: "2021-11-20", taskName: "实验设备采购协助", taskType: "admin", hours: 24, status: "completed" }
                ]
            }
        };
        
        return dataMap[period] || dataMap.semester;
    }
    
    updateOverviewCards(data) {
        // 更新概览卡片数据
        const elements = {
            'current-task-hours': data.currentTaskHours,
            'completed-tasks': data.completedTasks,
            'completion-rate': data.completionRate,
            'remaining-target': data.remainingTarget
        };
        
        for (const [id, value] of Object.entries(elements)) {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        }
        
        // 计算并显示目标进度条
        const currentHours = parseInt(data.currentTaskHours.replace(/[^0-9]/g, ''));
        const remainingHours = parseInt(data.remainingTarget.replace(/[^0-9]/g, ''));
        const totalHours = currentHours + remainingHours;
        const progressPercentage = Math.round((currentHours / totalHours) * 100);
        
        // 显示进度条（可选功能）
        this.showProgressBar(progressPercentage);
    }
    
    showProgressBar(percentage) {
        // 可以在目标卡片下方显示进度条
        const targetCard = document.querySelector('.stat-card.highlight');
        if (targetCard) {
            // 移除旧的进度条
            const oldProgress = targetCard.querySelector('.target-progress');
            if (oldProgress) oldProgress.remove();
            
            // 创建新的进度条
            const progressDiv = document.createElement('div');
            progressDiv.className = 'target-progress';
            progressDiv.innerHTML = `
                <div class="target-progress-bar" style="width: ${percentage}%"></div>
            `;
            
            // 插入到卡片内容之后
            const statDesc = targetCard.querySelector('.stat-desc');
            if (statDesc) {
                statDesc.after(progressDiv);
            }
        }
    }
    
    updateCharts(data) {
        if (this.charts.trendChart) {
            this.charts.trendChart.data.labels = data.trendLabels;
            this.charts.trendChart.data.datasets[0].data = data.trend;
            this.charts.trendChart.update();
        }
        
        if (this.charts.typeChart) {
            this.charts.typeChart.data.datasets[0].data = data.typeDistribution;
            this.charts.typeChart.update();
        }
    }
    
    updateDetailsTable(details) {
        const container = document.getElementById('task-details');
        if (!container) return;
        
        if (!details || details.length === 0) {
            container.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-state">
                        <div class="empty-state-icon">
                            <i class="fas fa-inbox"></i>
                        </div>
                        <h3>暂无数据</h3>
                        <p>当前周期内暂无任务记录</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        // 任务类型映射
        const typeMap = {
            'ta': { text: '课程助教', class: 'type-ta' },
            'lab': { text: '实验管理', class: 'type-lab' },
            'research': { text: '科研助理', class: 'type-research' },
            'admin': { text: '行政助理', class: 'type-admin' }
        };
        
        // 状态映射
        const statusMap = {
            'completed': { text: '已完成', class: 'status-completed' },
            'in-progress': { text: '进行中', class: 'status-in-progress' },
            'pending': { text: '待开始', class: 'status-pending' }
        };
        
        let html = '';
        details.forEach(item => {
            html += `
                <tr>
                    <td class="date-cell">${item.date}</td>
                    <td class="task-name">${item.taskName}</td>
                    <td>
                        <span class="type-tag ${typeMap[item.taskType].class}">
                            ${typeMap[item.taskType].text}
                        </span>
                    </td>
                    <td class="task-hours">${item.hours} 小时</td>
                    <td>
                        <span class="status-badge ${statusMap[item.status].class}">
                            ${statusMap[item.status].text}
                        </span>
                    </td>
                </tr>
            `;
        });
        
        container.innerHTML = html;
    }
    
    showLoading() {
        const container = document.getElementById('task-details');
        if (container) {
            container.innerHTML = `
                <tr>
                    <td colspan="5" class="loading">
                        <div class="loading-spinner"></div>
                        正在加载数据...
                    </td>
                </tr>
            `;
        }
    }
    
    showChartError() {
        const trendContainer = document.getElementById('taskTrendChart')?.parentElement;
        const typeContainer = document.getElementById('taskTypeChart')?.parentElement;
        
        const errorHTML = `
            <div class="error-state">
                <div class="error-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h3>图表加载失败</h3>
                <p>请刷新页面重试</p>
                <button onclick="location.reload()">刷新页面</button>
            </div>
        `;
        
        if (trendContainer) trendContainer.innerHTML = errorHTML;
        if (typeContainer) typeContainer.innerHTML = errorHTML;
    }
    
    showDataError() {
        const container = document.getElementById('task-details');
        if (container) {
            container.innerHTML = `
                <tr>
                    <td colspan="5" class="error-state">
                        <div class="error-icon">
                            <i class="fas fa-exclamation-circle"></i>
                        </div>
                        <h3>数据加载失败</h3>
                        <p>请稍后重试或联系管理员</p>
                        <button onclick="window.statisticsManager.refreshData()">
                            重试
                        </button>
                    </td>
                </tr>
            `;
        }
    }
    
    showError(message) {
        // 显示全局错误提示
        const toast = document.createElement('div');
        toast.className = 'error-toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #e74c3c;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 3000);
    }
    
    refreshData() {
        const activePeriod = document.querySelector('.time-tag.active')?.getAttribute('data-period') || 'semester';
        this.loadStatisticsData(activePeriod);
        
        // 显示刷新提示
        this.showToast('数据已刷新', 'success');
    }
    
    showToast(message, type) {
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background-color: ${type === 'success' ? '#2ecc71' : '#3498db'};
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        
        const icon = document.createElement('i');
        icon.className = type === 'success' ? 'fas fa-check-circle' : 'fas fa-info-circle';
        toast.appendChild(icon);
        toast.appendChild(document.createTextNode(message));
        
        document.body.appendChild(toast);
        
        // 3秒后移除
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                if (toast.parentNode) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('个人统计页面加载完成');
    
    try {
        // 检查用户登录状态
        const userData = localStorage.getItem('docim_user');
        if (!userData) {
            console.warn('用户未登录，跳转到登录页');
            window.location.href = 'index.html';
            return;
        }
        
        // 在初始化前确保用户名正确显示
        const usernameElement = document.getElementById('username');
        if (usernameElement && usernameElement.textContent === '张三老师') {
            usernameElement.textContent = '张三博士';
        }
        
        // 初始化统计管理器
        window.statisticsManager = new StatisticsManager();
        
    } catch (error) {
        console.error('页面初始化失败:', error);
        alert('页面加载失败，请刷新重试');
    }
});

// 全局函数
function refreshData() {
    if (window.statisticsManager) {
        window.statisticsManager.refreshData();
    }
}

function logout() {
    if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('docim_user');
        window.location.href = 'index.html';
    }
}

// 添加必要的动画样式
if (!document.querySelector('#toast-animations')) {
    const style = document.createElement('style');
    style.id = 'toast-animations';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes fadeOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}