import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔥 konfigurasi firebase
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

// tampilkan daftar cerita
const ceritaContainer = document.getElementById("cerita-container");
async function tampilkanCerita() {
  const querySnapshot = await getDocs(collection(db, "cerita"));
  ceritaContainer.innerHTML = "";

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    ceritaContainer.innerHTML += `
      <div class="cerita-card" onclick="lihatDetail('${doc.id}')">
        <h3>${data.judul}</h3>
        <p>${data.isi.substring(0, 100)}...</p>
        <small>${data.tanggal || ""}</small>
      </div>
    `;
  });
}
tampilkanCerita();

// simpan id ke localstorage dan pindah ke detail
window.lihatDetail = function (id) {
  localStorage.setItem("ceritaId", id);
  window.location.href = "detail.html";
};
