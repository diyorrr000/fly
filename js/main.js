// Main Application Script
document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    document.documentElement.setAttribute('data-theme', currentTheme);
    themeToggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
    
    themeToggle.addEventListener('click', function() {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    });
    
    // Login Button
    const loginBtn = document.getElementById('loginBtn');
    loginBtn.addEventListener('click', function() {
        const email = prompt('Email kiriting:');
        if (email) {
            this.textContent = '👤 Profil';
            this.classList.add('btn-success');
            localStorage.setItem('userEmail', email);
            showNotification('Muvaffaqiyatli kirildi!', 'success');
        }
    });
    
    // Admin Panel Toggle
    const adminLink = document.getElementById('adminLink');
    const adminSection = document.getElementById('admin');
    
    adminLink.addEventListener('click', function(e) {
        e.preventDefault();
        const isAdmin = localStorage.getItem('isAdmin') === 'true' || 
                        prompt('Admin paroli kiriting:') === 'admin123';
        
        if (isAdmin) {
            localStorage.setItem('isAdmin', 'true');
            adminSection.style.display = 'block';
            window.location.hash = '#admin';
            showNotification('Admin panelga kirildi', 'success');
        } else {
            showNotification('Noto\'g\'ri parol!', 'error');
        }
    });
    
    // Admin Tabs
    const adminTabs = document.querySelectorAll('.admin-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    adminTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all tabs
            adminTabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to current tab
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Navigation smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Load initial data
    loadFlights();
    loadTickets();
    updateStatistics();
    
    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">×</button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
    
    // Add notification styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            z-index: 9999;
            display: flex;
            justify-content: space-between;
            align-items: center;
            min-width: 300px;
            animation: slideIn 0.3s ease;
        }
        
        .notification-success {
            background: var(--success-color);
        }
        
        .notification-error {
            background: var(--danger-color);
        }
        
        .notification-info {
            background: var(--primary-color);
        }
        
        .notification button {
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            margin-left: 15px;
        }
        
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    // Make showNotification globally available
    window.showNotification = showNotification;
});