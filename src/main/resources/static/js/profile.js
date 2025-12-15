// js/profile.js - 个人信息页面JavaScript
class ProfileManager {
    constructor() {
        this.userData = {
            gender: "male",
            stats: {
                totalTasks: 15,
                completedTasks: 12,
                activeTasks: 3,
                totalHours: 320
            }
        };
        
        this.formChanged = {
            basic: false,
            contact: false
        };
        
        this.init();
    }
    
    init() {
        console.log('ProfileManager 开始初始化...');
        
        try {
            // 检查登录状态
            if (!this.checkAuth()) {
                return;
            }
            
            // 绑定事件
            this.bindEvents();
            
            // 初始化标签页
            this.initTabs();
            
            // 初始化表单
            this.initForms();
            
            // 加载用户数据（在DOM完全初始化后）
            this.loadUserData();
            
            console.log('ProfileManager 初始化完成');
            
        } catch (error) {
            console.error('ProfileManager 初始化失败:', error);
            this.showError('页面初始化失败，请刷新重试');
        }
    }
    
    checkAuth() {
        try {
            const userData = localStorage.getItem('docim_user');
            if (!userData) {
                console.warn('用户未登录，跳转到登录页');
                window.location.href = 'index.html';
                return false;
            }
            
            return true;
            
        } catch (error) {
            console.error('认证检查失败:', error);
            return false;
        }
    }
    
    bindEvents() {
        console.log('绑定事件...');
        
        // 标签页切换
        document.querySelectorAll('.edit-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                this.switchTab(tab.dataset.tab);
            });
        });
    }
    
    loadUserData() {
        console.log('加载用户数据...');
        
        try {
            // 1. 重置为默认userData
        this.userData = {
            gender: "male",
            student_type: "招考",  // 默认培养类型为"招考"
            stats: {
                totalTasks: 15,
                completedTasks: 12,
                activeTasks: 3,
                totalHours: 320
            }
        };
            
            console.log('步骤1 - 默认userData:', this.userData);
            
            // 3. 从profile_data获取用户可能修改过的信息（次高优先级）
            const savedUser = localStorage.getItem('profile_data');
            if (savedUser) {
                const savedData = JSON.parse(savedUser);
                // 将保存的信息合并到userData（覆盖默认值）
                this.userData = {
                    ...this.userData,
                    ...savedData
                };
                console.log('步骤2 - 合并保存数据后:', this.userData);
            }
            
            // 2. 从docim_user获取登录时存储的用户信息（最高优先级）
            const loginUserData = localStorage.getItem('docim_user');
            if (loginUserData) {
                const loginData = JSON.parse(loginUserData);
                // 将登录信息合并到userData（覆盖默认值和保存数据）
                this.userData = {
                    ...this.userData,
                    ...loginData
                };
                console.log('步骤3 - 合并登录数据后:', this.userData);
                console.log('合并登录数据后，培养类型:', this.userData.student_type);
            }
            
            // 4. 更新基本信息显示
            this.updateProfileDisplay();
            
            // 5. 更新表单数据
            this.updateFormData();
            
            console.log('用户数据加载完成');
            
        } catch (error) {
            console.error('加载用户数据失败:', error);
            // 使用默认数据
            this.updateProfileDisplay();
            this.updateFormData();
        }
    }
    
    updateProfileDisplay() {
        // 更新头像
        const avatarElement = document.getElementById('user-avatar');
        if (avatarElement) {
            avatarElement.textContent = this.userData.name.charAt(0);
        }
        
        // 更新基本信息
        const elements = {
            'user-fullname': this.userData.name,
            'user-program-type': `博士研究生 - ${this.getProgramTypeName(this.userData.student_type)}`,
            'user-id': this.userData.student_id,
            'user-major': this.userData.major,
            'user-supervisor': this.userData.supervisor_id,
            'user-enrollment': this.formatEnrollmentDate(this.userData.enrollment_year),
            'user-email': this.userData.email
        };
        
        for (const [id, value] of Object.entries(elements)) {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        }
        
        // 更新统计信息
        // 确保stats对象存在，如果不存在则使用默认值
        const userStats = this.userData.stats || {
            totalTasks: 0,
            completedTasks: 0,
            activeTasks: 0,
            totalHours: 0
        };
        
        const stats = {
            'stat-tasks': userStats.totalTasks,
            'stat-completed': userStats.completedTasks,
            'stat-active': userStats.activeTasks,
            'stat-total-hours': userStats.totalHours
        };
        
        for (const [id, value] of Object.entries(stats)) {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        }
    }
    
    getProgramTypeName(key) {
        const types = {
            '招考': '招考',
            '直博': '直博',
            '申请-考核制': '申请-考核制'
        };
        return types[key] || key;
    }
    
    getDepartmentName(key) {
        const departments = {
            'computer': '计算机科学与技术学院',
            'mathematics': '数学科学学院',
            'physics': '物理学院',
            'chemistry': '化学与化工学院',
            'biology': '生命科学学院',
            'engineering': '工程学院',
            'management': '管理学院',
            'humanities': '人文学院',
            'law': '法学院',
            'medicine': '医学院'
        };
        return departments[key] || key;
    }
    
    formatEnrollmentDate(dateInput) {
        if (!dateInput) return '';
        
        try {
            // 如果是数字类型（如2023），则作为年份处理
            if (typeof dateInput === 'number') {
                return `${dateInput}年`;
            }
            
            // 如果是字符串类型（如"2023-09"），则分割年和月
            if (typeof dateInput === 'string') {
                const [year, month] = dateInput.split('-');
                if (year && month) {
                    return `${year}年${parseInt(month)}月`;
                } else if (year) {
                    return `${year}年`;
                }
            }
            
            // 默认处理：转换为字符串并返回
            return String(dateInput);
            
        } catch (error) {
            console.error('格式化入学日期失败:', error);
            return String(dateInput); // 出错时至少返回原始值
        }
    }
    
    updateFormData() {
        console.log('开始更新表单数据，当前userData:', this.userData);
        
        // 基础信息表单
        const nameInput = document.getElementById('input-name');
        const studentIdInput = document.getElementById('input-student-id');
        const programTypeInput = document.getElementById('input-program-type');
        const majorInput = document.getElementById('input-major');
        const supervisorInput = document.getElementById('input-supervisor');
        const enrollmentInput = document.getElementById('input-enrollment');
        
        if (nameInput) nameInput.value = this.userData.name || '';
        if (studentIdInput) studentIdInput.value = this.userData.student_id || this.userData.id || '';
        
        // 设置性别选择
        const genderInputs = document.querySelectorAll('input[name="gender"]');
        genderInputs.forEach(input => {
            input.checked = input.value === (this.userData.gender || 'male');
        });
        
        if (programTypeInput) {
            // 优先使用programType字段，因为它的值与选择框选项匹配
            // 同时兼容student_type字段，确保向后兼容
            const programTypeValue = this.userData.programType || this.userData.student_type || '招考';
            // 确保值在选择框选项中存在
            const validOptions = Array.from(programTypeInput.options).map(option => option.value);
            programTypeInput.value = validOptions.includes(programTypeValue) ? programTypeValue : '招考';
            console.log('设置培养方案选择框值为:', programTypeInput.value);
        }
        if (majorInput) majorInput.value = this.userData.major || '';
        if (supervisorInput) supervisorInput.value = this.userData.supervisor_id || this.userData.supervisor || '';
        if (enrollmentInput) enrollmentInput.value = this.userData.enrollment_year ? 
            `${this.userData.enrollment_year}` : (this.userData.enrollment || '');
        
        // 联系信息表单
        const phoneInput = document.getElementById('input-phone');
        const emailInput = document.getElementById('input-email');
        const wechatInput = document.getElementById('input-wechat');
        
        if (phoneInput) phoneInput.value = this.userData.phone || '';
        if (emailInput) emailInput.value = this.userData.email || '';
        if (wechatInput) wechatInput.value = this.userData.wechat_id || this.userData.wechat || '';
        
        console.log('表单数据更新完成');
        
        // 重置表单变化状态
        this.formChanged.basic = false;
        this.formChanged.contact = false;
        this.updateSaveButtons();
    }
    
    initTabs() {
        // 默认显示第一个标签页
        this.switchTab('basic');
    }
    
    switchTab(tabName) {
        console.log(`切换到标签页: ${tabName}`);
        
        // 更新标签按钮状态
        document.querySelectorAll('.edit-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        const activeTab = document.querySelector(`.edit-tab[data-tab="${tabName}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }
        
        // 更新内容区域
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        const activeContent = document.getElementById(`${tabName}-tab`);
        if (activeContent) {
            activeContent.classList.add('active');
        }
    }
    
    initForms() {
        console.log('初始化表单...');
        
        // 基础信息表单
        const basicForm = document.getElementById('basic-form');
        if (basicForm) {
            basicForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveBasicInfo();
            });
            
            // 监听表单变化
            const basicInputs = basicForm.querySelectorAll('input, select');
            basicInputs.forEach(input => {
                input.addEventListener('input', () => {
                    this.formChanged.basic = true;
                    this.updateSaveButtons();
                });
                input.addEventListener('change', () => {
                    this.formChanged.basic = true;
                    this.updateSaveButtons();
                });
            });
        }
        
        // 联系信息表单
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveContactInfo();
            });
            
            // 监听表单变化
            const contactInputs = contactForm.querySelectorAll('input');
            contactInputs.forEach(input => {
                input.addEventListener('input', () => {
                    this.formChanged.contact = true;
                    this.updateSaveButtons();
                });
            });
        }
        
        console.log('表单初始化完成');
    }
    
    updateSaveButtons() {
        const basicSaveBtn = document.getElementById('save-basic-btn');
        const contactSaveBtn = document.getElementById('save-contact-btn');
        
        if (basicSaveBtn) {
            basicSaveBtn.disabled = !this.formChanged.basic;
        }
        
        if (contactSaveBtn) {
            contactSaveBtn.disabled = !this.formChanged.contact;
        }
    }
    
    saveBasicInfo() {
        console.log('保存基础信息...');
        
        const saveBtn = document.getElementById('save-basic-btn');
        if (!saveBtn) return;
        
        // 获取表单数据
        this.userData.name = document.getElementById('input-name').value.trim();
        
        const genderInput = document.querySelector('input[name="gender"]:checked');
        if (genderInput) {
            this.userData.gender = genderInput.value;
        }
        
        this.userData.student_type = document.getElementById('input-program-type').value;
        this.userData.programType = this.userData.student_type; // 保持兼容性
        this.userData.major = document.getElementById('input-major').value.trim();
        this.userData.supervisor_id = document.getElementById('input-supervisor').value.trim();
        this.userData.enrollment_year = document.getElementById('input-enrollment').value;
        
        // 验证数据
        if (!this.userData.name || !this.userData.major || !this.userData.supervisor_id) {
            this.showToast('请填写所有必填项', 'error');
            return;
        }
        
        // 显示保存状态
        this.setButtonLoading(saveBtn, true, '保存中...');
        
        // 实际保存操作：与后端API交互
        fetch('/save-basic-info', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: this.userData.name,
                student_id: this.userData.student_id,
                enrollment: this.userData.enrollment_year,
                supervisor: this.userData.supervisor_id,
                major: this.userData.major,
                program_type: this.userData.student_type,
                gender: this.userData.gender
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            console.log('保存状态:', data);
            
            // 保存到localStorage
            this.saveToLocalStorage();
            
            // 更新显示
            this.updateProfileDisplay();
            
            // 更新localStorage中的用户数据
            this.updateUserInLocalStorage();
            
            // 重置表单状态
            this.formChanged.basic = false;
            this.updateSaveButtons();
            
            // 恢复按钮状态
            this.setButtonLoading(saveBtn, false, '保存修改');
            
            this.showToast('基础信息已保存', 'success');
        })
        .catch(error => {
            console.error('保存基础信息失败:', error);
            
            // 恢复按钮状态
            this.setButtonLoading(saveBtn, false, '保存修改');
            
            this.showToast('保存失败，请检查网络连接或服务器状态', 'error');
        });
    }
    
    saveContactInfo() {
        console.log('保存联系信息...');
        
        const saveBtn = document.getElementById('save-contact-btn');
        if (!saveBtn) return;
        
        // 获取表单数据
        this.userData.phone = document.getElementById('input-phone').value.trim();
        this.userData.email = document.getElementById('input-email').value.trim();
        this.userData.wechat = document.getElementById('input-wechat').value.trim();
        
        // 验证数据
        if (!this.userData.phone || !this.userData.email) {
            this.showToast('请填写电话和邮箱', 'error');
            return;
        }
        
        // 验证邮箱格式
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.userData.email)) {
            this.showToast('请输入有效的邮箱地址', 'error');
            return;
        }
        
        // 验证手机号格式
        const phoneRegex = /^1[3-9]\d{9}$/;
        if (!phoneRegex.test(this.userData.phone)) {
            this.showToast('请输入有效的手机号码', 'error');
            return;
        }
        
        // 显示保存状态
        this.setButtonLoading(saveBtn, true, '保存中...');
        
        fetch('/save-contant-info', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                phone: this.userData.phone,
                email: this.userData.email,
                wechat_id: this.userData.wechat,
                student_id: this.userData.student_id
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            console.log('保存状态:', data);
            
            // 保存到localStorage
            this.saveToLocalStorage();
            
            // 更新显示
            this.updateProfileDisplay();
            
            // 更新localStorage中的用户数据
            this.updateUserInLocalStorage();
            
            // 重置表单状态
            this.formChanged.basic = false;
            this.updateSaveButtons();
            
            // 恢复按钮状态
            this.setButtonLoading(saveBtn, false, '保存修改');
            
            this.showToast('联系信息已保存', 'success');
        })
        .catch(error => {
            console.error('保存联系信息失败:', error);
            
            // 恢复按钮状态
            this.setButtonLoading(saveBtn, false, '保存修改');
            
            this.showToast('保存联系信息失败，请检查网络连接或服务器状态', 'error');
        });
    }
    
    saveToLocalStorage() {
        try {
            // 只保存用户数据，不包含统计信息
            const dataToSave = { ...this.userData };
            delete dataToSave.stats; // 不保存统计信息
            
            localStorage.setItem('profile_data', JSON.stringify(dataToSave));
            console.log('用户数据已保存到localStorage');
        } catch (error) {
            console.error('保存到localStorage失败:', error);
        }
    }
    
    updateUserInLocalStorage() {
        try {
            const savedUser = JSON.parse(localStorage.getItem('docim_user') || '{}');
            savedUser.name = this.userData.name;
            savedUser.department = this.userData.department;
            savedUser.major = this.userData.major;
            savedUser.supervisor_id = this.userData.supervisor_id;
            savedUser.enrollment_year = this.userData.enrollment_year;
            // 添加培养类型的更新
            savedUser.student_type = this.userData.training_mode;
            localStorage.setItem('docim_user', JSON.stringify(savedUser));
            
            // 更新顶部栏用户名
            const usernameElement = document.getElementById('username');
            if (usernameElement) {
                usernameElement.textContent = this.userData.name + '博士';
            }
            
        } catch (error) {
            console.error('更新localStorage失败:', error);
        }
    }
    
    setButtonLoading(button, isLoading, text = '') {
        if (!button) return;
        
        if (isLoading) {
            button.disabled = true;
            button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${text}`;
        } else {
            button.disabled = false;
            const icon = text.includes('保存') ? 'fa-save' : 'fa-key';
            button.innerHTML = `<i class="fas ${icon}"></i> ${text}`;
        }
    }
    
    showToast(message, type) {
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background-color: ${type === 'success' ? '#2ecc71' : '#e74c3c'};
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        
        const icon = document.createElement('i');
        icon.className = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
        toast.appendChild(icon);
        toast.appendChild(document.createTextNode(message));
        
        document.body.appendChild(toast);
        
        // 3秒后移除
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                if (toast.parentNode) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
    
    showError(message) {
        alert(message);
    }
    
    resetBasicForm() {
        if (confirm('确定要重置基础信息表单吗？所有未保存的更改将丢失。')) {
            this.updateFormData();
            this.showToast('表单已重置', 'info');
        }
    }
    
    resetContactForm() {
        if (confirm('确定要重置联系信息表单吗？所有未保存的更改将丢失。')) {
            this.updateFormData();
            this.showToast('表单已重置', 'info');
        }
    }
}

// 全局函数
function changeAvatar() {
    alert('更换头像功能（演示）\n\n在实际应用中，这里会打开文件选择器上传头像图片');
}

function changePhone() {
    alert('更换手机功能（演示）\n\n在实际应用中，这里会进行手机验证流程');
}

function changeEmail() {
    alert('更换邮箱功能（演示）\n\n在实际应用中，这里会进行邮箱验证流程');
}

function viewLoginHistory() {
    alert('查看登录历史功能（演示）\n\n在实际应用中，这里会显示详细的登录记录');
}

function logout() {
    if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('docim_user');
        localStorage.removeItem('profile_data');
        window.location.href = 'index.html';
    }
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('个人信息页面加载完成');
    
    // 初始化个人信息管理器
    window.profileManager = new ProfileManager();
    
    // 初始化通知系统
    if (typeof NotificationManager !== 'undefined') {
        window.notificationManager = new NotificationManager();
    }
});

// 全局重置函数
function resetBasicForm() {
    if (window.profileManager) {
        window.profileManager.resetBasicForm();
    }
}

function resetContactForm() {
    if (window.profileManager) {
        window.profileManager.resetContactForm();
    }
}

// 添加必要的动画样式
if (!document.querySelector('#toast-animations')) {
    const style = document.createElement('style');
    style.id = 'toast-animations';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes fadeOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}