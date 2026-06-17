// ========== PROTEKSI ROLE ==========
const role = localStorage.getItem("role");
if (role !== "admin") {
    window.location.href = "../../index.html";
}

let statusChart = null;
let kategoriChart = null;
let trenChart = null;
let programChart = null;

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

    loadLaporan();
};

// ========== LOAD LAPORAN ==========
function loadLaporan() {
    // Ambil data
    const mahasiswa = JSON.parse(localStorage.getItem('dataMahasiswa')) || [];
    const dosen = JSON.parse(localStorage.getItem('dataDosen')) || [];
    const konsultasi = JSON.parse(localStorage.getItem('dataKonsultasi')) || [];

    // Update stats
    document.getElementById('totalMhs').textContent = mahasiswa.length;
    document.getElementById('totalDsn').textContent = dosen.length;
    document.getElementById('totalKonsul').textContent = konsultasi.length;
    document.getElementById('selesaiKonsul').textContent = konsultasi.filter(k => k.status === 'selesai').length;

    // Render charts
    renderStatusChart(konsultasi);
    renderKategoriChart(konsultasi);
    renderTrenChart(konsultasi);
    renderProgramChart(mahasiswa);
    renderLatestKonsultasi(konsultasi);
}

// ========== RENDER STATUS CHART ==========
function renderStatusChart(konsultasi) {
    const ctx = document.getElementById('statusChart').getContext('2d');
    
    const statuses = ['pending', 'disetujui', 'selesai', 'ditolak'];
    const labels = ['⏳ Menunggu', '✅ Disetujui', '📌 Selesai', '❌ Ditolak'];
    const colors = ['#f59e0b', '#14b8a6', '#3b82f6', '#ef4444'];
    const data = statuses.map(s => konsultasi.filter(k => k.status === s).length);

    if (statusChart) statusChart.destroy();

    statusChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                }
            },
            cutout: '60%'
        }
    });
}

// ========== RENDER KATEGORI CHART ==========
function renderKategoriChart(konsultasi) {
    const ctx = document.getElementById('kategoriChart').getContext('2d');
    
    const akademik = konsultasi.filter(k => k.kategori === 'akademik').length;
    const nonAkademik = konsultasi.filter(k => k.kategori === 'non-akademik').length;

    if (kategoriChart) kategoriChart.destroy();

    kategoriChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['📚 Akademik', '🎯 Non-Akademik'],
            datasets: [{
                label: 'Jumlah Konsultasi',
                data: [akademik, nonAkademik],
                backgroundColor: ['#14b8a6', '#0f766e'],
                borderRadius: 8,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// ========== RENDER TREN CHART ==========
function renderTrenChart(konsultasi) {
    const ctx = document.getElementById('trenChart').getContext('2d');
    
    // Group by month
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const monthData = new Array(12).fill(0);
    
    konsultasi.forEach(k => {
        if (k.tanggal) {
            const date = new Date(k.tanggal);
            const month = date.getMonth();
            monthData[month]++;
        }
    });

    if (trenChart) trenChart.destroy();

    trenChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Jumlah Konsultasi',
                data: monthData,
                borderColor: '#14b8a6',
                backgroundColor: 'rgba(20, 184, 166, 0.1)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#14b8a6',
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// ========== RENDER PROGRAM CHART ==========
function renderProgramChart(mahasiswa) {
    const ctx = document.getElementById('programChart').getContext('2d');
    
    // Group by program
    const programs = {};
    mahasiswa.forEach(m => {
        if (m.program) {
            programs[m.program] = (programs[m.program] || 0) + 1;
        }
    });

    const labels = Object.keys(programs);
    const data = Object.values(programs);
    const colors = ['#14b8a6', '#0f766e', '#0891b2', '#059669', '#7c3aed', '#2563eb'];

    if (programChart) programChart.destroy();

    programChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors.slice(0, labels.length),
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        usePointStyle: true
                    }
                }
            },
            cutout: '50%'
        }
    });
}

// ========== RENDER LATEST KONSULTASI ==========
function renderLatestKonsultasi(konsultasi) {
    const container = document.getElementById('latestKonsultasi');
    
    const latest = [...konsultasi]
        .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))
        .slice(0, 5);

    if (latest.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>Belum ada data konsultasi.</p>
            </div>
        `;
        return;
    }

    let html = '<div class="latest-list">';
    latest.forEach(item => {
        const statusClass = item.status === 'selesai' ? 'success' : 
                           item.status === 'disetujui' ? 'success' : 
                           item.status === 'pending' ? 'pending' : 'danger';
        const statusLabel = item.status === 'selesai' ? '📌 Selesai' : 
                           item.status === 'disetujui' ? '✅ Disetujui' : 
                           item.status === 'pending' ? '⏳ Menunggu' : '❌ Ditolak';

        html += `
            <div class="latest-item">
                <div class="latest-item-info">
                    <h4>${item.jenis}</h4>
                    <span class="badge ${statusClass}">${statusLabel}</span>
                </div>
                <div class="latest-item-detail">
                    <span>👨‍🎓 ${item.mahasiswa}</span>
                    <span>👨‍🏫 ${item.dosen}</span>
                    <span>📅 ${formatDate(item.tanggal)}</span>
                </div>
            </div>
        `;
    });
    html += '</div>';

    container.innerHTML = html;
}

// ========== FORMAT DATE ==========
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

// ========== PRINT LAPORAN ==========
function printLaporan() {
    window.print();
}

// ========== EXPORT LAPORAN ==========
function exportLaporan() {
    showNotification('📥 Laporan sedang diproses...', 'info');
    
    setTimeout(() => {
        // Simulasi export
        const data = {
            tanggal: new Date().toISOString(),
            mahasiswa: JSON.parse(localStorage.getItem('dataMahasiswa')) || [],
            dosen: JSON.parse(localStorage.getItem('dataDosen')) || [],
            konsultasi: JSON.parse(localStorage.getItem('dataKonsultasi')) || []
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `laporan-${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        URL.revokeObjectURL(url);

        showNotification('✅ Laporan berhasil diexport!', 'success');
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
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
    
    // Re-render charts with new theme
    const konsultasi = JSON.parse(localStorage.getItem('dataKonsultasi')) || [];
    const mahasiswa = JSON.parse(localStorage.getItem('dataMahasiswa')) || [];
    renderStatusChart(konsultasi);
    renderKategoriChart(konsultasi);
    renderTrenChart(konsultasi);
    renderProgramChart(mahasiswa);
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