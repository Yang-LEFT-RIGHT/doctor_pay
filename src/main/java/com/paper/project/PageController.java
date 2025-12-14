package com.paper.project;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 页面控制器，处理所有静态HTML页面的请求
 */
@Controller
public class PageController {
    
    // 学生相关页面
    @RequestMapping("/student-dashboard.html")
    public String studentDashboard() {
        return "student-dashboard";
    }
    
    @RequestMapping("/profile.html")
    public String studentProfile() {
        return "profile";
    }
    
    @RequestMapping("/task-list.html")
    public String studentTaskList() {
        return "task-list";
    }
    
    @RequestMapping("/statistics.html")
    public String studentStatistics() {
        return "statistics";
    }
    
    @RequestMapping("/notification-center.html")
    public String studentNotificationCenter() {
        return "notification-center";
    }
    
    @RequestMapping("/notification-detail.html")
    public String studentNotificationDetail() {
        return "notification-detail";
    }
    
    // 管理员相关页面
    @RequestMapping("/admin-dashboard.html")
    public String adminDashboard() {
        return "admin-dashboard";
    }
    
    @RequestMapping("/admin-profile.html")
    public String adminProfile() {
        return "admin-profile";
    }
    
    @RequestMapping("/admin-management.html")
    public String adminManagement() {
        return "admin-management";
    }
    
    @RequestMapping("/admin-statistics.html")
    public String adminStatistics() {
        return "admin-statistics";
    }
    
    @RequestMapping("/admin-tasks.html")
    public String adminTasks() {
        return "admin-tasks";
    }
    
    @RequestMapping("/student-list.html")
    public String adminStudentList() {
        return "student-list";
    }
    
    @RequestMapping("/new-task.html")
    public String adminNewTask() {
        return "new-task";
    }
    
    @RequestMapping("/task-detail-admin.html")
    public String adminTaskDetail() {
        return "task-detail-admin";
    }
    
    @RequestMapping("/task-stats.html")
    public String adminTaskStats() {
        return "task-stats";
    }
    
    @RequestMapping("/batch-publish.html")
    public String adminBatchPublish() {
        return "batch-publish";
    }
    
    @RequestMapping("/export-data.html")
    public String adminExportData() {
        return "export-data";
    }
    
    // 通用页面
    @RequestMapping("/index.html")
    public String index() {
        return "index";
    }
    
    @RequestMapping("/faq.html")
    public String faq() {
        return "faq";
    }
    
    @RequestMapping("/guide.html")
    public String guide() {
        return "guide";
    }
    
    @RequestMapping("/manual.html")
    public String manual() {
        return "manual";
    }
    
    @RequestMapping("/contact.html")
    public String contact() {
        return "contact";
    }
    
    @RequestMapping("/admin-faq.html")
    public String adminFaq() {
        return "admin-faq";
    }
    
    @RequestMapping("/admin-guide.html")
    public String adminGuide() {
        return "admin-guide";
    }
    
    @RequestMapping("/admin-manual.html")
    public String adminManual() {
        return "admin-manual";
    }
    
    @RequestMapping("/system-settings.html")
    public String systemSettings() {
        return "system-settings";
    }
    
    @RequestMapping("/task-detail.html")
    public String taskDetail() {
        return "task-detail";
    }
    
    @RequestMapping("/task-process.html")
    public String taskProcess() {
        return "task-process";
    }
    
    @RequestMapping("/stats-overview.html")
    public String statsOverview() {
        return "stats-overview";
    }
    
    @RequestMapping("/user-manual.html")
    public String userManual() {
        return "user-manual";
    }
    
    @RequestMapping("/quick-search.html")
    public String quickSearch() {
        return "quick-search";
    }
}