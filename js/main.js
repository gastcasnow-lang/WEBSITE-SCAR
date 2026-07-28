// ============================================
// VARALLY Store - Main JavaScript
// ============================================

(function() {
    'use strict';

    // ============================================
    // CART STATE
    // ============================================
    let cart = JSON.parse(localStorage.getItem('varally_cart')) || [];

    // DOM Elements
    const cartBtn = document.getElementById('cartBtn');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartClose = document.getElementById('cartClose');
    const cartItems = document.getElementById('cartItems');
    const cartFooter = document.getElementById('cartFooter');
    const cartCount = document.getElementById('cartCount');
    const cartSubtotal = document.getElementById('cartSubtotal');

    // ============================================
    // CART FUNCTIONALITY
    // ============================================
    function openCart() {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeCart() {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    function addToCart(id, name, price) {
        const existing = cart.find(item => item.id === id);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ id, name, price, qty: 1 });
        }
        saveCart();
        renderCart();
        openCart();
    }

    function removeFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        saveCart();
        renderCart();
    }

    function updateQty(id, delta) {
        const item = cart.find(item => item.id === id);
        if (item) {
            item.qty += delta;
            if (item.qty <= 0) {
                removeFromCart(id);
                return;
            }
        }
        saveCart();
        renderCart();
    }

    function saveCart() {
        localStorage.setItem('varally_cart', JSON.stringify(cart));
    }

    function getSubtotal() {
        return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    }


    function renderCart() {
        // Update count badge
        const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
        cartCount.textContent = totalItems;

        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="cart-empty">
                    <p>Your cart is empty</p>
                    <a href="#" class="continue-shopping" onclick="document.getElementById('cartClose').click(); return false;">Continue Shopping</a>
                </div>
            `;
            cartFooter.style.display = 'none';
            return;
        }

        let html = '';
        cart.forEach(item => {
            html += `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <span>V</span>
                    </div>
                    <div class="cart-item-details">
                        <p class="cart-item-name">${item.name}</p>
                        <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                        <div class="cart-item-qty">
                            <button class="qty-btn" onclick="window.varally.updateQty('${item.id}', -1)">-</button>
                            <span>${item.qty}</span>
                            <button class="qty-btn" onclick="window.varally.updateQty('${item.id}', 1)">+</button>
                        </div>
                        <button class="cart-item-remove" onclick="window.varally.removeFromCart('${item.id}')">Remove</button>
                    </div>
                </div>
            `;
        });

        cartItems.innerHTML = html;
        cartFooter.style.display = 'block';
        cartSubtotal.textContent = `$${getSubtotal().toFixed(2)}`;
    }

    // Cart event listeners
    cartBtn.addEventListener('click', openCart);
    cartClose.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    // Quick add buttons
    document.querySelectorAll('.quick-add').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            if (this.disabled) return;

            const card = this.closest('.product-card');
            const id = card.dataset.id;
            const name = card.dataset.name;
            const price = parseFloat(card.dataset.price);

            addToCart(id, name, price);

            // Button animation
            this.textContent = '✓';
            this.style.background = '#00ff88';
            setTimeout(() => {
                this.textContent = '+';
                this.style.background = '';
            }, 1000);
        });
    });

    // Expose cart functions globally
    window.varally = {
        updateQty: updateQty,
        removeFromCart: removeFromCart
    };

    // Initialize cart on load
    renderCart();


    // ============================================
    // HERO SLIDER
    // ============================================
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    let slideInterval;

    function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        currentSlide = index;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        goToSlide(next);
    }

    function startSlider() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    function stopSlider() {
        clearInterval(slideInterval);
    }

    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            stopSlider();
            goToSlide(parseInt(this.dataset.slide));
            startSlider();
        });
    });

    startSlider();

    // ============================================
    // MOBILE NAVIGATION
    // ============================================
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');

    menuToggle.addEventListener('click', function() {
        mainNav.classList.toggle('active');
        document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';

        // Animate hamburger
        const spans = this.querySelectorAll('span');
        if (mainNav.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    });

    // Close mobile nav on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                const parent = this.parentElement;
                parent.classList.toggle('active');
            }
        });
    });


    // ============================================
    // SEARCH
    // ============================================
    const searchBtn = document.getElementById('searchBtn');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchClose = document.getElementById('searchClose');
    const searchInput = document.getElementById('searchInput');

    searchBtn.addEventListener('click', function() {
        searchOverlay.classList.add('active');
        setTimeout(() => searchInput.focus(), 300);
    });

    searchClose.addEventListener('click', function() {
        searchOverlay.classList.remove('active');
        searchInput.value = '';
    });

    // Close search on Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            searchOverlay.classList.remove('active');
            closeCart();
        }
    });

    // Search functionality
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        const products = document.querySelectorAll('.product-card');

        if (query === '') {
            products.forEach(p => p.style.display = '');
            return;
        }

        products.forEach(product => {
            const name = product.dataset.name.toLowerCase();
            if (name.includes(query)) {
                product.style.display = '';
            } else {
                product.style.display = 'none';
            }
        });
    });

    // ============================================
    // NEWSLETTER FORM
    // ============================================
    const newsletterForm = document.getElementById('newsletterForm');

    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;

        if (email) {
            this.innerHTML = `
                <p style="color: var(--badge-new); font-size: 14px; font-weight: 600; letter-spacing: 1px;">
                    Welcome to the family! Check your inbox.
                </p>
            `;
        }
    });

    // ============================================
    // SCROLL ANIMATIONS
    // ============================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe sections for scroll animation
    document.querySelectorAll('.category-card, .lookbook-item, .social-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // ============================================
    // HEADER SCROLL EFFECT
    // ============================================
    let lastScroll = 0;
    const header = document.querySelector('.header');

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.style.background = 'rgba(10, 10, 10, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'var(--bg-primary)';
            header.style.backdropFilter = '';
        }

        lastScroll = currentScroll;
    });

    // ============================================
    // PRODUCT CARD HOVER EFFECT (Touch devices)
    // ============================================
    if ('ontouchstart' in window) {
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('touchstart', function() {
                this.querySelector('.quick-add').style.opacity = '1';
                this.querySelector('.quick-add').style.transform = 'translateY(0)';
            });
        });
    }

})();
