/**
 * ============================================================================
 * VELVETSTORE - ATELIER PRESS-ON NAILS STORE SCRIPT (script.js)
 * ============================================================================
 * 
 * WELCOME TO VELVETSTORE SCRIPT!
 * This file contains all the interactive logic for your online store:
 * 1. Store Configuration (Currency, WhatsApp Number, Discounts)
 * 2. Product Catalog (How to easily add, edit, or remove products)
 * 3. Shopping Cart & Drawer (Add, update quantity, remove, localStorage)
 * 4. Checkout & Order Processing (Direct order & WhatsApp order sender)
 * 5. Authentication (Login, Sign-Up, Google simulation, Logout, localStorage)
 * 6. Collections Filter & Search (Glam, Minimal, Floral, Bridal, etc.)
 * 7. Mobile Navigation & Interactive UI Helpers
 * ============================================================================
 */

/* ============================================================================
   1. STORE CONFIGURATION (EDIT THESE TO CUSTOMIZE YOUR STORE)
   ============================================================================ */

// The currency symbol shown throughout your store (e.g., "Rs", "$", "€", "£")
const CURRENCY = "Rs";

// Your business WhatsApp phone number for receiving orders (Include country code without + or spaces)
// Example: "919876543210" or "15551234567"
const WHATSAPP_PHONE = "919876543210";

// Your brand store name
const STORE_NAME = "VelvetStore Atelier";

// Promotional discount code (15% off first order)
const PROMO_CODE = "VELVET15";
const PROMO_DISCOUNT_PERCENT = 15;


/* ============================================================================
   2. PRODUCT CATALOG (DEFAULT PRODUCTS)
   ============================================================================
   HOW TO MANAGE PRODUCTS:
   - To ADD a product: Copy an existing block below, paste it at the end of the array,
     give it a unique `id` (e.g. 9), name, price, category, etc.
   - To EDIT a product: Change the title, price, category, or unsplash image URL.
   - To REMOVE a product: Simply delete that entire { ... } block.
   - NOTE: If you edit products in your Private Admin Dashboard (/admin.html),
     they will be saved to your browser's localStorage and automatically override
     this list! You can reset anytime in the admin.
   ============================================================================ */

const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: "Lilac Glaze & Pearl",
    price: 1499,
    category: "Glam",
    shape: "Medium Almond",
    badge: "HOT",
    rating: 4.9,
    reviewsCount: 184,
    description: "Almond shape, chrome glaze, freshwater pearl micro-accents and luminous mirror sheen.",
    image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    name: "Rose Quartz & 24k Flakes",
    price: 1699,
    category: "Glam",
    shape: "Medium Coffin",
    badge: "TOP RATED",
    rating: 5.0,
    reviewsCount: 210,
    description: "Coffin shape, translucent jelly pink with genuine 24k gold leaf flecks and gloss finish.",
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    name: "Milky French Micro-Tip",
    price: 1299,
    category: "Minimal",
    shape: "Short Oval",
    badge: "BESTSELLER",
    rating: 4.8,
    reviewsCount: 95,
    description: "Short oval, ultra-minimalist clean girl aesthetic for effortless everyday couture wear.",
    image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    name: "Celestial Velvet Burgundy",
    price: 1799,
    category: "Glam",
    shape: "Medium Stiletto",
    badge: "COUTURE",
    rating: 4.9,
    reviewsCount: 142,
    description: "Medium stiletto, magnetic cat-eye velvet light-bending effect in deep garnet wine.",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    name: "Gardenia Blossom & Gold Vine",
    price: 1599,
    category: "Floral",
    shape: "Medium Almond",
    badge: "ARTISANAL",
    rating: 4.9,
    reviewsCount: 88,
    description: "Hand-painted garden blossoms, encapsulated dried petals, and delicate rose-gold vines.",
    image: "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 6,
    name: "Pearlescent Sheer Glaze",
    price: 1399,
    category: "Minimal",
    shape: "Short Square",
    badge: "CLEAN CHIC",
    rating: 4.7,
    reviewsCount: 114,
    description: "Translucent glazed doughnut sheen, subtle mother-of-pearl undertone, natural length.",
    image: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 7,
    name: "Bridal Chantilly Lace Suite",
    price: 1899,
    category: "Bridal",
    shape: "Medium Almond",
    badge: "BRIDAL",
    rating: 5.0,
    reviewsCount: 167,
    description: "Pearlescent mother-of-pearl base, micro-fine French lace filigree, and Swarovski crystals.",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 8,
    name: "Golden Champagne Chrome",
    price: 1549,
    category: "Glam",
    shape: "Long Coffin",
    badge: "LIMITED",
    rating: 4.8,
    reviewsCount: 76,
    description: "Mirror liquid chrome in warm champagne, 3D droplets, high-fashion statement finish.",
    image: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80"
  }
];


/* ============================================================================
   3. APP STATE & STORAGE INITIALIZATION
   ============================================================================ */

// Load products from localStorage or fall back to default list
function getProducts() {
  const saved = localStorage.getItem("velvet_products");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {
      console.error("Error parsing saved products:", e);
    }
  }
  // If nothing valid in localStorage, seed with DEFAULT_PRODUCTS
  localStorage.setItem("velvet_products", JSON.stringify(DEFAULT_PRODUCTS));
  return DEFAULT_PRODUCTS;
}

// Shopping cart state (array of: { id, productId, name, price, image, size, quantity })
let cart = [];

function loadCart() {
  const savedCart = localStorage.getItem("velvet_cart");
  if (savedCart) {
    try {
      cart = JSON.parse(savedCart);
    } catch (e) {
      cart = [];
    }
  }
  updateCartBadge();
}

function saveCart() {
  localStorage.setItem("velvet_cart", JSON.stringify(cart));
  updateCartBadge();
  renderCartDrawer();
}

// Format price with configured currency
function formatPrice(amount) {
  return `${CURRENCY} ${Number(amount).toLocaleString()}`;
}

// Active collection filter (default: "All")
let currentFilter = "All";
let searchQuery = "";


/* ============================================================================
   4. RENDER PRODUCTS TO THE SHOP SECTION
   ============================================================================ */

function renderProducts() {
  const container = document.getElementById("product-grid");
  if (!container) return;

  const products = getProducts();

  // Filter by category and search
  const filtered = products.filter(product => {
    const matchesCategory = (currentFilter === "All" || product.category.toLowerCase() === currentFilter.toLowerCase());
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.shape && product.shape.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-16 text-center bg-surface-container-lowest rounded-3xl p-8 border border-dashed border-outline-variant/50">
        <span class="material-symbols-outlined text-[48px] text-primary-container mb-3">search_off</span>
        <h3 class="font-serif-headline text-2xl text-on-surface mb-2">No atelier sets match your selection</h3>
        <p class="text-on-surface-variant max-w-md mx-auto text-sm mb-6">
          Try picking a different collection filter or clearing your search keywords.
        </p>
        <button onclick="resetFilters()" class="btn-atelier-primary px-6 py-2.5 rounded-full text-sm font-semibold">
          View All Creations
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(product => {
    const badgeHtml = product.badge ? `
      <div class="absolute top-3 right-3 bg-secondary-container text-on-secondary-container font-semibold text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
        ${product.badge}
      </div>
    ` : '';

    const shapeHtml = product.shape ? `
      <div class="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-primary font-semibold text-xs px-2.5 py-1 rounded-full shadow-xs">
        ${product.shape}
      </div>
    ` : '';

    return `
      <div class="group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0_8px_24px_-4px_rgba(74,62,69,0.05)] hover:shadow-[0_16px_32px_-6px_rgba(74,62,69,0.1)] transition-all flex flex-col border border-surface-container" data-product-id="${product.id}">
        <!-- Visual Container -->
        <div class="relative h-64 w-full bg-surface-container overflow-hidden">
          <img 
            src="${product.image}" 
            alt="${product.name}" 
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onerror="this.src='https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80'"
          />
          ${shapeHtml}
          ${badgeHtml}
        </div>

        <!-- Product Details -->
        <div class="p-5 flex flex-col flex-1 justify-between gap-3 bg-surface-container-lowest">
          <div>
            <!-- Rating & Category -->
            <div class="flex items-center justify-between mb-1">
              <div class="flex items-center gap-1">
                <span class="material-symbols-outlined text-[15px] text-primary icon-filled">star</span>
                <span class="text-xs font-bold text-on-surface">${product.rating || '5.0'}</span>
                <span class="text-xs text-on-surface-variant">(${product.reviewsCount || '100+'})</span>
              </div>
              <span class="text-[11px] font-semibold uppercase tracking-wider text-primary-container px-2 py-0.5 rounded-full bg-surface-container">
                ${product.category}
              </span>
            </div>

            <!-- Title & Description -->
            <h3 class="font-serif-headline text-lg font-bold text-on-surface group-hover:text-primary transition-colors">
              ${product.name}
            </h3>
            <p class="text-xs text-on-surface-variant mt-1 line-clamp-2 leading-relaxed">
              ${product.description}
            </p>
          </div>

          <!-- Size Selector Pills -->
          <div class="pt-1">
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Select Size:</span>
              <button onclick="openSizingGuideModal()" class="text-[11px] text-primary hover:underline flex items-center gap-0.5" type="button">
                <span class="material-symbols-outlined text-[13px]">straighten</span> Guide
              </button>
            </div>
            <div class="flex items-center gap-1.5 flex-wrap product-sizes" data-selected-size="S">
              <button type="button" onclick="selectSize(this, 'XS')" class="size-pill px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant text-xs hover:bg-surface-container-high transition-colors">XS</button>
              <button type="button" onclick="selectSize(this, 'S')" class="size-pill active px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold transition-colors">S</button>
              <button type="button" onclick="selectSize(this, 'M')" class="size-pill px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant text-xs hover:bg-surface-container-high transition-colors">M</button>
              <button type="button" onclick="selectSize(this, 'L')" class="size-pill px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant text-xs hover:bg-surface-container-high transition-colors">L</button>
              <button type="button" onclick="selectSize(this, 'Custom')" class="size-pill px-2.5 py-1 rounded-full bg-surface-container text-primary text-xs hover:bg-surface-container-high transition-colors">Custom</button>
            </div>
          </div>

          <!-- Price & Add To Cart Button -->
          <div class="flex items-center justify-between pt-2 border-t border-surface-container">
            <div>
              <span class="text-[11px] uppercase tracking-wider text-on-surface-variant block">Price</span>
              <span class="font-serif-headline text-lg font-bold text-on-surface">
                ${formatPrice(product.price)}
              </span>
            </div>
            <button 
              type="button" 
              onclick="addToCart(${product.id}, this)"
              class="btn-atelier-primary font-semibold text-xs px-4 py-2.5 rounded-full flex items-center gap-1.5 cursor-pointer"
            >
              <span class="material-symbols-outlined text-[16px]">add_shopping_cart</span>
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

// Size pill selection handler
function selectSize(btn, size) {
  const parent = btn.closest(".product-sizes");
  if (!parent) return;
  parent.querySelectorAll(".size-pill").forEach(el => el.classList.remove("active"));
  btn.classList.add("active");
  parent.setAttribute("data-selected-size", size);
}

// Reset filters back to All
function resetFilters() {
  filterByCollection("All");
  const searchInput = document.getElementById("shop-search");
  if (searchInput) searchInput.value = "";
  searchQuery = "";
  renderProducts();
}


/* ============================================================================
   5. COLLECTIONS FILTERING & SEARCH
   ============================================================================ */

function filterByCollection(category) {
  currentFilter = category;

  // Update active pill UI buttons
  const buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach(btn => {
    const btnCat = btn.getAttribute("data-category");
    if (btnCat && btnCat.toLowerCase() === category.toLowerCase()) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  renderProducts();

  // Smooth scroll to the shop section
  const shopSection = document.getElementById("shop");
  if (shopSection) {
    shopSection.scrollIntoView({ behavior: "smooth" });
  }
}

// Setup search input listeners
function setupSearch() {
  const searchInput = document.getElementById("shop-search");
  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value.trim();
    renderProducts();
  });
}


/* ============================================================================
   6. SHOPPING CART LOGIC (DRAWER, QUANTITY, LOCALSTORAGE)
   ============================================================================ */

// Add item to cart with selected size
function addToCart(productId, triggerElement) {
  const products = getProducts();
  const product = products.find(p => p.id === productId);
  if (!product) return;

  // Find selected size on the product card
  let selectedSize = "S";
  if (triggerElement) {
    const card = triggerElement.closest("[data-product-id]");
    if (card) {
      const sizeContainer = card.querySelector(".product-sizes");
      if (sizeContainer && sizeContainer.getAttribute("data-selected-size")) {
        selectedSize = sizeContainer.getAttribute("data-selected-size");
      }
    }
  }

  // Create composite cart key (productId + size)
  const cartItemIndex = cart.findIndex(item => item.id === product.id && item.size === selectedSize);

  if (cartItemIndex > -1) {
    cart[cartItemIndex].quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize,
      shape: product.shape || 'Medium',
      quantity: 1
    });
  }

  saveCart();
  showToast(`Added "${product.name}" (${selectedSize}) to your bag!`);
  openCartDrawer();
}

// Update live cart count in the header
function updateCartBadge() {
  const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const badgeElements = document.querySelectorAll(".cart-count-badge");
  badgeElements.forEach(badge => {
    badge.textContent = totalCount;
    if (totalCount > 0) {
      badge.classList.remove("hidden");
    } else {
      badge.classList.add("hidden");
    }
  });
}

// Render the drawer contents
function renderCartDrawer() {
  const container = document.getElementById("cart-drawer-items");
  const subtotalEl = document.getElementById("cart-drawer-subtotal");
  const totalEl = document.getElementById("cart-drawer-total");
  const emptyState = document.getElementById("cart-drawer-empty");
  const footerEl = document.getElementById("cart-drawer-footer");

  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = "";
    if (emptyState) emptyState.classList.remove("hidden");
    if (footerEl) footerEl.classList.add("hidden");
    return;
  }

  if (emptyState) emptyState.classList.add("hidden");
  if (footerEl) footerEl.classList.remove("hidden");

  let subtotal = 0;

  container.innerHTML = cart.map((item, index) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    return `
      <div class="flex items-center gap-3 p-3 bg-surface-container-lowest rounded-xl shadow-xs border border-surface-container">
        <!-- Thumbnail -->
        <img 
          src="${item.image}" 
          alt="${item.name}" 
          class="w-16 h-16 rounded-lg object-cover bg-surface-container shrink-0"
          onerror="this.src='https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=200&q=80'"
        />

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <h4 class="font-serif-headline text-sm font-semibold text-on-surface truncate">${item.name}</h4>
          <p class="text-[11px] text-on-surface-variant">Size: <span class="font-bold text-primary">${item.size}</span> · ${item.shape || 'Medium'}</p>
          <p class="text-xs font-bold text-primary mt-0.5">${formatPrice(item.price)}</p>
        </div>

        <!-- Quantity Controls -->
        <div class="flex items-center bg-surface-container rounded-full px-1.5 py-0.5 gap-1 shrink-0">
          <button 
            type="button" 
            onclick="updateCartItemQuantity(${index}, -1)" 
            class="w-5 h-5 rounded-full flex items-center justify-center hover:bg-surface-container-high text-on-surface text-xs font-bold cursor-pointer"
            aria-label="Decrease quantity"
          >-</button>
          <span class="text-xs font-bold px-1.5 min-w-[16px] text-center">${item.quantity}</span>
          <button 
            type="button" 
            onclick="updateCartItemQuantity(${index}, 1)" 
            class="w-5 h-5 rounded-full flex items-center justify-center hover:bg-surface-container-high text-on-surface text-xs font-bold cursor-pointer"
            aria-label="Increase quantity"
          >+</button>
        </div>

        <!-- Remove Button -->
        <button 
          type="button" 
          onclick="removeCartItem(${index})" 
          class="p-1 rounded-full text-on-surface-variant/70 hover:text-error hover:bg-surface-container-high transition-colors shrink-0 cursor-pointer"
          title="Remove item"
        >
          <span class="material-symbols-outlined text-[18px]">delete</span>
        </button>
      </div>
    `;
  }).join("");

  if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
  if (totalEl) totalEl.textContent = formatPrice(subtotal);
}

// Adjust quantity
function updateCartItemQuantity(index, change) {
  if (!cart[index]) return;
  cart[index].quantity += change;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }
  saveCart();
}

// Remove item from cart
function removeCartItem(index) {
  if (!cart[index]) return;
  const removedName = cart[index].name;
  cart.splice(index, 1);
  saveCart();
  showToast(`Removed "${removedName}" from bag`);
}

// Clear all cart items
function clearCart() {
  cart = [];
  saveCart();
}

// Cart Drawer open/close
function openCartDrawer() {
  const drawer = document.getElementById("cart-drawer");
  const overlay = document.getElementById("cart-drawer-overlay");
  if (!drawer || !overlay) return;

  renderCartDrawer();
  drawer.classList.remove("translate-x-full");
  overlay.classList.remove("opacity-0", "pointer-events-none");
  overlay.classList.add("opacity-100", "pointer-events-auto");
  document.body.style.overflow = "hidden";
}

function closeCartDrawer() {
  const drawer = document.getElementById("cart-drawer");
  const overlay = document.getElementById("cart-drawer-overlay");
  if (!drawer || !overlay) return;

  drawer.classList.add("translate-x-full");
  overlay.classList.remove("opacity-100", "pointer-events-auto");
  overlay.classList.add("opacity-0", "pointer-events-none");
  document.body.style.overflow = "";
}


/* ============================================================================
   7. CHECKOUT & ORDER HANDLING (STANDARD & WHATSAPP)
   ============================================================================ */

function openCheckoutModal() {
  if (cart.length === 0) {
    showToast("Your atelier bag is empty!");
    return;
  }
  closeCartDrawer();

  const modal = document.getElementById("checkout-modal");
  if (!modal) return;

  // Pre-fill user data if logged in
  const activeUser = getActiveUser();
  if (activeUser) {
    const nameInput = document.getElementById("checkout-name");
    const emailInput = document.getElementById("checkout-email");
    if (nameInput && !nameInput.value) nameInput.value = activeUser.name || "";
    if (emailInput && !emailInput.value) emailInput.value = activeUser.email || "";
  }

  // Calculate order totals in checkout modal
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const checkoutSubtotalEl = document.getElementById("checkout-subtotal");
  const checkoutTotalEl = document.getElementById("checkout-total");
  const checkoutItemsCountEl = document.getElementById("checkout-items-count");

  if (checkoutSubtotalEl) checkoutSubtotalEl.textContent = formatPrice(subtotal);
  if (checkoutTotalEl) checkoutTotalEl.textContent = formatPrice(subtotal);
  if (checkoutItemsCountEl) checkoutItemsCountEl.textContent = `${cart.reduce((a, b) => a + b.quantity, 0)} items`;

  modal.classList.remove("modal-hidden");
  modal.classList.add("modal-visible");
}

function closeCheckoutModal() {
  const modal = document.getElementById("checkout-modal");
  if (!modal) return;
  modal.classList.remove("modal-visible");
  modal.classList.add("modal-hidden");
}

// Process Order (Stores in localStorage 'velvet_orders' for Admin inspection)
function handleCheckoutSubmit(event) {
  event.preventDefault();

  const name = document.getElementById("checkout-name")?.value.trim();
  const phone = document.getElementById("checkout-phone")?.value.trim();
  const email = document.getElementById("checkout-email")?.value.trim();
  const address = document.getElementById("checkout-address")?.value.trim();
  const notes = document.getElementById("checkout-notes")?.value.trim() || "None";
  const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || "Cash on Delivery";

  if (!name || !phone || !address) {
    showToast("Please fill in your name, phone number, and address.", "error");
    return;
  }

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const orderId = "VS-" + Math.floor(100000 + Math.random() * 900000);
  const orderDate = new Date().toISOString();

  const newOrder = {
    orderId,
    date: orderDate,
    customer: { name, phone, email, address, notes },
    items: [...cart],
    totalAmount: subtotal,
    currency: CURRENCY,
    paymentMethod,
    status: "Pending" // "Pending", "Confirmed", "Shipped", "Delivered"
  };

  // Save to localStorage orders list for Admin
  const existingOrders = JSON.parse(localStorage.getItem("velvet_orders") || "[]");
  existingOrders.unshift(newOrder);
  localStorage.setItem("velvet_orders", JSON.stringify(existingOrders));

  // Clear cart
  clearCart();
  closeCheckoutModal();

  // Show order confirmation modal
  showOrderSuccessModal(newOrder);
}

// Send Order via WhatsApp Link
function sendOrderViaWhatsApp() {
  const name = document.getElementById("checkout-name")?.value.trim();
  const phone = document.getElementById("checkout-phone")?.value.trim();
  const address = document.getElementById("checkout-address")?.value.trim();
  const notes = document.getElementById("checkout-notes")?.value.trim();

  if (!name || !phone || !address) {
    showToast("Please fill in your Name, Phone, and Address before sending via WhatsApp.", "error");
    return;
  }

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const orderId = "VS-" + Math.floor(100000 + Math.random() * 900000);

  // Format nice WhatsApp message
  let message = `*🌸 NEW ORDER FROM VELVETSTORE ATELIER 🌸*\n\n`;
  message += `*Order Reference:* #${orderId}\n`;
  message += `*Customer:* ${name}\n`;
  message += `*Phone:* ${phone}\n`;
  message += `*Delivery Address:* ${address}\n`;
  if (notes) message += `*Notes/Custom Sizing:* ${notes}\n`;
  message += `\n*🛍️ ORDERED PRESS-ON SETS:*\n`;

  cart.forEach((item, idx) => {
    message += `${idx + 1}. *${item.name}*\n   Size: ${item.size} | Qty: ${item.quantity} | ${formatPrice(item.price * item.quantity)}\n`;
  });

  message += `\n*✨ TOTAL AMOUNT:* ${formatPrice(subtotal)}\n`;
  message += `*Complimentary 7-piece salon prep kit included.*\n\n`;
  message += `Please confirm my order and dispatch timeline! Thank you! 💕`;

  // Encode for URL
  const encodedMessage = encodeURIComponent(message);
  const waUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedMessage}`;

  // Also record this order in storage
  const newOrder = {
    orderId,
    date: new Date().toISOString(),
    customer: { name, phone, address, notes },
    items: [...cart],
    totalAmount: subtotal,
    currency: CURRENCY,
    paymentMethod: "WhatsApp Direct Order",
    status: "Pending"
  };
  const existingOrders = JSON.parse(localStorage.getItem("velvet_orders") || "[]");
  existingOrders.unshift(newOrder);
  localStorage.setItem("velvet_orders", JSON.stringify(existingOrders));

  clearCart();
  closeCheckoutModal();

  // Open WhatsApp in new tab
  window.open(waUrl, "_blank");

  // Show friendly confirmation
  showOrderSuccessModal(newOrder, true);
}

// Show Order Success Modal
function showOrderSuccessModal(order, isWhatsApp = false) {
  const modal = document.getElementById("order-success-modal");
  if (!modal) return;

  const idEl = document.getElementById("success-order-id");
  const nameEl = document.getElementById("success-customer-name");
  const totalEl = document.getElementById("success-order-total");
  const waNoticeEl = document.getElementById("success-whatsapp-notice");

  if (idEl) idEl.textContent = order.orderId;
  if (nameEl) nameEl.textContent = order.customer.name;
  if (totalEl) totalEl.textContent = formatPrice(order.totalAmount);
  if (waNoticeEl) {
    if (isWhatsApp) {
      waNoticeEl.textContent = "Your order details have been composed and opened in WhatsApp. Our atelier concierge will assist you shortly!";
    } else {
      waNoticeEl.textContent = "Your handcrafted press-on set order has been received and scheduled for dispatch.";
    }
  }

  modal.classList.remove("modal-hidden");
  modal.classList.add("modal-visible");
}

function closeOrderSuccessModal() {
  const modal = document.getElementById("order-success-modal");
  if (!modal) return;
  modal.classList.remove("modal-visible");
  modal.classList.add("modal-hidden");
}


/* ============================================================================
   8. AUTHENTICATION & LOGIN / SIGN UP MODAL (EXACT STITCH REPLICA)
   ============================================================================ */

// Storage keys: 'velvet_users' and 'velvet_active_user'
function getUsers() {
  return JSON.parse(localStorage.getItem("velvet_users") || "[]");
}

function getActiveUser() {
  return JSON.parse(localStorage.getItem("velvet_active_user") || "null");
}

function openAuthModal(defaultTab = 'login') {
  const modal = document.getElementById("auth-modal");
  if (!modal) return;
  switchAuthTab(defaultTab);
  modal.classList.remove("modal-hidden");
  modal.classList.add("modal-visible");
  document.body.style.overflow = "hidden";
}

function closeAuthModal() {
  const modal = document.getElementById("auth-modal");
  if (!modal) return;
  modal.classList.remove("modal-visible");
  modal.classList.add("modal-hidden");
  document.body.style.overflow = "";
  clearAuthErrors();
}

function switchAuthTab(mode) {
  const loginBtn = document.getElementById('toggle-login');
  const signupBtn = document.getElementById('toggle-signup');
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const heading = document.getElementById('form-heading');
  const subheading = document.getElementById('form-subheading');

  clearAuthErrors();

  if (mode === 'login') {
    if (loginBtn) loginBtn.className = 'w-1/2 py-2 text-center rounded-full font-semibold text-xs transition-all duration-300 bg-white text-primary shadow-xs cursor-pointer';
    if (signupBtn) signupBtn.className = 'w-1/2 py-2 text-center rounded-full font-semibold text-xs transition-all duration-300 text-on-surface-variant hover:text-on-surface cursor-pointer';
    if (loginForm) loginForm.classList.remove('hidden');
    if (signupForm) signupForm.classList.add('hidden');
    if (heading) heading.innerText = 'Welcome Back to Atelier';
    if (subheading) subheading.innerText = 'Sign in to manage your custom nail sizing profile and atelier orders.';
  } else {
    if (signupBtn) signupBtn.className = 'w-1/2 py-2 text-center rounded-full font-semibold text-xs transition-all duration-300 bg-white text-primary shadow-xs cursor-pointer';
    if (loginBtn) loginBtn.className = 'w-1/2 py-2 text-center rounded-full font-semibold text-xs transition-all duration-300 text-on-surface-variant hover:text-on-surface cursor-pointer';
    if (signupForm) signupForm.classList.remove('hidden');
    if (loginForm) loginForm.classList.add('hidden');
    if (heading) heading.innerText = 'Join the Atelier Circle';
    if (subheading) subheading.innerText = 'Unlock complimentary sizing consultation and limited bespoke drops.';
  }
}

function togglePasswordVisibility(inputId, iconId) {
  const input = document.getElementById(inputId);
  const icon = document.getElementById(iconId);
  if (!input || !icon) return;
  if (input.type === 'password') {
    input.type = 'text';
    icon.innerText = 'visibility_off';
  } else {
    input.type = 'password';
    icon.innerText = 'visibility';
  }
}

// Password Strength Calculator
function updateStrength(val) {
  const b1 = document.getElementById('bar-1');
  const b2 = document.getElementById('bar-2');
  const b3 = document.getElementById('bar-3');
  const b4 = document.getElementById('bar-4');
  const label = document.getElementById('strength-label');

  if (!b1 || !b2 || !b3 || !b4 || !label) return;

  const reset = () => {
    b1.className = 'rounded-full bg-surface-container-highest transition-colors duration-300 h-1';
    b2.className = 'rounded-full bg-surface-container-highest transition-colors duration-300 h-1';
    b3.className = 'rounded-full bg-surface-container-highest transition-colors duration-300 h-1';
    b4.className = 'rounded-full bg-surface-container-highest transition-colors duration-300 h-1';
  };

  reset();

  if (!val || val.length === 0) {
    label.innerText = 'Minimum 6 characters';
    return;
  }

  if (val.length < 6) {
    b1.className = 'rounded-full bg-red-400 transition-colors duration-300 h-1';
    label.innerText = 'Too short (min 6 chars)';
  } else if (val.length < 8) {
    b1.className = 'rounded-full bg-amber-400 transition-colors duration-300 h-1';
    b2.className = 'rounded-full bg-amber-400 transition-colors duration-300 h-1';
    label.innerText = 'Moderate';
  } else if (val.length < 11) {
    b1.className = 'rounded-full bg-primary transition-colors duration-300 h-1';
    b2.className = 'rounded-full bg-primary transition-colors duration-300 h-1';
    b3.className = 'rounded-full bg-primary transition-colors duration-300 h-1';
    label.innerText = 'Strong';
  } else {
    b1.className = 'rounded-full bg-emerald-600 transition-colors duration-300 h-1';
    b2.className = 'rounded-full bg-emerald-600 transition-colors duration-300 h-1';
    b3.className = 'rounded-full bg-emerald-600 transition-colors duration-300 h-1';
    b4.className = 'rounded-full bg-emerald-600 transition-colors duration-300 h-1';
    label.innerText = 'Atelier Grade';
  }
}

function clearAuthErrors() {
  const loginErr = document.getElementById("login-error-msg");
  const signupErr = document.getElementById("signup-error-msg");
  if (loginErr) loginErr.classList.add("hidden");
  if (signupErr) signupErr.classList.add("hidden");
}

// Handle Login Submission
function handleLogin(event) {
  event.preventDefault();
  const emailInput = document.getElementById("login-email");
  const passwordInput = document.getElementById("login-password");
  const errorMsg = document.getElementById("login-error-msg");

  const email = emailInput?.value.trim().toLowerCase();
  const password = passwordInput?.value;

  if (!email || !password) {
    if (errorMsg) {
      errorMsg.textContent = "Please fill in all credentials.";
      errorMsg.classList.remove("hidden");
    }
    return;
  }

  const users = getUsers();
  const existingUser = users.find(u => u.email === email && u.password === password);

  if (!existingUser) {
    // If demo mode has no users yet, let's create or check
    if (errorMsg) {
      errorMsg.textContent = "Invalid email or password. Please check your credentials or Join Circle.";
      errorMsg.classList.remove("hidden");
    }
    return;
  }

  // Login successful
  localStorage.setItem("velvet_active_user", JSON.stringify(existingUser));
  closeAuthModal();
  updateAuthUI();
  showToast(`Welcome back, ${existingUser.name}!`);
}

// Handle Sign Up Submission
function handleSignUp(event) {
  event.preventDefault();
  const nameInput = document.getElementById("signup-name");
  const emailInput = document.getElementById("signup-email");
  const passwordInput = document.getElementById("signup-password");
  const confirmPasswordInput = document.getElementById("signup-confirm-password");
  const errorMsg = document.getElementById("signup-error-msg");

  const name = nameInput?.value.trim();
  const email = emailInput?.value.trim().toLowerCase();
  const password = passwordInput?.value;
  const confirmPassword = confirmPasswordInput?.value;

  // Validation
  if (!name || !email || !password || !confirmPassword) {
    if (errorMsg) {
      errorMsg.textContent = "Please fill in all required fields.";
      errorMsg.classList.remove("hidden");
    }
    return;
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    if (errorMsg) {
      errorMsg.textContent = "Please enter a valid email address.";
      errorMsg.classList.remove("hidden");
    }
    return;
  }

  // Password length validation
  if (password.length < 6) {
    if (errorMsg) {
      errorMsg.textContent = "Password must be at least 6 characters long.";
      errorMsg.classList.remove("hidden");
    }
    return;
  }

  // Confirm password match validation
  if (password !== confirmPassword) {
    if (errorMsg) {
      errorMsg.textContent = "Passwords do not match. Please verify.";
      errorMsg.classList.remove("hidden");
    }
    return;
  }

  const users = getUsers();
  if (users.some(u => u.email === email)) {
    if (errorMsg) {
      errorMsg.textContent = "An account with this email already exists. Please Sign In.";
      errorMsg.classList.remove("hidden");
    }
    return;
  }

  const newUser = {
    name,
    email,
    password,
    joinedDate: new Date().toISOString()
  };

  users.push(newUser);
  localStorage.setItem("velvet_users", JSON.stringify(users));
  localStorage.setItem("velvet_active_user", JSON.stringify(newUser));

  closeAuthModal();
  updateAuthUI();
  showToast(`Welcome to the Atelier Circle, ${name}!`);
}

// Handle Google Continue button (Simulated UI demo auth)
function handleGoogleAuth() {
  const demoGoogleUser = {
    name: "Genevieve D.",
    email: "genevieve.atelier@gmail.com",
    isGoogle: true
  };
  localStorage.setItem("velvet_active_user", JSON.stringify(demoGoogleUser));
  closeAuthModal();
  updateAuthUI();
  showToast("Signed in via Google Atelier Account!");
}

// Logout user
function logout() {
  localStorage.removeItem("velvet_active_user");
  updateAuthUI();
  showToast("You have been signed out.");
}

// Update Header Navbar buttons after login / logout
function updateAuthUI() {
  const guestContainers = document.querySelectorAll(".auth-guest-view");
  const userContainers = document.querySelectorAll(".auth-user-view");
  const userNameElements = document.querySelectorAll(".auth-user-name");

  const activeUser = getActiveUser();

  if (activeUser) {
    guestContainers.forEach(el => el.classList.add("hidden"));
    userContainers.forEach(el => el.classList.remove("hidden"));
    userNameElements.forEach(el => {
      el.textContent = activeUser.name ? activeUser.name.split(" ")[0] : "Atelier Client";
    });
  } else {
    guestContainers.forEach(el => el.classList.remove("hidden"));
    userContainers.forEach(el => el.classList.add("hidden"));
  }
}


/* ============================================================================
   9. SIZING GUIDE MODAL
   ============================================================================ */

function openSizingGuideModal() {
  const modal = document.getElementById("sizing-guide-modal");
  if (!modal) return;
  modal.classList.remove("modal-hidden");
  modal.classList.add("modal-visible");
}

function closeSizingGuideModal() {
  const modal = document.getElementById("sizing-guide-modal");
  if (!modal) return;
  modal.classList.remove("modal-visible");
  modal.classList.add("modal-hidden");
}


/* ============================================================================
   10. MOBILE MENU TOGGLE
   ============================================================================ */

function toggleMobileMenu() {
  const menu = document.getElementById("mobile-menu");
  if (!menu) return;
  menu.classList.toggle("hidden");
}

function closeMobileMenu() {
  const menu = document.getElementById("mobile-menu");
  if (menu) menu.classList.add("hidden");
}


/* ============================================================================
   11. TOAST NOTIFICATION UTILITY
   ============================================================================ */

function showToast(message, type = "success") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  
  const icon = type === "error" ? "error" : "check_circle";
  const iconColor = type === "error" ? "text-error text-red-600" : "text-primary";

  toast.innerHTML = `
    <span class="material-symbols-outlined ${iconColor} text-[20px] shrink-0">${icon}</span>
    <span class="text-on-surface text-xs font-semibold">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("fade-out");
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3200);
}


/* ============================================================================
   12. NEWSLETTER SUBSCRIPTION
   ============================================================================ */

function handleNewsletterSubmit(e) {
  e.preventDefault();
  const input = document.getElementById("newsletter-email");
  if (!input || !input.value.trim()) return;
  
  showToast("Thank you for joining our Private Salon Dispatch!");
  input.value = "";
}


/* ============================================================================
   13. INITIALIZE ON DOM CONTENT LOADED
   ============================================================================ */

document.addEventListener("DOMContentLoaded", () => {
  // Load products & render shop grid
  renderProducts();

  // Load cart from storage
  loadCart();

  // Update authentication UI
  updateAuthUI();

  // Setup search input
  setupSearch();

  // Setup active collection filter highlights on initial load
  const initialCategory = "All";
  filterByCollection(initialCategory);

  // Close modals when clicking overlay background
  document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        closeAuthModal();
        closeCheckoutModal();
        closeSizingGuideModal();
        closeOrderSuccessModal();
      }
    });
  });

  // Listen for ESC key to close open modals & drawer
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAuthModal();
      closeCheckoutModal();
      closeCartDrawer();
      closeSizingGuideModal();
      closeOrderSuccessModal();
      closeMobileMenu();
    }
  });

  // Expose key helper functions to global window object for inline HTML handlers
  window.filterByCollection = filterByCollection;
  window.selectSize = selectSize;
  window.addToCart = addToCart;
  window.updateCartItemQuantity = updateCartItemQuantity;
  window.removeCartItem = removeCartItem;
  window.openCartDrawer = openCartDrawer;
  window.closeCartDrawer = closeCartDrawer;
  window.openCheckoutModal = openCheckoutModal;
  window.closeCheckoutModal = closeCheckoutModal;
  window.handleCheckoutSubmit = handleCheckoutSubmit;
  window.sendOrderViaWhatsApp = sendOrderViaWhatsApp;
  window.openAuthModal = openAuthModal;
  window.closeAuthModal = closeAuthModal;
  window.switchAuthTab = switchAuthTab;
  window.togglePasswordVisibility = togglePasswordVisibility;
  window.updateStrength = updateStrength;
  window.handleLogin = handleLogin;
  window.handleSignUp = handleSignUp;
  window.handleGoogleAuth = handleGoogleAuth;
  window.logout = logout;
  window.openSizingGuideModal = openSizingGuideModal;
  window.closeSizingGuideModal = closeSizingGuideModal;
  window.closeOrderSuccessModal = closeOrderSuccessModal;
  window.toggleMobileMenu = toggleMobileMenu;
  window.closeMobileMenu = closeMobileMenu;
  window.handleNewsletterSubmit = handleNewsletterSubmit;
  window.resetFilters = resetFilters;
});
