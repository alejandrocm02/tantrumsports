const storageKey = "tantrumSportsCart";
    const orderStorageKey = "tantrumSportsOrders";
    const cartItems = document.querySelector("#cartItems");
    const checkoutLayout = document.querySelector("#checkoutLayout");
    const emptyState = document.querySelector("#emptyState");
    const confirmation = document.querySelector("#confirmation");
    const orderHistory = document.querySelector("#orderHistory");
    const historyList = document.querySelector("#historyList");
    const clearHistory = document.querySelector("#clearHistory");
    const itemsCount = document.querySelector("#itemsCount");
    const subtotalEl = document.querySelector("#subtotal");
    const shippingEl = document.querySelector("#shipping");
    const totalEl = document.querySelector("#total");
    const checkoutForm = document.querySelector("#checkoutForm");
    const formError = document.querySelector("#formError");
    const payButton = document.querySelector("#payButton");
    const clearButton = document.querySelector("#clearButton");
    const cardFields = document.querySelector("#cardFields");
    const orderCode = document.querySelector("#orderCode");

    let cart = normalizeCart(parseStorage(storageKey));
    let orders = normalizeOrders(parseStorage(orderStorageKey));

    function normalizeCart(items) {
      if (!Array.isArray(items)) return [];
      return items.map((item) => ({ ...item, qty: Number(item.qty || 1), stock: Number(item.stock || 12) }));
    }

    function normalizeOrders(items) {
      if (!Array.isArray(items)) return [];
      return items
        .filter((item) => item && item.code && Array.isArray(item.items))
        .slice(0, 10);
    }

    function parseStorage(key) {
      try {
        return JSON.parse(localStorage.getItem(key) || "[]");
      } catch (error) {
        localStorage.removeItem(key);
        return [];
      }
    }

    function formatEuro(value) {
      const amount = Number(value);
      return `${Number.isFinite(amount) ? amount : 0} EUR`;
    }

    function escapeHtml(value) {
      return String(value ?? "").replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      })[char]);
    }

    function formatOrderDate(value) {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return "Fecha no disponible";
      return new Intl.DateTimeFormat("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }).format(date);
    }

    function saveCart() {
      localStorage.setItem(storageKey, JSON.stringify(cart));
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage({ type: "tantrumSportsCartUpdated" }, "*");
      }
    }

    function saveOrders() {
      localStorage.setItem(orderStorageKey, JSON.stringify(orders.slice(0, 10)));
    }

    function goShopping() {
      window.location.href = "index.html#catalogo";
    }

    function getTotals() {
      const units = cart.reduce((sum, item) => sum + item.qty, 0);
      const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
      const shipping = subtotal === 0 || subtotal >= 150 ? 0 : 6;
      return { units, subtotal, shipping, total: subtotal + shipping };
    }

    function renderCart() {
      const totals = getTotals();
      const hasItems = cart.length > 0;

      checkoutLayout.hidden = !hasItems;
      emptyState.hidden = hasItems;
      confirmation.hidden = true;
      payButton.disabled = !hasItems;
      clearButton.disabled = !hasItems;

      itemsCount.textContent = totals.units;
      subtotalEl.textContent = formatEuro(totals.subtotal);
      shippingEl.textContent = formatEuro(totals.shipping);
      totalEl.textContent = formatEuro(totals.total);

      cartItems.innerHTML = cart.map((item, index) => `
        <article class="item">
          <img src="${item.image}" alt="${item.name}" />
          <div>
            <h3>${item.name}</h3>
            <p>${item.brand} - Talla EU ${item.size}</p>
            <strong>${formatEuro(item.price)} x ${item.qty}</strong>
          </div>
          <div class="line-actions">
            <div class="qty" aria-label="Unidades para ${item.name}">
              <button type="button" data-action="minus" data-index="${index}">-</button>
              <span>${item.qty}</span>
              <button type="button" data-action="plus" data-index="${index}">+</button>
            </div>
            <button class="icon-button" type="button" data-action="remove" data-index="${index}" aria-label="Eliminar ${item.name}">X</button>
          </div>
        </article>
      `).join("");
    }

    function renderOrderHistory() {
      const hasOrders = orders.length > 0;
      orderHistory.hidden = !hasOrders;
      clearHistory.disabled = !hasOrders;

      if (!hasOrders) {
        historyList.innerHTML = "";
        return;
      }

      historyList.innerHTML = orders.map((order) => {
        const date = formatOrderDate(order.date);
        const units = order.items.reduce((sum, item) => sum + Number(item.qty || 0), 0);
        const total = Number(order.totals?.total || 0);
        const city = escapeHtml(order.customer?.city || "Sin ciudad");
        const items = order.items.map((item) => `
          <li class="order-line">
            <span>${escapeHtml(item.name)} - EU ${escapeHtml(item.size)}</span>
            <strong>${Number(item.qty || 0)} x ${formatEuro(item.price)}</strong>
          </li>
        `).join("");

        return `
          <article class="order-card">
            <div class="order-head">
              <strong>${escapeHtml(order.code)}</strong>
              <span class="status-pill">${escapeHtml(order.status || "Preparando pedido")}</span>
            </div>
            <div class="order-meta">
              <span>${date} - ${city}</span>
              <strong>${units} uds. - ${formatEuro(total)}</strong>
            </div>
            <ul class="order-items">${items}</ul>
          </article>
        `;
      }).join("");
    }

    function createOrder() {
      const totals = getTotals();
      const code = `TS-${Date.now().toString().slice(-6)}`;
      const order = {
        code,
        date: new Date().toISOString(),
        status: "Preparando pedido",
        customer: {
          firstName: document.querySelector("#firstName").value.trim(),
          lastName: document.querySelector("#lastName").value.trim(),
          email: document.querySelector("#email").value.trim(),
          city: document.querySelector("#city").value.trim(),
          postalCode: document.querySelector("#postalCode").value.trim()
        },
        payment: document.querySelector("input[name='payment']:checked").value,
        items: cart.map((item) => ({ ...item })),
        totals
      };

      orders = normalizeOrders([order, ...orders]);
      saveOrders();
      return order;
    }

    function updateCartItem(index, action) {
      const item = cart[index];
      if (!item) return;

      if (action === "remove") {
        cart.splice(index, 1);
      }

      if (action === "plus") {
        item.qty = Math.min(item.stock, item.qty + 1);
      }

      if (action === "minus") {
        item.qty -= 1;
        if (item.qty <= 0) cart.splice(index, 1);
      }

      saveCart();
      renderCart();
    }

    function validateCheckout() {
      if (cart.length === 0) return "Tu carrito esta vacio.";

      const requiredFields = ["firstName", "lastName", "email", "phone", "address", "city", "postalCode"];
      for (const id of requiredFields) {
        const input = document.querySelector(`#${id}`);
        if (!input.value.trim()) {
          input.focus();
          return "Completa todos los campos de envio obligatorios.";
        }
      }

      const email = document.querySelector("#email").value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        document.querySelector("#email").focus();
        return "Introduce un email valido.";
      }

      const payment = document.querySelector("input[name='payment']:checked").value;
      if (payment === "card") {
        const cardNumber = document.querySelector("#cardNumber").value.replace(/\s/g, "");
        const cardExpiry = document.querySelector("#cardExpiry").value.trim();
        if (!/^\d{12,19}$/.test(cardNumber) || !/^\d{2}\/\d{2}$/.test(cardExpiry)) {
          document.querySelector("#cardNumber").focus();
          return "Introduce una tarjeta simulada valida y caducidad MM/AA.";
        }
      }

      return "";
    }

    cartItems.addEventListener("click", (event) => {
      const button = event.target.closest("[data-action]");
      if (!button) return;
      updateCartItem(Number(button.dataset.index), button.dataset.action);
    });

    clearButton.addEventListener("click", () => {
      cart = [];
      saveCart();
      renderCart();
    });

    clearHistory.addEventListener("click", () => {
      orders = [];
      saveOrders();
      renderOrderHistory();
    });

    checkoutForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const error = validateCheckout();
      formError.textContent = error;
      if (error) return;

      const order = createOrder();
      orderCode.textContent = order.code;
      cart = [];
      saveCart();
      renderOrderHistory();
      checkoutLayout.hidden = true;
      emptyState.hidden = true;
      confirmation.hidden = false;
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    document.querySelectorAll("input[name='payment']").forEach((input) => {
      input.addEventListener("change", () => {
        cardFields.hidden = input.value !== "card" || !input.checked;
      });
    });

    document.querySelector("#continueButton").addEventListener("click", goShopping);
    document.querySelector("#continueTop").addEventListener("click", goShopping);
    document.querySelector("#emptyContinue").addEventListener("click", goShopping);
    document.querySelector("#newOrder").addEventListener("click", goShopping);

    saveCart();
    renderCart();
    renderOrderHistory();

