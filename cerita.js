// cerita.js (module)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, get, child, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

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

const listEl = document.getElementById("cerita-list");
const nodeRef = ref(db, "Cerita");

onValue(nodeRef, (snap) => {
  const val = snap.val();
  listEl.innerHTML = "";
  if (!val) {
    listEl.innerHTML = "<p class='muted'>Belum ada cerita.</p>";
    return;
  }

  // if single story (object with fields), transform to array
  const entries = (val.Judul && val.Isi) ? { "Cerita": val } : val;
  const items = Array.isArray(entries) ? entries : Object.entries(entries);

  // items can be array of [id,obj] or array objects
  if (Array.isArray(items[0])) {
    items.reverse(); // newest first
    items.forEach(([id, data]) => appendCard(id, data));
  } else {
    // array of objects
    items.reverse().forEach((data, idx) => appendCard(`i${idx}`, data));
  }
});

function appendCard(id, data){
  const foto = data.Foto ? `<img src="${data.Foto}" alt="foto">` : "";
  const tanggal = data.Tanggal || "";
  const excerpt = (data.Isi || "").length > 120 ? (data.Isi || "").slice(0,120)+"…" : (data.Isi || "");
  const html = `
    <article class="cerita-card" role="button" onclick="openDetail('${id}')">
      <h3>${data.Judul || "Untitled"}</h3>
      <p>${excerpt}</p>
      ${foto}
      <small>${tanggal}</small>
    </article>
  `;
  listEl.insertAdjacentHTML("beforeend", html);
}

// expose function to global for onclick
window.openDetail = function(id){
  localStorage.setItem("ceritaId", id);
  location.href = "detail.html";
}
