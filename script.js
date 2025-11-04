// ---------- Firebase + app setup (Realtime DB) ----------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, onValue, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCxsOubMJerDL1hXd63xHi58vV_GuY0Hg",
  authDomain: "ceritakita-22.firebaseapp.com",
  databaseURL: "https://ceritakita-22-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "ceritakita-22",
  storageBucket: "ceritakita-22.appspot.com",
  messagingSenderId: "952342930337",
  appId: "1:952342930337:web:bcdccbb012a5a4f4aa61e0"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// node "Cerita"
const ceritaRef = ref(db, "Cerita");

// ---------- UI helpers ----------
function el(tag, attrs = {}, children = []) {
  const e = document.createElement(tag);
  Object.entries(attrs).forEach(([k,v])=>{
    if (k === "class") e.className = v;
    else if (k === "html") e.innerHTML = v;
    else e.setAttribute(k, v);
  });
  children.forEach(c => e.appendChild(c));
  return e;
}

// ---------- Smooth scroll for header/dedikasi -->
document.getElementById("to-dedikasi").addEventListener("click", ()=> {
  document.getElementById("dedikasi-section").scrollIntoView({behavior:"smooth"});
});
document.getElementById("to-cerita").addEventListener("click", ()=> {
  document.getElementById("cerita-section").scrollIntoView({behavior:"smooth"});
});

// ---------- Music autoplay attempt + toggle ----------
const music = document.getElementById("bg-music");
const musicBtn = document.getElementById("music-toggle");
// Try play (some browsers block autoplay; this will attempt)
function tryPlayMusic(){
  if(!music) return;
  music.volume = 0.5;
  music.play().then(()=> {
    musicBtn.textContent = "🔊";
  }).catch(()=> {
    // blocked — show muted icon until user interacts
    musicBtn.textContent = "🔇";
  });
}
tryPlayMusic();

musicBtn.addEventListener("click", ()=> {
  if(!music) return;
  if(music.paused){ music.play(); musicBtn.textContent="🔊"; }
  else { music.pause(); musicBtn.textContent="🔇"; }
});

// ---------- Fetch Cerita & render (Realtime) ----------
const ceritaContainer = document.getElementById("cerita-container");
const momentTimeline = document.getElementById("moment-timeline");
const judulCerita = document.getElementById("judul-cerita");

// render single card (open detail in new tab)
function renderCard(key, data){
  const img = el("img", { class:"cerita-thumb", src: data.foto || "images/couple.jpg", alt: data.judul || "" });
  const h3 = el("h3", {}, []); h3.textContent = data.judul || "Tanpa judul";
  const dateP = el("p", {}, []); dateP.textContent = data.tanggal || "";
  const snippet = el("p", {}, []); snippet.textContent = (data.isi||"").substring(0,140) + ( (data.isi||"").length>140 ? "..." : "");
  const card = el("div", { class:"cerita-card", role:"button", tabindex:"0" }, []);
  card.append(img, h3, dateP, snippet);
  card.addEventListener("click", ()=> {
    // open detail.html with query param id=key in new tab (user requested new tab)
    window.open(`detail.html?id=${encodeURIComponent(key)}`, "_blank");
  });
  card.addEventListener("keypress", (e)=> { if(e.key === "Enter") card.click(); });
  return card;
}

// render timeline moment point
function renderMoment(key, data){
  const dotWrap = el("div", { class:"moment-dot" }, []);
  const title = el("h4", {}, []); title.textContent = data.judul || "";
  const date = el("p", {}, []); date.textContent = data.tanggal || "";
  const dot = el("div", { class:"dot" }, []);
  dotWrap.append(dot, title, date);
  // hover tooltip handled via CSS/pseudo (ke sederhana)
  return dotWrap;
}

// listen realtime
onValue(ceritaRef, snapshot => {
  const val = snapshot.val();
  ceritaContainer.innerHTML = "";
  momentTimeline.innerHTML = "";

  if(!val){
    ceritaContainer.innerHTML = "<p style='color:#f0b6d1'>Belum ada cerita ditambahkan.</p>";
    return;
  }

  // Sort by tanggal ascending
  const entries = Object.entries(val).map(([k,v]) => ({ key:k, ...v }))
    .sort((a,b) => new Date(a.tanggal) - new Date(b.tanggal));

  entries.forEach(item => {
    ceritaContainer.appendChild(renderCard(item.key, item));
    momentTimeline.appendChild(renderMoment(item.key, item));
  });

  // re-init AOS on new content
  if(window.AOS) window.AOS.refresh();
});

// ---------- Anniversary counter (rolling -> real) ----------
const start = new Date("2024-11-22T00:00:00");
const durationEl = document.getElementById("duration");

function computeDiff(now){
  const diff = now - start;
  const days = Math.floor(diff / (1000*60*60*24));
  const hours = Math.floor((diff / (1000*60*60)) % 24);
  const minutes = Math.floor((diff / (1000*60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return {days,hours,minutes,seconds};
}

let revealDone = false;
function runCounter(){
  const target = computeDiff(new Date());
  // first do random rolling for ~4.2s, update fast
  const totalMs = 4200; // ~4.2s
  const frames = 70;
  let frame = 0;
  const startRand = {
    days: Math.max(1, Math.floor(Math.random()*200)),
    hours: Math.floor(Math.random()*24),
    minutes: Math.floor(Math.random()*60),
    seconds: Math.floor(Math.random()*60)
  };
  const interval = setInterval(()=>{
    frame++;
    const t = frame/frames;
    // simple lerp
    const d = Math.floor(startRand.days + (target.days - startRand.days)*t);
    const h = Math.floor(startRand.hours + (target.hours - startRand.hours)*t);
    const m = Math.floor(startRand.minutes + (target.minutes - startRand.minutes)*t);
    const s = Math.floor(startRand.seconds + (target.seconds - startRand.seconds)*t);
    durationEl.innerHTML = `<strong>${d}</strong> hari ${h} jam ${m} menit ${s} detik ❤️`;
    if(frame>=frames){ clearInterval(interval); revealDone = true; }
  }, totalMs/frames);
}

// after reveal, run live ticking each second
function startLiveTick(){
  setInterval(() => {
    const now = new Date();
    const t = computeDiff(now);
    durationEl.innerHTML = `<strong>${t.days}</strong> hari ${t.hours} jam ${t.minutes} menit ${t.seconds} detik ❤️`;
  }, 1000);
}

// trigger reveal when anniversary section visible
const annSection = document.getElementById("anniversary-section");
const annObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting && !revealDone){
      runCounter();
      // delay a little then start live tick to ensure final is locked then live updates
      setTimeout(()=> startLiveTick(), 4500);
      // only run once
    } else if(entry.isIntersecting && revealDone){
      // already done, ensure live tick is running (if not started earlier)
      // don't start duplicate intervals; okay to ignore because startLiveTick uses setInterval.
    }
  });
},{threshold:0.4});
if(annSection) annObs.observe(annSection);

// ---------- Fade-in sections (fallback when not using Aos) ----------
const fadeEls = document.querySelectorAll(".fade-in-section");
const fadeObs = new IntersectionObserver(entries=>{
  entries.forEach(en=>{
    if(en.isIntersecting) en.target.classList.add("visible");
  });
},{threshold:0.25});
fadeEls.forEach(e=>fadeObs.observe(e));

// enable keyboard nav if needed
document.addEventListener("keydown", (e)=>{
  if(e.key === "ArrowRight"){
    const cont = document.getElementById("cerita-container");
    if(cont) cont.scrollBy({left:320, behavior:"smooth"});
  } else if(e.key === "ArrowLeft"){
    const cont = document.getElementById("cerita-container");
    if(cont) cont.scrollBy({left:-320, behavior:"smooth"});
  }
});
