// ========== PROTEKSI ROLE ==========
const role = localStorage.getItem("role");
if (role !== "mahasiswa") {
    window.location.href = "../../index.html";
}

// ========== DATA ==========
let riwayatData = [];
let filteredData = [];

// ========== LOAD PAGE ==========
window.onload = function() {
    // Theme
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
        document.body.classList.add("dark-mode");
    }

    // Nama
    const nama = localStorage.getItem("namaMahasiswa");
    if (nama) {
        document.getElementById("namaMahasiswa").innerText = nama;
    }

    // Sidebar
    const sidebarState = localStorage.getItem("sidebarOpen");
    if (sidebarState === "true" && window.innerWidth <= 768) {
        document.getElementById("sidebar").classList.add("open");
        document.getElementById("sidebarOverlay").classList.add("active");
    }

    // Load data
    loadRiwayat();
};

// ========== LOAD RIWAYAT ==========
function loadRiwayat() {
    riwayatData = JSON.parse(localStorage.getItem('riwayatKonsultasi')) || [];
    
    // Tambah data dummy jika kosong
    if (riwayatData.length === 0) {
        riwayatData = [
            {
                id: 'P-1',
                mahasiswa: 'Mahasiswa A',
                nim: '12345678',
                kategori: 'akademik',
                jenis: 'skripsi',
                jenisLabel: '📝 Skripsi',
                dosen: 'Dr. Sari, M.Pd.',
                tanggal: '2026-06-15',
                waktu: '09:00',
                ruangan: 'Ruang 101',
                deskripsi: 'Konsultasi tentang metodologi penelitian',
                status: 'selesai',
                tanggalPengajuan: '2026-06-10T08:00:00.000Z'
            },
            {
                id: 'P-2',
                mahasiswa: 'Mahasiswa A',
                nim: '12345678',
                kategori: 'akademik',
                jenis: 'media',
                jenisLabel: '💻 Media Pembelajaran',
                dosen: 'Dr. Citra, M.Pd.',
                tanggal: '2026-06-20',
                waktu: '10:00',
                ruangan: 'Ruang 102',
                deskripsi: 'Konsultasi tentang pengembangan media interaktif',
                status: 'disetujui',
                tanggalPengajuan: '2026-06-12T09:30:00.000Z'
            },
            {
                id: 'P-3',
                mahasiswa: 'Mahasiswa A',
                nim: '12345678',
                kategori: 'non-akademik',
                jenis: 'karir',
                jenisLabel: '💼 Karir & Pengembangan Diri',
                dosen: 'Dr. Asep, M.Pd.',
                tanggal: '2026-06-25',
                waktu: '13:00',
                ruangan: 'Online (Zoom)',
                deskripsi: 'Konsultasi tentang persiapan karir setelah lulus',
                status: 'pending',
                tanggalPengajuan: '2026-06-14T14:00:00.000Z'
            },
            {
                id: 'P-4',
                mahasiswa: 'Mahasiswa A',
                nim: '12345678',
                kategori: 'akademik',
                jenis: 'e-learning',
                jenisLabel: '🌐 E-Learning',
                dosen: 'Dr. Ika, M.Pd.',
                tanggal: '2026-06-05',
                waktu: '08:30',
                ruangan: 'Ruang 201',
                deskripsi: 'Konsultasi tentang implementasi e-learning',
                status: 'ditolak',
                tanggalPengajuan: '2026-06-02T10:00:00.000Z'
            }
        ];
        localStorage.setItem('riwayatKonsultasi', JSON.stringify(riwayatData));
    }

    filteredData = [...riwayatData];
    renderRiwayat();
}

// ========== RENDER RIWAYAT ==========
function renderRiwayat() {
    const container = document.getElementById('riwayatList');
    const emptyState = document.getElementById('emptyState');
    const totalCount = document.getElementById('totalCount');

    if (filteredData.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📭</div>
                <h4>Tidak Ada Riwayat Konsultasi</h4>
                <p>Tidak ada data yang sesuai dengan filter yang dipilih.</p>
                <button onclick="resetFilter()" class="btn-primary">Reset Filter</button>
            </div>
        `;
        totalCount.textContent = '0 konsultasi';
        return;
    }

    totalCount.textContent = `${filteredData.length} konsultasi`;

    let html = '';
    filteredData.forEach((item, index) => {
        const statusClass = getStatusClass(item.status);
        const statusLabel = getStatusLabel(item.status);
        const tanggalFormatted = formatDate(item.tanggal);
        const waktuFormatted = item.waktu;
        const kategoriLabel = item.kategori === 'akademik' ? '📚 Akademik' : '🎯 Non-Akademik';

        html += `
            <div class="riwayat-item" onclick="detailRiwayat('${item.id}')">
                <div class="riwayat-item-header">
                    <div class="riwayat-item-title">
                        <h4>${item.jenisLabel}</h4>
                        <span class="badge ${statusClass}">${statusLabel}</span>
                    </div>
                    <div class="riwayat-item-meta">
                        <span class="meta-item">${kategoriLabel}</span>
                        <span class="meta-item">👨‍🏫 ${item.dosen}</span>
                    </div>
                </div>
                <div class="riwayat-item-body">
                    <p>${item.deskripsi}</p>
                    <div class="riwayat-item-footer">
                        <span class="meta-item">📅 ${tanggalFormatted}</span>
                        <span class="meta-item">⏰ ${waktuFormatted}</span>
                        <span class="meta-item">🏛️ ${item.ruangan}</span>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// ========== GET STATUS CLASS ==========
function getStatusClass(status) {
    const classes = {
        'pending': 'pending',
        'disetujui': 'success',
        'selesai': 'success',
        'ditolak': 'danger',
        'dibatalkan': 'danger'
    };
    return classes[status] || 'pending';
}

// ========== GET STATUS LABEL ==========
function getStatusLabel(status) {
    const labels = {
        'pending': '⏳ Menunggu',
        'disetujui': '✅ Disetujui',
        'selesai': '📌 Selesai',
        'ditolak': '❌ Ditolak',
        'dibatalkan': '🚫 Dibatalkan'
    };
    return labels[status] || status;
}

// ========== FORMAT DATE ==========
function formatDate(dateString) {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

// ========== APPLY FILTER ==========
function applyFilter() {
    const status = document.getElementById('filterStatus').value;
    const kategori = document.getElementById('filterKategori').value;
    const search = document.getElementById('searchRiwayat').value.toLowerCase();

    filteredData = riwayatData.filter(item => {
        // Filter status
        if (status !== 'semua' && item.status !== status) {
            return false;
        }
        // Filter kategori
        if (kategori !== 'semua' && item.kategori !== kategori) {
            return false;
        }
        // Filter search
        if (search) {
            const searchText = (item.jenisLabel + ' ' + item.dosen + ' ' + item.deskripsi).toLowerCase();
            if (!searchText.includes(search)) {
                return false;
            }
        }
        return true;
    });

    renderRiwayat();
}

// ========== RESET FILTER ==========
function resetFilter() {
    document.getElementById('filterStatus').value = 'semua';
    document.getElementById('filterKategori').value = 'semua';
    document.getElementById('searchRiwayat').value = '';
    applyFilter();
}

// ========== DETAIL RIWAYAT ==========
function detailRiwayat(id) {
    const item = riwayatData.find(r => r.id === id);
    if (!item) return;

    const statusLabel = getStatusLabel(item.status);
    const statusClass = getStatusClass(item.status);
    const tanggalFormatted = formatDate(item.tanggal);
    const tanggalPengajuan = formatDate(item.tanggalPengajuan);
    const kategoriLabel = item.kategori === 'akademik' ? '📚 Akademik' : '🎯 Non-Akademik';

    alert(`
📋 DETAIL KONSULTASI

Judul: ${item.jenisLabel}
Kategori: ${kategoriLabel}
Dosen: ${item.dosen}
Tanggal: ${tanggalFormatted}
Waktu: ${item.waktu}
Ruangan: ${item.ruangan}
Status: ${statusLabel}

Deskripsi:
${item.deskripsi}

Tanggal Pengajuan: ${tanggalPengajuan}
ID Pengajuan: ${item.id}
    `);
}

// ========== EXPORT RIWAYAT ==========
function exportRiwayat() {
    if (riwayatData.length === 0) {
        showNotification('⚠️ Tidak ada data untuk diexport!', 'error');
        return;
    }

    const data = riwayatData.map(item => ({
        'ID': item.id,
        'Judul': item.jenisLabel,
        'Kategori': item.kategori === 'akademik' ? 'Akademik' : 'Non-Akademik',
        'Dosen': item.dosen,
        'Tanggal': formatDate(item.tanggal),
        'Waktu': item.waktu,
        'Ruangan': item.ruangan,
        'Status': getStatusLabel(item.status).replace(/[^\w\s]/g, '').trim(),
        'Deskripsi': item.deskripsi,
        'Tanggal Pengajuan': formatDate(item.tanggalPengajuan)
    }));

    // Export sebagai CSV
    const headers = Object.keys(data[0]);
    const csv = [
        headers.join(','),
        ...data.map(row => headers.map(h => `"${row[h]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `riwayat-konsultasi-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    showNotification('✅ Data berhasil diexport!', 'success');
}

// ========== REFRESH RIWAYAT ==========
function refreshRiwayat() {
    const btn = document.querySelector('.refresh-btn');
    btn.textContent = '⏳';
    btn.disabled = true;

    setTimeout(() => {
        loadRiwayat();
        btn.textContent = '🔄';
        btn.disabled = false;
        showNotification('✅ Data berhasil diperbarui!', 'success');
    }, 1000);
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
    
    const isOpen = sidebar.classList.contains("open");
    localStorage.setItem("sidebarOpen", isOpen);
}

function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
}

function logout() {
    if (confirm('Apakah Anda yakin ingin logout?')) {
        localStorage.removeItem("role");
        localStorage.removeItem("namaMahasiswa");
        localStorage.removeItem("nimMahasiswa");
        localStorage.removeItem("sidebarOpen");
        window.location.replace("../../index.html");
    }
}

// ========== RESIZE HANDLER ==========
window.addEventListener("resize", function() {
    if (window.innerWidth > 768) {
        const sidebar = document.getElementById("sidebar");
        const overlay = document.getElementById("sidebarOverlay");
        sidebar.classList.remove("open");
        overlay.classList.remove("active");
    }
});