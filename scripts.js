// Ambil data dari localStorage atau inisialisasi array kosong jika belum ada data
let dataBarang = JSON.parse(localStorage.getItem("dataBarang")) || [];

// Halaman Login
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        if (username === "admin" && password === "admin123") {
            window.location.href = "admin_dashboard.html";
        } else if (username === "user" && password === "user123") {
            window.location.href = "user_dashboard.html";
        } else {
            document.getElementById("errorMessage").innerText = "Username atau password salah!";
        }
    });
}

// Admin Menambah Data Barang Baru
const dataForm = document.getElementById("dataForm");
if (dataForm) {
    dataForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const nama = document.getElementById("namaBarang").value;
        const kategori = document.getElementById("kategori").value;
        const stok = parseInt(document.getElementById("stok").value) || 0;
        const hargaBeli = parseFloat(document.getElementById("hargaBeli").value) || 0;
        const hargaJual = parseFloat(document.getElementById("hargaJual").value) || 0;

        // Tambahkan data barang baru ke array
        dataBarang.push({ nama, kategori, stok, hargaBeli, hargaJual });
        saveToLocalStorage(); // Simpan data ke localStorage
        renderTable();
        renderChart();
        dataForm.reset(); // Reset form
    });
}

// Simpan data ke localStorage
function saveToLocalStorage() {
    localStorage.setItem("dataBarang", JSON.stringify(dataBarang));
}

// Render Tabel Admin
function renderTable() {
    const tableBody = document.querySelector("#dataTable tbody");
    if (tableBody) {
        tableBody.innerHTML = ""; // Kosongkan tabel
        dataBarang.forEach((item, index) => {
            tableBody.innerHTML += `
                <tr>
                    <td>${item.nama}</td>
                    <td>${item.kategori}</td>
                    <td>${item.stok}</td>
                    <td>${item.hargaBeli.toFixed(2)}</td>
                    <td>${item.hargaJual.toFixed(2)}</td>
                    <td>
                        <button class="btn-tambah-stok" data-index="${index}">Tambah Stok</button>
                        <button class="btn-jual-barang" data-index="${index}">Jual Barang</button>
                        <button class="btn-delete" data-index="${index}">Hapus</button>
                    </td>
                </tr>
            `;
        });

        // Event listeners untuk tombol aksi
        document.querySelectorAll(".btn-delete").forEach(button => {
            button.addEventListener("click", function () {
                const index = this.getAttribute("data-index");
                deleteData(index);
            });
        });

        document.querySelectorAll(".btn-tambah-stok").forEach(button => {
            button.addEventListener("click", function () {
                const index = this.getAttribute("data-index");
                tambahStok(index);
            });
        });

        document.querySelectorAll(".btn-jual-barang").forEach(button => {
            button.addEventListener("click", function () {
                const index = this.getAttribute("data-index");
                jualBarang(index);
            });
        });
    }
}

// Hapus Data Barang
function deleteData(index) {
    dataBarang.splice(index, 1);
    saveToLocalStorage(); // Simpan perubahan ke localStorage
    renderTable();
    renderChart();
}

// Tambah Stok Barang
function tambahStok(index) {
    const jumlah = parseInt(prompt("Masukkan jumlah stok yang akan ditambahkan:", "0")) || 0;
    if (jumlah > 0) {
        dataBarang[index].stok += jumlah;
        saveToLocalStorage(); // Simpan perubahan ke localStorage
        renderTable();
        renderChart();
        alert(`Berhasil menambahkan ${jumlah} stok ke ${dataBarang[index].nama}`);
    } else {
        alert("Jumlah stok tidak valid!");
    }
}

// Jual Barang
function jualBarang(index) {
    const jumlah = parseInt(prompt("Masukkan jumlah barang yang terjual:", "0")) || 0;
    if (jumlah > 0 && jumlah <= dataBarang[index].stok) {
        dataBarang[index].stok -= jumlah;
        saveToLocalStorage(); // Simpan perubahan ke localStorage
        renderTable();
        renderChart();
        alert(`Berhasil menjual ${jumlah} barang ${dataBarang[index].nama}`);
    } else if (jumlah > dataBarang[index].stok) {
        alert("Stok tidak mencukupi!");
    } else {
        alert("Jumlah barang tidak valid!");
    }
}

// Render Grafik
function renderChart() {
    const chartCanvas = document.getElementById("chartAdmin");
    if (chartCanvas) {
        const ctx = chartCanvas.getContext("2d");

        // Bersihkan canvas sebelum membuat grafik baru
        if (chartCanvas.chart) {
            chartCanvas.chart.destroy();
        }

        chartCanvas.chart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: dataBarang.map(item => item.nama),
                datasets: [{
                    label: "Jumlah Stok",
                    data: dataBarang.map(item => item.stok),
                    backgroundColor: "skyblue"
                }]
            },
        });
    }
}

// Export PDF
const exportPdfButton = document.getElementById("exportPdfAdmin");
if (exportPdfButton) {
    exportPdfButton.addEventListener("click", function () {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        pdf.text("Laporan Data Barang", 10, 10);

        dataBarang.forEach((item, i) => {
            pdf.text(`${i + 1}. ${item.nama} - ${item.kategori} - Stok: ${item.stok} - Harga Beli: ${item.hargaBeli.toFixed(2)} - Harga Jual: ${item.hargaJual.toFixed(2)}`, 10, 20 + i * 10);
        });

        pdf.save("Laporan_Admin.pdf");
    });
}

// Render tabel dan grafik saat halaman dimuat ulang
window.onload = function () {
    renderTable();
    renderChart();
};
