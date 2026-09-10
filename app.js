// Render & interaksi direktori Romo Jesuit

const i18n = {
  id: {
    siteTitle: "ROMO JESUIT INDONESIA",
    siteSub: "PROVINSI INDONESIA · SERIKAT JESUS",
    sitePilgrim: "Peziarah dalam Misi Kristus",
    heroIntro: "Direktori ini memuat nama para Pater & Bruder Jesuit (S.J.) Indonesia — yang masih aktif bertugas di berbagai karya dan lokasi, serta yang telah berpulang dengan kasih.",
    sourceNote: "Sumber data: Berita Pengutusan, Obituari, & halaman Komunitas Jesuit Indonesia. Provinsi Indonesia memiliki ±339 Jesuit (246 imam, 74 skolastik, 19 bruder; data 2021) — direktori ini belum lengkap dan bukan daftar resmi.",
    searchPlaceholder: "Cari nama, lokasi, atau tugas…",
    tabActive: "Aktif Bertugas",
    tabDeceased: "Telah Berpulang",
    tabCommunities: "Komunitas",
    communitiesHint: "Ringkasan jumlah anggota & superior per komunitas Serikat Jesus Provinsi Indonesia (sumber: halaman komunitas jesuits.id; angka dapat berubah).",
    statTotal: "Total Jesuit",
    statPriests: "Imam",
    statScholastics: "Skolastik",
    statBrothers: "Bruder",
    statAsOf: "data",
    superiorLabel: "Superior",
    membersLabel: "anggota",
    communitiesCount: "komunitas",
    otherLabel: "Belum teridentifikasi komunitasnya",
    otherHint: "Anggota yang komunitasnya belum dapat dipastikan dari data publik.",
    activeHint: "Pater, Bruder, & skolastik Jesuit yang kini aktif bertugas/karya di berbagai lokasi.",
    deceasedHint: "Para Jesuit Indonesia yang telah kembali ke rumah Bapa. Tampil riwayat: lahir, masuk novisiat, tahbisan imam, kaul kekal, & studi.<br>*Semoga mereka beristirahat dalam damai.*",
    categoryLabel: "Kategori",
    catAll: "Semua",
    catStudents: "Mahasiswa / Skolastik",
    catFathers: "Pater / Imam",
    catBrothers: "Bruder",
    catProvincials: "Provinsial SJ",
    emptyState: "Tidak ada hasil untuk pencarian tersebut.",
    footerText: "Dikompilasi dari berbagai situs resmi Katolik.",
    motto: "Ad Maiorem Dei Gloriam — Demi Kemuliaan Allah yang Lebih Besar.",
    credit: "Dibuat oleh Yayasan Santa Adeline Kasih"
  },
  en: {
    siteTitle: "INDONESIAN PROVINCE OF THE SOCIETY OF JESUS",
    siteSub: "INDONESIA PROVINCE · SOCIETY OF JESUS",
    sitePilgrim: "Pilgrims on Christ's Mission",
    heroIntro: "This directory lists the names of Indonesian Jesuit priests and brothers (S.J.) — those still actively serving in various ministries and places, and those who have passed away in love.",
    sourceNote: "Data source: Assignment News, Obituaries, & Community pages of Jesuit Indonesia. The Indonesian Province has ±339 Jesuits (246 priests, 74 scholastics, 19 brothers; 2021 data) — this directory is incomplete and not an official list.",
    searchPlaceholder: "Search name, location, or role…",
    tabActive: "Active in Mission",
    tabDeceased: "Deceased",
    tabCommunities: "Communities",
    communitiesHint: "Summary of members and superior per community of the Indonesian Province of the Society of Jesus (source: jesuits.id community pages; figures may change).",
    statTotal: "Total Jesuits",
    statPriests: "Priests",
    statScholastics: "Scholastics",
    statBrothers: "Brothers",
    statAsOf: "data",
    superiorLabel: "Superior",
    membersLabel: "members",
    communitiesCount: "communities",
    otherLabel: "Community not identified",
    otherHint: "Members whose community could not be determined from public data.",
    activeHint: "Jesuit priests, brothers, and scholastics currently serving in various ministries and places.",
    deceasedHint: "Indonesian Jesuits who have returned to the Father's house. Showing: birth, entrance into the novitiate, priestly ordination, final vows, & studies.<br>*May they rest in peace.*",
    categoryLabel: "Category",
    catAll: "All",
    catStudents: "Students / Scholastics",
    catFathers: "Fathers / Priests",
    catBrothers: "Brothers",
    catProvincials: "SJ Provincials",
    emptyState: "No results for this search.",
    footerText: "Compiled from various official Catholic websites.",
    motto: "Ad Maiorem Dei Gloriam — For the Greater Glory of God.",
    credit: "Created by the Santa Adeline Kasih Foundation"
  }
};

let lang = localStorage.getItem("sj-lang") || "id";
function applyLang() {
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const k = el.getAttribute("data-i18n");
    if (i18n[lang][k]) el.innerHTML = i18n[lang][k];
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const k = el.getAttribute("data-i18n-placeholder");
    if (i18n[lang][k]) el.placeholder = i18n[lang][k];
  });
  const lt = document.getElementById("langToggle");
  lt.textContent = lang === "id" ? "EN" : "ID";
}
document.getElementById("langToggle").addEventListener("click", () => {
  lang = lang === "id" ? "en" : "id";
  localStorage.setItem("sj-lang", lang);
  applyLang();
  applyFilter();
  if (currentView === "communities") renderCommunities();
});

const activeListEl = document.getElementById("activeList");
const deceasedListEl = document.getElementById("deceasedList");
const emptyStateEl = document.getElementById("emptyState");
const searchEl = document.getElementById("search");

function highlight(text, q) {
  if (!q) return text;
  const re = new RegExp(escapeRegExp(q), "gi");
  return text.replace(re, (m) => `<mark>${m}</mark>`);
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalize(s) {
  return (s || "").toLowerCase();
}

function catOf(p) {
  const n = p.name || "";
  if (n.startsWith("S. ") || n.startsWith("Sch. ") || n.startsWith("Fr. ")) return "mahasiswa";
  if (n.startsWith("F. ") || n.startsWith("Br. ") || n.startsWith("Bruder ")) return "bruder";
  if (n.startsWith("P. ") || n.startsWith("RP. ")) return "pater";
  return "lain";
}

function renderActive(list) {
  activeListEl.innerHTML = "";
  const frag = document.createDocumentFragment();
  list.forEach((p) => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      ${p.photo ? `<div class="card-photo${p.isProvincial ? " portrait" : ""}${p.photoZoom ? " zoom" : ""}"><img src="${p.photo}" alt="${p.name}" /></div>` : ""}
      <div class="card-main">
        <h3>${highlight(p.name, currentQuery)}</h3>
        <p class="role">${highlight(p.role, currentQuery)}</p>
        <p class="place">${highlight(p.place, currentQuery)}</p>
        ${p.ordination ? `<p class="rio">Tahbisan: ${highlight(p.ordination, currentQuery)}</p>` : ""}
        ${p.diakon ? `<p class="rio">${highlight(p.diakon, currentQuery)}</p>` : ""}
        ${p.kaulAkhir ? `<p class="rio">${highlight(p.kaulAkhir, currentQuery)}</p>` : ""}
      </div>
      ${p.since ? `<span class="badge">Mulai ${highlight(p.since, currentQuery)}</span>` : ""}
    `;
    frag.appendChild(card);
  });
  activeListEl.appendChild(frag);
}

const details = [
  ["Lahir", "born"],
  ["Masuk Serikat Jesus (Novisiat)", "entered"],
  ["Kaul Pertama", "firstVows"],
  ["Tahbisan Imam", "ordination"],
  ["Kaul Kekal / Akhir", "vows"],
  ["Pendidikan & Studi", "studies"],
];

function renderDeceased(list) {
  deceasedListEl.innerHTML = "";
  const frag = document.createDocumentFragment();
  list.forEach((p) => {
    const card = document.createElement("article");
    card.className = "card deceased-card";
    const body = details
      .filter(([label, key]) => p[key])
      .map(([label, key]) => {
        let val = p[key];
        if (key === "born") val = `<em>${val}</em>`;
        else if (key === "studies")
          val = `<span class="studies-text">${val}</span>`;
        return `
          <div class="d-row">
            <span class="d-label">${label}</span>
            <span class="d-value">${highlight(val, currentQuery)}</span>
          </div>`;
      })
      .join("");
    const hasBody = body.length > 0;
    card.innerHTML = `
      <div class="card-main">
        <h3>${highlight(p.name, currentQuery)}</h3>
        ${p.died ? `<p class="died">${highlight("✝ Wafat " + p.died, currentQuery)}</p>` : ""}
        <div class="bio">
          ${body || `<p class="note">${highlight(p.studies || "Rincian riwayat tidak tersedia.", currentQuery)}</p>`}
        </div>
        ${hasBody ? `<button class="toggle-bio" type="button">Sembunyikan ▴</button>` : ""}
      </div>
      <span class="cross">✝</span>
    `;
    const btn = card.querySelector(".toggle-bio");
    if (btn) {
      btn.addEventListener("click", () => {
        const bio = card.querySelector(".bio");
        bio.classList.toggle("collapsed");
        btn.textContent = bio.classList.contains("collapsed") ? "Lihat riwayat ▾" : "Sembunyikan ▴";
      });
    }
    frag.appendChild(card);
  });
  deceasedListEl.appendChild(frag);
}

function renderCommunities() {
  const t = i18n[lang];
  const statsEl = document.getElementById("provinceStats");
  const listEl = document.getElementById("communitiesList");
  const ps = provinceStats;
  statsEl.innerHTML = `
    <div class="stat-card"><span class="stat-num">${ps.total}</span><span class="stat-label">${t.statTotal}</span><span class="stat-sub">${t.statAsOf} ${ps.asOf}</span></div>
    <div class="stat-card"><span class="stat-num">${ps.priests}</span><span class="stat-label">${t.statPriests}</span></div>
    <div class="stat-card"><span class="stat-num">${ps.scholastics}</span><span class="stat-label">${t.statScholastics}</span></div>
    <div class="stat-card"><span class="stat-num">${ps.brothers}</span><span class="stat-label">${t.statBrothers}</span></div>
  `;
  listEl.innerHTML = "";
  const frag = document.createDocumentFragment();
  communities.forEach((c) => {
    const card = document.createElement("article");
    card.className = "comm-card";
    const parts = [];
    if (c.priests != null) parts.push(`${c.priests} ${t.statPriests}`);
    if (c.scholastics != null) parts.push(`${c.scholastics} ${t.statScholastics}`);
    if (c.brothers != null) parts.push(`${c.brothers} ${t.statBrothers}`);
    if (c.novices != null) parts.push(`${c.novices} novis`);
    const mem = (c.members || []).map((n) => `<li>${n}</li>`).join("");
    card.innerHTML = `
      <h3>${c.name}</h3>
      ${c.place ? `<p class="comm-place">${c.place}</p>` : ""}
      ${c.superior ? `<p class="comm-sup">${t.superiorLabel}: ${c.superior}</p>` : ""}
      ${parts.length ? `<p class="comm-parts">${parts.join(" · ")}</p>` : ""}
      <span class="badge">${c.total != null ? c.total + " " + t.membersLabel : "—"}</span>
      ${mem ? `<ul class="comm-members">${mem}</ul>` : ""}
    `;
    frag.appendChild(card);
  });
  if (typeof otherJesuits !== "undefined" && otherJesuits.length) {
    const card = document.createElement("article");
    card.className = "comm-card other";
    card.innerHTML = `
      <h3>${t.otherLabel} (${otherJesuits.length})</h3>
      <p class="comm-place">${t.otherHint}</p>
      <ul class="comm-members">${otherJesuits.map((j) => `<li>${j.name}</li>`).join("")}</ul>
    `;
    frag.appendChild(card);
  }
  listEl.appendChild(frag);
}

let currentQuery = "";
let currentView = "active";
let currentCat = "";
const activeCountEl = document.getElementById("activeCount");

function applyActiveFilter() {
  if (currentCat === "provincial") {
    let list = provincials.map((p) => ({ name: p.name, role: p.detail, place: p.period, since: "", photo: p.photo, photoZoom: p.photoZoom, isProvincial: true }));
    const qp = normalize(currentQuery.trim());
    if (qp) list = list.filter((p) => normalize("romo pater " + p.name + " " + p.role + " " + p.place).includes(qp));
    return list;
  }
  let list = activeJesuits;
  if (currentCat) list = list.filter((p) => catOf(p) === currentCat);
  const q = normalize(currentQuery.trim());
  if (q) list = list.filter((p) => normalize("romo pater bruder " + p.name + " " + p.role + " " + p.place + " " + (p.ordination || "") + " " + (p.diakon || "") + " " + (p.kaulAkhir || "")).includes(q));
  return list;
}

function applyFilter() {
  const q = normalize(currentQuery.trim());
  if (currentView === "communities") return;
  if (currentView === "active") {
    const filtered = applyActiveFilter();
    renderActive(filtered);
    activeCountEl.textContent = filtered.length + " orang";
    emptyStateEl.classList.toggle("hidden", filtered.length > 0);
  } else {
    const filtered = q
      ? deceasedJesuits.filter((p) =>
          normalize(
            "romo pater bruder " + p.name + " " + (p.died || "") + " " + (p.born || "") + " " +
            (p.entered || "") + " " + (p.ordination || "") + " " +
            (p.vows || "") + " " + (p.studies || "")
          ).includes(q)
        )
      : deceasedJesuits;
    renderDeceased(filtered);
    emptyStateEl.classList.toggle("hidden", filtered.length > 0);
  }
}

function setView(view) {
  currentView = view;
  document.querySelectorAll(".tab").forEach((t) =>
    t.classList.toggle("active", t.dataset.view === view)
  );
  document.getElementById("activeView").classList.toggle("hidden", view !== "active");
  document.getElementById("deceasedView").classList.toggle("hidden", view !== "deceased");
  document.getElementById("communitiesView").classList.toggle("hidden", view !== "communities");
  if (view === "communities") renderCommunities();
  applyFilter();
}

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => setView(tab.dataset.view));
});

searchEl.addEventListener("input", (e) => {
  currentQuery = e.target.value;
  applyFilter();
});

const catCarousel = document.getElementById("catCarousel");

function countCats() {
  const counts = { all: activeJesuits.length, mahasiswa: 0, pater: 0, bruder: 0, provincial: provincials.length };
  activeJesuits.forEach((p) => {
    const c = catOf(p);
    if (c in counts && c !== "provincial") counts[c]++;
  });
  catCarousel.querySelectorAll("[data-count]").forEach((el) => {
    const key = el.getAttribute("data-count");
    el.textContent = counts[key] ?? 0;
  });
}

catCarousel.addEventListener("click", (e) => {
  const card = e.target.closest(".cat-card");
  if (!card) return;
  currentCat = card.dataset.cat;
  catCarousel.querySelectorAll(".cat-card").forEach((c) => c.classList.toggle("active", c === card));
  setView("active");
});

function scrollCarousel(dir) {
  catCarousel.scrollBy({ left: dir * 220, behavior: "smooth" });
}
document.getElementById("catPrev").addEventListener("click", () => scrollCarousel(-1));
document.getElementById("catNext").addEventListener("click", () => scrollCarousel(1));

const activeListCarousel = document.getElementById("activeList");
function scrollList(dir) {
  activeListCarousel.scrollBy({ left: dir * 330, behavior: "smooth" });
}
document.getElementById("listPrev").addEventListener("click", () => scrollList(-1));
document.getElementById("listNext").addEventListener("click", () => scrollList(1));

function init() {
  document.getElementById("countActive").textContent = activeJesuits.length;
  document.getElementById("countDeceased").textContent = deceasedJesuits.length;
  document.getElementById("countCommunities").textContent = communities.length;
  countCats();
  applyLang();
  setView("active");
}

init();

// Tema gelap/terang
const toggle = document.getElementById("themeToggle");
const saved = localStorage.getItem("sj-theme");
if (saved) document.body.dataset.theme = saved;
toggle.addEventListener("click", () => {
  const next = document.body.dataset.theme === "dark" ? "light" : "dark";
  document.body.dataset.theme = next;
  localStorage.setItem("sj-theme", next);
});
