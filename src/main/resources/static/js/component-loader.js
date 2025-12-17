// js/component-loader.js
class ComponentLoader {
    static async loadAllComponents() {
        const components = document.querySelectorAll('[data-component]');
        
        for (const component of components) {
            const componentName = component.getAttribute('data-component');
            const userType = component.getAttribute('data-user-type') || 'student';
            
            await this.loadComponent(componentName, userType, component);
        }
    }
    
    static async loadComponent(componentName, userType, targetElement) {
        // 根据组件类型和用户类型构建文件路径
        let filePath = '';
        
        switch(componentName) {
            case 'header':
                filePath = `components/header/${userType}-header.html`;
                break;
            case 'sidebar':
                filePath = `components/sidebar/${userType}-sidebar.html`;
                break;
            case 'notification':
                filePath = `components/notification/${userType}-notification.html`;
                break;
            case 'footer':
                filePath = `components/footer/${userType}-footer.html`;
                break;
            default:
                console.error(`未知组件: ${componentName}`);
                return;
        }
        
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const html = await response.text();
            targetElement.outerHTML = html;
            
            console.log(`组件 ${componentName} (${userType}) 加载成功`);
        } catch (error) {
            console.error(`加载组件失败: ${filePath}`, error);
            targetElement.innerHTML = `
                <div class="component-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    组件加载失败: ${componentName}
                </div>
            `;
        }
    }
    
    // 加载特定组件
    static async loadSingleComponent(componentName, userType = 'student') {
        const element = document.querySelector(`[data-component="${componentName}"]`);
        if (element) {
            await this.loadComponent(componentName, userType, element);
        }
    }
}

// 在DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 如果有组件需要加载，自动加载
    if (document.querySelector('[data-component]')) {
        ComponentLoader.loadAllComponents();
    }
});