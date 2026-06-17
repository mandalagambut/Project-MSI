// ========== PROTEKSI ROLE ==========
const role = localStorage.getItem("role");
if (role !== "admin") {
    window.location.href = "../../index.html";
}

// ========== LOAD PAGE ==========
window.onload = function() {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
        document.body.classList.add("dark-mode");
        document.getElementById('themeDark').classList.add('active');
    } else if (theme === 'light') {
        document.getElementById('themeLight').classList.add('active');
    } else {
        document.getElementById('themeSystem').classList.add('active');
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

    loadSettings();
};

// ========== LOAD SETTINGS ==========
function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('adminSettings')) || {};
    
    if (settings.notifEmail !== undefined) {
        document.getElementById('notifEmail').checked = settings.notifEmail;
    }
    if (settings.notifPengajuan !== undefined) {
        document.getElementById('notifPengajuan').checked = settings.notifPengajuan;
    }
    if (settings.notifSistem !== undefined) {
        document.getElementById('notifSistem').checked = settings.notifSistem;
    }
    if (settings.sessionTimeout) {
        document.getElementById('sessionTimeout').value = settings.sessionTimeout;
    }
    if (settings.twoFactor !== undefined) {
        document.getElementById('twoFactor').checked = settings.twoFactor;
    }
}

// ========== SET THEME ==========
function setTheme(theme) {
    document.querySelectorAll('.theme-option').forEach(el => el.classList.remove('active'));
    
    if (theme === 'light') {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
        document.getElementById('themeLight').classList.add('active');
    } else if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
        document.getElementById('themeDark').classList.add('active');
    } else {
        // System
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        localStorage.setItem('theme', 'system');
        document.getElementById('themeSystem').classList.add('active');
    }
}

// ========== SAVE SETTINGS ==========
function saveSettings() {
    const settings = {
        notifEmail: document.getElementById('notifEmail').checked,
        notifPengajuan: document.getElementById('notifPengajuan').checked,
        notifSistem: document.getElementById('notifSistem').checked,
        sessionTimeout: document.getElementById('sessionTimeout').value,
        twoFactor: document.getElementById('twoFactor').checked
    };

    localStorage.setItem('adminSettings', JSON.stringify(settings));
    showNotification('✅ Pengaturan berhasil disimpan!', 'success');
}

// ========== CHANGE PASSWORD ==========
function changePassword() {
    const currentPass = prompt('Masukkan password saat ini:');
    if (currentPass === null) return;
    
    if (currentPass !== 'admin123') {
        showNotification('❌ Password saat ini salah!', 'error');
        return;
    }
    
    const newPass = prompt('Masukkan password baru:');
    if (newPass === null || newPass.length < 6) {
        showNotification('❌ Password minimal 6 karakter!', 'error');
        return;
    }
    
    const confirmPass = prompt('Konfirmasi password baru:');
    if (newPass !== confirmPass) {
        showNotification('❌ Password tidak sama!', 'error');
        return;
    }
    
    localStorage.setItem('adminPassword', newPass);
    showNotification('✅ Password berhasil diubah!', 'success');
}

// ========== BACKUP DATA ==========
function backupData() {
    const data = {
        mahasiswa: JSON.parse(localStorage.getItem('dataMahasiswa')) || [],
        dosen: JSON.parse(localStorage.getItem('dataDosen')) || [],
        konsultasi: JSON.parse(localStorage.getItem('dataKonsultasi')) || [],
        settings: JSON.parse(localStorage.getItem('adminSettings')) || {},
        profile: JSON.parse(localStorage.getItem('adminProfile')) || {}
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);

    showNotification('✅ Backup data berhasil!', 'success');
}

// ========== RESET DATA ==========
function resetData() {
    if (!confirm('⚠️ Anda yakin ingin menghapus semua data? Tindakan ini tidak dapat dibatalkan!')) return;
    if (!confirm('Konfirmasi: Hapus semua data sistem?')) return;

    localStorage.removeItem('dataMahasiswa');
    localStorage.removeItem('dataDosen');
    localStorage.removeItem('dataKonsultasi');
    localStorage.removeItem('adminSettings');
    
    showNotification('🗑️ Semua data berhasil direset!', 'success');
    
    setTimeout(() => {
        window.location.reload();
    }, 1500);
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
    const isDark = document.body.classList.contains('dark-mode');
    if (isDark) {
        setTheme('light');
    } else {
        setTheme('dark');
    }
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