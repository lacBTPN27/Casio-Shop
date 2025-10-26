document.addEventListener("DOMContentLoaded", () => {
  const list = document.querySelector(".danh-sach-san-pham");
  const tamTinhEl = document.getElementById("tam-tinh");
  const tongCongEl = document.getElementById("tong-cong");
  const cartContainer = document.querySelector(".cart-container"); // 👉 thêm dòng này

  function renderCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    list.innerHTML = "";

    // === Nếu giỏ hàng trống ===
    if (cart.length === 0) {
      // Ẩn phần cart-container
      cartContainer.style.display = "none";

      // Hiện thông báo trống
      const emptyDiv = document.createElement("div");
      emptyDiv.classList.add("gio-hang-trong");
      emptyDiv.style.textAlign = "center";
      emptyDiv.style.padding = "40px";
      emptyDiv.innerHTML = `
        <p style="font-size:18px;">🛒 Giỏ hàng của bạn đang trống.</p>
        <button onclick="window.location.href='shop.html'"
          style="padding:10px 20px; margin-top:10px; cursor:pointer; border:none; border-radius:6px; background:#00b862; color:#fff;">
          ← Quay lại cửa hàng
        </button>
      `;
      document.body.appendChild(emptyDiv);

      tamTinhEl.textContent = "0 ₫";
      tongCongEl.textContent = "0 ₫";
      return;
    }

    // === Nếu có sản phẩm ===
    cartContainer.style.display = "flex"; // 👉 hiện lại container
    const emptyMessage = document.querySelector(".gio-hang-trong");
    if (emptyMessage) emptyMessage.remove(); // Xóa phần thông báo trống nếu có

    let tongTien = 0;

    cart.forEach((item, index) => {
      const div = document.createElement("div");
      div.classList.add("san-pham");
      div.innerHTML = `
        <img src="${item.img}" alt="${item.name}">
        <div class="thong-tin-san-pham">
          <h3>${item.name}</h3>
          <p class="gia">${Number(item.price).toLocaleString("vi-VN")} ₫</p>
          <div class="so-luong">
            <button class="nut-tru">-</button>
            <span class="so-luong-hien-tai">${item.quantity}</span>
            <button class="nut-cong">+</button>
          </div>
        </div>
        <div class="hanh-dong-san-pham">
          <div class="tong-phu">
            <b>Tổng phụ</b>
            <p><span>${(item.price * item.quantity).toLocaleString("vi-VN")} ₫</span></p>
            <button class="delete-btn">🗑️ Xóa</button>
          </div>
        </div>
      `;

      // Nút cộng
      div.querySelector(".nut-cong").addEventListener("click", () => {
        item.quantity++;
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
      });

      // Nút trừ
      div.querySelector(".nut-tru").addEventListener("click", () => {
        if (item.quantity > 1) {
          item.quantity--;
        } else {
          cart.splice(index, 1);
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
      });

      // Nút xóa
      div.querySelector(".delete-btn").addEventListener("click", () => {
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
      });

      tongTien += item.price * item.quantity;
      list.appendChild(div);
    });

    tamTinhEl.textContent = tongTien.toLocaleString("vi-VN") + " ₫";
    tongCongEl.textContent = tongTien.toLocaleString("vi-VN") + " ₫";
  }

  renderCart();
});
// ==========================
// 🧾 NÚT THANH TOÁN
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  const thanhToanBtn = document.querySelector(".nut-thanh-toan");

  if (thanhToanBtn) {
    thanhToanBtn.addEventListener("click", () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];

      if (cart.length === 0) {
        alert("🛒 Giỏ hàng của bạn đang trống, hãy thêm sản phẩm trước khi thanh toán!");
        window.location.href = "shop.html";
        return;
      }

      // Giữ nguyên dữ liệu trong localStorage (cart)
      // và chuyển đến trang checkout
      window.location.href = "checkout.html";
    });
  }
});
