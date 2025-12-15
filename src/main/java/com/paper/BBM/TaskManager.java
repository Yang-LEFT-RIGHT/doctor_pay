package com.paper.BBM;

import com.paper.DBM.MySQLHelper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;

import com.paper.Entity.Scholarship_jobs;

public class TaskManager {
    private MySQLHelper mysqlhelper;
    public TaskManager() throws SQLException, ClassNotFoundException{
        this.mysqlhelper = new MySQLHelper();
    }
    public List<Scholarship_jobs> getAllTask() throws SQLException{
        String sql = "SELECT * FROM scholarship_jobs";
        List<Scholarship_jobs> tasks = new ArrayList<>();
        Map<String, Object> map = mysqlhelper.executeSQLWithSelect(sql);
        ResultSet rs = null;
        try{
            rs = (ResultSet) map.get("result");
            while (rs.next()){
            Scholarship_jobs task = new Scholarship_jobs();
            task.setJob_id(rs.getInt("job_id"));
            task.setTitle(rs.getString("title"));
            task.setIs_teaching_assistant(rs.getBoolean("is_teaching_assistant"));
            task.setWork_type(rs.getString("work_type"));
            task.setAcademic_year(rs.getString("academic_year"));
            task.setDescription(rs.getString("description"));
            task.setRequired_number(rs.getInt("required_number"));
            task.setWorkload_credits(rs.getDouble("workload_credits"));
            task.setPublisher_id(rs.getInt("publisher_id"));
            task.setStatus(rs.getString("status"));
            task.setApplication_deadline(rs.getDate("application_deadline").toLocalDate());
            tasks.add(task);
            }
        }finally{
            if (rs != null) {
                try {
                    rs.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
    
        return tasks;
    }
    public void close() {
        if (mysqlhelper != null) {
            try {
                mysqlhelper.close();
                System.out.println("数据库连接已关闭");
            } catch (Exception e) {
                System.err.println("关闭数据库连接失败: " + e.getMessage());
                e.printStackTrace();
            }
        }
    }
}
