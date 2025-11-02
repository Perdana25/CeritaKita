import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔥 konfigurasi firebase
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCxsOubMJerDL1hXd63xHi58vV_GuYw0Hg",
  authDomain: "ceritakita-22.firebaseapp.com",
  projectId: "ceritakita-22",
  storageBucket: "ceritakita-22.firebasestorage.app",
  messagingSenderId: "952342930337",
  appId: "1:952342930337:web:bcdccbb012a5a4f4aa61e0"
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

