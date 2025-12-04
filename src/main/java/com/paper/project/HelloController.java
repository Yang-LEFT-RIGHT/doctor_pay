package com.paper.project;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.paper.BBM.SearchManager;
import com.paper.BBM.PythonCaller;
import com.paper.Entity.Paper;

@Controller
public class HelloController {
    @GetMapping("/search/result")
    @ResponseBody
    public String SearchResult(@RequestParam(required = false, defaultValue = "未传入内容") String keyword, Model model) {
        // 拼接参数返回（此时question不可能为null，避免NullPointerException）
        // 1. 业务逻辑：比如查询数据库获取搜索结果
        List<Paper> paperList = null;
        SearchManager searchManager = new SearchManager();
        try {
            paperList = searchManager.SearchByTarget(keyword);
        } catch (ClassNotFoundException | SQLException e) {
            e.printStackTrace();
        } 
        
        // 打印paperList到终端
        System.out.println("=== 搜索结果信息 ===");
        System.out.println("搜索关键词: " + keyword);
        if (paperList != null) {
            System.out.println("结果数量: " + paperList.size());
            for (int i = 0; i < paperList.size(); i++) {
                Paper paper = paperList.get(i);
                System.out.println("\n结果 " + (i + 1) + ":");
                System.out.println("标题: " + paper.getTitle());
                System.out.println("作者: " + paper.getAuthor());
                System.out.println("目标: " + paper.getTarget());
                System.out.println("期刊: " + paper.getJournal());
                System.out.println("发表日期: " + paper.getPublish_date());
                System.out.println("DOI: " + paper.getDoi());
            }
            
            // 调用Python脚本进行数据分析
            try {
                PythonCaller pythonCaller = new PythonCaller();
                Map<String, Object> analysisResult = pythonCaller.analyzePapers(paperList);
                
                System.out.println("\n=== 数据分析结果 ===");
                System.out.println("总论文数: " + analysisResult.get("total_papers"));
                System.out.println("平均引用数: " + analysisResult.get("avg_citations"));
                System.out.println("平均参考文献数: " + analysisResult.get("avg_refs"));
                System.out.println("目标领域分布: " + analysisResult.get("target_distribution"));
                System.out.println("国家分布: " + analysisResult.get("country_distribution"));
                System.out.println("引用最多的论文: " + analysisResult.get("most_cited_paper"));
                System.out.println("==================\n");
                
            } catch (Exception e) {
                System.err.println("数据分析失败: " + e.getMessage());
                e.printStackTrace();
            }
            
        } else {
            System.out.println("未找到搜索结果或发生错误");
        }
        System.out.println("==================\n");
        return null;
        
        // 2. 把数据存入 Model（key-value 形式）
        //model.addAttribute("keyword", keyword); // 存搜索关键词
        //model.addAttribute("results", paperList); // 存搜索结果数组

        // 3. 返回视图名（视图解析器会找 templates/search.html）
        //return "search";
    }
}
