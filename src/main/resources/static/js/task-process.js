// js/task-process.js - 处理任务申请页面交互
document.addEventListener('DOMContentLoaded', function() {
    console.log('任务处理页面加载完成');
    
    // 初始化页面
    initPage();
    
    // 绑定事件
    bindEvents();
    
    // 加载处理历史
    loadProcessHistory();
    
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
    // 获取URL参数
    const urlParams = new URLSearchParams(window.location.search);
    const taskId = urlParams.get('id');
    const applicantId = urlParams.get('applicant');
    
    if (taskId && applicantId) {
        // 加载任务和申请信息
        loadTaskAndApplication(taskId, applicantId);
    }
    
    // 设置拒绝理由的显示/隐藏
    const rejectRadio = document.querySelector('input[value="reject"]');
    const rejectReasonGroup = document.getElementById('rejectReasonGroup');
    const rejectReasonSelect = document.getElementById('rejectReason');
    const otherReasonTextarea = document.getElementById('otherReason');
    
    rejectRadio.addEventListener('change', function() {
        if (this.checked) {
            rejectReasonGroup.style.display = 'block';
        }
    });
    
    document.querySelector('input[value="approve"]').addEventListener('change', function() {
        if (this.checked) {
            rejectReasonGroup.style.display = 'none';
        }
    });
    
    // 其他原因文本框
    rejectReasonSelect.addEventListener('change', function() {
        if (this.value === 'other') {
            otherReasonTextarea.style.display = 'block';
        } else {
            otherReasonTextarea.style.display = 'none';
        }
    });
}

function loadTaskAndApplication(taskId, applicantId) {
    console.log('加载任务信息:', { taskId, applicantId });
    
    // 模拟API调用获取数据
    setTimeout(() => {
        // 这里应该从API获取真实数据
        console.log('已加载任务和申请信息');
    }, 500);
}

function bindEvents() {
    // 表单提交
    const processForm = document.querySelector('.process-form');
    processForm.addEventListener('submit', function(e) {
        e.preventDefault();
        submitProcess();
    });
}

function submitProcess() {
    const result = document.querySelector('input[name="result"]:checked').value;
    const comment = document.getElementById('adminComment').value.trim();
    const rejectReason = document.getElementById('rejectReason').value;
    const otherReason = document.getElementById('otherReason').value;
    
    // 验证数据
    if (result === 'reject' && !rejectReason) {
        showToast('请选择拒绝理由', 'error');
        return;
    }
    
    if (result === 'reject' && rejectReason === 'other' && !otherReason.trim()) {
        showToast('请填写其他原因说明', 'error');
        return;
    }
    
    // 准备处理数据
    const processData = {
        result,
        comment,
        rejectReason: result === 'reject' ? rejectReason : null,
        otherReason: result === 'reject' && rejectReason === 'other' ? otherReason : null,
        processedBy: '李老师',
        processedAt: new Date().toISOString()
    };
    
    console.log('提交处理数据:', processData);
    
    // 显示加载状态
    const submitBtn = document.querySelector('.process-actions .btn-primary');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 处理中...';
    submitBtn.disabled = true;
    
    // 模拟处理过程
    setTimeout(() => {
        // 模拟成功
        const message = result === 'approve' 
            ? '申请已批准！博士生将收到确认通知。' 
            : '申请已拒绝。';
        
        showToast(message, 'success');
        
        // 添加到处理历史
        addToProcessHistory(processData);
        
        // 更新UI
        updateUIAfterProcessing(result);
        
        // 重置按钮
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // 3秒后返回
        setTimeout(() => {
            window.history.back();
        }, 3000);
        
    }, 1500);
}

function updateUIAfterProcessing(result) {
    const headerActions = document.querySelector('.header-actions');
    const processActions = document.querySelector('.process-actions');
    
    // 更新状态徽章
    const urgencyBadge = document.querySelector('.urgency-badge');
    if (urgencyBadge) {
        urgencyBadge.remove();
    }
    
    // 添加处理结果徽章
    const resultBadge = document.createElement('span');
    resultBadge.className = `status-badge ${result === 'approve' ? 'status-success' : 'status-danger'}`;
    resultBadge.textContent = result === 'approve' ? '已批准' : '已拒绝';
    headerActions.appendChild(resultBadge);
    
    // 禁用表单
    document.querySelectorAll('.process-form input, .process-form select, .process-form textarea').forEach(element => {
        element.disabled = true;
    });
    
    // 隐藏处理按钮
    processActions.style.display = 'none';
}

function addToProcessHistory(processData) {
    const historyList = document.querySelector('.history-list');
    
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    
    const time = new Date(processData.processedAt).toLocaleString();
    const resultText = processData.result === 'approve' ? '批准' : '拒绝';
    
    historyItem.innerHTML = `
        <div class="history-header">
            <span class="history-user">${processData.processedBy}</span>
            <span class="history-time">${time}</span>
            <span class="history-result ${processData.result}">${resultText}</span>
        </div>
        <div class="history-comment">
            ${processData.comment || '无处理意见'}
        </div>
        ${processData.rejectReason ? `<div class="history-reason">拒绝理由: ${processData.rejectReason}</div>` : ''}
        ${processData.otherReason ? `<div class="history-other-reason">${processData.otherReason}</div>` : ''}
    `;
    
    historyList.prepend(historyItem);
}

function loadProcessHistory() {
    // 模拟加载处理历史
    const sampleHistory = [
        {
            user: '王管理员',
            time: '2024-05-18 10:30',
            result: 'approve',
            comment: '申请人经验丰富，符合要求'
        },
        {
            user: '张老师',
            time: '2024-05-17 15:45',
            result: 'reject',
            comment: '专业方向不符合任务要求',
            rejectReason: '不符合资格要求'
        }
    ];
    
    const historyList = document.querySelector('.history-list');
    
    sampleHistory.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        historyItem.innerHTML = `
            <div class="history-header">
                <span class="history-user">${item.user}</span>
                <span class="history-time">${item.time}</span>
                <span class="history-result ${item.result}">${item.result === 'approve' ? '批准' : '拒绝'}</span>
            </div>
            <div class="history-comment">
                ${item.comment}
            </div>
            ${item.rejectReason ? `<div class="history-reason">拒绝理由: ${item.rejectReason}</div>` : ''}
        `;
        
        historyList.appendChild(historyItem);
    });
}

function deferProcessing() {
    if (confirm('将任务标记为"稍后处理"？任务将保持在待处理列表中。')) {
        showToast('任务已标记为稍后处理', 'info');
        
        // 返回列表
        setTimeout(() => {
            window.history.back();
        }, 1000);
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