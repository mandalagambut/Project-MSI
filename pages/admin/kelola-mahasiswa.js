// ========== PROTEKSI ROLE ==========
const role = localStorage.getItem("role");
if (role !== "admin") {
    window.location.href = "../../index.html";
}

// ========== DATA ==========
let mahasiswaData = [];
let filteredMhs = [];

// ========== LOAD PAGE ==========
window.onload = function() {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
        document.body.classList.add("dark-mode");
    }

    const nama = localStorage.getItem("namaAdmin");
    if (nama) {
        document.getElementById("namaAdmin").innerText = nama;
    }

    const sidebarState = localStorage.getItem("sidebarOpen");
    if (sidebarState === "true" && window.innerWidth <= 768) {
        document.getElementById("sidebar").classList.add("open");
        document.getElementById("sidebarOverlay").classList.add("active");
    }

    loadMahasiswa();
};

// ========== LOAD MAHASISWA ==========
function loadMahasiswa() {
    const savedData = JSON.parse(localStorage.getItem('dataMahasiswa')) || [];
    
    if (savedData.length === 0) {
        mahasiswaData = [
            { id: 'M-001', nama: 'Mahasiswa A', nim: '12345678', email: 'mahasiswa.a@email.com', telepon: '081234567890', program: 'Teknologi Pendidikan', semester: '6', angkatan: '2024', status: 'aktif', alamat: 'Jl. Pendidikan No. 1' },
            { id: 'M-002', nama: 'Mahasiswa B', nim: '23456789', email: 'mahasiswa.b@email.com', telepon: '081234567891', program: 'Pendidikan Bahasa', semester: '4', angkatan: '2025', status: 'aktif', alamat: 'Jl. Bahasa No. 2' },
            { id: 'M-003', nama: 'Mahasiswa C', nim: '34567890', email: 'mahasiswa.c@email.com', telepon: '081234567892', program: 'Pendidikan Matematika', semester: '8', angkatan: '2023', status: 'aktif', alamat: 'Jl. Matematika No. 3' },
            { id: 'M-004', nama: 'Mahasiswa D', nim: '45678901', email: 'mahasiswa.d@email.com', telepon: '081234567893', program: 'Bimbingan Konseling', semester: '2', angkatan: '2026', status: 'cuti', alamat: 'Jl. Konseling No. 4' },
            { id: 'M-005', nama: 'Mahasiswa E', nim: '56789012', email: 'mahasiswa.e@email.com', telepon: '081234567894', program: 'Teknologi Pendidikan', semester: '8', angkatan: '2023', status: 'lulus', alamat: 'Jl. Pendidikan No. 5' }
        ];
        localStorage.setItem('dataMahasiswa', JSON.stringify(mahasiswaData));
    } else {
        mahasiswaData = savedData;
    }

    filteredMhs = [...mahasiswaData];
    renderMahasiswa();
    updateStatsMhs();
}

// ========== RENDER MAHASISWA ==========
function renderMahasiswa() {
    const container = document.getElementById('mahasiswaList');
    const totalCount = document.getElementById('totalCount');

    if (filteredMhs.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">👨‍🎓</div>
                <h4>Tidak Ada Mahasiswa</h4>
                <p>Tidak ada data yang sesuai dengan filter yang dipilih.</p>
                <button onclick="resetFilterMhs()" class="btn-primary">Reset Filter</button>
            </div>
        `;
        totalCount.textContent = '0 mahasiswa';
        return;
    }

    totalCount.textContent = `${filteredMhs.length} mahasiswa`;

    let html = '';
    filteredMhs.forEach((item) => {
        const statusClass = item.status === 'aktif' ? 'success' : 
                           item.status === 'cuti' ? 'warning' : 
                           item.status === 'lulus' ? 'info' : 'danger';
        const statusLabel = item.status === 'aktif' ? '🟢 Aktif' : 
                           item.status === 'cuti' ? '🟡 Cuti' : 
                           item.status === 'lulus' ? '🎓 Lulus' : '🔴 Nonaktif';

        html += `
            <div class="mahasiswa-item">
                <div class="mahasiswa-item-header">
                    <div class="mahasiswa-item-title">
                        <h4>${item.nama}</h4>
                        <span class="badge ${statusClass}">${statusLabel}</span>
                    </div>
                    <span class="mahasiswa-item-nim">NIM: ${item.nim}</span>
                </div>
                <div class="mahasiswa-item-body">
                    <div class="mahasiswa-item-info">
                        <span class="info-item">📚 ${item.program}</span>
                        <span class="info-item">📖 Semester ${item.semester}</span>
                        <span class="info-item">📅 Angkatan ${item.angkatan}</span>
                        <span class="info-item">📧 ${item.email}</span>
                        <span class="info-item">📱 ${item.telepon}</span>
                    </div>
                    ${item.alamat ? `<p class="mahasiswa-item-alamat">📍 ${item.alamat}</p>` : ''}
                    <div class="mahasiswa-item-actions">
                        <button onclick="editMahasiswa('${item.id}')" class="btn-edit">✏️ Edit</button>
                        <button onclick="deleteMahasiswa('${item.id}')" class="btn-delete">🗑️ Hapus</button>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// ========== UPDATE STATS ==========
function updateStatsMhs() {
    const total = mahasiswaData.length;
    const aktif = mahasiswaData.filter(m => m.status === 'aktif').length;
    const cuti = mahasiswaData.filter(m => m.status === 'cuti').length;
    const nonaktif = mahasiswaData.filter(m => m.status === 'nonaktif' || m.status === 'lulus').length;

    document.getElementById('totalMahasiswa').textContent = total;
    document.getElementById('aktifMahasiswa').textContent = aktif;
    document.getElementById('cutiMahasiswa').textContent = cuti;
    document.getElementById('nonaktifMahasiswa').textContent = nonaktif;
}

// ========== SHOW TAMBAH MAHASISWA ==========
function showTambahMahasiswa() {
    document.getElementById('modalTitle').textContent = 'Tambah Mahasiswa';
    document.getElementById('editId').value = '';
    document.getElementById('formMahasiswa').reset();
    document.getElementById('mhsAngkatan').value = new Date().getFullYear();
    document.getElementById('modalMahasiswa').style.display = 'flex';
}

// ========== EDIT MAHASISWA ==========
function editMahasiswa(id) {
    const item = mahasiswaData.find(m => m.id === id);
    if (!item) return;

    document.getElementById('modalTitle').textContent = 'Edit Mahasiswa';
    document.getElementById('editId').value = id;
    document.getElementById('mhsNama').value = item.nama;
    document.getElementById('mhsNim').value = item.nim;
    document.getElementById('mhsEmail').value = item.email || '';
    document.getElementById('mhsTelepon').value = item.telepon || '';
    document.getElementById('mhsProgram').value = item.program;
    document.getElementById('mhsSemester').value = item.semester;
    document.getElementById('mhsAngkatan').value = item.angkatan;
    document.getElementById('mhsStatus').value = item.status;
    document.getElementById('mhsAlamat').value = item.alamat || '';
    document.getElementById('modalMahasiswa').style.display = 'flex';
}

// ========== SAVE MAHASISWA ==========
function saveMahasiswa() {
    const id = document.getElementById('editId').value;
    const nama = document.getElementById('mhsNama').value.trim();
    const nim = document.getElementById('mhsNim').value.trim();
    const email = document.getElementById('mhsEmail').value.trim();
    const telepon = document.getElementById('mhsTelepon').value.trim();
    const program = document.getElementById('mhsProgram').value;
    const semester = document.getElementById('mhsSemester').value;
    const angkatan = document.getElementById('mhsAngkatan').value;
    const status = document.getElementById('mhsStatus').value;
    const alamat = document.getElementById('mhsAlamat').value.trim();

    if (!nama || !nim || !program || !status) {
        showNotification('⚠️ Mohon lengkapi field yang wajib diisi!', 'error');
        return;
    }

    if (id) {
        // Edit
        const index = mahasiswaData.findIndex(m => m.id === id);
        if (index !== -1) {
            mahasiswaData[index] = { ...mahasiswaData[index], nama, nim, email, telepon, program, semester, angkatan, status, alamat };
        }
    } else {
        // Tambah
        const newId = 'M-' + String(mahasiswaData.length + 1).padStart(3, '0');
        mahasiswaData.push({ id: newId, nama, nim, email, telepon, program, semester, angkatan, status, alamat });
    }

    localStorage.setItem('dataMahasiswa', JSON.stringify(mahasiswaData));
    closeModal();
    loadMahasiswa();
    showNotification('✅ Data mahasiswa berhasil disimpan!', 'success');
}

// ========== DELETE MAHASISWA ==========
function deleteMahasiswa(id) {
    if (!confirm('Apakah Anda yakin ingin menghapus data mahasiswa ini?')) return;

    mahasiswaData = mahasiswaData.filter(m => m.id !== id);
    localStorage.setItem('dataMahasiswa', JSON.stringify(mahasiswaData));
    loadMahasiswa();
    showNotification('🗑️ Data mahasiswa berhasil dihapus!', 'success');
}

// ========== APPLY FILTER ==========
function applyFilterMhs() {
    const status = document.getElementById('filterStatusMhs').value;
    const program = document.getElementById('filterProgramMhs').value;
    const search = document.getElementById('searchMhs').value.toLowerCase();

    filteredMhs = mahasiswaData.filter(item => {
        if (status !== 'semua' && item.status !== status) return false;
        if (program !== 'semua' && item.program !== program) return false;
        if (search) {
            const searchText = (item.nama + ' ' + item.nim + ' ' + item.program).toLowerCase();
            if (!searchText.includes(search)) return false;
        }
        return true;
    });

    renderMahasiswa();
}

// ========== RESET FILTER ==========
function resetFilterMhs() {
    document.getElementById('filterStatusMhs').value = 'semua';
    document.getElementById('filterProgramMhs').value = 'semua';
    document.getElementById('searchMhs').value = '';
    applyFilterMhs();
}

// ========== EXPORT MAHASISWA ==========
function exportMahasiswa() {
    if (mahasiswaData.length === 0) {
        showNotification('⚠️ Tidak ada data untuk diexport!', 'error');
        return;
    }

    const data = mahasiswaData.map(item => ({
        'Nama': item.nama,
        'NIM': item.nim,
        'Program Studi': item.program,
        'Semester': item.semester,
        'Angkatan': item.angkatan,
        'Status': item.status,
        'Email': item.email || '-',
        'Telepon': item.telepon || '-',
        'Alamat': item.alamat || '-'
    }));

    const headers = Object.keys(data[0]);
    const csv = [
        headers.join(','),
        ...data.map(row => headers.map(h => `"${row[h]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data-mahasiswa-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    showNotification('✅ Data berhasil diexport!', 'success');
}

// ========== CLOSE MODAL ==========
function closeModal() {
    document.getElementById('modalMahasiswa').style.display = 'none';
}

// ========== NOTIFICATION ==========
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 12px;
        background: ${type === 'success' ? '#14b8a6' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        font-weight: 500;
        z-index: 9999;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        animation: slideIn 0.5s ease;
        max-width: 400px;
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// ========== TOGGLE FUNCTIONS ==========
function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");
    sidebar.classList.toggle("open");
    overlay.classList.toggle("active");
    localStorage.setItem("sidebarOpen", sidebar.classList.contains("open"));
}

function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
}

function logout() {
    if (confirm('Apakah Anda yakin ingin logout?')) {
        localStorage.removeItem("role");
        localStorage.removeItem("namaAdmin");
        localStorage.removeItem("nipAdmin");
        localStorage.removeItem("sidebarOpen");
        window.location.replace("../../index.html");
    }
}

window.addEventListener("resize", function() {
    if (window.innerWidth > 768) {
        document.getElementById("sidebar").classList.remove("open");
        document.getElementById("sidebarOverlay").classList.remove("active");
    }
});