function initializeShopPage() {
  console.log(" Shop Page Initialized");

  let products = [];

  // ======= FETCH DỮ LIỆU =======
  fetch('/db.json')
    .then(response => response.json())
    .then(data => {
      products = data.Product;
      initializeDefaultButton();
      attachButtonEvents();
      showProductByBrand('Tất cả');
    });

  // ======= GẮN SỰ KIỆN NÚT DANH MỤC =======
  function attachButtonEvents() {
    const items = document.querySelectorAll('.filed_type .type button');
    if (!items || items.length === 0) {
      console.warn("Không tìm thấy nút danh mục trong shop.html");
      return;
    }

    items.forEach(item => {
      item.addEventListener('click', () => {
        handleButtonClick(item, items);
        const brand = item.textContent.trim();
        showProductByBrand(brand);
      });
    });
  }

  // ======= XỬ LÝ ACTIVE NÚT DANH MỤC =======
  function handleButtonClick(selectedButton, allButtons) {
    allButtons.forEach(btn => btn.classList.remove('active'));
    selectedButton.classList.add('active');
  }

  // ======= HIỂN THỊ SẢN PHẨM THEO THƯƠNG HIỆU =======
  function showProductByBrand(brand) {
    const listProductHTML = document.querySelector('.products');
    const total = document.querySelector('.sum_product');
    if (!listProductHTML) return;

    listProductHTML.innerHTML = '';

    let filtered = (brand === 'Tất cả')
      ? products
      : products.filter(product => product.brand.toLowerCase() === brand.toLowerCase());

    if (filtered.length === 0) {
      listProductHTML.innerHTML = `<p>Sản phẩm hiệu ${brand} đã hết hàng</p>`;
    } else {
      filtered.forEach(product => {
        const productCard = createProductCard(product);
        listProductHTML.appendChild(productCard);
      });
    }

    updateTotalProducts(listProductHTML, total);
  }

  // ======= HIỂN THỊ SẢN PHẨM THEO TỪ KHÓA TÌM KIẾM =======
  function showProductByQuery(query) {
    const listProductHTML = document.querySelector('.products');
    const total = document.querySelector('.sum_product');
    if (!listProductHTML) return;

    const q = (query || '').trim().toLowerCase();
    let filtered = products.filter(p => {
      return (
        p.name && p.name.toLowerCase().includes(q) ||
        p.brand && p.brand.toLowerCase().includes(q)
      );
    });

    listProductHTML.innerHTML = '';
    if (!q) {
      // empty query: show all
      filtered = products;
    }

    if (filtered.length === 0) {
      listProductHTML.innerHTML = `<p>Không tìm thấy sản phẩm phù hợp với "${query}"</p>`;
    } else {
      filtered.forEach(product => {
        const productCard = createProductCard(product);
        listProductHTML.appendChild(productCard);
      });
    }

    updateTotalProducts(listProductHTML, total);
  }

  // ======= TẠO THẺ SẢN PHẨM =======
  function createProductCard(product) {
    const card = document.createElement('div');
    card.classList.add('product_card');

    card.innerHTML = `
      <a href="/HTML/product_detail.html?id=${product.id}">
        <div class="image_card">
          <img src="${product.img}" alt="${product.name}">
        </div>
        <div class="product_infor">
          <p>${product.brand}</p>
          <h3>${product.name}</h3>
          <div class="icon_card">
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-regular fa-star"></i>
          </div>
          <div class="price_card">
            <span class="official_price">${product.price}</span>
          </div>
        </div>
      </a>
      <button class="add-cart-btn">
        <i class="fa-solid fa-cart-shopping"></i> Thêm vào giỏ hàng
      </button>
    `;

    // 🛒 Sự kiện "Thêm vào giỏ hàng"
    card.querySelector('.add-cart-btn').addEventListener('click', (e) => {
      e.preventDefault(); // tránh click dính link
      addToCart(product);
    });

    return card;
  }

  // ======= CẬP NHẬT SỐ LƯỢNG SẢN PHẨM =======
  function updateTotalProducts(listElement, totalElement) {
    if (!totalElement) return;
    const totalProducts = listElement.childElementCount;
    totalElement.innerHTML = `<p>Hiển thị ${totalProducts} sản phẩm</p>`;
  }

  // ======= NÚT "Tất cả" ACTIVE KHI VỪA LOAD =======
  function initializeDefaultButton() {
    const defaultBtn = document.querySelector('.filed_type .type .default');
    if (defaultBtn) defaultBtn.classList.add('active');
  }

  // Apply search query from URL or sessionStorage on load
  const params = new URLSearchParams(window.location.search);
  const qParam = params.get('q') || sessionStorage.getItem('searchQuery') || '';
  if (qParam) {
    // when there's a search query, show by query instead of brand
    showProductByQuery(qParam);
  }

  // Listen for search updates dispatched by header when already on shop page
  window.addEventListener('search-updated', (e) => {
    const q = e.detail || '';
    showProductByQuery(q);
  });
}

// ===============================
// 🛒 THÊM GIỎ HÀNG (localStorage)
// ===============================
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingItem = cart.find(item => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      img: product.img,
      price: convertPriceToNumber(product.price),
      quantity: 1
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  showToast(`✅ Đã thêm "${product.name}" vào giỏ hàng!`);
}

// ===============================
// 🔔 TOAST THÔNG BÁO
// ===============================
function showToast(message) {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.position = 'fixed';
  toast.style.bottom = '24px';
  toast.style.right = '24px';
  toast.style.background = 'linear-gradient(90deg, #007bff, #00bfff)';
  toast.style.color = '#fff';
  toast.style.padding = '14px 26px';
  toast.style.borderRadius = '10px';
  toast.style.boxShadow = '0 0 12px rgba(0,140,255,0.7)';
  toast.style.fontWeight = '600';
  toast.style.fontSize = '15px';
  toast.style.zIndex = '9999';
  toast.style.opacity = '0';
  toast.style.transition = 'opacity 0.3s ease';
  document.body.appendChild(toast);

  setTimeout(() => (toast.style.opacity = '1'), 50);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 500);
  }, 2000);
}

// ===============================
// 🔢 CHUYỂN GIÁ "6.197.500₫" → SỐ
// ===============================
function convertPriceToNumber(priceStr) {
  return Number(priceStr.replace(/[^\d]/g, "")) || 0;
}

// ===============================
// 🚀 KHỞI TẠO TRANG SHOP
// ===============================
document.addEventListener('DOMContentLoaded', initializeShopPage);
