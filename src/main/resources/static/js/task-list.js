// js/task-list.js - 完整修复版（修复分页顺序）
class TaskListManager {
    constructor() {
        this.tasks = [];
        this.filteredTasks = [];
        this.currentPage = 1;
        this.pageSize = 8;
        this.searchKeyword = '';
        this.init();
    }
    
    init() {
        console.log('TaskListManager 初始化开始');
        this.loadTaskData();
        this.bindEvents();
        this.renderTaskList();
        console.log('TaskListManager 初始化完成');
    }
    
    loadTaskData() {
        console.log('加载任务数据');
        this.tasks = [
            {
                id: 1,
                title: "《数据结构》课程助教",
                description: "协助《数据结构》课程的教学工作，包括批改作业、组织实验课、答疑辅导等。需要每周参加课程组会议。",
                type: "课程助教",
                status: "pending",
                publisher: "李教授",
                deadline: "2024-06-15",
                workload: "20小时",
                publishDate: "2024-06-01"
            },
            {
                id: 2,
                title: "实验室设备维护管理",
                description: "负责3号实验室的设备日常维护与管理，包括设备检查、故障上报、使用登记等工作。",
                type: "实验管理",
                status: "confirmed",
                publisher: "王主任",
                deadline: "2024-06-10",
                workload: "15小时",
                publishDate: "2024-05-28"
            },
            {
                id: 3,
                title: "学术会议组织协助",
                description: "协助筹备国际学术会议，负责部分会务工作，包括资料整理、嘉宾接待、场地协调等。",
                type: "行政助理",
                status: "pending",
                publisher: "学术会议组委会",
                deadline: "2024-06-20",
                workload: "25小时",
                publishDate: "2024-06-05"
            },
            {
                id: 4,
                title: "论文评审辅助工作",
                description: "协助导师进行学术论文的初审工作，包括格式检查、参考文献核对、摘要翻译等。",
                type: "科研助理",
                status: "confirmed",
                publisher: "张教授",
                deadline: "2024-06-05",
                workload: "12小时",
                publishDate: "2024-05-25"
            },
            {
                id: 5,
                title: "实验数据整理与分析",
                description: "协助整理实验室近期的实验数据，进行初步统计分析，制作数据图表。",
                type: "科研助理",
                status: "pending",
                publisher: "赵研究员",
                deadline: "2024-06-25",
                workload: "18小时",
                publishDate: "2024-06-08"
            },
            {
                id: 6,
                title: "《机器学习》课程助教",
                description: "协助《机器学习》课程的教学工作，主要负责任业批改和实验课指导。",
                type: "课程助教",
                status: "rejected",
                publisher: "陈教授",
                deadline: "2024-06-12",
                workload: "22小时",
                publishDate: "2024-05-30"
            },
            {
                id: 7,
                title: "学院网站内容维护",
                description: "负责学院网站的新闻更新、通知发布和部分页面维护工作。",
                type: "行政助理",
                status: "expired",
                publisher: "院办公室",
                deadline: "2024-05-30",
                workload: "10小时",
                publishDate: "2024-05-15"
            },
            {
                id: 8,
                title: "新生迎新活动协助",
                description: "协助组织新生迎新活动，包括场地布置、物资准备、新生引导等工作。",
                type: "行政助理",
                status: "confirmed",
                publisher: "学生工作处",
                deadline: "2024-07-10",
                workload: "16小时",
                publishDate: "2024-06-10"
            },
            {
                id: 9,
                title: "文献翻译工作",
                description: "协助翻译英文学术文献，要求专业术语准确，文笔流畅。",
                type: "科研助理",
                status: "pending",
                publisher: "刘教授",
                deadline: "2024-06-18",
                workload: "14小时",
                publishDate: "2024-06-03"
            },
            {
                id: 10,
                title: "实验设备采购协助",
                description: "协助实验室进行设备采购流程，包括供应商联系、报价对比、合同准备等。",
                type: "行政助理",
                status: "confirmed",
                publisher: "实验室管理科",
                deadline: "2024-06-22",
                workload: "20小时",
                publishDate: "2024-06-07"
            }
        ];
        
        console.log('任务数据加载完成，数量:', this.tasks.length);
        this.filteredTasks = [...this.tasks];
    }
    
    bindEvents() {
        console.log('绑定事件开始');
        
        const searchInput = document.getElementById('search-input');
        const searchClear = document.getElementById('search-clear');
        
        if (searchInput && searchClear) {
            searchInput.addEventListener('input', (e) => {
                this.searchKeyword = e.target.value.trim();
                console.log('搜索关键词:', this.searchKeyword);
                if (this.searchKeyword) {
                    searchClear.classList.add('show');
                } else {
                    searchClear.classList.remove('show');
                }
                this.applyFilters();
            });
            
            searchClear.addEventListener('click', () => {
                searchInput.value = '';
                this.searchKeyword = '';
                searchClear.classList.remove('show');
                this.applyFilters();
            });
        }
        
        document.getElementById('task-type').addEventListener('change', () => {
            this.applyFilters();
        });
        
        document.getElementById('task-status').addEventListener('change', () => {
            this.applyFilters();
        });
        
        document.querySelectorAll('.sort-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.handleSortClick(option);
            });
        });
        
        document.getElementById('clearFiltersBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.clearFilters();
        });
        
        document.getElementById('applyFiltersBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.applyFilters();
        });
        
        document.getElementById('prevPageBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.prevPage();
        });
        
        document.getElementById('nextPageBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.nextPage();
        });
        
        this.delegateTaskEvents();
    }
    
    handleSortClick(option) {
        document.querySelectorAll('.sort-option').forEach(opt => {
            opt.classList.remove('active');
        });
        option.classList.add('active');
        this.applyFilters();
    }
    
    renderTaskList() {
        console.log('渲染任务列表开始');
        const container = document.getElementById('task-cards-container');
        const taskCount = document.getElementById('task-count');
        
        if (this.filteredTasks.length === 0) {
            container.innerHTML = this.createEmptyState();
            taskCount.textContent = '0';
            this.updatePagination();
            return;
        }
        
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = Math.min(startIndex + this.pageSize, this.filteredTasks.length);
        const currentTasks = this.filteredTasks.slice(startIndex, endIndex);
        
        container.innerHTML = '';
        currentTasks.forEach(task => {
            const taskCard = this.createTaskCard(task);
            container.appendChild(taskCard);
        });
        
        taskCount.textContent = this.filteredTasks.length;
        
        this.updatePagination();
        this.delegateTaskEvents();
    }
    
    createEmptyState() {
        return `
            <div class="empty-state">
                <div class="empty-state-icon">
                    <i class="fas fa-inbox"></i>
                </div>
                <h3>暂无任务</h3>
                <p>当前筛选条件下没有找到匹配的任务，请尝试调整筛选条件</p>
            </div>
        `;
    }
    
    createTaskCard(task) {
        const card = document.createElement('div');
        card.className = `task-card`;
        card.setAttribute('data-task-id', task.id);
        
        const statusColors = {
            'pending': '#f39c12',
            'confirmed': '#2ecc71',
            'rejected': '#95a5a6',
            'expired': '#e74c3c'
        };
        
        const statusText = {
            'pending': '待确认',
            'confirmed': '已确认',
            'rejected': '已拒绝',
            'expired': '已过期'
        };
        
        const typeColors = {
            '课程助教': '#3498db',
            '实验管理': '#9b59b6',
            '科研助理': '#2ecc71',
            '行政助理': '#e74c3c',
            '其他': '#f39c12'
        };
        
        const statusColor = statusColors[task.status] || '#95a5a6';
        const typeColor = typeColors[task.type] || '#3498db';
        
        card.innerHTML = `
            <div class="task-header">
                <div class="task-title">
                    ${task.title}
                </div>
            </div>
            
            <div class="task-tags">
                <span class="type-tag" style="background-color: ${typeColor}20; color: ${typeColor}">
                    ${task.type}
                </span>
                <span class="status-tag-small" style="background-color: ${statusColor}20; color: ${statusColor}">
                    ${statusText[task.status]}
                </span>
            </div>
            
            <div class="task-description">
                ${task.description}
            </div>
            
            <div class="task-info-bar">
                <div class="task-meta">
                    <div class="meta-item">
                        <span class="meta-label">发布人</span>
                        <span class="meta-value">${task.publisher}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">截止时间</span>
                        <span class="meta-value">${task.deadline}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">工作量</span>
                        <span class="meta-value">${task.workload}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">发布时间</span>
                        <span class="meta-value">${task.publishDate}</span>
                    </div>
                </div>
                
                <div class="task-actions">
                    <button class="action-btn detail" data-action="view" data-task-id="${task.id}">
                        <i class="fas fa-eye"></i>
                        查看详情
                    </button>
                    ${task.status === 'pending' ? `
                    <button class="action-btn confirm" data-action="confirm" data-task-id="${task.id}">
                        <i class="fas fa-check"></i>
                        确认任务
                    </button>
                    <button class="action-btn reject" data-action="reject" data-task-id="${task.id}">
                        <i class="fas fa-times"></i>
                        拒绝
                    </button>
                    ` : ''}
                </div>
            </div>
        `;
        
        card.style.borderLeftColor = statusColor;
        return card;
    }
    
    delegateTaskEvents() {
        const container = document.getElementById('task-cards-container');
        if (!container) return;
        
        container.removeEventListener('click', this.handleContainerClick);
        
        this.handleContainerClick = (e) => {
            const button = e.target.closest('button');
            if (button && button.classList.contains('action-btn')) {
                const action = button.getAttribute('data-action');
                const taskId = parseInt(button.getAttribute('data-task-id'));
                
                if (!action || !taskId) return;
                
                e.preventDefault();
                e.stopPropagation();
                
                switch(action) {
                    case 'view':
                        this.viewTaskDetail(taskId);
                        break;
                    case 'confirm':
                        this.confirmTask(taskId);
                        break;
                    case 'reject':
                        this.rejectTask(taskId);
                        break;
                }
                return;
            }
        };
        
        container.addEventListener('click', this.handleContainerClick);
    }
    
    viewTaskDetail(taskId) {
        window.location.href = `task-detail.html?id=${taskId}`;
    }
    
    confirmTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;
        
        if (confirm(`确认接受任务 "${task.title}" 吗？\n\n工作量：${task.workload}\n截止时间：${task.deadline}\n\n确认后无法更改。`)) {
            task.status = 'confirmed';
            this.showToast(`任务 "${task.title}" 已确认！`, 'success');
            
            if (window.notificationSystem) {
                window.notificationSystem.addNotification(
                    '任务已确认',
                    `您已确认接受任务：${task.title}`,
                    'success',
                    `task-detail.html?id=${taskId}`
                );
            }
            
            this.applyFilters();
        }
    }
    
    rejectTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;
        
        const reason = prompt(`请输入拒绝任务 "${task.title}" 的原因：`);
        if (reason !== null && reason.trim() !== '') {
            task.status = 'rejected';
            this.showToast(`任务 "${task.title}" 已拒绝`, 'info');
            
            if (window.notificationSystem) {
                window.notificationSystem.addNotification(
                    '任务已拒绝',
                    `您已拒绝任务：${task.title}\n原因：${reason}`,
                    'alert',
                    `task-detail.html?id=${taskId}`
                );
            }
            
            this.applyFilters();
        }
    }
    
    applyFilters() {
        const taskType = document.getElementById('task-type').value;
        const taskStatus = document.getElementById('task-status').value;
        const activeSortOption = document.querySelector('.sort-option.active');
        const sortBy = activeSortOption ? activeSortOption.getAttribute('data-sort') : 'deadline';
        
        this.filteredTasks = this.tasks.filter(task => {
            if (taskType !== 'all') {
                const typeMap = {
                    'ta': '课程助教',
                    'lab': '实验管理',
                    'research': '科研助理',
                    'admin': '行政助理',
                    'other': '其他'
                };
                if (task.type !== typeMap[taskType]) {
                    return false;
                }
            }
            
            if (taskStatus !== 'all' && task.status !== taskStatus) {
                return false;
            }
            
            if (this.searchKeyword) {
                const searchLower = this.searchKeyword.toLowerCase();
                const searchFields = [
                    task.title,
                    task.description,
                    task.publisher,
                    task.type
                ];
                
                const hasMatch = searchFields.some(field => 
                    field && field.toLowerCase().includes(searchLower)
                );
                
                if (!hasMatch) {
                    return false;
                }
            }
            
            return true;
        });
        
        this.filteredTasks.sort((a, b) => {
            switch(sortBy) {
                case 'deadline':
                    return new Date(a.deadline) - new Date(b.deadline);
                case 'publish':
                    return new Date(b.publishDate) - new Date(a.publishDate);
                case 'workload':
                    const aHours = parseInt(a.workload) || 0;
                    const bHours = parseInt(b.workload) || 0;
                    return aHours - bHours;
                default:
                    return 0;
            }
        });
        
        this.currentPage = 1;
        this.renderTaskList();
    }
    
    clearFilters() {
        document.getElementById('search-input').value = '';
        this.searchKeyword = '';
        document.getElementById('search-clear').classList.remove('show');
        
        document.getElementById('task-type').value = 'all';
        document.getElementById('task-status').value = 'all';
        
        document.querySelectorAll('.sort-option').forEach(option => {
            option.classList.remove('active');
        });
        const defaultSort = document.querySelector('.sort-option[data-sort="deadline"]');
        if (defaultSort) defaultSort.classList.add('active');
        
        this.filteredTasks = [...this.tasks];
        this.currentPage = 1;
        this.renderTaskList();
        
        this.showToast('所有筛选条件已清除', 'info');
    }
    
    // 修复的分页方法
    updatePagination() {
        const paginationContainer = document.getElementById('paginationContainer');
        const totalPages = Math.ceil(this.filteredTasks.length / this.pageSize);
        
        if (totalPages <= 1) {
            paginationContainer.style.display = 'none';
            return;
        }
        
        paginationContainer.style.display = 'flex';
        
        // 清除现有的页码按钮（除了上一页和下一页）
        const existingPages = paginationContainer.querySelectorAll('.page-number');
        existingPages.forEach(page => page.remove());
        
        // 获取上一页按钮
        const prevBtn = document.getElementById('prevPageBtn');
        if (!prevBtn) return;
        
        // 创建一个文档片段来一次性添加所有页码
        const fragment = document.createDocumentFragment();
        
        // 创建页码按钮，按正确顺序（1, 2, 3...）
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `pagination-btn page-number ${i === this.currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.goToPage(i);
            });
            fragment.appendChild(pageBtn);
        }
        
        // 将页码按钮插入到上一页按钮之后
        prevBtn.after(fragment);
        
        // 更新按钮状态
        const nextBtn = document.getElementById('nextPageBtn');
        prevBtn.disabled = this.currentPage === 1;
        nextBtn.disabled = this.currentPage === totalPages;
    }
    
    goToPage(pageNum) {
        const totalPages = Math.ceil(this.filteredTasks.length / this.pageSize);
        if (pageNum >= 1 && pageNum <= totalPages) {
            this.currentPage = pageNum;
            this.renderTaskList();
            
            const contentArea = document.querySelector('.content-area');
            if (contentArea) {
                contentArea.scrollTop = 0;
            }
        }
    }
    
    prevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.renderTaskList();
            
            const contentArea = document.querySelector('.content-area');
            if (contentArea) {
                contentArea.scrollTop = 0;
            }
        }
    }
    
    nextPage() {
        const totalPages = Math.ceil(this.filteredTasks.length / this.pageSize);
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.renderTaskList();
            
            const contentArea = document.querySelector('.content-area');
            if (contentArea) {
                contentArea.scrollTop = 0;
            }
        }
    }
    
    showToast(message, type = 'info') {
        if (window.notificationSystem && window.notificationSystem.showToast) {
            window.notificationSystem.showToast(message, type);
        } else {
            alert(message);
        }
    }
}

// 在 task-list.js 的 DOMContentLoaded 事件中添加
document.addEventListener('DOMContentLoaded', function() {
    const savedUser = localStorage.getItem('docim_user');
    if (!savedUser) {
        window.location.href = 'index.html';
        return;
    }
    
    // 初始化任务列表管理器
    window.TaskListManager = new TaskListManager();
    
    // 确保通知系统初始化 - 添加延迟以确保DOM完全加载
    setTimeout(() => {
        if (!window.notificationSystem && typeof NotificationSystem !== 'undefined') {
            try {
                window.notificationSystem = new NotificationSystem();
                console.log('通知系统在任务列表页面初始化成功');
            } catch (error) {
                console.error('通知系统初始化失败:', error);
            }
        } else if (window.notificationSystem) {
            console.log('通知系统已存在，更新计数');
            window.notificationSystem.updateNotificationCount();
        }
    }, 500); // 延迟500ms确保DOM完全加载
});

function logout() {
    if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('docim_user');
        window.location.href = 'index.html';
    }
}