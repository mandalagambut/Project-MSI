// ========== PROTEKSI ROLE ==========
const role = localStorage.getItem("role");
if (role !== "dosen") {
    window.location.href = "../../index.html";
}

// ========== DATA ==========
let riwayatData = [];
let filteredRiwayat = [];

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

    loadRiwayatDosen();
};

// ========== LOAD RIWAYAT ==========
function loadRiwayatDosen() {
    // Gabungkan data dari pengajuan yang sudah selesai
    const pengajuan = JSON.parse(localStorage.getItem('pengajuanDosen')) || [];
    const jadwal = JSON.parse(localStorage.getItem('jadwalDosen')) || [];
    
    // Ambil data riwayat dari pengajuan yang sudah disetujui/selesai
    const riwayatFromPengajuan = pengajuan
        .filter(p => p.status === 'disetujui' || p.status === 'selesai')
        .map(p => ({
            id: p.id,
            mahasiswa: p.mahasiswa,
            nim: p.nim,
            jenis: p.jenisLabel,
            tanggal: p.tanggal,
            waktu: p.waktu,
            ruangan: p.ruangan,
            kategori: p.kategori,
            status: p.status === 'selesai' ? 'selesai' : 'disetujui',
            deskripsi: p.deskripsi,
            dosen: p.dosen
        }));

    // Tambahkan dari jadwal yang sudah selesai
    const riwayatFromJadwal = jadwal
        .filter(j => j.status === 'selesai')
        .map(j => ({
            id: j.id,
            mahasiswa: j.mahasiswa,
            nim: j.nim,
            jenis: j.jenis,
            tanggal: j.tanggal,
            waktu: j.waktu,
            ruangan: j.ruangan,
            kategori: 'akademik',
            status: 'selesai',
            deskripsi: j.deskripsi,
            dosen: 'Dr. Sari, M.Pd.'
        }));

    // Gabungkan dan hilangkan duplikat
    const allData = [...riwayatFromPengajuan, ...riwayatFromJadwal];
    const uniqueData = [];
    const ids = new Set();
    
    allData.forEach(item => {
        if (!ids.has(item.id)) {
            ids.add(item.id);
            uniqueData.push(item);
        }
    });

    if (uniqueData.length === 0) {
        // Data dummy
        riwayatData = [
            {
                id: 'R-1',
                mahasiswa: 'Mahasiswa A',
                nim: '12345678',
                jenis: '📝 Skripsi',
                tanggal: '2026-06-15',
                waktu: '09:00',
                ruangan: 'Ruang 101',
                kategori: 'akademik',
                status: 'selesai',
                deskripsi: 'Konsultasi metodologi penelitian',
                dosen: 'Dr. Sari, M.Pd.'
            },
            {
                id: 'R-2',
                mahasiswa: 'Mahasiswa C',
                nim: '34567890',
                jenis: '🏢 Magang',
                tanggal: '2026-06-12',
                waktu: '13:00',
                ruangan: 'Online (Zoom)',
                kategori: 'akademik',
                status: 'selesai',
                deskripsi: 'Konsultasi pelaksanaan magang',
                dosen: 'Dr. Sari, M.Pd.'
            },
            {
                id: 'R-3',
                mahasiswa: 'Mahasiswa B',
                nim: '23456789',
                jenis: '💻 Media Pembelajaran',
                tanggal: '2026-06-08',
                waktu: '10:00',
                ruangan: 'Ruang 102',
                kategori: 'akademik',
                status: 'disetujui',
                deskripsi: 'Konsultasi pengembangan media interaktif',
                dosen: 'Dr. Sari, M.Pd.'
            },
            {
                id: 'R-4',
                mahasiswa: 'Mahasiswa D',
                nim: '45678901',
                jenis: '💼 Karir & Pengembangan Diri',
                tanggal: '2026-06-05',
                waktu: '08:30',
                ruangan: 'Ruang 201',
                kategori: 'non-akademik',
                status: 'ditolak',
                deskripsi: 'Konsultasi persiapan karir',
                dosen: 'Dr. Sari, M.Pd.'
            }
        ];
        localStorage.setItem('riwayatDosen', JSON.stringify(riwayatData));
    } else {
        riwayatData = uniqueData;
        localStorage.setItem('riwayatDosen', JSON.stringify(riwayatData));
    }

    filteredRiwayat = [...riwayatData];
    renderRiwayatDosen();
    updateRiwayatStats();
}

// ========== RENDER RIWAYAT ==========
function renderRiwayatDosen() {
    const container = document.getElementById('riwayatListDosen');
    const totalCount = document.getElementById('totalCount');

    if (filteredRiwayat.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📋</div>
                <h4>Tidak Ada Riwayat</h4>
                <p>Tidak ada riwayat yang sesuai dengan filter yang dipilih.</p>
                <button onclick="resetRiwayatFilter()" class="btn-primary">Reset Filter</button>
            </div>
        `;
        totalCount.textContent = '0 konsultasi';
        return;
    }

    // Sort by date (newest first)
    filteredRiwayat.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
    totalCount.textContent = `${filteredRiwayat.length} konsultasi`;

    let html = '';
    filteredRiwayat.forEach((item) => {
        const statusClass = item.status === 'selesai' ? 'success' : 
                           item.status === 'disetujui' ? 'success' : 'danger';
        const statusLabel = item.status === 'selesai' ? '✅ Selesai' : 
                           item.status === 'disetujui' ? '✅ Disetujui' : '❌ Ditolak';
        const tanggalFormatted = formatDate(item.tanggal);
        const kategoriLabel = item.kategori === 'akademik' ? '📚 Akademik' : '🎯 Non-Akademik';

        html += `
            <div class="riwayat-item" onclick="viewRiwayatDetail('${item.id}')">
                <div class="riwayat-item-header">
                    <div class="riwayat-item-title">
                        <h4>${item.jenis}</h4>
                        <span class="badge ${statusClass}">${statusLabel}</span>
                    </div>
                    <span class="riwayat-item-date">${tanggalFormatted}</span>
                </div>
                <div class="riwayat-item-body">
                    <div class="riwayat-item-info">
                        <span class="info-item">👨‍🎓 ${item.mahasiswa} (${item.nim})</span>
                        <span class="info-item">${kategoriLabel}</span>
                        <span class="info-item">⏰ ${item.waktu}</span>
                        <span class="info-item">🏛️ ${item.ruangan}</span>
                    </div>
                    <p class="riwayat-item-deskripsi">${item.deskripsi}</p>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// ========== FORMAT DATE ==========
function formatDate(dateString) {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

// ========== UPDATE RIWAYAT STATS ==========
function updateRiwayatStats() {
    const total = riwayatData.length;
    const selesai = riwayatData.filter(r => r.status === 'selesai').length;
    const bulanIni = riwayatData.filter(r => {
        const today = new Date();
        const rDate = new Date(r.tanggal);
        return rDate.getMonth() === today.getMonth() && rDate.getFullYear() === today.getFullYear();
    }).length;
    const mahasiswa = new Set(riwayatData.map(r => r.nim)).size;

    document.getElementById('totalRiwayat').textContent = total;
    document.getElementById('selesaiRiwayat').textContent = selesai;
    document.getElementById('bulanIniRiwayat').textContent = bulanIni;
    document.getElementById('mahasiswaRiwayat').textContent = mahasiswa;
}

// ========== VIEW RIWAYAT DETAIL ==========
function viewRiwayatDetail(id) {
    const item = riwayatData.find(r => r.id === id);
    if (!item) return;

    const statusLabel = item.status === 'selesai' ? '✅ Selesai' : 
                       item.status === 'disetujui' ? '✅ Disetujui' : '❌ Ditolak';
    const kategoriLabel = item.kategori === 'akademik' ? '📚 Akademik' : '🎯 Non-Akademik';

    alert(`
📋 DETAIL RIWAYAT KONSULTASI

Mahasiswa: ${item.mahasiswa} (${item.nim})
Jenis: ${item.jenis}
Kategori: ${kategoriLabel}
Dosen: ${item.dosen}
Tanggal: ${formatDate(item.tanggal)}
Waktu: ${item.waktu}
Ruangan: ${item.ruangan}
Status: ${statusLabel}

Deskripsi:
${item.deskripsi}

ID: ${item.id}
    `);
}

// ========== APPLY RIWAYAT FILTER ==========
function applyRiwayatFilter() {
    const status = document.getElementById('filterStatusRiwayat').value;
    const kategori = document.getElementById('filterKategoriRiwayat').value;
    const search = document.getElementById('searchRiwayatDosen').value.toLowerCase();

    filteredRiwayat = riwayatData.filter(item => {
        if (status !== 'semua' && item.status !== status) return false;
        if (kategori !== 'semua' && item.kategori !== kategori) return false;
        if (search) {
            const searchText = (item.mahasiswa + ' ' + item.jenis + ' ' + item.deskripsi).toLowerCase();
            if (!searchText.includes(search)) return false;
        }
        return true;
    });

    renderRiwayatDosen();
}

// ========== RESET RIWAYAT FILTER ==========
function resetRiwayatFilter() {
    document.getElementById('filterStatusRiwayat').value = 'semua';
    document.getElementById('filterKategoriRiwayat').value = 'semua';
    document.getElementById('searchRiwayatDosen').value = '';
    applyRiwayatFilter();
}

// ========== EXPORT RIWAYAT ==========
function exportRiwayat() {
    if (riwayatData.length === 0) {
        showNotification('⚠️ Tidak ada data untuk diexport!', 'error');
        return;
    }

    const data = riwayatData.map(item => ({
        'Mahasiswa': item.mahasiswa,
        'NIM': item.nim,
        'Jenis': item.jenis,
        'Kategori': item.kategori === 'akademik' ? 'Akademik' : 'Non-Akademik',
        'Dosen': item.dosen,
        'Tanggal': formatDate(item.tanggal),
        'Waktu': item.waktu,
        'Ruangan': item.ruangan,
        'Status': item.status === 'selesai' ? 'Selesai' : item.status === 'disetujui' ? 'Disetujui' : 'Ditolak',
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
    a.download = `riwayat-konsultasi-dosen-${new Date().toISOString().slice(0,10)}.csv`;
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
        loadRiwayatDosen();
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