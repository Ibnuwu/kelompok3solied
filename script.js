// script.js - logika kasir sederhana (versi diperbarui)
const PRODUCTS = [
  { id: "kopi", name: "Kopi", price: 10000, img: "kopi.png" },
  { id: "teh", name: "Teh", price: 8000, img: "teh.png" },
  { id: "gula", name: "Gula", price: 12000, img: "gula.png" },
  { id: "susu", name: "Susu", price: 15000, img: "susu.png" },
  { id: "roti", name: "Roti", price: 7000, img: "roti.png" },
  { id: "mie", name: "Mie Instan", price: 5000, img: "mie.png" },
  { id: "air", name: "Air Mineral", price: 4000, img: "air.png" },
  { id: "telur", name: "Telur", price: 20000, img: "telur.png" },
];

const cart = {}; // id -> {product, qty}

function formatRp(n) {
  return "Rp" + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function renderProducts() {
  const grid = document.getElementById("products-grid");
  grid.innerHTML = "";
  PRODUCTS.forEach((p) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-thumb"><img src="${p.img}" alt="${
      p.name
    }" onerror="this.src='images/${p.id}.png'"></div>
      <div class="product-name">${p.name}</div>
      <div class="product-price">${formatRp(p.price)}</div>
      <button class="add-btn" data-id="${p.id}">Tambah ke Keranjang</button>
    `;
    grid.appendChild(card);
  });

  grid.querySelectorAll(".add-btn").forEach((btn) => {
    btn.addEventListener("click", () => addToCart(btn.dataset.id));
  });
}

function renderCart() {
  const list = document.getElementById("cart-list");
  list.innerHTML = "";
  const ids = Object.keys(cart);
  if (ids.length === 0) {
    list.innerHTML =
      '<p class="empty">Keranjang kosong — tambahkan produk</p>';
  } else {
    ids.forEach((id) => {
      const entry = cart[id];
      const item = document.createElement("div");
      item.className = "cart-item";
      item.innerHTML = `
        <div class="item-info">
          <div class="item-name">${entry.product.name}</div>
          <div class="item-meta">${formatRp(entry.product.price)} x ${
        entry.qty
      } = <strong>${formatRp(entry.product.price * entry.qty)}</strong></div>
        </div>
        <div class="qty-controls">
          <button class="dec" data-id="${id}">-</button>
          <span>${entry.qty}</span>
          <button class="inc" data-id="${id}">+</button>
          <button class="remove" data-id="${id}" title="Hapus" style="margin-left:8px;background:transparent;border:none;cursor:pointer;color:var(--primary)">🗑️</button>
        </div>
      `;
      list.appendChild(item);
    });

    list
      .querySelectorAll(".inc")
      .forEach((b) =>
        b.addEventListener("click", () => changeQty(b.dataset.id, 1))
      );
    list
      .querySelectorAll(".dec")
      .forEach((b) =>
        b.addEventListener("click", () => changeQty(b.dataset.id, -1))
      );
    list
      .querySelectorAll(".remove")
      .forEach((b) =>
        b.addEventListener("click", () => removeItem(b.dataset.id))
      );
  }

  updateTotal();
}

function addToCart(id) {
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) return;
  if (cart[id]) cart[id].qty += 1;
  else cart[id] = { product: product, qty: 1 };
  renderCart();
}

function changeQty(id, delta) {
  if (!cart[id]) return;
  cart[id].qty += delta;
  if (cart[id].qty <= 0) delete cart[id];
  renderCart();
}

function removeItem(id) {
  if (cart[id]) delete cart[id];
  renderCart();
}

function clearCart() {
  for (const k of Object.keys(cart)) delete cart[k];
  renderCart();
}

function getTotal() {
  return Object.values(cart).reduce((s, e) => s + e.product.price * e.qty, 0);
}

function updateTotal() {
  document.getElementById("total-display").textContent = formatRp(getTotal());
}

function showReceipt() {
  const ids = Object.keys(cart);
  if (ids.length === 0) {
    alert("Ehh~ keranjangnya masih kosong nih, senpai~ isi dulu ya~");
    return;
  }
  const body = document.getElementById("receipt-body");
  body.innerHTML = "";
  const now = new Date();
  const t = now.toLocaleString("id-ID");
  const header = document.createElement("div");
  header.innerHTML = `<div style="margin-bottom:8px"><strong>Kasir Sederhana</strong><br><small>${t}</small></div><hr>`;
  body.appendChild(header);
  ids.forEach((id) => {
    const e = cart[id];
    const line = document.createElement("div");
    line.className = "receipt-line";
    line.innerHTML = `<span>${e.product.name} x${e.qty}</span><span>${formatRp(
      e.product.price * e.qty
    )}</span>`;
    body.appendChild(line);
  });
  const totalLine = document.createElement("div");
  totalLine.className = "receipt-line";
  totalLine.style.marginTop = "12px";
  totalLine.innerHTML = `<strong>Total</strong><strong>${formatRp(
    getTotal()
  )}</strong>`;
  body.appendChild(totalLine);

  const modal = document.getElementById("receipt-modal");
  modal.setAttribute("aria-hidden", "false");
}

function closeReceipt() {
  const modal = document.getElementById("receipt-modal");
  modal.setAttribute("aria-hidden", "true");
  // Kosongkan keranjang setelah pembayaran
  clearCart();
  alert("💕 Arigatou nii~ oniichan~!");
}

function init() {
  renderProducts();
  renderCart();

  document.getElementById("clear-btn").addEventListener("click", () => {
    if (confirm("Ehh~ beneran mau dikosongkan semuanya?")) clearCart();
  });

  document.getElementById("pay-btn").addEventListener("click", showReceipt);
  document.getElementById("close-btn").addEventListener("click", closeReceipt);
  document
    .getElementById("close-receipt")
    .addEventListener("click", closeReceipt);
  document.getElementById("print-btn").addEventListener("click", () => {
    window.print();
  });
}

window.addEventListener("DOMContentLoaded", init);
