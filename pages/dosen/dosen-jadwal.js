// ========== PROTEKSI ROLE ==========
const role = localStorage.getItem("role");
if (role !== "dosen") {
    window.location.href = "../../index.html";
}

// ========== VARIABEL ==========
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
let jadwalData = [];
let filteredJadwal = [];

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

    loadJadwal();
    renderCalendar(currentMonth, currentYear);
};

// ========== LOAD JADWAL ==========
function loadJadwal() {
    const savedData = JSON.parse(localStorage.getItem('jadwalDosen')) || [];
    
    if (savedData.length === 0) {
        jadwalData = [
            {
                id: 'J-1',
                mahasiswa: 'Mahasiswa A',
                nim: '12345678',
                jenis: '📝 Skripsi',
                tanggal: '2026-06-20',
                waktu: '09:00',
                ruangan: 'Ruang 101',
                status: 'akan-datang',
                deskripsi: 'Konsultasi metodologi penelitian'
            },
            {
                id: 'J-2',
                mahasiswa: 'Mahasiswa C',
                nim: '34567890',
                jenis: '🏢 Magang',
                tanggal: '2026-06-22',
                waktu: '13:00',
                ruangan: 'Online (Zoom)',
                status: 'akan-datang',
                deskripsi: 'Konsultasi pelaksanaan magang'
            },
            {
                id: 'J-3',
                mahasiswa: 'Mahasiswa B',
                nim: '23456789',
                jenis: '💻 Media Pembelajaran',
                tanggal: '2026-06-18',
                waktu: '10:00',
                ruangan: 'Ruang 102',
                status: 'selesai',
                deskripsi: 'Konsultasi pengembangan media'
            },
            {
                id: 'J-4',
                mahasiswa: 'Mahasiswa E',
                nim: '56789012',
                jenis: '📚 Dasar Pendidikan',
                tanggal: new Date().toISOString().split('T')[0],
                waktu: '11:00',
                ruangan: 'Ruang 103',
                status: 'hari-ini',
                deskripsi: 'Konsultasi pemahaman dasar pendidikan'
            },
            {
                id: 'J-5',
                mahasiswa: 'Mahasiswa F',
                nim: '67890123',
                jenis: '🎨 Desain Pembelajaran',
                tanggal: new Date().toISOString().split('T')[0],
                waktu: '14:00',
                ruangan: 'Ruang 201',
                status: 'hari-ini',
                deskripsi: 'Konsultasi desain pembelajaran interaktif'
            }
        ];
        localStorage.setItem('jadwalDosen', JSON.stringify(jadwalData));
    } else {
        jadwalData = savedData;
    }

    filteredJadwal = [...jadwalData];
    renderJadwal();
    updateJadwalStats();
}

// ========== RENDER JADWAL ==========
function renderJadwal() {
    const container = document.getElementById('jadwalList');
    const totalCount = document.getElementById('totalCount');

    if (filteredJadwal.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📅</div>
                <h4>Tidak Ada Jadwal</h4>
                <p>Tidak ada jadwal yang sesuai dengan filter yang dipilih.</p>
            </div>
        `;
        totalCount.textContent = '0 jadwal';
        return;
    }

    // Sort by date
    filteredJadwal.sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));
    totalCount.textContent = `${filteredJadwal.length} jadwal`;

    let html = '';
    filteredJadwal.forEach((item) => {
        const statusClass = item.status === 'selesai' ? 'success' : 
                           item.status === 'hari-ini' ? 'warning' : 'pending';
        const statusLabel = item.status === 'selesai' ? '✅ Selesai' : 
                           item.status === 'hari-ini' ? '🔄 Hari Ini' : '📅 Akan Datang';
        const tanggalFormatted = formatDate(item.tanggal);
        const isToday = item.tanggal === new Date().toISOString().split('T')[0];

        html += `
            <div class="jadwal-item ${isToday ? 'today' : ''}">
                <div class="jadwal-item-header">
                    <div class="jadwal-item-title">
                        <h4>${item.jenis}</h4>
                        <span class="badge ${statusClass}">${statusLabel}</span>
                    </div>
                    <span class="jadwal-item-date">${tanggalFormatted}</span>
                </div>
                <div class="jadwal-item-body">
                    <div class="jadwal-item-info">
                        <span class="info-item">👨‍🎓 ${item.mahasiswa} (${item.nim})</span>
                        <span class="info-item">⏰ ${item.waktu}</span>
                        <span class="info-item">🏛️ ${item.ruangan}</span>
                    </div>
                    <p class="jadwal-item-deskripsi">${item.deskripsi}</p>
                    <div class="jadwal-item-actions">
                        ${item.status !== 'selesai' ? `
                            <button onclick="markComplete('${item.id}')" class="btn-approve">✅ Tandai Selesai</button>
                            <button onclick="viewJadwalDetail('${item.id}')" class="btn-detail">📋 Detail</button>
                        ` : `
                            <button onclick="viewJadwalDetail('${item.id}')" class="btn-detail">📋 Detail</button>
                        `}
                    </div>
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

// ========== UPDATE JADWAL STATS ==========
function updateJadwalStats() {
    const total = jadwalData.length;
    const hariIni = jadwalData.filter(j => j.status === 'hari-ini').length;
    const mingguIni = jadwalData.filter(j => {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        const jadwalDate = new Date(j.tanggal);
        return jadwalDate >= startOfWeek && jadwalDate <= endOfWeek;
    }).length;
    const selesai = jadwalData.filter(j => j.status === 'selesai').length;

    document.getElementById('totalJadwal').textContent = total;
    document.getElementById('jadwalHariIni').textContent = hariIni;
    document.getElementById('jadwalMingguIni').textContent = mingguIni;
    document.getElementById('jadwalSelesai').textContent = selesai;
}

// ========== MARK COMPLETE ==========
function markComplete(id) {
    if (!confirm('Tandai jadwal ini sebagai selesai?')) return;

    const item = jadwalData.find(j => j.id === id);
    if (item) {
        item.status = 'selesai';
        localStorage.setItem('jadwalDosen', JSON.stringify(jadwalData));
        renderJadwal();
        updateJadwalStats();
        showNotification('✅ Jadwal ditandai selesai!', 'success');
    }
}

// ========== VIEW JADWAL DETAIL ==========
function viewJadwalDetail(id) {
    const item = jadwalData.find(j => j.id === id);
    if (!item) return;

    alert(`
📋 DETAIL JADWAL KONSULTASI

Mahasiswa: ${item.mahasiswa} (${item.nim})
Jenis: ${item.jenis}
Tanggal: ${formatDate(item.tanggal)}
Waktu: ${item.waktu}
Ruangan: ${item.ruangan}
Status: ${item.status === 'selesai' ? '✅ Selesai' : item.status === 'hari-ini' ? '🔄 Hari Ini' : '📅 Akan Datang'}

Deskripsi:
${item.deskripsi}

ID Jadwal: ${item.id}
    `);
}

// ========== APPLY JADWAL FILTER ==========
function applyJadwalFilter() {
    const filter = document.getElementById('filterJadwal').value;
    const today = new Date().toISOString().split('T')[0];

    switch(filter) {
        case 'hari-ini':
            filteredJadwal = jadwalData.filter(j => j.tanggal === today);
            break;
        case 'minggu-ini':
            const startOfWeek = new Date();
            startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            filteredJadwal = jadwalData.filter(j => {
                const jadwalDate = new Date(j.tanggal);
                return jadwalDate >= startOfWeek && jadwalDate <= endOfWeek;
            });
            break;
        case 'selesai':
            filteredJadwal = jadwalData.filter(j => j.status === 'selesai');
            break;
        case 'akan-datang':
            filteredJadwal = jadwalData.filter(j => j.status !== 'selesai' && j.tanggal > today);
            break;
        default:
            filteredJadwal = [...jadwalData];
    }

    renderJadwal();
}

// ========== CALENDAR FUNCTIONS ==========
function renderCalendar(month, year) {
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                       'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    
    document.getElementById('calendarMonth').textContent = monthNames[month] + ' ' + year;
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    const calendarDays = document.getElementById('calendarDays');
    calendarDays.innerHTML = '';
    
    const today = new Date();
    const todayDate = today.getDate();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();
    const todayStr = today.toISOString().split('T')[0];

    // Previous month
    for (let i = firstDay - 1; i >= 0; i--) {
        const day = document.createElement('div');
        day.className = 'calendar-day other-month';
        day.textContent = daysInPrevMonth - i;
        calendarDays.appendChild(day);
    }
    
    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
        const day = document.createElement('div');
        day.className = 'calendar-day';
        day.textContent = i;
        
        const dateStr = year + '-' + String(month + 1).padStart(2, '0') + '-' + String(i).padStart(2, '0');
        
        if (i === todayDate && month === todayMonth && year === todayYear) {
            day.classList.add('today');
        }
        
        // Check if there's a schedule on this day
        const hasSchedule = jadwalData.some(j => j.tanggal === dateStr);
        if (hasSchedule) {
            day.classList.add('has-event');
        }
        
        day.addEventListener('click', function() {
            if (!this.classList.contains('other-month')) {
                const dateStr = year + '-' + String(month + 1).padStart(2, '0') + '-' + String(i).padStart(2, '0');
                const schedules = jadwalData.filter(j => j.tanggal === dateStr);
                if (schedules.length > 0) {
                    let msg = `📅 ${dateStr}\n\n`;
                    schedules.forEach((s, idx) => {
                        msg += `${idx+1}. ${s.jenis}\n   👨‍🎓 ${s.mahasiswa}\n   ⏰ ${s.waktu}\n   🏛️ ${s.ruangan}\n\n`;
                    });
                    alert(msg);
                } else {
                    alert(`📅 ${dateStr}\nTidak ada jadwal konsultasi.`);
                }
            }
        });
        
        calendarDays.appendChild(day);
    }
    
    // Next month
    const totalDays = firstDay + daysInMonth;
    const remainingDays = (7 - (totalDays % 7)) % 7;
    for (let i = 1; i <= remainingDays; i++) {
        const day = document.createElement('div');
        day.className = 'calendar-day other-month';
        day.textContent = i;
        calendarDays.appendChild(day);
    }
}

function prevMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar(currentMonth, currentYear);
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar(currentMonth, currentYear);
}

// ========== EXPORT JADWAL ==========
function exportJadwal() {
    if (jadwalData.length === 0) {
        showNotification('⚠️ Tidak ada data untuk diexport!', 'error');
        return;
    }

    const data = jadwalData.map(item => ({
        'Mahasiswa': item.mahasiswa,
        'NIM': item.nim,
        'Jenis': item.jenis,
        'Tanggal': formatDate(item.tanggal),
        'Waktu': item.waktu,
        'Ruangan': item.ruangan,
        'Status': item.status === 'selesai' ? 'Selesai' : item.status === 'hari-ini' ? 'Hari Ini' : 'Akan Datang',
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
    a.download = `jadwal-konsultasi-${new Date().toISOString().slice(0,10)}.csv`;
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
        loadJadwal();
        renderCalendar(currentMonth, currentYear);
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