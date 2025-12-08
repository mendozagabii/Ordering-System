class StaffApp {
    constructor() {
        this.orders = [];
        this.currentOrder = null;
        this.init();
    }

    init() {
        this.loadOrders();
        this.setupEventListeners();
        this.renderOrders();
        this.updateStats();
        this.updateUserDisplay();
        this.startAutoRefresh();
    }

    setupEventListeners() {
        // Search functionality
        document.getElementById('order-search').addEventListener('input', (e) => {
            this.filterOrders();
        });

        // Modal close
        document.querySelector('.close-modal').addEventListener('click', () => {
            this.closeModal();
        });

        // Logout
        document.getElementById('staff-logout-btn').addEventListener('click', () => {
            this.handleLogout();
        });

        // Close modal on overlay click
        document.getElementById('order-modal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.closeModal();
            }
        });
    }

    updateUserDisplay() {
        const users = JSON.parse(localStorage.getItem('ordering_system_users') || '[]');
        const currentUser = users.find(user => user.isLoggedIn);
        const userDisplay = document.getElementById('staff-user-display');
        
        if (userDisplay && currentUser) {
            userDisplay.textContent = currentUser.fullName || 'Staff Member';
        }
    }

    loadOrders() {
        this.orders = JSON.parse(localStorage.getItem('flavorfusion_orders') || '[]');
    }

    saveOrders() {
        localStorage.setItem('flavorfusion_orders', JSON.stringify(this.orders));
    }

    updateStats() {
        const pending = this.orders.filter(order => order.status === 'Order Placed').length;
        const preparing = this.orders.filter(order => order.status === 'Preparing Food').length;
        const ready = this.orders.filter(order => order.status === 'Ready for Pickup').length;
        const completed = this.orders.filter(order => order.status === 'Completed').length;

        document.getElementById('pending-count').textContent = pending;
        document.getElementById('progress-count').textContent = preparing;
        document.getElementById('ready-count').textContent = ready;
        document.getElementById('completed-count').textContent = completed;
    }

    filterOrders() {
        const statusFilter = document.getElementById('status-filter').value;
        const searchTerm = document.getElementById('order-search').value.toLowerCase();

        let filtered = this.orders;

        if (statusFilter !== 'all') {
            filtered = filtered.filter(order => order.status === statusFilter);
        }

        if (searchTerm) {
            filtered = filtered.filter(order => 
                order.id.toString().includes(searchTerm) ||
                (order.customerName && order.customerName.toLowerCase().includes(searchTerm))
            );
        }

        this.renderOrders(filtered);
    }

    renderOrders(ordersToRender = this.orders) {
        const container = document.getElementById('orders-container');
        
        if (ordersToRender.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-clipboard-list"></i>
                    <h3>No orders found</h3>
                    <p>There are no orders matching your criteria</p>
                </div>
            `;
            return;
        }

        // Sort by timestamp (newest first)
        const sortedOrders = [...ordersToRender].sort((a, b) => 
            new Date(b.timestamp) - new Date(a.timestamp)
        );

        container.innerHTML = sortedOrders.map((order, index) => {
            const orderTime = new Date(order.timestamp).toLocaleString();
            const total = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 50.00;
            
            let statusClass = '';
            let nextActionBtn = '';
            let actionText = '';

            switch(order.status) {
                case 'Order Placed':
                    statusClass = 'status-placed';
                    nextActionBtn = `<button class="status-btn btn-prepare" onclick="staffApp.prepareOrder(${order.id})">
                        <i class="fas fa-play"></i> Start Preparing
                    </button>`;
                    actionText = 'Start Preparing';
                    break;
                case 'Preparing Food':
                    statusClass = 'status-preparing';
                    nextActionBtn = `<button class="status-btn btn-ready" onclick="staffApp.markReady(${order.id})">
                        <i class="fas fa-check"></i> Mark Ready
                    </button>`;
                    actionText = 'Mark Ready';
                    break;
                case 'Ready for Pickup':
                    statusClass = 'status-ready';
                    nextActionBtn = `<button class="status-btn btn-complete" onclick="staffApp.completeOrder(${order.id})">
                        <i class="fas fa-flag-checkered"></i> Complete
                    </button>`;
                    actionText = 'Complete Order';
                    break;
                case 'Completed':
                    statusClass = 'status-completed';
                    nextActionBtn = `<button class="status-btn" onclick="staffApp.removeOrder(${order.id})" style="background: var(--secondary); color: white;">
                        <i class="fas fa-trash"></i> Remove
                    </button>`;
                    actionText = 'Remove Order';
                    break;
                case 'Cancelled':
                    statusClass = 'status-cancelled';
                    nextActionBtn = `<button class="status-btn" onclick="staffApp.removeOrder(${order.id})" style="background: var(--secondary); color: white;">
                        <i class="fas fa-trash"></i> Remove
                    </button>`;
                    actionText = 'Remove Order';
                    break;
            }

            return `
                <div class="order-card" style="animation-delay: ${index * 0.1}s">
                    <div class="order-header">
                        <div class="order-info">
                            <h3>Order #${order.id}</h3>
                            <p class="order-time">${orderTime}</p>
                        </div>
                        <div class="order-status ${statusClass}">${order.status}</div>
                    </div>
                    
                    <div class="order-items">
                        ${order.items.map(item => `
                            <div class="order-item">
                                <div class="item-name">
                                    <span class="item-quantity">${item.quantity}x</span>
                                    ${item.name}
                                </div>
                                <div class="item-price">₱${(item.price * item.quantity).toFixed(2)}</div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="order-total">
                        Total: ₱${total.toFixed(2)}
                    </div>
                    
                    <div class="order-actions">
                        <button class="status-btn btn-view" onclick="staffApp.viewOrder(${order.id})">
                            <i class="fas fa-eye"></i> View Details
                        </button>
                        ${nextActionBtn}
                    </div>
                </div>
            `;
        }).join('');
    }

    viewOrder(orderId) {
        this.currentOrder = this.orders.find(order => order.id === orderId);
        if (!this.currentOrder) return;

        const modal = document.getElementById('order-modal');
        const total = this.currentOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Populate modal
        document.getElementById('modal-order-id').textContent = this.currentOrder.id;
        document.getElementById('modal-customer').textContent = this.currentOrder.customerName || 'Guest';
        document.getElementById('modal-time').textContent = new Date(this.currentOrder.timestamp).toLocaleString();
        
        const statusElement = document.getElementById('modal-status');
        statusElement.textContent = this.currentOrder.status;
        statusElement.className = `status-badge ${this.getStatusClass(this.currentOrder.status)}`;

        document.getElementById('modal-subtotal').textContent = `₱${total.toFixed(2)}`;
        document.getElementById('modal-total').textContent = `₱${(total + 50.00).toFixed(2)}`;

        // Populate items
        const itemsContainer = document.getElementById('modal-items');
        itemsContainer.innerHTML = this.currentOrder.items.map(item => `
            <div class="item-row">
                <div class="item-detail">
                    <span class="item-quantity-badge">${item.quantity}x</span>
                    <div>
                        <div class="item-name">${item.name}</div>
                        <div class="item-desc">${item.desc}</div>
                    </div>
                </div>
                <div class="item-price">₱${(item.price * item.quantity).toFixed(2)}</div>
            </div>
        `).join('');

        // Update action button
        const actionBtn = document.getElementById('modal-action-btn');
        actionBtn.onclick = () => this.updateOrderStatus();

        modal.classList.add('active');
    }

    getStatusClass(status) {
        switch(status) {
            case 'Order Placed': return 'status-placed';
            case 'Preparing Food': return 'status-preparing';
            case 'Ready for Pickup': return 'status-ready';
            case 'Completed': return 'status-completed';
            case 'Cancelled': return 'status-cancelled';
            default: return '';
        }
    }

    closeModal() {
        document.getElementById('order-modal').classList.remove('active');
        this.currentOrder = null;
    }

    updateOrderStatus() {
        if (!this.currentOrder) return;

        const currentStatus = this.currentOrder.status;
        let newStatus = '';

        switch(currentStatus) {
            case 'Order Placed': newStatus = 'Preparing Food'; break;
            case 'Preparing Food': newStatus = 'Ready for Pickup'; break;
            case 'Ready for Pickup': newStatus = 'Completed'; break;
            default: return;
        }

        this.updateOrderStatusById(this.currentOrder.id, newStatus);
        this.closeModal();
    }

    prepareOrder(orderId) {
        this.updateOrderStatusById(orderId, 'Preparing Food');
    }

    markReady(orderId) {
        this.updateOrderStatusById(orderId, 'Ready for Pickup');
    }

    completeOrder(orderId) {
        this.updateOrderStatusById(orderId, 'Completed');
    }

    updateOrderStatusById(orderId, newStatus) {
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
            order.status = newStatus;
            this.saveOrders();
            this.renderOrders();
            this.updateStats();
            this.showNotification(`Order #${orderId} status updated to ${newStatus}`, 'success');
        }
    }

    removeOrder(orderId) {
        if (confirm('Are you sure you want to remove this order?')) {
            this.orders = this.orders.filter(order => order.id !== orderId);
            this.saveOrders();
            this.renderOrders();
            this.updateStats();
            this.showNotification('Order removed successfully', 'success');
        }
    }

    refreshOrders() {
        this.loadOrders();
        this.renderOrders();
        this.updateStats();
        
        const btn = event?.target?.closest('.action-btn');
        if (btn) {
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
            btn.disabled = true;
            
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.disabled = false;
            }, 1000);
        }
        
        this.showNotification('Orders refreshed', 'success');
    }

    markAllPreparing() {
        const pendingOrders = this.orders.filter(order => order.status === 'Order Placed');
        pendingOrders.forEach(order => {
            order.status = 'Preparing Food';
        });
        
        if (pendingOrders.length > 0) {
            this.saveOrders();
            this.renderOrders();
            this.updateStats();
            this.showNotification(`Started preparing ${pendingOrders.length} orders`, 'success');
        }
    }

    markAllReady() {
        const preparingOrders = this.orders.filter(order => order.status === 'Preparing Food');
        preparingOrders.forEach(order => {
            order.status = 'Ready for Pickup';
        });
        
        if (preparingOrders.length > 0) {
            this.saveOrders();
            this.renderOrders();
            this.updateStats();
            this.showNotification(`Marked ${preparingOrders.length} orders as ready`, 'success');
        }
    }

    clearCompleted() {
        const completedOrders = this.orders.filter(order => order.status === 'Completed');
        if (completedOrders.length === 0) return;

        if (confirm(`Remove ${completedOrders.length} completed orders?`)) {
            this.orders = this.orders.filter(order => order.status !== 'Completed');
            this.saveOrders();
            this.renderOrders();
            this.updateStats();
            this.showNotification('Completed orders cleared', 'success');
        }
    }

    startAutoRefresh() {
        // Auto-refresh every 30 seconds
        setInterval(() => {
            this.refreshOrders();
        }, 30000);
    }

    handleLogout() {
        const users = JSON.parse(localStorage.getItem('ordering_system_users') || '[]');
        const updatedUsers = users.map(user => ({
            ...user,
            isLoggedIn: false
        }));
        localStorage.setItem('ordering_system_users', JSON.stringify(updatedUsers));
        window.location.href = 'login.html';
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

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

// Initialize the staff app
const staffApp = new StaffApp();