// ========== PROTEKSI ROLE ==========
const role = localStorage.getItem("role");
if (role !== "mahasiswa") {
    window.location.href = "../../index.html";
}

// ========== VARIABEL GLOBAL ==========
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

// ========== DATA KONSULTASI ==========
const consultationData = {
    total: 8,
    selesai: 4,
    berlangsung: 2,
    menunggu: 2
};

const consultationEvents = {
    '2026-6-1': 'selesai',
    '2026-6-3': 'selesai',
    '2026-6-5': 'menunggu',
    '2026-6-8': 'selesai',
    '2026-6-10': 'berlangsung',
    '2026-6-12': 'selesai',
    '2026-6-15': 'berlangsung',
    '2026-6-17': 'menunggu',
    '2026-6-20': 'berlangsung',
    '2026-6-22': 'selesai',
    '2026-6-25': 'menunggu',
    '2026-6-28': 'berlangsung',
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

    // Render semua komponen
    renderCalendar(currentMonth, currentYear);
    updateProgress();
    updateInfo();
    updatePieChart();
};

// ========== PROGRESS FUNCTIONS ==========
function updateProgress() {
    const progress = (consultationData.selesai / consultationData.total) * 100;
    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = progress + '%';
    progressBar.querySelector('.progress-text').textContent = Math.round(progress) + '%';
    
    document.getElementById('totalKonsultasi').textContent = consultationData.total;
    document.getElementById('selesaiKonsultasi').textContent = consultationData.selesai;
    document.getElementById('berlangsungKonsultasi').textContent = consultationData.berlangsung;
    document.getElementById('menungguKonsultasi').textContent = consultationData.menunggu;
    
    // Update status
    const status = document.getElementById('progressStatus');
    if (consultationData.berlangsung > 0) {
        status.textContent = '🔄 Konsultasi Berlangsung';
        status.className = 'progress-status';
    } else if (consultationData.menunggu > 0) {
        status.textContent = '⏳ Menunggu Persetujuan';
        status.className = 'progress-status pending';
    } else if (consultationData.selesai === consultationData.total) {
        status.textContent = '✅ Semua Selesai';
        status.className = 'progress-status success';
    } else {
        status.textContent = '📋 Belum Ada Konsultasi';
        status.className = 'progress-status';
    }
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

// ========== INFO FUNCTIONS ==========
function updateInfo() {
    // Update info items - data sudah di HTML
}

// ========== PIE CHART ==========
function updatePieChart() {
    const pieChart = document.getElementById('pieChart');
    const selesai = consultationData.selesai;
    const berlangsung = consultationData.berlangsung;
    const menunggu = consultationData.menunggu;
    const total = consultationData.total;
    
    const selesaiPercent = (selesai / total) * 100;
    const berlangsungPercent = (berlangsung / total) * 100;
    const menungguPercent = (menunggu / total) * 100;
    
    pieChart.style.background = `conic-gradient(
        #14b8a6 0% ${selesaiPercent}%,
        #dcfce7 ${selesaiPercent}% ${selesaiPercent + berlangsungPercent}%,
        #fef3c7 ${selesaiPercent + berlangsungPercent}% 100%
    )`;
}

// ========== REFRESH ==========
function refreshData() {
    // Simulasi refresh data
    const btn = document.querySelector('.refresh-btn');
    btn.textContent = '⏳';
    btn.disabled = true;
    
    setTimeout(() => {
        updateProgress();
        updatePieChart();
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
    updatePieChart();
}

// ========== LOGOUT ==========
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
    // Alt + T = Toggle Theme
    if (e.altKey && e.key === 't') {
        e.preventDefault();
        toggleTheme();
    }
    // Alt + L = Logout
    if (e.altKey && e.key === 'l') {
        e.preventDefault();
        logout();
    }
});