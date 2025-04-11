/**
 * Kouvr - The Cover That Protects with Style
 * Main JavaScript file for interactive elements
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    // Note: Dark mode is now handled in dark-mode.js
    initCartFunctionality();
    initSearchFunctionality();
    initProductInteractions();
    initAnimations();
});

/**
 * Cart Functionality
 */
function initCartFunctionality() {
    const cartIcon = document.getElementById('cartIcon');
    const cartModal = document.getElementById('cartModal');
    const closeCartModal = document.getElementById('closeCartModal');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    
    // Cart data
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartDisplay();
    
    // Open cart modal
    cartIcon.addEventListener('click', function() {
        cartModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    });
    
    // Close cart modal
    closeCartModal.addEventListener('click', function() {
        cartModal.classList.add('hidden');
        document.body.style.overflow = ''; // Re-enable scrolling
    });
    
    // Close modal when clicking outside
    cartModal.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            cartModal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    });
    
    // Add to cart functionality
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = parseFloat(productCard.querySelector('.price, div:nth-child(2)').textContent.replace('$', ''));
            
            // Add item to cart
            const existingItem = cart.find(item => item.name === productName);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    name: productName,
                    price: productPrice,
                    quantity: 1
                });
            }
            
            // Save to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update cart display
            updateCartDisplay();
            
            // Show notification
            showToast(`${productName} added to cart`);
        });
    });
    
    // Update cart display
    function updateCartDisplay() {
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="text-gray-500 dark:text-gray-400 text-center py-4">Your cart is empty</p>';
            cartTotal.textContent = '$0.00';
        } else {
            let total = 0;
            let itemsHTML = '';
            
            cart.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                
                itemsHTML += `
                <div class="flex justify-between items-center py-2 border-b dark:border-gray-700">
                    <div>
                        <p class="font-medium text-kouvr-dark dark:text-white">${item.name}</p>
                        <p class="text-sm text-gray-600 dark:text-gray-400">$${item.price.toFixed(2)} × ${item.quantity}</p>
                    </div>
                    <div class="flex items-center">
                        <span class="text-lg font-medium text-kouvr-dark dark:text-white">$${itemTotal.toFixed(2)}</span>
                        <button class="ml-3 text-red-500 hover:text-red-700" data-index="${index}">×</button>
                    </div>
                </div>
                `;
            });
            
            cartItems.innerHTML = itemsHTML;
            cartTotal.textContent = `$${total.toFixed(2)}`;
            
            // Add event listeners to remove buttons
            const removeButtons = cartItems.querySelectorAll('button[data-index]');
            removeButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    const removedItem = cart[index];
                    
                    if (removedItem.quantity > 1) {
                        removedItem.quantity -= 1;
                    } else {
                        cart.splice(index, 1);
                    }
                    
                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateCartDisplay();
                    showToast('Item removed from cart');
                });
            });
        }
        
        // Update cart badge
        const cartBadge = cartIcon.querySelector('.cart-badge') || createCartBadge();
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        if (totalItems > 0) {
            cartBadge.textContent = totalItems;
            cartBadge.style.display = 'block';
        } else {
            cartBadge.style.display = 'none';
        }
    }
    
    // Create cart badge
    function createCartBadge() {
        const badge = document.createElement('span');
        badge.className = 'cart-badge';
        cartIcon.style.position = 'relative';
        cartIcon.appendChild(badge);
        return badge;
    }
}

/**
 * Search Functionality
 */
function initSearchFunctionality() {
    const searchInput = document.querySelector('input[placeholder="Search"]');
    const searchButton = document.getElementById('searchButton');
    
    // Focus effect
    searchInput.addEventListener('focus', function() {
        this.classList.add('ring-2', 'ring-kouvr-gray');
    });
    
    searchInput.addEventListener('blur', function() {
        this.classList.remove('ring-2', 'ring-kouvr-gray');
    });
    
    // Search functionality
    function performSearch() {
        const query = searchInput.value.trim().toLowerCase();
        if (query.length === 0) return;
        
        // For demonstration, we'll just show a toast with the search query
        showToast(`Searching for: ${query}`);
        
        // In a real implementation, you would filter products or redirect to a search results page
        // For example:
        // window.location.href = `/search?q=${encodeURIComponent(query)}`;
    }
    
    searchButton.addEventListener('click', performSearch);
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

/**
 * Product Interactions
 */
function initProductInteractions() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        // Product card hover effect
        card.addEventListener('mouseenter', function() {
            this.classList.add('shadow-lg');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('shadow-lg');
        });
        
        // Product image click to view details
        const productImage = card.querySelector('div:first-child');
        if (productImage) {
            productImage.addEventListener('click', function() {
                const productName = card.querySelector('h3').textContent;
                showToast(`Viewing details for ${productName}`);
                
                // In a real implementation, you would redirect to the product detail page
                // For example:
                // window.location.href = `/product/${productId}`;
            });
        }
    });
    
    // Category cards interaction
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.textContent.trim();
            showToast(`Browsing ${category} category`);
            
            // In a real implementation, you would redirect to the category page
            // For example:
            // window.location.href = `/category/${category.toLowerCase()}`;
        });
    });
    
    // Collection cards interaction
    const collectionCards = document.querySelectorAll('.collection-card');
    collectionCards.forEach(card => {
        card.addEventListener('click', function() {
            const collection = this.querySelector('div:last-child').textContent.trim();
            showToast(`Exploring ${collection} collection`);
            
            // In a real implementation, you would redirect to the collection page
            // For example:
            // window.location.href = `/collection/${collection.toLowerCase()}`;
        });
    });
}

/**
 * Animations
 */
function initAnimations() {
    // Animate elements when they come into view
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.product-card, .collection-card, .category-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Set initial state for animation
    const elementsToAnimate = document.querySelectorAll('.product-card, .collection-card, .category-card');
    elementsToAnimate.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Run animation on load and scroll
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
    
    // Logo animation
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        logo.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }
}

/**
 * Toast Notification
 */
function showToast(message, duration = 3000) {
    // Remove existing toast if present
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create new toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Hide toast after duration
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, duration);
}
