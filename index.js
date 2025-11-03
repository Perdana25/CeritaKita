// index.js (module)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

/* ============ FIREBASE CONFIG ===============
   Ganti jika perlu — saya gunakan config projectmu
=============================================*/
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

/* COUNTER */
function calculateDays(startISO) {
  const start = new Date(startISO);
  const now = new Date();
  const diff = Math.floor((now - start) / (1000*60*60*24));
  return diff;
}
const startISO = "2024-09-22"; // sesuai permintaan
document.addEventListener("DOMContentLoaded", () => {
  const days = calculateDays(startISO);
  const el = document.getElementById("relationship-days");
  if (el) el.textContent = `${days} days together 💞`;

  // Hero photo fallback: if user doesn't add photo.jpg, use gradient background.
  const heroPhoto = document.getElementById("hero-photo");
  const hero = document.getElementById("hero");
  if (heroPhoto) {
    heroPhoto.onerror = () => {
      // hide img and keep dark gradient
      if (hero) hero.style.background = "linear-gradient(180deg,#15151b,#0b0b0f)";
      heroPhoto.style.display = "none";
    }
  }

  // load timeline from Realtime DB under node "Timeline" (if exists)
  const dbRef = ref(db);
  get(child(dbRef, "Timeline")).then((snap) => {
    if (snap.exists()) {
      const t = snap.val();
      renderTimelineFromData(t);
    } else {
      renderTimelineSample();
    }
    triggerFadeIn();
  }).catch((err)=> {
    console.warn("Cannot read Timeline node, using sample.", err);
    renderTimelineSample();
    triggerFadeIn();
  });
});

/* RENDER TIMELINE — supports object list or array */
function renderTimelineFromData(data){
  const container = document.getElementById("timelinePreview");
  container.innerHTML = "";
  // data could be object keyed or array
  const items = Array.isArray(data) ? data : Object.values(data);
  items.forEach((it, idx) => {
    const side = (idx % 2 === 0) ? "left" : "right";
    const html = `
      <div class="timeline-item ${side}">
        <div class="content">
          <h3>${it.title || it.Titel || it.Judul || "Moment"}</h3>
          <p>${it.desc || it.Deskripsi || it.isi || ""}</p>
          <span class="date">${it.date || it.Tanggal || ""}</span>
        </div>
      </div>`;
    container.insertAdjacentHTML("beforeend", html);
  });
}

/* sample fallback */
function renderTimelineSample(){
  const sample = [
    { title: "First Chat", desc: "A simple hello that changed everything.", date: "June 2024" },
    { title: "Our First Meeting", desc: "When our paths first crossed.", date: "July 2024" },
    { title: "Started Dating", desc: "The day it became official.", date: "22 September 2024" },
    { title: "Now", desc: "Every day we write new pages.", date: "Today" }
  ];
  renderTimelineFromData(sample);
}

/* FADE IN ON SCROLL */
function triggerFadeIn(){
  const items = document.querySelectorAll('.fade-up, .fade-left, .fade-right');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e=>{
      if (e.isIntersecting) e.target.classList.add('fade-in');
    });
  }, {threshold:0.12});
  items.forEach(i => obs.observe(i));
}
