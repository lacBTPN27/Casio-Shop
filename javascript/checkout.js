
document.addEventListener("DOMContentLoaded", async () => {
  const orderContainer = document.querySelector(".don-hang-cua-ban");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (!orderContainer) return; // nothing to do if checkout container missing

  // Nếu giỏ hàng rỗng
  if (cart.length === 0) {
    orderContainer.innerHTML = `
      <p>🛒 Không có sản phẩm nào để thanh toán.</p>
      <button onclick="window.location.href='cart.html'" class="nut-quay-lai">← Quay lại giỏ hàng</button>
    `;
    return;
  }

  // Tính tổng tiền & render sản phẩm
  let tongTien = 0;
  const htmlSanPham = cart
    .map(item => {
      tongTien += Number(item.price || 0) * Number(item.quantity || 1);
      return `
      <div class="san-pham">
        <div class="thong-tin-san-pham">
          <img src="${item.img || ''}" alt="${item.name || ''}">
          <h3>${item.name || ''}</h3>
          <p class="gia">${Number(item.price || 0).toLocaleString("vi-VN")} ₫ × ${item.quantity || 1}</p>
        </div>
      </div>`;
    })
    .join("");

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

  // Helper để lấy user từ sessionStorage hoặc localStorage (nhiều chỗ repo dùng key khác nhau)
  function getCurrentUser() {
    try {
      const maybe = sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser') || localStorage.getItem('user');
      return maybe ? JSON.parse(maybe) : null;
    } catch (e) {
      return null;
    }
  }

  // Nếu user đã đăng nhập -> tự điền dữ liệu
  const currentUser = getCurrentUser();
  if (currentUser) {
    const nameInput = document.querySelector(".thong-tin-khach-hang input[type='text']");
    const phoneInput = document.querySelector(".thong-tin-khach-hang input[type='number']");
    const emailInput = document.querySelector(".thong-tin-khach-hang input[type='email']");
    if (nameInput) nameInput.value = currentUser.name || currentUser.username || currentUser.fullname || '';
    if (phoneInput) phoneInput.value = currentUser.phone || currentUser.sdt || '';
    if (emailInput) emailInput.value = currentUser.email || '';
  }

  // Xử lý nút "Đặt hàng" (chung cho cả trường hợp đã đăng nhập và chưa)
  const datHangBtn = orderContainer.querySelector(".nut-dat-hang");
  if (!datHangBtn) return;

  datHangBtn.addEventListener("click", () => {
    // Lấy dữ liệu khách hàng an toàn (kiểm tra tồn tại input trước)
    const nameInput = document.querySelector('.thong-tin-khach-hang input[type="text"]');
    const phoneInput = document.querySelector('.thong-tin-khach-hang input[type="number"]');
    const emailInput = document.querySelector('.thong-tin-khach-hang input[type="email"]');
    const addressInput = document.querySelector('.dia-chi-giao-hang .cot-dia-chi input[type="text"]') || document.querySelector('.cot-dia-chi input');

    const name = nameInput ? nameInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const address = addressInput ? addressInput.value.trim() : '';

    // Lấy các trường địa chỉ an toàn
    const hangInputs = Array.from(document.querySelectorAll('.hang-dia-chi .cot input[type="text"]'));
    const quanHuyen = hangInputs[0] ? hangInputs[0].value.trim() : '';
    const tinhThanh = hangInputs[1] ? hangInputs[1].value.trim() : '';
    const ghiChuEl = document.querySelector('.dia-chi-giao-hang textarea');
    const ghiChu = ghiChuEl ? ghiChuEl.value.trim() : '';

    // Phương thức thanh toán (lấy value nếu có, fallback sang textContent)
    const thanhToanInput = document.querySelector('input[name="thanhtoan"]:checked');
    let thanhToan = '';
    if (thanhToanInput) {
      thanhToan = thanhToanInput.value || (thanhToanInput.nextSibling && thanhToanInput.nextSibling.textContent.trim()) || '';
    }

    // Kiểm tra dữ liệu bắt buộc
    if (!name || !phone || !email || !address || !quanHuyen || !tinhThanh) {
      alert("⚠️ Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    // Tạo thông tin sản phẩm từ cart
    const sanPham = cart.map(it => ({
      id: it.id,
      ten: it.name,
      gia: it.price,
      soLuong: it.quantity,
      anh: it.img,
    }));

    const orderData = {
      thongTinKhachHang: {
        hoTen: name,
        soDienThoai: phone,
        email,
        diaChi: address,
        quanHuyen,
        tinhThanh,
        ghiChu,
      },
      phuongThucThanhToan: thanhToan,
      sanPham,
      tongTien: tongTien,
      ngayDat: new Date().toLocaleString("vi-VN"),
    };

    // Lưu vào localStorage (cả keys cũ và mới để tương thích)
    try {
      localStorage.setItem("order", JSON.stringify(orderData));
      localStorage.setItem("donHang", JSON.stringify(orderData));
    } catch (e) {
      console.error('Lỗi lưu order vào localStorage', e);
    }

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
document.addEventListener("DOMContentLoaded", () => {
  // Lấy user từ localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  console.log("🔍 Dữ liệu user lấy từ localStorage:", user);

  if (user) {
    // Điền thông tin khách hàng
    const nameInput = document.querySelector(".thong-tin-khach-hang input[type='text']");
    const phoneInput = document.querySelector(".thong-tin-khach-hang input[type='number']");
    const emailInput = document.querySelector(".thong-tin-khach-hang input[type='email']");
    const loginSection = document.querySelector(".dang-nhap-tai-khoan");

    if (nameInput) nameInput.value = user.name || user.fullname || "";
    if (phoneInput) phoneInput.value = user.phone || user.sdt || "";
    if (emailInput) emailInput.value = user.email || "";
    if (loginSection) loginSection.style.display = "none";
  }
});