package com.paper.BBM;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.Random; // 关键：导入 Jakarta Mail 的 Authenticator

import org.mindrot.jbcrypt.BCrypt; // 若未导入，也需添加（PasswordAuthentication 属于 jakarta.mail）

import com.paper.DBM.MySQLHelper;
import com.paper.Entity.Students;

import jakarta.mail.Authenticator;
import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.PasswordAuthentication;
import jakarta.mail.Session;
import jakarta.mail.Transport;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

/*负责实现关于用户表功能的业务逻辑类*/
public class UserManager {
    private MySQLHelper mysqlhelper;// 数据库操作对象

    private static final String QQ_MAIL_PASSWORD=System.getenv("QQ_MAIL_PASSWORD");
    
    // 存储验证码和邮箱的映射关系，key为邮箱，value为验证码
    private static Map<String, String> verificationCodeMap = new HashMap<>();
    // 存储验证码创立时间，若超过五分钟则需判断代码失效
    private static Map<String, Long> codeExpireTimeMap = new HashMap<>();
    
    public UserManager() throws ClassNotFoundException, SQLException{
        this.mysqlhelper = new MySQLHelper();
    }
    
    // 登录功能
    public boolean login_Stu(Students student) throws SQLException{
        boolean f = false;
        // 使用参数化查询，修复原SQL语句的语法错误和注入风险
        String sqlString = "SELECT PASSWORD FROM students WHERE student_id = ?";
        Map<String,Object> map = mysqlhelper.executeSQLWithSelect(sqlString, student.getStudent_id());
        
        ResultSet set = null;
        try {
            if(map.get("result") != null){
                set = (ResultSet) map.get("result");
                // 检查是否有结果
                if(set.next()){
                    String storedHashedPassword = set.getString("password");
                    if (BCrypt.checkpw(student.getPassword(), storedHashedPassword)) {
                        f = true;
                    }
                }
            }
        } finally {
            // 关闭ResultSet
            if (set != null) {
                try {
                    set.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
        return f;
    }

    public Students fetch_info_Stu(String student_id) throws SQLException{
        Students student = new Students();
        // 使用参数化查询，修复原SQL语句的语法错误和注入风险
        String sqlString = "SELECT * FROM students WHERE student_id = ?";
        Map<String,Object> map = mysqlhelper.executeSQLWithSelect(sqlString, student_id);
        ResultSet set=null;
        try {
            if(map.get("result") != null){
                set = (ResultSet) map.get("result");
                // 检查是否有结果
                if(set.next()){
                    student.setStudent_id(set.getString("student_id"));
                    student.setPassword(set.getString("password"));
                    student.setName(set.getString("name"));
                    student.setPhone(set.getString("phone"));
                    student.setEmail(set.getString("email"));
                    student.setMajor(set.getString("major"));
                    student.setStudent_type(set.getString("student_type"));
                    student.setSupervisor_id(set.getString("supervisor_id"));
                    student.setEnrollment_year(set.getInt("enrollment_year"));
                    student.setTraining_mode(set.getString("training_mode"));
                    student.setStudent_id(set.getString("student_id"));
                    student.setWechat_id(set.getString("wechat_id"));
                }
            }
        } finally {
            // 关闭ResultSet
            if (set != null) {
                try {
                    set.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
        return student;
    }

    // 修改密码(未完成)
    public String updatePassword_Stu(Students student){
        // 使用参数化查询
        String sqlString = "UPDATE USER SET password = ? WHERE uname = ?";
        return mysqlhelper.executeSQL(sqlString, student.getPassword(), student.getName());
    }
    
    // 发送注册验证码到邮箱
    public String sendRegisterCode(String email) {
        // 生成6位随机验证码
        String code = generateRandomCode();
        
        // 如果是二次发送验证码，清理之前的记录
        if(verificationCodeMap.containsKey(email)){
            verificationCodeMap.remove(email);
            codeExpireTimeMap.remove(email);
        }
        
        // 存储验证码和过期时间
        verificationCodeMap.put(email, code);
        codeExpireTimeMap.put(email, System.currentTimeMillis());
        
        // 邮件发送配置（以QQ邮箱为例）
        Properties props = new Properties();
        props.put("mail.smtp.host", "smtp.qq.com");
        props.put("mail.smtp.port", "465");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.ssl.enable", "true"); // 启用 SSL（关键，替换原 starttls）
        props.put("mail.debug", "true"); // 开启调试模式，控制台会输出邮件发送细节
        
        // 邮箱账号信息（需替换为实际邮箱和授权码）
        final String fromEmail = "2878580863@qq.com";
        final String password = QQ_MAIL_PASSWORD;
        
        // 创建会话
        Session session = Session.getInstance(props, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(fromEmail, password);
            }
        });
        
        try {
            // 创建邮件消息
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(fromEmail));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(email));
            message.setSubject("账号注册验证码");
            message.setText("您的注册验证码是：" + code + "，有效期5分钟，请妥善保管。");
            
            // 发送邮件
            Transport.send(message);
            return "发送成功"; // 发送成功
        } catch (MessagingException e) {
            return "验证码发送失败：" + e.getMessage();
        }
    }
    
    // 通过邮箱和验证码完成注册
    /*
    public String registerByEmail(Students user, String code) throws SQLException {
        // 验证邮箱是否已被注册
        if (isEmailExists(user.getEmail())) {
            return "该邮箱已被注册";
        }
        
        // 验证用户名是否已存在
        if (isUsernameExists(user.getUname())) {
            return "该用户名已存在";
        }
        
        // 验证验证码是否正确和过期
        String storedCode = verificationCodeMap.get(user.getEmail());
        Long expireTime = codeExpireTimeMap.get(user.getEmail());
        
        // 修复原代码中变量引用错误（expireTime变量未定义）
        if (storedCode == null || !storedCode.equals(code)) {
            return "验证码错误";
        }
        
        // 验证验证码是否过期
        if (expireTime == null || System.currentTimeMillis() - expireTime > 5 * 60 * 1000) {
            codeExpireTimeMap.remove(user.getEmail());
            verificationCodeMap.remove(user.getEmail());
            return "验证码已过期";
        }
        
        // 执行注册SQL，使用参数化查询
        String sql = "INSERT INTO USER (uname, password, email) VALUES (?, ?, ?)";
        String hashedPassword = BCrypt.hashpw(user.getPassword(), BCrypt.gensalt());
        String result = mysqlhelper.executeSQL(sql, user.getUname(), hashedPassword, user.getEmail());
        
        // 注册成功后清除验证码
        if (result.isEmpty()) {
            verificationCodeMap.remove(user.getEmail());
            codeExpireTimeMap.remove(user.getEmail());
            return "注册成功";
        }
        
        return result;
    }
    */
    
    // 生成6位随机验证码
    private String generateRandomCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000); // 生成100000-999999之间的随机数
        return String.valueOf(code);
    }
    
    // 检查邮箱是否已存在
    /*
    private boolean isEmailExists(String email) throws SQLException {
        String sql = "SELECT * FROM USER WHERE email = ?";
        Map<String, Object> map = mysqlhelper.executeSQLWithSelect(sql, email);
        
        ResultSet set = null;
        try {
            if (map.get("result") != null) {
                set = (ResultSet) map.get("result");
                return set.next(); // 如果有记录返回true
            }
        } finally {
            if (set != null) {
                try {
                    set.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
        return false;
    }
         */
    
    // 检查用户名是否已存在
    /*
    private boolean isUsernameExists(String username) throws SQLException {
        String sql = "SELECT * FROM USER WHERE uname = ?";
        Map<String, Object> map = mysqlhelper.executeSQLWithSelect(sql, username);
        
        ResultSet set = null;
        try {
            if (map.get("result") != null) {
                set = (ResultSet) map.get("result");
                return set.next(); // 如果有记录返回true
            }
        } finally {
            if (set != null) {
                try {
                    set.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
        return false;
    }
         */
}
