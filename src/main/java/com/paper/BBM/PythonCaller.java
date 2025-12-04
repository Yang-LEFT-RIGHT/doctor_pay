package com.paper.BBM;

import com.paper.Entity.Paper;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.*;
import java.util.List;
import java.util.Map;

/**
 * Python调用器类
 * 用于实现Java与Python脚本的交互，执行数据分析任务
 */
public class PythonCaller {
    private static final String PYTHON_SCRIPT_PATH = "src/main/resources/python/data_analysis.py";
    private static final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * 调用Python脚本进行论文数据分析
     * @param papers 论文数据列表
     * @return 分析结果（JSON格式的Map）
     * @throws Exception 执行过程中的异常
     */
    public Map<String, Object> analyzePapers(List<Paper> papers) throws Exception {
        // 将论文数据转换为JSON字符串
        String papersJson = objectMapper.writeValueAsString(papers);

        // 构建Python命令
        ProcessBuilder processBuilder = new ProcessBuilder(
                "python", PYTHON_SCRIPT_PATH, papersJson
        );

        // 设置工作目录为项目根目录
        processBuilder.directory(new File("."));
        processBuilder.redirectErrorStream(true);

        // 启动进程
        Process process = processBuilder.start();

        // 读取输出
        StringBuilder output = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(process.getInputStream(), "UTF-8"))) {
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line);
            }
        }

        // 等待进程执行完成
        int exitCode = process.waitFor();

        // 检查是否执行成功
        if (exitCode != 0) {
            throw new RuntimeException("Python脚本执行失败，退出码: " + exitCode + "，输出: " + output.toString());
        }

        // 解析输出结果
        return objectMapper.readValue(output.toString(), Map.class);
    }

    /**
     * 调用Python脚本的重载方法，用于测试
     * @param pythonScriptPath Python脚本路径
     * @param inputJson 输入JSON数据
     * @return 脚本输出结果
     * @throws Exception 执行过程中的异常
     */
    public String callPythonScript(String pythonScriptPath, String inputJson) throws Exception {
        ProcessBuilder processBuilder = new ProcessBuilder(
                "python", pythonScriptPath, inputJson
        );

        processBuilder.directory(new File("."));
        processBuilder.redirectErrorStream(true);

        Process process = processBuilder.start();

        StringBuilder output = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(process.getInputStream(), "UTF-8"))) {
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line);
            }
        }

        int exitCode = process.waitFor();

        if (exitCode != 0) {
            throw new RuntimeException("Python脚本执行失败，退出码: " + exitCode + "，输出: " + output.toString());
        }

        return output.toString();
    }
}
