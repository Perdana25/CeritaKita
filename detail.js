import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔥 konfigurasi firebase (sama seperti di script.js)
const firebaseConfig = {
  apiKey: "ISI_PUNYAMU",
  authDomain: "ISI_PUNYAMU",
  projectId: "ISI_PUNYAMU",
  storageBucket: "ISI_PUNYAMU",
  messagingSenderId: "ISI_PUNYAMU",
  appId: "ISI_PUNYAMU"
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
