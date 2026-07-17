import { PRODUCTS } from "../data/products.js";

const storageKey = "tantrumSportsCart";
    const brands = ["Todas", "Nike", "Adidas", "Puma", "New Balance", "Salomon"];
    const selections = new Map();
    let activeBrand = "all";
    let cart = normalizeCart(parseStorage(storageKey));
    let toastTimer;

    const brandFilters = document.querySelector("#brandFilters");
    const productGrid = document.querySelector("#productGrid");
    const resultCount = document.querySelector("#resultCount");
    const cartCount = document.querySelector("#cartCount");
    const summaryItems = document.querySelector("#summaryItems");
    const summarySubtotal = document.querySelector("#summarySubtotal");
    const summaryShipping = document.querySelector("#summaryShipping");
    const summaryTotal = document.querySelector("#summaryTotal");
    const styleFilter = document.querySelector("#styleFilter");
    const sizeFilter = document.querySelector("#sizeFilter");
    const colorFilter = document.querySelector("#colorFilter");
    const priceFilter = document.querySelector("#priceFilter");
    const priceLabel = document.querySelector("#priceLabel");
    const stockFilter = document.querySelector("#stockFilter");
    const sortSelect = document.querySelector("#sortSelect");
    const searchInput = document.querySelector("#searchInput");
    const clearSearch = document.querySelector("#clearSearch");
    const toast = document.querySelector("#toast");
    const scrollProgress = document.querySelector("#scrollProgress");
    const topButton = document.querySelector("#topButton");
    const productModal = document.querySelector("#productModal");
    const detailClose = document.querySelector("#detailClose");
    const detailImage = document.querySelector("#detailImage");
    const detailBrand = document.querySelector("#detailBrand");
    const detailTitle = document.querySelector("#detailTitle");
    const detailDescription = document.querySelector("#detailDescription");
    const detailPrice = document.querySelector("#detailPrice");
    const detailSizes = document.querySelector("#detailSizes");
    const detailQty = document.querySelector("#detailQty");
    const detailQtyMinus = document.querySelector("#detailQtyMinus");
    const detailQtyPlus = document.querySelector("#detailQtyPlus");
    const detailAdd = document.querySelector("#detailAdd");
    const detailView360 = document.querySelector("#detailView360");
    const detailBack = document.querySelector("#detailBack");
    const cartDrawer = document.querySelector("#cartDrawer");
    const cartClose = document.querySelector("#cartClose");
    const drawerItems = document.querySelector("#drawerItems");
    const drawerCount = document.querySelector("#drawerCount");
    const drawerSubtotal = document.querySelector("#drawerSubtotal");
    const drawerShipping = document.querySelector("#drawerShipping");
    const drawerTotal = document.querySelector("#drawerTotal");
    const drawerCheckout = document.querySelector("#drawerCheckout");
    const drawerContinue = document.querySelector("#drawerContinue");
    const drawerClear = document.querySelector("#drawerClear");
    let activeDetailId = null;

    function normalizeCart(items) {
      if (!Array.isArray(items)) return [];
      return items.map((item) => ({ ...item, qty: Number(item.qty || 1) }));
    }

    function formatEuro(value) {
      const amount = Number(value);
      return `${Number.isFinite(amount) ? amount : 0} EUR`;
    }

    function parseStorage(key) {
      try {
        return JSON.parse(localStorage.getItem(key) || "[]");
      } catch (error) {
        localStorage.removeItem(key);
        return [];
      }
    }

    function saveCart() {
      localStorage.setItem(storageKey, JSON.stringify(cart));
    }

    function refreshCartFromStorage() {
      cart = normalizeCart(parseStorage(storageKey));
      updateSummary();
    }

    function showToast(message) {
      toast.textContent = message;
      toast.classList.add("show");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
    }

    function updateSummary() {
      const units = cart.reduce((sum, item) => sum + item.qty, 0);
      const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
      const shipping = subtotal === 0 || subtotal >= 150 ? 0 : 6;
      cartCount.textContent = units;
      summaryItems.textContent = units;
      summarySubtotal.textContent = formatEuro(subtotal);
      summaryShipping.textContent = formatEuro(shipping);
      summaryTotal.textContent = formatEuro(subtotal + shipping);
      renderCartDrawer(units, subtotal, shipping);
    }

    function renderCartDrawer(units, subtotal, shipping) {
      drawerCount.textContent = `${units} ${units === 1 ? "unidad" : "unidades"}`;
      drawerSubtotal.textContent = formatEuro(subtotal);
      drawerShipping.textContent = formatEuro(shipping);
      drawerTotal.textContent = formatEuro(subtotal + shipping);

      if (cart.length === 0) {
        drawerItems.innerHTML = `
          <div class="cart-empty">
            <div>
              <strong>Tu carrito esta vacio</strong>
              <p>Elige talla y unidades en el catalogo para empezar el pedido.</p>
            </div>
          </div>
        `;
        drawerClear.disabled = true;
        drawerCheckout.disabled = true;
        return;
      }

      drawerClear.disabled = false;
      drawerCheckout.disabled = false;
      drawerItems.innerHTML = cart.map((item, index) => `
        <article class="cart-line">
          <img src="${item.image}" alt="${item.name}" />
          <div>
            <h3>${item.name}</h3>
            <p>${item.brand} - Talla EU ${item.size}</p>
            <p><strong>${formatEuro(item.price)}</strong></p>
            <div class="cart-line-controls">
              <div class="qty" aria-label="Unidades de ${item.name}">
                <button type="button" data-cart-action="minus" data-cart-index="${index}">-</button>
                <span>${item.qty}</span>
                <button type="button" data-cart-action="plus" data-cart-index="${index}">+</button>
              </div>
              <button class="remove-line" type="button" data-cart-action="remove" data-cart-index="${index}">Eliminar</button>
            </div>
          </div>
        </article>
      `).join("");
    }

    function openCartDrawer() {
      updateSummary();
      cartDrawer.hidden = false;
      document.body.style.overflow = "hidden";
    }

    function closeCartDrawer() {
      cartDrawer.hidden = true;
      if (productModal.hidden) document.body.style.overflow = "";
    }

    function updateCartLine(index, action) {
      const item = cart[index];
      if (!item) return;

      if (action === "remove") {
        cart.splice(index, 1);
      }

      if (action === "plus") {
        item.qty = Math.min(item.stock || 12, item.qty + 1);
      }

      if (action === "minus") {
        item.qty -= 1;
        if (item.qty <= 0) cart.splice(index, 1);
      }

      saveCart();
      updateSummary();
    }

    function getSelection(productId) {
      if (!selections.has(productId)) {
        selections.set(productId, { size: null, qty: 1 });
      }

      return selections.get(productId);
    }

    function renderFilters() {
      brandFilters.innerHTML = brands.map((brand) => {
        const value = brand === "Todas" ? "all" : brand;
        return `<button class="filter ${value === activeBrand ? "active" : ""}" type="button" data-brand="${value}">${brand}</button>`;
      }).join("");

      const sizes = [...new Set(PRODUCTS.flatMap((product) => product.sizes))].sort((a, b) => a - b);
      sizeFilter.innerHTML += sizes.map((size) => `<option value="${size}">Talla EU ${size}</option>`).join("");

      const colors = [...new Set(PRODUCTS.map((product) => product.color))].sort();
      colorFilter.innerHTML += colors.map((color) => `<option value="${color}">${color}</option>`).join("");
    }

    function updatePriceLabel() {
      priceLabel.textContent = `Hasta ${priceFilter.value} EUR`;
    }

    function getFilteredProducts() {
      const style = styleFilter.value;
      const size = sizeFilter.value;
      const color = colorFilter.value;
      const maxPrice = Number(priceFilter.value);
      const onlyStock = stockFilter.checked;
      const sort = sortSelect.value;
      const query = searchInput.value.trim().toLowerCase();

      return PRODUCTS.filter((product) => {
        const brandMatch = activeBrand === "all" || product.brand === activeBrand;
        const styleMatch = style === "all" || product.style === style;
        const sizeMatch = size === "all" || product.sizes.includes(Number(size));
        const colorMatch = color === "all" || product.color === color;
        const priceMatch = product.price <= maxPrice;
        const stockMatch = !onlyStock || product.stock > 0;
        const searchable = `${product.name} ${product.brand} ${product.style} ${product.color} ${product.description}`.toLowerCase();
        const searchMatch = query === "" || searchable.includes(query);
        return brandMatch && styleMatch && sizeMatch && colorMatch && priceMatch && stockMatch && searchMatch;
      }).sort((a, b) => {
        if (sort === "priceAsc") return a.price - b.price;
        if (sort === "priceDesc") return b.price - a.price;
        if (sort === "stockDesc") return b.stock - a.stock;
        return PRODUCTS.findIndex((product) => product.id === a.id) - PRODUCTS.findIndex((product) => product.id === b.id);
      });
    }

    function renderProducts() {
      const products = getFilteredProducts();
      const query = searchInput.value.trim();
      resultCount.textContent = query
        ? `${products.length} ${products.length === 1 ? "resultado" : "resultados"} para "${query}"`
        : `${products.length} ${products.length === 1 ? "modelo disponible" : "modelos disponibles"}`;

      if (products.length === 0) {
        productGrid.innerHTML = `<div class="empty-grid">No hay zapatillas para esa busqueda y filtros.</div>`;
        return;
      }

      productGrid.innerHTML = products.map((product) => {
        const selected = getSelection(product.id);
        const lowStock = product.stock <= 5;
        const sizes = product.sizes.map((size) => (
          `<button class="size ${selected.size === size ? "selected" : ""}" type="button" data-id="${product.id}" data-size="${size}">${size}</button>`
        )).join("");

        return `
          <article class="product ${selected.size ? "selected" : ""}" data-id="${product.id}">
            <div class="product-media" data-detail="${product.id}">
              <img src="${product.image}" alt="${product.name}" loading="lazy" />
              <span class="tag">${product.brand}</span>
              ${lowStock ? `<span class="stock-tag">${product.stock} uds.</span>` : ""}
              <button class="view-360" type="button" data-view360="${product.id}">Ver 360</button>
            </div>
            <div class="product-body">
              <div>
                <h3 data-detail="${product.id}">${product.name}</h3>
                <div class="meta"><span>${product.style} - ${product.color} - EU ${product.sizes[0]}-${product.sizes[product.sizes.length - 1]}</span><span class="price">${formatEuro(product.price)}</span></div>
              </div>
              <div class="sizes" aria-label="Tallas disponibles para ${product.name}">${sizes}</div>
              <button class="details-button" type="button" data-detail="${product.id}">Detalles</button>
              <div class="buy-row">
                <div class="qty" aria-label="Unidades para ${product.name}">
                  <button type="button" data-action="minus" data-id="${product.id}">-</button>
                  <span>${selected.qty}</span>
                  <button type="button" data-action="plus" data-id="${product.id}">+</button>
                </div>
                <button class="button add" type="button" data-add="${product.id}">Anadir</button>
              </div>
            </div>
          </article>
        `;
      }).join("");
    }

    function addToCart(productId) {
      const product = PRODUCTS.find((item) => item.id === productId);
      const selected = getSelection(productId);

      if (!selected.size) {
        showToast("Elige una talla antes de anadir el producto.");
        return;
      }

      const existing = cart.find((item) => item.id === productId && item.size === selected.size);
      if (existing) {
        existing.qty = Math.min(product.stock, existing.qty + selected.qty);
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          brand: product.brand,
          price: product.price,
          size: selected.size,
          qty: selected.qty,
          image: product.image,
          stock: product.stock
        });
      }

      saveCart();
      updateSummary();
      showToast(`${product.name} talla ${selected.size} x${selected.qty} anadido al carrito.`);
      openCartDrawer();
    }

    function renderProductDetail() {
      const product = PRODUCTS.find((item) => item.id === activeDetailId);
      if (!product) return;

      const selected = getSelection(product.id);
      detailImage.src = product.image;
      detailImage.alt = product.name;
      detailBrand.textContent = `${product.brand} / ${product.style} / ${product.color}`;
      detailTitle.textContent = product.name;
      detailDescription.textContent = product.description;
      detailPrice.textContent = formatEuro(product.price);
      detailQty.textContent = selected.qty;
      detailSizes.innerHTML = product.sizes.map((size) => (
        `<button class="detail-size ${selected.size === size ? "selected" : ""}" type="button" data-detail-size="${size}">${size}</button>`
      )).join("");
    }

    function openProductDetail(productId) {
      activeDetailId = productId;
      renderProductDetail();
      productModal.hidden = false;
      document.body.style.overflow = "hidden";
    }

    function closeProductDetail() {
      productModal.hidden = true;
      document.body.style.overflow = "";
      activeDetailId = null;
    }

    function updateScrollState() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? (window.scrollY / max) * 100 : 0;
      scrollProgress.style.width = `${progress}%`;
      topButton.classList.toggle("show", window.scrollY > 620);
    }

    renderFilters();
    updatePriceLabel();
    renderProducts();
    updateSummary();
    saveCart();

    brandFilters.addEventListener("click", (event) => {
      const button = event.target.closest("[data-brand]");
      if (!button) return;
      activeBrand = button.dataset.brand;
      document.querySelectorAll(".filter").forEach((filter) => filter.classList.remove("active"));
      button.classList.add("active");
      renderProducts();
    });

    [styleFilter, sizeFilter, colorFilter, sortSelect, stockFilter].forEach((control) => {
      control.addEventListener("change", renderProducts);
    });

    priceFilter.addEventListener("input", () => {
      updatePriceLabel();
      renderProducts();
    });

    searchInput.addEventListener("input", renderProducts);

    clearSearch.addEventListener("click", () => {
      searchInput.value = "";
      searchInput.focus();
      renderProducts();
    });

    productGrid.addEventListener("click", (event) => {
      const sizeButton = event.target.closest("[data-size]");
      const qtyButton = event.target.closest("[data-action]");
      const addButton = event.target.closest("[data-add]");
      const viewButton = event.target.closest("[data-view360]");
      const detailButton = event.target.closest("[data-detail]");

      if (viewButton) {
        const product = PRODUCTS.find((item) => item.id === viewButton.dataset.view360);
        document.dispatchEvent(new CustomEvent("openShoe360", { detail: product }));
        return;
      }

      if (detailButton) {
        openProductDetail(detailButton.dataset.detail);
        return;
      }

      if (sizeButton) {
        const selected = getSelection(sizeButton.dataset.id);
        selected.size = Number(sizeButton.dataset.size);
        renderProducts();
        return;
      }

      if (qtyButton) {
        const product = PRODUCTS.find((item) => item.id === qtyButton.dataset.id);
        const selected = getSelection(product.id);
        selected.qty = qtyButton.dataset.action === "plus"
          ? Math.min(product.stock, selected.qty + 1)
          : Math.max(1, selected.qty - 1);
        renderProducts();
        return;
      }

      if (addButton) {
        addToCart(addButton.dataset.add);
      }
    });

    detailSizes.addEventListener("click", (event) => {
      const sizeButton = event.target.closest("[data-detail-size]");
      if (!sizeButton || !activeDetailId) return;

      const selected = getSelection(activeDetailId);
      selected.size = Number(sizeButton.dataset.detailSize);
      renderProductDetail();
      renderProducts();
    });

    detailQtyMinus.addEventListener("click", () => {
      if (!activeDetailId) return;
      const selected = getSelection(activeDetailId);
      selected.qty = Math.max(1, selected.qty - 1);
      renderProductDetail();
      renderProducts();
    });

    detailQtyPlus.addEventListener("click", () => {
      if (!activeDetailId) return;
      const product = PRODUCTS.find((item) => item.id === activeDetailId);
      const selected = getSelection(activeDetailId);
      selected.qty = Math.min(product.stock, selected.qty + 1);
      renderProductDetail();
      renderProducts();
    });

    detailAdd.addEventListener("click", () => {
      if (!activeDetailId) return;
      addToCart(activeDetailId);
    });

    detailView360.addEventListener("click", () => {
      const product = PRODUCTS.find((item) => item.id === activeDetailId);
      if (!product) return;
      closeProductDetail();
      document.dispatchEvent(new CustomEvent("openShoe360", { detail: product }));
    });

    detailBack.addEventListener("click", closeProductDetail);
    detailClose.addEventListener("click", closeProductDetail);
    productModal.addEventListener("click", (event) => {
      if (event.target === productModal) closeProductDetail();
    });

    document.querySelector("#cartButton").addEventListener("click", openCartDrawer);
    document.querySelector("#checkoutButton").addEventListener("click", openCartDrawer);

    cartClose.addEventListener("click", closeCartDrawer);
    drawerContinue.addEventListener("click", closeCartDrawer);
    cartDrawer.addEventListener("click", (event) => {
      if (event.target === cartDrawer) closeCartDrawer();
    });

    drawerItems.addEventListener("click", (event) => {
      const button = event.target.closest("[data-cart-action]");
      if (!button) return;
      updateCartLine(Number(button.dataset.cartIndex), button.dataset.cartAction);
    });

    drawerClear.addEventListener("click", () => {
      cart = [];
      saveCart();
      updateSummary();
    });

    drawerCheckout.addEventListener("click", () => {
      window.location.href = "carrito.html";
    });

    topButton.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    window.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("focus", refreshCartFromStorage);
    window.addEventListener("storage", (event) => {
      if (event.key === storageKey) refreshCartFromStorage();
    });
    window.addEventListener("message", (event) => {
      if (event.data && event.data.type === "tantrumSportsCartUpdated") refreshCartFromStorage();
    });
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !productModal.hidden) closeProductDetail();
      if (event.key === "Escape" && !cartDrawer.hidden) closeCartDrawer();
    });
    updateScrollState();

