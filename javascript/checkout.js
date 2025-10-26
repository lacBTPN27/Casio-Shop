// LOAD HEADER và FOOTER + XỬ LÝ NÚT ĐĂNG NHẬP, ĐĂNG KÝ, ĐẶT HÀNG
document.addEventListener("DOMContentLoaded", () => {
  // LOAD HEADER & FOOTER 
  // gọi tới file header.html
  fetch("/HTML/header.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("header").innerHTML = data;
    });

  fetch("/HTML/footer.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("footer").innerHTML = data;
    });

  // NÚT ĐĂNG NHẬP
  const btnDangNhap = document.querySelector(".nut-dang-nhap");
  if (btnDangNhap) {
    btnDangNhap.addEventListener("click", () => {
      window.location.href = "/HTML/account.html";
    });
  }

  // NÚT ĐĂNG KÝ
  const btnDangKy = document.querySelector(".nut-dang-ky");
  if (btnDangKy) {
    btnDangKy.addEventListener("click", () => {
      window.location.href = "/HTML/account.html#register";
    });
  }

  // NÚT ĐẶT HÀNG
  const datHangBtn = document.querySelector(".nut-dat-hang");
  if (datHangBtn) {
    datHangBtn.addEventListener("click", () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      if (cart.length === 0) {
        alert("🛒 Giỏ hàng của bạn đang trống!");
        window.location.href = "/HTML/shop.html";
        return;
      }

      alert("✅ Cảm ơn bạn đã đặt hàng! Đơn hàng của bạn đang được xử lý.");
      localStorage.removeItem("cart");
      window.location.href = "/HTML/index.html";
    });
  }
});