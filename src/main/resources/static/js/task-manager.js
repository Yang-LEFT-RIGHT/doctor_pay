// js/task-manager.js - 共享任务数据管理器
class TaskManager {
    constructor() {
        this.tasks = this.loadTasksFromStorage();
    }
    
    // 从本地存储加载任务数据
    loadTasksFromStorage() {
        const savedTasks = localStorage.getItem('docim_tasks');
        if (savedTasks) {
            return JSON.parse(savedTasks);
        }
        
        // 默认任务数据
        return [
            {
                id: 1,
                title: "《数据结构》课程助教",
                description: "协助《数据结构》课程的教学工作，包括批改作业、组织实验课、答疑辅导等。需要每周参加课程组会议。",
                type: "课程助教",
                status: "pending",
                publisher: "李教授",
                deadline: "2024-06-15",
                workload: "40小时",
                publishDate: "2024-06-01",
                confirmedAt: null,
                completedHours: 0
            },
            {
                id: 2,
                title: "实验室设备维护管理",
                description: "负责3号实验室的设备日常维护与管理，包括设备检查、故障上报、使用登记等工作。",
                type: "实验管理",
                status: "confirmed",
                publisher: "王主任",
                deadline: "2024-06-10",
                workload: "8小时",
                publishDate: "2024-05-28",
                confirmedAt: "2024-05-20",
                completedHours: 8
            },
            {
                id: 3,
                title: "学术会议组织协助",
                description: "协助筹备国际学术会议，负责部分会务工作，包括资料整理、嘉宾接待、场地协调等。",
                type: "行政助理",
                status: "pending",
                publisher: "学术会议组委会",
                deadline: "2024-06-20",
                workload: "16小时",
                publishDate: "2024-06-05",
                confirmedAt: null,
                completedHours: 0
            },
            {
                id: 4,
                title: "论文评审辅助工作",
                description: "协助导师进行学术论文的初审工作，包括格式检查、参考文献核对、摘要翻译等。",
                type: "科研助理",
                status: "confirmed",
                publisher: "张教授",
                deadline: "2024-06-05",
                workload: "20小时",
                publishDate: "2024-05-25",
                confirmedAt: "2024-05-15",
                completedHours: 20
            },
            {
                id: 5,
                title: "实验数据整理与分析",
                description: "协助整理实验室近期的实验数据，进行初步统计分析，制作数据图表。",
                type: "科研助理",
                status: "pending",
                publisher: "赵研究员",
                deadline: "2024-06-25",
                workload: "12小时",
                publishDate: "2024-06-08",
                confirmedAt: null,
                completedHours: 0
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
                publishDate: "2024-05-30",
                confirmedAt: null,
                completedHours: 0
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
                publishDate: "2024-05-15",
                confirmedAt: null,
                completedHours: 0
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
                publishDate: "2024-06-10",
                confirmedAt: "2024-06-01",
                completedHours: 4
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
                publishDate: "2024-06-03",
                confirmedAt: null,
                completedHours: 0
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
                publishDate: "2024-06-07",
                confirmedAt: "2024-06-05",
                completedHours: 5
            }
        ];
    }
    
    // 保存任务数据到本地存储
    saveTasksToStorage() {
        localStorage.setItem('docim_tasks', JSON.stringify(this.tasks));
    }
    
    // 获取所有任务
    getAllTasks() {
        return this.tasks;
    }
    
    // 根据ID获取任务
    getTaskById(taskId) {
        return this.tasks.find(task => task.id === taskId);
    }
    
    // 更新任务状态
    updateTaskStatus(taskId, newStatus, reason = '') {
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            this.tasks[taskIndex].status = newStatus;
            
            if (newStatus === 'confirmed') {
                this.tasks[taskIndex].confirmedAt = new Date().toISOString().split('T')[0];
            } else if (newStatus === 'rejected') {
                this.tasks[taskIndex].rejectionReason = reason;
            }
            
            this.saveTasksToStorage();
            return true;
        }
        return false;
    }
    
    // 获取统计信息
    getStats() {
        const now = new Date();
        const pendingTasks = this.tasks.filter(task => task.status === 'pending');
        const confirmedTasks = this.tasks.filter(task => task.status === 'confirmed');
        const totalWorkHours = confirmedTasks.reduce((sum, task) => sum + (task.completedHours || 0), 0);
        
        // 检查即将过期的任务
        const expiringSoon = pendingTasks.filter(task => {
            const deadline = new Date(task.deadline);
            const daysUntilDeadline = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
            return daysUntilDeadline <= 3 && daysUntilDeadline > 0;
        });
        
        return {
            pendingCount: pendingTasks.length,
            confirmedCount: confirmedTasks.length,
            totalWorkHours: totalWorkHours,
            expiringSoonCount: expiringSoon.length
        };
    }
    
    // 获取最近任务
    getRecentTasks(limit = 4) {
        return [...this.tasks]
            .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
            .slice(0, limit);
    }
    
    // 获取待处理任务
    getPendingTasks() {
        return this.tasks.filter(task => task.status === 'pending');
    }
    
    // 获取已确认任务
    getConfirmedTasks() {
        return this.tasks.filter(task => task.status === 'confirmed');
    }
}

// 全局任务管理器实例
window.taskManager = new TaskManager();