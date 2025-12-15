package com.paper.project;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.paper.BBM.TaskManager;
import com.paper.Entity.Scholarship_jobs;

import java.sql.SQLException;
import java.util.List;

@Controller
public class TaskListController {
    @GetMapping("/tasklist")
    @ResponseBody
    public List<Scholarship_jobs> tasklist() {
        List<Scholarship_jobs> tasks = null;
        TaskManager taskmanager=null;
        try {
            taskmanager = new TaskManager();
            tasks = taskmanager.getAllTask();
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
        }finally{
            if(taskmanager!=null){
                taskmanager.close();
            }
        }
        System.out.println(tasks.size());
        return tasks;
    }
}