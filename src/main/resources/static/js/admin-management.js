// js/admin-management.js - 管理员管理页面JavaScript

// 模拟的管理员数据
const mockAdmins = [
    {
        id: 1,
        name: "李建国",
        email: "li.jianguo@docim.edu.cn",
        phone: "+86 138-0013-8000",
        department: "计算机科学与技术学院",
        username: "lijg",
        role: "super",
        status: "active",
        lastLogin: "2024-03-15 10:30",
        createdDate: "2021-03-15",
        permissions: ["all"]
    },
    {
        id: 2,
        name: "王明",
        email: "wang.ming@docim.edu.cn",
        phone: "+86 138-0013-8001",
        department: "软件学院",
        username: "wangm",
        role: "admin",
        status: "active",
        lastLogin: "2024-03-14 14:20",
        createdDate: "2022-08-10",
        permissions: ["task_view", "task_create", "task_edit", "student_view"]
    },
    {
        id: 3,
        name: "张伟",
        email: "zhang.wei@docim.edu.cn",
        phone: "+86 138-0013-8002",
        department: "自动化系",
        username: "zhangw",
        role: "task",
        status: "active",
        lastLogin: "2024-03-13 09:15",
        createdDate: "2023-01-20",
        permissions: ["task_view", "task_create", "task_edit"]
    },
    {
        id: 4,
        name: "刘芳",
        email: "liu.fang@docim.edu.cn",
        phone: "+86 138-0013-8003",
        department: "电子工程系",
        username: "liuf",
        role: "viewer",
        status: "active",
        lastLogin: "2024-03-12 11:45",
        createdDate: "2023-05-15",
        permissions: ["task_view", "student_view"]
    },
    {
        id: 5,
        name: "陈强",
        email: "chen.qiang@docim.edu.cn",
        phone: "+86 138-0013-8004",
        department: "机械工程系",
        username: "chenq",
        role: "admin",
        status: "inactive",
        lastLogin: "2024-02-28 16:30",
        createdDate: "2023-09-10",
        permissions: ["task_view", "task_create", "student_view", "student_create"]
    },
    {
        id: 6,
        name: "赵敏",
        email: "zhao.min@docim.edu.cn",
        phone: "+86 138-0013-8005",
        department: "建筑学院",
        username: "zhaom",
        role: "task",
        status: "suspended",
        lastLogin: "2024-02-15 13:20",
        createdDate: "2023-11-05",
        permissions: ["task_view", "task_edit"]
    },
    {
        id: 7,
        name: "孙伟",
        email: "sun.wei@docim.edu.cn",
        phone: "+86 138-0013-8006",
        department: "数学科学系",
        username: "sunw",
        role: "viewer",
        status: "active",
        lastLogin: "2024-03-14 10:10",
        createdDate: "2024-01-15",
        permissions: ["task_view", "student_view"]
    },
    {
        id: 8,
        name: "周涛",
        email: "zhou.tao@docim.edu.cn",
        phone: "+86 138-0013-8007",
        department: "物理系",
        username: "zhout",
        role: "admin",
        status: "active",
        lastLogin: "2024-03-13 15:45",
        createdDate: "2024-02-20",
        permissions: ["task_view", "task_create", "student_view", "student_create"]
    }
];

// 模拟的活动记录
const mockActivities = [
    {
        id: 1,
        adminName: "李建国",
        action: "添加了新的管理员",
        target: "周涛",
        ip: "192.168.1.100",
        time: "2024-03-13 14:30"
    },
    {
        id: 2,
        adminName: "王明",
        action: "修改了管理员权限",
        target: "张伟",
        ip: "10.0.0.50",
        time: "2024-03-12 11:20"
    },
    {
        id: 3,
        adminName: "李建国",
        action: "停用了管理员账户",
        target: "赵敏",
        ip: "192.168.1.100",
        time: "2024-03-10 09:45"
    },
    {
        id: 4,
        adminName: "张伟",
        action: "导出了管理员列表",
        target: "",
        ip: "10.0.0.51",
        time: "2024-03-09 16:15"
    },
    {
        id: 5,
        adminName: "陈强",
        action: "登录系统失败",
        target: "",
        ip: "192.168.1.101",
        time: "2024-03-08 08:30"
    },
    {
        id: 6,
        adminName: "刘芳",
        action: "查看了权限矩阵",
        target: "",
        ip: "10.0.0.52",
        time: "2024-03-07 14:20"
    }
];

// 权限矩阵数据
const permissionsMatrix = [
    { module: "任务查看", super: "yes", admin: "yes", task: "yes", viewer: "yes" },
    { module: "任务创建", super: "yes", admin: "yes", task: "yes", viewer: "no" },
    { module: "任务编辑", super: "yes", admin: "yes", task: "yes", viewer: "no" },
    { module: "任务删除", super: "yes", admin: "no", task: "no", viewer: "no" },
    { module: "学生查看", super: "yes", admin: "yes", task: "no", viewer: "yes" },
    { module: "学生添加", super: "yes", admin: "yes", task: "no", viewer: "no" },
    { module: "学生编辑", super: "yes", admin: "yes", task: "no", viewer: "no" },
    { module: "统计分析", super: "yes", admin: "yes", task: "partial", viewer: "yes" },
    { module: "系统设置", super: "yes", admin: "no", task: "no", viewer: "no" },
    { module: "管理员管理", super: "yes", admin: "no", task: "no", viewer: "no" },
    { module: "通知管理", super: "yes", admin: "yes", task: "no", viewer: "no" },
    { module: "日志查看", super: "yes", admin: "yes", task: "no", viewer: "no" }
];

// 页面状态
let currentPage = 1;
const itemsPerPage = 5;
let filteredAdmins = [...mockAdmins];
let selectedAdmins = new Set();

document.addEventListener('DOMContentLoaded', function() {
    console.log('管理员管理页面加载完成');
    
    // 初始化通知系统
    if (!window.notificationSystem) {
        window.notificationSystem = new NotificationSystem();
    }
    
    // 加载管理员数据
    loadAdminData();
    
    // 加载权限矩阵
    loadPermissionsMatrix();
    
    // 加载活动记录
    loadActivities();
    
    // 更新通知计数
    updateNotificationCount();
    
    // 更新统计信息
    updateStats();
    
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
    // 搜索输入防抖
    const searchInput = document.getElementById('adminSearch');
    let searchTimeout;
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(filterAdmins, 300);
        });
    }
}

function loadAdminData() {
    console.log('加载管理员数据');
    
    // 渲染表格
    renderAdminTable();
    
    // 更新分页信息
    updatePagination();
}

function renderAdminTable() {
    const tableBody = document.getElementById('adminTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    // 计算当前页的数据
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageAdmins = filteredAdmins.slice(startIndex, endIndex);
    
    if (pageAdmins.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="6" style="text-align: center; padding: 40px; color: var(--text-secondary);">
                <i class="fas fa-user-slash" style="font-size: 32px; margin-bottom: 10px; display: block;"></i>
                没有找到匹配的管理员
            </td>
        `;
        tableBody.appendChild(emptyRow);
        return;
    }
    
    pageAdmins.forEach(admin => {
        const row = document.createElement('tr');
        row.dataset.adminId = admin.id;
        
        // 获取角色和状态的显示文本和样式类
        const roleInfo = getRoleInfo(admin.role);
        const statusInfo = getStatusInfo(admin.status);
        
        row.innerHTML = `
            <td>
                <label class="checkbox-cell">
                    <input type="checkbox" class="admin-checkbox" value="${admin.id}" 
                           ${selectedAdmins.has(admin.id) ? 'checked' : ''}
                           onchange="toggleAdminSelection(${admin.id})">
                    <span class="checkmark"></span>
                </label>
            </td>
            <td>
                <div class="admin-info-cell">
                    <div class="admin-avatar">
                        ${admin.name.charAt(0)}
                    </div>
                    <div class="admin-details">
                        <h4>${admin.name}</h4>
                        <p>${admin.email}</p>
                        <p><i class="fas fa-building"></i> ${admin.department}</p>
                    </div>
                </div>
            </td>
            <td>
                <span class="role-badge ${roleInfo.class}">${roleInfo.text}</span>
            </td>
            <td>
                <div>${admin.lastLogin}</div>
                <div style="font-size: 12px; color: var(--text-light);">
                    <i class="fas fa-calendar-alt"></i> 创建于 ${admin.createdDate}
                </div>
            </td>
            <td>
                <span class="status-badge ${statusInfo.class}">${statusInfo.text}</span>
            </td>
            <td>
                <div class="table-actions-cell">
                    <button class="btn-icon" onclick="editAdmin(${admin.id})" title="编辑">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" onclick="toggleAdminStatus(${admin.id})" title="${admin.status === 'active' ? '停用' : '激活'}">
                        <i class="fas ${admin.status === 'active' ? 'fa-user-slash' : 'fa-user-check'}"></i>
                    </button>
                    <button class="btn-icon" onclick="deleteAdmin(${admin.id})" title="删除">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

function getRoleInfo(role) {
    const roles = {
        'super': { text: '超级管理员', class: 'super' },
        'admin': { text: '系统管理员', class: 'admin' },
        'task': { text: '任务管理员', class: 'task' },
        'viewer': { text: '查看者', class: 'viewer' }
    };
    return roles[role] || { text: '未知', class: 'viewer' };
}

function getStatusInfo(status) {
    const statuses = {
        'active': { text: '活跃', class: 'active' },
        'inactive': { text: '未激活', class: 'inactive' },
        'suspended': { text: '已停用', class: 'suspended' }
    };
    return statuses[status] || { text: '未知', class: 'inactive' };
}

function updateStats() {
    const totalAdmins = mockAdmins.length;
    const activeAdmins = mockAdmins.filter(a => a.status === 'active').length;
    const inactiveAdmins = mockAdmins.filter(a => a.status === 'inactive' || a.status === 'suspended').length;
    const superAdmins = mockAdmins.filter(a => a.role === 'super').length;
    
    document.getElementById('totalAdmins').textContent = totalAdmins;
    document.getElementById('activeAdmins').textContent = activeAdmins;
    document.getElementById('inactiveAdmins').textContent = inactiveAdmins;
    document.getElementById('superAdmins').textContent = superAdmins;
}

function filterAdmins() {
    const roleFilter = document.getElementById('roleFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const searchTerm = document.getElementById('adminSearch').value.toLowerCase();
    
    filteredAdmins = mockAdmins.filter(admin => {
        // 角色筛选
        if (roleFilter !== 'all' && admin.role !== roleFilter) {
            return false;
        }
        
        // 状态筛选
        if (statusFilter !== 'all') {
            if (statusFilter === 'active' && admin.status !== 'active') {
                return false;
            }
            if (statusFilter === 'inactive' && admin.status !== 'inactive') {
                return false;
            }
            if (statusFilter === 'suspended' && admin.status !== 'suspended') {
                return false;
            }
        }
        
        // 搜索筛选
        if (searchTerm) {
            const searchFields = [
                admin.name,
                admin.email,
                admin.department,
                admin.username
            ];
            
            if (!searchFields.some(field => field.toLowerCase().includes(searchTerm))) {
                return false;
            }
        }
        
        return true;
    });
    
    // 重置到第一页
    currentPage = 1;
    
    // 重新渲染表格
    renderAdminTable();
    updatePagination();
    updateSelectedInfo();
}

function toggleSelectAll() {
    const selectAllCheckbox = document.getElementById('selectAll');
    const adminCheckboxes = document.querySelectorAll('.admin-checkbox');
    
    if (selectAllCheckbox.checked) {
        // 选择当前页所有管理员
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageAdmins = filteredAdmins.slice(startIndex, endIndex);
        
        pageAdmins.forEach(admin => {
            selectedAdmins.add(admin.id);
        });
    } else {
        // 取消选择所有管理员
        selectedAdmins.clear();
    }
    
    // 更新复选框状态
    adminCheckboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
    });
    
    updateSelectedInfo();
    updateBulkActions();
}

function toggleAdminSelection(adminId) {
    if (selectedAdmins.has(adminId)) {
        selectedAdmins.delete(adminId);
    } else {
        selectedAdmins.add(adminId);
    }
    
    updateSelectedInfo();
    updateBulkActions();
    updateSelectAllCheckbox();
}

function updateSelectAllCheckbox() {
    const selectAllCheckbox = document.getElementById('selectAll');
    const adminCheckboxes = document.querySelectorAll('.admin-checkbox');
    
    if (adminCheckboxes.length === 0) {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = false;
        return;
    }
    
    const checkedCount = Array.from(adminCheckboxes).filter(cb => cb.checked).length;
    
    if (checkedCount === 0) {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = false;
    } else if (checkedCount === adminCheckboxes.length) {
        selectAllCheckbox.checked = true;
        selectAllCheckbox.indeterminate = false;
    } else {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = true;
    }
}

function updateSelectedInfo() {
    const selectedCount = selectedAdmins.size;
    document.getElementById('selectedCount').textContent = selectedCount;
}

function updateBulkActions() {
    const hasSelection = selectedAdmins.size > 0;
    
    const bulkActivateBtn = document.getElementById('bulkActivateBtn');
    const bulkDeactivateBtn = document.getElementById('bulkDeactivateBtn');
    const bulkDeleteBtn = document.getElementById('bulkDeleteBtn');
    
    if (bulkActivateBtn) bulkActivateBtn.disabled = !hasSelection;
    if (bulkDeactivateBtn) bulkDeactivateBtn.disabled = !hasSelection;
    if (bulkDeleteBtn) bulkDeleteBtn.disabled = !hasSelection;
}

function updatePagination() {
    const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage);
    
    document.getElementById('currentPage').textContent = currentPage;
    document.getElementById('totalPages').textContent = totalPages;
    
    // 更新分页按钮状态
    const prevBtn = document.querySelector('.pagination-btn:first-child');
    const nextBtn = document.querySelector('.pagination-btn:last-child');
    
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages || totalPages === 0;
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderAdminTable();
        updatePagination();
        updateSelectAllCheckbox();
    }
}

function nextPage() {
    const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage);
    
    if (currentPage < totalPages) {
        currentPage++;
        renderAdminTable();
        updatePagination();
        updateSelectAllCheckbox();
    }
}

function loadPermissionsMatrix() {
    const matrixBody = document.getElementById('permissionsMatrix');
    if (!matrixBody) return;
    
    matrixBody.innerHTML = '';
    
    permissionsMatrix.forEach(item => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${item.module}</td>
            <td>
                <div class="permission-indicator ${getPermissionClass(item.super)}">
                    ${getPermissionIcon(item.super)}
                </div>
            </td>
            <td>
                <div class="permission-indicator ${getPermissionClass(item.admin)}">
                    ${getPermissionIcon(item.admin)}
                </div>
            </td>
            <td>
                <div class="permission-indicator ${getPermissionClass(item.task)}">
                    ${getPermissionIcon(item.task)}
                </div>
            </td>
            <td>
                <div class="permission-indicator ${getPermissionClass(item.viewer)}">
                    ${getPermissionIcon(item.viewer)}
                </div>
            </td>
        `;
        
        matrixBody.appendChild(row);
    });
}

function getPermissionClass(permission) {
    switch (permission) {
        case 'yes': return 'permission-yes';
        case 'no': return 'permission-no';
        case 'partial': return 'permission-partial';
        default: return 'permission-no';
    }
}

function getPermissionIcon(permission) {
    switch (permission) {
        case 'yes': return '<i class="fas fa-check"></i>';
        case 'no': return '<i class="fas fa-times"></i>';
        case 'partial': return '<i class="fas fa-minus"></i>';
        default: return '<i class="fas fa-times"></i>';
    }
}

function loadActivities() {
    const activitiesList = document.getElementById('activitiesList');
    if (!activitiesList) return;
    
    activitiesList.innerHTML = '';
    
    mockActivities.forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        
        const actionIcon = getActionIcon(activity.action);
        
        activityItem.innerHTML = `
            <div class="activity-icon">
                ${actionIcon}
            </div>
            <div class="activity-content">
                <div class="activity-title">${activity.adminName} ${activity.action}</div>
                <div class="activity-details">
                    ${activity.target ? `<span><i class="fas fa-user"></i> ${activity.target}</span>` : ''}
                    <span><i class="fas fa-globe"></i> ${activity.ip}</span>
                </div>
                <div class="activity-time">
                    <i class="far fa-clock"></i> ${activity.time}
                </div>
            </div>
        `;
        
        activitiesList.appendChild(activityItem);
    });
}

function getActionIcon(action) {
    if (action.includes('添加')) return '<i class="fas fa-user-plus"></i>';
    if (action.includes('修改')) return '<i class="fas fa-edit"></i>';
    if (action.includes('停用')) return '<i class="fas fa-user-slash"></i>';
    if (action.includes('导出')) return '<i class="fas fa-file-export"></i>';
    if (action.includes('登录')) return '<i class="fas fa-sign-in-alt"></i>';
    if (action.includes('查看')) return '<i class="fas fa-eye"></i>';
    return '<i class="fas fa-cog"></i>';
}

function openAddAdminModal() {
    console.log('打开添加管理员弹窗');
    
    // 重置表单
    const form = document.getElementById('addAdminForm');
    if (form) {
        form.reset();
        form.classList.remove('was-validated');
    }
    
    // 显示模态框
    const modal = document.getElementById('addAdminModal');
    if (modal) {
        modal.style.display = 'flex';
        
        // 禁用背景滚动
        document.body.style.overflow = 'hidden';
    }
}

function closeAddAdminModal() {
    console.log('关闭添加管理员弹窗');
    
    const modal = document.getElementById('addAdminModal');
    if (modal) {
        modal.style.display = 'none';
        
        // 恢复背景滚动
        document.body.style.overflow = '';
    }
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const toggleBtn = input.nextElementSibling;
    
    if (input.type === 'password') {
        input.type = 'text';
        toggleBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        input.type = 'password';
        toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';
    }
}

function addAdmin() {
    console.log('添加新管理员');
    
    const form = document.getElementById('addAdminForm');
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        showToast('请填写所有必填字段', 'error');
        return;
    }
    
    // 获取表单数据
    const name = document.getElementById('adminName').value;
    const email = document.getElementById('adminEmail').value;
    const phone = document.getElementById('adminPhone').value;
    const department = document.getElementById('adminDepartment').value;
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    const role = document.getElementById('adminRole').value;
    const status = document.getElementById('adminStatus').value;
    
    // 获取权限
    const permissionCheckboxes = document.querySelectorAll('input[name="permissions"]:checked');
    const permissions = Array.from(permissionCheckboxes).map(cb => cb.value);
    
    // 创建新管理员对象
    const newAdmin = {
        id: Date.now(), // 使用时间戳作为ID
        name: name,
        email: email,
        phone: phone,
        department: department,
        username: username,
        role: role,
        status: status,
        lastLogin: '从未登录',
        createdDate: new Date().toISOString().split('T')[0],
        permissions: permissions
    };
    
    // 添加到数据数组
    mockAdmins.push(newAdmin);
    
    // 更新显示
    filterAdmins();
    updateStats();
    
    // 关闭模态框
    closeAddAdminModal();
    
    // 显示成功消息
    showToast(`管理员 ${name} 已成功添加`, 'success');
    
    // 添加活动记录
    const currentUser = '李建国'; // 这里应该从登录状态获取当前用户
    mockActivities.unshift({
        id: Date.now(),
        adminName: currentUser,
        action: '添加了新的管理员',
        target: name,
        ip: '192.168.1.100',
        time: new Date().toLocaleString('zh-CN')
    });
    
    // 如果当前在活动记录选项卡，则更新显示
    loadActivities();
}

function editAdmin(adminId) {
    console.log('编辑管理员:', adminId);
    
    const admin = mockAdmins.find(a => a.id === adminId);
    if (!admin) {
        showToast('未找到管理员', 'error');
        return;
    }
    
    // 填充表单
    document.getElementById('editAdminId').value = admin.id;
    document.getElementById('editAdminName').value = admin.name;
    document.getElementById('editAdminEmail').value = admin.email;
    document.getElementById('editAdminPhone').value = admin.phone;
    document.getElementById('editAdminDepartment').value = admin.department;
    document.getElementById('editAdminUsername').value = admin.username;
    document.getElementById('editAdminRole').value = admin.role;
    document.getElementById('editAdminStatus').value = admin.status;
    document.getElementById('editAdminPassword').value = '';
    
    // 显示模态框
    const modal = document.getElementById('editAdminModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeEditAdminModal() {
    console.log('关闭编辑管理员弹窗');
    
    const modal = document.getElementById('editAdminModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

function saveAdminChanges() {
    console.log('保存管理员更改');
    
    const form = document.getElementById('editAdminForm');
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        showToast('请填写所有必填字段', 'error');
        return;
    }
    
    const adminId = parseInt(document.getElementById('editAdminId').value);
    const admin = mockAdmins.find(a => a.id === adminId);
    
    if (!admin) {
        showToast('未找到管理员', 'error');
        return;
    }
    
    // 更新管理员信息
    admin.name = document.getElementById('editAdminName').value;
    admin.email = document.getElementById('editAdminEmail').value;
    admin.phone = document.getElementById('editAdminPhone').value;
    admin.department = document.getElementById('editAdminDepartment').value;
    admin.role = document.getElementById('editAdminRole').value;
    admin.status = document.getElementById('editAdminStatus').value;
    
    const newPassword = document.getElementById('editAdminPassword').value;
    if (newPassword) {
        // 在实际应用中，这里应该加密密码
        console.log('密码已更新');
    }
    
    // 更新显示
    renderAdminTable();
    updateStats();
    
    // 关闭模态框
    closeEditAdminModal();
    
    // 显示成功消息
    showToast(`管理员 ${admin.name} 的信息已更新`, 'success');
    
    // 添加活动记录
    const currentUser = '李建国';
    mockActivities.unshift({
        id: Date.now(),
        adminName: currentUser,
        action: '修改了管理员信息',
        target: admin.name,
        ip: '192.168.1.100',
        time: new Date().toLocaleString('zh-CN')
    });
    
    loadActivities();
}

function toggleAdminStatus(adminId) {
    const admin = mockAdmins.find(a => a.id === adminId);
    if (!admin) return;
    
    const currentUser = '李建国';
    let newStatus, action, message;
    
    if (admin.status === 'active') {
        newStatus = 'suspended';
        action = '停用了管理员账户';
        message = `管理员 ${admin.name} 已停用`;
    } else {
        newStatus = 'active';
        action = '激活了管理员账户';
        message = `管理员 ${admin.name} 已激活`;
    }
    
    admin.status = newStatus;
    
    // 更新显示
    renderAdminTable();
    updateStats();
    
    // 显示消息
    showToast(message, 'success');
    
    // 添加活动记录
    mockActivities.unshift({
        id: Date.now(),
        adminName: currentUser,
        action: action,
        target: admin.name,
        ip: '192.168.1.100',
        time: new Date().toLocaleString('zh-CN')
    });
    
    loadActivities();
}

function deleteAdmin(adminId) {
    const admin = mockAdmins.find(a => a.id === adminId);
    if (!admin) return;
    
    if (!confirm(`确定要删除管理员 ${admin.name} 吗？此操作不可撤销。`)) {
        return;
    }
    
    // 从数组中删除
    const index = mockAdmins.findIndex(a => a.id === adminId);
    if (index !== -1) {
        mockAdmins.splice(index, 1);
    }
    
    // 从选中集合中删除
    selectedAdmins.delete(adminId);
    
    // 更新显示
    filterAdmins();
    updateStats();
    updateSelectedInfo();
    
    // 显示消息
    showToast(`管理员 ${admin.name} 已删除`, 'success');
    
    // 添加活动记录
    const currentUser = '李建国';
    mockActivities.unshift({
        id: Date.now(),
        adminName: currentUser,
        action: '删除了管理员',
        target: admin.name,
        ip: '192.168.1.100',
        time: new Date().toLocaleString('zh-CN')
    });
    
    loadActivities();
}

function bulkActivate() {
    if (selectedAdmins.size === 0) return;
    
    if (!confirm(`确定要激活选中的 ${selectedAdmins.size} 个管理员吗？`)) {
        return;
    }
    
    let count = 0;
    selectedAdmins.forEach(adminId => {
        const admin = mockAdmins.find(a => a.id === adminId);
        if (admin && admin.status !== 'active') {
            admin.status = 'active';
            count++;
        }
    });
    
    // 更新显示
    renderAdminTable();
    updateStats();
    selectedAdmins.clear();
    updateSelectedInfo();
    updateSelectAllCheckbox();
    
    showToast(`已激活 ${count} 个管理员`, 'success');
}

function bulkDeactivate() {
    if (selectedAdmins.size === 0) return;
    
    if (!confirm(`确定要停用选中的 ${selectedAdmins.size} 个管理员吗？`)) {
        return;
    }
    
    let count = 0;
    selectedAdmins.forEach(adminId => {
        const admin = mockAdmins.find(a => a.id === adminId);
        if (admin && admin.status === 'active') {
            admin.status = 'suspended';
            count++;
        }
    });
    
    // 更新显示
    renderAdminTable();
    updateStats();
    selectedAdmins.clear();
    updateSelectedInfo();
    updateSelectAllCheckbox();
    
    showToast(`已停用 ${count} 个管理员`, 'success');
}

function bulkDelete() {
    if (selectedAdmins.size === 0) return;
    
    if (!confirm(`确定要删除选中的 ${selectedAdmins.size} 个管理员吗？此操作不可撤销。`)) {
        return;
    }
    
    let count = 0;
    selectedAdmins.forEach(adminId => {
        const index = mockAdmins.findIndex(a => a.id === adminId);
        if (index !== -1) {
            mockAdmins.splice(index, 1);
            count++;
        }
    });
    
    // 更新显示
    selectedAdmins.clear();
    filterAdmins();
    updateStats();
    updateSelectedInfo();
    updateSelectAllCheckbox();
    
    showToast(`已删除 ${count} 个管理员`, 'success');
}

function exportAdminData() {
    showToast('正在导出管理员数据...', 'info');
    
    // 模拟导出过程
    setTimeout(() => {
        const exportData = {
            exportTime: new Date().toISOString(),
            totalCount: mockAdmins.length,
            admins: mockAdmins.map(admin => ({
                name: admin.name,
                email: admin.email,
                department: admin.department,
                role: getRoleInfo(admin.role).text,
                status: getStatusInfo(admin.status).text,
                lastLogin: admin.lastLogin,
                createdDate: admin.createdDate
            }))
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `admins-export-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        showToast('管理员数据已导出', 'success');
    }, 1500);
}

function exportPermissions() {
    showToast('正在导出权限矩阵...', 'info');
    
    // 模拟导出过程
    setTimeout(() => {
        // 创建CSV内容
        let csvContent = "功能模块,超级管理员,系统管理员,任务管理员,查看者\n";
        
        permissionsMatrix.forEach(item => {
            csvContent += `${item.module},${item.super},${item.admin},${item.task},${item.viewer}\n`;
        });
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        
        const exportFileDefaultName = `permissions-matrix-${new Date().toISOString().split('T')[0]}.csv`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', url);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        showToast('权限矩阵已导出', 'success');
    }, 1000);
}

function refreshActivities() {
    console.log('刷新活动记录');
    
    // 在实际应用中，这里会从服务器获取最新数据
    // 这里我们只是重新加载现有数据
    loadActivities();
    
    showToast('活动记录已刷新', 'success');
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