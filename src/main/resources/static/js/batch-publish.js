// js/batch-publish.js - 批量发布页面交互
document.addEventListener('DOMContentLoaded', function() {
    console.log('批量发布页面加载完成');
    
    // 初始化上传区域
    initUploadArea();
    
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

function initUploadArea() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('excelFile');
    
    // 拖拽上传
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.style.borderColor = 'var(--secondary-color)';
        this.style.backgroundColor = 'rgba(52, 152, 219, 0.1)';
    });
    
    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.style.borderColor = 'var(--border-light)';
        this.style.backgroundColor = 'var(--bg-tertiary)';
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        this.style.borderColor = 'var(--border-light)';
        this.style.backgroundColor = 'var(--bg-tertiary)';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    });
    
    // 点击上传
    fileInput.addEventListener('change', function(e) {
        if (this.files.length > 0) {
            handleFileUpload(this.files[0]);
        }
    });
}

function handleFileUpload(file) {
    const validTypes = ['.xlsx', '.xls', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
    const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!validTypes.some(type => file.name.toLowerCase().endsWith(type) || file.type === type)) {
        showToast('请上传Excel文件 (.xlsx 或 .xls)', 'error');
        return;
    }
    
    // 显示加载状态
    const uploadArea = document.getElementById('uploadArea');
    uploadArea.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 正在读取文件...';
    
    // 模拟文件读取过程
    setTimeout(() => {
        processExcelFile(file);
    }, 1000);
}

function processExcelFile(file) {
    console.log('处理文件:', file.name);
    
    // 在实际应用中，这里应该使用SheetJS或类似库读取Excel
    // 这里我们模拟一些示例数据
    const sampleData = [
        {
            title: '《机器学习》课程助教',
            type: '课程助教',
            people: 2,
            hours: 30,
            deadline: '2024-06-30',
            status: 'valid'
        },
        {
            title: '实验室设备管理',
            type: '实验室工作',
            people: 1,
            hours: 20,
            deadline: '2024-06-15',
            status: 'valid'
        },
        {
            title: '论文数据整理',
            type: '科研助理',
            people: 3,
            hours: 40,
            deadline: '2024-05-30',
            status: 'invalid'
        }
    ];
    
    // 显示预览
    displayPreview(sampleData);
}

function displayPreview(data) {
    const previewSection = document.getElementById('previewSection');
    const previewTableBody = document.getElementById('previewTableBody');
    const totalTasks = document.getElementById('totalTasks');
    const validTasks = document.getElementById('validTasks');
    const invalidTasks = document.getElementById('invalidTasks');
    const publishBtn = document.getElementById('publishBtn');
    
    // 清空表格
    previewTableBody.innerHTML = '';
    
    // 统计
    let validCount = 0;
    let invalidCount = 0;
    
    // 填充数据
    data.forEach((item, index) => {
        const row = document.createElement('tr');
        row.className = item.status === 'invalid' ? 'invalid-row' : '';
        
        row.innerHTML = `
            <td>${item.title}</td>
            <td><span class="type-badge">${item.type}</span></td>
            <td>${item.people}人</td>
            <td>${item.hours}小时</td>
            <td>${item.deadline}</td>
            <td>
                <span class="status-badge ${item.status === 'valid' ? 'status-valid' : 'status-invalid'}">
                    ${item.status === 'valid' ? '有效' : '需修正'}
                </span>
            </td>
        `;
        
        previewTableBody.appendChild(row);
        
        if (item.status === 'valid') {
            validCount++;
        } else {
            invalidCount++;
        }
    });
    
    // 更新统计
    totalTasks.textContent = data.length;
    validTasks.textContent = validCount;
    invalidTasks.textContent = invalidCount;
    
    // 显示预览区域
    previewSection.style.display = 'block';
    
    // 启用发布按钮（如果有有效数据）
    if (validCount > 0) {
        publishBtn.disabled = false;
    }
}

function clearUpload() {
    const fileInput = document.getElementById('excelFile');
    const uploadArea = document.getElementById('uploadArea');
    const previewSection = document.getElementById('previewSection');
    const publishBtn = document.getElementById('publishBtn');
    
    // 重置文件输入
    fileInput.value = '';
    
    // 重置上传区域
    uploadArea.innerHTML = `
        <i class="fas fa-file-excel upload-icon"></i>
        <h3>上传Excel文件</h3>
        <p>将Excel文件拖到此处，或点击选择文件</p>
        <button class="btn btn-primary" onclick="document.getElementById('excelFile').click()">
            <i class="fas fa-upload"></i> 选择文件
        </button>
        <div class="file-types">
            支持格式: .xlsx, .xls
        </div>
    `;
    
    // 隐藏预览
    previewSection.style.display = 'none';
    
    // 禁用发布按钮
    publishBtn.disabled = true;
}

function batchPublish() {
    const validateData = document.getElementById('validateData').checked;
    const sendNotifications = document.getElementById('sendNotifications').checked;
    const skipInvalid = document.getElementById('skipInvalid').checked;
    
    // 显示加载状态
    const publishBtn = document.getElementById('publishBtn');
    const originalText = publishBtn.innerHTML;
    publishBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 发布中...';
    publishBtn.disabled = true;
    
    // 模拟批量发布过程
    setTimeout(() => {
        console.log('批量发布设置:', { validateData, sendNotifications, skipInvalid });
        
        // 模拟成功
        showToast(`成功发布3个任务！${sendNotifications ? '已发送通知' : ''}`, 'success');
        
        // 重置按钮
        publishBtn.innerHTML = originalText;
        publishBtn.disabled = false;
        
        // 返回工作台
        setTimeout(() => {
            window.location.href = 'admin-dashboard.html';
        }, 2000);
        
    }, 2000);
}

function downloadTemplate() {
    // 创建模拟的Excel模板内容
    const templateContent = `任务标题,任务类型,需求人数,预计工时(小时),截止日期(YYYY-MM-DD),任务描述
《课程名称》课程助教,课程助教,2,40,2024-06-30,负责课程辅导和作业批改
实验室设备维护,实验室工作,1,20,2024-06-15,负责实验室设备日常维护
论文数据收集,科研助理,1,30,2024-06-20,协助收集和整理研究数据`;
    
    // 创建Blob和下载链接
    const blob = new Blob([templateContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '任务批量导入模板.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showToast('模板下载成功', 'success');
}

function bindEvents() {
    // 发布按钮点击事件
    document.getElementById('publishBtn').addEventListener('click', batchPublish);
    
    // 重新上传按钮
    const reuploadBtn = document.querySelector('[onclick="clearUpload()"]');
    reuploadBtn.addEventListener('click', clearUpload);
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