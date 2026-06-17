// ========== PROTEKSI ROLE ==========
const role = localStorage.getItem("role");
if (role !== "dosen") {
    window.location.href = "../../index.html";
}

// ========== DATA ==========
let pengajuanData = [];
let filteredData = [];

// ========== LOAD PAGE ==========
window.onload = function() {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
        document.body.classList.add("dark-mode");
    }

    const nama = localStorage.getItem("namaDosen");
    if (nama) {
        document.getElementById("namaDosen").innerText = nama;
    }

    const sidebarState = localStorage.getItem("sidebarOpen");
    if (sidebarState === "true" && window.innerWidth <= 768) {
        document.getElementById("sidebar").classList.add("open");
        document.getElementById("sidebarOverlay").classList.add("active");
    }

    loadPengajuan();
};

// ========== LOAD PENGAJUAN ==========
function loadPengajuan() {
    // Ambil data dari localStorage atau gunakan data dummy
    const savedData = JSON.parse(localStorage.getItem('pengajuanDosen')) || [];
    
    if (savedData.length === 0) {
        // Data dummy
        pengajuanData = [
            {
                id: 'P-1',
                mahasiswa: 'Mahasiswa A',
                nim: '12345678',
                semester: '6',
                kategori: 'akademik',
                jenis: 'skripsi',
                jenisLabel: '📝 Skripsi',
                dosen: 'Dr. Sari, M.Pd.',
                tanggal: '2026-06-20',
                waktu: '09:00',
                ruangan: 'Ruang 101',
                deskripsi: 'Konsultasi tentang metodologi penelitian skripsi',
                status: 'pending',
                tanggalPengajuan: '2026-06-15T08:00:00.000Z'
            },
            {
                id: 'P-2',
                mahasiswa: 'Mahasiswa B',
                nim: '23456789',
                semester: '4',
                kategori: 'akademik',
                jenis: 'media',
                jenisLabel: '💻 Media Pembelajaran',
                dosen: 'Dr. Sari, M.Pd.',
                tanggal: '2026-06-22',
                waktu: '10:00',
                ruangan: 'Ruang 102',
                deskripsi: 'Konsultasi tentang pengembangan media interaktif',
                status: 'pending',
                tanggalPengajuan: '2026-06-16T09:30:00.000Z'
            },
            {
                id: 'P-3',
                mahasiswa: 'Mahasiswa C',
                nim: '34567890',
                semester: '8',
                kategori: 'akademik',
                jenis: 'magang',
                jenisLabel: '🏢 Magang',
                dosen: 'Dr. Sari, M.Pd.',
                tanggal: '2026-06-25',
                waktu: '13:00',
                ruangan: 'Online (Zoom)',
                deskripsi: 'Konsultasi tentang pelaksanaan magang di industri',
                status: 'disetujui',
                tanggalPengajuan: '2026-06-14T14:00:00.000Z'
            },
            {
                id: 'P-4',
                mahasiswa: 'Mahasiswa D',
                nim: '45678901',
                semester: '6',
                kategori: 'non-akademik',
                jenis: 'karir',
                jenisLabel: '💼 Karir & Pengembangan Diri',
                dosen: 'Dr. Sari, M.Pd.',
                tanggal: '2026-06-18',
                waktu: '08:30',
                ruangan: 'Ruang 201',
                deskripsi: 'Konsultasi tentang persiapan karir setelah lulus',
                status: 'ditolak',
                tanggalPengajuan: '2026-06-12T10:00:00.000Z'
            },
            {
                id: 'P-5',
                mahasiswa: 'Mahasiswa E',
                nim: '56789012',
                semester: '2',
                kategori: 'akademik',
                jenis: 'dasar-pendidikan',
                jenisLabel: '📚 Dasar-dasar Pendidikan',
                dosen: 'Dr. Sari, M.Pd.',
                tanggal: '2026-06-28',
                waktu: '11:00',
                ruangan: 'Ruang 103',
                deskripsi: 'Konsultasi tentang pemahaman dasar pendidikan',
                status: 'pending',
                tanggalPengajuan: '2026-06-17T11:00:00.000Z'
            }
        ];
        localStorage.setItem('pengajuanDosen', JSON.stringify(pengajuanData));
    } else {
        pengajuanData = savedData;
    }

    filteredData = [...pengajuanData];
    renderPengajuan();
    updateStats();
}

// ========== RENDER PENGAJUAN ==========
function renderPengajuan() {
    const container = document.getElementById('pengajuanList');
    const totalCount = document.getElementById('totalCount');

    if (filteredData.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📭</div>
                <h4>Tidak Ada Pengajuan</h4>
                <p>Tidak ada pengajuan yang sesuai dengan filter yang dipilih.</p>
                <button onclick="resetFilter()" class="btn-primary">Reset Filter</button>
            </div>
        `;
        totalCount.textContent = '0 pengajuan';
        return;
    }

    totalCount.textContent = `${filteredData.length} pengajuan`;

    let html = '';
    filteredData.forEach((item) => {
        const statusClass = getStatusClass(item.status);
        const statusLabel = getStatusLabel(item.status);
        const tanggalFormatted = formatDate(item.tanggal);
        const kategoriLabel = item.kategori === 'akademik' ? '📚 Akademik' : '🎯 Non-Akademik';

        html += `
            <div class="pengajuan-item-dosen" data-id="${item.id}">
                <div class="pengajuan-item-header">
                    <div class="pengajuan-item-title">
                        <h4>${item.jenisLabel}</h4>
                        <span class="badge ${statusClass}">${statusLabel}</span>
                    </div>
                    <span class="pengajuan-item-date">${tanggalFormatted}</span>
                </div>
                <div class="pengajuan-item-body">
                    <div class="pengajuan-item-info">
                        <span class="info-item">👨‍🎓 ${item.mahasiswa} (${item.nim})</span>
                        <span class="info-item">${kategoriLabel}</span>
                        <span class="info-item">📅 ${tanggalFormatted}</span>
                        <span class="info-item">⏰ ${item.waktu}</span>
                        <span class="info-item">🏛️ ${item.ruangan}</span>
                    </div>
                    <p class="pengajuan-item-deskripsi">${item.deskripsi}</p>
                    <div class="pengajuan-item-actions">
                        ${item.status === 'pending' ? `
                            <button onclick="approvePengajuan('${item.id}')" class="btn-approve">✅ Setujui</button>
                            <button onclick="rejectPengajuan('${item.id}')" class="btn-reject">❌ Tolak</button>
                        ` : `
                            <span class="pengajuan-item-status">Status: ${statusLabel}</span>
                            <button onclick="viewDetail('${item.id}')" class="btn-detail">📋 Detail</button>
                        `}
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// ========== GET STATUS ==========
function getStatusClass(status) {
    const classes = {
        'pending': 'pending',
        'disetujui': 'success',
        'ditolak': 'danger'
    };
    return classes[status] || 'pending';
}

function getStatusLabel(status) {
    const labels = {
        'pending': '⏳ Menunggu',
        'disetujui': '✅ Disetujui',
        'ditolak': '❌ Ditolak'
    };
    return labels[status] || status;
}

// ========== FORMAT DATE ==========
function formatDate(dateString) {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

// ========== UPDATE STATS ==========
function updateStats() {
    const total = pengajuanData.length;
    const menunggu = pengajuanData.filter(p => p.status === 'pending').length;
    const disetujui = pengajuanData.filter(p => p.status === 'disetujui').length;
    const ditolak = pengajuanData.filter(p => p.status === 'ditolak').length;

    document.getElementById('totalPengajuan').textContent = total;
    document.getElementById('menungguPengajuan').textContent = menunggu;
    document.getElementById('disetujuiPengajuan').textContent = disetujui;
    document.getElementById('ditolakPengajuan').textContent = ditolak;
}

// ========== APPROVE PENGAJUAN ==========
function approvePengajuan(id) {
    if (!confirm('Apakah Anda yakin ingin menyetujui pengajuan ini?')) return;

    const item = pengajuanData.find(p => p.id === id);
    if (item) {
        item.status = 'disetujui';
        localStorage.setItem('pengajuanDosen', JSON.stringify(pengajuanData));
        
        // Tambah notifikasi untuk mahasiswa
        addNotifikasiMahasiswa({
            judul: '✅ Pengajuan Disetujui',
            pesan: `Pengajuan konsultasi "${item.jenisLabel}" Anda telah disetujui oleh ${item.dosen}.`,
            icon: '✅'
        });

        renderPengajuan();
        updateStats();
        showNotification('✅ Pengajuan berhasil disetujui!', 'success');
    }
}

// ========== REJECT PENGAJUAN ==========
function rejectPengajuan(id) {
    const alasan = prompt('Masukkan alasan penolakan:');
    if (alasan === null) return;
    if (alasan.trim() === '') {
        showNotification('⚠️ Alasan penolakan harus diisi!', 'error');
        return;
    }

    const item = pengajuanData.find(p => p.id === id);
    if (item) {
        item.status = 'ditolak';
        item.alasanPenolakan = alasan;
        localStorage.setItem('pengajuanDosen', JSON.stringify(pengajuanData));
        
        // Tambah notifikasi untuk mahasiswa
        addNotifikasiMahasiswa({
            judul: '❌ Pengajuan Ditolak',
            pesan: `Pengajuan konsultasi "${item.jenisLabel}" Anda ditolak. Alasan: ${alasan}`,
            icon: '❌'
        });

        renderPengajuan();
        updateStats();
        showNotification('❌ Pengajuan ditolak!', 'error');
    }
}

// ========== VIEW DETAIL ==========
function viewDetail(id) {
    const item = pengajuanData.find(p => p.id === id);
    if (!item) return;

    const statusLabel = getStatusLabel(item.status);
    const statusClass = getStatusClass(item.status);
    const tanggalFormatted = formatDate(item.tanggal);
    const tanggalPengajuan = formatDate(item.tanggalPengajuan);
    const kategoriLabel = item.kategori === 'akademik' ? '📚 Akademik' : '🎯 Non-Akademik';

    alert(`
📋 DETAIL PENGAJUAN

Judul: ${item.jenisLabel}
Kategori: ${kategoriLabel}
Mahasiswa: ${item.mahasiswa} (${item.nim})
Semester: ${item.semester}
Dosen: ${item.dosen}
Tanggal: ${tanggalFormatted}
Waktu: ${item.waktu}
Ruangan: ${item.ruangan}
Status: ${statusLabel}

Deskripsi:
${item.deskripsi}

${item.alasanPenolakan ? `Alasan Penolakan:\n${item.alasanPenolakan}` : ''}

Tanggal Pengajuan: ${tanggalPengajuan}
ID Pengajuan: ${item.id}
    `);
}

// ========== ADD NOTIFIKASI MAHASISWA ==========
function addNotifikasiMahasiswa(notif) {
    let notifikasi = JSON.parse(localStorage.getItem('notifikasiMahasiswa')) || [];
    notifikasi.unshift({
        id: 'N-' + Date.now(),
        ...notif,
        tanggal: new Date().toISOString(),
        dibaca: false,
        link: 'riwayat.html'
    });
    localStorage.setItem('notifikasiMahasiswa', JSON.stringify(notifikasi));
}

// ========== APPLY FILTER ==========
function applyFilter() {
    const status = document.getElementById('filterStatus').value;
    const kategori = document.getElementById('filterKategori').value;
    const search = document.getElementById('searchPengajuan').value.toLowerCase();

    filteredData = pengajuanData.filter(item => {
        if (status !== 'semua' && item.status !== status) return false;
        if (kategori !== 'semua' && item.kategori !== kategori) return false;
        if (search) {
            const searchText = (item.mahasiswa + ' ' + item.jenisLabel + ' ' + item.deskripsi).toLowerCase();
            if (!searchText.includes(search)) return false;
        }
        return true;
    });

    renderPengajuan();
}

// ========== RESET FILTER ==========
function resetFilter() {
    document.getElementById('filterStatus').value = 'semua';
    document.getElementById('filterKategori').value = 'semua';
    document.getElementById('searchPengajuan').value = '';
    applyFilter();
}

// ========== REFRESH DATA ==========
function refreshData() {
    const btn = document.querySelector('.refresh-btn');
    btn.textContent = '⏳';
    btn.disabled = true;

    setTimeout(() => {
        loadPengajuan();
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
        localStorage.removeItem("namaDosen");
        localStorage.removeItem("nipDosen");
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