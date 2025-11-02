import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// 🔥 konfigurasi firebase (sama persis dengan script.js)
const firebaseConfig = {
  apiKey: "AIzaSyCxsOubMJerDL1hXd63xHi58vV_GuYw0Hg",
  authDomain: "ceritakita-22.firebaseapp.com",
  databaseURL: "https://ceritakita-22-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "ceritakita-22",
  storageBucket: "ceritakita-22.firebasestorage.app",
  messagingSenderId: "952342930337",
  appId: "1:952342930337:web:bcdccbb012a5a4f4aa61e0"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Ambil ID cerita dari URL (misal: detail.html?id=cerita1)
const params = new URLSearchParams(window.location.search);
const ceritaId = params.get("id");

const ceritaDetail = document.getElementById("cerita-detail");

async function tampilkanDetail() {
  if (!ceritaId) {
    ceritaDetail.innerHTML = "<p>Cerita tidak ditemukan.</p>";
    return;
  }

  const ceritaRef = ref(db, `Cerita/${ceritaId}`);
  const snapshot = await get(ceritaRef);

  if (snapshot.exists()) {
    const data = snapshot.val();
    ceritaDetail.innerHTML = `
      <div class="cerita-card">
        <h2>${data.Judul}</h2>
        <p>${data.Isi}</p>
        <small>${data.Tanggal || ""}</small><br>
        <img src="${data.Foto}" alt="foto cerita" style="width:100%;border-radius:10px;margin-top:8px;">
      </div>
    `;
  } else {
    ceritaDetail.innerHTML = "<p>Cerita tidak ditemukan di database.</p>";
  }
}

tampilkanDetail();
