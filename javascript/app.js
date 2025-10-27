// --- Hàm load file HTML vào phần tử có id tương ứng ---
function loadHTML(id, filePath) {
  return fetch(filePath)
    .then(res => {
      if (!res.ok) throw new Error(`Không tìm thấy file: ${filePath}`);
      return res.text();
    })
    .then(html => {
      document.getElementById(id).innerHTML = html;

      // Nếu là header, sau khi load xong thì xử lý menu active
      if (id === 'header') highlightActiveMenu();
      return html;
    })
    .catch(err => {
      console.error('Lỗi khi load file:', err);
      throw err;
    });
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
  loadHTML('header', '/HTML/header.html')
    .then(() => {
      // Sau khi header đã load xong, cấu hình menu người dùng
      if (typeof setupUserMenu === 'function') setupUserMenu();
      // Attach search box handler (after header is loaded)
      if (typeof attachHeaderSearch === 'function') attachHeaderSearch();
    })
    .catch(() => {});

  loadHTML('footer', '/HTML/footer.html');
});

// --- Hiển thị tên người dùng và nút đăng xuất trong header ---
function setupUserMenu() {
  try {
    const userActions = document.getElementById('user-actions');
    // read currentUser from sessionStorage or localStorage for cross-page compatibility
    function getCurrentUser() {
      try {
        const maybe = sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser') || localStorage.getItem('user');
        return maybe ? JSON.parse(maybe) : null;
      } catch (e) {
        return null;
      }
    }

    const currentUser = getCurrentUser();

    if (!userActions) return;

    if (currentUser) {
      const name = currentUser.name || currentUser.username || currentUser.email || 'Người dùng';
      userActions.innerHTML = `
        <span class="user-name"> ${escapeHtml(name)}</span>
        <button id="logoutBtn" class="btn-logout">Đăng xuất</button>
      `;

      const btn = document.getElementById('logoutBtn');
      if (btn) btn.addEventListener('click', () => logout());

      // Show account-page logout button if present
      const accLogout = document.getElementById('logoutAccountBtn');
      if (accLogout) accLogout.classList.remove('hidden');
      // Hide header account/login button (so "Login" disappears)
      const accountLink = document.querySelector('.actions a[href="/HTML/account.html"]');
      if (accountLink) accountLink.style.display = 'none';
      // Hide any page-level login prompt (e.g., checkout .dang-nhap-tai-khoan)
      const loginPrompt = document.querySelector('.dang-nhap-tai-khoan');
      if (loginPrompt) loginPrompt.style.display = 'none';
    } else {
      userActions.innerHTML = '';
      const accLogout = document.getElementById('logoutAccountBtn');
      if (accLogout) accLogout.classList.add('hidden');
      // Show header account/login button when not logged in
      const accountLink = document.querySelector('.actions a[href="/HTML/account.html"]');
      if (accountLink) accountLink.style.display = '';
      // Show page-level login prompt if present
      const loginPrompt = document.querySelector('.dang-nhap-tai-khoan');
      if (loginPrompt) loginPrompt.style.display = '';
    }
  } catch (e) {
    console.error('setupUserMenu error:', e);
  }
}

// --- Đăng xuất ---
function logout(redirect = '/HTML/account.html') {
  try {
    // Clear both sessionStorage and localStorage copies
    try { sessionStorage.removeItem('currentUser'); } catch (e) {}
    try { localStorage.removeItem('currentUser'); } catch (e) {}
    try { localStorage.removeItem('user'); } catch (e) {}

    // update header UI
    const userActions = document.getElementById('user-actions');
    if (userActions) userActions.innerHTML = '';

    // hide account logout button if present
    const accLogout = document.getElementById('logoutAccountBtn');
    if (accLogout) accLogout.classList.add('hidden');

    // show header account/login button again
    const accountLink = document.querySelector('.actions a[href="/HTML/account.html"]');
    if (accountLink) accountLink.style.display = '';

    // navigate to account page for login
    window.location.href = redirect;
  } catch (e) {
    console.error('logout error:', e);
    window.location.href = redirect;
  }
}

// Simple HTML escape to avoid injection in username display
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Expose logout globally so other scripts can call it if needed
window.logout = logout;

// --- Header search handler ---
function attachHeaderSearch() {
  try {
    const input = document.querySelector('.search-box input');
    if (!input) return;

    let timer = null;
    input.addEventListener('input', (e) => {
      const q = e.target.value.trim();
      // debounce
      clearTimeout(timer);
      timer = setTimeout(() => {
        // save for shop page
        try { sessionStorage.setItem('searchQuery', q); } catch (e) {}
        // if already on shop page, dispatch event so shop.js can filter in-place
        if (window.location.pathname.includes('/HTML/shop.html')) {
          window.dispatchEvent(new CustomEvent('search-updated', { detail: q }));
        } else {
          // otherwise go to shop with query param
          const encoded = encodeURIComponent(q);
          window.location.href = `/HTML/shop.html?q=${encoded}`;
        }
      }, 250);
    });
  } catch (e) {
    console.error('attachHeaderSearch error', e);
  }
}


  

