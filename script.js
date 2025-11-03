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
const ceritaRef = ref(db, "Cerita");

// Scroll ke cerita
document.getElementById("scrollToStory").addEventListener("click", () => {
  document.getElementById("cerita-section").scrollIntoView({ behavior: "smooth" });
});

// Ambil data cerita
onValue(ceritaRef, (snapshot) => {
  const container = document.getElementById("cerita-container");
  const momentTimeline = document.getElementById("moment-timeline");
  container.innerHTML = "";
  momentTimeline.innerHTML = "";

  const data = snapshot.val();
  if (!data) {
    container.innerHTML = "<p>Belum ada cerita ditambahkan.</p>";
    return;
  }

  Object.entries(data).forEach(([id, cerita]) => {
    const card = document.createElement("div");
    card.classList.add("cerita-card");
    card.innerHTML = `
      <h3>${cerita.Judul}</h3>
      <small>${cerita.Tanggal || ""}</small>
      <p>${cerita.Isi.substring(0, 100)}...</p>
    `;
    card.onclick = () => openModal(cerita);
    container.appendChild(card);

    // Tambahkan ke timeline moment
    const item = document.createElement("div");
    item.classList.add("moment-item");
    item.innerHTML = `<h4>${cerita.Tanggal}</h4><p>${cerita.Judul}</p>`;
    momentTimeline.appendChild(item);
  });
});

// Modal popup
const modal = document.getElementById("detailModal");
const closeModal = document.getElementById("closeModal");

function openModal(cerita) {
  document.getElementById("modalTitle").innerText = cerita.Judul;
  document.getElementById("modalDate").innerText = cerita.Tanggal || "";
  document.getElementById("modalContent").innerText = cerita.Isi;
  modal.style.display = "block";
}

closeModal.onclick = () => (modal.style.display = "none");
window.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };

// Scroll reveal timeline
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.2 });

document.querySelectorAll(".moment-item").forEach(item => observer.observe(item));

// Live duration counter
const startDate = new Date("2024-11-22");
const daysEl = document.getElementById("daysTogether");

function updateDaysTogether() {
  const now = new Date();
  const diff = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
  animateNumber(diff);
}

function animateNumber(finalValue) {
  let counter = Math.floor(Math.random() * 100) + 100;
  const step = (finalValue - counter) / 100;
  const interval = setInterval(() => {
    counter += step;
    daysEl.textContent = Math.floor(counter);
    if (Math.floor(counter) >= finalValue) {
      daysEl.textContent = finalValue;
      clearInterval(interval);
    }
  }, 40);
}

setTimeout(updateDaysTogether, 1000);

// --- ✨ Scroll Animation Observer ---
const fadeEls = document.querySelectorAll(".fade-in, section, .cerita-card, .moment-item");

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.2 });

fadeEls.forEach((el) => fadeObserver.observe(el));

// Smooth scroll ke bagian cerita
const scrollBtn = document.getElementById("scrollToStory");
if (scrollBtn) {
  scrollBtn.addEventListener("click", () => {
    const storySection = document.getElementById("cerita-section");
    if (storySection) {
      storySection.scrollIntoView({ behavior: "smooth" });
    }
  });
}

// Animasi fade-in saat scroll
const fadeElements = document.querySelectorAll('.fade-in-section');

function handleFadeIn() {
  fadeElements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      el.classList.add('visible');
    }
  });
}

window.addEventListener('scroll', handleFadeIn);
window.addEventListener('load', handleFadeIn);
