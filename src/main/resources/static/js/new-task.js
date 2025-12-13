// js/new-task.js - 发布新任务页面交互
document.addEventListener('DOMContentLoaded', function() {
    console.log('发布新任务页面加载完成');
    
    // 初始化日期
    initDateInputs();
    
    // 绑定表单事件
    bindFormEvents();
    
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

function initDateInputs() {
    // 设置发布日期为今天
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('publishDate').value = today;
    
    // 设置截止日期为7天后
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    document.getElementById('deadline').value = nextWeek.toISOString().split('T')[0];
    
    // 确保截止日期不小于发布日期
    document.getElementById('deadline').min = today;
}

function bindFormEvents() {
    const form = document.getElementById('newTaskForm');
    const requiredPeopleInput = document.getElementById('requiredPeople');
    const workHoursInput = document.getElementById('workHours');
    const stipendRateInput = document.getElementById('stipendRate');
    const totalStipendDisplay = document.getElementById('totalStipendDisplay');
    
    // 计算总津贴
    function calculateTotalStipend() {
        const people = parseInt(requiredPeopleInput.value) || 1;
        const hours = parseInt(workHoursInput.value) || 1;
        const rate = parseInt(stipendRateInput.value) || 40;
        const total = people * hours * rate;
        totalStipendDisplay.textContent = total.toLocaleString();
    }
    
    // 监听输入变化
    [requiredPeopleInput, workHoursInput, stipendRateInput].forEach(input => {
        input.addEventListener('input', calculateTotalStipend);
    });
    
    // 表单提交
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        publishNewTask();
    });
    
    // 初始计算
    calculateTotalStipend();
}

function publishNewTask() {
    const form = document.getElementById('newTaskForm');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // 验证数据
    if (!validateTaskData(data)) {
        return;
    }
    
    // 显示加载状态
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 发布中...';
    submitBtn.disabled = true;
    
    // 模拟API调用
    setTimeout(() => {
        console.log('发布任务数据:', data);
        
        // 模拟成功响应
        showSuccessMessage();
        
        // 重置表单状态
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // 3秒后返回工作台
        setTimeout(() => {
            window.location.href = 'admin-dashboard.html';
        }, 3000);
        
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

function showSuccessMessage() {
    if (window.notificationSystem) {
        window.notificationSystem.showToast('任务发布成功！系统将通知相关博士生。', 'success');
    } else {
        alert('任务发布成功！');
    }
}

function saveDraft() {
    const form = document.getElementById('newTaskForm');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // 保存草稿到localStorage
    try {
        localStorage.setItem('taskDraft', JSON.stringify(data));
        
        if (window.notificationSystem) {
            window.notificationSystem.showToast('草稿已保存', 'info');
        } else {
            alert('草稿已保存');
        }
    } catch (error) {
        console.error('保存草稿失败:', error);
        if (window.notificationSystem) {
            window.notificationSystem.showToast('保存草稿失败', 'error');
        }
    }
}

// 全局函数
function logout() {
    if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('docim_user');
        window.location.href = 'index.html';
    }
}