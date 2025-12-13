// js/admin-tasks.js - 任务管理JavaScript

class TaskManager {
    constructor() {
        this.currentPage = 1;
        this.rowsPerPage = 20;
        this.totalTasks = 28;
        this.totalPages = 2;
        this.currentView = 'table';
        this.currentSort = { field: 'publishDate', order: 'desc' };
        this.selectedTasks = new Set();
        this.isBulkSelectMode = false;
        this.init();
    }
    
    init() {
        console.log('任务管理页面初始化');
        
        try {
            // 检查登录状态
            if (!this.checkAuth()) {
                this.showErrorModal();
                return;
            }
            
            // 绑定事件
            this.bindEvents();
            
            // 初始化通知系统
            this.initNotificationSystem();
            
            // 加载数据
            this.loadTasks();
            
            // 更新界面
            this.updateUI();
            
            console.log('任务管理页面初始化完成');
            
        } catch (error) {
            console.error('任务管理页面初始化失败:', error);
            this.showErrorModal();
        }
    }
    
    checkAuth() {
        try {
            const userData = localStorage.getItem('docim_user');
            if (!userData) {
                console.warn('用户未登录');
                return false;
            }
            
            return true;
            
        } catch (error) {
            console.error('认证检查失败:', error);
            return false;
        }
    }
    
    initNotificationSystem() {
        // 确保通知系统已初始化
        if (!window.notificationSystem) {
            window.notificationSystem = new NotificationSystem();
        }
        
        // 更新通知计数
        this.updateNotificationCount();
    }
    
    bindEvents() {
        console.log('绑定任务管理事件...');
        
        // 搜索框事件
        const searchInput = document.getElementById('taskSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTasks(e.target.value);
            });
            
            // 防抖处理
            this.debouncedSearch = this.debounce(this.searchTasks.bind(this), 300);
        }
        
        // 清除搜索按钮
        const clearSearch = document.getElementById('clearSearch');
        if (clearSearch) {
            clearSearch.addEventListener('click', () => {
                searchInput.value = '';
                this.searchTasks('');
            });
        }
        
        // 筛选器事件
        const filterSelects = document.querySelectorAll('.filter-select');
        filterSelects.forEach(select => {
            select.addEventListener('change', () => {
                this.applyFilters();
            });
        });
    }
    
    loadTasks() {
        console.log('加载任务数据...');
        
        // 模拟任务数据
        this.tasks = [
            {
                id: 1,
                title: '《计算机视觉》课程助教 - 实验课指导',
                type: 'course',
                requirement: 2,
                current: 1,
                status: 'pending',
                publishDate: '2023-11-15',
                deadline: '2023-11-30',
                stipend: '¥1,200',
                progress: 50,
                description: '负责每周二下午的实验课指导，协助学生完成图像处理实验，批改实验报告。'
            },
            {
                id: 2,
                title: '实验室设备维护与管理',
                type: 'lab',
                requirement: 1,
                current: 1,
                status: 'confirmed',
                publishDate: '2023-10-20',
                deadline: '2023-12-31',
                stipend: '¥1,080',
                progress: 100,
                description: '负责实验室计算机设备的日常维护，软件安装和故障排除。'
            },
            {
                id: 3,
                title: '本科生毕业论文指导 - 每周例会',
                type: 'thesis',
                requirement: 3,
                current: 0,
                status: 'pending',
                publishDate: '2023-11-10',
                deadline: '2023-12-05',
                stipend: '¥900',
                progress: 0,
                description: '指导3名本科生的毕业论文，每周举行一次例会，提供研究方向和写作指导。'
            },
            {
                id: 4,
                title: '本科生论文开题评审',
                type: 'thesis',
                requirement: 2,
                current: 0,
                status: 'rejected',
                publishDate: '2023-10-10',
                deadline: '2023-11-15',
                stipend: '¥600',
                progress: 0,
                description: '评审本科生论文开题报告，提供修改意见。'
            },
            {
                id: 5,
                title: '学院学术会议组织协助',
                type: 'admin',
                requirement: 4,
                current: 1,
                status: 'confirmed',
                publishDate: '2023-11-05',
                deadline: '2023-12-10',
                stipend: '¥1,500',
                progress: 25,
                description: '协助学院组织年度学术会议，负责参会人员登记、会场布置和设备调试。'
            },
            {
                id: 6,
                title: '《机器学习》课程作业批改',
                type: 'course',
                requirement: 2,
                current: 2,
                status: 'completed',
                publishDate: '2023-10-25',
                deadline: '2023-11-10',
                stipend: '¥720',
                progress: 100,
                description: '批改本科生《机器学习》课程作业，共45份，提供详细反馈。'
            }
        ];
        
        this.renderTasks();
    }
    
    renderTasks() {
        console.log('渲染任务列表...');
        
        // 筛选和排序任务
        let filteredTasks = this.filterTasks();
        filteredTasks = this.sortTasks(filteredTasks);
        
        // 分页
        const startIndex = (this.currentPage - 1) * this.rowsPerPage;
        const endIndex = startIndex + this.rowsPerPage;
        const pageTasks = filteredTasks.slice(startIndex, endIndex);
        
        // 更新计数
        this.totalTasks = filteredTasks.length;
        this.totalPages = Math.ceil(this.totalTasks / this.rowsPerPage) || 1;
        
        // 更新UI
        this.updatePaginationInfo();
        this.updateTaskCounts();
        
        if (pageTasks.length === 0) {
            this.showEmptyState();
            return;
        }
        
        this.hideEmptyState();
        
        if (this.currentView === 'table') {
            this.renderTableView(pageTasks);
        }
        
        this.updateBatchIndicator();
    }
    
    filterTasks() {
        let filtered = [...this.tasks];
        
        // 应用搜索过滤
        const searchTerm = document.getElementById('taskSearch')?.value.toLowerCase() || '';
        if (searchTerm) {
            filtered = filtered.filter(task => 
                task.title.toLowerCase().includes(searchTerm) ||
                task.description.toLowerCase().includes(searchTerm)
            );
        }
        
        // 应用状态过滤
        const statusFilter = document.getElementById('statusFilter')?.value;
        if (statusFilter) {
            filtered = filtered.filter(task => task.status === statusFilter);
        }
        
        // 应用类型过滤
        const typeFilter = document.getElementById('typeFilter')?.value;
        if (typeFilter) {
            filtered = filtered.filter(task => task.type === typeFilter);
        }
        
        // 应用时间过滤
        const timeFilter = document.getElementById('timeFilter')?.value;
        if (timeFilter) {
            filtered = this.filterByTime(filtered, timeFilter);
        }
        
        return filtered;
    }
    
    filterByTime(tasks, timeRange) {
        const now = new Date();
        let startDate;
        
        switch(timeRange) {
            case 'week':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case 'quarter':
                startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                break;
            case 'year':
                startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
                break;
            default:
                return tasks;
        }
        
        return tasks.filter(task => {
            const publishDate = new Date(task.publishDate);
            return publishDate >= startDate;
        });
    }
    
    sortTasks(tasks) {
        return tasks.sort((a, b) => {
            let valueA, valueB;
            
            switch(this.currentSort.field) {
                case 'name':
                    valueA = a.title;
                    valueB = b.title;
                    break;
                case 'requirement':
                    valueA = a.requirement;
                    valueB = b.requirement;
                    break;
                case 'status':
                    valueA = a.status;
                    valueB = b.status;
                    break;
                case 'progress':
                    valueA = a.progress;
                    valueB = b.progress;
                    break;
                case 'publishDate':
                    valueA = new Date(a.publishDate);
                    valueB = new Date(b.publishDate);
                    break;
                case 'deadline':
                    valueA = new Date(a.deadline);
                    valueB = new Date(b.deadline);
                    break;
                default:
                    valueA = new Date(a.publishDate);
                    valueB = new Date(b.publishDate);
            }
            
            if (this.currentSort.order === 'asc') {
                return valueA > valueB ? 1 : -1;
            } else {
                return valueA < valueB ? 1 : -1;
            }
        });
    }
    
    renderTableView(tasks) {
        const tbody = document.getElementById('tasksTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = tasks.map(task => `
            <tr data-task-id="${task.id}">
                <td>
                    <div class="task-title-cell">
                        <div class="task-title">${task.title}</div>
                        <div class="task-type">${this.getTypeText(task.type)}</div>
                    </div>
                </td>
                <td>
                    <div class="requirement-info">
                        <span class="requirement-badge">${task.requirement}人</span>
                        <div class="requirement-details">
                            <div class="requirement-progress">
                                <div class="progress-bar">
                                    <div class="progress-fill progress-${this.getProgressClass(task.progress)}" style="width: ${task.progress}%"></div>
                                </div>
                                <span class="progress-text">${task.current}/${task.requirement}人</span>
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="status-badge status-${task.status}">
                        ${this.getStatusText(task.status)}
                    </span>
                </td>
                <td>${task.publishDate}</td>
                <td>
                    <div class="deadline-cell">
                        <div>${task.deadline}</div>
                        <div class="${this.getDeadlineClass(task.deadline)}">
                            ${this.getDeadlineText(task.deadline)}
                        </div>
                    </div>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit-btn" title="编辑" onclick="editTask(${task.id})">
                            <i class="far fa-edit"></i>
                        </button>
                        <button class="action-btn view-btn" title="查看详情" onclick="viewTask(${task.id})">
                            <i class="far fa-eye"></i>
                        </button>
                        <button class="action-btn delete-btn" title="删除" onclick="deleteTask(${task.id})">
                            <i class="far fa-trash-alt"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
    
    getTypeText(type) {
        const types = {
            'course': '课程助教',
            'thesis': '论文指导',
            'lab': '实验室管理',
            'admin': '行政协助',
            'research': '科研协助'
        };
        return types[type] || '其他';
    }
    
    getStatusText(status) {
        const statuses = {
            'pending': '待确认',
            'confirmed': '已确认',
            'rejected': '已拒绝',
            'in-progress': '进行中',
            'completed': '已完成',
            'expired': '已过期'
        };
        return statuses[status] || '未知';
    }
    
    getProgressClass(progress) {
        if (progress === 0) return '0-25';
        if (progress <= 25) return '0-25';
        if (progress <= 50) return '25-50';
        if (progress <= 75) return '50-75';
        return '75-100';
    }
    
    getDeadlineClass(deadline) {
        const now = new Date();
        const deadlineDate = new Date(deadline);
        const daysLeft = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));
        
        if (daysLeft < 0) return 'deadline-expired';
        if (daysLeft <= 7) return 'deadline-warning';
        if (daysLeft <= 30) return 'deadline-normal';
        return 'deadline-normal';
    }
    
    getDeadlineText(deadline) {
        const now = new Date();
        const deadlineDate = new Date(deadline);
        const daysLeft = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));
        
        if (daysLeft < 0) return '已过期';
        if (daysLeft === 0) return '今天到期';
        if (daysLeft === 1) return '剩余1天';
        return `剩余${daysLeft}天`;
    }
    
    updateUI() {
        this.updateNotificationCount();
        this.updateTaskCounts();
        this.updatePaginationInfo();
    }
    
    updateNotificationCount() {
        if (window.notificationSystem) {
            const unreadCount = window.notificationSystem.notifications.filter(n => !n.read).length;
            document.getElementById('notificationCount').textContent = unreadCount;
            document.getElementById('sidebarNotificationCount').textContent = unreadCount;
        }
    }
    
    updateTaskCounts() {
        document.getElementById('totalTasks').textContent = this.totalTasks;
        
        // 计算待确认任务数量
        const pendingCount = this.tasks.filter(task => task.status === 'pending').length;
        document.getElementById('pendingTasks').textContent = pendingCount;
    }
    
    updatePaginationInfo() {
        const start = (this.currentPage - 1) * this.rowsPerPage + 1;
        const end = Math.min(this.currentPage * this.rowsPerPage, this.totalTasks);
        const paginationInfo = document.querySelector('.pagination-info');
        if (paginationInfo) {
            paginationInfo.textContent = `显示 ${start}-${end} 条，共 ${this.totalTasks} 条记录`;
        }
    }
    
    searchTasks(searchTerm) {
        console.log('搜索任务:', searchTerm);
        this.currentPage = 1;
        this.renderTasks();
    }
    
    applyFilters() {
        console.log('应用筛选');
        this.currentPage = 1;
        this.renderTasks();
    }
    
    clearFilters() {
        document.getElementById('taskSearch').value = '';
        document.getElementById('statusFilter').value = '';
        document.getElementById('typeFilter').value = '';
        document.getElementById('timeFilter').value = '';
        
        this.applyFilters();
    }
    
    showEmptyState() {
        const emptyState = document.getElementById('emptyState');
        if (emptyState) {
            emptyState.style.display = 'block';
        }
    }
    
    hideEmptyState() {
        const emptyState = document.getElementById('emptyState');
        if (emptyState) {
            emptyState.style.display = 'none';
        }
    }
    
    showErrorModal() {
        const modal = document.getElementById('initErrorModal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    showToast(message, type) {
        if (window.notificationSystem) {
            window.notificationSystem.showToast(message, type);
        } else {
            alert(message);
        }
    }
}

// 全局函数
function toggleAdvancedFilters() {
    const filters = document.getElementById('advancedFilters');
    if (filters) {
        filters.classList.toggle('active');
    }
}

function exportData() {
    alert('导出功能开发中...');
}

function newTask() {
    window.location.href = 'new-task.html';
}

function clearFilters() {
    document.getElementById('statusFilter').value = '';
    document.getElementById('typeFilter').value = '';
    document.getElementById('timeFilter').value = '';
    document.getElementById('deadlineFilter').value = '';
    document.getElementById('taskSearch').value = '';
    alert('筛选条件已清除');
}

function applyFilters() {
    alert('筛选条件已应用');
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('任务管理页面加载完成');
    
    // 初始化任务管理器
    window.taskManager = new TaskManager();
    
    // 初始化通知系统（如果尚未初始化）
    if (!window.notificationSystem) {
        window.notificationSystem = new NotificationSystem();
    }
});

// 弹窗函数
function showErrorModal() {
    document.getElementById('initErrorModal').style.display = 'flex';
}

function closeErrorModal() {
    document.getElementById('initErrorModal').style.display = 'none';
}

function refreshPage() {
    window.location.reload();
}

// 任务操作函数
function editTask(taskId) {
    alert(`编辑任务 ${taskId} (功能开发中)`);
}

function viewTask(taskId) {
    window.location.href = `task-detail-admin.html?id=${taskId}`;
}

function deleteTask(taskId) {
    if (confirm('确定要删除这个任务吗？此操作不可撤销。')) {
        alert(`删除任务 ${taskId} (功能开发中)`);
    }
}

// 申请操作函数
function viewApplication(appId) {
    alert(`查看申请 ${appId} (功能开发中)`);
}

function approveApplication(appId) {
    if (confirm('确定要通过这个申请吗？')) {
        alert(`通过申请 ${appId} (功能开发中)`);
    }
}

function rejectApplication(appId) {
    if (confirm('确定要拒绝这个申请吗？')) {
        alert(`拒绝申请 ${appId} (功能开发中)`);
    }
}

function undoApplication(appId) {
    if (confirm('确定要撤销这个申请的审核状态吗？')) {
        alert(`撤销申请 ${appId} (功能开发中)`);
    }
}

function logout() {
    if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('docim_user');
        window.location.href = 'index.html';
    }
}