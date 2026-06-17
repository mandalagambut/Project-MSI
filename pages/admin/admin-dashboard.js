// ========== PROTEKSI ROLE ==========
const role = localStorage.getItem("role");
if (role !== "admin") {
    window.location.href = "../../index.html";
}

// ========== VARIABEL GLOBAL ==========
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
let activityChart = null;

// ========== DATA KONSULTASI ==========
const consultationEvents = {
    '2026-6-1': 'selesai',
    '2026-6-2': 'berlangsung',
    '2026-6-3': 'selesai',
    '2026-6-4': 'menunggu',
    '2026-6-5': 'menunggu',
    '2026-6-8': 'selesai',
    '2026-6-9': 'berlangsung',
    '2026-6-10': 'berlangsung',
    '2026-6-11': 'selesai',
    '2026-6-12': 'selesai',
    '2026-6-15': 'berlangsung',
    '2026-6-16': 'menunggu',
    '2026-6-17': 'menunggu',
    '2026-6-18': 'selesai',
    '2026-6-19': 'berlangsung',
    '2026-6-20': 'berlangsung',
    '2026-6-22': 'selesai',
    '2026-6-23': 'selesai',
    '2026-6-24': 'menunggu',
    '2026-6-25': 'menunggu',
    '2026-6-26': 'berlangsung',
    '2026-6-29': 'selesai',
    '2026-6-30': 'selesai'
};

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
    }

    // Sidebar
    const sidebarState = localStorage.getItem("sidebarOpen");
    if (sidebarState === "true" && window.innerWidth <= 768) {
        document.getElementById("sidebar").classList.add("open");
        document.getElementById("sidebarOverlay").classList.add("active");
    }

    // Render semua komponen
    renderCalendar(currentMonth, currentYear);
    updateStats();
    initActivityChart();
};

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
        
        if (i === todayDate && month === todayMonth && year === todayYear) {
            day.classList.add('today');
        }
        
        const dateKey = year + '-' + (month + 1) + '-' + i;
        if (consultationEvents[dateKey]) {
            if (consultationEvents[dateKey] === 'selesai' || consultationEvents[dateKey] === 'berlangsung') {
                day.classList.add('has-event');
            } else if (consultationEvents[dateKey] === 'menunggu') {
                day.classList.add('has-pending');
            }
        }
        
        day.addEventListener('click', function() {
            if (!this.classList.contains('other-month')) {
                const dateInfo = this.textContent + ' ' + monthNames[month] + ' ' + year;
                const eventKey = year + '-' + (month + 1) + '-' + this.textContent;
                
                if (consultationEvents[eventKey]) {
                    const status = consultationEvents[eventKey];
                    const statusText = status === 'selesai' ? '✅ Selesai' : 
                                      status === 'berlangsung' ? '🔄 Berlangsung' : 
                                      '⏳ Menunggu';
                    alert(`📅 ${dateInfo}\nStatus: ${statusText}`);
                } else {
                    alert(`📅 ${dateInfo}\nTidak ada konsultasi`);
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

// ========== UPDATE STATS ==========
function updateStats() {
    document.getElementById("totalMahasiswa").innerText = "156";
    document.getElementById("totalDosen").innerText = "24";
    document.getElementById("totalKonsultasi").innerText = "89";
    document.getElementById("konsultasiAktif").innerText = "12";
    
    document.getElementById("totalAktivitas").innerText = "156";
    document.getElementById("aktivitasMingguIni").innerText = "23";
    document.getElementById("aktivitasBulanIni").innerText = "89";
}

// ========== ACTIVITY CHART ==========
function initActivityChart() {
    const ctx = document.getElementById('activityChart').getContext('2d');
    
    const isDarkMode = document.body.classList.contains('dark-mode');
    const textColor = isDarkMode ? '#ffffff' : '#1f2937';
    const gridColor = isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
    
    if (activityChart) {
        activityChart.destroy();
    }
    
    activityChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
            datasets: [
                {
                    label: 'Konsultasi',
                    data: [2, 5, 3, 7, 4, 6, 1],
                    borderColor: '#14b8a6',
                    backgroundColor: 'rgba(20, 184, 166, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#14b8a6',
                    pointRadius: 4,
                    pointHoverRadius: 6
                },
                {
                    label: 'Pengajuan',
                    data: [1, 3, 2, 4, 3, 2, 0],
                    borderColor: '#0f766e',
                    backgroundColor: 'rgba(15, 118, 110, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#0f766e',
                    pointRadius: 4,
                    pointHoverRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        padding: 20
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        color: textColor
                    },
                    grid: {
                        color: gridColor
                    }
                },
                x: {
                    ticks: {
                        color: textColor
                    },
                    grid: {
                        display: false
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// ========== EXPORT DATA ==========
function exportData() {
    const data = {
        mahasiswa: document.getElementById("totalMahasiswa").innerText,
        dosen: document.getElementById("totalDosen").innerText,
        konsultasi: document.getElementById("totalKonsultasi").innerText,
        aktif: document.getElementById("konsultasiAktif").innerText,
        tanggal: new Date().toLocaleDateString('id-ID')
    };
    
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laporan-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    showNotification('Data berhasil diexport!', 'success');
}

// ========== REFRESH ==========
function refreshData() {
    const btn = document.querySelector('.refresh-btn');
    btn.textContent = '⏳';
    btn.disabled = true;
    
    setTimeout(() => {
        updateStats();
        initActivityChart();
        renderCalendar(currentMonth, currentYear);
        btn.textContent = '🔄';
        btn.disabled = false;
        showNotification('Data berhasil diperbarui!', 'success');
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
    initActivityChart();
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
    if (e.altKey && e.key === 'l') {
        e.preventDefault();
        logout();
    }
    if (e.altKey && e.key === 'e') {
        e.preventDefault();
        exportData();
    }
});