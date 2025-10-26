const detailContainer = document.querySelector('.product_detail');

const getDataProduct = async () => {
  const path = new URLSearchParams(window.location.search);
  const productId = path.get('id');

  const response = await fetch('http://localhost:3001/Product');
  const data = await response.json();

  const findProductId = data.find(
    item => item.id.toString() === productId.toString()
  );

  if (!findProductId) {
    detailContainer.innerHTML = `<p style="color:#ff4d6d">Không tìm thấy sản phẩm!</p>`;
    return;
  }

  detailContainer.innerHTML = `
    <a href="/HTML/shop.html" class="back_button">
        <i class="fa-solid fa-arrow-left"></i> Quay lại cửa hàng
    </a>
    <div class="product">
        <div class="product_image">
            <img src="${findProductId.img}" alt="${findProductId.name}">
        </div>
        <div class="product_infor">
            <div class="product_header">
                <div class="product_brand">
                    <p>${findProductId.brand}</p>
                </div>
                <div class="product_name">
                    <h1>${findProductId.name}</h1>
                </div>
                <div class="product_icons">
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-regular fa-star"></i>
                    <span>4.8 (128 đánh giá)</span>
                </div>
                <div class="product_price">
                    <span class="official_price">${findProductId.price.toLocaleString('vi-VN')}₫</span>
                    <span class="reduced_price">3.500.000₫</span>
                </div>
            </div>

            <div class="product_body">
                <h3>Mô tả sản phẩm</h3>
                <div class="product_desc">
                    <p>${findProductId.description || "Biểu tượng của G-SHOCK với thiết kế vuông cổ điển, bền bỉ vượt thời gian."}</p>
                </div>

                <h4>Tính năng nổi bật</h4>
                <ul class="product_features">
                    <li><i class="fa-solid fa-check"></i><p>Chống sốc</p></li>
                    <li><i class="fa-solid fa-check"></i><p>Chống nước 200m</p></li>
                    <li><i class="fa-solid fa-check"></i><p>Pin 10 năm</p></li>
                </ul>

                <div class="product_technical_specs">
                    <h3>Thông số kỹ thuật</h3>
                    <ul>
                        <li class="spec_item"><span>Bộ máy:</span><span>Quartz</span></li>
                        <li class="spec_item"><span>Kích thước:</span><span>48.5 × 45.4 × 11.8 mm</span></li>
                        <li class="spec_item"><span>Trọng lượng:</span><span>51 g</span></li>
                        <li class="spec_item"><span>Chất liệu:</span><span>Nhựa cao cấp</span></li>
                    </ul>
                </div>

                <div class="cart-quantity">
                    <label>Số lượng</label>
                    <button class="qty-btn minus">-</button>
                    <span class="quantity">1</span>
                    <button class="qty-btn plus">+</button>
                </div>

                <div class="btn_buy">
                    <button><i class="fa-solid fa-cart-shopping"></i> Thêm vào giỏ hàng</button>
                </div>
            </div>
        </div>
    </div>
  `;
};


// Gọi hàm chính
getDataProduct().then(() => {
  // ====== Xử lý tăng giảm số lượng ======
  const minusBtn = document.querySelector('.qty-btn.minus');
  const plusBtn = document.querySelector('.qty-btn.plus');
  const quantityEl = document.querySelector('.quantity');

  let quantity = 1;

  minusBtn.addEventListener('click', () => {
    if (quantity > 1) {
      quantity--;
      quantityEl.textContent = quantity;
    }
  });

  plusBtn.addEventListener('click', () => {
    quantity++;
    quantityEl.textContent = quantity;
  });

  // ====== Xử lý thêm vào giỏ hàng ======
  const addToCartBtn = document.querySelector('.btn_buy button');

  addToCartBtn.addEventListener('click', () => {
    // Lấy thông tin sản phẩm đang xem
    const name = document.querySelector('.product_name h1').textContent;
    const brand = document.querySelector('.product_brand p').textContent;
    const img = document.querySelector('.product_image img').src;
    const priceText = document.querySelector('.official_price').textContent.replace(/[^\d]/g, '');
    const price = Number(priceText);

    // Lấy giỏ hàng từ localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Kiểm tra xem sản phẩm đã có trong giỏ chưa
    const existing = cart.find(item => item.name === name);

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        name,
        brand,
        img,
        price,
        quantity
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`✅ Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
  });
});
