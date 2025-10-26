/**
 * Hàm khởi tạo form liên hệ — được gọi sau khi contact.html được load vào DOM
 */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) {
    console.warn("⚠️ contactForm không tồn tại trong DOM — bỏ qua gắn sự kiện.");
    return;
  }

  // Gắn sự kiện submit cho form
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Lấy dữ liệu người dùng nhập
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    // Kiểm tra dữ liệu đầu vào
    if (!name || !email || !message) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    // Tạo đối tượng dữ liệu
    const contactData = {
      name: name,
      email: email,
      message: message,
      time: new Date().toLocaleString()
    };

    // Lấy danh sách liên hệ đã lưu (nếu có)
    let contacts = JSON.parse(localStorage.getItem("contacts")) || [];

    // Thêm dữ liệu mới vào mảng
    contacts.push(contactData);

    // Lưu lại vào localStorage
    localStorage.setItem("contacts", JSON.stringify(contacts));

    // Thông báo thành công
    alert("✅ Đã lưu thông tin liên hệ của bạn!");

    // Reset form sau khi gửi
    form.reset();

    console.log("📩 Dữ liệu đã lưu:", contacts);
  });

  console.log("✅ Contact form đã được khởi tạo thành công!");
}

/**
 * Nếu trang contact được mở trực tiếp, gọi initContactForm() sau khi DOM load
 */
document.addEventListener("DOMContentLoaded", () => {
  initContactForm();
});


