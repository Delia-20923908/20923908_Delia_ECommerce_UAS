// Data produk untuk demo harga sesuai produk yang ada
const productsData = {
  cheesecake: { name: "Cheesecake", price: 150000 },
  fudgy_brownies: { name: "Fudgy Brownies", price: 25000 },
  soft_cookies: { name: "Soft Cookies", price: 8000 },
  hampers: { name: "Hampers Tahunan Kue Kering", price: 150000 },
  macaron: { name: "Macaron", price: 120000 },
  red_velvet_slice: { name: "Red Velvet Slice", price: 35000 },
  cupcake: { name: "Cupcake", price: 6000 },
  iced_coffee_latte: { name: "Iced Coffee Latte", price: 30000 },
  matcha_latte: { name: "Matcha Latte", price: 35000 }
};

// Membaca cart dari localStorage (jika ada)
function getCart() {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : {};
}

// Menyimpan cart ke localStorage
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Fungsi tambah produk ke cart dengan key ID produk
function addToCart(productId) {
  const cart = getCart();
  if (cart[productId]) {
    cart[productId].quantity++;
  } else {
    cart[productId] = {
      ...productsData[productId],
      quantity: 1
    };
  }
  saveCart(cart);
  alert(productsData[productId].name + " telah ditambahkan ke keranjang!");
}

// Fungsi hapus produk dari keranjang
function removeFromCart(productId) {
  const cart = getCart();
  if (cart[productId]) {
    delete cart[productId];
    saveCart(cart);
    renderCart();
  }
}

// Fungsi render isi keranjang pada halaman cart.html
function renderCart() {
  const cart = getCart();
  const cartItemsContainer = document.getElementById('cart-items');
  const totalPriceEl = document.getElementById('total-price');

  if (!cartItemsContainer || !totalPriceEl) return;

  cartItemsContainer.innerHTML = '';
  let totalPrice = 0;
  let index = 1;

  for (const key in cart) {
    const item = cart[key];
    const subtotal = item.price * item.quantity;
    totalPrice += subtotal;

    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${index}</td>
      <td>${item.name}</td>
      <td>
        <input type="number" min="1" value="${item.quantity}" onchange="updateQuantity('${key}', this.value)" style="width: 60px; text-align: center;" />
      </td>
      <td>Rp ${item.price.toLocaleString()}</td>
      <td>Rp ${subtotal.toLocaleString()}</td>
      <td><button onclick="removeFromCart('${key}')" class="bubble back-btn">Hapus</button></td>
    `;
    cartItemsContainer.appendChild(tr);
    index++;
  }
  totalPriceEl.innerText = 'Rp ' + totalPrice.toLocaleString();
}

// Fungsi update jumlah kuantitas produk dalam keranjang
function updateQuantity(productId, quantity) {
  const cart = getCart();
  quantity = parseInt(quantity);
  if (quantity <= 0 || isNaN(quantity)) quantity = 1;
  if (cart[productId]) {
    cart[productId].quantity = quantity;
    saveCart(cart);
    renderCart();
  }
}

// Fungsi proses checkout (pindah ke halaman checkout dengan data)
function prosesCheckout() {
  const cart = getCart();
  if (Object.keys(cart).length === 0) {
    alert('Keranjang kosong!');
    return;
  }
  // Simpan sementara cart ke localStorage khusus checkout
  localStorage.setItem('checkoutCart', JSON.stringify(cart));
  location.href = 'checkout.html';
}

// Fungsi render data checkout pada checkout.html
function renderCheckout() {
  const checkoutItemsContainer = document.getElementById('checkout-items');
  const totalAllEl = document.getElementById('total-all');
  if (!checkoutItemsContainer || !totalAllEl) return;

  const cart = localStorage.getItem('checkoutCart');
  if (!cart) {
    checkoutItemsContainer.innerHTML = '<tr><td colspan="6" style="text-align:center;">Tidak ada data checkout</td></tr>';
    totalAllEl.innerText = 'Rp 0';
    return;
  }

  const cartObj = JSON.parse(cart);
  checkoutItemsContainer.innerHTML = '';
  let totalAll = 0;
  let index = 1;

  const ongkirPerItem = 10000; // Ongkir per produk, bisa disesuaikan

  for (const key in cartObj) {
    const item = cartObj[key];
    const subtotal = item.price * item.quantity;
    const ongkir = ongkirPerItem * item.quantity;
    const total = subtotal + ongkir;
    totalAll += total;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${index}</td>
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>Rp ${item.price.toLocaleString()}</td>
      <td>Rp ${ongkir.toLocaleString()}</td>
      <td>Rp ${total.toLocaleString()}</td>
    `;
    checkoutItemsContainer.appendChild(tr);
    index++;
  }

  totalAllEl.innerText = 'Rp ' + totalAll.toLocaleString();
}

// Fungsi simulasikan checkout selesai
function selesaiCheckout() {
  const paymentMethod = document.getElementById('payment-method').value;
  alert(`Terima kasih telah berbelanja! Metode pembayaran: ${paymentMethod.toUpperCase()}`);
  // Hapus data keranjang checkout dan keranjang umum
  localStorage.removeItem('checkoutCart');
  localStorage.removeItem('cart');
  location.href = 'index.html';
}

// Render cart otomatis jika halaman cart.html
if (document.body.contains(document.getElementById('cart-items'))) {
  renderCart();
}

// Render checkout otomatis jika halaman checkout.html
if (document.body.contains(document.getElementById('checkout-items'))) {
  renderCheckout();
}