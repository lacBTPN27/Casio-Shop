document.addEventListener("DOMContentLoaded", async () => {
  const orderContainer = document.querySelector(".don-hang-cua-ban");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Nếu giỏ hàng rỗng
  if (cart.length === 0) {
    orderContainer.innerHTML = `
      <p>🛒 Không có sản phẩm nào để thanh toán.</p>
      <button onclick="window.location.href='cart.html'" class="nut-quay-lai">← Quay lại giỏ hàng</button>
    `;
    return;
  }

  // Tính tổng tiền
  let tongTien = 0;
  let htmlSanPham = "";

  cart.forEach((item) => {
    tongTien += item.price * item.quantity;
    htmlSanPham += `
      <div class="san-pham">
        <div class="thong-tin-san-pham">
          <img src="${item.img}" alt="${item.name}">
          <h3>${item.name}</h3>
          <p class="gia">${Number(item.price).toLocaleString("vi-VN")} ₫ × ${item.quantity}</p>
        </div>
      </div>
    `;
  });

  // Cập nhật giao diện Checkout
  orderContainer.innerHTML = `
    <h2>Đơn hàng của bạn</h2>
    ${htmlSanPham}
    <div class="phi-van-chuyen">
      <p>Phí vận chuyển:</p>
      <p>Miễn phí</p>
    </div>
    <div class="tong-cong">
      <p><strong>Tổng cộng:</strong></p>
      <p class="gia-tong"><strong>${tongTien.toLocaleString("vi-VN")} ₫</strong></p>
    </div>
    <button class="nut-dat-hang">Đặt hàng</button>
  `;

  // ==========================
  // ✅ Nếu user đã đăng nhập -> tự điền dữ liệu từ localStorage
  // ==========================
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    console.log("Tự điền thông tin người dùng:", user);

    document.querySelector(".thong-tin-khach-hang input[type='text']").value = user.name || "";
    document.querySelector(".thong-tin-khach-hang input[type='number']").value = user.phone || "";
    document.querySelector(".thong-tin-khach-hang input[type='email']").value = user.email || "";
  }

  // ==========================
  // ✅ Xử lý nút "Đặt hàng"
  // ==========================
  const datHangBtn = orderContainer.querySelector(".nut-dat-hang");
  datHangBtn.addEventListener("click", () => {
    const name = document.querySelector(".thong-tin-khach-hang input[type='text']").value;
    const phone = document.querySelector(".thong-tin-khach-hang input[type='number']").value;
    const email = document.querySelector(".thong-tin-khach-hang input[type='email']").value;
    const address = document.querySelector(".cot-dia-chi input").value;

    if (!name || !phone || !email || !address) {
      alert("⚠️ Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const orderData = {
      name,
      phone,
      email,
      address,
      cart,
      total: tongTien,
      date: new Date().toLocaleString("vi-VN"),
    };

    // Lưu tạm đơn hàng vào localStorage
    localStorage.setItem("order", JSON.stringify(orderData));

    alert("🎉 Đặt hàng thành công!");
    localStorage.removeItem("cart");
    window.location.href = "shop.html";
  });
});

// ==========================
// ✅ Xử lý nút "Đăng nhập để tiếp tục"
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  const loginButton = document.querySelector(".nut-dang-nhap");
  if (loginButton) {
    loginButton.addEventListener("click", () => {
      // ✅ Ghi nhớ rằng người dùng đến login từ checkout
      sessionStorage.setItem("redirectAfterLogin", "checkout");
      window.location.href = "/HTML/account.html"; 
    });
  }
});



// ========================== Lưu dữ liệu khi ko đăng nhập mà muốn đtặ hàng
document.addEventListener("DOMContentLoaded", () => {
  const btnDatHang = document.querySelector(".nut-dat-hang");

  btnDatHang.addEventListener("click", () => {
    // --- Lấy dữ liệu khách hàng ---
    const hoTen = document.querySelector('.thong-tin-khach-hang input[type="text"]').value.trim();
    const soDienThoai = document.querySelector('.thong-tin-khach-hang input[type="number"]').value.trim();
    const email = document.querySelector('.thong-tin-khach-hang input[type="email"]').value.trim();

    // --- Lấy dữ liệu địa chỉ ---
    const diaChi = document.querySelector('.dia-chi-giao-hang .cot-dia-chi input[type="text"]').value.trim();
    const quanHuyen = document.querySelectorAll('.hang-dia-chi .cot input[type="text"]')[0].value.trim();
    const tinhThanh = document.querySelectorAll('.hang-dia-chi .cot input[type="text"]')[1].value.trim();
    const ghiChu = document.querySelector('.dia-chi-giao-hang textarea').value.trim();

    // --- Lấy phương thức thanh toán ---
    const thanhToan = document.querySelector('input[name="thanhtoan"]:checked').nextSibling.textContent.trim();

    // --- Lấy thông tin sản phẩm (tạm thời demo từ HTML, sau này có thể lấy từ cart) ---
    const sanPham = {
      ten: document.querySelector('.thong-tin-san-pham h3').textContent,
      gia: document.querySelector('.thong-tin-san-pham .gia').textContent,
      anh: document.querySelector('.thong-tin-san-pham img').src,
    };

    // --- Gom dữ liệu thành object ---
    const donHang = {
      thongTinKhachHang: {
        hoTen,
        soDienThoai,
        email,
        diaChi,
        quanHuyen,
        tinhThanh,
        ghiChu,
      },
      phuongThucThanhToan: thanhToan,
      sanPham,
      ngayDat: new Date().toLocaleString(),
    };

    // --- Kiểm tra dữ liệu bắt buộc ---
    if (!hoTen || !soDienThoai || !email || !diaChi || !quanHuyen || !tinhThanh) {
      alert("⚠️ Vui lòng nhập đầy đủ thông tin bắt buộc!");
      return;
    }

    // --- Lưu vào localStorage ---
    localStorage.setItem("donHang", JSON.stringify(donHang));
  });
});


// khi đăng nhập thì dữ liệu tự tự động điền vào "họ tên, số điện thoại, email" từ account với các tài khoản đã tạo ở db.son