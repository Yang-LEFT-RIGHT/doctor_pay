// js/student-list.js - 博士生管理JavaScript

class StudentManager {
    constructor() {
        this.currentPage = 1;
        this.rowsPerPage = 20;
        this.totalStudents = 15;
        this.totalPages = 1;
        this.currentView = 'table';
        this.currentSort = 'name';
        this.init();
    }
    
    init() {
        console.log('博士生管理页面初始化');
        
        try {
            // 检查登录状态
            if (!this.checkAuth()) {
                return;
            }
            
            // 绑定事件
            this.bindEvents();
            
            // 初始化通知系统
            this.initNotificationSystem();
            
            // 加载数据
            this.loadStudents();
            
            // 更新界面
            this.updateUI();
            
            console.log('博士生管理页面初始化完成');
            
        } catch (error) {
            console.error('博士生管理页面初始化失败:', error);
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
            
            // 更新用户名显示
            const user = JSON.parse(userData);
            const usernameElement = document.getElementById('username');
            if (usernameElement) {
                usernameElement.textContent = user.name + (user.role === 'admin' ? '老师' : '博士');
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
        console.log('绑定博士生管理事件...');
        
        // 搜索框事件
        const searchInput = document.getElementById('studentSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchStudents(e.target.value);
            });
            
            // 防抖处理
            this.debouncedSearch = this.debounce(this.searchStudents.bind(this), 300);
        }
        
        // 清除搜索按钮
        const clearSearch = document.getElementById('clearSearch');
        if (clearSearch) {
            clearSearch.addEventListener('click', () => {
                searchInput.value = '';
                this.searchStudents('');
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
    
    loadStudents() {
        console.log('加载博士生数据...');
        
        // 模拟博士生数据
        this.students = [
            {
                id: 1,
                name: '张三',
                number: 'PB2301001',
                avatar: '张',
                email: 'zhangsan@university.edu.cn',
                phone: '13800138001',
                department: '计算机学院',
                major: '计算机科学与技术',
                advisor: '王教授',
                year: '2022',
                status: 'active',
                tasks: {
                    total: 8,
                    pending: 1,
                    completed: 6,
                    rejected: 1,
                    stipend: '¥5,600'
                }
            },
            {
                id: 2,
                name: '李四',
                number: 'PB2301002',
                avatar: '李',
                email: 'lisi@university.edu.cn',
                phone: '13800138002',
                department: '电子信息学院',
                major: '电子与通信工程',
                advisor: '李教授',
                year: '2021',
                status: 'active',
                tasks: {
                    total: 12,
                    pending: 0,
                    completed: 11,
                    rejected: 1,
                    stipend: '¥8,400'
                }
            },
            {
                id: 3,
                name: '王五',
                number: 'PB2301003',
                avatar: '王',
                email: 'wangwu@university.edu.cn',
                phone: '13800138003',
                department: '自动化学院',
                major: '控制科学与工程',
                advisor: '张教授',
                year: '2023',
                status: 'active',
                tasks: {
                    total: 3,
                    pending: 2,
                    completed: 1,
                    rejected: 0,
                    stipend: '¥2,100'
                }
            },
            {
                id: 4,
                name: '赵六',
                number: 'PB2301004',
                avatar: '赵',
                email: 'zhaoliu@university.edu.cn',
                phone: '13800138004',
                department: '计算机学院',
                major: '软件工程',
                advisor: '刘教授',
                year: '2020',
                status: 'graduated',
                tasks: {
                    total: 15,
                    pending: 0,
                    completed: 14,
                    rejected: 1,
                    stipend: '¥10,500'
                }
            },
            {
                id: 5,
                name: '孙七',
                number: 'PB2301005',
                avatar: '孙',
                email: 'sunqi@university.edu.cn',
                phone: '13800138005',
                department: '管理学院',
                major: '管理科学与工程',
                advisor: '陈教授',
                year: '2022',
                status: 'suspended',
                tasks: {
                    total: 5,
                    pending: 1,
                    completed: 3,
                    rejected: 1,
                    stipend: '¥3,500'
                }
            },
            {
                id: 6,
                name: '周八',
                number: 'PB2301006',
                avatar: '周',
                email: 'zhouba@university.edu.cn',
                phone: '13800138006',
                department: '人工智能学院',
                major: '人工智能',
                advisor: '黄教授',
                year: '2023',
                status: 'inactive',
                tasks: {
                    total: 0,
                    pending: 0,
                    completed: 0,
                    rejected: 0,
                    stipend: '¥0'
                }
            }
        ];
        
        this.renderStudents();
    }
    
    renderStudents() {
        console.log('渲染博士生列表...');
        
        // 筛选和排序博士生
        let filteredStudents = this.filterStudents();
        filteredStudents = this.sortStudents(filteredStudents);
        
        // 分页
        const startIndex = (this.currentPage - 1) * this.rowsPerPage;
        const endIndex = startIndex + this.rowsPerPage;
        const pageStudents = filteredStudents.slice(startIndex, endIndex);
        
        // 更新计数
        this.totalStudents = filteredStudents.length;
        this.totalPages = Math.ceil(this.totalStudents / this.rowsPerPage) || 1;
        
        // 更新UI
        this.updatePaginationInfo();
        this.updateStudentCounts();
        
        if (pageStudents.length === 0) {
            this.showEmptyState();
            return;
        }
        
        this.hideEmptyState();
        
        if (this.currentView === 'table') {
            this.renderTableView(pageStudents);
        } else {
            this.renderCardView(pageStudents);
        }
    }
    
    filterStudents() {
        let filtered = [...this.students];
        
        // 应用搜索过滤
        const searchTerm = document.getElementById('studentSearch')?.value.toLowerCase() || '';
        if (searchTerm) {
            filtered = filtered.filter(student => 
                student.name.toLowerCase().includes(searchTerm) ||
                student.number.toLowerCase().includes(searchTerm) ||
                student.department.toLowerCase().includes(searchTerm) ||
                student.major.toLowerCase().includes(searchTerm)
            );
        }
        
        // 应用状态过滤
        const statusFilter = document.getElementById('statusFilter')?.value;
        if (statusFilter) {
            filtered = filtered.filter(student => student.status === statusFilter);
        }
        
        // 应用学院过滤
        const departmentFilter = document.getElementById('departmentFilter')?.value;
        if (departmentFilter) {
            filtered = filtered.filter(student => 
                student.department.includes(this.getDepartmentText(departmentFilter))
            );
        }
        
        // 应用年份过滤
        const yearFilter = document.getElementById('yearFilter')?.value;
        if (yearFilter) {
            filtered = filtered.filter(student => student.year === yearFilter);
        }
        
        return filtered;
    }
    
    sortStudents(students) {
        return students.sort((a, b) => {
            let valueA, valueB;
            
            switch(this.currentSort) {
                case 'name':
                    valueA = a.name;
                    valueB = b.name;
                    break;
                case 'tasks':
                    valueA = b.tasks.total;
                    valueB = a.tasks.total;
                    break;
                case 'stipend':
                    valueA = parseFloat(b.tasks.stipend.replace('¥', '').replace(',', ''));
                    valueB = parseFloat(a.tasks.stipend.replace('¥', '').replace(',', ''));
                    break;
                case 'year':
                    valueA = b.year;
                    valueB = a.year;
                    break;
                default:
                    valueA = a.name;
                    valueB = b.name;
            }
            
            if (typeof valueA === 'string') {
                return valueA.localeCompare(valueB, 'zh-CN');
            } else {
                return valueA - valueB;
            }
        });
    }
    
    renderTableView(students) {
        const tbody = document.getElementById('studentsTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = students.map(student => `
            <tr data-student-id="${student.id}">
                <td>
                    <div class="student-info-cell">
                        <div class="student-avatar">${student.avatar}</div>
                        <div class="student-details">
                            <div class="student-name">${student.name} 博士</div>
                            <div class="student-meta">
                                <div class="student-meta-item">
                                    <i class="fas fa-id-card"></i>
                                    <span>${student.number}</span>
                                </div>
                                <div class="student-meta-item">
                                    <i class="fas fa-graduation-cap"></i>
                                    <span>${student.department}</span>
                                </div>
                                <div class="student-meta-item">
                                    <i class="fas fa-user-tie"></i>
                                    <span>${student.advisor}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="contact-info">
                        <div class="contact-item">
                            <i class="fas fa-envelope"></i>
                            <span>${student.email}</span>
                        </div>
                        <div class="contact-item">
                            <i class="fas fa-phone"></i>
                            <span>${student.phone || '未填写'}</span>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="status-badge status-${student.status}">
                        ${this.getStatusText(student.status)}
                    </span>
                </td>
                <td>
                    <div class="tasks-stats">
                        <div class="task-stat-item">
                            <span class="task-stat-label">总任务数</span>
                            <span class="task-stat-value">${student.tasks.total}</span>
                        </div>
                        <div class="task-stat-item">
                            <span class="task-stat-label">待确认</span>
                            <span class="task-stat-value ${student.tasks.pending > 0 ? 'highlight' : ''}">
                                ${student.tasks.pending}
                            </span>
                        </div>
                        <div class="task-stat-item">
                            <span class="task-stat-label">津贴总额</span>
                            <span class="task-stat-value">${student.tasks.stipend}</span>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit-btn" title="编辑" onclick="studentManager.editStudent(${student.id})">
                            <i class="far fa-edit"></i>
                        </button>
                        <button class="action-btn view-btn" title="查看详情" onclick="studentManager.viewStudent(${student.id})">
                            <i class="far fa-eye"></i>
                        </button>
                        <button class="action-btn task-btn" title="分配任务" onclick="studentManager.assignTask(${student.id})">
                            <i class="fas fa-tasks"></i>
                        </button>
                        <button class="action-btn delete-btn" title="删除" onclick="studentManager.deleteStudent(${student.id})">
                            <i class="far fa-trash-alt"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
    
    renderCardView(students) {
        const grid = document.getElementById('studentsGrid');
        if (!grid) return;
        
        grid.innerHTML = students.map(student => `
            <div class="student-card" data-student-id="${student.id}">
                <div class="student-card-header">
                    <div class="student-card-avatar">${student.avatar}</div>
                    <div class="student-card-info">
                        <h4>${student.name} 博士</h4>
                        <div class="student-card-meta">
                            <div>${student.number} · ${student.department}</div>
                            <div>${student.year}级 · ${this.getStatusText(student.status)}</div>
                        </div>
                    </div>
                </div>
                
                <div class="student-card-body">
                    <div class="student-card-stats">
                        <div class="stat-item">
                            <div class="stat-value">${student.tasks.total}</div>
                            <div class="stat-label">总任务数</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${student.tasks.pending}</div>
                            <div class="stat-label">待确认</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${student.tasks.completed}</div>
                            <div class="stat-label">已完成</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${student.tasks.stipend}</div>
                            <div class="stat-label">津贴总额</div>
                        </div>
                    </div>
                    
                    <div class="contact-info" style="margin-bottom: 10px;">
                        <div class="contact-item">
                            <i class="fas fa-envelope"></i>
                            <span>${student.email}</span>
                        </div>
                        <div class="contact-item">
                            <i class="fas fa-user-tie"></i>
                            <span>导师：${student.advisor}</span>
                        </div>
                    </div>
                </div>
                
                <div class="student-card-actions">
                    <button class="btn btn-small btn-edit" onclick="studentManager.editStudent(${student.id})">编辑</button>
                    <button class="btn btn-small btn-view" onclick="studentManager.viewStudent(${student.id})">详情</button>
                    <button class="btn btn-small btn-primary" onclick="studentManager.assignTask(${student.id})">分配任务</button>
                </div>
            </div>
        `).join('');
    }
    
    getDepartmentText(code) {
        const departments = {
            'computer': '计算机学院',
            'electronic': '电子信息学院',
            'automation': '自动化学院',
            'management': '管理学院',
            'ai': '人工智能学院'
        };
        return departments[code] || code;
    }
    
    getStatusText(status) {
        const statuses = {
            'active': '活跃',
            'graduated': '已毕业',
            'suspended': '休学',
            'inactive': '未激活'
        };
        return statuses[status] || '未知';
    }
    
    updateUI() {
        this.updateNotificationCount();
        this.updateStudentCounts();
        this.updatePaginationInfo();
        this.renderPagination();
        this.updateStats();
    }
    
    updateNotificationCount() {
        if (window.notificationSystem) {
            const unreadCount = window.notificationSystem.notifications.filter(n => !n.read).length;
            document.getElementById('notificationCount').textContent = unreadCount;
            document.getElementById('sidebarNotificationCount').textContent = unreadCount;
        }
    }
    
    updateStudentCounts() {
        document.getElementById('totalStudents').textContent = this.totalStudents;
        document.getElementById('filteredCount').textContent = this.totalStudents;
    }
    
    updateStats() {
        // 计算活跃学生数量
        const activeCount = this.students.filter(student => student.status === 'active').length;
        document.getElementById('activeStudents').textContent = activeCount;
        
        // 计算总任务数
        const totalTasks = this.students.reduce((sum, student) => sum + student.tasks.total, 0);
        document.getElementById('totalTasks').textContent = totalTasks;
        
        // 计算总津贴
        const totalStipend = this.students.reduce((sum, student) => {
            const stipend = parseFloat(student.tasks.stipend.replace('¥', '').replace(',', '')) || 0;
            return sum + stipend;
        }, 0);
        document.getElementById('totalStipend').textContent = '¥' + totalStipend.toLocaleString();
    }
    
    updatePaginationInfo() {
        const start = (this.currentPage - 1) * this.rowsPerPage + 1;
        const end = Math.min(this.currentPage * this.rowsPerPage, this.totalStudents);
        document.getElementById('paginationInfo').textContent = 
            `显示 ${start}-${end} 条，共 ${this.totalStudents} 条记录`;
        
        // 更新分页按钮状态
        const prevBtn = document.getElementById('prevPageBtn');
        const nextBtn = document.getElementById('nextPageBtn');
        
        if (prevBtn) prevBtn.disabled = this.currentPage <= 1;
        if (nextBtn) nextBtn.disabled = this.currentPage >= this.totalPages;
    }
    
    renderPagination() {
        const container = document.getElementById('pageNumbers');
        if (!container) return;
        
        let pages = [];
        
        // 总是显示第一页
        if (this.totalPages > 0) pages.push(1);
        
        // 计算中间页码
        let startPage = Math.max(2, this.currentPage - 1);
        let endPage = Math.min(this.totalPages - 1, this.currentPage + 1);
        
        // 添加省略号
        if (startPage > 2) {
            pages.push('...');
        }
        
        // 添加中间页码
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        
        // 添加省略号
        if (endPage < this.totalPages - 1) {
            pages.push('...');
        }
        
        // 总是显示最后一页
        if (this.totalPages > 1 && !pages.includes(this.totalPages)) {
            pages.push(this.totalPages);
        }
        
        container.innerHTML = pages.map(page => {
            if (page === '...') {
                return `<span class="page-ellipsis">...</span>`;
            }
            return `
                <button class="page-number ${page === this.currentPage ? 'active' : ''}" 
                        onclick="studentManager.goToPage(${page})">
                    ${page}
                </button>
            `;
        }).join('');
    }
    
    searchStudents(searchTerm) {
        console.log('搜索博士生:', searchTerm);
        this.currentPage = 1;
        this.renderStudents();
    }
    
    applyFilters() {
        console.log('应用筛选');
        this.currentPage = 1;
        
        // 更新排序
        const sortFilter = document.getElementById('sortFilter');
        if (sortFilter) {
            this.currentSort = sortFilter.value;
        }
        
        this.renderStudents();
    }
    
    clearFilters() {
        document.getElementById('studentSearch').value = '';
        document.getElementById('statusFilter').value = '';
        document.getElementById('departmentFilter').value = '';
        document.getElementById('yearFilter').value = '';
        document.getElementById('sortFilter').value = 'name';
        
        this.applyFilters();
    }
    
    switchView(view) {
        this.currentView = view;
        
        // 更新视图按钮状态
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
            event.target.classList.add('active');
        });
        
        // 切换视图显示
        document.getElementById('tableView').style.display = view === 'table' ? 'block' : 'none';
        document.getElementById('cardView').style.display = view === 'card' ? 'block' : 'none';
        
        // 重新渲染博士生
        this.renderStudents();
    }
    
    goToPage(page) {
        if (page < 1 || page > this.totalPages || page === this.currentPage) return;
        this.currentPage = page;
        this.renderStudents();
    }
    
    prevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.renderStudents();
        }
    }
    
    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.renderStudents();
        }
    }
    
    changeRowsPerPage() {
        const select = document.getElementById('rowsPerPage');
        if (select) {
            this.rowsPerPage = parseInt(select.value);
            this.currentPage = 1;
            this.renderStudents();
        }
    }
    
    showEmptyState() {
        document.getElementById('emptyState').style.display = 'block';
        document.getElementById('tableView').style.display = 'none';
        document.getElementById('cardView').style.display = 'none';
    }
    
    hideEmptyState() {
        document.getElementById('emptyState').style.display = 'none';
    }
    
    addStudent() {
        document.getElementById('addStudentModal').classList.add('active');
    }
    
    closeAddStudentModal() {
        document.getElementById('addStudentModal').classList.remove('active');
        document.getElementById('addStudentForm').reset();
    }
    
    handleAddStudent(event) {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);
        const studentData = Object.fromEntries(formData.entries());
        
        console.log('添加博士生:', studentData);
        
        // 这里可以添加实际的API调用
        
        this.showToast('博士生添加成功', 'success');
        this.closeAddStudentModal();
        
        // 重新加载数据
        this.loadStudents();
        
        return false;
    }
    
    editStudent(studentId) {
        console.log('编辑博士生:', studentId);
        // 这里可以跳转到编辑页面或打开编辑模态框
        this.showToast('编辑功能开发中...', 'info');
    }
    
    viewStudent(studentId) {
        console.log('查看博士生详情:', studentId);
        window.location.href = `student-detail.html?id=${studentId}`;
    }
    
    assignTask(studentId) {
        console.log('分配任务给博士生:', studentId);
        window.location.href = `assign-task.html?student=${studentId}`;
    }
    
    deleteStudent(studentId) {
        if (confirm('确定要删除这个博士生吗？此操作将删除所有相关数据，不可撤销。')) {
            console.log('删除博士生:', studentId);
            // 这里添加实际删除逻辑
            
            this.showToast('博士生删除成功', 'success');
            this.loadStudents();
        }
    }
    
    importStudents() {
        this.showToast('批量导入功能开发中...', 'info');
    }
    
    exportData() {
        this.showToast('数据导出功能开发中...', 'info');
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
    
    showError(message) {
        alert(message);
    }
}

// 全局函数
function toggleFilters() {
    const filters = document.getElementById('filterSection');
    filters.classList.toggle('active');
}

function switchView(view) {
    if (window.studentManager) {
        window.studentManager.switchView(view);
    }
}

function addStudent() {
    if (window.studentManager) {
        window.studentManager.addStudent();
    }
}

function closeAddStudentModal() {
    if (window.studentManager) {
        window.studentManager.closeAddStudentModal();
    }
}

function handleAddStudent(event) {
    if (window.studentManager) {
        return window.studentManager.handleAddStudent(event);
    }
    return false;
}

function importStudents() {
    if (window.studentManager) {
        window.studentManager.importStudents();
    }
}

function exportData() {
    if (window.studentManager) {
        window.studentManager.exportData();
    }
}

function clearFilters() {
    if (window.studentManager) {
        window.studentManager.clearFilters();
    }
}

function applyFilters() {
    if (window.studentManager) {
        window.studentManager.applyFilters();
    }
}

function prevPage() {
    if (window.studentManager) {
        window.studentManager.prevPage();
    }
}

function nextPage() {
    if (window.studentManager) {
        window.studentManager.nextPage();
    }
}

function changeRowsPerPage() {
    if (window.studentManager) {
        window.studentManager.changeRowsPerPage();
    }
}

function logout() {
    if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('docim_user');
        window.location.href = 'index.html';
    }
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('博士生管理页面加载完成');
    
    // 初始化博士生管理器
    window.studentManager = new StudentManager();
    
    // 初始化通知系统（如果尚未初始化）
    if (!window.notificationSystem) {
        window.notificationSystem = new NotificationSystem();
    }
    
    // 清除搜索按钮
    const clearSearchBtn = document.getElementById('clearSearch');
    const searchInput = document.getElementById('studentSearch');
    
    if (clearSearchBtn && searchInput) {
        clearSearchBtn.addEventListener('click', function() {
            searchInput.value = '';
            searchInput.focus();
            if (window.studentManager) {
                window.studentManager.searchStudents('');
            }
        });
        
        // 搜索框输入事件
        searchInput.addEventListener('input', function() {
            clearSearchBtn.style.display = this.value ? 'flex' : 'none';
        });
        
        // 初始化清除按钮状态
        clearSearchBtn.style.display = searchInput.value ? 'flex' : 'none';
    }
});