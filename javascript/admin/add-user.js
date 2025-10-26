const tbody = document.querySelector('.user-info tbody');
let users = [];
let isEditing = false;
let editingId = null;

// Load dữ liệu ban đầu
fetch('http://localhost:3001/Account')
  .then(res => res.json())
  .then(data => {
    users = data;
    renderTable(users);
  })
  .catch(err => console.error("Lỗi khi tải thông tin:", err));

function renderTable(list) {
  tbody.innerHTML = '';
  list.forEach(u => {
    tbody.insertAdjacentHTML('beforeend', `
      <tr>
        <td>${u.id}</td>
        <td>${u.name}</td>
        <td>${u.phone}</td>
        <td>${u.email}</td>
        <td>${u.password}</td>
        <td>
          <button class="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#myModal" onclick="editProduct(${u.id})">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteProduct(${u.id})">Delete</button>
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
    fetch(`http://localhost:3001/Account/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: jsonData,
    })
      .then(res => res.json())
      .then(updated => {
        const index = users.findIndex(p => p.id == editingId);
        users[index] = updated;
        renderTable(users);
        resetForm();
        alert('Đã cập nhật thông tin người dùng!');
      })
      .catch(err => console.error('Error updating product:', err));
  } else {
    // --- ADD NEW ---
    fetch('http://localhost:3001/Account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: jsonData,
    })
      .then(res => res.json())
      .then(newUser => {
        users.push(newUser);
        renderTable(users);
        resetForm();
        alert('Thêm thông tin người dùng thành công!');
      })
      .catch(err => console.error('Error adding product:', err));
  }
}

function deleteProduct(id) {
  if (confirm('Bạn có chắc muốn xoá thông tin người dùng này không?')) {
    fetch(`http://localhost:3001/Account/${id}`, { method: 'DELETE' })
      .then(res => res.ok && (users = users.filter(u => u.id != id)))
      .then(() => renderTable(users))
      .catch(err => console.error('Error deleting product:', err));
  }
}

function editProduct(id) {
  const user = users.find(u => u.id == id);
  if (!user) return;

  // Đổ dữ liệu vào form
  document.getElementById('user-id').value = user.id;
  document.getElementById('user-name').value = user.name;
  document.getElementById('user-phone').value = user.phone;
  document.getElementById('user-email').value = user.email;
  document.getElementById('user-password').value = user.password;

  isEditing = true;
  editingId = id;
  document.getElementById('modal-title').textContent = 'Chỉnh sửa thông tin người dùng';
}

function resetForm() {
  form.reset();
  isEditing = false;
  editingId = null;
  document.getElementById('modal-title').textContent = 'Thêm thông tin người dùng';
  const modal = bootstrap.Modal.getInstance(document.getElementById('myModal'));
  modal.hide();
}
