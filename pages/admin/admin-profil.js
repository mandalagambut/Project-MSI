// ========== PROTEKSI ROLE ==========
const role = localStorage.getItem("role");
if (role !== "admin") {
    window.location.href = "../../index.html";
}

// ========== LOAD PAGE ==========
window.onload = function() {
    // Theme
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
        document.body.classList.add("dark-mode");
    }

    // User
    const nama = localStorage.getItem("namaAdmin");
    if (nama) {
        document.getElementById("namaAdmin").innerText = nama;
        document.getElementById("profileName").innerText = nama;
        document.getElementById("avatarInitial").innerText = nama.charAt(0).toUpperCase();
    }

    // NIP
    const nip = localStorage.getItem("nipAdmin");
    if (nip) {
        document.getElementById("nipAdmin").value = nip;
    }

    // Sidebar
    const sidebarState = localStorage.getItem("sidebarOpen");
    if (sidebarState === "true" && window.innerWidth <= 768) {
        document.getElementById("sidebar").classList.add("open");
        document.getElementById("sidebarOverlay").classList.add("active");
    }

    // Load data profil dari localStorage
    loadProfile();
    updateStats();
};

// ========== LOAD PROFILE ==========
function loadProfile() {
    const profileData = JSON.parse(localStorage.getItem("adminProfile")) || {};
    
    if (profileData.namaLengkap) {
        document.getElementById("namaLengkap").value = profileData.namaLengkap;
        document.getElementById("profileName").innerText = profileData.namaLengkap;
        document.getElementById("avatarInitial").innerText = profileData.namaLengkap.charAt(0).toUpperCase();
    }
    
    if (profileData.email) {
        document.getElementById("email").value = profileData.email;
    }
    
    if (profileData.telepon) {
        document.getElementById("telepon").value = profileData.telepon;
    }
    
    if (profileData.jabatan) {
        document.getElementById("jabatan").value = profileData.jabatan;
    }
    
    if (profileData.departemen) {
        document.getElementById("departemen").value = profileData.departemen;
    }
    
    if (profileData.tanggalBergabung) {
        document.getElementById("tanggalBergabung").value = profileData.tanggalBergabung;
    }
    
    if (profileData.alamat) {
        document.getElementById("alamat").value = profileData.alamat;
    }
    
    if (profileData.status) {
        document.getElementById("status").value = profileData.status;
    }
}

// ========== SAVE PROFILE ==========
function saveProfile() {
    const profileData = {
        namaLengkap: document.getElementById("namaLengkap").value,
        email: document.getElementById("email").value,
        telepon: document.getElementById("telepon").value,
        jabatan: document.getElementById("jabatan").value,
        departemen: document.getElementById("departemen").value,
        tanggalBergabung: document.getElementById("tanggalBergabung").value,
        alamat: document.getElementById("alamat").value,
        status: document.getElementById("status").value
    };
    
    // Simpan ke localStorage
    localStorage.setItem("adminProfile", JSON.stringify(profileData));
    
    // Update nama di header
    if (profileData.namaLengkap) {
        localStorage.setItem("namaAdmin", profileData.namaLengkap);
        document.getElementById("namaAdmin").innerText = profileData.namaLengkap;
        document.getElementById("profileName").innerText = profileData.namaLengkap;
        document.getElementById("avatarInitial").innerText = profileData.namaLengkap.charAt(0).toUpperCase();
    }
    
    showNotification('✅ Profil berhasil disimpan!', 'success');
}

// ========== CHANGE AVATAR ==========
function changeAvatar() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const avatarCircle = document.getElementById('avatarCircle');
                avatarCircle.style.backgroundImage = `url(${event.target.result})`;
                avatarCircle.style.backgroundSize = 'cover';
                avatarCircle.style.backgroundPosition = 'center';
                document.getElementById('avatarInitial').style.display = 'none';
                
                localStorage.setItem('adminAvatar', event.target.result);
                showNotification('✅ Foto profil berhasil diubah!', 'success');
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}

// ========== UPDATE STATS ==========
function updateStats() {
    document.getElementById("totalAktivitasAkun").innerText = "156";
    document.getElementById("konsultasiDikelola").innerText = "89";
    document.getElementById("mahasiswaTerdaftar").innerText = "156";
    document.getElementById("dosenTerdaftar").innerText = "24";
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
        background: ${type === 'success' ? '#14b8a6' : '#fef3c7'};
        color: ${type === 'success' ? 'white' : '#92400e'};
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

// ========== TOGGLE SIDEBAR ==========
function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");
    
    sidebar.classList.toggle("open");
    overlay.classList.toggle("active");
    
    const isOpen = sidebar.classList.contains("open");
    localStorage.setItem("sidebarOpen", isOpen);
}

// ========== TOGGLE THEME ==========
function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
}

// ========== LOGOUT ==========
function logout() {
    if (confirm('Apakah Anda yakin ingin logout?')) {
        localStorage.removeItem("role");
        localStorage.removeItem("namaAdmin");
        localStorage.removeItem("nipAdmin");
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
    if (e.altKey && e.key === 's') {
        e.preventDefault();
        saveProfile();
    }
    if (e.altKey && e.key === 'l') {
        e.preventDefault();
        logout();
    }
});

// ========== LOAD AVATAR ==========
const savedAvatar = localStorage.getItem('adminAvatar');
if (savedAvatar) {
    const avatarCircle = document.getElementById('avatarCircle');
    avatarCircle.style.backgroundImage = `url(${savedAvatar})`;
    avatarCircle.style.backgroundSize = 'cover';
    avatarCircle.style.backgroundPosition = 'center';
    document.getElementById('avatarInitial').style.display = 'none';
}