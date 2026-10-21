/**
 * ============================================================================
 * VELVETSTORE - PRIVATE STORE ADMIN DASHBOARD LOGIC (admin.js)
 * ============================================================================
 * 
 * WELCOME TO THE ADMIN SCRIPT!
 * This script powers the private management dashboard at /admin.html.
 * Here you can:
 * 1. Add, edit, and delete press-on nail products
 * 2. View orders placed by customers from index.html
 * 3. Update order status (Pending, Confirmed, Shipped, Delivered)
 * 4. Message customers on WhatsApp with one click
 * 5. Reset the store products back to original defaults
 * ============================================================================
 */

/* ============================================================================
   1. ADMIN CONFIGURATION (EDIT PASSWORD HERE)
   ============================================================================ */

// Change this secret passcode to whatever you want for your private store admin
const ADMIN_PASSCODE = "admin123";

// Fallback currency (matches script.js)
const CURRENCY = "Rs";

// Default products to restore if resetting
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
   2. ADMIN AUTHENTICATION (PASSCODE GATE)
   ============================================================================ */

function checkAdminAuth() {
  const isAuth = sessionStorage.getItem("velvet_admin_authenticated");
  const loginView = document.getElementById("admin-login-view");
  const dashboardView = document.getElementById("admin-dashboard-view");

  if (isAuth === "true") {
    if (loginView) loginView.classList.add("hidden");
    if (dashboardView) dashboardView.classList.remove("hidden");
    loadDashboardData();
  } else {
    if (loginView) loginView.classList.remove("hidden");
    if (dashboardView) dashboardView.classList.add("hidden");
  }
}

function handleAdminLogin(event) {
  event.preventDefault();
  const input = document.getElementById("admin-passcode-input");
  const errEl = document.getElementById("admin-login-error");

  if (input && input.value === ADMIN_PASSCODE) {
    sessionStorage.setItem("velvet_admin_authenticated", "true");
    if (errEl) errEl.classList.add("hidden");
    input.value = "";
    checkAdminAuth();
  } else {
    if (errEl) {
      errEl.textContent = "Incorrect admin passcode. (Default is: admin123)";
      errEl.classList.remove("hidden");
    }
  }
}

function handleAdminLogout() {
  sessionStorage.removeItem("velvet_admin_authenticated");
  checkAdminAuth();
}


/* ============================================================================
   3. DATA MANAGEMENT (PRODUCTS & ORDERS)
   ============================================================================ */

function getProducts() {
  const saved = localStorage.getItem("velvet_products");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {}
  }
  localStorage.setItem("velvet_products", JSON.stringify(DEFAULT_PRODUCTS));
  return DEFAULT_PRODUCTS;
}

function saveProducts(products) {
  localStorage.setItem("velvet_products", JSON.stringify(products));
  renderAdminProducts();
  updateStats();
}

function getOrders() {
  try {
    return JSON.parse(localStorage.getItem("velvet_orders") || "[]");
  } catch (e) {
    return [];
  }
}

function saveOrders(orders) {
  localStorage.setItem("velvet_orders", JSON.stringify(orders));
  renderAdminOrders();
  updateStats();
}

function formatPrice(amount) {
  return `${CURRENCY} ${Number(amount).toLocaleString()}`;
}


/* ============================================================================
   4. DASHBOARD STATS
   ============================================================================ */

function updateStats() {
  const products = getProducts();
  const orders = getOrders();

  const totalRevenue = orders.reduce((acc, order) => {
    // Only count non-cancelled orders towards revenue
    if (order.status !== "Cancelled") {
      return acc + (order.totalAmount || 0);
    }
    return acc;
  }, 0);

  const statProducts = document.getElementById("stat-products-count");
  const statOrders = document.getElementById("stat-orders-count");
  const statRevenue = document.getElementById("stat-revenue-total");

  if (statProducts) statProducts.textContent = products.length;
  if (statOrders) statOrders.textContent = orders.length;
  if (statRevenue) statRevenue.textContent = formatPrice(totalRevenue);
}

function loadDashboardData() {
  updateStats();
  renderAdminProducts();
  renderAdminOrders();
}


/* ============================================================================
   5. PRODUCTS TABLE RENDERING
   ============================================================================ */

function renderAdminProducts() {
  const tbody = document.getElementById("admin-products-table-body");
  if (!tbody) return;

  const products = getProducts();

  if (products.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="p-8 text-center text-on-surface-variant">
          No products currently saved. Click "+ Add New Product" or "Reset to Default Catalog" to start.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = products.map((product, index) => {
    return `
      <tr class="border-b border-surface-container hover:bg-surface-container-low/50 transition-colors">
        <td class="py-3 px-4 text-xs font-semibold text-on-surface-variant">#${product.id}</td>
        <td class="py-3 px-4">
          <div class="flex items-center gap-3">
            <img 
              src="${product.image}" 
              alt="${product.name}" 
              class="w-12 h-12 rounded-lg object-cover bg-surface-container shadow-xs"
              onerror="this.src='https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=200&q=80'"
            />
            <div>
              <p class="font-serif-headline text-sm font-bold text-on-surface">${product.name}</p>
              <p class="text-[11px] text-on-surface-variant line-clamp-1 max-w-[200px]">${product.description}</p>
            </div>
          </div>
        </td>
        <td class="py-3 px-4">
          <span class="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-surface-container text-primary">
            ${product.category}
          </span>
        </td>
        <td class="py-3 px-4 text-xs text-on-surface-variant font-medium">${product.shape || 'Medium'}</td>
        <td class="py-3 px-4 font-serif-headline text-sm font-bold text-on-surface">${formatPrice(product.price)}</td>
        <td class="py-3 px-4">
          ${product.badge ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-secondary-container text-on-secondary-container">${product.badge}</span>` : '<span class="text-xs text-on-surface-variant/50">—</span>'}
        </td>
        <td class="py-3 px-4 text-right">
          <div class="flex items-center justify-end gap-1.5">
            <button 
              type="button" 
              onclick="openEditProductModal(${product.id})" 
              class="p-1.5 rounded-full hover:bg-surface-container-high text-primary transition-colors cursor-pointer"
              title="Edit Product"
            >
              <span class="material-symbols-outlined text-[18px]">edit</span>
            </button>
            <button 
              type="button" 
              onclick="deleteProduct(${product.id})" 
              class="p-1.5 rounded-full hover:bg-red-50 text-error text-red-600 transition-colors cursor-pointer"
              title="Delete Product"
            >
              <span class="material-symbols-outlined text-[18px]">delete</span>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}


/* ============================================================================
   6. PRODUCT CRUD (ADD, EDIT, DELETE, RESET)
   ============================================================================ */

let editingProductId = null;

function openAddProductModal() {
  editingProductId = null;
  const modal = document.getElementById("product-modal");
  const form = document.getElementById("product-form");
  const title = document.getElementById("product-modal-title");
  
  if (form) form.reset();
  if (title) title.textContent = "Add New Press-On Set";
  
  const imgPreview = document.getElementById("modal-img-preview");
  if (imgPreview) imgPreview.src = "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=400&q=80";

  if (modal) {
    modal.classList.remove("modal-hidden");
    modal.classList.add("modal-visible");
  }
}

function openEditProductModal(id) {
  const products = getProducts();
  const product = products.find(p => p.id === id);
  if (!product) return;

  editingProductId = id;
  const modal = document.getElementById("product-modal");
  const title = document.getElementById("product-modal-title");
  if (title) title.textContent = `Edit Product: ${product.name}`;

  document.getElementById("prod-name").value = product.name;
  document.getElementById("prod-category").value = product.category;
  document.getElementById("prod-price").value = product.price;
  document.getElementById("prod-shape").value = product.shape || "Medium Almond";
  document.getElementById("prod-badge").value = product.badge || "";
  document.getElementById("prod-image").value = product.image;
  document.getElementById("prod-desc").value = product.description;
  document.getElementById("prod-rating").value = product.rating || 5.0;

  const imgPreview = document.getElementById("modal-img-preview");
  if (imgPreview) imgPreview.src = product.image;

  if (modal) {
    modal.classList.remove("modal-hidden");
    modal.classList.add("modal-visible");
  }
}

function closeProductModal() {
  const modal = document.getElementById("product-modal");
  if (modal) {
    modal.classList.remove("modal-visible");
    modal.classList.add("modal-hidden");
  }
  editingProductId = null;
}

function handleProductFormSubmit(e) {
  e.preventDefault();

  const name = document.getElementById("prod-name").value.trim();
  const category = document.getElementById("prod-category").value;
  const price = parseFloat(document.getElementById("prod-price").value) || 0;
  const shape = document.getElementById("prod-shape").value.trim();
  const badge = document.getElementById("prod-badge").value.trim();
  const image = document.getElementById("prod-image").value.trim();
  const description = document.getElementById("prod-desc").value.trim();
  const rating = parseFloat(document.getElementById("prod-rating").value) || 5.0;

  if (!name || !price || !image) {
    alert("Please provide Product Name, Price, and Image URL.");
    return;
  }

  const products = getProducts();

  if (editingProductId) {
    // Update existing
    const idx = products.findIndex(p => p.id === editingProductId);
    if (idx !== -1) {
      products[idx] = {
        ...products[idx],
        name,
        category,
        price,
        shape,
        badge,
        image,
        description,
        rating
      };
    }
  } else {
    // Add new
    const nextId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    products.push({
      id: nextId,
      name,
      category,
      price,
      shape,
      badge,
      image,
      description,
      rating,
      reviewsCount: 1
    });
  }

  saveProducts(products);
  closeProductModal();
}

function deleteProduct(id) {
  if (confirm("Are you sure you want to remove this handcrafted set from the atelier catalog?")) {
    let products = getProducts();
    products = products.filter(p => p.id !== id);
    saveProducts(products);
  }
}

function resetToDefaultCatalog() {
  if (confirm("Reset the atelier catalog to the original default 8 sets? This will overwrite manual changes.")) {
    saveProducts(DEFAULT_PRODUCTS);
  }
}


/* ============================================================================
   7. ORDERS TABLE & STATUS MANAGEMENT
   ============================================================================ */

function renderAdminOrders() {
  const tbody = document.getElementById("admin-orders-table-body");
  if (!tbody) return;

  const orders = getOrders();

  if (orders.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="p-8 text-center text-on-surface-variant">
          No customer orders placed yet. As customers check out on index.html, their orders will appear here automatically.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = orders.map((order, idx) => {
    const formattedDate = order.date ? new Date(order.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }) : "Recent";

    // Item details list
    const itemsHtml = (order.items || []).map(item => `
      <div class="text-[11px] text-on-surface leading-tight">
        • <span class="font-bold">${item.name}</span> (${item.size}) × ${item.quantity}
      </div>
    `).join("");

    // Status styling
    let statusClass = "bg-amber-100 text-amber-800";
    if (order.status === "Confirmed") statusClass = "bg-blue-100 text-blue-800";
    if (order.status === "Shipped") statusClass = "bg-purple-100 text-purple-800";
    if (order.status === "Delivered") statusClass = "bg-green-100 text-green-800";
    if (order.status === "Cancelled") statusClass = "bg-red-100 text-red-800";

    // Clean phone number for WhatsApp message
    const cleanPhone = (order.customer.phone || "").replace(/\D/g, "");

    return `
      <tr class="border-b border-surface-container hover:bg-surface-container-low/50 transition-colors">
        <td class="py-3 px-4">
          <p class="font-serif-headline text-sm font-bold text-primary">#${order.orderId}</p>
          <p class="text-[11px] text-on-surface-variant">${formattedDate}</p>
        </td>
        <td class="py-3 px-4">
          <p class="text-xs font-bold text-on-surface">${order.customer.name}</p>
          <p class="text-[11px] text-on-surface-variant">${order.customer.phone}</p>
          <p class="text-[10px] text-on-surface-variant line-clamp-1 max-w-[180px]">${order.customer.address}</p>
        </td>
        <td class="py-3 px-4">
          <div class="flex flex-col gap-0.5 max-w-[220px]">
            ${itemsHtml}
          </div>
        </td>
        <td class="py-3 px-4 font-serif-headline text-sm font-bold text-on-surface">
          ${formatPrice(order.totalAmount)}
          <span class="block text-[10px] font-normal text-on-surface-variant">${order.paymentMethod || 'COD'}</span>
        </td>
        <td class="py-3 px-4">
          <select 
            onchange="updateOrderStatus('${order.orderId}', this.value)"
            class="text-xs font-semibold rounded-full px-2.5 py-1 border border-outline-variant/40 bg-surface-container cursor-pointer focus:outline-none"
          >
            <option value="Pending" ${order.status === "Pending" ? "selected" : ""}>Pending</option>
            <option value="Confirmed" ${order.status === "Confirmed" ? "selected" : ""}>Confirmed</option>
            <option value="Shipped" ${order.status === "Shipped" ? "selected" : ""}>Shipped</option>
            <option value="Delivered" ${order.status === "Delivered" ? "selected" : ""}>Delivered</option>
            <option value="Cancelled" ${order.status === "Cancelled" ? "selected" : ""}>Cancelled</option>
          </select>
        </td>
        <td class="py-3 px-4 text-right">
          <div class="flex items-center justify-end gap-1.5">
            ${cleanPhone ? `
              <a 
                href="https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hello ${order.customer.name}! Reaching out regarding your VelvetStore order #${order.orderId}.`)}"
                target="_blank"
                class="p-1.5 rounded-full hover:bg-emerald-50 text-emerald-600 transition-colors"
                title="Message customer on WhatsApp"
              >
                <span class="material-symbols-outlined text-[18px]">chat</span>
              </a>
            ` : ''}
            <button 
              type="button" 
              onclick="deleteOrder('${order.orderId}')" 
              class="p-1.5 rounded-full hover:bg-red-50 text-red-600 transition-colors cursor-pointer"
              title="Delete Order"
            >
              <span class="material-symbols-outlined text-[18px]">delete</span>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function updateOrderStatus(orderId, newStatus) {
  const orders = getOrders();
  const order = orders.find(o => o.orderId === orderId);
  if (order) {
    order.status = newStatus;
    saveOrders(orders);
  }
}

function deleteOrder(orderId) {
  if (confirm(`Remove order #${orderId}?`)) {
    let orders = getOrders();
    orders = orders.filter(o => o.orderId !== orderId);
    saveOrders(orders);
  }
}


/* ============================================================================
   8. TAB NAVIGATION (PRODUCTS VS ORDERS)
   ============================================================================ */

function switchAdminTab(tabName) {
  const prodTabBtn = document.getElementById("tab-btn-products");
  const ordTabBtn = document.getElementById("tab-btn-orders");
  const prodSection = document.getElementById("admin-section-products");
  const ordSection = document.getElementById("admin-section-orders");

  if (tabName === "products") {
    if (prodTabBtn) prodTabBtn.className = "px-4 py-2 rounded-full font-semibold text-xs bg-primary text-white shadow-xs cursor-pointer";
    if (ordTabBtn) ordTabBtn.className = "px-4 py-2 rounded-full font-semibold text-xs bg-surface-container text-on-surface-variant hover:text-on-surface cursor-pointer";
    if (prodSection) prodSection.classList.remove("hidden");
    if (ordSection) ordSection.classList.add("hidden");
  } else {
    if (ordTabBtn) ordTabBtn.className = "px-4 py-2 rounded-full font-semibold text-xs bg-primary text-white shadow-xs cursor-pointer";
    if (prodTabBtn) prodTabBtn.className = "px-4 py-2 rounded-full font-semibold text-xs bg-surface-container text-on-surface-variant hover:text-on-surface cursor-pointer";
    if (ordSection) ordSection.classList.remove("hidden");
    if (prodSection) prodSection.classList.add("hidden");
  }
}


/* ============================================================================
   9. INITIALIZE ON DOM LOAD
   ============================================================================ */

document.addEventListener("DOMContentLoaded", () => {
  checkAdminAuth();

  // Expose admin functions to global window for HTML handlers
  window.handleAdminLogin = handleAdminLogin;
  window.handleAdminLogout = handleAdminLogout;
  window.switchAdminTab = switchAdminTab;
  window.openAddProductModal = openAddProductModal;
  window.openEditProductModal = openEditProductModal;
  window.closeProductModal = closeProductModal;
  window.handleProductFormSubmit = handleProductFormSubmit;
  window.deleteProduct = deleteProduct;
  window.resetToDefaultCatalog = resetToDefaultCatalog;
  window.updateOrderStatus = updateOrderStatus;
  window.deleteOrder = deleteOrder;
});
