const tbody = document.querySelector('.product tbody');
let products = [];
let isEditing = false;
let editingId = null;

// Load dữ liệu ban đầu
fetch('http://localhost:3001/Product')
  .then(res => res.json())
  .then(data => {
    products = data;
    renderTable(products);
  })
  .catch(err => console.error("Lỗi khi tải sản phẩm:", err));

function renderTable(list) {
  tbody.innerHTML = '';
  list.forEach(p => {
    tbody.insertAdjacentHTML('beforeend', `
      <tr>
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>${p.brand}</td>
        <td><img src="${p.img}" width="60"></td>
        <td>${p.stock}</td>
        <td>${p.price}</td>
        <td>
          <button class="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#myModal" onclick="editProduct(${p.id})">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteProduct(${p.id})">Delete</button>
        </td>
      </tr>
    `);
  });
}

// --- Thêm sản phẩm hoặc cập nhật sản phẩm ---
const form = document.querySelector('.form');
form.addEventListener('submit', handleSubmit);

function handleSubmit(e) {
  e.preventDefault();
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  const jsonData = JSON.stringify(data);

  if (isEditing) {
    // --- UPDATE ---
    fetch(`http://localhost:3001/Product/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: jsonData,
    })
      .then(res => res.json())
      .then(updated => {
        const index = products.findIndex(p => p.id == editingId);
        products[index] = updated;
        renderTable(products);
        resetForm();
        alert('Đã cập nhật sản phẩm!');
      })
      .catch(err => console.error('Error updating product:', err));
  } else {
    // --- ADD NEW ---
    fetch('http://localhost:3001/Product', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: jsonData,
    })
      .then(res => res.json())
      .then(newProduct => {
        products.push(newProduct);
        renderTable(products);
        resetForm();
        alert('Thêm sản phẩm thành công!');
      })
      .catch(err => console.error('Error adding product:', err));
  }
}

function deleteProduct(id) {
  if (confirm('Bạn có chắc muốn xoá sản phẩm này không?')) {
    fetch(`http://localhost:3001/Product/${id}`, { method: 'DELETE' })
      .then(res => res.ok && (products = products.filter(p => p.id != id)))
      .then(() => renderTable(products))
      .catch(err => console.error('Error deleting product:', err));
  }
}

function editProduct(id) {
  const product = products.find(p => p.id == id);
  if (!product) return;

  // Đổ dữ liệu vào form
  document.getElementById('product-id').value = product.id;
  document.getElementById('name').value = product.name;
  document.getElementById('brand').value = product.brand;
  document.getElementById('img').value = product.img;
  document.getElementById('stock').value = product.stock;
  document.getElementById('price').value = product.price;

  isEditing = true;
  editingId = id;
  document.getElementById('modal-title').textContent = 'Chỉnh sửa sản phẩm';
}

function resetForm() {
  form.reset();
  isEditing = false;
  editingId = null;
  document.getElementById('modal-title').textContent = 'Thêm sản phẩm';
  const modal = bootstrap.Modal.getInstance(document.getElementById('myModal'));
  modal.hide();
}
// logout.js — xử lý đăng xuất
const logoutBtn = document.getElementById('logout-btn'); // nút đăng xuất của bạn

if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    // Xóa thông tin đăng nhập khỏi session & local
    sessionStorage.removeItem('currentUser');
    localStorage.removeItem('currentUser');

    // Chuyển hướng về trang đăng nhập
    window.location.href = '/HTML/account.html';
  });
}
