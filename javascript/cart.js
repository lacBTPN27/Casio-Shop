document.addEventListener("DOMContentLoaded", () => {
  const list = document.querySelector(".danh-sach-san-pham"); 
  const tamTinhEl = document.getElementById("tam-tinh");
  const tongCongEl = document.getElementById("tong-cong"); 
  const cartContainer = document.querySelector(".cart-container"); 
  const thanhToanBtn = document.querySelector(".nut-thanh-toan"); 

  //  Hàm hiển thị giỏ hàng 
  function renderCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    list.innerHTML = "";

    //  Nếu giỏ hàng trống == 0
    if (cart.length === 0) {
      // Ẩn phần chứa giỏ hàng
      cartContainer.style.display = "none";
      // Kiểm tra nếu chưa có thông báo trống thì thêm vào
      // dò tìm trong trang web xem có phần tử nào có class là gio-hang-trong hay không
      // có = SAVE | khong có = NULL
      let emptyDiv = document.querySelector(".gio-hang-trong");
      if (!emptyDiv) {
        emptyDiv = document.createElement("div");
        emptyDiv.classList.add("gio-hang-trong");
        emptyDiv.style.textAlign = "center";
        emptyDiv.style.padding = "40px";
        emptyDiv.innerHTML = `
        // gắn nội dung thông báo giỏ hàng trống
          <p style="font-size:18px;">🛒 Giỏ hàng của bạn đang trống.</p>
          <button onclick="window.location.href='shop.html'"
            style="padding:10px 20px; margin-top:10px; cursor:pointer; border:none; border-radius:6px; background:#00b862; color:#fff;">
            ← Quay lại cửa hàng
          </button>
        `;
        document.body.appendChild(emptyDiv);
      }

      // Đặt lại giá trị tạm tính & tổng cộng
      tamTinhEl.textContent = "0 ₫";
      tongCongEl.textContent = "0 ₫";
      return;
    }

    //  Nếu có sản phẩm trong giỏ 
    // Hiện lại phần giỏ hàng
    cartContainer.style.display = "flex"; 

    // Nếu đang có thông báo "giỏ hàng trống" thì xóa nó
    const emptyMessage = document.querySelector(".gio-hang-trong");
    if (emptyMessage) emptyMessage.remove();

    let tongTien = 0; 

    // Duyệt từng sản phẩm trong giỏ hàng 
    cart.forEach((item, index) => {
      // Tạo thẻ chứa thông tin sản phẩm
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

      //  Xử lý nút cộng 
      div.querySelector(".nut-cong").addEventListener("click", () => {
        item.quantity++; 
        localStorage.setItem("cart", JSON.stringify(cart)); // Cập nhật lại localStorage
        renderCart();
      });

      //  Xử lý nút trừ 
      div.querySelector(".nut-tru").addEventListener("click", () => {
        if (item.quantity > 1) {
          item.quantity--; 
        } else {
          cart.splice(index, 1); // Nếu chỉ còn 1 thì xóa sản phẩm khỏi giỏ
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
      });

      //  Xử lý nút xóa 
      div.querySelector(".delete-btn").addEventListener("click", () => {
        cart.splice(index, 1); 
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
      });

      // Cộng dồn vào tổng tiền
      tongTien += item.price * item.quantity;

      // Thêm sản phẩm vào danh sách hiển thị
      list.appendChild(div);
    });

    //  Cập nhật giá tiền hiển thị 
    tamTinhEl.textContent = tongTien.toLocaleString("vi-VN") + " ₫";
    tongCongEl.textContent = tongTien.toLocaleString("vi-VN") + " ₫";
  }

  //  Xử lý nút thanh toán 
  if (thanhToanBtn) {
    thanhToanBtn.addEventListener("click", () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];

      // Nếu giỏ hàng trống thì thông báo và quay lại trang shop
      if (cart.length === 0) {
        alert("🛒 Giỏ hàng của bạn đang trống, hãy thêm sản phẩm trước khi thanh toán!");
        window.location.href = "shop.html";
        return;
      }

      // Nếu có sản phẩm → chuyển sang trang thanh toán
      window.location.href = "checkout.html";
    });
  }

  //  Gọi hàm hiển thị giỏ hàng khi trang vừa load 
  renderCart();
});
