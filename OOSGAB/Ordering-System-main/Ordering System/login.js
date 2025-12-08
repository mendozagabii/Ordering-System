class LoginSystem {
    constructor() {
        this.currentTab = 'login';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeDefaultAccounts();
    }

    setupEventListeners() {
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.getElementById('registerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegistration();
        });

        document.querySelectorAll('.demo-account').forEach(account => {
            account.addEventListener('click', (e) => {
                const email = e.currentTarget.dataset.email;
                const password = e.currentTarget.dataset.password;
                this.fillDemoCredentials(email, password);
            });
        });

        document.querySelectorAll('.toggle-password').forEach(button => {
            button.addEventListener('click', (e) => {
                this.togglePasswordVisibility(e.target.closest('.toggle-password'));
            });
        });
    }

    switchTab(tab) {
        this.currentTab = tab;
        
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        
        const indicator = document.querySelector('.tab-indicator');
        indicator.classList.toggle('register', tab === 'register');
        
        document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
        document.getElementById(`${tab}Form`).classList.add('active');
    }

    togglePasswordVisibility(button) {
        const input = button.closest('.input-group').querySelector('input');
        const icon = button.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }

    fillDemoCredentials(email, password) {
        if (this.currentTab === 'login') {
            document.getElementById('loginEmail').value = email;
            document.getElementById('loginPassword').value = password;
        } else {
            document.getElementById('registerEmail').value = email;
            document.getElementById('registerPassword').value = password;
            document.getElementById('confirmPassword').value = password;
        }
        
        this.showNotification(`Demo credentials filled for ${email.split('@')[0]}`, 'success');
    }

    async handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const button = document.querySelector('#loginForm .btn-primary');

        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
        button.disabled = true;

        await new Promise(resolve => setTimeout(resolve, 1500));

        const users = this.getUsers();
        // Check both encoded and plain text passwords for compatibility
        const user = users.find(u => u.email === email && (u.password === password || u.password === btoa(password)));

        if (user) {
            users.forEach(u => u.isLoggedIn = false);
            user.isLoggedIn = true;
            localStorage.setItem('ordering_system_users', JSON.stringify(users));

            this.showNotification('Login successful! Redirecting...', 'success');

            setTimeout(() => {
                // If there is a pending action saved (addToCart / openCart), try to return to the saved page
                // but avoid redirecting back to the homepage or the login page itself.
                try {
                    const raw = localStorage.getItem('pending_action');
                    if (raw) {
                        const pending = JSON.parse(raw);
                        if (pending && pending.returnUrl) {
                            const returnUrl = pending.returnUrl;
                            const lower = (returnUrl || '').toLowerCase();
                            // don't send the user back to the login page or to index.html/home
                            if (!lower.includes('login.html') && !lower.endsWith('index.html') && !lower.endsWith('/') ) {
                                window.location.href = returnUrl;
                                return;
                            }
                        }
                    }
                } catch(e) { /* ignore and fallback to normal redirect */ }

                // otherwise go to the app landing page for the user's role
                this.redirectUser(user.role);
            }, 900);
        } else {
            this.showNotification('Invalid email or password', 'error');
            button.innerHTML = originalText;
            button.disabled = false;
        }
    }

    async handleRegistration() {
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const button = document.querySelector('#registerForm .btn-primary');

        if (password !== confirmPassword) {
            this.showNotification('Passwords do not match', 'error');
            return;
        }

        if (password.length < 6) {
            this.showNotification('Password must be at least 6 characters', 'error');
            return;
        }

        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
        button.disabled = true;

        await new Promise(resolve => setTimeout(resolve, 1500));

        const users = this.getUsers();
        
        if (users.find(u => u.email === email)) {
            this.showNotification('Email already registered', 'error');
            button.innerHTML = originalText;
            button.disabled = false;
            return;
        }

        const newUser = {
            id: Date.now(),
            fullName: name,
            email: email,
            password: btoa(password), // Encode password
            role: 'customer',
            isLoggedIn: true,
            dateRegistered: new Date().toISOString()
        };

        // Issue a one-time 20% welcome voucher for new users (single-item use)
        try {
            const code = 'WELCOME20-' + Math.random().toString(36).slice(2,8).toUpperCase();
            newUser.voucher = {
                code: code,
                percent: 20,
                used: false,
                issuedAt: new Date().toISOString()
            };
        } catch (e) { /* non-critical */ }

        users.push(newUser);
        localStorage.setItem('ordering_system_users', JSON.stringify(users));

        this.showNotification('Account created successfully!', 'success');
        
        setTimeout(() => {
            try {
                const raw = localStorage.getItem('pending_action');
                if (raw) {
                    const pending = JSON.parse(raw);
                    if (pending && pending.returnUrl) {
                        const returnUrl = pending.returnUrl || '';
                        const lower = returnUrl.toLowerCase();
                        if (!lower.includes('login.html') && !lower.endsWith('index.html') && !lower.endsWith('/')) {
                            window.location.href = returnUrl; return;
                        }
                    }
                }
            } catch(e) {}
            // default to customer landing after registration
            this.redirectUser('customer');
        }, 1000);
    }

    getUsers() {
        return JSON.parse(localStorage.getItem('ordering_system_users') || '[]');
    }

    initializeDefaultAccounts() {
        const users = this.getUsers();
        const defaultAccounts = [
            {
                id: 1,
                fullName: 'Administrator',
                email: 'admin@gmail.com',
                password: btoa('admin123'), // Encoded password
                role: 'admin',
                isLoggedIn: false,
                dateRegistered: new Date().toISOString()
            },
            {
                id: 2,
                fullName: 'Kitchen Staff',
                email: 'staff@gmail.com',
                password: btoa('staff123'), // Encoded password
                role: 'staff',
                isLoggedIn: false,
                dateRegistered: new Date().toISOString()
            }
        ];

        let needsUpdate = false;
        defaultAccounts.forEach(defaultAcc => {
            if (!users.find(u => u.email === defaultAcc.email)) {
                users.push(defaultAcc);
                needsUpdate = true;
            }
        });

        if (needsUpdate) {
            localStorage.setItem('ordering_system_users', JSON.stringify(users));
        }
    }

    redirectUser(role) {
        // Try to redirect to the appropriate page. If `customer.html` is missing on the server,
        // fall back to `index.html` so users don't see a 404.
        switch(role) {
            case 'admin':
                window.location.href = 'admin.html';
                break;
            case 'staff':
                window.location.href = 'staff.html';
                break;
            default: {
                // For customers, attempt a quick HEAD request for customer.html; if it fails, use index.html
                try {
                    fetch('customer.html', { method: 'HEAD' }).then(res => {
                        if (res && res.ok) {
                            window.location.href = 'customer.html';
                        } else {
                            window.location.href = 'index.html';
                        }
                    }).catch(() => {
                        window.location.href = 'index.html';
                    });
                } catch (e) {
                    window.location.href = 'index.html';
                }
            }
        }
    }

    showNotification(message, type) {
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: var(--surface);
                    padding: 16px 20px;
                    border-radius: var(--radius-sm);
                    box-shadow: var(--shadow-lg);
                    z-index: 10000;
                    transform: translateX(120%);
                    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    border-left: 4px solid var(--primary);
                    max-width: 400px;
                    border: 1px solid var(--border);
                }
                .notification-success {
                    border-left-color: var(--success);
                }
                .notification-error {
                    border-left-color: var(--secondary);
                }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .notification-content i {
                    font-size: 1.2em;
                }
                .notification.show {
                    transform: translateX(0);
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new LoginSystem();
});