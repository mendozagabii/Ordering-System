class CustomerApp {
    constructor() {
        this.menuData = [];
        this.cart = [];
        this.currentUser = null;
        this.init();
    }

    async init() {
        await this.loadMenuData();
        this.loadCart();
        this.setupEventListeners();
        this.renderMenu();
        this.updateCartUI();
        this.updateUserDisplay();
        this.setupAnimations();
        // After initialization, attempt to process any pending action (from login redirect)
        setTimeout(() => this.processPendingAction(), 300);
    }

    setupAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                }
            });
        });

        document.querySelectorAll('.menu-item').forEach(item => {
            observer.observe(item);
        });
    }

    updateUserDisplay() {
        const users = JSON.parse(localStorage.getItem('ordering_system_users') || '[]');
        this.currentUser = users.find(user => user.isLoggedIn);
        const userDisplay = document.getElementById('logged-user-display');
        
        if (userDisplay && this.currentUser) {
            userDisplay.textContent = this.currentUser.fullName || 'Customer';
        }
        // Autofill delivery contact fields when user info is available
        try {
            const nameInput = document.getElementById('delivery-name');
            const emailInput = document.getElementById('delivery-email');
            if (this.currentUser) {
                if (nameInput && !nameInput.value) nameInput.value = this.currentUser.fullName || '';
                if (emailInput && !emailInput.value) emailInput.value = this.currentUser.email || this.currentUser.customerEmail || '';
            }
        } catch (e) { /* ignore when elements aren't present yet */ }
    }

    async loadMenuData() {
        await new Promise(resolve => setTimeout(resolve, 500));
        
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
                desc: "Deep-fried pork belly that’s crispy on the outside and juicy inside, served with rice.",
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
                dietary: [],
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
                dietary: [],
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
                dietary: [],
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
                dietary: [],
                desc: "Fried dough sticks coated in sugar and served with chocolate dipping sauce.",
                image: "https://www.recipetineats.com/uploads/2016/08/Churros_9.jpg"
            },
            {
                id: 18,
                name: "Leche Flan Cup",
                price: 45.00,
                category: "sweets",
                dietary: [],
                desc: "Sweet and creamy caramel custard in small cups.",
                image: "https://eatmedrinkmeblog.com/wp-content/uploads/2015/04/IMG_2385-2.jpg"
            },
            {
                id: 19,
                name: "Brownies",
                price: 60.00,
                category: "sweets",
                dietary: [],
                desc: "Soft and chewy chocolate squares that melt in your mouth.",
                image: "https://www.northernbrownies.co.uk/cdn/shop/products/IMG_2591.jpg?v=1648667430"
            },
            {
                id: 20,
                name: "Mango Graham Cups",
                price: 80.00,
                category: "sweets",
                dietary: [],
                desc: "Layers of mango, graham, and cream for a sweet tropical treat.",
                image: "https://i.ytimg.com/vi/deVeLWfM3qI/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCmzV4B6OPL7LF7IcmQkALVhiMXaA"
            },
            {
                id: 21,
                name: "Buko Pandan Jelly",
                price: 75.00,
                category: "sweets",
                dietary: [],
                desc: "A cool dessert made with coconut, pandan jelly, and cream.",
                image: "https://www.thepeachkitchen.com/wp-content/uploads/2019/12/IG-Photo-1.png"
            },

            // Drinks & Refreshments
            {
                id: 22,
                name: "Classic Milk Tea",
                price: 60.00,
                category: "drinks",
                dietary: [],
                desc: "Creamy tea with milk and chewy pearls in different flavors.",
                image: "https://img.buzzfeed.com/thumbnailer-prod-us-east-1/8f1e6c865e5b4ef0a1f8d15b3f676202/BFV69042_HowToMakeBobaFromScratch_JP_Final_YT.jpg?resize=1200:*&output-format=jpg&output-quality=auto"
            },
            {
                id: 23,
                name: "Fruit Tea",
                price: 60.00,
                category: "drinks",
                dietary: [],
                desc: "Light and refreshing tea with fruity flavors like mango or lychee.",
                image: "https://pizzazzerie.com/wp-content/uploads/2021/03/southern-fruit-tea-recipe-03-scaled.jpg"
            },
            {
                id: 24,
                name: "Iced Coffee Blends",
                price: 75.00,
                category: "drinks",
                dietary: [],
                desc: "Iced coffee to boost your energy and mood.",
                image: "https://myeverydaytable.com/wp-content/uploads/IcedShakenEspresso1-1.jpg"
            },
            {
                id: 25,
                name: "Fruit Smoothies",
                price: 60.00,
                category: "drinks",
                dietary: [],
                desc: "Cold, blended drinks made with real fruits for a healthy and sweet refreshment.",
                image: "https://www.acouplecooks.com/wp-content/uploads/2020/12/Dragonfruit-Smoothie-005.jpg"
            }
        ];
    }

    loadCart() {
        const savedCart = localStorage.getItem('craveitclickit_cart');
        this.cart = savedCart ? JSON.parse(savedCart) : [];
    }

    saveCart() {
        localStorage.setItem('craveitclickit_cart', JSON.stringify(this.cart));
    }

    setupEventListeners() {
        document.getElementById('cart-toggle').addEventListener('click', () => this.toggleCart());
        document.getElementById('close-cart').addEventListener('click', () => this.toggleCart());

        document.getElementById('search-input').addEventListener('input', (e) => {
            this.filterMenu();
        });

        document.querySelectorAll('.filter-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.handleCategoryFilter(e.currentTarget);
            });
        });

        document.getElementById('checkout-btn').addEventListener('click', () => {
            this.handleCheckout();
        });

        document.getElementById('logout-btn').addEventListener('click', () => {
            this.handleLogout();
        });

        // Delivery toggle: hide/show delivery details to prioritize ordered items
        const toggleDeliveryBtn = document.getElementById('toggle-delivery');
        const deliverySection = document.querySelector('.delivery-details-section');
        if (toggleDeliveryBtn && deliverySection) {
            // start collapsed by default
            deliverySection.classList.add('collapsed');
            toggleDeliveryBtn.addEventListener('click', () => {
                const isCollapsed = deliverySection.classList.toggle('collapsed');
                toggleDeliveryBtn.classList.toggle('active', !isCollapsed);
                toggleDeliveryBtn.textContent = isCollapsed ? 'Show delivery details' : 'Hide delivery details';
            });
        }

        document.getElementById('location-btn').addEventListener('click', () => {
            this.showLocation();
        });

        document.getElementById('close-location').addEventListener('click', () => {
            this.closeLocation();
        });

        document.getElementById('location-overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.closeLocation();
            }
        });

        document.getElementById('track-orders-btn').addEventListener('click', () => {
            this.showTrackOrders();
        });

        document.getElementById('close-track-orders').addEventListener('click', () => {
            this.closeTrackOrders();
        });

        document.getElementById('track-orders-overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.closeTrackOrders();
            }
        });

        document.getElementById('cart-overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.toggleCart();
            }
        });

        // Footers or page links that point to the location overlay should open the modal (not only scroll)
        document.querySelectorAll('a[href="#location-overlay"]').forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                this.showLocation();
            });
        });

        const orderConfirmClose = document.getElementById('order-confirm-close');
        const orderConfirmOverlay = document.getElementById('order-confirmation-overlay');
        if (orderConfirmClose && orderConfirmOverlay) {
            orderConfirmClose.addEventListener('click', () => {
                orderConfirmOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
    }

    handleCategoryFilter(selectedOption) {
        document.querySelectorAll('.filter-option').forEach(option => {
            option.classList.remove('active');
        });
        
        selectedOption.classList.add('active');
        this.filterMenu();
    }

    filterMenu() {
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        const activeCategory = document.querySelector('.filter-option.active').dataset.category;

        const filtered = this.menuData.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm) || 
                                item.desc.toLowerCase().includes(searchTerm);
            const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
            
            return matchesSearch && matchesCategory;
        });

        this.renderMenu(filtered);
    }

    renderMenu(items = this.menuData) {
        const container = document.getElementById('menu-items-container');
        const countElement = document.getElementById('menu-count');
        
        countElement.textContent = items.length;

        if (items.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 4rem;">
                    <i class="fas fa-search" style="font-size: 3rem; color: var(--text-light); margin-bottom: 1rem;"></i>
                    <h3 style="color: var(--text-light); margin-bottom: 0.5rem;">No items found</h3>
                    <p style="color: var(--text-light);">Try adjusting your filters or search terms</p>
                </div>
            `;
            return;
        }

        container.innerHTML = items.map((item, index) => `
            <div class="menu-item" style="animation-delay: ${index * 0.1}s">
                <img src="${item.image}" alt="${item.name}" class="item-image">
                <div class="item-content">
                    <div class="item-header">
                        <h3 class="item-name">${item.name}</h3>
                        <div class="item-price">₱${item.price.toFixed(2)}</div>
                    </div>
                    <p class="item-desc">${item.desc}</p>
                    <div class="item-tags">
                        ${item.dietary.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <button class="add-to-cart" onclick="customerApp.addToCart(${item.id})" data-item-id="${item.id}">
                        <i class="fas fa-plus"></i>
                        Add to Cart
                    </button>
                </div>
            </div>
        `).join('');
    }

    addToCart(itemId) {
        const item = this.menuData.find(i => i.id === itemId);
        if (!item) return;
        // If user is not logged in, save pending action and show an on-screen prompt
        if (!this.currentUser) {
            const pending = { type: 'addToCart', itemId, returnUrl: window.location.href };
            localStorage.setItem('pending_action', JSON.stringify(pending));
            this.showLoginPrompt(pending);
            return;
        }

        const existingItem = this.cart.find(i => i.id === itemId);
        const button = document.querySelector(`[data-item-id="${itemId}"]`);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.cart.push({
                ...item,
                quantity: 1
            });
        }

        this.saveCart();
        this.updateCartUI();
        this.showAddToCartAnimation(button);
    }

    showAddToCartAnimation(button) {
        const originalText = button.innerHTML;
        
        button.innerHTML = '<i class="fas fa-check"></i> Added!';
        button.classList.add('added');
        
        this.animateCartIcon();
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.classList.remove('added');
        }, 2000);
    }

    animateCartIcon() {
        const cartIcon = document.querySelector('.cart-icon-container');
        cartIcon.style.transform = 'scale(1.2)';
        
        setTimeout(() => {
            cartIcon.style.transform = 'scale(1)';
        }, 300);
    }

    updateCartUI() {
        const cartCount = document.getElementById('cart-count');
        const cartItems = document.getElementById('cart-items');
        const cartSubtotal = document.getElementById('cart-subtotal');
        const cartTotal = document.getElementById('cart-total');
        const checkoutBtn = document.getElementById('checkout-btn');

        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;

        if (this.cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-bag"></i>
                    <h3>Your bag is empty</h3>
                    <p>Add some delicious items to get started!</p>
                </div>
            `;
            checkoutBtn.disabled = true;
        } else {
            cartItems.innerHTML = this.cart.map(item => `
                <div class="cart-item">
                    <div class="item-details">
                        <div class="item-name">${item.name}</div>
                        <div class="item-price">₱${item.price.toFixed(2)} each</div>
                    </div>
                    <div class="item-quantity">
                        <button class="quantity-btn" onclick="customerApp.updateQuantity(${item.id}, -1)">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="customerApp.updateQuantity(${item.id}, 1)">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <button class="remove-item" onclick="customerApp.removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `).join('');
            checkoutBtn.disabled = false;
        }

        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const serviceFee = 50.00;

        // Check for a one-time welcome voucher on the logged-in user and apply to a single item
        // Store discount and appliedVoucher on the app instance so checkout can access them
        let discount = 0;
        let appliedVoucher = null;
        try {
            if (this.currentUser && this.currentUser.voucher && !this.currentUser.voucher.used) {
                // Apply to the single highest-priced item (one unit)
                const highest = this.cart.reduce((best, it) => {
                    if (!best || it.price > best.price) return it;
                    return best;
                }, null);

                if (highest) {
                    discount = +(highest.price * (this.currentUser.voucher.percent / 100)).toFixed(2);
                    appliedVoucher = {
                        code: this.currentUser.voucher.code,
                        percent: this.currentUser.voucher.percent,
                        amount: discount
                    };

                    // Do NOT mark voucher as used here yet — mark only when checkout completes.
                }
            }
        } catch (e) {
            console.warn('Voucher application failed', e);
        }

        const subtotalAfter = Math.max(0, subtotal - discount);
        const total = subtotalAfter + serviceFee;

        // expose applied voucher and discount for checkout flow
        this.cartDiscount = discount;
        this.appliedVoucher = appliedVoucher;

        cartSubtotal.textContent = subtotal.toFixed(2);
        cartTotal.textContent = total.toFixed(2);
    }

    updateQuantity(itemId, change) {
        const item = this.cart.find(i => i.id === itemId);
        if (!item) return;

        item.quantity += change;
        
        if (item.quantity <= 0) {
            this.removeFromCart(itemId);
        } else {
            this.saveCart();
            this.updateCartUI();
        }
    }

    removeFromCart(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.saveCart();
        this.updateCartUI();
    }

    toggleCart() {
        const overlay = document.getElementById('cart-overlay');
        overlay.classList.toggle('active');
        
        if (overlay.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
            // Ensure delivery contact fields are filled when opening the cart
            try {
                const nameInput = document.getElementById('delivery-name');
                const emailInput = document.getElementById('delivery-email');
                if (this.currentUser) {
                    if (nameInput && !nameInput.value) nameInput.value = this.currentUser.fullName || '';
                    if (emailInput && !emailInput.value) emailInput.value = this.currentUser.email || this.currentUser.customerEmail || '';
                }
            } catch (e) { /* ignore DOM timing */ }
        } else {
            document.body.style.overflow = '';
        }
    }

    async handleCheckout() {
        const checkoutBtn = document.getElementById('checkout-btn');
        // clear any previous inline cart notice
        try { this.hideCartNotice(); } catch (e) {}
        
        if (this.cart.length === 0) return;
        // Require login before proceeding to checkout
        if (!this.currentUser) {
            const pending = { type: 'openCart', returnUrl: window.location.href };
            localStorage.setItem('pending_action', JSON.stringify(pending));
            this.showLoginPrompt(pending);
            return;
        }

        // collect and validate delivery/contact info
        const name = document.getElementById('delivery-name')?.value.trim();
        const phone = document.getElementById('delivery-phone')?.value.trim();
        const email = document.getElementById('delivery-email')?.value.trim();
        const address = document.getElementById('delivery-address')?.value.trim();
        const landmark = document.getElementById('delivery-landmark')?.value.trim() || '';
        const notes = document.getElementById('delivery-notes')?.value.trim() || '';

            if (!name) {
                // show inline cart notification so user can see missing fields inside the Your Order panel
                this.showCartNotice('Please enter full name for delivery', 'error');
                try { document.getElementById('delivery-name')?.focus(); } catch(e){}
                return;
            }

            if (!phone) {
                this.showCartNotice('Please enter contact number for delivery', 'error');
                try { document.getElementById('delivery-phone')?.focus(); } catch(e){}
                return;
            }

        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            this.showCartNotice('Please enter a valid email address', 'error');
            try { document.getElementById('delivery-email')?.focus(); } catch(e){}
            return;
        }

            if (!address) {
                this.showCartNotice('Please enter delivery address', 'error');
                try { document.getElementById('delivery-address')?.focus(); } catch(e){}
                return;
            }

        checkoutBtn.classList.add('processing');
        checkoutBtn.disabled = true;

        await new Promise(resolve => setTimeout(resolve, 1200));

        const paymentMethod = document.querySelector('input[name="payment-method"]:checked')?.value || 'Cash on Delivery';

        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const serviceFee = 50.00;
        const total = subtotal + serviceFee;

        const discount = this.cartDiscount || 0;
        const appliedVoucher = this.appliedVoucher || null;

        const order = {
            id: Date.now(),
            userId: this.currentUser?.id,
            customerName: name,
            customerEmail: email,
            deliveryPhone: phone,
            deliveryAddress: address,
            deliveryLandmark: landmark,
            deliveryNotes: notes,
            items: this.cart,
            subtotal: subtotal,
            discount: discount,
            voucherApplied: appliedVoucher,
            serviceFee: serviceFee,
            total: total,
            paymentMethod: paymentMethod,
            status: 'Order Placed',
            timestamp: new Date().toISOString()
        };

        if (paymentMethod === 'GCash') {
            // show GCash payment modal and wait for confirmation before saving
            this.showGcashPayment(total, order);
            checkoutBtn.classList.remove('processing');
            checkoutBtn.disabled = false;
            return;
        }

        // default: save immediately (Cash on Delivery)
        this.finalizeOrderSave(order);

        // If a voucher was applied, mark it used now that the order is stored
        if (appliedVoucher && this.currentUser) {
            try {
                const users = JSON.parse(localStorage.getItem('ordering_system_users') || '[]');
                const idx = users.findIndex(u => u.id === this.currentUser.id);
                if (idx > -1) {
                    users[idx].voucher = users[idx].voucher || {};
                    users[idx].voucher.used = true;
                    localStorage.setItem('ordering_system_users', JSON.stringify(users));
                    this.currentUser.voucher = users[idx].voucher;
                }
            } catch (e) { console.warn('Unable to mark voucher used', e); }
        }

        if (appliedVoucher) {
            this.showNotification(`20% welcome voucher applied — ₱${appliedVoucher.amount.toFixed(2)} saved`, 'success');
        }

        this.cart = [];
        // reset voucher state after checkout
        this.cartDiscount = 0;
        this.appliedVoucher = null;
        this.saveCart();
        this.updateCartUI();

        this.showNotification('Order placed successfully! 🎉', 'success');
        try { this.showOrderConfirmationModal(); } catch (e) { }

        setTimeout(() => {
            checkoutBtn.classList.remove('processing');
            checkoutBtn.disabled = false;
            this.toggleCart();
        }, 1000);
    }

    // Persisted pending-action processing (called on init)
    processPendingAction() {
        try {
            const raw = localStorage.getItem('pending_action');
            if (!raw) return;
            const pending = JSON.parse(raw);
            if (!pending) return;

            // Ensure user is logged in before processing
            if (!this.currentUser) return;

            // Remove pending action so it doesn't loop
            localStorage.removeItem('pending_action');

            if (pending.type === 'addToCart' && pending.itemId) {
                // Add item and show confirmation
                this.addToCart(pending.itemId);
                this.showNotification('Item added to cart after login', 'success');
            } else if (pending.type === 'openCart') {
                // Open cart so user can proceed to checkout
                this.toggleCart();
                this.showNotification('You can now complete your order', 'success');
            }
        } catch (e) {
            console.warn('Failed processing pending action', e);
        }
    }

    // Save order to storage (helper used by multiple flows)
    finalizeOrderSave(order) {
        const orders = JSON.parse(localStorage.getItem('flavorfusion_orders') || '[]');
        orders.push(order);
        localStorage.setItem('flavorfusion_orders', JSON.stringify(orders));

        const customerOrders = JSON.parse(localStorage.getItem('craveitclickit_orders') || '[]');
        customerOrders.push(order);
        localStorage.setItem('craveitclickit_orders', JSON.stringify(customerOrders));
    }

    showGcashPayment(amount, order) {
        const overlay = document.getElementById('gcash-payment-overlay');
        if (!overlay) {
            // fallback to immediate save
            order.paymentStatus = 'Payment Pending (GCash)';
            this.finalizeOrderSave(order);
            return;
        }

        const amtEl = document.getElementById('gcash-amount');
        const merchantEl = document.getElementById('gcash-merchant-number');
        const refEl = document.getElementById('gcash-ref');
        const copyBtn = document.getElementById('gcash-copy-merchant');
        const paidBtn = document.getElementById('gcash-paid-btn');
        const cancelBtn = document.getElementById('gcash-cancel-btn');
        const cancelBtn2 = document.getElementById('gcash-cancel-2');

        // configure merchant info (you can change this to your real merchant number)
        const merchantNumber = '09171234567';

        const paymentRef = 'GC' + Math.random().toString(36).slice(2,10).toUpperCase();

        if (amtEl) amtEl.textContent = `₱${amount.toFixed(2)}`;
        if (merchantEl) merchantEl.textContent = merchantNumber;
        if (refEl) refEl.textContent = paymentRef;

        // show overlay
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        // copy merchant number
        if (copyBtn) copyBtn.onclick = () => {
            try { navigator.clipboard.writeText(merchantNumber); this.showNotification('Merchant number copied', 'success'); }
            catch(e) { this.showNotification('Unable to copy', 'error'); }
        };

        const closeOverlay = () => {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        };

        // Cancel handlers
        if (cancelBtn) cancelBtn.onclick = closeOverlay;
        if (cancelBtn2) cancelBtn2.onclick = closeOverlay;
        overlay.onclick = (e) => { if (e.target === overlay) closeOverlay(); };

        // Paid button handler: finalize order with payment info
        if (paidBtn) {
            paidBtn.onclick = () => {
                order.paymentStatus = 'Paid via GCash';
                order.paymentRef = paymentRef;
                // Save order now
                this.finalizeOrderSave(order);

                // If a voucher was applied, mark it used now that the order is stored
                if (this.appliedVoucher && this.currentUser) {
                    try {
                        const users = JSON.parse(localStorage.getItem('ordering_system_users') || '[]');
                        const idx = users.findIndex(u => u.id === this.currentUser.id);
                        if (idx > -1) {
                            users[idx].voucher = users[idx].voucher || {};
                            users[idx].voucher.used = true;
                            localStorage.setItem('ordering_system_users', JSON.stringify(users));
                            this.currentUser.voucher = users[idx].voucher;
                        }
                    } catch(e){ console.warn('Unable to mark voucher used', e); }
                }

                // clear cart and update UI
                this.cart = [];
                this.saveCart();
                this.updateCartUI();

                closeOverlay();
                this.showNotification('Payment recorded — order placed! 🎉', 'success');
                try { this.showOrderConfirmationModal(); } catch (e) {}
            };
        }
    }

    showOrderConfirmationModal() {
        const overlay = document.getElementById('order-confirmation-overlay');
        if (!overlay) return;
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        const okBtn = document.getElementById('order-confirm-ok');
        if (okBtn) {
            okBtn.onclick = () => {
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            };
        }

        // clicking outside the modal content closes the overlay
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
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

    showLocation() {
        const overlay = document.getElementById('location-overlay');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeLocation() {
        const overlay = document.getElementById('location-overlay');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    showTrackOrders() {
        const overlay = document.getElementById('track-orders-overlay');
        overlay.classList.add('active');
        this.loadOrders();
    }

    closeTrackOrders() {
        const overlay = document.getElementById('track-orders-overlay');
        overlay.classList.remove('active');
    }

    loadOrders() {
        // Load from the main orders storage that staff uses
        const orders = JSON.parse(localStorage.getItem('flavorfusion_orders') || '[]');
        const userOrders = orders.filter(order => order.userId === this.currentUser?.id).reverse();
        const ordersContainer = document.getElementById('orders-list');

        if (userOrders.length === 0) {
            ordersContainer.innerHTML = `
                <div class="empty-orders">
                    <i class="fas fa-box-open"></i>
                    <h3>No orders yet</h3>
                    <p>Start ordering some delicious items!</p>
                </div>
            `;
            return;
        }

        ordersContainer.innerHTML = userOrders.map(order => {
            const orderDate = new Date(order.timestamp);
            const statusClass = this.getStatusClass(order.status);
            const statusIcon = this.getStatusIcon(order.status);
            
            return `
                <div class="order-card">
                    <div class="order-header-centered">
                        <h3>Order #${order.id}</h3>
                        <div class="order-status ${statusClass}">
                            <i class="fas ${statusIcon}"></i>
                            <span>${order.status}</span>
                        </div>
                        <span class="order-date">${orderDate.toLocaleDateString()} at ${orderDate.toLocaleTimeString()}</span>
                    </div>
                    
                    <div class="order-details-grid">
                        <div class="detail-item">
                            <span class="detail-label"><i class="fas fa-user"></i> Customer</span>
                            <span class="detail-value">${order.customerName || 'Guest'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label"><i class="fas fa-phone"></i> Contact Number</span>
                            <span class="detail-value">${order.deliveryPhone || 'N/A'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label"><i class="fas fa-envelope"></i> Email</span>
                            <span class="detail-value">${order.customerEmail || 'N/A'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label"><i class="fas fa-map-marker-alt"></i> Delivery Address</span>
                            <span class="detail-value">${order.deliveryAddress ? order.deliveryAddress + (order.deliveryLandmark ? ' — ' + order.deliveryLandmark : '') : 'N/A'}</span>
                        </div>
                        ${order.deliveryNotes ? `
                        <div class="detail-item">
                            <span class="detail-label"><i class="fas fa-sticky-note"></i> Notes</span>
                            <span class="detail-value">${order.deliveryNotes}</span>
                        </div>
                        ` : ''}
                        <div class="detail-item">
                            <span class="detail-label"><i class="fas fa-wallet"></i> Payment</span>
                            <span class="detail-value">${order.paymentMethod || 'N/A'}</span>
                        </div>
                    </div>
                    
                    <div class="order-items-section">
                        <h4>Order Items</h4>
                        ${order.items.map(item => `
                            <div class="order-item">
                                <span class="item-name">${item.quantity}x ${item.name}</span>
                                <span class="item-price">₱${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="order-summary-box">
                        <div class="summary-row">
                            <span>Subtotal</span>
                            <span>₱${(order.subtotal || (order.total - 50)).toFixed(2)}</span>
                        </div>
                        <div class="summary-row">
                            <span>Service Fee</span>
                            <span>₱${(order.serviceFee || 50).toFixed(2)}</span>
                        </div>
                        <div class="summary-row total-row">
                            <span>Total Amount</span>
                            <span class="total-amount">₱${order.total.toFixed(2)}</span>
                        </div>
                    </div>
                    <div class="order-progress">
                        <div class="progress-steps">
                            <div class="progress-step ${this.isStepActive(order.status, 'Order Placed') ? 'active' : ''}">
                                <div class="step-icon"><i class="fas fa-check"></i></div>
                                <span>Order Placed</span>
                            </div>
                            <div class="progress-step ${this.isStepActive(order.status, 'Preparing Food') ? 'active' : ''}">
                                <div class="step-icon"><i class="fas fa-utensils"></i></div>
                                <span>Preparing</span>
                            </div>
                            <div class="progress-step ${this.isStepActive(order.status, 'Ready for Pickup') ? 'active' : ''}">
                                <div class="step-icon"><i class="fas fa-box"></i></div>
                                <span>Ready</span>
                            </div>
                            <div class="progress-step ${this.isStepActive(order.status, 'Completed') ? 'active' : ''}">
                                <div class="step-icon"><i class="fas fa-check-circle"></i></div>
                                <span>Completed</span>
                            </div>
                        </div>
                    </div>
                    
                    ${order.status === 'Order Placed' || order.status === 'Preparing Food' ? `
                        <div class="order-actions">
                            <button class="cancel-order-btn" onclick="customerApp.cancelOrder(${order.id})">
                                <i class="fas fa-times-circle"></i>
                                <span>Cancel Order</span>
                            </button>
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
    }

    cancelOrder(orderId) {
        if (!confirm('Are you sure you want to cancel this order?')) {
            return;
        }

        const orders = JSON.parse(localStorage.getItem('flavorfusion_orders') || '[]');
        const order = orders.find(o => o.id === orderId);

        if (order) {
            order.status = 'Cancelled';
            localStorage.setItem('flavorfusion_orders', JSON.stringify(orders));
            
            // Also update customer orders
            const customerOrders = JSON.parse(localStorage.getItem('craveitclickit_orders') || '[]');
            const customerOrder = customerOrders.find(o => o.id === orderId);
            if (customerOrder) {
                customerOrder.status = 'Cancelled';
                localStorage.setItem('craveitclickit_orders', JSON.stringify(customerOrders));
            }

            this.showNotification('Order cancelled successfully', 'success');
            this.loadOrders();
        }
    }

    getStatusClass(status) {
        const statusMap = {
            'Order Placed': 'status-placed',
            'Preparing Food': 'status-preparing',
            'Ready for Pickup': 'status-ready',
            'Out for Delivery': 'status-delivery',
            'Completed': 'status-completed',
            'Cancelled': 'status-cancelled'
        };
        return statusMap[status] || 'status-placed';
    }

    getStatusIcon(status) {
        const iconMap = {
            'Order Placed': 'fa-receipt',
            'Preparing Food': 'fa-utensils',
            'Ready for Pickup': 'fa-box',
            'Out for Delivery': 'fa-truck',
            'Completed': 'fa-check-circle',
            'Cancelled': 'fa-times-circle'
        };
        return iconMap[status] || 'fa-receipt';
    }

    isStepActive(currentStatus, stepStatus) {
        const steps = ['Order Placed', 'Preparing Food', 'Ready for Pickup', 'Completed'];
        const currentIndex = steps.indexOf(currentStatus);
        const stepIndex = steps.indexOf(stepStatus);
        return stepIndex <= currentIndex;
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

    // Show an inline notice inside the cart overlay (used for checkout validation errors)
    showCartNotice(message, type = 'error', autoHideMs = 4000) {
        try {
            const el = document.getElementById('cart-notice');
            if (!el) {
                // fallback to global notification
                this.showNotification(message, type);
                return;
            }

            // ensure cart overlay is visible so user can see the notice
            const overlay = document.getElementById('cart-overlay');
            if (overlay && !overlay.classList.contains('active')) {
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }

            el.innerHTML = `
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'info' ? 'fa-info-circle' : 'fa-exclamation-circle'} notice-icon"></i>
                <div class="notice-text">${message}</div>
            `;

            el.classList.remove('hidden');
            el.classList.remove('info','success','error');
            el.classList.add(type);
            el.style.display = '';
            // small show animation
            setTimeout(() => el.classList.add('show'), 10);

            // clear previous hide timeout
            if (this._cartNoticeTimeout) clearTimeout(this._cartNoticeTimeout);
            if (autoHideMs > 0) this._cartNoticeTimeout = setTimeout(() => this.hideCartNotice(), autoHideMs);
        } catch (e) {
            console.warn('showCartNotice failed', e);
            this.showNotification(message, type);
        }
    }

    hideCartNotice() {
        try {
            const el = document.getElementById('cart-notice');
            if (!el) return;
            if (this._cartNoticeTimeout) { clearTimeout(this._cartNoticeTimeout); this._cartNoticeTimeout = null; }
            el.classList.remove('show');
            // allow animation, then hide
            setTimeout(() => { el.style.display = 'none'; el.classList.add('hidden'); }, 260);
        } catch (e) { /* ignore */ }
    }

    showLoginPrompt(pending) {
        // Create an on-screen modal prompt asking user to login first (does NOT auto-redirect)
        try {
            // If a prompt already exists, don't create another
            if (document.getElementById('login-prompt-overlay')) return;

            const overlay = document.createElement('div');
            overlay.id = 'login-prompt-overlay';
            overlay.style.position = 'fixed';
            overlay.style.inset = '0';
            overlay.style.display = 'flex';
            overlay.style.alignItems = 'center';
            overlay.style.justifyContent = 'center';
            overlay.style.background = 'rgba(0,0,0,0.45)';
            overlay.style.zIndex = '12000';

            const box = document.createElement('div');
            box.style.background = 'var(--surface)';
            box.style.border = '1px solid var(--border)';
            box.style.color = 'var(--text)';
            box.style.padding = '1.25rem';
            box.style.borderRadius = '10px';
            box.style.maxWidth = '420px';
            box.style.width = '100%';
            box.style.boxShadow = '0 10px 30px rgba(0,0,0,0.25)';

            box.innerHTML = `
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.6rem;">
                    <button id="login-prompt-cancel" class="nav-link" type="button" style="background:transparent;border:0;padding:0.25rem 0.5rem;">Cancel</button>
                    <button id="login-prompt-login" class="nav-link" type="button" style="background:transparent;border:0;padding:0.25rem 0.5rem;font-weight:700;">Login / Signup</button>
                </div>
                <div style="display:block;">
                    <h3 style="margin:0 0 0.5rem;color:var(--text);">Login First to Order!</h3>
                    <p style="margin:0 0 1rem;color:var(--text-light);">You need to sign in before adding items or checking out. Please login or create an account to continue.</p>
                </div>
            `;

            overlay.appendChild(box);
            document.body.appendChild(overlay);
            document.body.style.overflow = 'hidden';

            const closePrompt = () => {
                try { document.body.removeChild(overlay); } catch(e){}
                document.body.style.overflow = '';
            };

            document.getElementById('login-prompt-cancel').addEventListener('click', () => {
                // Remove pending action if user cancels
                try { localStorage.removeItem('pending_action'); } catch(e){}
                closePrompt();
            });

            document.getElementById('login-prompt-login').addEventListener('click', () => {
                // Keep pending_action saved; user chose to go to login form
                closePrompt();
                window.location.href = 'login.html';
            });

            // close on overlay click
            overlay.addEventListener('click', (e) => { if (e.target === overlay) { localStorage.removeItem('pending_action'); closePrompt(); } });
        } catch (e) {
            console.warn('Unable to show login prompt', e);
            // fallback: show small notification
            this.showNotification('Please login first to order', 'error');
        }
    }
}

const customerApp = new CustomerApp();