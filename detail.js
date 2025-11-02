import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// 🔥 konfigurasi firebase (sama persis)
const firebaseConfig = {
  apiKey: "AIzaSyCxsOubMJerDL1hXd63xHi58vV_GuYw0Hg",
  authDomain: "ceritakita-22.firebaseapp.com",
  databaseURL: "https://ceritakita-22-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "ceritakita-22",
  storageBucket: "ceritakita-22.appspot.com",
  messagingSenderId: "952342930337",
  appId: "1:952342930337:web:bcdccbb012a5a4f4aa61e0"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const ceritaId = localStorage.getItem("ceritaId");
const ceritaDetail = document.getElementById("cerita-detail");

async function tampilkanDetail() {
  if (!ceritaId) {
    ceritaDetail.innerHTML = "<p>Cerita tidak ditemukan.</p>";
    return;
  }

  const dbRef = ref(db);
  const snapshot = await get(child(dbRef, `Cerita/${ceritaId}`));

  if (snapshot.exists()) {
    const data = snapshot.val();
    const fotoHTML = data.Foto
      ? `<img src="${data.Foto}" alt="foto cerita" class="cerita-foto">`
      : "";

    ceritaDetail.innerHTML = `
      <div class="cerita-card">
        <h2>${data.Judul}</h2>
        <p>${data.Isi}</p>
        ${fotoHTML}
        <small>${data.Tanggal || ""}</small>
      </div>
    `;
  } else {
    ceritaDetail.innerHTML = "<p>Cerita tidak ditemukan di database.</p>";
  }
}
tampilkanDetail();
