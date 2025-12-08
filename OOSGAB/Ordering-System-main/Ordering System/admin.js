class AdminApp {
    constructor() {
        this.menuData = [];
        this.users = [];
        this.orders = [];
        this.currentUser = null;
        this.editingItem = null;
        this.selectedUser = null;
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.renderMenuItems();
        this.renderUsers();
        this.updateOverview();
        this.updateUserDisplay();
        // analytics initialization
        this.initAnalytics();
    }

    loadData() {
        this.menuData = JSON.parse(localStorage.getItem('flavorfusion_menu') || '[]');
        this.users = JSON.parse(localStorage.getItem('ordering_system_users') || '[]');
        this.orders = JSON.parse(localStorage.getItem('flavorfusion_orders') || '[]');
        
        // Initialize default menu items if empty
        if (this.menuData.length === 0) {
            this.initializeDefaultMenu();
        }
    }

    initializeDefaultMenu() {
        this.menuData = [
            // Filipino Comfort Cravings
            {
                id: 1,
                name: "Adobo Rice Bowl",
                price: 90.00,
                category: "filipino",
                dietary: [],
                desc: "Classic Filipino adobo served with steamed rice, full of savory and garlicky flavor.",
                image: "https://www.shutterstock.com/image-photo/filipino-food-belly-pork-hamonado-600nw-760028194.jpg"
            },
            {
                id: 2,
                name: "Sisig Overload",
                price: 130.00,
                category: "filipino",
                dietary: [],
                desc: "Crispy and spicy chopped meat topped with egg and calamansi, perfect with rice.",
                image: "https://eatbook.sg/wp-content/uploads/2024/02/don-lechon-sisig.jpg"
            },
            {
                id: 3,
                name: "Crispy Liempo Meal",
                price: 150.00,
                category: "filipino",
                dietary: [],
                desc: "Deep-fried pork belly that's crispy on the outside and juicy inside, served with rice.",
                image: "https://macchefsdepot.com/cdn/shop/products/DSC_9718_530x@2x.jpg?v=1629130204"
            },
            {
                id: 4,
                name: "Sinigang",
                price: 80.00,
                category: "filipino",
                dietary: [],
                desc: "A sour soup made with pork or shrimp and vegetables, perfect for rainy days.",
                image: "https://images.deliveryhero.io/image/fd-ph/Products/58152309.jpg?width=%s"
            },
            {
                id: 5,
                name: "Bicol Express Rice Bowl",
                price: 120.00,
                category: "filipino",
                dietary: ["spicy"],
                desc: "Creamy and spicy pork cooked in coconut milk and chili, served over rice.",
                image: "https://www.kawalingpinoy.com/wp-content/uploads/2017/11/chicken-bicol-express-3-2.jpg"
            },
            {
                id: 6,
                name: "Chicken Inasal with Java Rice",
                price: 125.00,
                category: "filipino",
                dietary: [],
                desc: "Grilled chicken marinated in special spices, paired with tasty Java rice.",
                image: "https://i.ytimg.com/vi/XQPqOfSricc/maxresdefault.jpg"
            },

            // Street Food Favorites
            {
                id: 7,
                name: "Kwek-Kwek",
                price: 30.00,
                category: "streetfood",
                dietary: ["vegetarian"],
                desc: "Orange-coated quail eggs deep-fried and served with sweet or spicy sauce.",
                image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhrzJTZSnCOOrAvCRVMjAFUsA7BPRZgtXpYjlG7U9BAg45eaetFZ46rH5aN7ADFe-pEQjo02RlrytZeJYF8e9nzWJuCTVKCnXhEeWMARkc2ozOfLsO77SYxScY4ZjbCttgjEI5rn9nc/s1600/kwek-kwek.jpg"
            },
            {
                id: 8,
                name: "Street Food Platter",
                price: 50.00,
                category: "streetfood",
                dietary: [],
                desc: "Classic Pinoy street snacks with dipping sauces that make them extra delicious.",
                image: "https://thumbs.dreamstime.com/b/bowl-kikiam-fish-ball-squid-ball-sweet-chili-soy-sauce-kikiam-fish-ball-squid-ball-sweet-chili-soy-sauce-253705310.jpg"
            },
            {
                id: 9,
                name: "BBQ",
                price: 75.00,
                category: "streetfood",
                dietary: [],
                desc: "Tender, marinated meat on a stick, grilled to smoky perfection.",
                image: "https://farm8.staticflickr.com/7116/7450311072_40bb43f912_z.jpg"
            },
           
            // Fast-Food Style Bites
            {
                id: 12,
                name: "Classic Cheese Burger",
                price: 70.00,
                category: "fastfood",
                dietary: [],
                desc: "Juicy patties with cheese, lettuce, and sauce in a soft bun.",
                image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80"
            },
            {
                id: 13,
                name: "Chicken Wings Platter",
                price: 199.00,
                category: "fastfood",
                dietary: [],
                desc: "Fried wings coated in your choice of sauce like BBQ, spicy, or garlic butter.",
                image: "https://images.summitmedia-digital.com/spotph/images/2018/05/22/spicedkpopin.jpg"
            },
            {
                id: 14,
                name: "Loaded Fries",
                price: 100.00,
                category: "fastfood",
                dietary: ["vegetarian"],
                desc: "Crispy fries topped with cheese, mayo, and flavorful seasonings.",
                image: "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2016/3/31/4/FNM_050116-Garlic-Fries-with-Lemon-Mayonnaise-Recipe_s4x3.jpg.rend.hgtvcom.1280.1280.suffix/1459549453565.webp"
            },
            {
                id: 15,
                name: "Hotdog Sandwich",
                price: 75.00,
                category: "fastfood",
                dietary: [],
                desc: "Grilled hotdog in a bun with ketchup, mayo, and toppings.",
                image: "https://static.toiimg.com/thumb/75690366.cms?imgsize=1716076&width=800&height=800"
            },
            {
                id: 16,
                name: "Nachos Supreme",
                price: 125.00,
                category: "fastfood",
                dietary: [],
                desc: "Crunchy nachos loaded with cheese, meat, and special sauce.",
                image: "https://nodashofgluten.com/wp-content/uploads/2024/01/Epic-Beef-Nachos-Supreme-1-1.png.webp"
            },

            // Sweet Cravings
            {
                id: 17,
                name: "Churros",
                price: 130.00,
                category: "sweets",
                dietary: ["vegetarian"],
                desc: "Fried dough sticks coated in sugar and served with chocolate dipping sauce.",
                image: "https://www.recipetineats.com/uploads/2016/08/Churros_9.jpg"
            },
            {
                id: 18,
                name: "Leche Flan Cup",
                price: 45.00,
                category: "sweets",
                dietary: ["vegetarian"],
                desc: "Sweet and creamy caramel custard in small cups.",
                image: "https://eatmedrinkmeblog.com/wp-content/uploads/2015/04/IMG_2385-2.jpg"
            },
            {
                id: 19,
                name: "Brownies",
                price: 60.00,
                category: "sweets",
                dietary: ["vegetarian"],
                desc: "Soft and chewy chocolate squares that melt in your mouth.",
                image: "https://www.northernbrownies.co.uk/cdn/shop/products/IMG_2591.jpg?v=1648667430"
            },
            {
                id: 20,
                name: "Mango Graham Cups",
                price: 80.00,
                category: "sweets",
                dietary: ["vegetarian"],
                desc: "Layers of mango, graham, and cream for a sweet tropical treat.",
                image: "https://i.ytimg.com/vi/deVeLWfM3qI/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCmzV4B6OPL7LF7IcmQkALVhiMXaA"
            },
            {
                id: 21,
                name: "Buko Pandan Jelly",
                price: 75.00,
                category: "sweets",
                dietary: ["vegetarian"],
                desc: "A cool dessert made with coconut, pandan jelly, and cream.",
                image: "https://www.thepeachkitchen.com/wp-content/uploads/2019/12/IG-Photo-1.png"
            },

            // Drinks & Refreshments
            {
                id: 22,
                name: "Classic Milk Tea",
                price: 60.00,
                category: "drinks",
                dietary: ["vegetarian"],
                desc: "Creamy tea with milk and chewy pearls in different flavors.",
                image: "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/8f1e6c865e5b4ef0a1f8d15b3f676202/BFV69042_HowToMakeBobaFromScratch_JP_Final_YT.jpg?resize=1200:*&output-format=jpg&output-quality=auto"
            },
            {
                id: 23,
                name: "Fruit Tea",
                price: 60.00,
                category: "drinks",
                dietary: ["vegetarian"],
                desc: "Light and refreshing tea with fruity flavors like mango or lychee.",
                image: "https://pizzazzerie.com/wp-content/uploads/2021/03/southern-fruit-tea-recipe-03-scaled.jpg"
            },
            {
                id: 24,
                name: "Iced Coffee Blends",
                price: 75.00,
                category: "drinks",
                dietary: ["vegetarian"],
                desc: "Iced coffee to boost your energy and mood.",
                image: "https://myeverydaytable.com/wp-content/uploads/IcedShakenEspresso1-1.jpg"
            },
            {
                id: 25,
                name: "Fruit Smoothies",
                price: 60.00,
                category: "drinks",
                dietary: ["vegetarian"],
                desc: "Cold, blended drinks made with real fruits for a healthy and sweet refreshment.",
                image: "https://www.acouplecooks.com/wp-content/uploads/2020/12/Dragonfruit-Smoothie-005.jpg"
            }
        ];
        this.saveMenuData();
    }

    saveMenuData() {
        localStorage.setItem('flavorfusion_menu', JSON.stringify(this.menuData));
    }

    saveUsers() {
        localStorage.setItem('ordering_system_users', JSON.stringify(this.users));
    }

    setupEventListeners() {
        // Search functionality
        document.getElementById('menu-search').addEventListener('input', (e) => {
            this.filterMenuItems();
        });

        // Filter tabs
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.handleRoleFilter(e.target);
            });
        });

        // Logout
        document.getElementById('admin-logout-btn').addEventListener('click', () => {
            this.handleLogout();
        });
    }

    // Listen for cross-tab data changes so analytics update when orders are placed from customer pages
    watchStorageChanges() {
        window.addEventListener('storage', (e) => {
            if (!e.key) return;
            // interested in changes that affect analytics
            if (['flavorfusion_orders', 'flavorfusion_menu', 'ordering_system_users'].includes(e.key)) {
                // reload data and refresh
                this.loadData();
                this.renderMenuItems();
                this.renderUsers();
                this.updateOverview();
            }
        });
    }

    updateUserDisplay() {
        this.currentUser = this.users.find(user => user.isLoggedIn);
        const userDisplay = document.getElementById('admin-user-display');
        
        if (userDisplay && this.currentUser) {
            userDisplay.textContent = this.currentUser.fullName || 'Administrator';
        }
    }

    updateOverview() {
        const totalRevenue = this.orders.reduce((sum, order) => sum + order.total, 0);
        
        document.getElementById('total-users').textContent = this.users.length;
        document.getElementById('total-orders').textContent = this.orders.length;
        document.getElementById('total-items').textContent = this.menuData.length;
        document.getElementById('total-revenue').textContent = totalRevenue.toFixed(2);
        // refresh analytics metrics/charts if visible
        if (this.analytics) this.updateAnalytics();
    }

    /* -------------------- Analytics -------------------- */
    initAnalytics() {
        this.analytics = {
            periodSelect: document.getElementById('analytics-period'),
            metricsGrid: document.getElementById('analytics-metrics-grid'),
            charts: {}
        };

        if (!this.analytics.periodSelect) return; // analytics UI not present

        // bind change
        this.analytics.periodSelect.addEventListener('change', () => this.updateAnalytics());

        // add refresh handler (re-read localStorage and refresh charts)
        const refreshBtn = document.getElementById('analytics-refresh');
        if (refreshBtn) refreshBtn.addEventListener('click', () => {
            this.loadData();
            this.updateOverview();
            this.updateAnalytics();
            this.showNotification('Analytics refreshed', 'success');
        });

        // start watching for storage updates
        this.watchStorageChanges();

        // create chart placeholders
        const chartIds = [
            'chart-sales-time',
            'chart-revenue-breakdown',
            'chart-best-products',
            'chart-customer-frequency',
            'chart-peak-hours',
            'chart-top-ingredients'
        ];

        chartIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                this.analytics.charts[id] = { el, chart: null };
            }
        });

        // initial draw
        this.updateAnalytics();
    }

    updateAnalytics() {
        const periodVal = this.analytics.periodSelect.value || '30';
        const isAll = periodVal === 'all';
        const days = isAll ? null : parseInt(periodVal, 10);
        const now = new Date();
        const orders = this.getOrdersInRange(days);

        // Key metrics
        const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
        const totalOrders = orders.length;
        const customers = new Set(orders.map(o => o.customerId || o.userId || o.user || o.email)).size;
        const aov = totalOrders ? totalRevenue / totalOrders : 0;

        // compute previous period for trend (same length directly preceding)
        // previous period only applies for date-windowed selections
        const prevOrders = (isAll || !days) ? [] : this.getOrdersInRange(days, -days);
        const prevRevenue = prevOrders.reduce((s, o) => s + (o.total || 0), 0);
        const prevTotalOrders = prevOrders.length;
        const prevCustomers = new Set(prevOrders.map(o => o.customerId || o.userId || o.user || o.email)).size;
        const prevAov = prevTotalOrders ? prevRevenue / prevTotalOrders : 0;

        // update DOM metric cards
        document.getElementById('metric-total-revenue').textContent = `₱${totalRevenue.toFixed(2)}`;
        document.getElementById('metric-total-orders').textContent = totalOrders;
        document.getElementById('metric-total-customers').textContent = customers;
        document.getElementById('metric-aov').textContent = `₱${aov.toFixed(2)}`;

        const setTrend = (elId, current, previous, isCurrency = false) => {
            const el = document.getElementById(elId);
            if (!el) return;
            if (previous === 0 && current === 0) return el.textContent = '—';
            const diff = previous === 0 ? 100 : ((current - previous) / (previous || 1)) * 100;
            const sign = diff > 0 ? '+' : '';
            const formatted = `${sign}${diff.toFixed(1)}% vs prev`;
            el.textContent = formatted;
            el.className = `metric-trend ${diff >= 0 ? 'up' : 'down'}`;
        };

        setTrend('metric-total-revenue-trend', totalRevenue, prevRevenue, true);
        setTrend('metric-total-orders-trend', totalOrders, prevTotalOrders);
        setTrend('metric-total-customers-trend', customers, prevCustomers);
        setTrend('metric-aov-trend', aov, prevAov, true);

        // If the selected range produced 0 orders and there are orders overall, fall back to showing all orders
        let usedOrders = orders;
        let usedDays = days;
        let fallbackAll = false;
        if ((!orders || orders.length === 0) && this.orders && this.orders.length > 0) {
            usedOrders = this.orders;
            usedDays = null;
            fallbackAll = true;
        }

        // Charts
        this.renderSalesOverTimeChart(usedOrders, usedDays);
        this.renderRevenueBreakdownChart(usedOrders);
        this.renderBestProductsChart(usedOrders);
        this.renderCustomerFrequencyChart(usedOrders);
        this.renderPeakHoursChart(usedOrders);
        this.renderTopIngredientsChart(usedOrders);

        // show a small info if we had to fallback to all-time data
        const fallbackNotice = document.getElementById('analytics-fallback-notice');
        if (fallbackAll) {
            if (!fallbackNotice) {
                const container = this.analytics.metricsGrid?.parentNode || document.querySelector('.analytics-main-section');
                if (container) {
                    const el = document.createElement('div');
                    el.id = 'analytics-fallback-notice';
                    el.className = 'analytics-fallback';
                    el.textContent = 'No data for selected period — showing all-time results.';
                    container.insertBefore(el, this.analytics.metricsGrid?.nextSibling || container.firstChild);
                }
            }
        } else {
            if (fallbackNotice && fallbackNotice.parentNode) fallbackNotice.parentNode.removeChild(fallbackNotice);
        }
    }

    // flexible date parsing and range selection. Negative shiftDays allows selecting previous range
    getOrdersInRange(days, shiftDays = 0) {
        if (!this.orders || !Array.isArray(this.orders) || this.orders.length === 0) return [];

        const now = new Date();
        // endTime is now shifted by shiftDays (e.g., -30 for previous window)
        const end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        end.setDate(end.getDate() + shiftDays);
        const start = new Date(end);
        start.setDate(start.getDate() - days + 1);

        const inRange = (dateValue) => {
            if (!dateValue) return false;
            const d = new Date(dateValue);
            if (isNaN(d)) return false;
            return d >= start && d <= end;
        };

        return this.orders.filter(o => inRange(o.date || o.dateCreated || o.createdAt || o.timestamp));
    }

    renderSalesOverTimeChart(orders, days) {
        const id = 'chart-sales-time';
        const store = this.analytics.charts[id];
        if (!store) return;

        if (!orders || orders.length === 0) {
            // clear chart if exists
            if (store.chart) { store.chart.destroy(); store.chart = null; }
            store.el.getContext('2d').clearRect(0, 0, store.el.width, store.el.height);
            return;
        }

        // Bucket by day. If days is null/undefined => derive from orders' date range (all-time)
        const buckets = {};
        if (!days) {
            // build buckets from unique days found in orders
            const seen = new Set();
            orders.forEach(o => {
                const dateVal = new Date(o.date || o.dateCreated || o.createdAt || o.timestamp || Date.now());
                const k = dateVal.toISOString().slice(0, 10);
                if (!seen.has(k)) {
                    seen.add(k);
                    buckets[k] = { revenue: 0, orders: 0 };
                }
            });
        } else {
            for (let i = 0; i < days; i++) {
                const d = new Date();
                d.setDate(d.getDate() - (days - 1 - i));
                const k = d.toISOString().slice(0, 10);
                buckets[k] = { revenue: 0, orders: 0 };
            }
        }

        orders.forEach(order => {
            const dateVal = new Date(order.date || order.dateCreated || order.createdAt || order.timestamp || Date.now());
            const k = dateVal.toISOString().slice(0, 10);
            if (!buckets[k]) buckets[k] = { revenue: 0, orders: 0 };
            buckets[k].orders += 1;
            buckets[k].revenue += (order.total || 0);
        });

        const labels = Object.keys(buckets).sort();
        const revenueData = labels.map(l => buckets[l].revenue);
        const ordersData = labels.map(l => buckets[l].orders);

        // create or update chart
        if (store.chart) {
            store.chart.data.labels = labels;
            store.chart.data.datasets[0].data = revenueData;
            store.chart.data.datasets[1].data = ordersData;
            store.chart.update();
            return;
        }

        store.chart = new Chart(store.el.getContext('2d'), {
            type: 'bar',
            data: {
                labels,
                datasets: [
                    {
                        type: 'line',
                        label: 'Revenue (₱)',
                        data: revenueData,
                        yAxisID: 'y1',
                        borderColor: '#4e79a7',
                        backgroundColor: 'rgba(78,121,167,0.1)',
                        tension: 0.3,
                        pointRadius: 2,
                    },
                    {
                        type: 'bar',
                        label: 'Orders',
                        data: ordersData,
                        yAxisID: 'y',
                        backgroundColor: '#f28e2b'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                stacked: false,
                scales: {
                    y: { beginAtZero: true, position: 'left', title: { display: true, text: 'Orders' } },
                    y1: { beginAtZero: true, position: 'right', grid: { drawOnChartArea: false }, title: { display: true, text: 'Revenue (₱)' } }
                }
            }
        });
    }

    renderRevenueBreakdownChart(orders) {
        const id = 'chart-revenue-breakdown';
        const store = this.analytics.charts[id];
        if (!store) return;

        // revenue per product
        const revenueByProduct = {};
        orders.forEach(order => {
            if (!order.items || !Array.isArray(order.items)) return;
            order.items.forEach(it => {
                const idKey = it.id || it.itemId || it.item || it.name || JSON.stringify(it);
                const qty = it.qty || it.quantity || it.qtyOrdered || 1;
                const price = it.price || it.unitPrice || (this.menuData.find(m => String(m.id) === String(idKey)) || {}).price || 0;
                revenueByProduct[idKey] = (revenueByProduct[idKey] || 0) + (qty * price);
            });
        });

        const entries = Object.keys(revenueByProduct).map(key => ({ key, revenue: revenueByProduct[key] }));
        // convert id to readable name when possible
        const labels = entries.map(e => {
            const m = this.menuData.find(m => String(m.id) === String(e.key) || m.name === e.key);
            return m ? m.name : String(e.key);
        });
        const data = entries.map(e => e.revenue);

        if (data.length === 0) {
            if (store.chart) { store.chart.destroy(); store.chart = null; }
            store.el.getContext('2d').clearRect(0, 0, store.el.width, store.el.height);
            return;
        }

        if (store.chart) {
            store.chart.data.labels = labels;
            store.chart.data.datasets[0].data = data;
            store.chart.update();
            return;
        }

        store.chart = new Chart(store.el.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels,
                datasets: [{ data, backgroundColor: this.generateColors(labels.length) }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }

    renderBestProductsChart(orders) {
        const id = 'chart-best-products';
        const store = this.analytics.charts[id];
        if (!store) return;

        const counts = {};
        const revenueBy = {};
        orders.forEach(order => {
            if (!order.items || !Array.isArray(order.items)) return;
            order.items.forEach(it => {
                const idKey = it.id || it.itemId || it.item || it.name || JSON.stringify(it);
                const qty = it.qty || it.quantity || it.qtyOrdered || 1;
                const price = it.price || it.unitPrice || (this.menuData.find(m => String(m.id) === String(idKey)) || {}).price || 0;
                counts[idKey] = (counts[idKey] || 0) + qty;
                revenueBy[idKey] = (revenueBy[idKey] || 0) + (qty * price);
            });
        });

        const entries = Object.keys(counts).map(k => ({ key: k, qty: counts[k], revenue: revenueBy[k] || 0 }));
        entries.sort((a, b) => b.qty - a.qty);
        const top = entries.slice(0, 8);

        if (top.length === 0) {
            if (store.chart) { store.chart.destroy(); store.chart = null; }
            store.el.getContext('2d').clearRect(0, 0, store.el.width, store.el.height);
            return;
        }

        const labels = top.map(e => {
            const m = this.menuData.find(m => String(m.id) === String(e.key) || m.name === e.key);
            return m ? m.name : String(e.key);
        });
        const dataQty = top.map(e => e.qty);
        const dataRevenue = top.map(e => e.revenue || 0);

        if (store.chart) {
            store.chart.data.labels = labels;
            store.chart.data.datasets[0].data = dataQty;
            store.chart.data.datasets[1].data = dataRevenue;
            store.chart.update();
            return;
        }

        store.chart = new Chart(store.el.getContext('2d'), {
            type: 'bar',
            data: {
                labels,
                datasets: [
                    { label: 'Units Sold', data: dataQty, backgroundColor: '#4e79a7' },
                    { label: 'Revenue (₱)', data: dataRevenue, backgroundColor: '#f28e2b', yAxisID: 'y1' }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: true }, y1: { beginAtZero: true, position: 'right', grid: { drawOnChartArea: false } } }
            }
        });
    }

    renderCustomerFrequencyChart(orders) {
        const id = 'chart-customer-frequency';
        const store = this.analytics.charts[id];
        if (!store) return;

        const freq = {};
        orders.forEach(order => {
            const cust = order.customerId || order.userId || order.user || order.email || 'unknown';
            freq[cust] = (freq[cust] || 0) + 1;
        });

        const counts = Object.values(freq);
        if (counts.length === 0) {
            if (store.chart) { store.chart.destroy(); store.chart = null; }
            store.el.getContext('2d').clearRect(0, 0, store.el.width, store.el.height);
            return;
        }

        // bucket: 1,2,3,4-5,6+
        const buckets = { '1':0,'2':0,'3':0,'4-5':0,'6+':0 };
        counts.forEach(c => {
            if (c === 1) buckets['1']++;
            else if (c === 2) buckets['2']++;
            else if (c === 3) buckets['3']++;
            else if (c >= 4 && c <=5) buckets['4-5']++;
            else buckets['6+']++;
        });

        const labels = Object.keys(buckets);
        const data = Object.values(buckets);

        if (store.chart) {
            store.chart.data.labels = labels;
            store.chart.data.datasets[0].data = data;
            store.chart.update();
            return;
        }

        store.chart = new Chart(store.el.getContext('2d'), {
            type: 'bar',
            data: { labels, datasets: [{ label: 'Customers', data, backgroundColor: this.generateColors(labels.length) }] },
            options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
        });
    }

    renderPeakHoursChart(orders) {
        const id = 'chart-peak-hours';
        const store = this.analytics.charts[id];
        if (!store) return;

        const hours = new Array(24).fill(0);
        orders.forEach(order => {
            const d = new Date(order.date || order.dateCreated || order.createdAt || order.timestamp || Date.now());
            const h = d.getHours();
            hours[h] = hours[h] + 1;
        });

        const labels = hours.map((_, i) => `${i}:00`);

        if (store.chart) {
            store.chart.data.labels = labels;
            store.chart.data.datasets[0].data = hours;
            store.chart.update();
            return;
        }

        store.chart = new Chart(store.el.getContext('2d'), {
            type: 'line',
            data: { labels, datasets: [{ label: 'Orders', data: hours, borderColor: '#76b7b2', backgroundColor: 'rgba(118,183,178,0.1)', fill: true }] },
            options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
        });
    }

    renderTopIngredientsChart(orders) {
        const id = 'chart-top-ingredients';
        const store = this.analytics.charts[id];
        if (!store) return;

        const ingredientCounts = {};

        // Prefer a structured ingredients array in menu data or order items
        orders.forEach(order => {
            if (!order.items || !Array.isArray(order.items)) return;
            order.items.forEach(it => {
                // item can either be an object with ingredient list, or refer to menuData by id
                if (Array.isArray(it.ingredients) && it.ingredients.length) {
                    it.ingredients.forEach(ing => ingredientCounts[ing] = (ingredientCounts[ing] || 0) + (it.qty || it.quantity || 1));
                    return;
                }

                // try menuData match
                const idKey = it.id || it.itemId || it.item || it.name || JSON.stringify(it);
                const menuItem = this.menuData.find(m => String(m.id) === String(idKey) || m.name === idKey);
                if (menuItem && Array.isArray(menuItem.ingredients) && menuItem.ingredients.length) {
                    menuItem.ingredients.forEach(ing => ingredientCounts[ing] = (ingredientCounts[ing] || 0) + (it.qty || it.quantity || 1));
                }
            });
        });

        const entries = Object.keys(ingredientCounts).map(k => ({ k, cnt: ingredientCounts[k] })).sort((a,b)=>b.cnt-a.cnt);

        if (entries.length === 0) {
            // fallback: try to guess from menuData names (for salad components look for common toppings)
            const guesses = ['Lettuce','Tomato','Cucumber','Onion','Cheese','Croutons','Bacon','Avocado','Egg'];
            const guessedCounts = {};
            this.orders.forEach(order => {
                if (!order.items || !Array.isArray(order.items)) return;
                order.items.forEach(it => {
                    const name = (it.name || (this.menuData.find(m=>String(m.id)===String(it.id))||{}).name || '').toLowerCase();
                    guesses.forEach(g => { if (name.includes(g.toLowerCase())) guessedCounts[g] = (guessedCounts[g]||0) + (it.qty || it.quantity || 1); });
                });
            });
            const guessedEntries = Object.keys(guessedCounts).map(k=>({k,cnt:guessedCounts[k]})).sort((a,b)=>b.cnt-a.cnt);
            if (guessedEntries.length === 0) {
                if (store.chart) { store.chart.destroy(); store.chart = null; }
                store.el.getContext('2d').clearRect(0, 0, store.el.width, store.el.height);
                return;
            }
            const labels = guessedEntries.map(e => e.k);
            const data = guessedEntries.map(e => e.cnt);
            if (store.chart) { store.chart.data.labels = labels; store.chart.data.datasets[0].data = data; store.chart.update(); return; }
            store.chart = new Chart(store.el.getContext('2d'), { type: 'bar', data: { labels, datasets: [{ label: 'Uses', data, backgroundColor: this.generateColors(labels.length) }] }, options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } } });
            return;
        }

        const labels = entries.map(e => e.k);
        const data = entries.map(e => e.cnt);

        if (store.chart) {
            store.chart.data.labels = labels;
            store.chart.data.datasets[0].data = data;
            store.chart.update();
            return;
        }

        store.chart = new Chart(store.el.getContext('2d'), {
            type: 'bar',
            data: { labels, datasets: [{ label: 'Uses', data, backgroundColor: this.generateColors(labels.length) }] },
            options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
        });
    }

    // small helper for color palette
    generateColors(count) {
        const palette = ['#4e79a7','#f28e2b','#e15759','#76b7b2','#59a14f','#edc949','#af7aa1','#ff9da7','#9c755f','#bab0ac'];
        const out = [];
        for (let i = 0; i < count; i++) out.push(palette[i % palette.length]);
        return out;
    }

    filterMenuItems() {
        const searchTerm = document.getElementById('menu-search').value.toLowerCase();
        
        if (!searchTerm) {
            this.renderMenuItems();
            return;
        }

        const filtered = this.menuData.filter(item => 
            item.name.toLowerCase().includes(searchTerm) || 
            item.desc.toLowerCase().includes(searchTerm) ||
            item.category.toLowerCase().includes(searchTerm)
        );

        this.renderMenuItems(filtered);
    }

    handleRoleFilter(selectedTab) {
        // Remove active class from all tabs
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Add active class to selected tab
        selectedTab.classList.add('active');
        
        const role = selectedTab.dataset.role;
        this.renderUsers(role);
    }

    renderMenuItems(items = this.menuData) {
        const container = document.getElementById('menu-items-container');
        
        if (items.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-utensils"></i>
                    <h3>No menu items found</h3>
                    <p>Add your first menu item to get started!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = items.map((item, index) => `
            <div class="menu-item" style="animation-delay: ${index * 0.1}s">
                <div class="item-info">
                    <div class="item-name">${item.name}</div>
                    <div class="item-details">
                        <span class="category">${this.formatCategory(item.category)}</span>
                        <span>•</span>
                        <span class="dietary">${item.dietary.length > 0 ? item.dietary.join(', ') : 'No dietary info'}</span>
                    </div>
                </div>
                <div class="item-price">₱${item.price.toFixed(2)}</div>
                <div class="item-actions">
                    <button class="btn-edit" onclick="adminApp.editMenuItem(${item.id})">
                        <i class="fas fa-edit"></i>
                        Edit
                    </button>
                    <button class="btn-delete" onclick="adminApp.deleteMenuItem(${item.id})">
                        <i class="fas fa-trash"></i>
                        Delete
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderUsers(role = 'all') {
        const container = document.getElementById('users-container');
        let filteredUsers = this.users;

        if (role !== 'all') {
            filteredUsers = this.users.filter(user => user.role === role);
        }

        if (filteredUsers.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-users"></i>
                    <h3>No users found</h3>
                    <p>${role === 'all' ? 'No users in the system' : `No ${role} users found`}</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filteredUsers.map((user, index) => `
            <div class="user-item" style="animation-delay: ${index * 0.1}s">
                <div class="user-info-details">
                    <div class="user-name">${user.fullName || user.email}</div>
                    <div class="user-details">
                        <span class="role-badge role-${user.role}">${user.role}</span>
                        <span>•</span>
                        <span class="status">${user.isLoggedIn ? 'Online' : 'Offline'}</span>
                        <span>•</span>
                        <span class="joined">Joined ${new Date(user.dateRegistered).toLocaleDateString()}</span>
                    </div>
                </div>
                <div class="user-actions-buttons">
                    <button class="btn-role" onclick="adminApp.viewUser(${user.id})">
                        <i class="fas fa-user-cog"></i>
                        Manage
                    </button>
                    <button class="btn-delete" onclick="adminApp.deleteUser(${user.id})">
                        <i class="fas fa-trash"></i>
                        Delete
                    </button>
                </div>
            </div>
        `).join('');
    }

    formatCategory(category) {
        const categories = {
            'appetizer': 'Appetizer',
            'main': 'Main Course',
            'dessert': 'Dessert',
            'beverage': 'Beverage'
        };
        return categories[category] || category;
    }

    showAddItemModal() {
        this.editingItem = null;
        document.getElementById('add-item-form').reset();
        document.getElementById('add-item-modal').classList.add('active');
    }

    closeAddItemModal() {
        document.getElementById('add-item-modal').classList.remove('active');
        this.editingItem = null;
    }

    addMenuItem(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const dietary = [];
        
        if (document.getElementById('diet-vegetarian').checked) dietary.push('vegetarian');
        if (document.getElementById('diet-gluten-free').checked) dietary.push('gluten-free');
        if (document.getElementById('diet-vegan').checked) dietary.push('vegan');

        const itemData = {
            id: this.editingItem ? this.editingItem.id : Date.now(),
            name: document.getElementById('item-name').value,
            price: parseFloat(document.getElementById('item-price').value),
            category: document.getElementById('item-category').value,
            desc: document.getElementById('item-desc').value,
            dietary: dietary,
            image: document.getElementById('item-image').value || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=200&q=80'
        };

        if (this.editingItem) {
            // Update existing item
            const index = this.menuData.findIndex(item => item.id === this.editingItem.id);
            if (index !== -1) {
                this.menuData[index] = itemData;
            }
        } else {
            // Add new item
            this.menuData.push(itemData);
        }

        this.saveMenuData();
        this.renderMenuItems();
        this.updateOverview();
        this.closeAddItemModal();
        
        this.showNotification(
            this.editingItem ? 'Menu item updated successfully!' : 'Menu item added successfully!',
            'success'
        );
    }

    editMenuItem(itemId) {
        this.editingItem = this.menuData.find(item => item.id === itemId);
        if (!this.editingItem) return;

        // Populate form
        document.getElementById('item-name').value = this.editingItem.name;
        document.getElementById('item-price').value = this.editingItem.price;
        document.getElementById('item-category').value = this.editingItem.category;
        document.getElementById('item-desc').value = this.editingItem.desc;
        document.getElementById('item-image').value = this.editingItem.image;

        // Reset checkboxes
        document.getElementById('diet-vegetarian').checked = false;
        document.getElementById('diet-gluten-free').checked = false;
        document.getElementById('diet-vegan').checked = false;

        // Set dietary checkboxes
        this.editingItem.dietary.forEach(diet => {
            const checkbox = document.getElementById(`diet-${diet}`);
            if (checkbox) checkbox.checked = true;
        });

        document.getElementById('add-item-modal').classList.add('active');
    }

    deleteMenuItem(itemId) {
        if (!confirm('Are you sure you want to delete this menu item?')) {
            return;
        }

        this.menuData = this.menuData.filter(item => item.id !== itemId);
        this.saveMenuData();
        this.renderMenuItems();
        this.updateOverview();
        
        this.showNotification('Menu item deleted successfully!', 'success');
    }

    viewUser(userId) {
        this.selectedUser = this.users.find(user => user.id === userId);
        if (!this.selectedUser) return;

        // Populate modal
        document.getElementById('modal-user-name').textContent = this.selectedUser.fullName || 'N/A';
        document.getElementById('modal-user-email').textContent = this.selectedUser.email;
        
        const roleElement = document.getElementById('modal-user-role');
        roleElement.textContent = this.selectedUser.role;
        roleElement.className = `role-badge role-${this.selectedUser.role}`;
        
        document.getElementById('modal-user-joined').textContent = new Date(this.selectedUser.dateRegistered).toLocaleDateString();
        
        const statusElement = document.getElementById('modal-user-status');
        statusElement.textContent = this.selectedUser.isLoggedIn ? 'Online' : 'Offline';
        statusElement.className = `status-badge status-${this.selectedUser.isLoggedIn ? 'active' : 'inactive'}`;

        document.getElementById('user-modal').classList.add('active');
    }

    closeUserModal() {
        document.getElementById('user-modal').classList.remove('active');
        this.selectedUser = null;
    }

    changeUserRole() {
        if (!this.selectedUser) return;

        const currentRole = this.selectedUser.role;
        const roles = ['customer', 'staff', 'admin'];
        const currentIndex = roles.indexOf(currentRole);
        const newRole = roles[(currentIndex + 1) % roles.length];

        this.selectedUser.role = newRole;
        this.saveUsers();
        this.renderUsers();
        this.closeUserModal();
        
        this.showNotification(`User role changed to ${newRole}`, 'success');
    }

    resetUserPassword() {
        if (!this.selectedUser) return;

        if (confirm('Reset password to "password123"?')) {
            this.selectedUser.password = 'password123';
            this.saveUsers();
            this.showNotification('Password reset successfully', 'success');
        }
    }

    deleteUser() {
        if (!this.selectedUser) return;

        if (this.selectedUser.role === 'admin' && this.users.filter(u => u.role === 'admin').length <= 1) {
            this.showNotification('Cannot delete the only admin user', 'error');
            return;
        }

        if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            this.users = this.users.filter(user => user.id !== this.selectedUser.id);
            this.saveUsers();
            this.renderUsers();
            this.updateOverview();
            this.closeUserModal();
            
            this.showNotification('User deleted successfully', 'success');
        }
    }

    showUserManagement() {
        document.getElementById('users-container').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    showReports() {
        this.showAnalytics();
    }

    showAnalytics() {
        // Remove existing analytics modal if present
        const existing = document.getElementById('analytics-modal');
        if (existing) existing.parentNode.removeChild(existing);

        const totalOrders = this.orders.length;
        const totalRevenue = this.orders.reduce((sum, order) => sum + (order.total || 0), 0);
        const avgOrder = totalOrders ? (totalRevenue / totalOrders) : 0;

        // Compute top items by quantity (if orders have items array)
        const itemCounts = {};
        this.orders.forEach(order => {
            if (!order.items || !Array.isArray(order.items)) return;
            order.items.forEach(it => {
                // support either {id, qty} or {itemId, quantity} or {name, qty}
                const id = it.id || it.itemId || it.item || it.name;
                const qty = it.qty || it.quantity || it.qtyOrdered || 1;
                const key = typeof id === 'number' || typeof id === 'string' ? id : JSON.stringify(it);
                itemCounts[key] = (itemCounts[key] || 0) + (qty || 1);
            });
        });

        const topItems = Object.keys(itemCounts)
            .map(key => ({ key, qty: itemCounts[key] }))
            .sort((a, b) => b.qty - a.qty)
            .slice(0, 5)
            .map(entry => {
                // try to find a matching name in menuData
                const menuMatch = this.menuData.find(m => String(m.id) === String(entry.key) || m.name === entry.key);
                return {
                    name: menuMatch ? menuMatch.name : String(entry.key),
                    qty: entry.qty
                };
            });

        // Create modal container
        const modal = document.createElement('div');
        modal.id = 'analytics-modal';
        modal.className = 'modal analytics-modal active';
        modal.innerHTML = `
            <div class="modal-content analytics-content">
                <div class="modal-header">
                    <h3>Analytics & Reports</h3>
                    <div class="analytics-controls">
                        <label for="analytics-view-select">View:</label>
                        <select id="analytics-view-select">
                            <option value="system" selected>System Overview</option>
                            <option value="full">Full Reports</option>
                        </select>
                    </div>
                    <button class="close-modal" id="close-analytics-btn" title="Close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div id="analytics-chart-area" class="analytics-chart-area">
                        <canvas id="overview-chart" width="600" height="300"></canvas>
                    </div>

                    <div id="analytics-summary" class="analytics-grid">
                        <div class="analytics-card">
                            <h4>Total Users</h4>
                            <p class="analytics-value">${this.users.length}</p>
                        </div>
                        <div class="analytics-card">
                            <h4>Total Orders</h4>
                            <p class="analytics-value">${totalOrders}</p>
                        </div>
                        <div class="analytics-card">
                            <h4>Total Items</h4>
                            <p class="analytics-value">${this.menuData.length}</p>
                        </div>
                        <div class="analytics-card">
                            <h4>Total Revenue</h4>
                            <p class="analytics-value">₱${totalRevenue.toFixed(2)}</p>
                        </div>
                    </div>

                    <div id="analytics-top-items" class="analytics-section">
                        <h4>Top Items</h4>
                        <ul class="top-items-list">
                            ${topItems.length > 0 ? topItems.map(it => `<li>${it.name} — <strong>${it.qty}</strong></li>`).join('') : '<li>No order item data available</li>'}
                        </ul>
                    </div>

                    <div id="analytics-overtime" class="analytics-section">
                        <h4>Orders Over Time</h4>
                        <p class="small">Simple summary — real charts can be enabled later.</p>
                        <div class="orders-over-time">
                            ${this.generateOrdersOverTimeHTML()}
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Wire close button
        document.getElementById('close-analytics-btn').addEventListener('click', () => {
            this.closeAnalyticsModal();
        });

        // After appending, initialize Chart.js for system overview
        const canvas = modal.querySelector('#overview-chart');
        let overviewChart = null;
        const renderOverviewChart = () => {
            if (!canvas || typeof Chart === 'undefined') return;

            const labels = ['Users', 'Orders', 'Items', 'Revenue'];
            const dataValues = [this.users.length, totalOrders, this.menuData.length, Math.round(totalRevenue)];

            if (overviewChart) {
                overviewChart.data.datasets[0].data = dataValues;
                overviewChart.update();
                return;
            }

            overviewChart = new Chart(canvas.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'System Overview',
                        data: dataValues,
                        backgroundColor: ['#4e79a7','#f28e2b','#e15759','#76b7b2']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true }
                    },
                    plugins: {
                        legend: { display: false }
                    }
                }
            });
        };

        // Toggle between views (system overview only or full reports)
        const viewSelect = modal.querySelector('#analytics-view-select');
        const summaryEl = modal.querySelector('#analytics-summary');
        const topItemsEl = modal.querySelector('#analytics-top-items');
        const overtimeEl = modal.querySelector('#analytics-overtime');

        const applyView = (view) => {
            if (view === 'system') {
                // show only chart + summary
                summaryEl.style.display = '';
                topItemsEl.style.display = 'none';
                overtimeEl.style.display = 'none';
                document.getElementById('analytics-chart-area').style.display = '';
            } else {
                // full reports
                summaryEl.style.display = '';
                topItemsEl.style.display = '';
                overtimeEl.style.display = '';
                document.getElementById('analytics-chart-area').style.display = '';
            }
        };

        viewSelect.addEventListener('change', (e) => {
            applyView(e.target.value);
        });

        // Append modal and then render chart
        document.body.appendChild(modal);
        applyView(viewSelect.value);
        // small timeout to ensure canvas has dimensions
        setTimeout(renderOverviewChart, 50);
    }

    closeAnalyticsModal() {
        const modal = document.getElementById('analytics-modal');
        if (modal) modal.parentNode.removeChild(modal);
    }

    generateOrdersOverTimeHTML() {
        if (!this.orders || this.orders.length === 0) {
            return `<div class="empty-state"><i class="fas fa-chart-line"></i><p>No orders to display</p></div>`;
        }

        // Bucket orders by day (YYYY-MM-DD)
        const buckets = {};
        this.orders.forEach(order => {
            const date = order.date || order.dateCreated || order.createdAt || order.timestamp;
            const d = date ? new Date(date) : new Date();
            const key = d.toISOString().slice(0, 10);
            buckets[key] = (buckets[key] || 0) + 1;
        });

        const entries = Object.keys(buckets).sort().map(k => ({ day: k, count: buckets[k] }));
        const max = Math.max(...entries.map(e => e.count));

        return entries.map(e => `
            <div class="overtime-row">
                <div class="overtime-day">${e.day}</div>
                <div class="overtime-bar" style="width:${max ? (e.count / max * 100) : 0}%">${e.count}</div>
            </div>
        `).join('');
    }

    resetSystem() {
        if (!confirm('WARNING: This will delete ALL data including users, orders, and menu items. This action cannot be undone. Are you sure?')) {
            return;
        }

        // Clear all data
        localStorage.removeItem('flavorfusion_menu');
        localStorage.removeItem('flavorfusion_orders');
        localStorage.removeItem('flavorfusion_cart');
        
        // Reset users but keep admin account
        const adminUser = this.users.find(user => user.role === 'admin');
        this.users = adminUser ? [{
            ...adminUser,
            isLoggedIn: false
        }] : [];
        
        this.saveUsers();
        
        // Reload data
        this.loadData();
        this.renderMenuItems();
        this.renderUsers();
        this.updateOverview();
        
        this.showNotification('System has been reset to default state', 'success');
    }

    handleLogout() {
        const updatedUsers = this.users.map(user => ({
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
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
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

// Initialize the admin app
const adminApp = new AdminApp();