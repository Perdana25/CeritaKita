// ---------- Firebase + app setup (Realtime DB) ----------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

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

// UI helper
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

// Smooth scroll for header/dedikasi
const toDed = document.getElementById("to-dedikasi");
if(toDed) toDed.addEventListener("click", ()=> {
  document.getElementById("dedikasi-section").scrollIntoView({behavior:"smooth"});
});
const toCer = document.querySelector(".journey-btn");
if(toCer) toCer.addEventListener("click", (e)=> {
  e.preventDefault();
  document.getElementById("cerita-section").scrollIntoView({behavior:"smooth"});
});

// Music autoplay + toggle
const music = document.getElementById("bg-music");
const musicBtn = document.getElementById("music-toggle");
function tryPlayMusic(){
  if(!music) return;
  music.volume = 0.45;
  const playPromise = music.play();
  if(playPromise !== undefined){
    playPromise.then(()=>{
      musicBtn.textContent = "🔊";
    }).catch(err=>{
      console.warn("Autoplay blocked or file not found:", err);
      musicBtn.textContent = "🔇";
    });
  }
}
tryPlayMusic();
musicBtn.addEventListener("click", ()=> {
  if(!music) return;
  if(music.paused){ music.play(); musicBtn.textContent="🔊"; }
  else { music.pause(); musicBtn.textContent="🔇"; }
});

// render card and moment
const ceritaContainer = document.getElementById("cerita-container");
const momentTimeline = document.getElementById("moment-timeline");

function renderCard(key, data){
  const img = el("img", { class:"cerita-thumb", src: data.foto || "images/couple.jpg", alt: data.judul || "" });
  const h3 = el("h3", {}, []); h3.textContent = data.judul || "Tanpa judul";
  const dateSpan = el("span", { class:"cerita-date" }, []); 
  if (data.tanggal && data.tanggal.trim() !== "") dateSpan.textContent = data.tanggal;
  else dateSpan.textContent = "Tanggal tidak tersedia";
  const snippet = el("p", {}, []); snippet.textContent = (data.isi||"").substring(0,140) + ((data.isi||"").length>140 ? "..." : "");
  const card = el("div", { class:"cerita-card", role:"button", tabindex:"0" }, []);
  card.append(img, h3, dateSpan, snippet);
  card.addEventListener("click", ()=> { window.open(`detail.html?id=${encodeURIComponent(key)}`, "_blank"); });
  return card;
}
function renderMoment(key, data){
  const dotWrap = el("div", { class:"moment-dot" }, []);
  const title = el("h4", {}, []); title.textContent = data.judul || "";
  const date = el("p", {}, []); date.textContent = data.tanggal || "";
  const dot = el("div", { class:"dot" }, []);
  dotWrap.append(dot, title, date);
  return dotWrap;
}

// listen realtime and render; sort by tanggal
onValue(ceritaRef, snapshot => {
  const val = snapshot.val();
  ceritaContainer.innerHTML = "";
  momentTimeline.innerHTML = "";
  if(!val){
    ceritaContainer.innerHTML = "<p style='color:#f0b6d1'>Belum ada cerita ditambahkan.</p>";
    return;
  }
  const entries = Object.entries(val).map(([k,v])=> ({key:k, ...v}))
    .sort((a,b) => {
      const da = a.tanggal ? new Date(a.tanggal) : new Date(0);
      const db = b.tanggal ? new Date(b.tanggal) : new Date(0);
      return da - db;
    });
  entries.forEach(item => {
    ceritaContainer.appendChild(renderCard(item.key, item));
    momentTimeline.appendChild(renderMoment(item.key, item));
  });
  if(window.AOS) window.AOS.refresh();
});

// Anniversary counter
const start = new Date("2024-11-22T00:00:00");
const durationEl = document.getElementById("duration");
function computeDiff(now){ const diff= now - start; return {
  days: Math.floor(diff/(1000*60*60*24)),
  hours: Math.floor((diff/(1000*60*60))%24),
  minutes: Math.floor((diff/(1000*60))%60),
  seconds: Math.floor((diff/1000)%60)
};}
let revealDone=false;
function runCounter(){
  const target = computeDiff(new Date());
  const totalMs=4200; const frames=70; let frame=0;
  const startRand={days:Math.max(1,Math.floor(Math.random()*200)),hours:Math.floor(Math.random()*24),minutes:Math.floor(Math.random()*60),seconds:Math.floor(Math.random()*60)};
  const interval = setInterval(()=>{ frame++; const t=frame/frames;
    const d = Math.floor(startRand.days + (target.days - startRand.days)*t);
    const h = Math.floor(startRand.hours + (target.hours - startRand.hours)*t);
    const m = Math.floor(startRand.minutes + (target.minutes - startRand.minutes)*t);
    const s = Math.floor(startRand.seconds + (target.seconds - startRand.seconds)*t);
    durationEl.innerHTML = `<strong>${d}</strong> hari ${h} jam ${m} menit ${s} detik ❤️`;
    if(frame>=frames){ clearInterval(interval); revealDone=true; }
  }, totalMs/frames);
}
function startLiveTick(){
  setInterval(()=>{ const t=computeDiff(new Date()); durationEl.innerHTML = `<strong>${t.days}</strong> hari ${t.hours} jam ${t.minutes} menit ${t.seconds} detik ❤️`; },1000);
}
const annSection = document.getElementById("anniversary-section");
const annObs = new IntersectionObserver(entries=>{
  entries.forEach(entry => {
    if(entry.isIntersecting && !revealDone){ runCounter(); setTimeout(()=> startLiveTick(), 4500); }
  });
},{threshold:0.4});
if(annSection) annObs.observe(annSection);

// Fade-in sections
const fadeEls = document.querySelectorAll(".fade-in-section");
const fadeObs = new IntersectionObserver(entries=>{ entries.forEach(en=>{ if(en.isIntersecting) en.target.classList.add("visible"); }); },{threshold:0.25});
fadeEls.forEach(e=>fadeObs.observe(e));

// keyboard nav for horizontal
document.addEventListener("keydown", (e)=>{
  const cont = document.getElementById("cerita-container");
  if(!cont) return;
  if(e.key === "ArrowRight") cont.scrollBy({left:320, behavior:"smooth"});
  else if(e.key === "ArrowLeft") cont.scrollBy({left:-320, behavior:"smooth"});
});
