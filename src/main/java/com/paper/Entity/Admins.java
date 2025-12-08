package com.paper.Entity;

import java.time.LocalDateTime;

public class Admins {
    private int admin_id;
    private String username;
    private String password_hash;
    private String role;
    private String email;
    private LocalDateTime created_at;
    private LocalDateTime updated_at;
    public int getAdmin_id(){
        return admin_id;
    }
    public void setAdmin_id(int admin_id){
        this.admin_id=admin_id;
    }
    public String getUsername(){
        return username;
    }
    public void setUsername(String username){
        this.username=username;
    }
    public String getPassword_hash(){
        return password_hash;
    }
    public void setPassword_hash(String password_hash){
        this.password_hash=password_hash;
    }
    public String getRole(){
        return role;
    }
    public void setRole(String role){
        this.role=role;
    }
    public String getEmail(){
        return email;
    }
    public void setEmail(String email){
        this.email=email;
    }
    public LocalDateTime getCreated_at(){
        return created_at;
    }
    public void setCreated_at(LocalDateTime created_at){
        this.created_at=created_at;
    }
    public LocalDateTime getUpdated_at(){
        return updated_at;
    }
    public void setUpdated_at(LocalDateTime updated_at){
        this.updated_at=updated_at;
    }
}