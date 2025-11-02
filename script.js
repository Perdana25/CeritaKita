// Import Firebase Realtime Database SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// 🔥 konfigurasi firebase
const firebaseConfig = {
  apiKey: "AIzaSyCxsOubMJerDL1hXd63xHi58vV_GuYw0Hg",
  authDomain: "ceritakita-22.firebaseapp.com",
  databaseURL: "https://ceritakita-22-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "ceritakita-22",
  storageBucket: "ceritakita-22.firebasestorage.app",
  messagingSenderId: "952342930337",
  appId: "1:952342930337:web:bcdccbb012a5a4f4aa61e0"
};

// 🔹 Inisialisasi
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

  // Jika hanya 1 cerita
  if (data.Judul) {
    tampilkanCeritaCard(data);
  } else {
    // Jika banyak cerita (object dengan key)
    Object.values(data).forEach(cerita => tampilkanCeritaCard(cerita));
  }
});

// 🔹 Fungsi menampilkan card
function tampilkanCeritaCard(cerita) {
  ceritaContainer.innerHTML += `
    <div class="cerita-card">
      <h3>${cerita.Judul}</h3>
      <p>${cerita.Isi}</p>
      <small>${cerita.Tanggal || ""}</small><br>
      <img src="${cerita.Foto}" alt="foto cerita" style="width:100%;border-radius:10px;margin-top:8px;">
    </div>
  `;
}
