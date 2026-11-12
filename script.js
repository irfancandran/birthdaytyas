/* ===== 1. Bunga mekar di hero (PNG transparan di img/flower1..6.png) ===== */
(function () {
  const wrap = document.getElementById('roses');
  const scale = window.innerWidth < 700 ? 0.6 : 1;
  for (let i = 0; i < 28; i++) {
    let x, y;
    do { x = Math.random() * 100; y = Math.random() * 100; }
    while (Math.abs(x - 50) < 30 && Math.abs(y - 50) < 34);
    const size = (80 + Math.random() * 130) * scale;
    const img = document.createElement('img');
    img.src = 'img/flower' + (1 + (i % 6)) + '.png';
    img.alt = '';
    img.style.cssText = `left:${x}%;top:${y}%;width:${size}px;margin:-${size / 2}px 0 0 -${size / 2}px;` +
      `--r:${Math.random() * 360}deg;animation-delay:${Math.random() * 0.7}s`;
    wrap.appendChild(img);
  }
})();

/* ===== Fade-in-up tiap section ===== */
const io = new IntersectionObserver((es) => {
  es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ===== 2. Player vinyl + potongan lagu (start/end) ===== */
// Taruh mp3 di folder /audio dan foto polaroid di /img.
// start & end = bagian lagu yang diputar (opsional). Boleh angka detik (45) atau teks menit:detik ('0:45').
// Kosongkan/hapus start & end untuk memutar lagu penuh.
const tracks = [
  { title: 'Judul Lagu 1', artist: 'Artis 1', src: 'audio/lagu1.mp3', cover: 'img/lagu1.jpg', start: '0:45', end: '1:45' },
  { title: 'Judul Lagu 2', artist: 'Artis 2', src: 'audio/lagu2.mp3', cover: 'img/lagu2.jpg', start: 30,     end: 90 },
  { title: 'Judul Lagu 3', artist: 'Artis 3', src: 'audio/lagu3.mp3', cover: 'img/lagu3.jpg' }
];
(function () {
  const a = document.getElementById('audio'), vinyl = document.getElementById('vinyl'),
        playBtn = document.getElementById('play'), seek = document.getElementById('seek'),
        cur = document.getElementById('cur'), dur = document.getElementById('dur'),
        coverImg = document.getElementById('coverImg');
  let i = 0, S = 0, E = 0;
  const fmt = t => isFinite(t) && t > 0 ? Math.floor(t / 60) + ':' + String(Math.floor(t % 60)).padStart(2, '0') : '0:00';
  const toSec = v => {
    if (v == null || v === '') return 0;
    if (typeof v === 'number') return v;
    const p = String(v).split(':').map(Number);
    return p.reduce((acc, n) => acc * 60 + (n || 0), 0);
  };
  // batas awal & akhir efektif untuk lagu yang sedang aktif
  function bounds() {
    const t = tracks[i], d = a.duration || 0;
    S = Math.min(toSec(t.start), d || Infinity);
    const e = toSec(t.end);
    E = e > S ? (d ? Math.min(e, d) : e) : d;
  }
  function load(n, autoplay) {
    i = (n + tracks.length) % tracks.length;
    const t = tracks[i];
    a.src = t.src;
    document.getElementById('trackTitle').textContent = t.title;
    document.getElementById('trackArtist').textContent = t.artist;
    coverImg.style.display = ''; coverImg.src = t.cover || '';
    seek.value = 0; cur.textContent = '0:00';
    S = toSec(t.start); E = toSec(t.end); dur.textContent = fmt(E > S ? E - S : 0);
    if (autoplay) a.play().catch(() => {});
  }
  const toggle = () => (a.paused ? a.play().catch(() => {}) : a.pause());
  playBtn.onclick = toggle;
  document.getElementById('polaroid').onclick = toggle;
  document.getElementById('next').onclick = () => load(i + 1, !a.paused);
  document.getElementById('prev').onclick = () => load(i - 1, !a.paused);
  a.onloadedmetadata = () => { bounds(); a.currentTime = S; dur.textContent = fmt(E - S); };
  a.onplay = () => {
    if (a.readyState > 0 && (a.currentTime < S || (E && a.currentTime >= E))) a.currentTime = S;
    vinyl.classList.add('playing'); playBtn.innerHTML = '&#9208;';
  };
  a.onpause = () => { vinyl.classList.remove('playing'); playBtn.innerHTML = '&#9654;'; };
  a.onended = () => load(i + 1, true);
  a.ontimeupdate = () => {
    if (!E) bounds();
    if (E && a.currentTime >= E) { load(i + 1, true); return; }   // sampai detik akhir -> lagu berikutnya
    const len = E - S;
    seek.value = len > 0 ? Math.max(0, Math.min(100, ((a.currentTime - S) / len) * 100)) : 0;
    cur.textContent = fmt(a.currentTime - S);
  };
  seek.oninput = () => { if (E > S) a.currentTime = S + (seek.value / 100) * (E - S); };
  load(0, false);
})();

/* ===== 3a. Wishes: pop-up baca lengkap ===== */
(function () {
  const modal = document.getElementById('wishModal'), body = document.getElementById('wishModalBody'),
        closeBtn = document.getElementById('wishClose');
  const cards = document.querySelectorAll('.wish-card');
  let lastFocus = null;
  function open(card) {
    lastFocus = document.activeElement;
    body.innerHTML = '';
    const ph = card.querySelector('.ph'); if (ph) body.appendChild(ph.cloneNode(true));
    const h = document.createElement('h4'); h.textContent = card.querySelector('h4').textContent; body.appendChild(h);
    const t = document.createElement('div'); t.className = 'modal-text'; t.textContent = card.querySelector('p').textContent; body.appendChild(t);
    modal.hidden = false; closeBtn.focus();
  }
  function close() { modal.hidden = true; if (lastFocus) lastFocus.focus(); }
  cards.forEach(card => {
    card.tabIndex = 0; card.setAttribute('role', 'button');
    card.addEventListener('click', () => open(card));
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(card); } });
  });
  closeBtn.addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) close(); });
  // tampilkan "baca selengkapnya" hanya bila teks terpotong
  function markLong() {
    cards.forEach(card => {
      const p = card.querySelector('p'); let m = card.querySelector('.more');
      const long = p.scrollHeight > p.clientHeight + 2;
      if (long && !m) { m = document.createElement('span'); m.className = 'more'; m.textContent = 'baca selengkapnya \u203A'; card.appendChild(m); }
      if (!long && m) m.remove();
    });
  }
  markLong(); window.addEventListener('load', markLong); window.addEventListener('resize', markLong);
})();

/* ===== 3. Swiper wishes ===== */
if (window.Swiper) new Swiper('.wish-swiper', {
  slidesPerView: 1.4, spaceBetween: 14, grabCursor: true,
  navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
  breakpoints: { 480: { slidesPerView: 2 }, 768: { slidesPerView: 3 }, 1100: { slidesPerView: 6, spaceBetween: 16 } }
});

/* ===== 9. Kirim wish ke WhatsApp ===== */
const WA_NUMBER = '628XXXXXXXXXX'; // <-- GANTI dengan nomor WA-mu: format internasional, tanpa +, spasi, atau 0 di depan (contoh: 6281234567890)
document.getElementById('sendWish').addEventListener('click', () => {
  const text = document.getElementById('wishText').value.trim();
  const msg = document.getElementById('wishMsg');
  if (!text) { msg.textContent = 'Tulis wish-mu dulu ya.'; return; }
  msg.textContent = '';
  const url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent('Wish ulang tahunku: ' + text);
  window.location.href = url;
});
