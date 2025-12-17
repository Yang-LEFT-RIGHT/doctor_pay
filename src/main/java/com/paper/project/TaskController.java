package com.paper.project;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import com.paper.Entity.Applications;
import com.paper.BBM.TaskManager;

import java.sql.SQLException;
import org.springframework.stereotype.Controller;

@Controller
public class TaskController {
    @PostMapping("/task/confirm")
    @ResponseBody
    public String confirmTask(@RequestBody Applications application) {
        TaskManager taskManager =null;
        try {
            taskManager = new TaskManager();
            taskManager.addTaskApplication(application);
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
            System.out.println("申请存储失败");
            return "error";
        }finally{
            if (taskManager != null) {
                taskManager.close();
            }
        }
        return "success";
    }
}
