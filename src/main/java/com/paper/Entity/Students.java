package com.paper.Entity;

import java.time.LocalDate;

public class Students {
    private String student_id;
    private String name;
    private String email;
    private String phone;
    private String wechat_id;
    private String student_type;
    private String supervisor_id;
    private String major;
    private int enrollment_year;
    private String training_mode;
    private LocalDate created_at;
    private LocalDate updated_at;
    private String password;
    public String getStudent_id(){
        return student_id;
    }
    public void setStudent_id(String student_id){
        this.student_id=student_id;
    }
    public String getName(){
        return name;
    }
    public void setName(String name){
        this.name=name;
    }
    public String getEmail(){
        return email;
    }
    public void setEmail(String email){
        this.email=email;
    }
    public String getPhone(){
        return phone;
    }
    public void setPhone(String phone){
        this.phone=phone;
    }
    public String getWechat_id(){
        return wechat_id;
    }
    public void setWechat_id(String wechat_id){
        this.wechat_id=wechat_id;
    }
    public String getStudent_type(){
        return student_type;
    }
    public void setStudent_type(String student_type){
        this.student_type=student_type;
    }
    public String getSupervisor_id(){
        return supervisor_id;
    }
    public void setSupervisor_id(String supervisor_id){
        this.supervisor_id=supervisor_id;
    }
    public String getMajor(){
        return major;
    }
    public void setMajor(String major){
        this.major=major;
    }
    public int getEnrollment_year(){
        return enrollment_year;
    }
    public void setEnrollment_year(int enrollment_year){
        this.enrollment_year=enrollment_year;
    }
    public String getTraining_mode(){
        return training_mode;
    }
    public void setTraining_mode(String training_mode){
        this.training_mode=training_mode;
    }
    public LocalDate getCreated_at(){
        return created_at;
    }
    public void setCreated_at(LocalDate created_at){
        this.created_at=created_at;
    }
    public LocalDate getUpdated_at(){
        return updated_at;
    }
    public void setUpdated_at(LocalDate updated_at){
        this.updated_at=updated_at;
    }
    public String getPassword(){
        return password;
    }
    public void setPassword(String password){
        this.password=password;
    }
}