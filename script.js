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

/* ===== 2. Player vinyl ===== */
// Taruh file mp3 di folder /audio lalu ganti daftar ini
const tracks = [
  { title: 'Judul Lagu 1', artist: 'Artis 1', src: 'audio/lagu1.mp3' },
  { title: 'Judul Lagu 2', artist: 'Artis 2', src: 'audio/lagu2.mp3' },
  { title: 'Judul Lagu 3', artist: 'Artis 3', src: 'audio/lagu3.mp3' }
];
(function () {
  const a = document.getElementById('audio'), vinyl = document.getElementById('vinyl'),
        playBtn = document.getElementById('play'), seek = document.getElementById('seek'),
        cur = document.getElementById('cur'), dur = document.getElementById('dur');
  let i = 0;
  const fmt = t => isFinite(t) ? Math.floor(t / 60) + ':' + String(Math.floor(t % 60)).padStart(2, '0') : '0:00';
  function load(n, autoplay) {
    i = (n + tracks.length) % tracks.length;
    a.src = tracks[i].src;
    document.getElementById('trackTitle').textContent = tracks[i].title;
    document.getElementById('trackArtist').textContent = tracks[i].artist;
    seek.value = 0;
    if (autoplay) a.play().catch(() => {});
  }
  playBtn.onclick = () => (a.paused ? a.play().catch(() => {}) : a.pause());
  document.getElementById('next').onclick = () => load(i + 1, !a.paused);
  document.getElementById('prev').onclick = () => load(i - 1, !a.paused);
  a.onplay = () => { vinyl.classList.add('playing'); playBtn.innerHTML = '&#9208;'; };
  a.onpause = () => { vinyl.classList.remove('playing'); playBtn.innerHTML = '&#9654;'; };
  a.onended = () => load(i + 1, true);
  a.ontimeupdate = () => { seek.value = a.duration ? (a.currentTime / a.duration) * 100 : 0; cur.textContent = fmt(a.currentTime); };
  a.onloadedmetadata = () => dur.textContent = fmt(a.duration);
  seek.oninput = () => { if (a.duration) a.currentTime = (seek.value / 100) * a.duration; };
  load(0, false);
})();

/* ===== 3. Swiper wishes ===== */
new Swiper('.wish-swiper', {
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
