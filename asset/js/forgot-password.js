let generatedCode = "";

// Kirim Kode

function sendCode(){

    const userId =
    document.getElementById(
        "userId"
    ).value.trim();

    if(userId === ""){

        alert(
            "Masukkan NIM/NIP terlebih dahulu"
        );

        return;

    }

    generatedCode =
    Math.floor(
        100000 +
        Math.random() * 900000
    ).toString();

    alert(
        "Kode verifikasi: " +
        generatedCode
    );

    document.getElementById(
        "step1"
    ).style.display = "none";

    document.getElementById(
        "step2"
    ).style.display = "block";

}

// Reset Password

function resetPassword(){

    const code =
    document.getElementById(
        "verificationCode"
    ).value;

    const newPassword =
    document.getElementById(
        "newPassword"
    ).value;

    const confirmPassword =
    document.getElementById(
        "confirmPassword"
    ).value;

    if(code !== generatedCode){

        alert(
            "Kode verifikasi salah"
        );

        return;

    }

    if(newPassword !== confirmPassword){

        alert(
            "Password tidak cocok"
        );

        return;

    }

    alert(
        "Password berhasil direset"
    );

    window.location.href =
    "../index.html";

}