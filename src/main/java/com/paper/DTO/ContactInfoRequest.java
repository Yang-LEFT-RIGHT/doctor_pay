package com.paper.DTO;

public class ContactInfoRequest {
    private String phone;
    private String email;
    private String wechat_id;
    private String student_id;

    public String getPhone() {
        return phone;
    }
    public void setPhone(String phone) {
        this.phone = phone;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getWechat_id() {
        return wechat_id;
    }
    public void setWechat_id(String wechat_id) {
        this.wechat_id = wechat_id;
    }
    public String getStudent_id() {
        return student_id;
    }
    public void setStudent_id(String student_id) {
        this.student_id = student_id;
    }
}
