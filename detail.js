import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔥 konfigurasi firebase (sama seperti di script.js)
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
const db = getFirestore(app);

const ceritaId = localStorage.getItem("ceritaId");
const ceritaDetail = document.getElementById("cerita-detail");

async function tampilkanDetail() {
  if (!ceritaId) {
    ceritaDetail.innerHTML = "<p>Cerita tidak ditemukan.</p>";
    return;
  }

  const docRef = doc(db, "cerita", ceritaId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    ceritaDetail.innerHTML = `
      <div class="cerita-card">
        <h2>${data.judul}</h2>
        <p>${data.isi}</p>
        <small>${data.tanggal || ""}</small>
      </div>
    `;
  } else {
    ceritaDetail.innerHTML = "<p>Cerita tidak ditemukan di database.</p>";
  }
}
tampilkanDetail();
