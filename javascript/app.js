// --- Hàm load file HTML vào phần tử có id tương ứng ---
function loadHTML(id, filePath) {
  fetch(filePath)
    .then(res => {
      if (!res.ok) throw new Error(`Không tìm thấy file: ${filePath}`);
      return res.text();
    })
    .then(html => {
      document.getElementById(id).innerHTML = html;

      // Nếu là header, sau khi load xong thì xử lý menu active
      if (id === 'header') highlightActiveMenu();
    })
    .catch(err => console.error('Lỗi khi load file:', err));
}

// --- Tô sáng menu đang được chọn ---
function highlightActiveMenu() {
  const path = window.location.pathname.split('/').pop(); // lấy tên file hiện tại
  const navLinks = document.querySelectorAll('nav a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.includes(path)) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// --- Khi trang load lần đầu ---
window.addEventListener('DOMContentLoaded', () => {
  // Load header và footer vào các trang
  loadHTML('header', '/HTML/header.html');
  loadHTML('footer', '/HTML/footer.html');
});


  

