class ForgotPassword {
    constructor() {
        this.currentStep = 1;
        this.userEmail = '';
        this.verificationCode = '';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.generateDemoCode();
    }

    setupEventListeners() {
        // Form submissions
        document.getElementById('emailForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleEmailSubmit();
        });

        document.getElementById('codeForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleCodeSubmit();
        });

        document.getElementById('passwordForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handlePasswordSubmit();
        });

        // Resend code
        document.getElementById('resendCode').addEventListener('click', (e) => {
            e.preventDefault();
            this.handleResendCode();
        });

        // Password visibility toggle
        document.querySelectorAll('.toggle-password').forEach(button => {
            button.addEventListener('click', (e) => {
                this.togglePasswordVisibility(e.target.closest('.toggle-password'));
            });
        });
    }

    generateDemoCode() {
        // Generate a random 6-digit code for demo purposes
        this.verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Display the code for demo purposes (in real app, this would be sent via email)
        const codeDisplay = document.getElementById('codeDisplay');
        codeDisplay.innerHTML = `
            <div class="demo-code">
                <h4>Demo Verification Code</h4>
                <p>For testing purposes, use this code: <strong>${this.verificationCode}</strong></p>
                <small>In a real application, this would be sent to your email.</small>
            </div>
        `;
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

    async handleEmailSubmit() {
        const email = document.getElementById('forgotEmail').value.trim();
        const button = document.querySelector('#emailForm .btn-primary');

        if (!this.validateEmail(email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return;
        }

        // Check if user exists
        const users = this.getUsers();
        const user = users.find(u => u.email === email);

        if (!user) {
            this.showNotification('No account found with this email address', 'error');
            return;
        }

        this.userEmail = email;

        // Show loading state
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending Code...';
        button.disabled = true;

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Move to next step
        this.goToStep(2);
        
        button.innerHTML = originalText;
        button.disabled = false;

        this.showNotification('Verification code sent to your email', 'success');
    }

    async handleCodeSubmit() {
        const enteredCode = document.getElementById('verificationCode').value.trim();
        const button = document.querySelector('#codeForm .btn-primary');

        if (enteredCode.length !== 6) {
            this.showNotification('Please enter the 6-digit verification code', 'error');
            return;
        }

        if (enteredCode !== this.verificationCode) {
            this.showNotification('Invalid verification code. Please try again.', 'error');
            document.getElementById('verificationCode').value = '';
            return;
        }

        // Show loading state
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
        button.disabled = true;

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Move to next step
        this.goToStep(3);
        
        button.innerHTML = originalText;
        button.disabled = true;

        this.showNotification('Code verified successfully!', 'success');
    }

    async handlePasswordSubmit() {
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const button = document.querySelector('#passwordForm .btn-primary');

        if (newPassword.length < 6) {
            this.showNotification('Password must be at least 6 characters long', 'error');
            return;
        }

        if (newPassword !== confirmPassword) {
            this.showNotification('Passwords do not match', 'error');
            return;
        }

        // Show loading state
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';
        button.disabled = true;

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Update user password
        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.email === this.userEmail);

        if (userIndex !== -1) {
            users[userIndex].password = newPassword;
            localStorage.setItem('ordering_system_users', JSON.stringify(users));

            this.showNotification('Password reset successfully! Redirecting to login...', 'success');

            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            this.showNotification('Error: User not found', 'error');
            button.innerHTML = originalText;
            button.disabled = false;
        }
    }

    async handleResendCode() {
        const resendLink = document.getElementById('resendCode');
        
        // Disable resend for 60 seconds
        resendLink.style.pointerEvents = 'none';
        resendLink.style.opacity = '0.6';
        
        let countdown = 60;
        const originalText = resendLink.textContent;
        
        const timer = setInterval(() => {
            resendLink.textContent = `Resend Code (${countdown}s)`;
            countdown--;
            
            if (countdown < 0) {
                clearInterval(timer);
                resendLink.textContent = originalText;
                resendLink.style.pointerEvents = 'auto';
                resendLink.style.opacity = '1';
            }
        }, 1000);

        // Generate new code
        this.generateDemoCode();
        this.showNotification('New verification code sent to your email', 'success');
    }

    goToStep(step) {
        this.currentStep = step;
        
        // Update steps UI
        document.querySelectorAll('.step').forEach((stepEl, index) => {
            if (index + 1 <= step) {
                stepEl.classList.add('active');
            } else {
                stepEl.classList.remove('active');
            }
        });

        // Show correct form
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.remove('active');
        });
        
        document.getElementById(
            step === 1 ? 'emailForm' :
            step === 2 ? 'codeForm' : 'passwordForm'
        ).classList.add('active');
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    getUsers() {
        return JSON.parse(localStorage.getItem('ordering_system_users') || '[]');
    }

    showNotification(message, type) {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Remove after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
}

// Add additional CSS for forgot password page
const additionalStyles = `
    .auth-steps {
        display: flex;
        justify-content: space-between;
        margin-bottom: 2rem;
        position: relative;
    }

    .auth-steps::before {
        content: '';
        position: absolute;
        top: 20px;
        left: 0;
        right: 0;
        height: 2px;
        background: var(--surface-light);
        z-index: 1;
    }

    .step {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        z-index: 2;
        flex: 1;
    }

    .step-number {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--surface-light);
        border: 2px solid var(--border);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        color: var(--text-light);
        margin-bottom: 0.5rem;
        transition: var(--transition);
    }

    .step.active .step-number {
        background: var(--gradient);
        border-color: var(--primary);
        color: white;
    }

    .step span {
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--text-light);
        transition: var(--transition);
    }

    .step.active span {
        color: var(--text);
    }

    .step-info {
        text-align: center;
        color: var(--text-light);
        margin-bottom: 1.5rem;
        font-size: 0.9rem;
    }

    .resend-link {
        text-align: center;
        margin-top: 1rem;
        font-size: 0.9rem;
        color: var(--text-light);
    }

    .resend-link a {
        color: var(--primary);
        text-decoration: none;
        font-weight: 600;
    }

    .resend-link a:hover {
        text-decoration: underline;
    }

    .demo-code {
        background: var(--surface-light);
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        padding: 1rem;
        margin-top: 1rem;
        text-align: center;
    }

    .demo-code h4 {
        margin-bottom: 0.5rem;
        color: var(--text);
    }

    .demo-code p {
        margin-bottom: 0.5rem;
        color: var(--text-light);
    }

    .demo-code strong {
        color: var(--secondary);
        font-size: 1.1rem;
    }

    .demo-code small {
        color: var(--text-light);
        opacity: 0.7;
    }

    .link {
        text-align: center;
        margin-top: 1.5rem;
    }

    .link a {
        color: var(--primary);
        text-decoration: none;
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        transition: var(--transition);
    }

    .link a:hover {
        color: var(--secondary);
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize the forgot password system
document.addEventListener('DOMContentLoaded', () => {
    new ForgotPassword();
});