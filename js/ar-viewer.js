// ── Map ID koleksi → element AR + label ──
let activeModel = null;
let activeEl = null;
let rotationY = 0;
let scale = 1;
let dragging = false;
let lastX = 0;
let lastDistance = 0;

const COLLECTION_MAP = {
  'painting-1': { elId: 'ar-painting-1', label: 'The Starry Night' },
  'painting-2': { elId: 'ar-painting-2', label: 'Farmhouse in Provence' },
  'painting-3': { elId: 'ar-painting-3', label: 'Self-Portrait' },
  'painting-4': { elId: 'ar-painting-4', label: 'Still Life with Yellow Straw Hat' },
  'painting-5': { elId: 'ar-painting-5', label: 'View of the Hague' },
  'painting-6': { elId: 'ar-painting-6', label: 'Woman Sewing and Cat' },
  'artifact-1': { elId: 'ar-artifact-1', label: 'Stag Statue' },
  'artifact-2': { elId: 'ar-artifact-2', label: 'Classical Statue' },
  'artifact-3': { elId: 'ar-artifact-3', label: 'Mayan Temple' },
};

const params = new URLSearchParams(window.location.search);
let collectionId = params.get('id');

if (!collectionId) {
  try {
    collectionId = sessionStorage.getItem('virtualMuseumSelectedId');
  } catch (error) {
    collectionId = null;
  }
}

if (!collectionId && typeof window.name === 'string') {
  const match = window.name.match(/^virtualMuseumSelectedId=(.+)$/);
  if (match) {
    collectionId = decodeURIComponent(match[1]);
  }
}

collectionId = collectionId || 'artifact-1';
const collection = COLLECTION_MAP[collectionId] || COLLECTION_MAP['artifact-1'];

// Tampilkan nama koleksi di header
document.getElementById('ar-collection-name').textContent = collection.label;

// Sembunyikan semua, tampilkan hanya yang sesuai
Object.values(COLLECTION_MAP).forEach(({ elId }) => {
  const el = document.getElementById(elId);
  if (el) el.setAttribute('visible', 'false');
});
activeEl = document.getElementById(collection.elId);
if (activeEl) activeEl.setAttribute('visible', 'true');

// Status marker
const marker = document.getElementById('hiro-marker');
const statusDot = document.getElementById('status-dot');
const statusText = document.getElementById('status-text');
const markerGuide = document.getElementById('marker-guide');
const permissionError = document.getElementById('permission-error');

function showCameraError(message) {
  if (permissionError) {
    const text = permissionError.querySelector('p');
    if (text && message) {
      text.textContent = message;
    }
    permissionError.classList.add('show');
  }
}

marker.addEventListener('markerFound', () => {
  statusDot.classList.add('detected');
  statusText.textContent = 'Marker terdeteksi ✓';
  markerGuide.classList.add('hidden');
  
  // Cari model untuk gesture control
  if (activeEl) {
    activeModel = activeEl.querySelector('a-gltf-model, a-plane');
    if (activeModel && !activeModel.getAttribute('scale')) {
      activeModel.setAttribute('scale', '1 1 1');
    }
  }
});
marker.addEventListener('markerLost', () => {
  statusDot.classList.remove('detected');
  statusText.textContent = 'Marker hilang — arahkan kembali';
  markerGuide.classList.remove('hidden');
});

// Tombol kembali
function goBack() {
  if (window.opener) { window.close(); }
  else { window.location.href = 'index.html'; }
}

// Fallback error kamera (timeout 8 detik)
setTimeout(() => {
  const video = document.querySelector('video');
  if (!video || video.readyState === 0) {
    showCameraError('Kamera tidak bisa dimulai. Pastikan halaman dibuka lewat HTTPS atau localhost, lalu izinkan akses kamera di browser.');
  }
}, 8000);

window.addEventListener('camera-error', (event) => {
  const error = event.detail && event.detail.error;
  const message = error && error.message ? error.message : 'Kamera tidak bisa dimulai. Periksa izin kamera browser.';
  showCameraError(message);
});

// ═══════════════════════════════════════════════
// GESTURE CONTROL — ROTATE, ZOOM
// ═══════════════════════════════════════════════

// ─── DESKTOP: Mouse Drag Rotate ───
window.addEventListener('mousedown', (e) => {
  if (!activeModel) return;
  dragging = true;
  lastX = e.clientX;
});

window.addEventListener('mouseup', () => {
  dragging = false;
});

window.addEventListener('mousemove', (e) => {
  if (!dragging || !activeModel) return;
  const delta = e.clientX - lastX;
  rotationY += delta * 0.5;
  activeModel.setAttribute('rotation', `0 ${rotationY} 0`);
  lastX = e.clientX;
});

// ─── DESKTOP: Mouse Wheel Zoom ───
window.addEventListener('wheel', (e) => {
  if (!activeModel) return;
  e.preventDefault();
  scale += e.deltaY * -0.0005;
  scale = Math.max(0.15, Math.min(scale, 1.5));
  activeModel.setAttribute('scale', `${scale} ${scale} ${scale}`);
}, { passive: false });

// ─── MOBILE: Touch Rotate + Pinch Zoom ───
window.addEventListener('touchstart', (e) => {
  if (!activeModel) return;
  if (e.touches.length !== 1) return;
  dragging = true;
  lastX = e.touches[0].clientX;
});

window.addEventListener('touchend', () => {
  dragging = false;
  lastDistance = 0;
});

window.addEventListener('touchmove', (e) => {
  if (!activeModel) return;

  // Single touch: ROTATE
  if (e.touches.length === 1 && dragging) {
    const x = e.touches[0].clientX;
    const delta = x - lastX;
    rotationY += delta * 0.4;
    activeModel.setAttribute('rotation', `0 ${rotationY} 0`);
    lastX = x;
  }

  // Two touch: PINCH ZOOM
  if (e.touches.length === 2) {
    e.preventDefault();
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (lastDistance) {
      scale += (distance - lastDistance) * 0.002;
      scale = Math.max(0.15, Math.min(scale, 1.5));
      activeModel.setAttribute('scale', `${scale} ${scale} ${scale}`);
    }
    lastDistance = distance;
  }
}, { passive: false });