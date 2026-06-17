// ========== PROTEKSI ROLE ==========
const role = localStorage.getItem("role");
if (role !== "admin") {
    window.location.href = "../../index.html";
}

// ========== DATA ==========
let dosenData = [];
let filteredDsn = [];

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

    loadDosen();
};

// ========== LOAD DOSEN ==========
function loadDosen() {
    const savedData = JSON.parse(localStorage.getItem('dataDosen')) || [];
    
    if (savedData.length === 0) {
        dosenData = [
            { id: 'D-001', nama: 'Dr. Sari Dewi, M.Pd.', nip: '197501012005012001', email: 'sari.dewi@email.com', telepon: '081234567800', bidang: 'Teknologi Pendidikan', jabatan: 'Lektor Kepala', fakultas: 'Fakultas Ilmu Pendidikan', status: 'aktif', alamat: 'Jl. Dosen No. 1' },
            { id: 'D-002', nama: 'Dr. Taufik Hidayat, M.Pd.', nip: '197802152008021002', email: 'taufik.hidayat@email.com', telepon: '081234567801', bidang: 'Pendidikan Bahasa', jabatan: 'Lektor', fakultas: 'Fakultas Ilmu Pendidikan', status: 'aktif', alamat: 'Jl. Dosen No. 2' },
            { id: 'D-003', nama: 'Dr. Umi Kalsum, M.Pd.', nip: '198005102010031003', email: 'umi.kalsum@email.com', telepon: '081234567802', bidang: 'Pendidikan Matematika', jabatan: 'Lektor Kepala', fakultas: 'Fakultas Ilmu Pendidikan', status: 'aktif', alamat: 'Jl. Dosen No. 3' },
            { id: 'D-004', nama: 'Dr. Zaki Mubarak, M.Pd.', nip: '198208152012041004', email: 'zaki.mubarak@email.com', telepon: '081234567803', bidang: 'Bimbingan Konseling', jabatan: 'Asisten Ahli', fakultas: 'Fakultas Ilmu Pendidikan', status: 'cuti', alamat: 'Jl. Dosen No. 4' },
            { id: 'D-005', nama: 'Dr. Rudi Hartono, M.Pd.', nip: '197505202002051005', email: 'rudi.hartono@email.com', telepon: '081234567804', bidang: 'Psikologi Pendidikan', jabatan: 'Profesor', fakultas: 'Fakultas Ilmu Pendidikan', status: 'pensiun', alamat: 'Jl. Dosen No. 5' }
        ];
        localStorage.setItem('dataDosen', JSON.stringify(dosenData));
    } else {
        dosenData = savedData;
    }

    filteredDsn = [...dosenData];
    renderDosen();
    updateStatsDsn();
}

// ========== RENDER DOSEN ==========
function renderDosen() {
    const container = document.getElementById('dosenList');
    const totalCount = document.getElementById('totalCount');

    if (filteredDsn.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">👨‍🏫</div>
                <h4>Tidak Ada Dosen</h4>
                <p>Tidak ada data yang sesuai dengan filter yang dipilih.</p>
                <button onclick="resetFilterDsn()" class="btn-primary">Reset Filter</button>
            </div>
        `;
        totalCount.textContent = '0 dosen';
        return;
    }

    totalCount.textContent = `${filteredDsn.length} dosen`;

    let html = '';
    filteredDsn.forEach((item) => {
        const statusClass = item.status === 'aktif' ? 'success' : 
                           item.status === 'cuti' ? 'warning' : 
                           item.status === 'pensiun' ? 'info' : 'danger';
        const statusLabel = item.status === 'aktif' ? '🟢 Aktif' : 
                           item.status === 'cuti' ? '🟡 Cuti' : 
                           item.status === 'pensiun' ? '📌 Pensiun' : '🔴 Nonaktif';

        html += `
            <div class="dosen-item">
                <div class="dosen-item-header">
                    <div class="dosen-item-title">
                        <h4>${item.nama}</h4>
                        <span class="badge ${statusClass}">${statusLabel}</span>
                    </div>
                    <span class="dosen-item-nip">NIP: ${item.nip}</span>
                </div>
                <div class="dosen-item-body">
                    <div class="dosen-item-info">
                        <span class="info-item">📚 ${item.bidang}</span>
                        <span class="info-item">🎓 ${item.jabatan}</span>
                        <span class="info-item">🏛️ ${item.fakultas}</span>
                        <span class="info-item">📧 ${item.email}</span>
                        <span class="info-item">📱 ${item.telepon}</span>
                    </div>
                    ${item.alamat ? `<p class="dosen-item-alamat">📍 ${item.alamat}</p>` : ''}
                    <div class="dosen-item-actions">
                        <button onclick="editDosen('${item.id}')" class="btn-edit">✏️ Edit</button>
                        <button onclick="deleteDosen('${item.id}')" class="btn-delete">🗑️ Hapus</button>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// ========== UPDATE STATS ==========
function updateStatsDsn() {
    const total = dosenData.length;
    const aktif = dosenData.filter(d => d.status === 'aktif').length;
    const cuti = dosenData.filter(d => d.status === 'cuti').length;
    const nonaktif = dosenData.filter(d => d.status === 'nonaktif' || d.status === 'pensiun').length;

    document.getElementById('totalDosen').textContent = total;
    document.getElementById('aktifDosen').textContent = aktif;
    document.getElementById('cutiDosen').textContent = cuti;
    document.getElementById('nonaktifDosen').textContent = nonaktif;
}

// ========== SHOW TAMBAH DOSEN ==========
function showTambahDosen() {
    document.getElementById('modalTitleDosen').textContent = 'Tambah Dosen';
    document.getElementById('editIdDosen').value = '';
    document.getElementById('formDosen').reset();
    document.getElementById('modalDosen').style.display = 'flex';
}

// ========== EDIT DOSEN ==========
function editDosen(id) {
    const item = dosenData.find(d => d.id === id);
    if (!item) return;

    document.getElementById('modalTitleDosen').textContent = 'Edit Dosen';
    document.getElementById('editIdDosen').value = id;
    document.getElementById('dsnNama').value = item.nama;
    document.getElementById('dsnNip').value = item.nip;
    document.getElementById('dsnEmail').value = item.email || '';
    document.getElementById('dsnTelepon').value = item.telepon || '';
    document.getElementById('dsnBidang').value = item.bidang;
    document.getElementById('dsnJabatan').value = item.jabatan || 'Lektor';
    document.getElementById('dsnFakultas').value = item.fakultas || '';
    document.getElementById('dsnStatus').value = item.status;
    document.getElementById('dsnAlamat').value = item.alamat || '';
    document.getElementById('modalDosen').style.display = 'flex';
}

// ========== SAVE DOSEN ==========
function saveDosen() {
    const id = document.getElementById('editIdDosen').value;
    const nama = document.getElementById('dsnNama').value.trim();
    const nip = document.getElementById('dsnNip').value.trim();
    const email = document.getElementById('dsnEmail').value.trim();
    const telepon = document.getElementById('dsnTelepon').value.trim();
    const bidang = document.getElementById('dsnBidang').value;
    const jabatan = document.getElementById('dsnJabatan').value;
    const fakultas = document.getElementById('dsnFakultas').value.trim();
    const status = document.getElementById('dsnStatus').value;
    const alamat = document.getElementById('dsnAlamat').value.trim();

    if (!nama || !nip || !bidang || !status) {
        showNotification('⚠️ Mohon lengkapi field yang wajib diisi!', 'error');
        return;
    }

    if (id) {
        const index = dosenData.findIndex(d => d.id === id);
        if (index !== -1) {
            dosenData[index] = { ...dosenData[index], nama, nip, email, telepon, bidang, jabatan, fakultas, status, alamat };
        }
    } else {
        const newId = 'D-' + String(dosenData.length + 1).padStart(3, '0');
        dosenData.push({ id: newId, nama, nip, email, telepon, bidang, jabatan, fakultas, status, alamat });
    }

    localStorage.setItem('dataDosen', JSON.stringify(dosenData));
    closeModalDosen();
    loadDosen();
    showNotification('✅ Data dosen berhasil disimpan!', 'success');
}

// ========== DELETE DOSEN ==========
function deleteDosen(id) {
    if (!confirm('Apakah Anda yakin ingin menghapus data dosen ini?')) return;

    dosenData = dosenData.filter(d => d.id !== id);
    localStorage.setItem('dataDosen', JSON.stringify(dosenData));
    loadDosen();
    showNotification('🗑️ Data dosen berhasil dihapus!', 'success');
}

// ========== APPLY FILTER ==========
function applyFilterDsn() {
    const status = document.getElementById('filterStatusDsn').value;
    const bidang = document.getElementById('filterBidangDsn').value;
    const search = document.getElementById('searchDsn').value.toLowerCase();

    filteredDsn = dosenData.filter(item => {
        if (status !== 'semua' && item.status !== status) return false;
        if (bidang !== 'semua' && item.bidang !== bidang) return false;
        if (search) {
            const searchText = (item.nama + ' ' + item.nip + ' ' + item.bidang).toLowerCase();
            if (!searchText.includes(search)) return false;
        }
        return true;
    });

    renderDosen();
}

// ========== RESET FILTER ==========
function resetFilterDsn() {
    document.getElementById('filterStatusDsn').value = 'semua';
    document.getElementById('filterBidangDsn').value = 'semua';
    document.getElementById('searchDsn').value = '';
    applyFilterDsn();
}

// ========== EXPORT DOSEN ==========
function exportDosen() {
    if (dosenData.length === 0) {
        showNotification('⚠️ Tidak ada data untuk diexport!', 'error');
        return;
    }

    const data = dosenData.map(item => ({
        'Nama': item.nama,
        'NIP': item.nip,
        'Bidang Keahlian': item.bidang,
        'Jabatan': item.jabatan,
        'Fakultas': item.fakultas || '-',
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
    a.download = `data-dosen-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    showNotification('✅ Data berhasil diexport!', 'success');
}

// ========== CLOSE MODAL ==========
function closeModalDosen() {
    document.getElementById('modalDosen').style.display = 'none';
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