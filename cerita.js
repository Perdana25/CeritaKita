// cerita.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

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

const listEl = document.getElementById('cerita-list');
const node = ref(db, 'Cerita');

onValue(node, (snap) => {
  const val = snap.val();
  listEl.innerHTML = '';
  if (!val) {
    listEl.innerHTML = '<p class="muted">Belum ada cerita.</p>'; return;
  }
  const items = Object.entries(val).map(([id, o]) => ({ id, ...o }));
  items.sort((a,b) => new Date(a.Tanggal) - new Date(b.Tanggal));
  items.reverse(); // show newest first
  items.forEach(it => {
    const el = document.createElement('article');
    el.className = 'cerita-card';
    el.innerHTML = `<h3>${escape(it.Judul)}</h3><p>${escape(it.Isi||'')}</p><small>${escape(it.Tanggal||'')}</small>`;
    el.addEventListener('click', ()=> {
      localStorage.setItem('ceritaId', it.id);
      location.href = 'detail.html';
    });
    listEl.appendChild(el);
  });
});

function escape(s){ if(!s) return ''; return String(s).replace(/[&<>"']/g, (m)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
