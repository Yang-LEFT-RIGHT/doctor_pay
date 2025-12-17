// js/new-task.js - 修正版

document.addEventListener('DOMContentLoaded', function() {
    console.log('发布新任务页面加载完成');
    
    // 初始化日期
    initDateInputs();
    
    // 绑定表单事件
    bindFormEvents();
    
    // 更新通知计数
    updateNotificationCount();
    
    // 绑定弹窗关闭事件
    bindModalEvents();
    
    // 设置任务ID
    generateTaskId();

    // 新增：实时更新任务摘要
    initTaskSummary();

    // 新增：更新统计数据
    updateStats();
});

function initTaskSummary() {
    // 监听表单变化，实时更新摘要
    const fields = ['taskType', 'requiredPeople', 'workHours', 'deadline'];
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('change', updateTaskSummary);
            field.addEventListener('input', updateTaskSummary); // 也监听input事件
        }
    });
    
    // 初始更新
    updateTaskSummary();
}

function updateTaskSummary() {
    // 更新任务类型
    const taskTypeSelect = document.getElementById('taskType');
    const summaryType = document.getElementById('summaryType');
    if (taskTypeSelect && summaryType) {
        const selectedOption = taskTypeSelect.options[taskTypeSelect.selectedIndex];
        summaryType.textContent = selectedOption.text || '未选择';
    }
    
    // 更新需求人数
    const requiredPeople = document.getElementById('requiredPeople');
    const summaryPeople = document.getElementById('summaryPeople');
    if (requiredPeople && summaryPeople) {
        summaryPeople.textContent = `${requiredPeople.value}人`;
    }
    
    // 更新总工时
    const workHours = document.getElementById('workHours');
    const summaryHours = document.getElementById('summaryHours');
    if (workHours && summaryHours) {
        summaryHours.textContent = `${workHours.value}小时`;
    }
    
    // 更新截止日期
    const deadline = document.getElementById('deadline');
    const summaryDeadline = document.getElementById('summaryDeadline');
    if (deadline && summaryDeadline) {
        if (deadline.value) {
            const date = new Date(deadline.value);
            summaryDeadline.textContent = date.toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
        } else {
            summaryDeadline.textContent = '未设置';
        }
    }
}

function updateStats() {
    // 这里可以添加从服务器获取统计数据的功能
    // 暂时使用模拟数据
    const activeTasksEl = document.getElementById('activeTasks');
    const totalHoursEl = document.getElementById('totalHours');
    const availableStudentsEl = document.getElementById('availableStudents');
    
    if (activeTasksEl) activeTasksEl.textContent = '12';
    if (totalHoursEl) totalHoursEl.textContent = '156';
    if (availableStudentsEl) availableStudentsEl.textContent = '24';
}

function updateNotificationCount() {
    if (window.notificationSystem) {
        const unreadCount = window.notificationSystem.notifications.filter(n => !n.read).length;
        const notificationCount = document.getElementById('notificationCount');
        const sidebarNotificationCount = document.getElementById('sidebarNotificationCount');
        
        if (notificationCount) notificationCount.textContent = unreadCount;
        if (sidebarNotificationCount) sidebarNotificationCount.textContent = unreadCount;
    }
}

function initDateInputs() {
    // 设置截止日期为14天后
    const today = new Date();
    const twoWeeksLater = new Date(today);
    twoWeeksLater.setDate(today.getDate() + 14);
    
    const deadlineInput = document.getElementById('deadline');
    if (deadlineInput) {
        deadlineInput.value = twoWeeksLater.toISOString().split('T')[0];
        deadlineInput.min = new Date().toISOString().split('T')[0];
    }
}

function bindFormEvents() {
    const requiredPeopleInput = document.getElementById('requiredPeople');
    const workHoursInput = document.getElementById('workHours');
    const deadlineInput = document.getElementById('deadline');
    
    // 限制输入范围
    if (requiredPeopleInput) {
        requiredPeopleInput.addEventListener('change', function() {
            if (this.value < 1) this.value = 1;
            if (this.value > 10) this.value = 10;
        });
    }
    
    if (workHoursInput) {
        workHoursInput.addEventListener('change', function() {
            if (this.value < 1) this.value = 1;
            if (this.value > 200) this.value = 200;
        });
    }
    
    // 监听日期变化
    if (deadlineInput) {
        deadlineInput.addEventListener('change', function() {
            const deadline = new Date(this.value);
            const today = new Date();
            
            if (deadline <= today) {
                showToast('截止日期必须大于今天', 'warning');
                this.value = '';
                updateTaskSummary(); // 更新摘要
            }
        });
    }
    
    // 实时表单验证
    const requiredFields = ['taskTitle', 'taskType', 'requiredPeople', 'workHours', 'deadline', 'taskDescription'];
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('blur', validateField);
        }
    });
}

function bindModalEvents() {
    const successModal = document.getElementById('successModal');
    if (successModal) {
        // 点击遮罩层关闭弹窗
        successModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeSuccessModal();
            }
        });
    }
    
    // ESC键关闭弹窗
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeSuccessModal();
        }
    });
}

function generateTaskId() {
    // 生成任务ID示例
    const taskId = 'TASK-' + Date.now().toString().slice(-8);
    console.log('生成的任务ID:', taskId);
    return taskId;
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    if (!field.required) return;
    
    if (!value) {
        field.style.borderColor = 'var(--accent-color)';
    } else {
        field.style.borderColor = '';
        
        // 特定字段验证
        if (field.id === 'requiredPeople' && (value < 1 || value > 10)) {
            showToast('需求人数应在1-10之间', 'warning');
            field.style.borderColor = 'var(--accent-color)';
        } else if (field.id === 'workHours' && (value < 1 || value > 200)) {
            showToast('预计工时应在1-200小时之间', 'warning');
            field.style.borderColor = 'var(--accent-color)';
        } else if (field.id === 'taskTitle' && value.length < 5) {
            showToast('任务标题至少需要5个字符', 'warning');
            field.style.borderColor = 'var(--accent-color)';
        } else if (field.id === 'taskDescription' && value.length < 20) {
            showToast('任务描述至少需要20个字符', 'warning');
            field.style.borderColor = 'var(--accent-color)';
        }
    }
}

function publishNewTask() {
    // 收集表单数据
    const formData = collectFormData();
    
    // 验证数据
    if (!validateTaskData(formData)) {
        return;
    }
    
    // 显示加载状态
    const submitBtn = document.getElementById('publishBtn');
    if (submitBtn) {
        submitBtn.classList.add('btn-loading-fixed'); // 改为新的类名
        submitBtn.disabled = true;
    }
    
    // 模拟API调用
    setTimeout(() => {
        // ... 处理逻辑 ...
        
        // 重置表单状态
        if (submitBtn) {
            submitBtn.classList.remove('btn-loading-fixed'); // 改为新的类名
            submitBtn.disabled = false;
        }
        
        // 记录发布历史
        savePublishHistory(formData, taskId);
        
    }, 1500);
}

// 新增：收集表单数据的函数
function collectFormData() {
    const data = {};
    
    // 收集所有表单字段
    const fields = [
        'taskTitle', 'taskType', 'requiredPeople', 'workHours', 'deadline',
        'taskDescription', 'requirements', 'workSchedule'
    ];
    
    fields.forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element) {
            data[fieldId] = element.value;
        }
    });
    
    // 收集复选框
    const checkboxes = ['notifyAll', 'autoAssign', 'allowMultiple'];
    checkboxes.forEach(checkboxId => {
        const checkbox = document.getElementById(checkboxId);
        if (checkbox) {
            data[checkboxId] = checkbox.checked;
        }
    });
    
    return data;
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
    
    const requiredPeople = parseInt(data.requiredPeople);
    if (!requiredPeople || requiredPeople < 1 || requiredPeople > 10) {
        errors.push('需求人数应在1-10之间');
    }
    
    const workHours = parseInt(data.workHours);
    if (!workHours || workHours < 1 || workHours > 200) {
        errors.push('预计工时应在1-200小时之间');
    }
    
    if (!data.deadline) {
        errors.push('请选择截止日期');
    } else {
        const deadline = new Date(data.deadline);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (deadline <= today) {
            errors.push('截止日期必须大于今天');
        }
    }
    
    if (!data.taskDescription || data.taskDescription.trim().length < 20) {
        errors.push('任务描述至少需要20个字符');
    }
    
    // 显示错误信息
    if (errors.length > 0) {
        showErrorMessage(errors);
        return false;
    }
    
    return true;
}

function showErrorMessage(errors) {
    const errorMessage = errors.join('\n');
    
    if (window.notificationSystem) {
        window.notificationSystem.showToast(`表单验证失败：${errors[0]}`, 'error');
    } else {
        alert('请检查表单：\n\n' + errorMessage);
    }
    
    // 滚动到第一个错误字段
    const firstError = errors[0];
    if (firstError.includes('标题')) {
        document.getElementById('taskTitle')?.focus();
    } else if (firstError.includes('类型')) {
        document.getElementById('taskType')?.focus();
    } else if (firstError.includes('需求人数')) {
        document.getElementById('requiredPeople')?.focus();
    } else if (firstError.includes('工时')) {
        document.getElementById('workHours')?.focus();
    } else if (firstError.includes('截止日期')) {
        document.getElementById('deadline')?.focus();
    } else if (firstError.includes('描述')) {
        document.getElementById('taskDescription')?.focus();
    }
}

// 在 showSuccessModal 函数中，确保更新正确的元素
function showSuccessModal(taskId) {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.add('show');
        
        // 更新模态框内容
        const successMessage = document.getElementById('successMessage');
        if (successMessage) {
            successMessage.textContent = `任务ID：${taskId} 已成功发布到系统，相关博士生将会收到通知。`;
        }
        
        // 禁用页面滚动
        document.body.style.overflow = 'hidden';
    }
}

function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.remove('show');
    }
    
    // 启用页面滚动
    document.body.style.overflow = '';
}

function backToDashboard() {
    closeSuccessModal();
    window.location.href = 'admin-dashboard.html';
}

function viewTaskDetails() {
    closeSuccessModal();
    window.location.href = 'task-list-admin.html';
}

function cancelPublish() {
    if (confirm('确定要取消发布吗？所有填写的内容将不会被保存。')) {
        window.history.back();
    }
}

function saveDraft() {
    const formData = collectFormData();
    
    try {
        // 添加草稿时间戳
        formData.draftSavedAt = new Date().toISOString();
        localStorage.setItem('taskDraft', JSON.stringify(formData));
        
        showToast('草稿已保存', 'success');
    } catch (error) {
        console.error('保存草稿失败:', error);
        showToast('保存草稿失败', 'error');
    }
}

function savePublishHistory(data, taskId) {
    try {
        const history = JSON.parse(localStorage.getItem('taskPublishHistory') || '[]');
        
        const historyItem = {
            taskId: taskId,
            title: data.taskTitle,
            type: data.taskType,
            people: data.requiredPeople,
            hours: data.workHours,
            deadline: data.deadline,
            publishedAt: new Date().toISOString()
        };
        
        history.unshift(historyItem);
        localStorage.setItem('taskPublishHistory', JSON.stringify(history.slice(0, 20))); // 只保留最近20条
    } catch (error) {
        console.error('保存发布历史失败:', error);
    }
}

function showToast(message, type = 'info') {
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