// js/contact.js - 联系反馈页面JavaScript

// 模拟的反馈历史数据
const mockFeedbackHistory = [
    {
        id: 1,
        title: "任务分配时博士生信息显示不全",
        type: "bug",
        priority: "high",
        status: "resolved",
        submittedDate: "2024-03-10 14:30",
        resolvedDate: "2024-03-12 10:15",
        description: "在任务分配页面，部分博士生的专业信息显示为空白",
        response: "已修复数据库查询问题，现在可以正常显示博士生完整信息。"
    },
    {
        id: 2,
        title: "建议增加批量任务延期功能",
        type: "suggestion",
        priority: "normal",
        status: "in-progress",
        submittedDate: "2024-03-05 09:45",
        resolvedDate: null,
        description: "目前只能逐个延期任务，建议增加批量延期功能以提高效率",
        response: "功能已列入开发计划，预计在下个版本中发布。"
    },
    {
        id: 3,
        title: "系统登录页面加载缓慢",
        type: "technical",
        priority: "urgent",
        status: "resolved",
        submittedDate: "2024-02-28 16:20",
        resolvedDate: "2024-02-29 11:30",
        description: "系统登录页面有时需要10秒以上才能完全加载",
        response: "已优化前端资源加载，现在登录页面加载时间已缩短至3秒内。"
    },
    {
        id: 4,
        title: "希望增加自定义报表功能",
        type: "improvement",
        priority: "normal",
        status: "pending",
        submittedDate: "2024-02-15 13:10",
        resolvedDate: null,
        description: "希望能自定义统计报表的字段和格式，满足不同需求",
        response: "正在评估技术可行性，会尽快给出答复。"
    }
];

// 附加字段配置
const additionalFieldsConfig = {
    technical: [
        {
            type: "select",
            id: "systemModule",
            label: "涉及系统模块",
            options: [
                { value: "", label: "请选择模块" },
                { value: "dashboard", label: "工作台首页" },
                { value: "task", label: "任务管理" },
                { value: "student", label: "博士生管理" },
                { value: "stats", label: "统计分析" },
                { value: "settings", label: "系统设置" },
                { value: "all", label: "整个系统" }
            ],
            required: true
        },
        {
            type: "textarea",
            id: "errorDetails",
            label: "错误详情",
            placeholder: "请描述具体的错误信息、错误代码或截图描述",
            rows: 3,
            required: false
        }
    ],
    bug: [
        {
            type: "select",
            id: "bugSeverity",
            label: "问题严重程度",
            options: [
                { value: "", label: "请选择严重程度" },
                { value: "critical", label: "严重 - 系统无法使用" },
                { value: "high", label: "高 - 主要功能受影响" },
                { value: "medium", label: "中 - 次要功能受影响" },
                { value: "low", label: "低 - 轻微问题" }
            ],
            required: true
        },
        {
            type: "textarea",
            id: "reproduceSteps",
            label: "重现步骤",
            placeholder: "请详细描述如何重现这个问题（步骤1，步骤2...）",
            rows: 4,
            required: true
        }
    ],
    suggestion: [
        {
            type: "select",
            id: "suggestionImpact",
            label: "建议影响范围",
            options: [
                { value: "", label: "请选择影响范围" },
                { value: "all", label: "所有用户" },
                { value: "admins", label: "管理员用户" },
                { value: "students", label: "博士生用户" },
                { value: "specific", label: "特定用户组" }
            ],
            required: true
        },
        {
            type: "textarea",
            id: "expectedBenefit",
            label: "预期效益",
            placeholder: "请描述实施这个建议后能带来什么好处",
            rows: 3,
            required: false
        }
    ],
    improvement: [
        {
            type: "select",
            id: "improvementArea",
            label: "改进领域",
            options: [
                { value: "", label: "请选择改进领域" },
                { value: "ui", label: "用户界面" },
                { value: "ux", label: "用户体验" },
                { value: "performance", label: "系统性能" },
                { value: "security", label: "安全性" },
                { value: "other", label: "其他方面" }
            ],
            required: true
        },
        {
            type: "textarea",
            id: "currentIssue",
            label: "当前问题",
            placeholder: "请描述当前存在的问题或不足",
            rows: 3,
            required: true
        }
    ],
    other: [
        {
            type: "textarea",
            id: "additionalInfo",
            label: "其他信息",
            placeholder: "请提供任何其他相关信息",
            rows: 3,
            required: false
        }
    ]
};

// 上传文件列表
let uploadedFiles = [];

// 获取CSS变量值的辅助函数
function getCssVariableValue(variableName) {
    return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('联系反馈页面加载完成');
    
    // 初始化通知系统
    if (!window.notificationSystem) {
        window.notificationSystem = new NotificationSystem();
    }
    
    // 更新通知计数
    updateNotificationCount();
    
    // 绑定事件
    bindEvents();
    
    // 初始化字符计数器
    initCharCounter();
    
    // 初始化文件上传区域
    initFileUpload();
});

function updateNotificationCount() {
    if (window.notificationSystem) {
        const unreadCount = window.notificationSystem.notifications.filter(n => !n.read).length;
        document.getElementById('notificationCount').textContent = unreadCount;
        document.getElementById('sidebarNotificationCount').textContent = unreadCount;
    }
}

function bindEvents() {
    // 反馈表单提交
    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitFeedback();
        });
    }
    
    // 反馈类型变化时更新字段
    const feedbackTypeSelect = document.getElementById('feedbackType');
    if (feedbackTypeSelect) {
        feedbackTypeSelect.addEventListener('change', updateFormFields);
    }
    
    // 描述文本框字符计数
    const descriptionTextarea = document.getElementById('feedbackDescription');
    if (descriptionTextarea) {
        descriptionTextarea.addEventListener('input', updateCharCount);
    }
}

function initCharCounter() {
    updateCharCount();
}

function updateCharCount() {
    const textarea = document.getElementById('feedbackDescription');
    const charCount = document.getElementById('charCount');
    
    if (!textarea || !charCount) return;
    
    const count = textarea.value.length;
    const maxLength = 2000;
    
    charCount.textContent = `${count}/${maxLength}`;
    
    // 使用实际的CSS变量值
    const accentColor = getCssVariableValue('--accent-color') || '#3498db';
    const textLight = getCssVariableValue('--text-light') || '#7f8c8d';
    
    if (count > maxLength * 0.9) {
        charCount.style.color = accentColor;
    } else if (count > maxLength * 0.7) {
        charCount.style.color = '#f1c40f';
    } else {
        charCount.style.color = textLight;
    }
}

function initFileUpload() {
    const uploadArea = document.getElementById('fileUploadArea');
    const fileInput = document.getElementById('attachments');
    
    if (!uploadArea || !fileInput) return;
    
    // 点击上传区域触发文件选择
    uploadArea.addEventListener('click', function() {
        fileInput.click();
    });
    
    // 拖放功能
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // 使用实际的CSS变量值
        const secondaryColor = getCssVariableValue('--secondary-color') || '#3498db';
        this.style.borderColor = secondaryColor;
        this.style.backgroundColor = 'rgba(52, 152, 219, 0.1)';
    });
    
    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // 使用实际的CSS变量值
        const borderLight = getCssVariableValue('--border-light') || '#ddd';
        this.style.borderColor = borderLight;
        this.style.backgroundColor = '';
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // 使用实际的CSS变量值
        const borderLight = getCssVariableValue('--border-light') || '#ddd';
        this.style.borderColor = borderLight;
        this.style.backgroundColor = '';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFiles(files);
        }
    });
}

function handleFileUpload() {
    const fileInput = document.getElementById('attachments');
    if (fileInput.files.length > 0) {
        handleFiles(fileInput.files);
    }
}

function handleFiles(files) {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 
                         'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                         'text/plain', 'application/zip'];
    
    Array.from(files).forEach(file => {
        // 检查文件大小
        if (file.size > maxSize) {
            showToast(`文件 "${file.name}" 超过10MB限制`, 'error');
            return;
        }
        
        // 检查文件类型
        if (!allowedTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|gif|pdf|doc|docx|txt|zip|log)$/i)) {
            showToast(`不支持的文件类型: ${file.name}`, 'error');
            return;
        }
        
        // 添加到上传列表
        uploadedFiles.push({
            id: Date.now() + Math.random(),
            file: file,
            name: file.name,
            size: formatFileSize(file.size),
            type: file.type,
            uploadedAt: new Date()
        });
    });
    
    // 更新文件列表显示
    updateFileList();
    
    // 重置文件输入
    const fileInput = document.getElementById('attachments');
    if (fileInput) {
        fileInput.value = '';
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function updateFileList() {
    const fileList = document.getElementById('fileList');
    if (!fileList) return;
    
    fileList.innerHTML = '';
    
    if (uploadedFiles.length === 0) {
        fileList.innerHTML = '<p class="no-files">暂无上传文件</p>';
        return;
    }
    
    uploadedFiles.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        
        // 获取文件图标
        const fileIcon = getFileIcon(file.type, file.name);
        
        fileItem.innerHTML = `
            <div class="file-info">
                <div class="file-icon">
                    ${fileIcon}
                </div>
                <div class="file-details">
                    <h5>${file.name}</h5>
                    <span>${file.size} • ${file.uploadedAt.toLocaleDateString()}</span>
                </div>
            </div>
            <div class="file-actions">
                <button class="file-action-btn" onclick="previewFile(${index})" title="预览">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="file-action-btn" onclick="removeFile(${index})" title="删除">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        fileList.appendChild(fileItem);
    });
}

function getFileIcon(fileType, fileName) {
    if (fileType.startsWith('image/')) {
        return '<i class="fas fa-image"></i>';
    } else if (fileType.includes('pdf')) {
        return '<i class="fas fa-file-pdf"></i>';
    } else if (fileType.includes('word') || fileName.match(/\.(doc|docx)$/i)) {
        return '<i class="fas fa-file-word"></i>';
    } else if (fileType.includes('text') || fileName.match(/\.(txt|log)$/i)) {
        return '<i class="fas fa-file-alt"></i>';
    } else if (fileType.includes('zip')) {
        return '<i class="fas fa-file-archive"></i>';
    } else {
        return '<i class="fas fa-file"></i>';
    }
}

function removeFile(index) {
    if (index >= 0 && index < uploadedFiles.length) {
        uploadedFiles.splice(index, 1);
        updateFileList();
        showToast('文件已移除', 'success');
    }
}

function previewFile(index) {
    if (index >= 0 && index < uploadedFiles.length) {
        const file = uploadedFiles[index];
        
        // 在实际应用中，这里会打开文件预览
        // 这里我们只是显示一个提示
        if (file.type.startsWith('image/')) {
            showToast('正在打开图片预览...', 'info');
        } else if (file.type.includes('pdf')) {
            showToast('正在打开PDF预览...', 'info');
        } else {
            showToast(`文件类型 "${file.type}" 需要下载查看`, 'info');
        }
    }
}

function updateFormFields() {
    const feedbackType = document.getElementById('feedbackType').value;
    const additionalFields = document.getElementById('additionalFields');
    
    if (!additionalFields) return;
    
    // 清空现有字段
    additionalFields.innerHTML = '';
    
    // 如果没有选择类型或该类型没有附加字段，直接返回
    if (!feedbackType || !additionalFieldsConfig[feedbackType]) {
        return;
    }
    
    // 获取该类型的附加字段配置
    const fields = additionalFieldsConfig[feedbackType];
    
    // 创建附加字段
    fields.forEach(field => {
        const fieldGroup = document.createElement('div');
        fieldGroup.className = 'form-group';
        
        let fieldHTML = `
            <label for="${field.id}">${field.label} ${field.required ? '*' : ''}</label>
        `;
        
        if (field.type === 'select') {
            fieldHTML += `
                <select id="${field.id}" class="form-select" ${field.required ? 'required' : ''}>
                    ${field.options.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('')}
                </select>
            `;
        } else if (field.type === 'textarea') {
            fieldHTML += `
                <textarea id="${field.id}" class="form-textarea" rows="${field.rows || 3}" 
                          placeholder="${field.placeholder || ''}" 
                          ${field.required ? 'required' : ''}></textarea>
            `;
        }
        
        fieldGroup.innerHTML = fieldHTML;
        additionalFields.appendChild(fieldGroup);
    });
}

function formatText(formatType) {
    const textarea = document.getElementById('feedbackDescription');
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    let formattedText = '';
    
    switch (formatType) {
        case 'bold':
            formattedText = `**${selectedText}**`;
            break;
        case 'italic':
            formattedText = `*${selectedText}*`;
            break;
        case 'list':
            formattedText = selectedText.split('\n').map(line => `- ${line}`).join('\n');
            break;
        case 'code':
            formattedText = `\`${selectedText}\``;
            break;
        default:
            return;
    }
    
    // 替换选中的文本
    textarea.value = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end);
    
    // 更新字符计数
    updateCharCount();
    
    // 恢复光标位置
    textarea.focus();
    textarea.setSelectionRange(start + formattedText.length, start + formattedText.length);
}

function submitFeedback() {
    const form = document.getElementById('feedbackForm');
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        showToast('请填写所有必填字段', 'error');
        return;
    }
    
    // 收集表单数据
    const formData = {
        type: document.getElementById('feedbackType').value,
        priority: document.getElementById('feedbackPriority').value,
        title: document.getElementById('feedbackTitle').value,
        description: document.getElementById('feedbackDescription').value,
        contactName: document.getElementById('contactName').value,
        contactEmail: document.getElementById('contactEmail').value,
        contactPhone: document.getElementById('contactPhone').value,
        responsePreferences: Array.from(document.querySelectorAll('input[name="responsePref"]:checked')).map(cb => cb.value),
        files: uploadedFiles,
        submittedAt: new Date().toISOString()
    };
    
    // 收集附加字段数据
    const feedbackType = formData.type;
    if (additionalFieldsConfig[feedbackType]) {
        additionalFieldsConfig[feedbackType].forEach(field => {
            const element = document.getElementById(field.id);
            if (element) {
                formData[field.id] = element.value;
            }
        });
    }
    
    // 模拟提交到服务器
    console.log('提交反馈数据:', formData);
    
    // 显示成功消息
    showToast('反馈已提交成功！我们会在1-3个工作日内回复您。', 'success');
    
    // 生成跟踪编号
    const trackingNumber = 'FB-' + Date.now().toString().substr(-8);
    
    // 显示状态跟踪区域
    showStatusSection(trackingNumber);
    
    // 重置表单
    resetForm();
    
    // 清空上传文件列表
    uploadedFiles = [];
    updateFileList();
    
    // 保存到历史记录（模拟）
    saveToHistory(formData, trackingNumber);
}

function resetForm() {
    const form = document.getElementById('feedbackForm');
    if (form) {
        form.reset();
        form.classList.remove('was-validated');
        
        // 重置附加字段区域
        const additionalFields = document.getElementById('additionalFields');
        if (additionalFields) {
            additionalFields.innerHTML = '';
        }
        
        // 重置字符计数
        updateCharCount();
    }
}

function saveToHistory(formData, trackingNumber) {
    // 在实际应用中，这里会保存到数据库
    // 这里我们只是模拟保存到本地存储
    const feedbackHistory = JSON.parse(localStorage.getItem('feedback_history') || '[]');
    
    const newFeedback = {
        id: Date.now(),
        trackingNumber: trackingNumber,
        ...formData,
        status: 'pending',
        submittedDate: new Date().toLocaleString()
    };
    
    feedbackHistory.unshift(newFeedback);
    localStorage.setItem('feedback_history', JSON.stringify(feedbackHistory.slice(0, 50))); // 只保留最近的50条
    
    console.log('已保存到反馈历史:', newFeedback);
}

function saveDraft() {
    const form = document.getElementById('feedbackForm');
    if (!form) return;
    
    // 收集表单数据
    const draftData = {
        type: document.getElementById('feedbackType').value,
        priority: document.getElementById('feedbackPriority').value,
        title: document.getElementById('feedbackTitle').value,
        description: document.getElementById('feedbackDescription').value,
        contactName: document.getElementById('contactName').value,
        contactEmail: document.getElementById('contactEmail').value,
        contactPhone: document.getElementById('contactPhone').value,
        savedAt: new Date().toISOString()
    };
    
    // 保存到本地存储
    localStorage.setItem('feedback_draft', JSON.stringify(draftData));
    
    showToast('草稿已保存', 'success');
}

function loadDraft() {
    const draftData = JSON.parse(localStorage.getItem('feedback_draft'));
    if (!draftData) {
        showToast('没有找到保存的草稿', 'info');
        return;
    }
    
    // 填充表单 - 如果草稿中没有值，就保持为空
    document.getElementById('feedbackType').value = draftData.type || '';
    document.getElementById('feedbackPriority').value = draftData.priority || '';
    document.getElementById('feedbackTitle').value = draftData.title || '';
    document.getElementById('feedbackDescription').value = draftData.description || '';
    document.getElementById('contactName').value = draftData.contactName || '';
    document.getElementById('contactEmail').value = draftData.contactEmail || '';
    document.getElementById('contactPhone').value = draftData.contactPhone || '';
    
    // 更新附加字段
    updateFormFields();
    
    // 更新字符计数
    updateCharCount();
    
    showToast('草稿已加载', 'success');
}

function previewFeedback() {
    const form = document.getElementById('feedbackForm');
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        showToast('请先填写所有必填字段', 'error');
        return;
    }
    
    // 收集预览数据
    const previewData = {
        type: document.getElementById('feedbackType').value,
        priority: document.getElementById('feedbackPriority').value,
        title: document.getElementById('feedbackTitle').value,
        description: document.getElementById('feedbackDescription').value,
        files: uploadedFiles.length
    };
    
    // 显示预览（在实际应用中，这里会打开一个预览弹窗）
    const previewMessage = `
        反馈类型: ${previewData.type}
        优先级: ${previewData.priority}
        标题: ${previewData.title}
        描述: ${previewData.description.substring(0, 100)}...
        附件数量: ${previewData.files}
    `;
    
    alert('反馈预览:\n\n' + previewMessage + '\n\n确认无误后请点击"提交反馈"按钮。');
}

function showStatusSection(trackingNumber) {
    const statusSection = document.getElementById('statusSection');
    if (statusSection) {
        statusSection.style.display = 'block';
        
        // 滚动到状态区域
        statusSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // 更新状态时间线
        updateStatusTimeline(trackingNumber);
    }
}

function updateStatusTimeline(trackingNumber) {
    const statusTimeline = document.getElementById('statusTimeline');
    if (!statusTimeline) return;
    
    // 模拟状态更新
    const now = new Date();
    const timelineData = [
        {
            time: now.toLocaleTimeString(),
            title: '反馈已提交',
            description: `您的反馈已成功提交，跟踪编号: ${trackingNumber}`,
            status: 'completed'
        },
        {
            time: '1-3个工作日内',
            title: '问题确认',
            description: '技术支持团队将确认您的问题并分配处理人员',
            status: 'pending'
        },
        {
            time: '3-5个工作日内',
            title: '问题处理',
            description: '技术团队将处理您反馈的问题或建议',
            status: 'pending'
        },
        {
            time: '处理完成后',
            title: '结果回复',
            description: '将通过您选择的联系方式回复处理结果',
            status: 'pending'
        }
    ];
    
    statusTimeline.innerHTML = '';
    
    timelineData.forEach(item => {
        const statusItem = document.createElement('div');
        statusItem.className = `status-item ${item.status}`;
        
        statusItem.innerHTML = `
            <div class="status-time">${item.time}</div>
            <div class="status-title">${item.title}</div>
            <div class="status-description">${item.description}</div>
        `;
        
        statusTimeline.appendChild(statusItem);
    });
}

function refreshStatus() {
    showToast('正在刷新状态...', 'info');
    
    // 模拟刷新状态
    setTimeout(() => {
        showToast('状态已刷新', 'success');
    }, 1000);
}

function contactSupport() {
    // 滚动到技术支持相关区域
    const supportChannel = document.querySelector('.channel-card:nth-child(1)');
    if (supportChannel) {
        supportChannel.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // 高亮技术支持通道
        supportChannel.style.animation = 'highlight 2s';
        setTimeout(() => {
            supportChannel.style.animation = '';
        }, 2000);
    }
}

function suggestFeature() {
    // 设置反馈类型为建议
    document.getElementById('feedbackType').value = 'suggestion';
    updateFormFields();
    
    // 滚动到表单
    const feedbackForm = document.querySelector('.feedback-form');
    if (feedbackForm) {
        feedbackForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function reportBug() {
    // 设置反馈类型为问题报告
    document.getElementById('feedbackType').value = 'bug';
    updateFormFields();
    
    // 滚动到表单
    const feedbackForm = document.querySelector('.feedback-form');
    if (feedbackForm) {
        feedbackForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function viewFeedbackHistory() {
    // 在实际应用中，这里会跳转到反馈历史页面或打开弹窗
    showToast('正在加载反馈历史...', 'info');
    
    setTimeout(() => {
        // 模拟加载历史记录
        const history = JSON.parse(localStorage.getItem('feedback_history') || '[]');
        const historyCount = history.length;
        
        if (historyCount === 0) {
            showToast('您还没有提交过反馈', 'info');
        } else {
            showToast(`您有 ${historyCount} 条历史反馈记录`, 'info');
        }
    }, 500);
}

function checkResponseStatus() {
    // 在实际应用中，这里会检查服务器上的反馈回复状态
    showToast('正在检查反馈回复状态...', 'info');
    
    setTimeout(() => {
        // 模拟检查结果
        const pendingCount = mockFeedbackHistory.filter(f => f.status === 'pending' || f.status === 'in-progress').length;
        
        if (pendingCount === 0) {
            showToast('所有反馈都已回复', 'success');
        } else {
            showToast(`您有 ${pendingCount} 条反馈待回复`, 'info');
        }
    }, 500);
}

function showToast(message, type = 'info') {
    if (window.notificationSystem) {
        window.notificationSystem.showToast(message, type);
    } else {
        alert(message);
    }
}

function logout() {
    if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('docim_user');
        window.location.href = 'index.html';
    }
}

// 添加高亮动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes highlight {
        0% { box-shadow: 0 0 0 0 rgba(52, 152, 219, 0.7); }
        70% { box-shadow: 0 0 0 10px rgba(52, 152, 219, 0); }
        100% { box-shadow: 0 0 0 0 rgba(52, 152, 219, 0); }
    }
`;
document.head.appendChild(style);