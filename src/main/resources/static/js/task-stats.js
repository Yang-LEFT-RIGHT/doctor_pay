// js/task-stats.js - 任务统计页面交互
document.addEventListener('DOMContentLoaded', function() {
    console.log('任务统计页面加载完成');
    
    // 初始化页面
    initPage();
    
    // 初始化图表
    initCharts();
    
    // 绑定事件
    bindEvents();
    
    // 更新通知计数
    updateNotificationCount();
});

function updateNotificationCount() {
    if (window.notificationSystem) {
        const unreadCount = window.notificationSystem.notifications.filter(n => !n.read).length;
        document.getElementById('notificationCount').textContent = unreadCount;
        document.getElementById('sidebarNotificationCount').textContent = unreadCount;
    }
}

function initPage() {
    // 从URL获取任务ID
    const urlParams = new URLSearchParams(window.location.search);
    const taskId = urlParams.get('id');
    
    if (taskId) {
        loadTaskStats(taskId);
    } else {
        showToast('任务ID不存在', 'error');
        setTimeout(() => {
            window.location.href = 'task-list-admin.html';
        }, 1500);
    }
}

function loadTaskStats(taskId) {
    console.log('加载任务统计:', taskId);
    
    // 显示加载状态
    showLoadingState();
    
    // 模拟API调用获取统计数据
    setTimeout(() => {
        // 模拟统计数据的加载
        console.log('统计数据已加载');
        
        // 更新进度圆环
        updateProgressCircles();
        
        // 隐藏加载状态
        hideLoadingState();
        
    }, 1000);
}

function initCharts() {
    // 这里可以初始化真实的图表库，如Chart.js、ECharts等
    // 目前使用模拟图表
    console.log('初始化图表');
    
    // 为每个进度圆环设置CSS变量
    document.querySelectorAll('.progress-circle').forEach(circle => {
        const percentage = circle.getAttribute('data-percentage') || '0';
        circle.style.setProperty('--percentage', percentage + '%');
    });
}

function updateProgressCircles() {
    // 更新进度圆环动画
    document.querySelectorAll('.progress-circle').forEach(circle => {
        const percentage = circle.getAttribute('data-percentage');
        circle.style.animation = `progress-animation 1s ease-out`;
    });
}

function bindEvents() {
    // 时间周期选择
    document.getElementById('periodSelect').addEventListener('change', function() {
        loadStatsForPeriod(this.value);
    });
    
    // 表格视图切换
    const toggleBtn = document.querySelector('[onclick="toggleHoursTable()"]');
    toggleBtn.addEventListener('click', toggleHoursTable);
    
    // 重新计算津贴按钮
    const recalcBtn = document.querySelector('[onclick="recalculateStipend()"]');
    recalcBtn.addEventListener('click', recalculateStipend);
    
    // 导出格式选择
    document.querySelectorAll('input[name="exportFormat"]').forEach(radio => {
        radio.addEventListener('change', updateExportFormat);
    });
}

function changePeriod() {
    const period = document.getElementById('periodSelect').value;
    showToast(`切换至${getPeriodName(period)}数据`, 'info');
    
    // 这里应该重新加载对应时间段的统计数据
    loadStatsForPeriod(period);
}

function getPeriodName(period) {
    const periodNames = {
        'custom': '自定义',
        '7days': '最近7天',
        '30days': '最近30天',
        'all': '全部'
    };
    return periodNames[period] || period;
}

function loadStatsForPeriod(period) {
    console.log('加载时间段数据:', period);
    
    // 模拟加载数据
    setTimeout(() => {
        // 更新关键指标
        updateKeyMetricsForPeriod(period);
        
        // 更新图表
        updateChartsForPeriod(period);
        
        showToast(`${getPeriodName(period)}数据已更新`, 'success');
    }, 800);
}

function updateKeyMetricsForPeriod(period) {
    // 根据时间段更新指标数据
    const metrics = document.querySelectorAll('.metric-value');
    
    // 模拟不同时间段的数据变化
    metrics.forEach((metric, index) => {
        const originalText = metric.textContent;
        let newValue;
        
        switch(period) {
            case '7days':
                newValue = Math.floor(parseFloat(originalText.replace(/[^\d.]/g, '')) * 0.3);
                break;
            case '30days':
                newValue = Math.floor(parseFloat(originalText.replace(/[^\d.]/g, '')) * 1.0);
                break;
            case 'all':
                newValue = Math.floor(parseFloat(originalText.replace(/[^\d.]/g, '')) * 2.5);
                break;
            default:
                newValue = originalText;
        }
        
        if (!isNaN(newValue)) {
            if (originalText.includes('%')) {
                metric.textContent = `${newValue}%`;
            } else if (originalText.includes('¥')) {
                metric.textContent = `¥${newValue.toLocaleString()}`;
            } else {
                metric.textContent = newValue.toLocaleString();
            }
        }
    });
}

function updateChartsForPeriod(period) {
    console.log('更新图表数据:', period);
    
    // 这里可以更新真实图表的数据
    // 目前只是视觉反馈
    const chartBars = document.querySelectorAll('.chart-bar');
    
    chartBars.forEach(bar => {
        const randomHeight = Math.floor(Math.random() * 60) + 20;
        bar.style.height = `${randomHeight}%`;
        
        // 更新工具提示
        const weekLabel = bar.querySelector('.bar-label').textContent;
        bar.title = `${weekLabel}: ${randomHeight}小时`;
    });
}

function toggleHoursTable() {
    const table = document.querySelector('.hours-detail-table');
    const btn = document.querySelector('[onclick="toggleHoursTable()"]');
    
    if (table.classList.contains('collapsed')) {
        table.classList.remove('collapsed');
        btn.innerHTML = '<i class="fas fa-list"></i> 切换视图';
        showToast('已切换到详细视图', 'info');
    } else {
        table.classList.add('collapsed');
        btn.innerHTML = '<i class="fas fa-table"></i> 切换视图';
        showToast('已切换到摘要视图', 'info');
    }
}

function recalculateStipend() {
    showToast('重新计算津贴中...', 'info');
    
    // 显示加载状态
    const btn = document.querySelector('[onclick="recalculateStipend()"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 计算中';
    btn.disabled = true;
    
    // 模拟重新计算
    setTimeout(() => {
        // 更新计算结果
        const confirmedHours = Math.floor(Math.random() * 10) + 12;
        const pendingHours = Math.floor(Math.random() * 5) + 1;
        const totalHours = confirmedHours + pendingHours;
        const stipendRate = 40;
        
        // 更新UI
        document.querySelectorAll('.calculation-value')[1].textContent = `${confirmedHours}小时`;
        document.querySelectorAll('.calculation-value')[2].textContent = `${pendingHours}小时`;
        document.querySelectorAll('.calculation-value')[3].textContent = `¥${(confirmedHours * stipendRate).toLocaleString()}`;
        document.querySelectorAll('.calculation-value')[4].textContent = `¥${(pendingHours * stipendRate).toLocaleString()}`;
        
        // 更新人员明细
        updateBreakdownDetails(confirmedHours, pendingHours);
        
        // 恢复按钮状态
        btn.innerHTML = originalText;
        btn.disabled = false;
        
        showToast('津贴重新计算完成', 'success');
    }, 1500);
}

function updateBreakdownDetails(confirmedHours, pendingHours) {
    const breakdownItems = document.querySelectorAll('.breakdown-item');
    
    // 更新第一个博士生（已确认）
    const confirmedStipend = Math.floor(confirmedHours / 2) * 40;
    const confirmedDetails = breakdownItems[0].querySelector('.stipend-details');
    confirmedDetails.innerHTML = `
        <span>${Math.floor(confirmedHours / 2)}小时 × 40元 = ¥${confirmedStipend.toLocaleString()}</span>
        <span class="status-badge status-paid">已发放</span>
    `;
    
    // 更新第二个博士生（待确认）
    const pendingStipend = Math.floor(pendingHours / 2) * 40;
    const pendingDetails = breakdownItems[1].querySelector('.stipend-details');
    pendingDetails.innerHTML = `
        <span>${Math.floor(pendingHours / 2)}小时 × 40元 = ¥${pendingStipend.toLocaleString()}</span>
        <span class="status-badge status-pending">待确认</span>
    `;
}

function exportReport() {
    const format = document.querySelector('input[name="exportFormat"]:checked').value;
    generateExport(format);
}

function printReport() {
    showToast('准备打印报告...', 'info');
    
    // 添加打印样式
    const printStyle = document.createElement('style');
    printStyle.textContent = `
        @media print {
            .top-bar, .sidebar, .global-footer, .header-actions,
            .btn, .export-options, .section-header button {
                display: none !important;
            }
            
            .page-content {
                margin: 0;
                padding: 20px;
            }
            
            .content-area {
                width: 100%;
                padding: 0;
            }
            
            .key-metrics, .charts-grid, .detailed-data {
                page-break-inside: avoid;
            }
            
            body {
                background: white;
                color: black;
            }
            
            .task-name, .task-period {
                color: black;
                background: none;
                padding: 0;
            }
            
            .metric-card, .chart-container, .data-section {
                box-shadow: none;
                border: 1px solid #ddd;
            }
        }
    `;
    document.head.appendChild(printStyle);
    
    // 触发打印
    setTimeout(() => {
        window.print();
        
        // 移除打印样式
        printStyle.remove();
    }, 500);
}

function previewReport() {
    showToast('生成报告预览...', 'info');
    
    // 模拟预览生成
    setTimeout(() => {
        // 这里可以打开一个预览模态框
        // 目前简单提示
        const format = document.querySelector('input[name="exportFormat"]:checked').value;
        showToast(`${getFormatName(format)}报告预览已生成`, 'success');
    }, 1000);
}

function generateExport(format = null) {
    const selectedFormat = format || document.querySelector('input[name="exportFormat"]:checked').value;
    
    showToast(`生成${getFormatName(selectedFormat)}报告中...`, 'info');
    
    // 显示加载状态
    const btn = document.querySelector('[onclick="generateExport()"]') || 
                 document.querySelector('[onclick="exportReport()"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 生成中';
    btn.disabled = true;
    
    // 模拟生成过程
    setTimeout(() => {
        // 创建模拟文件
        let content, fileName, mimeType;
        
        switch(selectedFormat) {
            case 'excel':
                content = '模拟Excel文件内容\n任务统计报表\n...';
                fileName = '任务统计报表.xlsx';
                mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                break;
            case 'pdf':
                content = 'PDF报告内容\n任务统计摘要\n...';
                fileName = '任务统计报告.pdf';
                mimeType = 'application/pdf';
                break;
            case 'summary':
                content = '简报摘要\n关键指标: 80%完成度, 32小时工时\n...';
                fileName = '任务统计摘要.txt';
                mimeType = 'text/plain';
                break;
        }
        
        // 创建Blob和下载链接
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        // 恢复按钮状态
        btn.innerHTML = originalText;
        btn.disabled = false;
        
        showToast(`${fileName} 下载成功`, 'success');
        
    }, 2000);
}

function getFormatName(format) {
    const formatNames = {
        'excel': 'Excel',
        'pdf': 'PDF',
        'summary': '简报摘要'
    };
    return formatNames[format] || format;
}

function updateExportFormat() {
    const format = document.querySelector('input[name="exportFormat"]:checked').value;
    console.log('更新导出格式:', format);
}

function showLoadingState() {
    const container = document.querySelector('.content-area');
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'stats-loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="loading-content">
            <i class="fas fa-chart-line fa-spin"></i>
            <p>正在加载统计数据...</p>
        </div>
    `;
    container.appendChild(loadingOverlay);
}

function hideLoadingState() {
    const loadingOverlay = document.querySelector('.stats-loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.remove();
    }
}

function showToast(message, type) {
    if (window.notificationSystem) {
        window.notificationSystem.showToast(message, type);
    } else {
        alert(message);
    }
}

// 添加加载样式
const style = document.createElement('style');
style.textContent = `
    .stats-loading-overlay {
        position: fixed;
        top: 60px;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(255, 255, 255, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }
    
    .loading-content {
        text-align: center;
    }
    
    .loading-content i {
        font-size: 48px;
        color: var(--secondary-color);
        margin-bottom: 20px;
    }
    
    .loading-content p {
        color: var(--text-secondary);
        font-size: 18px;
        font-weight: 500;
    }
    
    .hours-detail-table.collapsed {
        max-height: 300px;
        overflow-y: auto;
    }
    
    .hours-detail-table.collapsed tbody tr:nth-child(n+5) {
        display: none;
    }
    
    @keyframes progress-animation {
        from {
            --percentage: 0%;
        }
        to {
            --percentage: attr(data-percentage);
        }
    }
`;
document.head.appendChild(style);

// 全局函数
function logout() {
    if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('docim_user');
        window.location.href = 'index.html';
    }
}