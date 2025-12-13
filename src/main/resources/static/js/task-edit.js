// js/task-edit.js - 任务编辑页面交互
document.addEventListener('DOMContentLoaded', function() {
    console.log('任务编辑页面加载完成');
    
    // 初始化页面
    initPage();
    
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
        loadTaskData(taskId);
    } else {
        showToast('任务ID不存在', 'error');
        setTimeout(() => {
            window.location.href = 'task-list-admin.html';
        }, 1500);
    }
    
    // 初始化津贴计算
    initStipendCalculation();
}

function loadTaskData(taskId) {
    console.log('加载任务数据:', taskId);
    
    // 显示加载状态
    showLoadingState();
    
    // 模拟API调用获取任务数据
    setTimeout(() => {
        // 模拟任务数据
        const taskData = {
            id: taskId,
            title: '《数据结构》课程助教 - 实验课指导',
            type: 'course',
            department: 'cs',
            requiredPeople: 2,
            workHours: 40,
            publishDate: '2024-05-15',
            deadline: '2024-06-15',
            description: '负责每周二下午的实验课指导，协助学生完成图像处理实验，批改实验报告。需要熟悉Python编程和数据结构相关知识。',
            requirements: '1. 熟悉Python编程语言\n2. 了解数据结构与算法\n3. 具有良好的沟通能力\n4. 每周至少能保证4小时工作时间',
            stipendRate: 40,
            status: 'pending',
            statusReason: ''
        };
        
        // 填充表单数据
        populateFormData(taskData);
        
        // 隐藏加载状态
        hideLoadingState();
        
    }, 1000);
}

function populateFormData(data) {
    document.getElementById('taskTitle').value = data.title;
    document.getElementById('taskType').value = data.type;
    document.getElementById('department').value = data.department;
    document.getElementById('requiredPeople').value = data.requiredPeople;
    document.getElementById('workHours').value = data.workHours;
    document.getElementById('publishDate').value = data.publishDate;
    document.getElementById('deadline').value = data.deadline;
    document.getElementById('taskDescription').value = data.description;
    document.getElementById('requirements').value = data.requirements;
    document.getElementById('stipendRate').value = data.stipendRate;
    document.getElementById('taskStatus').value = data.status;
    document.getElementById('statusReason').value = data.statusReason || '';
    
    // 计算并显示总津贴
    calculateTotalStipend();
}

function initStipendCalculation() {
    const requiredPeopleInput = document.getElementById('requiredPeople');
    const workHoursInput = document.getElementById('workHours');
    const stipendRateInput = document.getElementById('stipendRate');
    
    // 监听输入变化，重新计算津贴
    [requiredPeopleInput, workHoursInput, stipendRateInput].forEach(input => {
        input.addEventListener('input', calculateTotalStipend);
    });
    
    // 初始计算
    calculateTotalStipend();
}

function calculateTotalStipend() {
    const requiredPeople = parseInt(document.getElementById('requiredPeople').value) || 1;
    const workHours = parseInt(document.getElementById('workHours').value) || 1;
    const stipendRate = parseInt(document.getElementById('stipendRate').value) || 40;
    
    const totalStipend = requiredPeople * workHours * stipendRate;
    document.getElementById('totalStipend').textContent = totalStipend.toLocaleString();
}

function bindEvents() {
    const form = document.getElementById('editTaskForm');
    
    // 表单提交
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        saveTaskChanges();
    });
    
    // 删除原因选择
    const deleteReasonSelect = document.getElementById('deleteReason');
    const deleteReasonDetail = document.getElementById('deleteReasonDetail');
    
    deleteReasonSelect.addEventListener('change', function() {
        if (this.value === 'other') {
            deleteReasonDetail.style.display = 'block';
        } else {
            deleteReasonDetail.style.display = 'none';
        }
    });
}

function saveTaskChanges() {
    const form = document.getElementById('editTaskForm');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // 验证数据
    if (!validateTaskData(data)) {
        return;
    }
    
    // 显示加载状态
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 保存中...';
    submitBtn.disabled = true;
    
    // 模拟API调用
    setTimeout(() => {
        console.log('保存任务数据:', data);
        
        // 模拟成功响应
        showToast('任务修改已保存', 'success');
        
        // 重置按钮状态
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // 返回任务详情页
        setTimeout(() => {
            window.location.href = 'task-detail-admin.html?id=1';
        }, 1500);
        
    }, 1500);
}

function validateTaskData(data) {
    const errors = [];
    
    // 验证必填字段
    if (!data.taskTitle || data.taskTitle.trim().length < 5) {
        errors.push('任务标题至少需要5个字符');
    }
    
    if (!data.taskType) {
        errors.push('请选择任务类型');
    }
    
    if (!data.department) {
        errors.push('请选择所属院系');
    }
    
    if (parseInt(data.requiredPeople) < 1) {
        errors.push('需求人数至少为1人');
    }
    
    if (parseInt(data.workHours) < 1) {
        errors.push('预计工时至少为1小时');
    }
    
    const deadline = new Date(data.deadline);
    const today = new Date();
    if (deadline <= today) {
        errors.push('截止日期必须大于今天');
    }
    
    if (!data.taskDescription || data.taskDescription.trim().length < 20) {
        errors.push('任务描述至少需要20个字符');
    }
    
    if (parseInt(data.stipendRate) < 20) {
        errors.push('津贴标准不能低于20元/小时');
    }
    
    // 如果状态变更，需要填写原因
    if (data.taskStatus !== 'pending' && !data.statusReason.trim()) {
        errors.push('状态变更需要填写原因说明');
    }
    
    // 显示错误信息
    if (errors.length > 0) {
        showErrorMessage(errors);
        return false;
    }
    
    return true;
}

function showErrorMessage(errors) {
    if (window.notificationSystem) {
        window.notificationSystem.showToast('表单验证失败：' + errors[0], 'error');
        
        // 如果有多个错误，可以在控制台显示
        if (errors.length > 1) {
            console.warn('表单验证错误:', errors);
        }
    } else {
        alert('请检查表单：' + errors.join('，'));
    }
}

function showLoadingState() {
    const form = document.getElementById('editTaskForm');
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="loading-content">
            <i class="fas fa-spinner fa-spin"></i>
            <p>正在加载任务数据...</p>
        </div>
    `;
    form.appendChild(loadingOverlay);
}

function hideLoadingState() {
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.remove();
    }
}

function showDeleteConfirm() {
    const modal = document.getElementById('deleteModal');
    modal.style.display = 'flex';
}

function closeDeleteModal() {
    const modal = document.getElementById('deleteModal');
    modal.style.display = 'none';
    
    // 重置表单
    document.getElementById('deleteReason').value = '';
    document.getElementById('deleteReasonDetail').value = '';
    document.getElementById('deleteReasonDetail').style.display = 'none';
}

function confirmDelete() {
    const deleteReason = document.getElementById('deleteReason').value;
    const deleteReasonDetail = document.getElementById('deleteReasonDetail').value;
    
    if (!deleteReason) {
        showToast('请选择删除原因', 'error');
        return;
    }
    
    if (deleteReason === 'other' && !deleteReasonDetail.trim()) {
        showToast('请填写删除原因说明', 'error');
        return;
    }
    
    const deleteData = {
        reason: deleteReason,
        detail: deleteReason === 'other' ? deleteReasonDetail : null,
        deletedBy: '李老师',
        deletedAt: new Date().toISOString()
    };
    
    console.log('删除任务:', deleteData);
    
    // 显示删除中状态
    const deleteBtn = document.querySelector('.modal-actions .btn-danger');
    const originalText = deleteBtn.innerHTML;
    deleteBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 删除中...';
    deleteBtn.disabled = true;
    
    // 模拟删除过程
    setTimeout(() => {
        showToast('任务已删除', 'success');
        
        // 关闭模态框
        closeDeleteModal();
        
        // 返回任务列表
        setTimeout(() => {
            window.location.href = 'task-list-admin.html';
        }, 1500);
        
    }, 1500);
}

function cancelEdit() {
    if (confirm('放弃修改并返回？未保存的更改将丢失。')) {
        window.history.back();
    }
}

function viewTaskHistory() {
    showToast('查看修改历史', 'info');
    // 这里可以跳转到修改历史页面
    // window.location.href = 'task-history.html?id=1';
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

// 添加加载样式到head
const style = document.createElement('style');
style.textContent = `
    .loading-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(255, 255, 255, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 100;
        border-radius: var(--radius-lg);
    }
    
    .loading-content {
        text-align: center;
    }
    
    .loading-content i {
        font-size: 40px;
        color: var(--secondary-color);
        margin-bottom: 15px;
    }
    
    .loading-content p {
        color: var(--text-secondary);
        font-size: 16px;
    }
`;
document.head.appendChild(style);