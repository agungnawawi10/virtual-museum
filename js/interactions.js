const infoPanel = document.getElementById('info-panel');
const infoTitle = document.getElementById('info-title');
const infoYear  = document.getElementById('info-year');
const infoDesc  = document.getElementById('info-desc');
const infoClose = document.getElementById('info-close');
const tooltip   = document.getElementById('tooltip');
const scene     = document.querySelector('a-scene');
const dpadButtons = Array.from(document.querySelectorAll('.dpad-btn'));
const arButton  = document.getElementById('btn-ar');

let currentId = null;

function updateArButtonTarget(id) {
  if (!arButton) return;
  if (!id) {
    arButton.removeAttribute('data-target-id');
    return;
  }
  arButton.setAttribute('data-target-id', id);
}

// ── Klik objek → info panel ──
scene.addEventListener('click', (e) => {
  const target = e.target.closest('[data-id]');
  if (!target) return;

  currentId = target.dataset.id || null;
  infoTitle.textContent = target.dataset.title || 'Tanpa Judul';
  infoYear.textContent  = target.dataset.year  || '—';
  infoDesc.textContent  = target.dataset.desc  || 'Tidak ada deskripsi.';
  updateArButtonTarget(currentId);
  infoPanel.classList.add('visible');
});

// ── Tutup panel ──
infoClose.addEventListener('click', () => {
  infoPanel.classList.remove('visible');
  currentId = null;
});

// ── Buka AR Viewer ──
function openAR() {
  const targetId = (arButton && arButton.dataset.targetId) || currentId;
  if (!targetId) return;
  const targetUrl = `ar-viewer.html?id=${encodeURIComponent(targetId)}`;
  try {
    sessionStorage.setItem('virtualMuseumSelectedId', targetId);
  } catch (error) {
    // ignore storage failures and fall back to the query string
  }
  window.name = `virtualMuseumSelectedId=${targetId}`;
  window.location.assign(targetUrl);
}

if (arButton) {
  arButton.addEventListener('click', (event) => {
    event.preventDefault();
    openAR();
  });
}

// ── Tooltip hover ──
scene.addEventListener('mouseenter', (e) => {
  if (e.target.classList.contains('interactable')) tooltip.classList.add('show');
}, true);
scene.addEventListener('mouseleave', (e) => {
  if (e.target.classList.contains('interactable')) tooltip.classList.remove('show');
}, true);

// ── Batas ruangan ──
const rig = document.getElementById('rig');
const bounds = { xMin: -7.9, xMax: 7.9, yMin: 0.0, yMax: 3.9, zMin: -9.5, zMax: 9.5 };
const padding = 0.25;

function clampRigPosition() {
  if (!rig) return;
  const pos = rig.getAttribute('position');
  let x = parseFloat(pos.x), y = parseFloat(pos.y), z = parseFloat(pos.z);
  const cx = Math.max(bounds.xMin + padding, Math.min(bounds.xMax - padding, x));
  const cy = Math.max(bounds.yMin, Math.min(bounds.yMax, y));
  const cz = Math.max(bounds.zMin + padding, Math.min(bounds.zMax - padding, z));
  if (cx !== x || cy !== y || cz !== z) rig.setAttribute('position', { x: cx, y: cy, z: cz });
}
setInterval(clampRigPosition, 40);

// ── Custom WASD ──
const cameraEl   = document.querySelector('a-camera');
const moveState  = { forward: 0, backward: 0, left: 0, right: 0 };
let lastTime     = null;
const moveSpeed  = 2.0;

function setDirectionState(direction, value) {
  if (direction === 'forward') moveState.forward = value;
  if (direction === 'backward') moveState.backward = value;
  if (direction === 'left') moveState.left = value;
  if (direction === 'right') moveState.right = value;
}

for (const button of dpadButtons) {
  const direction = button.dataset.dir;
  const press = (e) => {
    e.preventDefault();
    setDirectionState(direction, 1);
    button.classList.add('active');
  };
  const release = (e) => {
    e.preventDefault();
    setDirectionState(direction, 0);
    button.classList.remove('active');
  };

  button.addEventListener('pointerdown', press, { passive: false });
  button.addEventListener('pointerup', release, { passive: false });
  button.addEventListener('pointercancel', release, { passive: false });
  button.addEventListener('pointerleave', release, { passive: false });
}

// ── Audio langkah kaki (Web Audio API — tidak butuh file MP3) ──
let audioContext   = null;
let footstepTimer  = 0;
let footstepReady  = false;

function initAudio() {
  if (footstepReady) return;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  audioContext = audioContext || new AC();
  if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
  footstepReady = true;
}

function playFootstep() {
  if (!audioContext) return;
  const now = audioContext.currentTime;
  const dur = 0.12;
  const out = audioContext.createGain();
  out.gain.setValueAtTime(0.0001, now);
  out.gain.exponentialRampToValueAtTime(0.08, now + 0.01);
  out.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  out.connect(audioContext.destination);

  const thump = audioContext.createOscillator();
  thump.type = 'sine';
  thump.frequency.setValueAtTime(120, now);
  thump.frequency.exponentialRampToValueAtTime(70, now + dur);
  const tg = audioContext.createGain();
  tg.gain.setValueAtTime(0.0001, now);
  tg.gain.exponentialRampToValueAtTime(0.5, now + 0.005);
  tg.gain.exponentialRampToValueAtTime(0.0001, now + dur);

  const nbuf = audioContext.createBuffer(1, audioContext.sampleRate * dur, audioContext.sampleRate);
  const data = nbuf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  const noise = audioContext.createBufferSource();
  noise.buffer = nbuf;
  const nf = audioContext.createBiquadFilter();
  nf.type = 'lowpass'; nf.frequency.setValueAtTime(900, now);
  const ng = audioContext.createGain();
  ng.gain.setValueAtTime(0.0001, now);
  ng.gain.exponentialRampToValueAtTime(0.15, now + 0.01);
  ng.gain.exponentialRampToValueAtTime(0.0001, now + dur);

  thump.connect(tg); tg.connect(out);
  noise.connect(nf); nf.connect(ng); ng.connect(out);
  thump.start(now); thump.stop(now + dur);
  noise.start(now); noise.stop(now + dur);
  setTimeout(() => { try { thump.disconnect(); tg.disconnect(); noise.disconnect(); nf.disconnect(); ng.disconnect(); out.disconnect(); } catch(e){} }, 300);
}

function onKeyDown(e) {
  initAudio();
  switch (e.code) {
    case 'KeyW': moveState.forward   = 1; break;
    case 'KeyS': moveState.backward  = 1; break;
    case 'KeyA': moveState.left      = 1; break;
    case 'KeyD': moveState.right     = 1; break;
  }
}
function onKeyUp(e) {
  switch (e.code) {
    case 'KeyW': moveState.forward   = 0; break;
    case 'KeyS': moveState.backward  = 0; break;
    case 'KeyA': moveState.left      = 0; break;
    case 'KeyD': moveState.right     = 0; break;
  }
}

function updateMovement(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const delta = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  if (rig && cameraEl) {
    const mx = moveState.left - moveState.right;
    const mz = moveState.backward - moveState.forward;
    const isMoving = mx !== 0 || mz !== 0;

    if (isMoving) {
      const forward = new AFRAME.THREE.Vector3();
      cameraEl.object3D.getWorldDirection(forward);
      forward.y = 0; forward.normalize();
      const right = new AFRAME.THREE.Vector3();
      right.crossVectors(forward, new AFRAME.THREE.Vector3(0, 1, 0)).normalize();
      const moveVec = new AFRAME.THREE.Vector3();
      moveVec.addScaledVector(forward, mz);
      moveVec.addScaledVector(right, mx);
      if (moveVec.lengthSq() > 0) {
        moveVec.normalize().multiplyScalar(moveSpeed * delta);
        const pos = rig.getAttribute('position');
        rig.setAttribute('position', {
          x: parseFloat(pos.x) + moveVec.x,
          y: parseFloat(pos.y) + moveVec.y,
          z: parseFloat(pos.z) + moveVec.z
        });
        clampRigPosition();
      }
      footstepTimer += delta;
      if (footstepReady && footstepTimer >= 0.42) { playFootstep(); footstepTimer = 0; }
    } else {
      footstepTimer = 0;
    }
  }
  requestAnimationFrame(updateMovement);
}

window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);
requestAnimationFrame(updateMovement);