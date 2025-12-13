// js/settings.js - 系统设置JavaScript

// 模拟的角色数据
const mockRoles = [
    {
        id: 1,
        name: '超级管理员',
        description: '拥有所有系统权限',
        taskManagement: true,
        studentManagement: true,
        statistics: true,
        systemSettings: true
    },
    {
        id: 2,
        name: '系统管理员',
        description: '管理日常任务和学生',
        taskManagement: true,
        studentManagement: true,
        statistics: true,
        systemSettings: false
    },
    {
        id: 3,
        name: '任务管理员',
        description: '仅管理任务相关功能',
        taskManagement: true,
        studentManagement: false,
        statistics: false,
        systemSettings: false
    },
    {
        id: 4,
        name: '查看者',
        description: '只能查看数据，不能修改',
        taskManagement: false,
        studentManagement: false,
        statistics: true,
        systemSettings: false
    }
];

// 模拟的系统设置数据
const defaultSettings = {
    general: {
        systemName: 'DocIM Stipend',
        timezone: 'Asia/Shanghai',
        dateFormat: 'YYYY-MM-DD',
        itemsPerPage: '20',
        autoSaveInterval: '5',
        taskConfirmDays: '7',
        taskReminderDays: '3',
        autoExpireTasks: true,
        maxTasksPerStudent: '5'
    },
    notifications: {
        notifyTasks: true,
        notifyStudents: true,
        notifyStipends: true,
        notifyReports: true,
        notifySystem: true,
        notifyInApp: true,
        notifyEmail: true,
        notifyImmediate: true,
        notifyFrequency: 'hourly',
        taskAssignTemplate: `尊敬的{student_name}博士：

您已被分配新的任务：{task_title}
截止时间：{deadline}
任务详情：{task_description}

请及时登录系统确认任务并开始工作。

系统管理员
{system_name}`,
        taskReminderTemplate: `尊敬的{student_name}博士：

提醒：您的任务"{task_title}"即将在{days_left}天后截止。
当前状态：{task_status}
请及时完成相关工作并提交成果。

如有疑问请联系系统管理员。

系统管理员
{system_name}`
    },
    permissions: {
        defaultStudentRole: 'student_standard',
        defaultAdminRole: 'admin_standard',
        permissionInheritance: true
    },
    advanced: {
        backupFrequency: 'weekly',
        dataRetention: '365',
        autoCleanData: true,
        exportFormat: 'csv',
        cacheTime: '3600',
        dataLoading: 'pagination',
        imageQuality: '80',
        enableGzip: true
    }
};

document.addEventListener('DOMContentLoaded', function() {
    console.log('系统设置页面加载完成');
    
    // 初始化通知系统
    if (!window.notificationSystem) {
        window.notificationSystem = new NotificationSystem();
    }
    
    // 加载设置数据
    loadSettings();
    
    // 加载角色数据
    loadRoles();
    
    // 更新通知计数
    updateNotificationCount();
    
    // 更新用户名
    updateUsername();
    
    // 绑定事件
    bindEvents();
    
    // 检查设置是否有未保存的更改
    checkForUnsavedChanges();
});

function updateNotificationCount() {
    if (window.notificationSystem) {
        const unreadCount = window.notificationSystem.notifications.filter(n => !n.read).length;
        document.getElementById('notificationCount').textContent = unreadCount;
        document.getElementById('sidebarNotificationCount').textContent = unreadCount;
    }
}

function updateUsername() {
    try {
        const userData = localStorage.getItem('docim_user');
        if (userData) {
            const user = JSON.parse(userData);
            const usernameElement = document.getElementById('username');
            if (usernameElement) {
                usernameElement.textContent = user.name + (user.role === 'admin' ? '教授' : '博士');
            }
        }
    } catch (error) {
        console.error('更新用户名失败:', error);
    }
}

function bindEvents() {
    // 监听所有设置输入框的变化
    document.querySelectorAll('.setting-input, .setting-select, .setting-textarea, .switch input[type="checkbox"]').forEach(element => {
        element.addEventListener('change', function() {
            markSettingsChanged();
        });
    });
    
    // 表单输入事件
    document.querySelectorAll('.setting-input, .setting-textarea').forEach(element => {
        element.addEventListener('input', function() {
            markSettingsChanged();
        });
    });
    
    // 切换选项卡
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            switchTab(tab);
        });
    });
    
    // 测试通知按钮
    document.querySelectorAll('.btn-secondary').forEach(btn => {
        if (btn.textContent.includes('测试通知')) {
            btn.addEventListener('click', testNotifications);
        }
    });
}

function loadSettings() {
    console.log('加载系统设置');
    
    try {
        // 从localStorage加载保存的设置
        const savedSettings = localStorage.getItem('docim_settings');
        let settings;
        
        if (savedSettings) {
            settings = JSON.parse(savedSettings);
            console.log('加载已保存的设置:', settings);
        } else {
            settings = defaultSettings;
            console.log('使用默认设置');
        }
        
        // 更新常规设置
        document.getElementById('systemName').value = settings.general.systemName || defaultSettings.general.systemName;
        document.getElementById('timezone').value = settings.general.timezone || defaultSettings.general.timezone;
        document.getElementById('dateFormat').value = settings.general.dateFormat || defaultSettings.general.dateFormat;
        document.getElementById('itemsPerPage').value = settings.general.itemsPerPage || defaultSettings.general.itemsPerPage;
        document.getElementById('autoSaveInterval').value = settings.general.autoSaveInterval || defaultSettings.general.autoSaveInterval;
        document.getElementById('taskConfirmDays').value = settings.general.taskConfirmDays || defaultSettings.general.taskConfirmDays;
        document.getElementById('taskReminderDays').value = settings.general.taskReminderDays || defaultSettings.general.taskReminderDays;
        document.getElementById('autoExpireTasks').checked = settings.general.autoExpireTasks !== undefined ? settings.general.autoExpireTasks : defaultSettings.general.autoExpireTasks;
        document.getElementById('maxTasksPerStudent').value = settings.general.maxTasksPerStudent || defaultSettings.general.maxTasksPerStudent;
        
        // 更新通知设置
        document.getElementById('notifyTasks').checked = settings.notifications.notifyTasks !== undefined ? settings.notifications.notifyTasks : defaultSettings.notifications.notifyTasks;
        document.getElementById('notifyStudents').checked = settings.notifications.notifyStudents !== undefined ? settings.notifications.notifyStudents : defaultSettings.notifications.notifyStudents;
        document.getElementById('notifyStipends').checked = settings.notifications.notifyStipends !== undefined ? settings.notifications.notifyStipends : defaultSettings.notifications.notifyStipends;
        document.getElementById('notifyReports').checked = settings.notifications.notifyReports !== undefined ? settings.notifications.notifyReports : defaultSettings.notifications.notifyReports;
        document.getElementById('notifySystem').checked = settings.notifications.notifySystem !== undefined ? settings.notifications.notifySystem : defaultSettings.notifications.notifySystem;
        document.getElementById('notifyInApp').checked = settings.notifications.notifyInApp !== undefined ? settings.notifications.notifyInApp : defaultSettings.notifications.notifyInApp;
        document.getElementById('notifyEmail').checked = settings.notifications.notifyEmail !== undefined ? settings.notifications.notifyEmail : defaultSettings.notifications.notifyEmail;
        document.getElementById('notifyImmediate').checked = settings.notifications.notifyImmediate !== undefined ? settings.notifications.notifyImmediate : defaultSettings.notifications.notifyImmediate;
        document.getElementById('notifyFrequency').value = settings.notifications.notifyFrequency || defaultSettings.notifications.notifyFrequency;
        document.getElementById('taskAssignTemplate').value = settings.notifications.taskAssignTemplate || defaultSettings.notifications.taskAssignTemplate;
        document.getElementById('taskReminderTemplate').value = settings.notifications.taskReminderTemplate || defaultSettings.notifications.taskReminderTemplate;
        
        // 更新权限设置
        document.getElementById('defaultStudentRole').value = settings.permissions.defaultStudentRole || defaultSettings.permissions.defaultStudentRole;
        document.getElementById('defaultAdminRole').value = settings.permissions.defaultAdminRole || defaultSettings.permissions.defaultAdminRole;
        document.getElementById('permissionInheritance').checked = settings.permissions.permissionInheritance !== undefined ? settings.permissions.permissionInheritance : defaultSettings.permissions.permissionInheritance;
        
        // 更新高级设置
        document.getElementById('backupFrequency').value = settings.advanced.backupFrequency || defaultSettings.advanced.backupFrequency;
        document.getElementById('dataRetention').value = settings.advanced.dataRetention || defaultSettings.advanced.dataRetention;
        document.getElementById('autoCleanData').checked = settings.advanced.autoCleanData !== undefined ? settings.advanced.autoCleanData : defaultSettings.advanced.autoCleanData;
        document.getElementById('exportFormat').value = settings.advanced.exportFormat || defaultSettings.advanced.exportFormat;
        document.getElementById('cacheTime').value = settings.advanced.cacheTime || defaultSettings.advanced.cacheTime;
        document.getElementById('dataLoading').value = settings.advanced.dataLoading || defaultSettings.advanced.dataLoading;
        document.getElementById('imageQuality').value = settings.advanced.imageQuality || defaultSettings.advanced.imageQuality;
        document.getElementById('enableGzip').checked = settings.advanced.enableGzip !== undefined ? settings.advanced.enableGzip : defaultSettings.advanced.enableGzip;
        
        // 重置未保存更改标记
        localStorage.removeItem('docim_settings_changed');
        
    } catch (error) {
        console.error('加载设置时出错:', error);
        showToast('加载设置失败，使用默认设置', 'error');
    }
}

function loadRoles() {
    const rolesTable = document.getElementById('rolesTable');
    if (!rolesTable) return;
    
    rolesTable.innerHTML = '';
    
    mockRoles.forEach(role => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>
                <strong>${role.name}</strong>
            </td>
            <td>${role.description}</td>
            <td>
                <span class="permission-badge ${role.taskManagement ? 'active' : 'inactive'}">
                    ${role.taskManagement ? '✓ 允许' : '✗ 禁止'}
                </span>
            </td>
            <td>
                <span class="permission-badge ${role.studentManagement ? 'active' : 'inactive'}">
                    ${role.studentManagement ? '✓ 允许' : '✗ 禁止'}
                </span>
            </td>
            <td>
                <span class="permission-badge ${role.statistics ? 'active' : 'inactive'}">
                    ${role.statistics ? '✓ 允许' : '✗ 禁止'}
                </span>
            </td>
            <td>
                <span class="permission-badge ${role.systemSettings ? 'active' : 'inactive'}">
                    ${role.systemSettings ? '✓ 允许' : '✗ 禁止'}
                </span>
            </td>
            <td>
                <div class="table-actions">
                    <button class="btn-icon" onclick="editRole(${role.id})" title="编辑">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" onclick="deleteRole(${role.id})" title="删除">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        rolesTable.appendChild(row);
    });
}

function switchTab(tabName) {
    // 移除所有选项卡的激活状态
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // 激活选中的选项卡
    document.querySelector(`.tab-btn[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

function markSettingsChanged() {
    localStorage.setItem('docim_settings_changed', 'true');
}

function checkForUnsavedChanges() {
    const hasChanges = localStorage.getItem('docim_settings_changed') === 'true';
    
    window.addEventListener('beforeunload', function(e) {
        if (hasChanges) {
            e.preventDefault();
            e.returnValue = '您有未保存的设置更改，确定要离开吗？';
        }
    });
}

function saveSettings() {
    console.log('保存系统设置');
    
    try {
        const settings = {
            general: {
                systemName: document.getElementById('systemName').value,
                timezone: document.getElementById('timezone').value,
                dateFormat: document.getElementById('dateFormat').value,
                itemsPerPage: document.getElementById('itemsPerPage').value,
                autoSaveInterval: document.getElementById('autoSaveInterval').value,
                taskConfirmDays: document.getElementById('taskConfirmDays').value,
                taskReminderDays: document.getElementById('taskReminderDays').value,
                autoExpireTasks: document.getElementById('autoExpireTasks').checked,
                maxTasksPerStudent: document.getElementById('maxTasksPerStudent').value
            },
            notifications: {
                notifyTasks: document.getElementById('notifyTasks').checked,
                notifyStudents: document.getElementById('notifyStudents').checked,
                notifyStipends: document.getElementById('notifyStipends').checked,
                notifyReports: document.getElementById('notifyReports').checked,
                notifySystem: document.getElementById('notifySystem').checked,
                notifyInApp: document.getElementById('notifyInApp').checked,
                notifyEmail: document.getElementById('notifyEmail').checked,
                notifyImmediate: document.getElementById('notifyImmediate').checked,
                notifyFrequency: document.getElementById('notifyFrequency').value,
                taskAssignTemplate: document.getElementById('taskAssignTemplate').value,
                taskReminderTemplate: document.getElementById('taskReminderTemplate').value
            },
            permissions: {
                defaultStudentRole: document.getElementById('defaultStudentRole').value,
                defaultAdminRole: document.getElementById('defaultAdminRole').value,
                permissionInheritance: document.getElementById('permissionInheritance').checked
            },
            advanced: {
                backupFrequency: document.getElementById('backupFrequency').value,
                dataRetention: document.getElementById('dataRetention').value,
                autoCleanData: document.getElementById('autoCleanData').checked,
                exportFormat: document.getElementById('exportFormat').value,
                cacheTime: document.getElementById('cacheTime').value,
                dataLoading: document.getElementById('dataLoading').value,
                imageQuality: document.getElementById('imageQuality').value,
                enableGzip: document.getElementById('enableGzip').checked
            }
        };
        
        // 保存到localStorage
        localStorage.setItem('docim_settings', JSON.stringify(settings));
        
        // 清除未保存更改标记
        localStorage.removeItem('docim_settings_changed');
        
        // 更新系统名称（如果修改了）
        if (settings.general.systemName) {
            const logoElements = document.querySelectorAll('.logo span');
            logoElements.forEach(element => {
                if (element.textContent === 'DocIM') {
                    // 只更新后面的部分
                    const parent = element.parentElement;
                    parent.innerHTML = parent.innerHTML.replace(/DocIM Stipend/, `${element.textContent} Stipend`);
                }
            });
        }
        
        showToast('设置已保存成功', 'success');
        
        // 模拟保存到服务器的延迟
        setTimeout(() => {
            console.log('设置已保存到服务器');
        }, 1000);
        
    } catch (error) {
        console.error('保存设置时出错:', error);
        showToast('保存设置失败', 'error');
    }
}

function resetSettings() {
    if (confirm('确定要将所有设置恢复为默认值吗？当前设置将丢失。')) {
        localStorage.removeItem('docim_settings');
        localStorage.removeItem('docim_settings_changed');
        loadSettings();
        showToast('设置已恢复为默认值', 'success');
    }
}

function testNotifications() {
    if (window.notificationSystem) {
        const testNotification = {
            id: Date.now(),
            title: '测试通知',
            message: '这是一个测试通知，用于验证通知系统是否正常工作。',
            type: 'info',
            timestamp: new Date().toISOString(),
            read: false
        };
        
        window.notificationSystem.addNotification(testNotification);
        window.notificationSystem.showToast('测试通知已发送', 'success');
    }
}

function previewTemplate() {
    const template = document.getElementById('taskAssignTemplate').value;
    const previewWindow = window.open('', '_blank');
    
    if (previewWindow) {
        previewWindow.document.write(`
            <html>
            <head>
                <title>通知模板预览</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
                    .preview-container { max-width: 600px; margin: 0 auto; }
                    .template-content { background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; white-space: pre-wrap; }
                    .variables { background-color: #e8f4fc; padding: 15px; border-radius: 8px; margin: 20px 0; }
                </style>
            </head>
            <body>
                <div class="preview-container">
                    <h1>通知模板预览</h1>
                    <div class="variables">
                        <h3>可用变量：</h3>
                        <ul>
                            <li><strong>{student_name}</strong> - 博士生姓名</li>
                            <li><strong>{task_title}</strong> - 任务标题</li>
                            <li><strong>{deadline}</strong> - 截止时间</li>
                            <li><strong>{task_description}</strong> - 任务描述</li>
                            <li><strong>{days_left}</strong> - 剩余天数</li>
                            <li><strong>{task_status}</strong> - 任务状态</li>
                            <li><strong>{system_name}</strong> - 系统名称</li>
                        </ul>
                    </div>
                    <h3>模板内容：</h3>
                    <div class="template-content">${template}</div>
                    <button onclick="window.close()">关闭预览</button>
                </div>
            </body>
            </html>
        `);
        previewWindow.document.close();
    }
}

function addRole() {
    // 在实际应用中，这里会显示一个表单弹窗来添加新角色
    showToast('此功能尚未实现，请在完整版本中使用', 'info');
}

function editRole(roleId) {
    const role = mockRoles.find(r => r.id === roleId);
    if (role) {
        showToast(`编辑角色：${role.name}`, 'info');
        // 在实际应用中，这里会显示编辑表单
    }
}

function deleteRole(roleId) {
    const role = mockRoles.find(r => r.id === roleId);
    if (role && confirm(`确定要删除角色"${role.name}"吗？`)) {
        showToast(`角色"${role.name}"已删除`, 'success');
        // 在实际应用中，这里会从服务器删除角色
    }
}

function clearCache() {
    if (confirm('确定要清除所有缓存吗？这可能暂时影响系统性能。')) {
        showToast('正在清除缓存...', 'info');
        
        // 模拟清除缓存的过程
        setTimeout(() => {
            localStorage.removeItem('docim_cache');
            showToast('缓存已清除', 'success');
        }, 1500);
    }
}

function rebuildIndexes() {
    if (confirm('确定要重建数据库索引吗？这可能需要几分钟时间。')) {
        showToast('正在重建数据库索引...', 'info');
        
        // 模拟重建索引的过程
        setTimeout(() => {
            showToast('数据库索引已重建完成', 'success');
        }, 3000);
    }
}

function confirmReset() {
    if (confirm('⚠️ 警告：这将重置所有系统配置为出厂默认值，所有自定义设置将丢失。确定要继续吗？')) {
        showToast('正在重置系统配置...', 'warning');
        
        // 模拟重置过程
        setTimeout(() => {
            localStorage.clear();
            showToast('系统配置已重置，页面将重新加载', 'success');
            
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }, 2000);
    }
}

function checkUpdates() {
    showToast('正在检查更新...', 'info');
    
    // 模拟检查更新的过程
    setTimeout(() => {
        showToast('您的系统已经是最新版本 (v2.1.0)', 'success');
    }, 2000);
}

function viewLogs() {
    showToast('正在加载系统日志...', 'info');
    
    // 在实际应用中，这里会跳转到日志页面或显示日志弹窗
    setTimeout(() => {
        const logWindow = window.open('', '_blank');
        if (logWindow) {
            logWindow.document.write(`
                <html>
                <head>
                    <title>系统日志</title>
                    <style>
                        body { font-family: monospace; padding: 20px; background-color: #1e1e1e; color: #d4d4d4; }
                        .log-entry { margin-bottom: 10px; }
                        .log-time { color: #569cd6; }
                        .log-level-info { color: #b5cea8; }
                        .log-level-warning { color: #ce9178; }
                        .log-level-error { color: #f44747; }
                    </style>
                </head>
                <body>
                    <h1>系统日志</h1>
                    <div id="log-content">
                        <div class="log-entry"><span class="log-time">2024-03-15 10:30:25</span> <span class="log-level-info">[INFO]</span> 系统启动完成</div>
                        <div class="log-entry"><span class="log-time">2024-03-15 10:35:42</span> <span class="log-level-info">[INFO]</span> 用户登录：李老师</div>
                        <div class="log-entry"><span class="log-time">2024-03-15 11:20:15</span> <span class="log-level-info">[INFO]</span> 新任务发布：计算机视觉助教</div>
                        <div class="log-entry"><span class="log-time">2024-03-15 14:05:33</span> <span class="log-level-warning">[WARNING]</span> 数据库连接延迟较高</div>
                        <div class="log-entry"><span class="log-time">2024-03-15 16:45:18</span> <span class="log-level-info">[INFO]</span> 系统备份完成</div>
                        <div class="log-entry"><span class="log-time">2024-03-16 09:15:22</span> <span class="log-level-info">[INFO]</span> 系统设置已更新</div>
                    </div>
                    <button onclick="window.close()" style="margin-top: 20px; padding: 10px 20px;">关闭</button>
                </body>
                </html>
            `);
            logWindow.document.close();
        }
    }, 1000);
}

function exportSystemInfo() {
    showToast('正在导出系统信息...', 'info');
    
    // 模拟导出过程
    setTimeout(() => {
        const systemInfo = {
            systemName: document.getElementById('systemName').value,
            version: 'v2.1.0',
            exportTime: new Date().toISOString(),
            settings: {
                general: {
                    timezone: document.getElementById('timezone').value,
                    dateFormat: document.getElementById('dateFormat').value,
                    itemsPerPage: document.getElementById('itemsPerPage').value
                },
                notifications: {
                    enabledTypes: {
                        tasks: document.getElementById('notifyTasks').checked,
                        students: document.getElementById('notifyStudents').checked,
                        stipends: document.getElementById('notifyStipends').checked
                    }
                },
                permissions: {
                    defaultStudentRole: document.getElementById('defaultStudentRole').value,
                    defaultAdminRole: document.getElementById('defaultAdminRole').value
                }
            }
        };
        
        const dataStr = JSON.stringify(systemInfo, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `system-info-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        showToast('系统信息已导出', 'success');
    }, 1500);
}

function showToast(message, type = 'info') {
    if (window.notificationSystem) {
        window.notificationSystem.showToast(message, type);
    } else {
        // 简单的后备通知
        alert(message);
    }
}

function logout() {
    if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('docim_user');
        window.location.href = 'index.html';
    }
}