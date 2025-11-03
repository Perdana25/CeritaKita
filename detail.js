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

const id = localStorage.getItem('ceritaId');
const el = document.getElementById('cerita-detail');

async function init(){
  if(!id){ el.innerHTML = '<p class="muted">Tidak ada cerita dipilih.</p>'; return; }
  const snap = await get(ref(db, `Cerita/${id}`));
  if (snap.exists()) {
    const data = snap.val();
    show(data);
  } else {
    // fallback to root single
    const root = await get(ref(db, 'Cerita'));
    if(root.exists() && root.val().Judul) show(root.val());
    else el.innerHTML = '<p class="muted">Data tidak ditemukan.</p>';
  }
}
function show(d){
  const fotoHTML = d.Foto ? `<img src="${escape(d.Foto)}" alt="foto" style="width:100%;border-radius:12px;margin-top:12px">` : '';
  el.innerHTML = `<article class="cerita-card"><h2>${escape(d.Judul)}</h2><small class="muted">${escape(d.Tanggal||'')}</small><p style="margin-top:12px;white-space:pre-line">${escape(d.Isi||'')}</p>${fotoHTML}</article>`;
}
init();

function escape(s){ if(!s) return ''; return String(s).replace(/[&<>"']/g, (m)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
