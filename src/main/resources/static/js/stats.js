// js/stats.js - 统计分析JavaScript

class StatsManager {
    constructor() {
        this.currentPeriod = 'month';
        this.chartType = 'count';
        this.monthPeriod = '6months';
        this.rankType = 'tasks';
        this.init();
    }
    
    init() {
        console.log('统计分析页面初始化');
        
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
            this.loadStatsData();
            
            // 初始化图表
            this.initCharts();
            
            // 渲染表格数据
            this.renderTables();
            
            console.log('统计分析页面初始化完成');
            
        } catch (error) {
            console.error('统计分析页面初始化失败:', error);
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
            window.notificationSystem = new NotificationSystem();
        }
        
        // 更新通知计数
        this.updateNotificationCount();
    }
    
    bindEvents() {
        console.log('绑定统计分析事件...');
        
        // 时间周期选择器
        document.querySelectorAll('.period-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentPeriod = e.target.dataset.period;
                this.updateStats();
            });
        });
        
        // 图表类型切换
        document.querySelectorAll('.chart-btn[data-type]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const parent = e.target.closest('.chart-actions');
                if (parent) {
                    parent.querySelectorAll('.chart-btn').forEach(b => b.classList.remove('active'));
                }
                e.target.classList.add('active');
                this.chartType = e.target.dataset.type;
                this.updateTaskTrendChart();
            });
        });
        
        // 月度周期切换
        document.querySelectorAll('.chart-btn[data-period]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const parent = e.target.closest('.chart-actions');
                if (parent) {
                    parent.querySelectorAll('.chart-btn').forEach(b => b.classList.remove('active'));
                }
                e.target.classList.add('active');
                this.monthPeriod = e.target.dataset.period;
                this.updateMonthlyTaskChart();
            });
        });
        
        // 排名类型切换
        document.querySelectorAll('.chart-btn[data-rank]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const parent = e.target.closest('.chart-actions');
                if (parent) {
                    parent.querySelectorAll('.chart-btn').forEach(b => b.classList.remove('active'));
                }
                e.target.classList.add('active');
                this.rankType = e.target.dataset.rank;
                this.updateStudentRankChart();
            });
        });
    }
    
    loadStatsData() {
        console.log('加载统计数据...');
        
        // 模拟统计数据
        this.statsData = {
            // 任务类型分布数据
            taskTypes: [
                { type: '课程助教', count: 18, percentage: 40, totalStipend: '¥12,600', avgStipend: '¥700', avgDays: 5.2, completionRate: 94 },
                { type: '论文指导', count: 12, percentage: 26.7, totalStipend: '¥9,600', avgStipend: '¥800', avgDays: 8.5, completionRate: 91 },
                { type: '实验室管理', count: 8, percentage: 17.8, totalStipend: '¥6,400', avgStipend: '¥800', avgDays: 15.3, completionRate: 87 },
                { type: '行政协助', count: 5, percentage: 11.1, totalStipend: '¥3,000', avgStipend: '¥600', avgDays: 3.8, completionRate: 96 },
                { type: '科研协助', count: 2, percentage: 4.4, totalStipend: '¥800', avgStipend: '¥400', avgDays: 12.5, completionRate: 90 }
            ],
            
            // 任务趋势数据
            taskTrends: {
                months: ['9月', '10月', '11月', '12月', '1月', '2月'],
                counts: [6, 8, 9, 12, 7, 3],
                stipends: [4200, 5600, 6300, 8400, 4900, 2100]
            },
            
            // 学院分布数据
            departmentStats: [
                { department: '计算机学院', count: 15, percentage: 33.3 },
                { department: '电子信息学院', count: 10, percentage: 22.2 },
                { department: '自动化学院', count: 8, percentage: 17.8 },
                { department: '管理学院', count: 7, percentage: 15.6 },
                { department: '人工智能学院', count: 5, percentage: 11.1 }
            ],
            
            // 月度任务数据
            monthlyStats: {
                last6Months: {
                    months: ['9月', '10月', '11月', '12月', '1月', '2月'],
                    tasks: [6, 8, 9, 12, 7, 3],
                    completed: [5, 7, 8, 11, 6, 2],
                    stipends: [4200, 5600, 6300, 8400, 4900, 2100]
                },
                last12Months: {
                    months: ['去年3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月', '1月', '2月'],
                    tasks: [4, 5, 6, 7, 6, 5, 6, 8, 9, 12, 7, 3],
                    completed: [3, 4, 5, 6, 5, 4, 5, 7, 8, 11, 6, 2],
                    stipends: [2800, 3500, 4200, 4900, 4200, 3500, 4200, 5600, 6300, 8400, 4900, 2100]
                }
            },
            
            // 博士生排名数据
            studentRankings: {
                byTasks: [
                    { name: '张三博士', tasks: 8, stipend: '¥5,600', department: '计算机学院' },
                    { name: '李四博士', tasks: 6, stipend: '¥4,800', department: '电子信息学院' },
                    { name: '王五博士', tasks: 5, stipend: '¥3,500', department: '自动化学院' },
                    { name: '赵六博士', tasks: 4, stipend: '¥3,200', department: '管理学院' },
                    { name: '孙七博士', tasks: 3, stipend: '¥2,400', department: '计算机学院' }
                ],
                byStipend: [
                    { name: '李四博士', tasks: 6, stipend: '¥4,800', department: '电子信息学院' },
                    { name: '张三博士', tasks: 8, stipend: '¥5,600', department: '计算机学院' },
                    { name: '王五博士', tasks: 5, stipend: '¥3,500', department: '自动化学院' },
                    { name: '赵六博士', tasks: 4, stipend: '¥3,200', department: '管理学院' },
                    { name: '周八博士', tasks: 2, stipend: '¥1,600', department: '人工智能学院' }
                ]
            },
            
            // 博士生详细统计
            studentStats: [
                { name: '张三博士', department: '计算机学院', totalTasks: 8, completed: 6, inProgress: 2, totalStipend: '¥5,600', completionRate: 85, avgRating: 4.8 },
                { name: '李四博士', department: '电子信息学院', totalTasks: 12, completed: 11, inProgress: 1, totalStipend: '¥8,400', completionRate: 92, avgRating: 4.9 },
                { name: '王五博士', department: '自动化学院', totalTasks: 5, completed: 3, inProgress: 2, totalStipend: '¥3,500', completionRate: 75, avgRating: 4.5 },
                { name: '赵六博士', department: '管理学院', totalTasks: 7, completed: 6, inProgress: 1, totalStipend: '¥4,900', completionRate: 86, avgRating: 4.7 },
                { name: '孙七博士', department: '计算机学院', totalTasks: 4, completed: 3, inProgress: 1, totalStipend: '¥2,800', completionRate: 80, avgRating: 4.6 },
                { name: '周八博士', department: '人工智能学院', totalTasks: 2, completed: 2, inProgress: 0, totalStipend: '¥1,600', completionRate: 100, avgRating: 5.0 },
                { name: '吴九博士', department: '电子信息学院', totalTasks: 3, completed: 2, inProgress: 1, totalStipend: '¥2,100', completionRate: 67, avgRating: 4.4 },
                { name: '郑十博士', department: '自动化学院', totalTasks: 4, completed: 3, inProgress: 1, totalStipend: '¥2,800', completionRate: 75, avgRating: 4.5 }
            ]
        };
        
        this.updateStats();
    }
    
    updateStats() {
        console.log('更新统计数据，周期:', this.currentPeriod);
        
        // 根据当前周期更新数据
        let totalTasks = 45;
        let activeStudents = 12;
        let totalStipend = '¥32,400';
        let avgCompletionTime = 4.2;
        
        // 这里可以根据不同的时间周期计算不同的统计数据
        switch(this.currentPeriod) {
            case 'month':
                totalTasks = 45;
                activeStudents = 12;
                totalStipend = '¥32,400';
                avgCompletionTime = 4.2;
                break;
            case 'quarter':
                totalTasks = 135;
                activeStudents = 15;
                totalStipend = '¥97,200';
                avgCompletionTime = 4.5;
                break;
            case 'year':
                totalTasks = 540;
                activeStudents = 18;
                totalStipend = '¥388,800';
                avgCompletionTime = 4.8;
                break;
        }
        
        // 更新关键指标显示
        document.getElementById('totalTasks').textContent = totalTasks;
        document.getElementById('activeStudents').textContent = activeStudents;
        document.getElementById('totalStipend').textContent = totalStipend;
        document.getElementById('avgCompletionTime').textContent = avgCompletionTime + '天';
        
        // 更新图表数据
        this.updateCharts();
    }
    
    initCharts() {
        console.log('初始化图表...');
        
        // 初始化任务类型分布图（饼图）
        this.initTaskTypeChart();
        
        // 初始化任务趋势图（折线图）
        this.initTaskTrendChart();
        
        // 初始化学院分布图（柱状图）
        this.initDepartmentChart();
        
        // 初始化月度任务统计图（柱状图）
        this.initMonthlyTaskChart();
        
        // 初始化博士生排名图（柱状图）
        this.initStudentRankChart();
    }
    
    initTaskTypeChart() {
        const ctx = document.getElementById('taskTypeChart').getContext('2d');
        
        const data = {
            labels: this.statsData.taskTypes.map(item => item.type),
            datasets: [{
                data: this.statsData.taskTypes.map(item => item.count),
                backgroundColor: [
                    'rgba(52, 152, 219, 0.8)',
                    'rgba(155, 89, 182, 0.8)',
                    'rgba(46, 204, 113, 0.8)',
                    'rgba(241, 196, 15, 0.8)',
                    'rgba(231, 76, 60, 0.8)'
                ],
                borderColor: [
                    'rgb(52, 152, 219)',
                    'rgb(155, 89, 182)',
                    'rgb(46, 204, 113)',
                    'rgb(241, 196, 15)',
                    'rgb(231, 76, 60)'
                ],
                borderWidth: 1,
                hoverOffset: 15
            }]
        };
        
        const config = {
            type: 'pie',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed;
                                const percentage = Math.round((value / context.dataset.data.reduce((a, b) => a + b, 0)) * 100);
                                return `${label}: ${value} 个 (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        };
        
        this.taskTypeChart = new Chart(ctx, config);
        
        // 更新图例
        this.updateTaskTypeLegend();
    }
    
    updateTaskTypeLegend() {
        const legend = document.getElementById('taskTypeLegend');
        if (!legend) return;
        
        const colors = [
            'rgb(52, 152, 219)',
            'rgb(155, 89, 182)',
            'rgb(46, 204, 113)',
            'rgb(241, 196, 15)',
            'rgb(231, 76, 60)'
        ];
        
        legend.innerHTML = this.statsData.taskTypes.map((item, index) => `
            <div class="legend-item">
                <span class="legend-color" style="background-color: ${colors[index]}"></span>
                <span>${item.type}</span>
            </div>
        `).join('');
    }
    
    initTaskTrendChart() {
        const ctx = document.getElementById('taskTrendChart').getContext('2d');
        
        const data = {
            labels: this.statsData.taskTrends.months,
            datasets: [{
                label: '任务数',
                data: this.statsData.taskTrends.counts,
                borderColor: 'rgb(52, 152, 219)',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                tension: 0.3,
                fill: true
            }, {
                label: '津贴额',
                data: this.statsData.taskTrends.stipends.map(s => s / 100),
                borderColor: 'rgb(155, 89, 182)',
                backgroundColor: 'rgba(155, 89, 182, 0.1)',
                tension: 0.3,
                fill: true,
                hidden: true
            }]
        };
        
        const config = {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.datasetIndex === 0) {
                                    label += context.parsed.y + ' 个';
                                } else {
                                    label += '¥' + (context.parsed.y * 100).toLocaleString();
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value, index, values) {
                                if (this.chart.config.data.datasets[0].hidden) {
                                    return '¥' + (value * 100).toLocaleString();
                                } else {
                                    return value + ' 个';
                                }
                            }
                        }
                    }
                }
            }
        };
        
        this.taskTrendChart = new Chart(ctx, config);
    }
    
    updateTaskTrendChart() {
        if (!this.taskTrendChart) return;
        
        // 显示/隐藏数据集
        if (this.chartType === 'count') {
            this.taskTrendChart.data.datasets[0].hidden = false;
            this.taskTrendChart.data.datasets[1].hidden = true;
        } else {
            this.taskTrendChart.data.datasets[0].hidden = true;
            this.taskTrendChart.data.datasets[1].hidden = false;
        }
        
        // 更新Y轴标签
        this.taskTrendChart.options.scales.y.ticks.callback = function(value, index, values) {
            if (this.chart.config.data.datasets[0].hidden) {
                return '¥' + (value * 100).toLocaleString();
            } else {
                return value + ' 个';
            }
        };
        
        this.taskTrendChart.update();
    }
    
    initDepartmentChart() {
        const ctx = document.getElementById('departmentChart').getContext('2d');
        
        const data = {
            labels: this.statsData.departmentStats.map(item => item.department),
            datasets: [{
                label: '任务数量',
                data: this.statsData.departmentStats.map(item => item.count),
                backgroundColor: 'rgba(52, 152, 219, 0.8)',
                borderColor: 'rgb(52, 152, 219)',
                borderWidth: 1
            }]
        };
        
        const config = {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const count = context.parsed.y;
                                const percentage = Math.round((count / context.dataset.data.reduce((a, b) => a + b, 0)) * 100);
                                return `任务数: ${count} 个 (${percentage}%)`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value + ' 个';
                            }
                        }
                    }
                }
            }
        };
        
        this.departmentChart = new Chart(ctx, config);
    }
    
    initMonthlyTaskChart() {
        const ctx = document.getElementById('monthlyTaskChart').getContext('2d');
        
        const monthlyData = this.monthPeriod === '6months' 
            ? this.statsData.monthlyStats.last6Months
            : this.statsData.monthlyStats.last12Months;
        
        const data = {
            labels: monthlyData.months,
            datasets: [{
                label: '总任务数',
                data: monthlyData.tasks,
                backgroundColor: 'rgba(52, 152, 219, 0.8)',
                borderColor: 'rgb(52, 152, 219)',
                borderWidth: 1
            }, {
                label: '已完成',
                data: monthlyData.completed,
                backgroundColor: 'rgba(46, 204, 113, 0.8)',
                borderColor: 'rgb(46, 204, 113)',
                borderWidth: 1
            }]
        };
        
        const config = {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.parsed.y + ' 个';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value + ' 个';
                            }
                        }
                    }
                }
            }
        };
        
        this.monthlyTaskChart = new Chart(ctx, config);
    }
    
    updateMonthlyTaskChart() {
        if (!this.monthlyTaskChart) return;
        
        const monthlyData = this.monthPeriod === '6months' 
            ? this.statsData.monthlyStats.last6Months
            : this.statsData.monthlyStats.last12Months;
        
        this.monthlyTaskChart.data.labels = monthlyData.months;
        this.monthlyTaskChart.data.datasets[0].data = monthlyData.tasks;
        this.monthlyTaskChart.data.datasets[1].data = monthlyData.completed;
        
        this.monthlyTaskChart.update();
    }
    
    initStudentRankChart() {
        const ctx = document.getElementById('studentRankChart').getContext('2d');
        
        const rankingData = this.rankType === 'tasks' 
            ? this.statsData.studentRankings.byTasks
            : this.statsData.studentRankings.byStipend;
        
        const data = {
            labels: rankingData.map(item => item.name.split(' ')[0]),
            datasets: [{
                label: this.rankType === 'tasks' ? '任务数' : '津贴额',
                data: this.rankType === 'tasks' 
                    ? rankingData.map(item => item.tasks)
                    : rankingData.map(item => parseFloat(item.stipend.replace('¥', '').replace(',', '')) / 100),
                backgroundColor: 'rgba(155, 89, 182, 0.8)',
                borderColor: 'rgb(155, 89, 182)',
                borderWidth: 1
            }]
        };
        
        const config = {
            type: 'bar',
            data: data,
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                if (this.chart.config.data.datasets[0].label === '任务数') {
                                    return `任务数: ${context.parsed.x} 个`;
                                } else {
                                    return `津贴额: ¥${(context.parsed.x * 100).toLocaleString()}`;
                                }
                            },
                            afterLabel: function(context) {
                                const index = context.dataIndex;
                                const student = rankingData[index];
                                return `学院: ${student.department}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                if (this.chart.config.data.datasets[0].label === '任务数') {
                                    return value + ' 个';
                                } else {
                                    return '¥' + (value * 100).toLocaleString();
                                }
                            }
                        }
                    }
                }
            }
        };
        
        this.studentRankChart = new Chart(ctx, config);
    }
    
    updateStudentRankChart() {
        if (!this.studentRankChart) return;
        
        const rankingData = this.rankType === 'tasks' 
            ? this.statsData.studentRankings.byTasks
            : this.statsData.studentRankings.byStipend;
        
        this.studentRankChart.data.labels = rankingData.map(item => item.name.split(' ')[0]);
        
        if (this.rankType === 'tasks') {
            this.studentRankChart.data.datasets[0].label = '任务数';
            this.studentRankChart.data.datasets[0].data = rankingData.map(item => item.tasks);
        } else {
            this.studentRankChart.data.datasets[0].label = '津贴额';
            this.studentRankChart.data.datasets[0].data = rankingData.map(item => 
                parseFloat(item.stipend.replace('¥', '').replace(',', '')) / 100
            );
        }
        
        this.studentRankChart.options.scales.x.ticks.callback = function(value) {
            if (this.chart.config.data.datasets[0].label === '任务数') {
                return value + ' 个';
            } else {
                return '¥' + (value * 100).toLocaleString();
            }
        };
        
        this.studentRankChart.update();
    }
    
    updateCharts() {
        // 更新所有图表
        if (this.taskTypeChart) this.taskTypeChart.update();
        if (this.taskTrendChart) this.updateTaskTrendChart();
        if (this.departmentChart) this.departmentChart.update();
        if (this.monthlyTaskChart) this.updateMonthlyTaskChart();
        if (this.studentRankChart) this.updateStudentRankChart();
    }
    
    renderTables() {
        this.renderTaskTypeTable();
        this.renderStudentStatsTable();
    }
    
    renderTaskTypeTable() {
        const tbody = document.getElementById('taskTypeTable');
        if (!tbody) return;
        
        tbody.innerHTML = this.statsData.taskTypes.map(item => `
            <tr>
                <td class="number-cell">${item.type}</td>
                <td class="number-cell">${item.count}</td>
                <td class="number-cell">${item.percentage}%</td>
                <td class="number-cell">${item.totalStipend}</td>
                <td class="number-cell">${item.avgStipend}</td>
                <td class="number-cell">${item.avgDays}天</td>
                <td>
                    <span class="percentage-cell ${this.getCompletionRateClass(item.completionRate)}">
                        ${item.completionRate}%
                    </span>
                </td>
            </tr>
        `).join('');
    }
    
    renderStudentStatsTable() {
        const tbody = document.getElementById('studentStatsTable');
        if (!tbody) return;
        
        tbody.innerHTML = this.statsData.studentStats.map(student => `
            <tr>
                <td>${student.name}</td>
                <td>${student.department}</td>
                <td class="number-cell">${student.totalTasks}</td>
                <td class="number-cell">${student.completed}</td>
                <td class="number-cell">${student.inProgress}</td>
                <td class="number-cell">${student.totalStipend}</td>
                <td>
                    <span class="percentage-cell ${this.getCompletionRateClass(student.completionRate)}">
                        ${student.completionRate}%
                    </span>
                </td>
                <td class="number-cell">${student.avgRating.toFixed(1)}</td>
            </tr>
        `).join('');
    }
    
    getCompletionRateClass(rate) {
        if (rate >= 90) return 'percentage-high';
        if (rate >= 70) return 'percentage-medium';
        return 'percentage-low';
    }
    
    updateUI() {
        this.updateNotificationCount();
    }
    
    updateNotificationCount() {
        if (window.notificationSystem) {
            const unreadCount = window.notificationSystem.notifications.filter(n => !n.read).length;
            document.getElementById('notificationCount').textContent = unreadCount;
            document.getElementById('sidebarNotificationCount').textContent = unreadCount;
        }
    }
    
    // 公共方法供全局调用
    changePeriod(period) {
        this.currentPeriod = period;
        this.updateStats();
    }
    
    changeChartType(type) {
        this.chartType = type;
        this.updateTaskTrendChart();
    }
    
    changeMonthPeriod(period) {
        this.monthPeriod = period;
        this.updateMonthlyTaskChart();
    }
    
    changeRankType(type) {
        this.rankType = type;
        this.updateStudentRankChart();
    }
    
    refreshStats() {
        this.showToast('统计数据已刷新', 'success');
        this.loadStatsData();
    }
    
    exportReport() {
        this.showToast('报表导出功能开发中...', 'info');
    }
    
    exportTaskTypeData() {
        this.showToast('任务类型数据导出成功', 'success');
    }
    
    exportStudentData() {
        this.showToast('博士生统计数据导出成功', 'success');
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

// 全局函数供HTML调用
function changePeriod(period) {
    if (window.statsManager) {
        window.statsManager.changePeriod(period);
    }
}

function changeChartType(type) {
    if (window.statsManager) {
        window.statsManager.changeChartType(type);
    }
}

function changeMonthPeriod(period) {
    if (window.statsManager) {
        window.statsManager.changeMonthPeriod(period);
    }
}

function changeRankType(type) {
    if (window.statsManager) {
        window.statsManager.changeRankType(type);
    }
}

function refreshStats() {
    if (window.statsManager) {
        window.statsManager.refreshStats();
    }
}

function exportReport() {
    if (window.statsManager) {
        window.statsManager.exportReport();
    }
}

function exportTaskTypeData() {
    if (window.statsManager) {
        window.statsManager.exportTaskTypeData();
    }
}

function exportStudentData() {
    if (window.statsManager) {
        window.statsManager.exportStudentData();
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
    console.log('统计分析页面加载完成');
    
    // 初始化统计分析管理器
    window.statsManager = new StatsManager();
    
    // 初始化通知系统（如果尚未初始化）
    if (!window.notificationSystem) {
        window.notificationSystem = new NotificationSystem();
    }
});