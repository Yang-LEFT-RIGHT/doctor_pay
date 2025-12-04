#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
数据分析示例脚本
用于演示Java调用Python脚本进行数据分析
"""

import sys
import json
from collections import Counter

def analyze_papers(papers_data):
    """
    分析论文数据
    :param papers_data: 论文数据列表
    :return: 分析结果
    """
    if not papers_data:
        return {
            "message": "没有数据可分析",
            "total_papers": 0
        }
    
    # 计算总论文数
    total_papers = len(papers_data)
    
    # 统计每个目标领域的论文数量
    target_counter = Counter()
    for paper in papers_data:
        target = paper.get("target", "未知")
        target_counter[target] += 1
    
    # 统计每个国家的论文数量
    country_counter = Counter()
    for paper in papers_data:
        country = paper.get("country", "未知")
        country_counter[country] += 1
    
    # 计算平均引用数和平均参考文献数
    total_citations = sum(paper.get("citations", 0) for paper in papers_data)
    total_refs = sum(paper.get("refs", 0) for paper in papers_data)
    
    avg_citations = total_citations / total_papers if total_papers > 0 else 0
    avg_refs = total_refs / total_papers if total_papers > 0 else 0
    
    # 找出引用最多的论文
    most_cited = max(papers_data, key=lambda x: x.get("citations", 0), default=None)
    
    # 构建分析结果
    result = {
        "message": "数据分析完成",
        "total_papers": total_papers,
        "avg_citations": round(avg_citations, 2),
        "avg_refs": round(avg_refs, 2),
        "target_distribution": dict(target_counter),
        "country_distribution": dict(country_counter),
        "most_cited_paper": {
            "title": most_cited.get("title", "未知") if most_cited else "无",
            "citations": most_cited.get("citations", 0) if most_cited else 0,
            "author": most_cited.get("author", "未知") if most_cited else "无"
        }
    }
    
    return result

if __name__ == "__main__":
    # 从命令行参数获取JSON数据
    if len(sys.argv) < 2:
        print(json.dumps({"error": "缺少输入数据"}))
        sys.exit(1)
    
    try:
        # 解析输入数据
        papers_json = sys.argv[1]
        papers_data = json.loads(papers_json)
        
        # 执行数据分析
        analysis_result = analyze_papers(papers_data)
        
        # 输出分析结果（JSON格式）
        print(json.dumps(analysis_result, ensure_ascii=False, indent=2))
        
    except Exception as e:
        # 输出错误信息
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
