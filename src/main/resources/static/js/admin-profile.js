// js/admin-profile.js - 个人信息页面JavaScript

// 模拟的用户数据
const mockUserData = {
    id: 1,
    name: "李建国",
    englishName: "Li Jianguo",
    displayName: "李教授",
    gender: "male",
    birthdate: "1978-05-12",
    idNumber: "110101197805120012",
    nationality: "中国",
    role: "admin",
    title: "教授",
    position: "博士生导师",
    
    // 联系信息
    workEmail: "li.jianguo@docim.edu.cn",
    personalEmail: "jianguo.li@example.com",
    workPhone: "+86 10 6275-1234",
    mobile: "+86 138-0013-8000",
    officeAddress: "北京市海淀区清华大学计算机系，东主楼10-308室",
    
    // 工作信息
    employeeId: "DOCIM-2021-001",
    department: "计算机科学与技术学院",
    joinDate: "2021-03-15",
    contractEnd: "2026-03-14",
    
    // 学术信息
    academicDegree: "博士",
    academicUniversity: "清华大学",
    academicMajor: "计算机科学与技术",
    academicResearch: "人工智能、机器学习、计算机视觉",
    academicBio: "李建国教授，博士生导师，主要从事人工智能和机器学习方向的研究。在国内外重要学术期刊和会议上发表论文50余篇，主持国家自然科学基金项目3项。曾获教育部科技进步一等奖。",
    
    // 紧急联系人
    emergencyName: "张敏",
    emergencyRelationship: "配偶",
    emergencyPhone: "+86 138-0013-8001",
    
    // 统计信息
    stats: {
        taskCount: 24,
        studentCount: 15,
        activeCount: 8
    },
    
    // 安全状态
    security: {
        passwordStrength: "强",
        lastPasswordChange: "90天前",
        twoFactorEnabled: true
    },
    
    // 偏好设置
    preferences: {
        theme: "light",
        language: "zh-CN",
        layout: "compact",
        tableDensity: "normal",
        notifyTasks: true,
        notifySystem: true,
        notifyEmail: true,
        soundNotify: true,
        autoSave: "5",
        exportFormat: "excel",
        pageSize: "20"
    }
};

// 模拟的活动记录
const mockActivities = [
    {
        id: 1,
        icon: "fas fa-tasks",
        title: "发布了新任务",
        description: "发布了《计算机视觉》课程助教任务",
        time: "2024-03-15 14:30",
        color: "secondary"
    },
    {
        id: 2,
        icon: "fas fa-user-check",
        title: "确认了任务完成",
        description: "确认了张三博士的《机器学习》作业批改任务",
        time: "2024-03-15 11:20",
        color: "success"
    },
    {
        id: 3,
        icon: "fas fa-user-plus",
        title: "添加了新博士生",
        description: "添加了王明博士到系统",
        time: "2024-03-14 16:45",
        color: "info"
    },
    {
        id: 4,
        icon: "fas fa-chart-bar",
        title: "生成了统计报告",
        description: "生成了2024年第一季度的任务统计报告",
        time: "2024-03-14 10:15",
        color: "accent"
    },
    {
        id: 5,
        icon: "fas fa-cog",
        title: "更新了系统设置",
        description: "修改了通知设置和任务确认时间",
        time: "2024-03-13 15:30",
        color: "warning"
    },
    {
        id: 6,
        icon: "fas fa-money-check-alt",
        title: "审核了津贴申请",
        description: "审核并通过了李四博士的津贴申请",
        time: "2024-03-13 09:45",
        color: "success"
    }
];

// 模拟的登录历史
const mockLoginHistory = [
    {
        id: 1,
        time: "2024-03-15 10:30:25",
        ip: "192.168.1.100",
        device: "Chrome (Windows 11)",
        status: "成功"
    },
    {
        id: 2,
        time: "2024-03-14 09:15:42",
        ip: "192.168.1.100",
        device: "Chrome (Windows 11)",
        status: "成功"
    },
    {
        id: 3,
        time: "2024-03-13 14:20:18",
        ip: "10.0.0.50",
        device: "Firefox (Mac OS)",
        status: "成功"
    },
    {
        id: 4,
        time: "2024-03-12 08:45:33",
        ip: "192.168.1.100",
        device: "Chrome (Windows 11)",
        status: "成功"
    },
    {
        id: 5,
        time: "2024-03-11 16:10:55",
        ip: "10.0.0.50",
        device: "Safari (iPhone)",
        status: "成功"
    },
    {
        id: 6,
        time: "2024-03-10 11:25:40",
        ip: "192.168.1.100",
        device: "Chrome (Windows 11)",
        status: "失败"
    }
];

document.addEventListener('DOMContentLoaded', function() {
    console.log('个人信息页面加载完成');
    
    // 初始化通知系统
    if (!window.notificationSystem) {
        window.notificationSystem = new NotificationSystem();
    }
    
    // 加载用户数据
    loadUserData();
    
    // 加载活动记录
    loadActivities();
    
    // 加载登录历史
    loadLoginHistory();
    
    // 更新通知计数
    updateNotificationCount();
    
    // 绑定事件
    bindEvents();
});

function updateNotificationCount() {
    if (window.notificationSystem) {
        const unreadCount = window.notificationSystem.notifications.filter(n => !n.read).length;
        document.getElementById('notificationCount').textContent = unreadCount;
        document.getElementById('sidebarNotificationCount').textContent = unreadCount;
    }
}

function bindEvents() {
    // 头像上传
    const avatarInput = document.getElementById('avatarInput');
    if (avatarInput) {
        avatarInput.addEventListener('change', handleAvatarUpload);
    }
    
    // 选项卡切换
    document.querySelectorAll('.profile-tabs .tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            switchProfileTab(tab);
        });
    });
    
    // 偏好设置变化监听
    document.querySelectorAll('#preferences-tab .preference-select, #preferences-tab .switch input').forEach(element => {
        element.addEventListener('change', function() {
            markPreferencesChanged();
        });
    });
}

function loadUserData() {
    console.log('加载用户数据');
    
    try {
        // 从localStorage加载用户数据
        const savedUserData = localStorage.getItem('docim_user_data');
        let userData;
        
        if (savedUserData) {
            userData = JSON.parse(savedUserData);
            console.log('加载已保存的用户数据');
        } else {
            userData = mockUserData;
            // 保存到localStorage供后续使用
            localStorage.setItem('docim_user_data', JSON.stringify(userData));
        }
        
        // 更新页面显示
        updateUserProfile(userData);
        
        // 更新全局用户名
        const usernameElement = document.getElementById('username');
        if (usernameElement) {
            usernameElement.textContent = userData.displayName || userData.name;
        }
        
    } catch (error) {
        console.error('加载用户数据时出错:', error);
        showToast('加载用户数据失败', 'error');
    }
}

function updateUserProfile(userData) {
    // 更新个人信息卡片
    document.getElementById('displayName').textContent = userData.displayName;
    document.getElementById('taskCount').textContent = userData.stats.taskCount;
    document.getElementById('studentCount').textContent = userData.stats.studentCount;
    document.getElementById('activeCount').textContent = userData.stats.activeCount;
    document.getElementById('profileEmail').textContent = userData.workEmail;
    document.getElementById('profilePhone').textContent = userData.mobile;
    document.getElementById('profileDepartment').textContent = userData.department;
    document.getElementById('profileJoinDate').textContent = userData.joinDate;
    
    // 更新个人信息选项卡
    document.getElementById('infoName').textContent = userData.name;
    document.getElementById('infoEnglishName').textContent = userData.englishName;
    document.getElementById('infoGender').textContent = userData.gender === 'male' ? '男' : '女';
    document.getElementById('infoBirthdate').textContent = userData.birthdate;
    document.getElementById('infoIdNumber').textContent = userData.idNumber ? userData.idNumber.substring(0, 4) + '**********' + userData.idNumber.substring(14) : '';
    document.getElementById('infoNationality').textContent = userData.nationality;
    
    document.getElementById('contactWorkEmail').textContent = userData.workEmail;
    document.getElementById('contactPersonalEmail').textContent = userData.personalEmail;
    document.getElementById('contactWorkPhone').textContent = userData.workPhone;
    document.getElementById('contactMobile').textContent = userData.mobile;
    document.getElementById('contactOfficeAddress').textContent = userData.officeAddress;
    
    document.getElementById('emergencyName').textContent = userData.emergencyName;
    document.getElementById('emergencyRelationship').textContent = userData.emergencyRelationship;
    document.getElementById('emergencyPhone').textContent = userData.emergencyPhone;
    
    // 更新工作信息选项卡
    document.getElementById('workEmployeeId').textContent = userData.employeeId;
    document.getElementById('workDepartment').textContent = userData.department;
    document.getElementById('workTitle').textContent = userData.title;
    document.getElementById('workPosition').textContent = userData.position;
    document.getElementById('workJoinDate').textContent = userData.joinDate;
    document.getElementById('workContractEnd').textContent = userData.contractEnd;
    
    document.getElementById('academicDegree').textContent = userData.academicDegree;
    document.getElementById('academicUniversity').textContent = userData.academicUniversity;
    document.getElementById('academicMajor').textContent = userData.academicMajor;
    document.getElementById('academicResearch').textContent = userData.academicResearch;
    document.getElementById('academicBio').textContent = userData.academicBio;
    
    // 更新偏好设置选项卡
    document.getElementById('prefTheme').value = userData.preferences.theme;
    document.getElementById('prefLanguage').value = userData.preferences.language;
    document.getElementById('prefLayout').value = userData.preferences.layout;
    document.getElementById('prefTableDensity').value = userData.preferences.tableDensity;
    document.getElementById('prefNotifyTasks').checked = userData.preferences.notifyTasks;
    document.getElementById('prefNotifySystem').checked = userData.preferences.notifySystem;
    document.getElementById('prefNotifyEmail').checked = userData.preferences.notifyEmail;
    document.getElementById('prefSoundNotify').checked = userData.preferences.soundNotify;
    document.getElementById('prefAutoSave').value = userData.preferences.autoSave;
    document.getElementById('prefExportFormat').value = userData.preferences.exportFormat;
    document.getElementById('prefPageSize').value = userData.preferences.pageSize;
    
    // 重置偏好设置更改标记
    localStorage.removeItem('docim_preferences_changed');
}

function loadActivities() {
    const activityList = document.getElementById('activityList');
    if (!activityList) return;
    
    activityList.innerHTML = '';
    
    mockActivities.forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        
        const colorClass = getColorClass(activity.color);
        
        activityItem.innerHTML = `
            <div class="activity-icon ${colorClass}">
                <i class="${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-desc">${activity.description}</div>
                <div class="activity-time">
                    <i class="far fa-clock"></i> ${activity.time}
                </div>
            </div>
        `;
        
        activityList.appendChild(activityItem);
    });
}

function loadLoginHistory() {
    const loginHistoryTable = document.getElementById('loginHistoryTable');
    if (!loginHistoryTable) return;
    
    loginHistoryTable.innerHTML = '';
    
    mockLoginHistory.forEach(login => {
        const row = document.createElement('tr');
        
        const statusClass = login.status === '成功' ? 'success' : 'error';
        
        row.innerHTML = `
            <td>${login.time}</td>
            <td>${login.ip}</td>
            <td>${login.device}</td>
            <td>
                <span class="status-badge ${statusClass}">
                    ${login.status}
                </span>
            </td>
        `;
        
        loginHistoryTable.appendChild(row);
    });
}

function getColorClass(color) {
    const colorMap = {
        'secondary': 'bg-secondary',
        'success': 'bg-success',
        'info': 'bg-info',
        'warning': 'bg-warning',
        'accent': 'bg-accent'
    };
    
    return colorMap[color] || 'bg-secondary';
}

function switchProfileTab(tabName) {
    // 移除所有选项卡的激活状态
    document.querySelectorAll('.profile-tabs .tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.querySelectorAll('.profile-tabs .tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // 激活选中的选项卡
    const tabBtn = document.querySelector(`.profile-tabs .tab-btn[data-tab="${tabName}"]`);
    const tabContent = document.getElementById(`${tabName}-tab`);
    
    if (tabBtn && tabContent) {
        tabBtn.classList.add('active');
        tabContent.classList.add('active');
    }
}

function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
        showToast('请选择图片文件', 'error');
        return;
    }
    
    // 检查文件大小 (限制为2MB)
    if (file.size > 2 * 1024 * 1024) {
        showToast('图片大小不能超过2MB', 'error');
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const avatarImage = document.getElementById('avatarImage');
        const avatarPlaceholder = document.getElementById('avatarPlaceholder');
        
        if (avatarImage && avatarPlaceholder) {
            avatarImage.src = e.target.result;
            avatarImage.style.display = 'block';
            avatarPlaceholder.style.display = 'none';
            
            // 保存到localStorage
            localStorage.setItem('docim_user_avatar', e.target.result);
            
            showToast('头像上传成功', 'success');
        }
    };
    
    reader.onerror = function() {
        showToast('头像上传失败', 'error');
    };
    
    reader.readAsDataURL(file);
}

function refreshProfile() {
    console.log('刷新个人资料');
    
    // 从localStorage重新加载数据
    loadUserData();
    loadActivities();
    loadLoginHistory();
    
    showToast('个人资料已刷新', 'success');
}

function openEditProfile() {
    console.log('打开编辑个人资料弹窗');
    
    // 从localStorage加载当前用户数据
    let userData;
    try {
        const savedUserData = localStorage.getItem('docim_user_data');
        userData = savedUserData ? JSON.parse(savedUserData) : mockUserData;
    } catch (error) {
        userData = mockUserData;
    }
    
    // 填充表单
    document.getElementById('editName').value = userData.name || '';
    document.getElementById('editEnglishName').value = userData.englishName || '';
    document.getElementById('editGender').value = userData.gender || 'male';
    document.getElementById('editBirthdate').value = userData.birthdate || '';
    document.getElementById('editWorkEmail').value = userData.workEmail || '';
    document.getElementById('editPersonalEmail').value = userData.personalEmail || '';
    document.getElementById('editWorkPhone').value = userData.workPhone || '';
    document.getElementById('editMobile').value = userData.mobile || '';
    document.getElementById('editOfficeAddress').value = userData.officeAddress || '';
    document.getElementById('editDepartment').value = userData.department || '';
    document.getElementById('editTitle').value = userData.title || '';
    document.getElementById('editPosition').value = userData.position || '';
    document.getElementById('editEmergencyName').value = userData.emergencyName || '';
    document.getElementById('editEmergencyRelationship').value = userData.emergencyRelationship || '';
    document.getElementById('editEmergencyPhone').value = userData.emergencyPhone || '';
    
    // 显示模态框
    const modal = document.getElementById('editProfileModal');
    if (modal) {
        modal.style.display = 'flex';
        
        // 禁用背景滚动
        document.body.style.overflow = 'hidden';
    }
}

function closeEditProfile() {
    console.log('关闭编辑个人资料弹窗');
    
    const modal = document.getElementById('editProfileModal');
    if (modal) {
        modal.style.display = 'none';
        
        // 恢复背景滚动
        document.body.style.overflow = '';
    }
    
    // 重置表单验证状态
    const form = document.getElementById('editProfileForm');
    if (form) {
        form.classList.remove('was-validated');
    }
}

function saveProfile() {
    console.log('保存个人资料更改');
    
    const form = document.getElementById('editProfileForm');
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        showToast('请填写所有必填字段', 'error');
        return;
    }
    
    try {
        // 从localStorage加载当前用户数据
        let userData;
        const savedUserData = localStorage.getItem('docim_user_data');
        userData = savedUserData ? JSON.parse(savedUserData) : mockUserData;
        
        // 更新用户数据
        userData.name = document.getElementById('editName').value;
        userData.englishName = document.getElementById('editEnglishName').value;
        userData.gender = document.getElementById('editGender').value;
        userData.birthdate = document.getElementById('editBirthdate').value;
        userData.workEmail = document.getElementById('editWorkEmail').value;
        userData.personalEmail = document.getElementById('editPersonalEmail').value;
        userData.workPhone = document.getElementById('editWorkPhone').value;
        userData.mobile = document.getElementById('editMobile').value;
        userData.officeAddress = document.getElementById('editOfficeAddress').value;
        userData.department = document.getElementById('editDepartment').value;
        userData.title = document.getElementById('editTitle').value;
        userData.position = document.getElementById('editPosition').value;
        userData.emergencyName = document.getElementById('editEmergencyName').value;
        userData.emergencyRelationship = document.getElementById('editEmergencyRelationship').value;
        userData.emergencyPhone = document.getElementById('editEmergencyPhone').value;
        
        // 更新显示名称
        userData.displayName = userData.name + (userData.title === '教授' ? '教授' : '老师');
        
        // 保存到localStorage
        localStorage.setItem('docim_user_data', JSON.stringify(userData));
        
        // 更新页面显示
        updateUserProfile(userData);
        
        // 更新全局用户名
        const usernameElement = document.getElementById('username');
        if (usernameElement) {
            usernameElement.textContent = userData.displayName;
        }
        
        // 关闭模态框
        closeEditProfile();
        
        showToast('个人资料已更新', 'success');
        
        // 记录活动
        addActivity('更新了个人资料', 'fas fa-user-edit', 'secondary');
        
    } catch (error) {
        console.error('保存个人资料时出错:', error);
        showToast('保存失败，请重试', 'error');
    }
}

function changePassword() {
    showToast('密码修改功能将在完整版本中提供', 'info');
    // 在实际应用中，这里会显示密码修改表单
}

function setup2FA() {
    showToast('双重验证设置功能将在完整版本中提供', 'info');
    // 在实际应用中，这里会显示2FA设置界面
}

function markPreferencesChanged() {
    localStorage.setItem('docim_preferences_changed', 'true');
}

function resetPreferences() {
    if (confirm('确定要恢复默认偏好设置吗？当前设置将丢失。')) {
        // 重置为默认偏好设置
        const userData = JSON.parse(localStorage.getItem('docim_user_data') || JSON.stringify(mockUserData));
        userData.preferences = mockUserData.preferences;
        
        localStorage.setItem('docim_user_data', JSON.stringify(userData));
        
        // 更新页面显示
        updateUserProfile(userData);
        
        showToast('偏好设置已恢复为默认值', 'success');
    }
}

function savePreferences() {
    console.log('保存偏好设置');
    
    try {
        // 从localStorage加载当前用户数据
        let userData;
        const savedUserData = localStorage.getItem('docim_user_data');
        userData = savedUserData ? JSON.parse(savedUserData) : mockUserData;
        
        // 更新偏好设置
        userData.preferences.theme = document.getElementById('prefTheme').value;
        userData.preferences.language = document.getElementById('prefLanguage').value;
        userData.preferences.layout = document.getElementById('prefLayout').value;
        userData.preferences.tableDensity = document.getElementById('prefTableDensity').value;
        userData.preferences.notifyTasks = document.getElementById('prefNotifyTasks').checked;
        userData.preferences.notifySystem = document.getElementById('prefNotifySystem').checked;
        userData.preferences.notifyEmail = document.getElementById('prefNotifyEmail').checked;
        userData.preferences.soundNotify = document.getElementById('prefSoundNotify').checked;
        userData.preferences.autoSave = document.getElementById('prefAutoSave').value;
        userData.preferences.exportFormat = document.getElementById('prefExportFormat').value;
        userData.preferences.pageSize = document.getElementById('prefPageSize').value;
        
        // 保存到localStorage
        localStorage.setItem('docim_user_data', JSON.stringify(userData));
        
        // 清除偏好设置更改标记
        localStorage.removeItem('docim_preferences_changed');
        
        // 应用主题设置
        if (userData.preferences.theme === 'dark') {
            document.body.classList.add('dark-theme');
        } else if (userData.preferences.theme === 'light') {
            document.body.classList.remove('dark-theme');
        }
        // auto模式需要检测系统偏好，这里简化处理
        
        showToast('偏好设置已保存', 'success');
        
        // 记录活动
        addActivity('更新了偏好设置', 'fas fa-sliders-h', 'warning');
        
    } catch (error) {
        console.error('保存偏好设置时出错:', error);
        showToast('保存失败，请重试', 'error');
    }
}

function refreshActivity() {
    console.log('刷新活动记录');
    
    // 模拟加载新的活动记录
    setTimeout(() => {
        loadActivities();
        loadLoginHistory();
        showToast('活动记录已刷新', 'success');
    }, 500);
}

function addActivity(title, icon, color) {
    // 创建新的活动记录
    const newActivity = {
        id: Date.now(),
        icon: icon,
        title: title,
        description: '通过个人信息页面操作',
        time: new Date().toLocaleString('zh-CN'),
        color: color
    };
    
    // 添加到活动列表开头
    mockActivities.unshift(newActivity);
    
    // 如果当前在活动记录选项卡，则更新显示
    const activityTab = document.getElementById('activity-tab');
    if (activityTab && activityTab.classList.contains('active')) {
        loadActivities();
    }
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

// 监听页面关闭前的偏好设置更改
window.addEventListener('beforeunload', function(e) {
    const hasChanges = localStorage.getItem('docim_preferences_changed') === 'true';
    
    if (hasChanges) {
        e.preventDefault();
        e.returnValue = '您有未保存的偏好设置更改，确定要离开吗？';
    }
});