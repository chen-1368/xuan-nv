/**
 * 造梦无双玄女角色解析 - 主脚本文件
 * 包含主题切换、目录导航、移动端菜单等功能
 */

/* ========================================
   1. DOM 元素引用
   ======================================== */

// 主题切换按钮
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const themeText = document.getElementById('themeText');

// 移动端菜单按钮
const menuToggle = document.getElementById('menuToggle');
const mobileToc = document.getElementById('mobileToc');

// 桌面端目录
const toc = document.getElementById('toc');
const tocLinks = document.querySelectorAll('.toc__link');

// 所有章节section
const sections = document.querySelectorAll('.section');

/* ========================================
   2. 主题系统
   ======================================== */

/**
 * 获取当前主题
 * 优先读取localStorage，其次跟随系统主题
 */
function getCurrentTheme() {
    // 先检查localStorage是否有用户设置
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        return savedTheme;
    }
    
    // 否则跟随系统主题
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
}

/**
 * 设置主题
 * @param {string} theme - 'light' 或 'dark'
 */
function setTheme(theme) {
    // 更新data-theme属性
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.textContent = '☀️';
        themeText.textContent = '白天';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        themeIcon.textContent = '🌙';
        themeText.textContent = '夜间';
    }
    
    // 保存到localStorage
    localStorage.setItem('theme', theme);
}

/**
 * 切换主题
 */
function toggleTheme() {
    const currentTheme = getCurrentTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

/**
 * 初始化主题
 */
function initTheme() {
    // 设置初始主题
    setTheme(getCurrentTheme());
    
    // 监听系统主题变化
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        // 只有当用户没有手动设置主题时才跟随系统
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
    
    // 绑定主题切换按钮事件
    themeToggle.addEventListener('click', toggleTheme);
}

/* ========================================
   3. 移动端菜单
   ======================================== */

/**
 * 切换移动端目录显示
 */
function toggleMobileToc() {
    mobileToc.classList.toggle('mobile-toc--open');
    
    // 更新按钮图标
    const isOpen = mobileToc.classList.contains('mobile-toc--open');
    menuToggle.querySelector('span').textContent = isOpen ? '✕' : '☰';
}

/**
 * 初始化移动端菜单
 */
function initMobileMenu() {
    menuToggle.addEventListener('click', toggleMobileToc);
    
    // 点击目录链接后关闭菜单
    const mobileTocLinks = mobileToc.querySelectorAll('.toc__link');
    mobileTocLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToc.classList.remove('mobile-toc--open');
            menuToggle.querySelector('span').textContent = '☰';
        });
    });
}

/* ========================================
   4. 目录滚动高亮
   ======================================== */

/**
 * 使用 Intersection Observer 监听章节可见性
 * 实现滚动时目录自动高亮
 */
function initTocScrollHighlight() {
    // 配置 observer 选项
    const options = {
        root: null, // 使用视口作为根
        rootMargin: '-80px 0px -70% 0px', // 调整触发时机
        threshold: 0
    };
    
    // 创建 observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 移除所有 active 类
                tocLinks.forEach(link => link.classList.remove('toc__link--active'));
                
                // 为当前章节的目录链接添加 active 类
                const activeLink = document.querySelector(`.toc__link[href="#${entry.target.id}"]`);
                if (activeLink) {
                    activeLink.classList.add('toc__link--active');
                }
            }
        });
    }, options);
    
    // 观察所有章节
    sections.forEach(section => {
        observer.observe(section);
    });
}

/* ========================================
   5. 图片懒加载
   ======================================== */

/**
 * 使用原生 loading="lazy" 实现图片懒加载
 * 为占位符添加加载完成后的过渡效果
 */
function initLazyLoading() {
    // 查找所有懒加载图片占位符
    const lazyImages = document.querySelectorAll('.lazy-image img');
    
    lazyImages.forEach(img => {
        // 图片加载完成后移除占位符样式
        img.addEventListener('load', () => {
            img.parentElement.classList.remove('lazy-image');
        });
        
        // 图片加载失败处理
        img.addEventListener('error', () => {
            const parent = img.parentElement;
            parent.innerHTML = '<span>图片加载失败</span>';
        });
    });
}

/* ========================================
   6. 平滑滚动增强
   ======================================== */

/**
 * 为目录链接添加平滑滚动效果
 */
function initSmoothScroll() {
    tocLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // 更新 URL hash
                history.pushState(null, null, `#${targetId}`);
            }
        });
    });
}

/* ========================================
   7. 初始化
   ======================================== */

/**
 * 页面加载完成后初始化所有功能
 */
document.addEventListener('DOMContentLoaded', () => {
    initTheme();           // 主题系统
    initMobileMenu();      // 移动端菜单
    initTocScrollHighlight(); // 目录滚动高亮
    initLazyLoading();     // 图片懒加载
    initSmoothScroll();    // 平滑滚动
    
    // 如果 URL 有 hash，直接跳转到对应章节
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            setTimeout(() => {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }
    }
});
