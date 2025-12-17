// js/theme.js - 简化版
document.addEventListener('DOMContentLoaded', function() {
    console.log('theme.js 加载完成');
    
    // 检查当前页面
    const currentPage = window.location.pathname;
    
    // 如果是登录页，不检查登录状态
    if (currentPage.includes('index.html') || currentPage.includes('login.html')) {
        console.log('登录页面，跳过登录检查');
        return;
    }
    
    // 检查用户数据
    const userData = getCurrentUser();
    if (!userData) {
        console.log('未登录，跳转到登录页');
        window.location.href = 'index.html';
    }
});

// 获取当前用户数据
function getCurrentUser() {
    try {
        const savedUser = localStorage.getItem('docim_user');
        if (!savedUser) return null;
        
        const userData = JSON.parse(savedUser);
        
        // 确保有 name 字段
        if (!userData.name) return null;
        
        return userData;
    } catch (error) {
        console.error('获取用户数据失败:', error);
        return null;
    }
}

// 全局退出函数
function logout() {
    if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('docim_user');
        window.location.href = 'index.html';
    }
}