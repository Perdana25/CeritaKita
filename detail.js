// detail.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

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

const id = localStorage.getItem("ceritaId");
const detailEl = document.getElementById("cerita-detail");

async function render() {
  if (!id) { detailEl.innerHTML = "<p class='muted'>Tidak ada cerita yang dipilih.</p>"; return; }
  // try node Cerita/<id>
  const snap = await get(ref(db, `Cerita/${id}`));
  if (snap.exists()) {
    const data = snap.val();
    show(data);
    return;
  }
  // fallback: if root Cerita is a single object (no id)
  const root = await get(ref(db, "Cerita"));
  if (root.exists() && root.val().Judul) {
    show(root.val());
    return;
  }
  detailEl.innerHTML = "<p class='muted'>Data cerita tidak ditemukan.</p>";
}

function show(data){
  const foto = data.Foto ? `<img src="${data.Foto}" alt="foto" style="width:100%;border-radius:12px;margin-top:12px">` : "";
  detailEl.innerHTML = `
    <article class="cerita-card">
      <h2>${data.Judul || "Untitled"}</h2>
      <small class="muted">${data.Tanggal || ""}</small>
      <p style="margin-top:12px;white-space:pre-line">${data.Isi || ""}</p>
      ${foto}
    </article>
  `;
}

render();
