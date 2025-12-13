package com.paper.Entity;

import java.time.LocalDate;

public class Supervisors {
    private int supervisor_id;
    private String name;
    private String email;
    private LocalDate created_at;
    private LocalDate updated_at;
    public int getSupervisor_id(){
        return supervisor_id;
    }
    public void setSupervisor_id(int supervisor_id){
        this.supervisor_id=supervisor_id;
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
}
