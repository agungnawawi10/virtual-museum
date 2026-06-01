// ── Map ID koleksi → element AR + label ──
const COLLECTION_MAP = {
  'painting-1': { elId: 'ar-painting-1', label: 'The Starry Night'       },
  'painting-2': { elId: 'ar-painting-2', label: 'Farmhouse in Provence'  },
  'painting-3': { elId: 'ar-painting-3', label: 'Self-Portrait'          },
  'artifact-1': { elId: 'ar-artifact-1', label: 'Stag Statue'            },
  'artifact-2': { elId: 'ar-artifact-2', label: 'Classical Statue'       },
  'artifact-3': { elId: 'ar-artifact-3', label: 'Mayan Temple'           },
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
const collection   = COLLECTION_MAP[collectionId] || COLLECTION_MAP['artifact-1'];

// Tampilkan nama koleksi di header
document.getElementById('ar-collection-name').textContent = collection.label;

// Sembunyikan semua, tampilkan hanya yang sesuai
Object.values(COLLECTION_MAP).forEach(({ elId }) => {
  const el = document.getElementById(elId);
  if (el) el.setAttribute('visible', 'false');
});
const activeEl = document.getElementById(collection.elId);
if (activeEl) activeEl.setAttribute('visible', 'true');

// Status marker
const marker      = document.getElementById('hiro-marker');
const statusDot   = document.getElementById('status-dot');
const statusText  = document.getElementById('status-text');
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