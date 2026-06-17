// ========== PROTEKSI ROLE ==========
const role = localStorage.getItem("role");
if (role !== "mahasiswa") {
    window.location.href = "../../index.html";
}

// ========== DATA ==========
let notifikasiData = [];

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
    loadNotifikasi();
};

// ========== LOAD NOTIFIKASI ==========
function loadNotifikasi() {
    notifikasiData = JSON.parse(localStorage.getItem('notifikasiMahasiswa')) || [];

    // Tambah data dummy jika kosong
    if (notifikasiData.length === 0) {
        notifikasiData = [
            {
                id: 'N-1',
                judul: '✅ Pengajuan Disetujui',
                pesan: 'Pengajuan konsultasi "💻 Media Pembelajaran" dengan dosen Dr. Citra, M.Pd. telah disetujui.',
                tanggal: new Date(Date.now() - 3600000).toISOString(),
                dibaca: false,
                link: 'riwayat.html',
                icon: '✅'
            },
            {
                id: 'N-2',
                judul: '⏳ Jadwal Dikonfirmasi',
                pesan: 'Jadwal konsultasi "📝 Skripsi" dengan dosen Dr. Sari, M.Pd. telah dikonfirmasi untuk tanggal 15 Juni 2026 pukul 09:00 WIB.',
                tanggal: new Date(Date.now() - 7200000).toISOString(),
                dibaca: false,
                link: 'riwayat.html',
                icon: '📅'
            },
            {
                id: 'N-3',
                judul: '📢 Pengingat Konsultasi',
                pesan: 'Konsultasi "📝 Skripsi" dengan Dr. Sari, M.Pd. akan dilaksanakan besok pukul 09:00 WIB di Ruang 101.',
                tanggal: new Date(Date.now() - 86400000).toISOString(),
                dibaca: true,
                link: 'riwayat.html',
                icon: '⏰'
            },
            {
                id: 'N-4',
                judul: '❌ Pengajuan Ditolak',
                pesan: 'Pengajuan konsultasi "🌐 E-Learning" dengan dosen Dr. Ika, M.Pd. ditolak. Silakan ajukan ulang dengan topik yang lebih spesifik.',
                tanggal: new Date(Date.now() - 172800000).toISOString(),
                dibaca: true,
                link: 'riwayat.html',
                icon: '❌'
            }
        ];
        localStorage.setItem('notifikasiMahasiswa', JSON.stringify(notifikasiData));
    }

    renderNotifikasi();
    updateBadge();
}

// ========== RENDER NOTIFIKASI ==========
function renderNotifikasi() {
    const container = document.getElementById('notifikasiList');
    const totalCount = document.getElementById('totalCount');

    if (notifikasiData.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🔔</div>
                <h4>Belum Ada Notifikasi</h4>
                <p>Anda tidak memiliki notifikasi saat ini.</p>
            </div>
        `;
        totalCount.textContent = '0 notifikasi';
        return;
    }

    totalCount.textContent = `${notifikasiData.length} notifikasi`;

    let html = '';
    notifikasiData.forEach((item, index) => {
        const isRead = item.dibaca;
        const timeAgo = getTimeAgo(item.tanggal);
        const icon = item.icon || '🔔';

        html += `
            <div class="notifikasi-item ${isRead ? 'read' : 'unread'}" onclick="detailNotifikasi('${item.id}')">
                <div class="notifikasi-icon">${icon}</div>
                <div class="notifikasi-content">
                    <div class="notifikasi-header-item">
                        <h4>${item.judul}</h4>
                        ${!isRead ? '<span class="unread-badge">Baru</span>' : ''}
                    </div>
                    <p>${item.pesan}</p>
                    <span class="notifikasi-time">${timeAgo}</span>
                </div>
                <button class="notifikasi-action" onclick="event.stopPropagation(); deleteNotifikasi('${item.id}')">✕</button>
            </div>
        `;
    });

    container.innerHTML = html;
}

// ========== GET TIME AGO ==========
function getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Baru saja';
    if (minutes < 60) return `${minutes} menit lalu`;
    if (hours < 24) return `${hours} jam lalu`;
    if (days < 7) return `${days} hari lalu`;
    
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ========== DETAIL NOTIFIKASI ==========
function detailNotifikasi(id) {
    const item = notifikasiData.find(n => n.id === id);
    if (!item) return;

    // Tandai sebagai dibaca
    if (!item.dibaca) {
        item.dibaca = true;
        localStorage.setItem('notifikasiMahasiswa', JSON.stringify(notifikasiData));
        renderNotifikasi();
        updateBadge();
    }

    // Tampilkan detail
    alert(`
🔔 DETAIL NOTIFIKASI

${item.icon} ${item.judul}

${item.pesan}

📅 ${new Date(item.tanggal).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
})}

${item.link ? '🔗 Klik "OK" untuk melihat detail' : ''}
    `);

    if (item.link) {
        window.location.href = item.link;
    }
}

// ========== DELETE NOTIFIKASI ==========
function deleteNotifikasi(id) {
    if (confirm('Apakah Anda yakin ingin menghapus notifikasi ini?')) {
        notifikasiData = notifikasiData.filter(n => n.id !== id);
        localStorage.setItem('notifikasiMahasiswa', JSON.stringify(notifikasiData));
        renderNotifikasi();
        updateBadge();
        showNotification('✅ Notifikasi dihapus!', 'success');
    }
}

// ========== MARK ALL READ ==========
function markAllRead() {
    if (notifikasiData.length === 0) {
        showNotification('ℹ️ Tidak ada notifikasi', 'info');
        return;
    }

    const unreadCount = notifikasiData.filter(n => !n.dibaca).length;
    if (unreadCount === 0) {
        showNotification('ℹ️ Semua notifikasi sudah dibaca', 'info');
        return;
    }

    notifikasiData.forEach(n => n.dibaca = true);
    localStorage.setItem('notifikasiMahasiswa', JSON.stringify(notifikasiData));
    renderNotifikasi();
    updateBadge();
    showNotification('✅ Semua notifikasi ditandai sebagai dibaca!', 'success');
}

// ========== CLEAR ALL NOTIFICATIONS ==========
function clearAllNotifications() {
    if (notifikasiData.length === 0) {
        showNotification('ℹ️ Tidak ada notifikasi', 'info');
        return;
    }

    if (confirm('Apakah Anda yakin ingin menghapus semua notifikasi?')) {
        notifikasiData = [];
        localStorage.setItem('notifikasiMahasiswa', JSON.stringify(notifikasiData));
        renderNotifikasi();
        updateBadge();
        showNotification('🗑️ Semua notifikasi dihapus!', 'success');
    }
}

// ========== UPDATE BADGE ==========
function updateBadge() {
    const unreadCount = notifikasiData.filter(n => !n.dibaca).length;
    const badge = document.querySelector('.unread-badge-global');
    
    if (badge) {
        if (unreadCount > 0) {
            badge.textContent = unreadCount;
            badge.style.display = 'inline';
        } else {
            badge.style.display = 'none';
        }
    }

    // Update favicon atau title jika diperlukan
    if (unreadCount > 0) {
        document.title = `(${unreadCount}) Notifikasi | Narasa`;
    } else {
        document.title = 'Notifikasi | Narasa';
    }
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

// ========== KEYBOARD SHORTCUTS ==========
document.addEventListener('keydown', function(e) {
    if (e.altKey && e.key === 't') {
        e.preventDefault();
        toggleTheme();
    }
    if (e.altKey && e.key === 'm') {
        e.preventDefault();
        markAllRead();
    }
    if (e.altKey && e.key === 'l') {
        e.preventDefault();
        logout();
    }
});