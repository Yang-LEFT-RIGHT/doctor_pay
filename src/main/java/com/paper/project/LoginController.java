package com.paper.project;

import java.sql.SQLException;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.paper.BBM.UserManager;
import com.paper.Entity.Students;

@Controller
public class LoginController {
    @RequestMapping("/login")
    @ResponseBody
    public String login(String uname,String password) throws ClassNotFoundException, SQLException{
        Students student=new Students();
        UserManager usermanager=new UserManager();
        student.setName(uname);
        student.setPassword(password);
        if(usermanager.login_Stu(student)){
            return "登录成功";
        }
        else{
            return "用户名或密码错误";
        }
    }
}