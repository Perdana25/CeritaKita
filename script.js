// === Import Firebase Module ===
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// === Konfigurasi Firebase ===
const firebaseConfig = {
  apiKey: "AIzaSyCxsOubMJerDL1hXd63xHi58vV_GuYw0Hg",
  authDomain: "ceritakita-22.firebaseapp.com",
  databaseURL: "https://ceritakita-22-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "ceritakita-22",
  storageBucket: "ceritakita-22.appspot.com",
  messagingSenderId: "952342930337",
  appId: "1:952342930337:web:bcdccbb012a5a4f4aa61e0"
};

// === Inisialisasi Firebase ===
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// === Ambil data dari Realtime Database ===
const dbRef = ref(db);

get(child(dbRef, "Cerita"))
  .then((snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      tampilkanCerita(data);
    } else {
      document.getElementById("cerita-container").innerHTML = "<p>Tidak ada cerita ditemukan.</p>";
    }
  })
  .catch((error) => {
    console.error("Gagal mengambil data:", error);
  });

// === Fungsi untuk menampilkan cerita ===
function tampilkanCerita(data) {
  const container = document.getElementById("cerita-container");
  container.innerHTML = "";

  // Kalau nanti kamu punya banyak cerita, bisa looping di sini
  // Sekarang, tampilkan satu dulu
  const ceritaCard = document.createElement("div");
  ceritaCard.classList.add("cerita-card");

  ceritaCard.innerHTML = `
    <img src="${data.Foto}" alt="${data.Judul}">
    <div class="content">
      <h3>${data.Judul}</h3>
      <p>${data.Isi}</p>
      <small>${data.Tanggal}</small>
    </div>
  `;
  
  container.appendChild(ceritaCard);
}
