// login.js – Đăng nhập / Đăng ký với JSON Server và role

const form = document.getElementById('authForm');
const toggleBtn = document.getElementById('toggleBtn');
const nameField = document.getElementById('nameField');
const phoneField = document.getElementById('phoneField');
const confirmField = document.getElementById('confirmField');
const submitBtn = document.querySelector('.submit');

let isLoginMode = true;
const API_URL = "http://localhost:3001/Account"; // Địa chỉ JSON Server

// ==============================================
// Chuyển giữa Login / Register
// ==============================================
toggleBtn.addEventListener('click', () => {
  isLoginMode = !isLoginMode;

  nameField.classList.toggle('hidden', isLoginMode);
  phoneField.classList.toggle('hidden', isLoginMode);
  confirmField.classList.toggle('hidden', isLoginMode);

  submitBtn.textContent = isLoginMode ? 'Đăng Nhập' : 'Đăng Ký';
  toggleBtn.textContent = isLoginMode
    ? 'Chưa có tài khoản? Đăng ký ngay'
    : 'Đã có tài khoản? Đăng nhập ngay';
});

// ==============================================
// Xử lý khi submit form
// ==============================================
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const confirmPassword = document.getElementById('confirmPassword')?.value.trim();
  const name = document.getElementById('name')?.value.trim();
  const phone = document.getElementById('phone')?.value.trim();

  if (isLoginMode) {
    // ======== ĐĂNG NHẬP ========
    try {
      const res = await fetch(API_URL);
      const users = await res.json();
      const user = users.find(u => u.email === email && u.password === password);

      if (!user) {
        alert("❌ Email hoặc mật khẩu không đúng!");
        return;
      }

  // Lưu user vào session (ngắn hạn) và localStorage (để các trang khác dễ đọc)
  // Lưu version "safe" (không chứa password) vào localStorage để checkout có thể tự điền
  const safeUser = { ...user };
  delete safeUser.password;
  sessionStorage.setItem('currentUser', JSON.stringify(user));
  try { localStorage.setItem('currentUser', JSON.stringify(safeUser)); } catch (e) { /* ignore */ }

  alert(`✅ Xin chào ${user.name || user.username}!`);

      // Điều hướng dựa vào ROLE
      if (user.role === "admin") {
        window.location.href = "/HTML/products.html";
      } else {
        window.location.href = "/HTML/index.html";
      }

    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      alert("⚠️ Không thể kết nối server!");
    }

  } else {
    // ======== ĐĂNG KÝ ========
    if (!name || !phone || !email || !password || !confirmPassword) {
      alert("⚠️ Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (password !== confirmPassword) {
      alert("❌ Mật khẩu xác nhận không trùng!");
      return;
    }

    try {
      const res = await fetch(API_URL);
      const users = await res.json();

      if (users.some(u => u.email === email)) {
        alert("⚠️ Email đã được đăng ký!");
        return;
      }

      const newUser = {
        username: name,
        phone,
        email,
        password,
        role: "user", // luôn là user khi đăng ký
        createdAt: new Date().toISOString()
      };

      const addRes = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser)
      });

      if (!addRes.ok) throw new Error("Không thể lưu tài khoản!");

      alert("✅ Đăng ký thành công! Vui lòng đăng nhập.");
      toggleBtn.click(); // Quay lại chế độ login

    } catch (err) {
      console.error("Lỗi đăng ký:", err);
      alert("❌ Có lỗi khi đăng ký!");
    }
  }
});

// Kiểm tra user đã đăng nhập chưa
window.addEventListener('load', () => {
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    if (currentUser.role === "admin") {
      window.location.href = "/HTML/products.html";
    } else {
      window.location.href = "/HTML/index.html";
    }
  }
});


