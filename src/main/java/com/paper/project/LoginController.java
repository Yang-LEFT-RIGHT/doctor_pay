package com.paper.project;

import java.sql.SQLException;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import java.util.HashMap;
import java.util.Map;

import com.paper.BBM.UserManager;
import com.paper.Entity.Students;

import com.paper.Entity.LoginRequest;



@Controller
public class LoginController {
    //@RequestMapping("/login")
    @PostMapping("/login")
    @ResponseBody
    public Object login(@RequestBody LoginRequest loginRequest) throws ClassNotFoundException, SQLException{
        Students student=new Students();
        UserManager usermanager=new UserManager();

        if(loginRequest.getRole().equals("student")){
            student.setStudent_id(loginRequest.getUsername());
            student.setPassword(loginRequest.getPassword());
            if(usermanager.login_Stu(student)){
                student=usermanager.fetch_info_Stu(student.getStudent_id());
                Map<String,Object> response=new HashMap<>();
                response.put("message", "登录成功");
                response.put("code",1);
                response.put("student",student);
                return response;
            }
            else{
                Map<String,Object> response=new HashMap<>();
                response.put("message", "用户名或密码错误");
                response.put("code",0);
                return response;
            }
        }
        /*else if(loginRequest.getRole().equals("admin")){
            Teachers teacher=new Teachers();
            teacher.setName(loginRequest.getUsername());
            teacher.setPassword(loginRequest.getPassword());
            if(usermanager.login_Teacher(teacher)){
                return "登录成功";
            }
            else{
                return "用户名或密码错误";
            }
        }*/
        else{
            Map<String,Object> response=new HashMap<>();
            response.put("message", "角色错误");
            response.put("code",0);
            return response;
        }
    }
}