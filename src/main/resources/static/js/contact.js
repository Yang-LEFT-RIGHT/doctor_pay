// js/contact.js - 精简版，专注表单功能
(function() {
    'use strict';
    
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
            }
        ]
    };
    
    // 上传文件列表
    let uploadedFiles = [];
    
    // 公共API
    window.initContactPage = initContactPage;
    window.formatText = formatText;
    window.saveDraft = saveDraft;
    window.loadDraft = loadDraft;
    window.previewFeedback = previewFeedback;
    window.refreshStatus = refreshStatus;
    window.updateFormFields = updateFormFields;
    
    // 初始化联系反馈页面
    function initContactPage() {
        console.log('initContactPage - 初始化联系反馈功能');
        
        // 初始化复选框交互
        initCheckboxInteractions();
        
        // 初始化事件监听
        initEventListeners();
        
        // 初始化字符计数器
        initCharCounter();
        
        // 初始化文件上传区域
        initFileUpload();
        
        // 更新通知计数
        updateNotificationCount();
    }
    
    // 初始化复选框交互
    function initCheckboxInteractions() {
        const checkboxes = document.querySelectorAll('.checkbox-container');
        
        checkboxes.forEach(checkbox => {
            const input = checkbox.querySelector('input[type="checkbox"]');
            
            // 初始化状态
            if (input.checked) {
                checkbox.classList.add('checked');
            }
            
            // 点击复选框容器时切换状态
            checkbox.addEventListener('click', function(e) {
                if (e.target.tagName === 'INPUT') return;
                
                const input = this.querySelector('input[type="checkbox"]');
                input.checked = !input.checked;
                input.dispatchEvent(new Event('change'));
            });
            
            // 监听复选框状态变化
            input.addEventListener('change', function() {
                if (this.checked) {
                    checkbox.classList.add('checked');
                } else {
                    checkbox.classList.remove('checked');
                }
            });
        });
    }
    
    // 初始化事件监听
    function initEventListeners() {
        const feedbackForm = document.getElementById('feedbackForm');
        if (feedbackForm) {
            feedbackForm.addEventListener('submit', handleFormSubmit);
        }
        
        const feedbackTypeSelect = document.getElementById('feedbackType');
        if (feedbackTypeSelect) {
            feedbackTypeSelect.addEventListener('change', updateFormFields);
        }
        
        const descriptionTextarea = document.getElementById('feedbackDescription');
        if (descriptionTextarea) {
            descriptionTextarea.addEventListener('input', updateCharCount);
        }
    }
    
    // 处理表单提交
    function handleFormSubmit(e) {
        e.preventDefault();
        
        const form = document.getElementById('feedbackForm');
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            showToast('请填写所有必填字段', 'error');
            return;
        }
        
        submitFeedback();
    }
    
    // 提交反馈
    function submitFeedback() {
        // 收集表单数据
        const formData = collectFormData();
        
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
    
    // 收集表单数据
    function collectFormData() {
        return {
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
    }
    
    // 显示状态跟踪区域
    function showStatusSection(trackingNumber) {
        const statusSection = document.getElementById('statusSection');
        if (statusSection) {
            statusSection.style.display = 'block';
            statusSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            updateStatusTimeline(trackingNumber);
        }
    }
    
    // 更新状态时间线
    function updateStatusTimeline(trackingNumber) {
        const statusTimeline = document.getElementById('statusTimeline');
        if (!statusTimeline) return;
        
        const now = new Date();
        const timelineData = [
            {
                time: now.toLocaleTimeString(),
                title: '反馈已提交',
                description: `您的反馈已成功提交，跟踪编号: ${trackingNumber}`,
                status: 'completed'
            }
        ];
        
        statusTimeline.innerHTML = timelineData.map(item => `
            <div class="status-item ${item.status}">
                <div class="status-time">${item.time}</div>
                <div class="status-title">${item.title}</div>
                <div class="status-description">${item.description}</div>
            </div>
        `).join('');
    }
    
    // 保存到历史记录
    function saveToHistory(formData, trackingNumber) {
        const feedbackHistory = JSON.parse(localStorage.getItem('feedback_history') || '[]');
        const newFeedback = {
            id: Date.now(),
            trackingNumber: trackingNumber,
            ...formData,
            status: 'pending',
            submittedDate: new Date().toLocaleString()
        };
        
        feedbackHistory.unshift(newFeedback);
        localStorage.setItem('feedback_history', JSON.stringify(feedbackHistory.slice(0, 50)));
    }
    
    // 重置表单
    function resetForm() {
        const form = document.getElementById('feedbackForm');
        if (form) {
            form.reset();
            form.classList.remove('was-validated');
            
            const additionalFields = document.getElementById('additionalFields');
            if (additionalFields) {
                additionalFields.innerHTML = '';
            }
            
            updateCharCount();
        }
    }
    
    // 更新表单字段
    function updateFormFields() {
        const feedbackType = document.getElementById('feedbackType').value;
        const additionalFields = document.getElementById('additionalFields');
        
        if (!additionalFields) return;
        
        additionalFields.innerHTML = '';
        
        if (!feedbackType || !additionalFieldsConfig[feedbackType]) {
            return;
        }
        
        const fields = additionalFieldsConfig[feedbackType];
        
        fields.forEach(field => {
            const fieldGroup = document.createElement('div');
            fieldGroup.className = 'form-group';
            
            let fieldHTML = `<label for="${field.id}">${field.label} ${field.required ? '*' : ''}</label>`;
            
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
    
    // 格式化文本
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
        
        textarea.value = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end);
        updateCharCount();
        textarea.focus();
        textarea.setSelectionRange(start + formattedText.length, start + formattedText.length);
    }
    
    // 保存草稿
    function saveDraft() {
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
        
        localStorage.setItem('feedback_draft', JSON.stringify(draftData));
        showToast('草稿已保存', 'success');
    }
    
    // 加载草稿
    function loadDraft() {
        const draftData = JSON.parse(localStorage.getItem('feedback_draft'));
        if (!draftData) {
            showToast('没有找到保存的草稿', 'info');
            return;
        }
        
        document.getElementById('feedbackType').value = draftData.type || '';
        document.getElementById('feedbackPriority').value = draftData.priority || '';
        document.getElementById('feedbackTitle').value = draftData.title || '';
        document.getElementById('feedbackDescription').value = draftData.description || '';
        document.getElementById('contactName').value = draftData.contactName || '';
        document.getElementById('contactEmail').value = draftData.contactEmail || '';
        document.getElementById('contactPhone').value = draftData.contactPhone || '';
        
        updateFormFields();
        updateCharCount();
        showToast('草稿已加载', 'success');
    }
    
    // 预览反馈
    function previewFeedback() {
        const form = document.getElementById('feedbackForm');
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            showToast('请先填写所有必填字段', 'error');
            return;
        }
        
        const previewData = {
            type: document.getElementById('feedbackType').value,
            priority: document.getElementById('feedbackPriority').value,
            title: document.getElementById('feedbackTitle').value,
            description: document.getElementById('feedbackDescription').value,
            files: uploadedFiles.length
        };
        
        alert(`反馈预览:
            
反馈类型: ${previewData.type}
优先级: ${previewData.priority}
标题: ${previewData.title}
描述: ${previewData.description.substring(0, 100)}...
附件数量: ${previewData.files}

确认无误后请点击"提交反馈"按钮。`);
    }
    
    // 刷新状态
    function refreshStatus() {
        showToast('正在刷新状态...', 'info');
        setTimeout(() => {
            showToast('状态已刷新', 'success');
        }, 1000);
    }
    
    // 初始化字符计数器
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
        
        if (count > maxLength * 0.9) {
            charCount.style.color = getCssVariableValue('--accent-color') || '#3498db';
        } else if (count > maxLength * 0.7) {
            charCount.style.color = '#f1c40f';
        } else {
            charCount.style.color = getCssVariableValue('--text-light') || '#7f8c8d';
        }
    }
    
    function getCssVariableValue(variableName) {
        return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
    }
    
    // 初始化文件上传区域
    function initFileUpload() {
        const uploadArea = document.getElementById('fileUploadArea');
        const fileInput = document.getElementById('attachments');
        
        if (!uploadArea || !fileInput) return;
        
        uploadArea.addEventListener('click', () => fileInput.click());
        
        // 拖放功能
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.style.borderColor = getCssVariableValue('--secondary-color') || '#3498db';
            this.style.backgroundColor = 'rgba(52, 152, 219, 0.1)';
        });
        
        uploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.style.borderColor = getCssVariableValue('--border-light') || '#ddd';
            this.style.backgroundColor = '';
        });
        
        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.style.borderColor = getCssVariableValue('--border-light') || '#ddd';
            this.style.backgroundColor = '';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFiles(files);
            }
        });
        
        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                handleFiles(fileInput.files);
            }
        });
    }
    
    // 处理文件
    function handleFiles(files) {
        const maxSize = 10 * 1024 * 1024;
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 
                             'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                             'text/plain', 'application/zip'];
        
        Array.from(files).forEach(file => {
            if (file.size > maxSize) {
                showToast(`文件 "${file.name}" 超过10MB限制`, 'error');
                return;
            }
            
            if (!allowedTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|gif|pdf|doc|docx|txt|zip|log)$/i)) {
                showToast(`不支持的文件类型: ${file.name}`, 'error');
                return;
            }
            
            uploadedFiles.push({
                id: Date.now() + Math.random(),
                file: file,
                name: file.name,
                size: formatFileSize(file.size),
                type: file.type,
                uploadedAt: new Date()
            });
        });
        
        updateFileList();
        fileInput.value = '';
    }
    
    // 更新文件列表
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
            fileItem.innerHTML = `
                <div class="file-info">
                    <div class="file-icon">
                        ${getFileIcon(file.type, file.name)}
                    </div>
                    <div class="file-details">
                        <h5>${file.name}</h5>
                        <span>${file.size} • ${file.uploadedAt.toLocaleDateString()}</span>
                    </div>
                </div>
                <div class="file-actions">
                    <button class="file-action-btn" onclick="contactjs_previewFile(${index})" title="预览">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="file-action-btn" onclick="contactjs_removeFile(${index})" title="删除">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            fileList.appendChild(fileItem);
        });
    }
    
    // 文件操作函数
    window.contactjs_removeFile = function(index) {
        if (index >= 0 && index < uploadedFiles.length) {
            uploadedFiles.splice(index, 1);
            updateFileList();
            showToast('文件已移除', 'success');
        }
    };
    
    window.contactjs_previewFile = function(index) {
        if (index >= 0 && index < uploadedFiles.length) {
            const file = uploadedFiles[index];
            if (file.type.startsWith('image/')) {
                showToast('正在打开图片预览...', 'info');
            } else if (file.type.includes('pdf')) {
                showToast('正在打开PDF预览...', 'info');
            } else {
                showToast(`文件类型 "${file.type}" 需要下载查看`, 'info');
            }
        }
    };
    
    // 辅助函数
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
    
    // 更新通知计数
    function updateNotificationCount() {
        if (window.notificationSystem) {
            const unreadCount = window.notificationSystem.notifications.filter(n => !n.read).length;
            const elements = [
                document.getElementById('notificationCount'),
                document.getElementById('sidebarNotificationCount')
            ];
            
            elements.forEach(element => {
                if (element) {
                    element.textContent = unreadCount;
                }
            });
        }
    }
    
    // 显示通知
    function showToast(message, type = 'info') {
        if (window.notificationSystem) {
            window.notificationSystem.showToast(message, type);
        } else {
            alert(message);
        }
    }
})();