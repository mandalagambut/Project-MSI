// ========== PROTEKSI ROLE ==========
const role = localStorage.getItem("role");
if (role !== "mahasiswa") {
    window.location.href = "../../index.html";
}

// ========== DATA MAHASISWA ==========
const mahasiswaData = {
    nama: localStorage.getItem("namaMahasiswa") || "User",
    nim: localStorage.getItem("nimMahasiswa") || "12345678"
};

// ========== DATA KONSULTASI LENGKAP ==========
const konsultasiData = {
    // ===== AKADEMIK =====
    akademik: {
        // Semester 1-2 (Dasar)
        '1-2': [
            { id: 'pengantar-pendidikan', label: '📖 Pengantar Pendidikan', icon: '📖', dosen: ['Dr. Ahmad Fauzi, M.Pd.', 'Dr. Siti Rahayu, M.Pd.'] },
            { id: 'dasar-pendidikan', label: '📚 Dasar-dasar Pendidikan', icon: '📚', dosen: ['Dr. Budi Santoso, M.Pd.', 'Dr. Dewi Lestari, M.Pd.'] },
            { id: 'psikologi-pendidikan', label: '🧠 Psikologi Pendidikan', icon: '🧠', dosen: ['Dr. Endang Wijaya, M.Pd.', 'Dr. Farid Hidayat, M.Pd.'] },
            { id: 'filsafat-pendidikan', label: '📜 Filsafat Pendidikan', icon: '📜', dosen: ['Dr. Gina Permata, M.Pd.', 'Dr. Heri Susanto, M.Pd.'] }
        ],
        // Semester 3-4 (Pengembangan)
        '3-4': [
            { id: 'media-pembelajaran', label: '💻 Media Pembelajaran', icon: '💻', dosen: ['Dr. Citra Dewi, M.Pd.', 'Dr. Fajar Nugroho, M.Pd.'] },
            { id: 'kurikulum-pembelajaran', label: '📋 Kurikulum dan Pembelajaran', icon: '📋', dosen: ['Dr. Gita Purnama, M.Pd.', 'Dr. Hadi Pratama, M.Pd.'] },
            { id: 'e-learning', label: '🌐 E-Learning dan Teknologi', icon: '🌐', dosen: ['Dr. Ika Sari, M.Pd.', 'Dr. Joko Widodo, M.Pd.'] },
            { id: 'metode-penelitian', label: '🔬 Metode Penelitian Pendidikan', icon: '🔬', dosen: ['Dr. Kiki Amalia, M.Pd.', 'Dr. Luki Hermawan, M.Pd.'] },
            { id: 'statistika-pendidikan', label: '📊 Statistika Pendidikan', icon: '📊', dosen: ['Dr. Mila Febrianti, M.Pd.', 'Dr. Nanda Pratama, M.Pd.'] }
        ],
        // Semester 5-6 (Spesialisasi)
        '5-6': [
            { id: 'desain-pembelajaran', label: '🎨 Desain Pembelajaran', icon: '🎨', dosen: ['Dr. Lina Marlina, M.Pd.', 'Dr. Maman Suherman, M.Pd.'] },
            { id: 'evaluasi-pembelajaran', label: '📊 Evaluasi Pembelajaran', icon: '📊', dosen: ['Dr. Nia Kurnia, M.Pd.', 'Dr. Oki Setiawan, M.Pd.'] },
            { id: 'inovasi-pendidikan', label: '💡 Inovasi Pendidikan', icon: '💡', dosen: ['Dr. Putri Indah, M.Pd.', 'Dr. Rudi Hartono, M.Pd.'] },
            { id: 'manajemen-pendidikan', label: '🏛️ Manajemen Pendidikan', icon: '🏛️', dosen: ['Dr. Sari Wulandari, M.Pd.', 'Dr. Taufik Hidayat, M.Pd.'] },
            { id: 'pembelajaran-berdiferensiasi', label: '🎯 Pembelajaran Berdiferensiasi', icon: '🎯', dosen: ['Dr. Umi Kalsum, M.Pd.', 'Dr. Vera Anggraini, M.Pd.'] },
            { id: 'assesmen-pembelajaran', label: '📝 Asesmen Pembelajaran', icon: '📝', dosen: ['Dr. Wawan Setiawan, M.Pd.', 'Dr. Yani Nurhayati, M.Pd.'] }
        ],
        // Semester 7-8 (Akhir - Tugas Akhir)
        '7-8': [
            { id: 'skripsi', label: '📝 Skripsi / Tugas Akhir', icon: '📝', dosen: ['Dr. Sari Dewi, M.Pd.', 'Dr. Taufik Hidayat, M.Pd.', 'Dr. Umi Kalsum, M.Pd.', 'Dr. Zaki Mubarak, M.Pd.'] },
            { id: 'magang', label: '🏢 Magang / Praktik Kerja', icon: '🏢', dosen: ['Dr. Vina Amalia, M.Pd.', 'Dr. Wawan Setiawan, M.Pd.', 'Dr. Yani Nurhayati, M.Pd.'] },
            { id: 'penelitian-tindakan', label: '🔬 Penelitian Tindakan Kelas', icon: '🔬', dosen: ['Dr. Yani Nurhayati, M.Pd.', 'Dr. Zaki Mubarak, M.Pd.', 'Dr. Sari Dewi, M.Pd.'] },
            { id: 'pengabdian-masyarakat', label: '🤝 Pengabdian Masyarakat', icon: '🤝', dosen: ['Dr. Rudi Hartono, M.Pd.', 'Dr. Taufik Hidayat, M.Pd.'] },
            { id: 'seminar-proposal', label: '📊 Seminar Proposal', icon: '📊', dosen: ['Dr. Sari Dewi, M.Pd.', 'Dr. Umi Kalsum, M.Pd.', 'Dr. Zaki Mubarak, M.Pd.'] },
            { id: 'sidang-skripsi', label: '🎓 Sidang Skripsi', icon: '🎓', dosen: ['Dr. Taufik Hidayat, M.Pd.', 'Dr. Sari Dewi, M.Pd.', 'Dr. Zaki Mubarak, M.Pd.'] }
        ]
    },
    // ===== NON-AKADEMIK =====
    nonAkademik: [
        { id: 'karir', label: '💼 Karir & Pengembangan Diri', icon: '💼', dosen: ['Dr. Asep Saepudin, M.Pd.', 'Dr. Dian Pratiwi, M.Pd.'] },
        { id: 'konseling', label: '🧠 Konseling Akademik', icon: '🧠', dosen: ['Dr. Endang Wijaya, M.Pd.', 'Dr. Farid Hidayat, M.Pd.'] },
        { id: 'organisasi', label: '🏛️ Organisasi Kemahasiswaan', icon: '🏛️', dosen: ['Dr. Gina Permata, M.Pd.', 'Dr. Heri Susanto, M.Pd.'] },
        { id: 'kewirausahaan', label: '💰 Kewirausahaan Mahasiswa', icon: '💰', dosen: ['Dr. Indra Pratama, M.Pd.', 'Dr. Jamil Azhari, M.Pd.'] },
        { id: 'beasiswa', label: '🏅 Beasiswa & Prestasi', icon: '🏅', dosen: ['Dr. Kiki Amalia, M.Pd.', 'Dr. Luki Hermawan, M.Pd.'] },
        { id: 'penelitian-dosen', label: '🔬 Penelitian Bersama Dosen', icon: '🔬', dosen: ['Dr. Mila Febrianti, M.Pd.', 'Dr. Nanda Pratama, M.Pd.'] },
        { id: 'publikasi', label: '📄 Publikasi Ilmiah', icon: '📄', dosen: ['Dr. Oki Setiawan, M.Pd.', 'Dr. Putri Indah, M.Pd.'] },
        { id: 'keprofesian', label: '📋 Sertifikasi Profesi', icon: '📋', dosen: ['Dr. Rudi Hartono, M.Pd.', 'Dr. Sari Wulandari, M.Pd.'] }
    ]
};

// ========== VARIABLE ==========
let selectedJenis = null;

// ========== LOAD PAGE ==========
window.onload = function() {
    // Theme
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
        document.body.classList.add("dark-mode");
    }

    // Nama
    document.getElementById("namaMahasiswa").innerText = mahasiswaData.nama;

    // Sidebar
    const sidebarState = localStorage.getItem("sidebarOpen");
    if (sidebarState === "true" && window.innerWidth <= 768) {
        document.getElementById("sidebar").classList.add("open");
        document.getElementById("sidebarOverlay").classList.add("active");
    }

    // Set min date untuk tanggal
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 2); // H+2
    document.getElementById('tanggal').setAttribute('min', minDate.toISOString().split('T')[0]);

    // Event listeners
    document.getElementById('semester').addEventListener('change', handleSemesterChange);
    document.getElementById('kategori').addEventListener('change', handleKategoriChange);
    document.getElementById('pengajuanForm').addEventListener('submit', handleSubmit);
};

// ========== HANDLE SEMESTER CHANGE ==========
function handleSemesterChange() {
    const semester = parseInt(document.getElementById('semester').value);
    const kategori = document.getElementById('kategori').value;
    
    if (semester && kategori) {
        renderJenisOptions(semester, kategori);
    } else {
        showPlaceholder();
    }
}

// ========== HANDLE KATEGORI CHANGE ==========
function handleKategoriChange() {
    const semester = parseInt(document.getElementById('semester').value);
    const kategori = document.getElementById('kategori').value;
    
    if (semester && kategori) {
        renderJenisOptions(semester, kategori);
    } else {
        showPlaceholder();
    }
}

// ========== RENDER JENIS OPTIONS ==========
function renderJenisOptions(semester, kategori) {
    const container = document.getElementById('jenisOptions');
    const placeholder = document.getElementById('jenisPlaceholder');
    const info = document.getElementById('jenisInfo');
    
    let options = [];
    let semesterKey = '';
    
    if (kategori === 'akademik') {
        // Tentukan semester key
        if (semester <= 2) semesterKey = '1-2';
        else if (semester <= 4) semesterKey = '3-4';
        else if (semester <= 6) semesterKey = '5-6';
        else semesterKey = '7-8';
        
        options = konsultasiData.akademik[semesterKey] || [];
        info.textContent = `💡 Pilih salah satu jenis konsultasi akademik untuk Semester ${semester}`;
    } else if (kategori === 'non-akademik') {
        options = konsultasiData.nonAkademik;
        info.textContent = '💡 Pilih salah satu jenis konsultasi non-akademik';
    }
    
    if (options.length === 0) {
        showPlaceholder();
        return;
    }
    
    // Hide placeholder, show options
    placeholder.style.display = 'none';
    container.style.display = 'grid';
    container.innerHTML = '';
    
    options.forEach(opt => {
        const label = document.createElement('label');
        label.className = 'jenis-option';
        label.dataset.id = opt.id;
        label.dataset.dosen = JSON.stringify(opt.dosen);
        label.innerHTML = `
            <input type="radio" name="jenisKonsultasi" value="${opt.id}">
            <span class="jenis-icon">${opt.icon || '📋'}</span>
            <span class="jenis-label">${opt.label}</span>
            <span class="jenis-dosen">👨‍🏫 ${opt.dosen.join(', ')}</span>
        `;
        container.appendChild(label);
    });
    
    // Event listener untuk radio buttons
    container.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const label = this.closest('.jenis-option');
            const id = label.dataset.id;
            const dosenList = JSON.parse(label.dataset.dosen);
            const labelText = label.querySelector('.jenis-label').textContent;
            
            selectedJenis = { id, label: labelText, dosen: dosenList };
            
            // Update dosen select
            updateDosenOptions(dosenList);
            
            // Highlight selected
            container.querySelectorAll('.jenis-option').forEach(el => {
                el.classList.remove('selected');
            });
            label.classList.add('selected');
        });
    });
}

// ========== SHOW PLACEHOLDER ==========
function showPlaceholder() {
    document.getElementById('jenisPlaceholder').style.display = 'flex';
    document.getElementById('jenisOptions').style.display = 'none';
    document.getElementById('jenisOptions').innerHTML = '';
    document.getElementById('jenisInfo').textContent = '💡 Silakan pilih Semester dan Kategori terlebih dahulu';
}

// ========== UPDATE DOSEN OPTIONS ==========
function updateDosenOptions(dosenList) {
    const dosenSelect = document.getElementById('dosen');
    dosenSelect.innerHTML = '<option value="">Pilih Dosen</option>';
    
    dosenList.forEach(dosen => {
        const option = document.createElement('option');
        option.value = dosen;
        option.textContent = dosen;
        dosenSelect.appendChild(option);
    });
    
    dosenSelect.disabled = false;
}

// ========== HANDLE SUBMIT ==========
function handleSubmit(e) {
    e.preventDefault();

    // Validasi
    const semester = document.getElementById('semester').value;
    const kategori = document.getElementById('kategori').value;
    const jenisRadio = document.querySelector('input[name="jenisKonsultasi"]:checked');
    const dosen = document.getElementById('dosen').value;
    const tanggal = document.getElementById('tanggal').value;
    const waktu = document.getElementById('waktu').value;
    const deskripsi = document.getElementById('deskripsi').value;

    if (!semester) {
        showNotification('⚠️ Silakan pilih semester Anda!', 'error');
        return;
    }
    
    if (!kategori) {
        showNotification('⚠️ Silakan pilih kategori konsultasi!', 'error');
        return;
    }
    
    if (!jenisRadio) {
        showNotification('⚠️ Silakan pilih jenis konsultasi!', 'error');
        return;
    }
    
    if (!dosen) {
        showNotification('⚠️ Silakan pilih dosen!', 'error');
        return;
    }
    
    if (!tanggal) {
        showNotification('⚠️ Silakan pilih tanggal konsultasi!', 'error');
        return;
    }
    
    if (!waktu) {
        showNotification('⚠️ Silakan pilih waktu konsultasi!', 'error');
        return;
    }
    
    if (!deskripsi || deskripsi.trim().length < 10) {
        showNotification('⚠️ Deskripsi minimal 10 karakter!', 'error');
        return;
    }

    // Get jenis label
    const jenisLabel = jenisRadio.closest('.jenis-option').querySelector('.jenis-label').textContent;
    const jenisIcon = jenisRadio.closest('.jenis-option').querySelector('.jenis-icon').textContent;

    // Buat data pengajuan
    const pengajuan = {
        id: 'P-' + Date.now(),
        mahasiswa: mahasiswaData.nama,
        nim: mahasiswaData.nim,
        semester: semester,
        kategori: kategori,
        jenis: jenisRadio.value,
        jenisLabel: `${jenisIcon} ${jenisLabel}`,
        dosen: dosen,
        tanggal: tanggal,
        waktu: waktu,
        ruangan: document.getElementById('ruangan').value,
        deskripsi: deskripsi,
        lampiran: document.getElementById('lampiran').files[0]?.name || '-',
        status: 'pending',
        tanggalPengajuan: new Date().toISOString()
    };

    // Simpan ke localStorage
    let riwayat = JSON.parse(localStorage.getItem('riwayatKonsultasi')) || [];
    riwayat.unshift(pengajuan);
    localStorage.setItem('riwayatKonsultasi', JSON.stringify(riwayat));

    // Simpan ke notifikasi
    let notifikasi = JSON.parse(localStorage.getItem('notifikasiMahasiswa')) || [];
    notifikasi.unshift({
        id: 'N-' + Date.now(),
        judul: '📝 Pengajuan Konsultasi Berhasil',
        pesan: `Pengajuan konsultasi "${jenisLabel}" dengan dosen ${dosen} berhasil diajukan. Tunggu konfirmasi dari dosen.`,
        tanggal: new Date().toISOString(),
        dibaca: false,
        link: 'riwayat.html',
        icon: '📝'
    });
    localStorage.setItem('notifikasiMahasiswa', JSON.stringify(notifikasi));

    showNotification('✅ Pengajuan konsultasi berhasil dikirim!', 'success');

    // Reset form setelah 2 detik
    setTimeout(() => {
        resetForm();
    }, 2000);
}

// ========== RESET FORM ==========
function resetForm() {
    document.getElementById('pengajuanForm').reset();
    document.getElementById('dosen').innerHTML = '<option value="">Pilih Jenis Konsultasi Terlebih Dahulu</option>';
    document.getElementById('dosen').disabled = true;
    document.getElementById('jenisOptions').innerHTML = '';
    document.getElementById('jenisOptions').style.display = 'none';
    document.getElementById('jenisPlaceholder').style.display = 'flex';
    document.getElementById('jenisInfo').textContent = '💡 Silakan pilih Semester dan Kategori terlebih dahulu';
    selectedJenis = null;
    
    // Reset min date
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 2);
    document.getElementById('tanggal').setAttribute('min', minDate.toISOString().split('T')[0]);
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