// 用户管理
class UserManager {
    static checkLogin() {
        const savedUser = localStorage.getItem('docim_user');
        if (!savedUser) {
            window.location.href = 'index.html';
            return false;
        }
        return JSON.parse(savedUser);
    }
    
    static logout() {
        if (confirm('确定要退出登录吗？')) {
            localStorage.removeItem('docim_user');
            localStorage.removeItem('notifications');
            window.location.href = 'index.html';
        }
    }
    
    static updateUserName() {
        const user = this.checkLogin();
        if (user && user.name) {
            const userNameElements = document.querySelectorAll('#userName, .user-name');
            userNameElements.forEach(el => {
                el.textContent = user.name;
            });
        }
    }
}

// 组件加载器
class ComponentLoader {
    static async load(componentPath, targetId) {
        try {
            const response = await fetch(`components/${componentPath}`);
            if (!response.ok) throw new Error('组件加载失败');
            
            const html = await response.text();
            const target = document.getElementById(targetId);
            if (target) {
                target.innerHTML = html;
                return true;
            }
        } catch (error) {
            console.error(`加载组件 ${componentPath} 失败:`, error);
        }
        return false;
    }
}

// 页面初始化
class PageInitializer {
    static init(userType = 'student') {
        // 检查登录状态
        UserManager.checkLogin();
        
        // 更新用户名
        UserManager.updateUserName();
        
        // 根据用户类型加载组件
        this.loadComponents(userType);
    }
    
    static async loadComponents(userType) {
        // 加载顶部导航
        await ComponentLoader.load(`header/${userType}-header.html`, 'header-container');
        
        // 加载侧边栏
        await ComponentLoader.load(`sidebar/${userType}-sidebar.html`, 'sidebar-container');
        
        // 加载通知系统
        await ComponentLoader.load('notification.html', 'notification-container');
        
        // 加载页脚
        await ComponentLoader.load('footer.html', 'footer-container');
    }
}