package com.paper.project;

import com.paper.DTO.BasicInfoRequest;
import com.paper.Entity.Students;
import com.paper.BBM.UserManager;
import com.paper.DTO.ContactInfoRequest;



import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ResponseBody;
import java.sql.SQLException;



@Controller
public class SaveController {
    @PostMapping("/save-basic-info")
    @ResponseBody
    public Object saveBasicInfo(@RequestBody BasicInfoRequest basicInfoRequest) throws ClassNotFoundException, SQLException {
        // 处理基本信息保存逻辑
        Students student=new Students();
        UserManager userManager=null;
        
        try {
            userManager=new UserManager();
            student.setName(basicInfoRequest.getName());
            student.setStudent_id(basicInfoRequest.getStudent_id());
            // 将String类型转换为int类型
            int enrollmentYear = Integer.parseInt(basicInfoRequest.getEnrollment());
            student.setEnrollment_year(enrollmentYear);
            student.setSupervisor_id(basicInfoRequest.getSupervisor());
            student.setMajor(basicInfoRequest.getMajor());
            student.setTraining_mode(basicInfoRequest.getProgram_type());
            String gender = basicInfoRequest.getGender();
            if ("male".equalsIgnoreCase(gender)) {
                student.setGender("男");
            } else if ("female".equalsIgnoreCase(gender)) {
                student.setGender("女");
            } else {
                return "基本信息保存失败: 性别格式错误";
            }
            //System.out.println("student:"+student.getGender());
            
            String result = userManager.updateDetailInfo_Stu(student);
            if (result.isEmpty()) {
                return "基本信息保存成功";
            } else {
                System.out.println("基本信息保存失败:" + result);
                return "基本信息保存失败: " + result;
            }
        } catch (SQLException e) {
            System.out.println("基本信息保存失败:"+e);
            e.printStackTrace();
            return "基本信息保存失败: " + e.getMessage();
        } finally {
            // 确保关闭数据库连接
            if (userManager != null) {
                userManager.close();
            }
        }
    }

    @PostMapping("/save-contant-info")
    @ResponseBody
    public Object saveContactInfo(@RequestBody ContactInfoRequest contactInfoRequest) throws ClassNotFoundException, SQLException {
        // 处理联系信息保存逻辑
        Students student=new Students();
        UserManager userManager=null;
        try {
            userManager=new UserManager();
            student.setPhone(contactInfoRequest.getPhone());
            student.setEmail(contactInfoRequest.getEmail());
            student.setWechat_id(contactInfoRequest.getWechat_id());
            student.setStudent_id(contactInfoRequest.getStudent_id());
            String result = userManager.updateContactInfo_Stu(student);
            if (result.isEmpty()) {
                return "联系信息保存成功";
            } else {
                System.out.println("联系信息保存失败:" + result);
                return "联系信息保存失败: " + result;
            }
        } catch (SQLException e) {
            System.out.println("联系信息保存失败:"+e);
            e.printStackTrace();
            return "联系信息保存失败: " + e.getMessage();
        } finally {
            // 确保关闭数据库连接
            if (userManager != null) {
                userManager.close();
            }
        }
    }
}