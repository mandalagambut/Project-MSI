// ========== PROTEKSI ROLE ==========
const role = localStorage.getItem("role");
if (role !== "admin") {
    window.location.href = "../../index.html";
}

// ========== DATA ==========
let konsultasiData = [];
let filteredKonsul = [];

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

    loadKonsultasi();
};

// ========== LOAD KONSULTASI ==========
function loadKonsultasi() {
    // Ambil dari berbagai sumber
    const pengajuan = JSON.parse(localStorage.getItem('pengajuanDosen')) || [];
    const riwayatMhs = JSON.parse(localStorage.getItem('riwayatKonsultasi')) || [];
    const jadwal = JSON.parse(localStorage.getItem('jadwalDosen')) || [];
    
    // Gabungkan semua data
    const allData = [...pengajuan, ...riwayatMhs, ...jadwal];
    
    // Filter unique dan tambahkan data dummy jika kosong
    if (allData.length === 0) {
        konsultasiData = [
            {
                id: 'K-001',
                mahasiswa: 'Mahasiswa A',
                nim: '12345678',
                dosen: 'Dr. Sari Dewi, M.Pd.',
                jenis: '📝 Skripsi',
                kategori: 'akademik',
                tanggal: '2026-06-20',
                waktu: '09:00',
                ruangan: 'Ruang 101',
                status: 'pending',
                deskripsi: 'Konsultasi metodologi penelitian'
            },
            {
                id: 'K-002',
                mahasiswa: 'Mahasiswa B',
                nim: '23456789',
                dosen: 'Dr. Taufik Hidayat, M.Pd.',
                jenis: '💻 Media Pembelajaran',
                kategori: 'akademik',
                tanggal: '2026-06-22',
                waktu: '10:00',
                ruangan: 'Ruang 102',
                status: 'disetujui',
                deskripsi: 'Konsultasi pengembangan media interaktif'
            },
            {
                id: 'K-003',
                mahasiswa: 'Mahasiswa C',
                nim: '34567890',
                dosen: 'Dr. Umi Kalsum, M.Pd.',
                jenis: '🏢 Magang',
                kategori: 'akademik',
                tanggal: '2026-06-18',
                waktu: '13:00',
                ruangan: 'Online (Zoom)',
                status: 'selesai',
                deskripsi: 'Konsultasi pelaksanaan magang'
            },
            {
                id: 'K-004',
                mahasiswa: 'Mahasiswa D',
                nim: '45678901',
                dosen: 'Dr. Zaki Mubarak, M.Pd.',
                jenis: '💼 Karir & Pengembangan Diri',
                kategori: 'non-akademik',
                tanggal: '2026-06-15',
                waktu: '08:30',
                ruangan: 'Ruang 201',
                status: 'ditolak',
                deskripsi: 'Konsultasi persiapan karir'
            },
            {
                id: 'K-005',
                mahasiswa: 'Mahasiswa E',
                nim: '56789012',
                dosen: 'Dr. Sari Dewi, M.Pd.',
                jenis: '📚 Dasar-dasar Pendidikan',
                kategori: 'akademik',
                tanggal: '2026-06-25',
                waktu: '11:00',
                ruangan: 'Ruang 103',
                status: 'pending',
                deskripsi: 'Konsultasi pemahaman dasar pendidikan'
            }
        ];
        localStorage.setItem('dataKonsultasi', JSON.stringify(konsultasiData));
    } else {
        // Ambil dari localStorage yang sudah ada
        const saved = JSON.parse(localStorage.getItem('dataKonsultasi'));
        if (saved) {
            konsultasiData = saved;
        } else {
            konsultasiData = allData;
            localStorage.setItem('dataKonsultasi', JSON.stringify(konsultasiData));
        }
    }

    filteredKonsul = [...konsultasiData];
    renderKonsultasi();
    updateStatsKonsul();
}

// ========== RENDER KONSULTASI ==========
function renderKonsultasi() {
    const container = document.getElementById('konsultasiList');
    const totalCount = document.getElementById('totalCount');

    if (filteredKonsul.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📋</div>
                <h4>Tidak Ada Konsultasi</h4>
                <p>Tidak ada data yang sesuai dengan filter yang dipilih.</p>
                <button onclick="resetFilterKonsul()" class="btn-primary">Reset Filter</button>
            </div>
        `;
        totalCount.textContent = '0 konsultasi';
        return;
    }

    totalCount.textContent = `${filteredKonsul.length} konsultasi`;

    let html = '';
    filteredKonsul.forEach((item) => {
        const statusClass = item.status === 'selesai' ? 'success' : 
                           item.status === 'disetujui' ? 'success' : 
                           item.status === 'pending' ? 'pending' : 'danger';
        const statusLabel = item.status === 'selesai' ? '📌 Selesai' : 
                           item.status === 'disetujui' ? '✅ Disetujui' : 
                           item.status === 'pending' ? '⏳ Menunggu' : '❌ Ditolak';
        const kategoriLabel = item.kategori === 'akademik' ? '📚 Akademik' : '🎯 Non-Akademik';
        const tanggalFormatted = formatDate(item.tanggal);

        html += `
            <div class="konsultasi-item" onclick="viewKonsultasiDetail('${item.id}')">
                <div class="konsultasi-item-header">
                    <div class="konsultasi-item-title">
                        <h4>${item.jenis}</h4>
                        <span class="badge ${statusClass}">${statusLabel}</span>
                    </div>
                    <span class="konsultasi-item-date">${tanggalFormatted}</span>
                </div>
                <div class="konsultasi-item-body">
                    <div class="konsultasi-item-info">
                        <span class="info-item">👨‍🎓 ${item.mahasiswa} (${item.nim})</span>
                        <span class="info-item">👨‍🏫 ${item.dosen}</span>
                        <span class="info-item">${kategoriLabel}</span>
                        <span class="info-item">⏰ ${item.waktu}</span>
                        <span class="info-item">🏛️ ${item.ruangan}</span>
                    </div>
                    <p class="konsultasi-item-deskripsi">${item.deskripsi}</p>
                    <div class="konsultasi-item-actions" onclick="event.stopPropagation();">
                        ${item.status === 'pending' ? `
                            <button onclick="approveKonsultasi('${item.id}')" class="btn-approve">✅ Setujui</button>
                            <button onclick="rejectKonsultasi('${item.id}')" class="btn-reject">❌ Tolak</button>
                        ` : `
                            <button onclick="editKonsultasi('${item.id}')" class="btn-edit">✏️ Edit</button>
                        `}
                        <button onclick="deleteKonsultasi('${item.id}')" class="btn-delete">🗑️ Hapus</button>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// ========== FORMAT DATE ==========
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

// ========== UPDATE STATS ==========
function updateStatsKonsul() {
    const total = konsultasiData.length;
    const menunggu = konsultasiData.filter(k => k.status === 'pending').length;
    const disetujui = konsultasiData.filter(k => k.status === 'disetujui').length;
    const selesai = konsultasiData.filter(k => k.status === 'selesai').length;

    document.getElementById('totalKonsultasi').textContent = total;
    document.getElementById('menungguKonsultasi').textContent = menunggu;
    document.getElementById('disetujuiKonsultasi').textContent = disetujui;
    document.getElementById('selesaiKonsultasi').textContent = selesai;
}

// ========== APPROVE KONSULTASI ==========
function approveKonsultasi(id) {
    if (!confirm('Apakah Anda yakin ingin menyetujui konsultasi ini?')) return;

    const item = konsultasiData.find(k => k.id === id);
    if (item) {
        item.status = 'disetujui';
        localStorage.setItem('dataKonsultasi', JSON.stringify(konsultasiData));
        renderKonsultasi();
        updateStatsKonsul();
        showNotification('✅ Konsultasi berhasil disetujui!', 'success');
    }
}

// ========== REJECT KONSULTASI ==========
function rejectKonsultasi(id) {
    const alasan = prompt('Masukkan alasan penolakan:');
    if (alasan === null) return;
    if (alasan.trim() === '') {
        showNotification('⚠️ Alasan penolakan harus diisi!', 'error');
        return;
    }

    const item = konsultasiData.find(k => k.id === id);
    if (item) {
        item.status = 'ditolak';
        item.alasan = alasan;
        localStorage.setItem('dataKonsultasi', JSON.stringify(konsultasiData));
        renderKonsultasi();
        updateStatsKonsul();
        showNotification('❌ Konsultasi ditolak!', 'error');
    }
}

// ========== EDIT KONSULTASI ==========
function editKonsultasi(id) {
    const item = konsultasiData.find(k => k.id === id);
    if (!item) return;

    // Simulasi edit dengan prompt
    const newStatus = prompt('Ubah status konsultasi (selesai/pending/disetujui/ditolak):', item.status);
    if (newStatus && ['selesai', 'pending', 'disetujui', 'ditolak'].includes(newStatus)) {
        item.status = newStatus;
        localStorage.setItem('dataKonsultasi', JSON.stringify(konsultasiData));
        renderKonsultasi();
        updateStatsKonsul();
        showNotification('✅ Status konsultasi berhasil diubah!', 'success');
    }
}

// ========== DELETE KONSULTASI ==========
function deleteKonsultasi(id) {
    if (!confirm('Apakah Anda yakin ingin menghapus data konsultasi ini?')) return;

    konsultasiData = konsultasiData.filter(k => k.id !== id);
    localStorage.setItem('dataKonsultasi', JSON.stringify(konsultasiData));
    renderKonsultasi();
    updateStatsKonsul();
    showNotification('🗑️ Data konsultasi berhasil dihapus!', 'success');
}

// ========== VIEW DETAIL ==========
function viewKonsultasiDetail(id) {
    const item = konsultasiData.find(k => k.id === id);
    if (!item) return;

    const statusLabel = item.status === 'selesai' ? '📌 Selesai' : 
                       item.status === 'disetujui' ? '✅ Disetujui' : 
                       item.status === 'pending' ? '⏳ Menunggu' : '❌ Ditolak';
    const kategoriLabel = item.kategori === 'akademik' ? '📚 Akademik' : '🎯 Non-Akademik';

    alert(`
📋 DETAIL KONSULTASI

Mahasiswa: ${item.mahasiswa} (${item.nim})
Dosen: ${item.dosen}
Jenis: ${item.jenis}
Kategori: ${kategoriLabel}
Tanggal: ${formatDate(item.tanggal)}
Waktu: ${item.waktu}
Ruangan: ${item.ruangan}
Status: ${statusLabel}

Deskripsi:
${item.deskripsi}

${item.alasan ? `Alasan Penolakan:\n${item.alasan}` : ''}

ID: ${item.id}
    `);
}

// ========== APPLY FILTER ==========
function applyFilterKonsul() {
    const status = document.getElementById('filterStatusKonsul').value;
    const kategori = document.getElementById('filterKategoriKonsul').value;
    const search = document.getElementById('searchKonsul').value.toLowerCase();

    filteredKonsul = konsultasiData.filter(item => {
        if (status !== 'semua' && item.status !== status) return false;
        if (kategori !== 'semua' && item.kategori !== kategori) return false;
        if (search) {
            const searchText = (item.mahasiswa + ' ' + item.dosen + ' ' + item.jenis).toLowerCase();
            if (!searchText.includes(search)) return false;
        }
        return true;
    });

    renderKonsultasi();
}

// ========== RESET FILTER ==========
function resetFilterKonsul() {
    document.getElementById('filterStatusKonsul').value = 'semua';
    document.getElementById('filterKategoriKonsul').value = 'semua';
    document.getElementById('searchKonsul').value = '';
    applyFilterKonsul();
}

// ========== EXPORT KONSULTASI ==========
function exportKonsultasi() {
    if (konsultasiData.length === 0) {
        showNotification('⚠️ Tidak ada data untuk diexport!', 'error');
        return;
    }

    const data = konsultasiData.map(item => ({
        'Mahasiswa': item.mahasiswa,
        'NIM': item.nim,
        'Dosen': item.dosen,
        'Jenis': item.jenis,
        'Kategori': item.kategori === 'akademik' ? 'Akademik' : 'Non-Akademik',
        'Tanggal': formatDate(item.tanggal),
        'Waktu': item.waktu,
        'Ruangan': item.ruangan,
        'Status': item.status === 'selesai' ? 'Selesai' : 
                 item.status === 'disetujui' ? 'Disetujui' : 
                 item.status === 'pending' ? 'Menunggu' : 'Ditolak',
        'Deskripsi': item.deskripsi
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
    a.download = `data-konsultasi-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    showNotification('✅ Data berhasil diexport!', 'success');
}

// ========== REFRESH DATA ==========
function refreshData() {
    const btn = document.querySelector('.refresh-btn');
    btn.textContent = '⏳';
    btn.disabled = true;

    setTimeout(() => {
        loadKonsultasi();
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