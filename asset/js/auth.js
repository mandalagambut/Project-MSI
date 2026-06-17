function login(){

    const role =
    document.getElementById("role").value;

    const username =
    document.getElementById("username").value.trim();

    const password =
    document.getElementById("password").value;

    // Admin
    if(
        role === "Admin" &&
        username === "12345678" &&
        password === "admin123"
    ){

        localStorage.setItem("role","admin");

        window.location.href =
        "pages/admin/admin-dashboard.html";

        return;
    }

    // Dosen
    if(
        role === "Dosen" &&
        username === "246810" &&
        password === "dosen123"
    ){

        localStorage.setItem("role","dosen");

        localStorage.setItem(
            "namaDosen",
            "Dosen, M.Pd."
        );

        window.location.href =
        "pages/dosen/dosen-dashboard.html";

        return;
    }

    // Mahasiswa
    if(
        role === "Mahasiswa" &&
        username === "3691215" &&
        password === "mhs123"
    ){

        localStorage.setItem(
            "role",
            "mahasiswa"
        );

        localStorage.setItem(
            "namaMahasiswa",
            "User"
        );

        window.location.href =
        "pages/mahasiswa/mahasiswa-dashboard.html";

        return;
    }

    alert(
        "NIM/NIP atau password salah"
    );

}

function showToast(message){

    const toast =
    document.getElementById("toast");

    toast.innerText = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    },2500);

}