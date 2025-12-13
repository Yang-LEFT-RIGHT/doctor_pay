package com.paper.Entity;

import java.time.LocalDate;

public class Scholarship_jobs {
    private int job_id;
    private String title;
    private boolean is_teaching_assistant;
    private String work_type;
    private String academic_year;
    private String description;
    private int required_number;
    private double workload_credits;
    private int publisher_id;
    private String status;
    private LocalDate application_deadline;
    private LocalDate created_at;
    public int getJob_id(){
        return job_id;
    }
    public void setJob_id(int job_id){
        this.job_id=job_id;
    }
    public String getTitle(){
        return title;
    }
    public void setTitle(String title){
        this.title=title;
    }
    public boolean getIs_teaching_assistant(){
        return is_teaching_assistant;
    }
    public void setIs_teaching_assistant(boolean is_teaching_assistant){
        this.is_teaching_assistant=is_teaching_assistant;
    }
    public String getWork_type(){
        return work_type;
    }
    public void setWork_type(String work_type){
        this.work_type=work_type;
    }
    public String getAcademic_year(){
        return academic_year;
    }
    public void setAcademic_year(String academic_year){
        this.academic_year=academic_year;
    }
    public String getDescription(){
        return description;
    }
    public void setDescription(String description){
        this.description=description;
    }
    public int getRequired_number(){
        return required_number;
    }
    public void setRequired_number(int required_number){
        this.required_number=required_number;
    }
    public double getWorkload_credits(){
        return workload_credits;
    }
    public void setWorkload_credits(double workload_credits){
        this.workload_credits=workload_credits;
    }
    public int getPublisher_id(){
        return publisher_id;
    }
    public void setPublisher_id(int publisher_id){
        this.publisher_id=publisher_id;
    }
    public String getStatus(){
        return status;
    }
    public void setStatus(String status){
        this.status=status;
    }
    public LocalDate getApplication_deadline(){
        return application_deadline;
    }
    public void setApplication_deadline(LocalDate application_deadline){
        this.application_deadline=application_deadline;
    }
    public LocalDate getCreated_at(){
        return created_at;
    }
    public void setCreated_at(LocalDate created_at){
        this.created_at=created_at;
    }
    
}