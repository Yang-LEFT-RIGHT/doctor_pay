package com.paper.project;

import com.paper.BBM.SearchManager;
import com.paper.Entity.Paper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.ui.Model;

import java.sql.SQLException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class HelloControllerTest {

    // 单元测试部分
    @Mock
    private SearchManager searchManager;

    @Mock
    private Model model;

    @InjectMocks
    private HelloController helloController;

    private List<Paper> mockPaperList;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        
        // 创建模拟数据
        mockPaperList = new ArrayList<>();
        Paper paper1 = new Paper();
        paper1.setTitle("Test Paper 1");
        paper1.setTarget("test");
        paper1.setAuthor("Author 1");
        paper1.setPublish_date(LocalDate.now());
        mockPaperList.add(paper1);
    }

    @Test
    public void testSearchResult_Success() throws Exception {
        // 模拟SearchManager的行为
        when(searchManager.SearchByTarget("test")).thenReturn(mockPaperList);

        // 执行测试方法
        String result = helloController.SearchResult("test", model);

        // 验证结果
        verify(model).addAttribute("keyword", "test");
        verify(model).addAttribute("results", mockPaperList);
        assert result.equals("search");
    }

    @Test
    public void testSearchResult_Exception() throws Exception {
        // 模拟异常情况
        when(searchManager.SearchByTarget("test")).thenThrow(new SQLException("Database error"));

        // 执行测试方法
        String result = helloController.SearchResult("test", model);

        // 验证异常被正确处理
        verify(model).addAttribute("keyword", "test");
        verify(model).addAttribute("results", null);
        assert result.equals("search");
    }

    // 集成测试部分
    @SpringBootTest
    public static class HelloControllerIntegrationTest {

        private MockMvc mockMvc;

        @BeforeEach
        public void setUp() {
            mockMvc = MockMvcBuilders.standaloneSetup(new HelloController()).build();
        }

        @Test
        public void testSearchResultEndpoint() throws Exception {
            mockMvc.perform(get("/search/result")
                            .param("keyword", "test"))
                    .andExpect(status().isOk())
                    .andExpect(view().name("search"))
                    .andExpect(model().attributeExists("keyword"))
                    .andExpect(model().attribute("keyword", "test"));
        }

        @Test
        public void testSearchResultEndpoint_WithoutKeyword() throws Exception {
            mockMvc.perform(get("/search/result"))
                    .andExpect(status().isOk())
                    .andExpect(view().name("search"))
                    .andExpect(model().attributeExists("keyword"))
                    .andExpect(model().attribute("keyword", "未传入内容"));
        }
    }
}