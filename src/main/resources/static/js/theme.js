// js/theme.js - 修复版（移除冲突的通知弹窗）
document.addEventListener('DOMContentLoaded', function() {
    console.log('theme.js 加载完成');
    
    // 移除冲突的通知按钮事件
    // 这部分功能已经移到 notification.js 中
    
    // 简单的登录检查
    const savedUser = localStorage.getItem('docim_user');
    const currentPage = window.location.pathname;
    
    // 如果是登录页，不检查登录状态
    if (currentPage.includes('index.html') || currentPage.includes('login.html')) {
        return;
    }
    
    if (!savedUser) {
        console.log('未登录，跳转到登录页');
        window.location.href = 'index.html';
    }
});

// 全局退出函数
function logout() {
    if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('docim_user');
        window.location.href = 'index.html';
    }
}