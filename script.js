// Import Firebase Realtime Database SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// 🔥 konfigurasi firebase
const firebaseConfig = {
  apiKey: "AIzaSyCxsOubMJerDL1hXd63xHi58vV_GuYw0Hg",
  authDomain: "ceritakita-22.firebaseapp.com",
  databaseURL: "https://ceritakita-22-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "ceritakita-22",
  storageBucket: "ceritakita-22.appspot.com",
  messagingSenderId: "952342930337",
  appId: "1:952342930337:web:bcdccbb012a5a4f4aa61e0"
};

// 🔹 Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// 🔹 Ambil data realtime dari node "Cerita"
const ceritaContainer = document.getElementById("cerita-container");
const ceritaRef = ref(db, "Cerita");

onValue(ceritaRef, (snapshot) => {
  ceritaContainer.innerHTML = "";
  const data = snapshot.val();

  if (!data) {
    ceritaContainer.innerHTML = "<p>Belum ada cerita ditambahkan.</p>";
    return;
  }

  // Jika hanya satu cerita (bukan object)
  if (data.Judul) {
    tampilkanCeritaCard(data, "Cerita");
  } else {
    // Jika banyak cerita
    Object.entries(data).forEach(([id, cerita]) => tampilkanCeritaCard(cerita, id));
  }
});

// 🔹 Fungsi menampilkan card
function tampilkanCeritaCard(cerita, id) {
  const fotoHTML = cerita.Foto
    ? `<img src="${cerita.Foto}" alt="foto cerita" class="cerita-foto">`
    : "";

  ceritaContainer.innerHTML += `
    <div class="cerita-card" onclick="lihatDetail('${id}')">
      <h3>${cerita.Judul}</h3>
      <p>${cerita.Isi.substring(0, 100)}...</p>
      <small>${cerita.Tanggal || ""}</small>
      ${fotoHTML}
    </div>
  `;
}

// 🔹 Klik menuju detail
window.lihatDetail = function (id) {
  localStorage.setItem("ceritaId", id);
  window.location.href = "detail.html";
};
