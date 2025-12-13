package com.paper.Entity;

import java.time.LocalDate;

public class Work_records {
    private int record_id;
    private String student_id;
    private double workload_credits;
    private String academic_year;
    private String semester;
    private String confirmation_status;
    private int confirmed_by;
    private LocalDate confirmed_at;
    private LocalDate created_at;
    public int getRecord_id(){
        return record_id;
    }
    public void setRecord_id(int record_id){
        this.record_id=record_id;
    }
    public String getStudent_id(){
        return student_id;
    }
    public void setStudent_id(String student_id){
        this.student_id=student_id;
    }
    public double getWorkload_credits(){
        return workload_credits;
    }
    public void setWorkload_credits(double workload_credits){
        this.workload_credits=workload_credits;
    }
    public String getAcademic_year(){
        return academic_year;
    }
    public void setAcademic_year(String academic_year){
        this.academic_year=academic_year;
    }
    public String getSemester(){
        return semester;
    }
    public void setSemester(String semester){
        this.semester=semester;
    }
    public String getConfirmation_status(){
        return confirmation_status;
    }
    public void setConfirmation_status(String confirmation_status){
        this.confirmation_status=confirmation_status;
    }
    public int getConfirmed_by(){
        return confirmed_by;
    }
    public void setConfirmed_by(int confirmed_by){
        this.confirmed_by=confirmed_by;
    }
    public LocalDate getConfirmed_at(){
        return confirmed_at;
    }
    public void setConfirmed_at(LocalDate confirmed_at){
        this.confirmed_at=confirmed_at;
    }
    public LocalDate getCreated_at(){
        return created_at;
    }
    public void setCreated_at(LocalDate created_at){
        this.created_at=created_at;
    }
}
