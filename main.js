// main.js (module)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

/* ============ FIREBASE CONFIG (pakai milikmu) =============== */
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

/* CONFIG */
const startDateISO = "2024-09-22"; // tanggal jadian tetap
const ceritaNode = ref(db, "Cerita");

/* ELEMENTS */
const ceritaListEl = document.getElementById("cerita-list");
const timelineEl = document.getElementById("timeline");
const revealSection = document.getElementById("reveal-section");
const daysEl = document.getElementById("relationship-days");
const heroPhoto = document.getElementById("hero-photo");
const heroEl = document.getElementById("hero");

/* PHOTO fallback */
if (heroPhoto) {
  heroPhoto.onerror = () => {
    // no photo => keep hero background dark
    heroPhoto.style.display = "none";
    // fallback background gradient
    heroEl.style.background = "linear-gradient(180deg,#15151b,#0b0b0f)";
  }
}

/* helper: parse date string flexible */
function parseDate(d) {
  if (!d) return null;
  // if already ISO-like "YYYY-MM-DD"
  const dt = new Date(d);
  if (!isNaN(dt)) return dt;
  // try dd-mm-yyyy or other formats
  return new Date(d);
}

/* duration util */
function breakdownDuration(sinceISO) {
  const start = new Date(sinceISO);
  const now = new Date();
  let totalSeconds = Math.floor((now - start) / 1000);
  const years = Math.floor(totalSeconds / (3600*24*365));
  totalSeconds -= years * 3600*24*365;
  const months = Math.floor(totalSeconds / (3600*24*30));
  totalSeconds -= months * 3600*24*30;
  const days = Math.floor(totalSeconds / (3600*24));
  totalSeconds -= days * 3600*24;
  const hours = Math.floor(totalSeconds / 3600);
  totalSeconds -= hours * 3600;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds - minutes*60;
  return { years, months, days, hours, minutes, seconds };
}

/* live update for small counter near dedication (days only) */
function updateDaysSmall() {
  const start = new Date(startDateISO);
  const now = new Date();
  const diffDays = Math.floor((now - start) / (1000*60*60*24));
  if (daysEl) daysEl.textContent = `${diffDays} days together 💞`;
}
updateDaysSmall();
setInterval(updateDaysSmall, 60 * 1000); // update per menit

/* Render cerita -> timeline mapping */
onValue(ceritaNode, (snapshot) => {
  const val = snapshot.val();
  ceritaListEl.innerHTML = "";
  timelineEl.innerHTML = "";
  if (!val) {
    // fallback sample
    renderSample();
    afterRender();
    return;
  }

  // convert to array of {id, Judul, Isi, Tanggal, Foto}
  const items = Object.entries(val).map(([id, obj]) => {
    return { id, Judul: obj.Judul, Isi: obj.Isi, Tanggal: obj.Tanggal, Foto: obj.Foto };
  });

  // parse and sort by date ascending
  items.forEach(it => it._dateObj = parseDate(it.Tanggal) || new Date(0));
  items.sort((a,b) => a._dateObj - b._dateObj);

  // render list & timeline
  items.forEach((it, idx) => {
    appendCeritaCard(it);
  });
  // timeline: same items => generate timeline markers in chronological order
  items.forEach((it, idx) => appendTimelineItem(it, idx));

  afterRender();
});

/* append card */
function appendCeritaCard(it) {
  const fotoHTML = it.Foto ? `<img src="${it.Foto}" alt="foto">` : "";
  const excerpt = it.Isi ? (it.Isi.length > 140 ? it.Isi.slice(0,140) + "…" : it.Isi) : "";
  const html = document.createElement('article');
  html.className = 'cerita-card fade';
  html.innerHTML = `
    <h3>${escapeHtml(it.Judul || "Untitled")}</h3>
    <p>${escapeHtml(excerpt)}</p>
    ${fotoHTML}
    <small>${escapeHtml(it.Tanggal || "")}</small>
  `;
  // Click to detail (store id)
  html.addEventListener('click', () => {
    localStorage.setItem('ceritaId', it.id);
    location.href = 'detail.html';
  });
  ceritaListEl.appendChild(html);
}

/* append timeline item */
function appendTimelineItem(it, idx) {
  const side = (idx % 2 === 0) ? 'left' : 'right';
  const el = document.createElement('div');
  el.className = `timeline-item ${side} fade`;
  el.innerHTML = `
    <div class="item-card">
      <h3>${escapeHtml(it.Judul || "Moment")}</h3>
      <p>${escapeHtml(it.Isi ? (it.Isi.length > 200 ? it.Isi.slice(0,200)+"…" : it.Isi) : "")}</p>
      <span class="date">${escapeHtml(it.Tanggal || "")}</span>
    </div>
  `;
  timelineEl.appendChild(el);
}

/* afterRender: fade-in and then auto-scroll -> reveal animation */
function afterRender() {
  // trigger fade in sequentially
  const fades = document.querySelectorAll('.fade');
  fades.forEach((el, i) => {
    setTimeout(()=> el.classList.add('show'), i * 110);
  });

  // after timeline items animated, window scroll to reveal-section and play number reveal
  // estimate wait time based on number of items
  const wait = Math.min(2000 + (document.querySelectorAll('.timeline-item').length * 150), 4800);
  setTimeout(()=> {
    // smooth scroll to reveal section
    revealSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    // start number reveal after a short delay
    setTimeout(startNumberReveal, 900);
  }, wait);
}

/* number reveal animation:
   - quick scramble of numbers for ~1800ms,
   - then reveal actual duration and start live ticking every second
*/
let liveInterval = null;
function startNumberReveal() {
  // compute target duration now
  const target = breakdownDuration(startDateISO);

  // scramble animation function
  const ids = {
    years: document.getElementById('reveal-years'),
    months: document.getElementById('reveal-months'),
    days: document.getElementById('reveal-days'),
    hours: document.getElementById('reveal-hours'),
    mins: document.getElementById('reveal-mins'),
    secs: document.getElementById('reveal-secs'),
  };
  const scrambleDuration = 1700; // ms
  const stepMs = 60;
  const steps = Math.floor(scrambleDuration / stepMs);
  let current = 0;
  const scramble = setInterval(()=> {
    Object.values(ids).forEach(el => {
      el.textContent = Math.floor(Math.random()*99);
    });
    current++;
    if (current >= steps) {
      clearInterval(scramble);
      // reveal true values
      revealTrueAndStartLive(ids);
    }
  }, stepMs);
}

function revealTrueAndStartLive(ids) {
  // set actuals now and start live ticking
  const setAll = () => {
    const t = breakdownDuration(startDateISO);
    ids.years.textContent = t.years;
    ids.months.textContent = t.months;
    ids.days.textContent = t.days;
    ids.hours.textContent = pad(t.hours);
    ids.mins.textContent = pad(t.minutes);
    ids.secs.textContent = pad(t.seconds);
  };
  setAll();
  if (liveInterval) clearInterval(liveInterval);
  liveInterval = setInterval(() => {
    // update seconds and cascade
    const t = breakdownDuration(startDateISO);
    ids.years.textContent = t.years;
    ids.months.textContent = t.months;
    ids.days.textContent = t.days;
    ids.hours.textContent = pad(t.hours);
    ids.mins.textContent = pad(t.minutes);
    ids.secs.textContent = pad(t.seconds);
  }, 1000);
}

function pad(n) { return (n < 10) ? ("0"+n) : String(n); }

/* fallback: render sample timeline if no DB */
function renderSample(){
  ceritaListEl.innerHTML = "";
  const sample = [
    { id:'s1', Judul:'First Chat', Isi:'It started with a hello...', Tanggal:'2024-06-01'},
    { id:'s2', Judul:'Our First Meeting', Isi:'The first time we met...', Tanggal:'2024-07-10'},
    { id:'s3', Judul:'Started Dating', Isi:'When it became official', Tanggal:'2024-09-22'},
  ];
  sample.forEach((it)=> appendCeritaCard(it));
  sample.forEach((it, idx)=> appendTimelineItem(it, idx));
}

/* small utility: escapeHtml */
function escapeHtml(str){ if(!str) return ""; return String(str).replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
