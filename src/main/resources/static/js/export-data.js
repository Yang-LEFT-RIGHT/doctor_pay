// js/export-data.js - 导出数据页面交互
document.addEventListener('DOMContentLoaded', function() {
    console.log('导出数据页面加载完成');
    
    // 初始化数据选择
    initDataSelection();
    
    // 初始化筛选条件
    initFilters();
    
    // 更新统计信息
    updateSummary();
    
    // 加载导出历史
    loadExportHistory();
    
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

function initDataSelection() {
    const dataTypeCards = document.querySelectorAll('.data-type-card');
    
    dataTypeCards.forEach(card => {
        card.addEventListener('click', function() {
            this.classList.toggle('selected');
            updateSummary();
        });
    });
}

function initFilters() {
    // 设置默认日期范围（最近30天）
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    document.getElementById('startDate').value = startDate.toISOString().split('T')[0];
    document.getElementById('endDate').value = endDate.toISOString().split('T')[0];
    
    // 监听筛选条件变化
    document.querySelectorAll('#startDate, #endDate, #departmentFilter, input[name="status"]').forEach(element => {
        element.addEventListener('change', updateSummary);
    });
}

function updateSummary() {
    const selectedTypes = document.querySelectorAll('.data-type-card.selected');
    const selectedCount = selectedTypes.length;
    
    // 更新已选类型数量
    document.getElementById('selectedTypes').textContent = `${selectedCount}种`;
    
    // 计算预计数据量
    let totalRecords = 0;
    selectedTypes.forEach(card => {
        const type = card.getAttribute('data-type');
        const countBadge = card.querySelector('.count-badge');
        const countText = countBadge.textContent;
        
        // 解析数量
        if (countText.includes('个任务')) {
            totalRecords += parseInt(countText) || 0;
        } else if (countText.includes('名博士生')) {
            totalRecords += parseInt(countText) || 0;
        } else if (countText.includes('条记录')) {
            totalRecords += parseInt(countText) || 0;
        }
    });
    
    // 应用筛选条件
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const department = document.getElementById('departmentFilter').value;
    const selectedStatus = Array.from(document.querySelectorAll('input[name="status"]:checked')).map(cb => cb.value);
    
    // 如果有筛选条件，调整预估数量
    if (department || startDate || endDate || selectedStatus.length < 3) {
        totalRecords = Math.floor(totalRecords * 0.7); // 简单估算
    }
    
    document.getElementById('estimatedCount').textContent = `${totalRecords}条记录`;
}

function startExport() {
    const selectedTypes = document.querySelectorAll('.data-type-card.selected');
    if (selectedTypes.length === 0) {
        showToast('请至少选择一种数据类型', 'error');
        return;
    }
    
    const format = document.querySelector('input[name="format"]:checked').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const department = document.getElementById('departmentFilter').value;
    
    // 显示加载状态
    const exportBtn = document.querySelector('.btn-primary');
    const originalText = exportBtn.innerHTML;
    exportBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 导出中...';
    exportBtn.disabled = true;
    
    // 模拟导出过程
    setTimeout(() => {
        console.log('导出设置:', {
            selectedTypes: Array.from(selectedTypes).map(card => card.getAttribute('data-type')),
            format,
            startDate,
            endDate,
            department
        });
        
        // 模拟文件下载
        simulateFileDownload(format);
        
        // 保存到导出历史
        addToExportHistory({
            date: new Date().toLocaleString(),
            types: Array.from(selectedTypes).map(card => card.querySelector('h4').textContent),
            format: format.toUpperCase(),
            recordCount: document.getElementById('estimatedCount').textContent
        });
        
        // 重置按钮
        exportBtn.innerHTML = originalText;
        exportBtn.disabled = false;
        
    }, 2000);
}

function simulateFileDownload(format) {
    // 创建模拟文件内容
    let content, fileName, mimeType;
    
    switch(format) {
        case 'excel':
            content = '模拟Excel文件内容';
            fileName = '任务数据导出.xlsx';
            mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            break;
        case 'csv':
            content = '任务ID,任务标题,状态,开始日期,结束日期\nTA001,课程助教,进行中,2024-01-01,2024-06-30\nTA002,实验室工作,已完成,2024-02-01,2024-05-31';
            fileName = '任务数据导出.csv';
            mimeType = 'text/csv';
            break;
        case 'pdf':
            content = 'PDF文件内容（模拟）';
            fileName = '任务数据导出.pdf';
            mimeType = 'application/pdf';
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
    
    showToast(`${fileName} 下载成功`, 'success');
}

function addToExportHistory(exportInfo) {
    // 从localStorage读取历史记录
    let history = JSON.parse(localStorage.getItem('exportHistory') || '[]');
    
    // 添加到历史记录
    history.unshift({
        id: Date.now(),
        ...exportInfo
    });
    
    // 只保留最近10条记录
    if (history.length > 10) {
        history = history.slice(0, 10);
    }
    
    // 保存回localStorage
    localStorage.setItem('exportHistory', JSON.stringify(history));
    
    // 更新显示
    loadExportHistory();
}

function loadExportHistory() {
    const historyList = document.querySelector('.history-list');
    let history = JSON.parse(localStorage.getItem('exportHistory') || '[]');
    
    if (history.length === 0) {
        historyList.innerHTML = '<div class="no-history">暂无导出记录</div>';
        return;
    }
    
    let html = '';
    history.forEach(item => {
        html += `
            <div class="history-item">
                <div class="history-header">
                    <span class="history-date">${item.date}</span>
                    <span class="history-format">${item.format}格式</span>
                </div>
                <div class="history-content">
                    <div class="history-types">${item.types.join(', ')}</div>
                    <div class="history-count">${item.recordCount}</div>
                </div>
                <div class="history-actions">
                    <button class="btn-link" onclick="reExport(${item.id})">重新导出</button>
                    <button class="btn-link text-danger" onclick="deleteHistory(${item.id})">删除</button>
                </div>
            </div>
        `;
    });
    
    historyList.innerHTML = html;
}

function reExport(historyId) {
    // 从历史记录重新导出
    const history = JSON.parse(localStorage.getItem('exportHistory') || '[]');
    const item = history.find(h => h.id === historyId);
    
    if (item) {
        showToast(`重新导出 ${item.types.join(', ')} 数据`, 'info');
        startExport();
    }
}

function deleteHistory(historyId) {
    if (confirm('确定要删除这条导出记录吗？')) {
        let history = JSON.parse(localStorage.getItem('exportHistory') || '[]');
        history = history.filter(h => h.id !== historyId);
        localStorage.setItem('exportHistory', JSON.stringify(history));
        loadExportHistory();
        showToast('记录已删除', 'success');
    }
}

function showToast(message, type) {
    if (window.notificationSystem) {
        window.notificationSystem.showToast(message, type);
    } else {
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