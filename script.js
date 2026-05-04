// login page
// Wait for the page to load
window.addEventListener('load', () => {
    const splash = document.getElementById('splash-screen');
    const loginContent = document.getElementById('login-wrapper');

    // Show logo animation for 2 seconds
    setTimeout(() => {
        splash.style.opacity = '0'; // Fade out effect
        
        setTimeout(() => {
            splash.classList.add('hidden');
            loginContent.classList.remove('hidden'); // Show Login Form
            document.body.style.overflow = 'auto'; 
        }, 600);
        
    }, 2000);
});

// product js
document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('product-display');
    let allProducts = []; // Search-ku helpful-aa irukkum

    async function fetchUnlimited() {
        if (!productGrid) return;

        try {
            
            const response = await fetch('https://dummyjson.com/products?limit=0');
            const data = await response.json();
            allProducts = data.products;
            
            displayItems(allProducts);
            console.log("Total Products Loaded: " + allProducts.length);

        } catch (error) {
            console.error("Fetch Error:", error);
        }
    }

    function displayItems(products) {
        productGrid.innerHTML = ''; 
        products.forEach(item => {
            const inrPrice = Math.round(item.price * 80);
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="wishlist-icon"><i class="fa-regular fa-heart"></i></div>
                <div class="product-img-wrapper">
                    <img src="${item.thumbnail}" alt="${item.title}" loading="lazy">
                </div>
                <div class="product-info">
                    <h4 class="product-title">${item.title}</h4>
                    <div class="product-price-row">
                        <span class="price">₹${inrPrice}</span>
                        <button class="add-btn" onclick="addToCart('${item.title.replace(/'/g, "\\'")}')">Add +</button>
                    </div>
                </div>
            `;
            productGrid.appendChild(card);
        });
    }

    fetchUnlimited();
});
// Search & Category Logic (JS)
let allProducts = []; // Global variable to store all fetched items

async function fetchProducts() {
    const productGrid = document.getElementById('product-display');
    try {
        const response = await fetch('https://dummyjson.com/products?limit=100');
        const data = await response.json();
        allProducts = data.products;
        displayProducts(allProducts); // Initial display
    } catch (error) {
        console.error("Error:", error);
    }
}

// Function to render products in UI
function displayProducts(products) {
    const productGrid = document.getElementById('product-display');
    if (!productGrid) return;

    productGrid.innerHTML = products.length > 0 ? '' : '<p class="loading-state">No products found!</p>';

    products.forEach(item => {
        const inrPrice = Math.round(item.price * 80);
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-img-wrapper">
                <img src="${item.thumbnail}" alt="${item.title}" loading="lazy">
            </div>
            <div class="product-info">
                <h4 class="product-title">${item.title}</h4>
                <p style="font-size: 10px; color: #888; text-transform: uppercase;">${item.category}</p>
                <div class="product-price-row">
                    <span class="price">₹${inrPrice}</span>
                    <button class="add-btn" onclick="addToCart('${item.title.replace(/'/g, "\\'")}')">
                        <i class="fa-solid fa-cart-plus"></i> Add
                    </button>
                </div>
            </div>
        `;
        productGrid.appendChild(card);
    });
}

// --- SEARCH LOGIC ---
const searchInput = document.querySelector('.search-wrapper input');
searchInput.addEventListener('input', (e) => {
    const value = e.target.value.toLowerCase();
    const filtered = allProducts.filter(product => 
        product.title.toLowerCase().includes(value) || 
        product.category.toLowerCase().includes(value)
    );
    displayProducts(filtered);
});

// --- CATEGORY FILTER LOGIC ---
function filterByCategory(category) {
    if (category === 'all') {
        displayProducts(allProducts);
    } else {
        const filtered = allProducts.filter(p => p.category === category);
        displayProducts(filtered);
    }
}

// Initialize
fetchProducts();
function toggleMenu() {
    const sheet = document.getElementById('more-sheet');
    sheet.classList.toggle('active');
}
// categories js
document.addEventListener('DOMContentLoaded', () => {
    const sidebarItems = document.querySelectorAll('.cat-item');
    const displayArea = document.getElementById('category-products');

    // Default load
    fetchCategoryData('electronics');

    sidebarItems.forEach(item => {
        item.addEventListener('click', function() {
            // Active class toggle
            sidebarItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');

            const category = this.getAttribute('data-category');
            fetchCategoryData(category);
        });
    });

    async function fetchCategoryData(category) {
        displayArea.innerHTML = "<p>Updating list...</p>";
        try {
            const res = await fetch(`https://fakestoreapi.com/products/category/${category}`);
            const products = await res.json();
            
            displayArea.innerHTML = products.map(p => `
                <div class="mini-card">
                    <img src="${p.image}" alt="${p.title}" onclick="viewProduct(${p.id})">
                    <div class="mini-info">
                        <h3>${p.title.substring(0, 15)}...</h3>
                        <p class="price">₹${Math.floor(p.price * 80)}</p>
                        <button class="buy-btn" onclick="orderNow(${p.id})">Buy Now</button>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            displayArea.innerHTML = "<p>Error loading products.</p>";
        }
    }
});

function orderNow(id) {
    window.location.href = `buynow.html?id=${id}`;
}

function viewProduct(id) {
    console.log("Viewing product:", id);
}