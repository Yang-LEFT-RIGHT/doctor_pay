package com.paper.Entity;

import java.time.LocalDateTime;

public class Applications {
    private int application_id;
    private String student_id;
    private int job_id;
    private String status;
    private boolean confirmed_with_teacher;
    private LocalDateTime applied_at;
    private LocalDateTime reviewed_at;
    private int reviewed_by;
    public int getApplication_id(){
        return application_id;
    }
    public void setApplication_id(int application_id){
        this.application_id=application_id;
    }
    public String getStudent_id(){
        return student_id;
    }
    public void setStudent_id(String student_id){
        this.student_id=student_id;
    }
    public int getJob_id(){
        return job_id;
    }
    public void setJob_id(int job_id){
        this.job_id=job_id;
    }
    public String getStatus(){
        return status;
    }
    public void setStatus(String status){
        this.status=status;
    }
    public boolean getConfirmed_with_teacher(){
        return confirmed_with_teacher;
    }
    public void setConfirmed_with_teacher(boolean confirmed_with_teacher){
        this.confirmed_with_teacher=confirmed_with_teacher;
    }
    public LocalDateTime getApplied_at(){
        return applied_at;
    }
    public void setApplied_at(LocalDateTime applied_at){
        this.applied_at=applied_at;
    }
    public LocalDateTime getReviewed_at(){
        return reviewed_at;
    }
    public void setReviewed_at(LocalDateTime reviewed_at){
        this.reviewed_at=reviewed_at;
    }
    public int getReviewed_by(){
        return reviewed_by;
    }
    public void setReviewed_by(int reviewed_by){
        this.reviewed_by=reviewed_by;
    }
}
