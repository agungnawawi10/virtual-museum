const infoPanel = document.getElementById('info-panel');
const infoTitle = document.getElementById('info-title');
const infoDesc = document.getElementById('info-desc');
const infoClose = document.getElementById('info-close');
const tooltip = document.getElementById('tooltip');

const scene = document.querySelector('a-scene');

scene.addEventListener('click', (e) => {
	const target = e.target.closest('.interactable');
	if (!target) return;

	const title = target.dataset.title || 'Tanpa Judul';
	console.log('Interactable clicked:', { title: title, id: target.id, dataset: target.dataset });
	const desc = target.dataset.desc || 'Tidak ada deskripsi.';

	infoTitle.textContent = title;
	infoDesc.textContent = desc;
	infoPanel.classList.add('visible');
});

infoClose.addEventListener('click', () => {
	infoPanel.classList.remove('visible');
});

scene.addEventListener('mouseenter', (e) => {
	if (e.target.classList.contains('interactable')) {
		tooltip.classList.add('show');
	}
}, true);

scene.addEventListener('mouseleave', (e) => {
	if (e.target.classList.contains('interactable')) {
		tooltip.classList.remove('show');
	}
}, true);

// --- Prevent rig from passing through room bounds ---
const rig = document.getElementById('rig');
// Room bounds (tweak as needed): left/right, floor/ceiling, front/back
const bounds = {
	xMin: -7.9,
	xMax: 7.9,
	yMin: 0.0,
	yMax: 3.9,
	zMin: -9.5,
	zMax: 9.5
};
const padding = 0.25; // small gap so the rig doesn't clip into walls

function clampRigPosition() {
	if (!rig) return;
	const pos = rig.getAttribute('position');
	let x = parseFloat(pos.x);
	let y = parseFloat(pos.y);
	let z = parseFloat(pos.z);

	const clampedX = Math.max(bounds.xMin + padding, Math.min(bounds.xMax - padding, x));
	const clampedY = Math.max(bounds.yMin, Math.min(bounds.yMax, y));
	const clampedZ = Math.max(bounds.zMin + padding, Math.min(bounds.zMax - padding, z));

	// Only write back if changed to avoid jitter
	if (clampedX !== x || clampedY !== y || clampedZ !== z) {
		rig.setAttribute('position', { x: clampedX, y: clampedY, z: clampedZ });
	}
}

// Run clamp every frame-ish; using setInterval is simple and reliable across controls
const clampInterval = setInterval(clampRigPosition, 40);

// --- Custom WASD movement (no inertia) ---
const cameraEl = document.querySelector('a-camera');
const moveState = { forward: 0, backward: 0, left: 0, right: 0 };
let lastTime = null;
const moveSpeed = 2.0; // meters per second
let audioContext = null;
let footstepTimer = 0;
let footstepReady = false;

function initAudio() {
	if (footstepReady) return;
	const AudioContextClass = window.AudioContext || window.webkitAudioContext;
	if (!AudioContextClass) return;
	audioContext = audioContext || new AudioContextClass();
	if (audioContext.state === 'suspended') {
		audioContext.resume().catch(() => {});
	}
	footstepReady = true;
}

function playFootstep() {
	if (!audioContext) return;
	const now = audioContext.currentTime;
	const duration = 0.12;

	const output = audioContext.createGain();
	output.gain.setValueAtTime(0.0001, now);
	output.gain.exponentialRampToValueAtTime(0.08, now + 0.01);
	output.gain.exponentialRampToValueAtTime(0.0001, now + duration);
	output.connect(audioContext.destination);

	const thump = audioContext.createOscillator();
	thump.type = 'sine';
	thump.frequency.setValueAtTime(120, now);
	thump.frequency.exponentialRampToValueAtTime(70, now + duration);

	const thumpGain = audioContext.createGain();
	thumpGain.gain.setValueAtTime(0.0001, now);
	thumpGain.gain.exponentialRampToValueAtTime(0.5, now + 0.005);
	thumpGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

	const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * duration, audioContext.sampleRate);
	const data = noiseBuffer.getChannelData(0);
	for (let i = 0; i < data.length; i++) {
		data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
	}
	const noise = audioContext.createBufferSource();
	noise.buffer = noiseBuffer;

	const noiseFilter = audioContext.createBiquadFilter();
	noiseFilter.type = 'lowpass';
	noiseFilter.frequency.setValueAtTime(900, now);

	const noiseGain = audioContext.createGain();
	noiseGain.gain.setValueAtTime(0.0001, now);
	noiseGain.gain.exponentialRampToValueAtTime(0.15, now + 0.01);
	noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

	thump.connect(thumpGain);
	thumpGain.connect(output);
	noise.connect(noiseFilter);
	noiseFilter.connect(noiseGain);
	noiseGain.connect(output);

	thump.start(now);
	thump.stop(now + duration);
	noise.start(now);
	noise.stop(now + duration);

	setTimeout(() => {
		thump.disconnect();
		thumpGain.disconnect();
		noise.disconnect();
		noiseFilter.disconnect();
		noiseGain.disconnect();
		output.disconnect();
	}, 250);
}

function onKeyDown(e) {
	initAudio();
	switch (e.code) {
		case 'KeyW': moveState.forward = 1; break;
		case 'KeyS': moveState.backward = 1; break;
		case 'KeyA': moveState.left = 1; break;
		case 'KeyD': moveState.right = 1; break;
	}
}

function onKeyUp(e) {
	switch (e.code) {
		case 'KeyW': moveState.forward = 0; break;
		case 'KeyS': moveState.backward = 0; break;
		case 'KeyA': moveState.left = 0; break;
		case 'KeyD': moveState.right = 0; break;
	}
}

function updateMovement(timestamp) {
	if (!lastTime) lastTime = timestamp;
	const delta = (timestamp - lastTime) / 1000; // seconds
	lastTime = timestamp;

	if (rig && cameraEl) {
		const moveX = (moveState.right - moveState.left);
		const moveZ = (moveState.forward - moveState.backward);
		const isMoving = moveX !== 0 || moveZ !== 0;

		if (isMoving) {
			// compute forward and right vectors based on camera orientation
			const forward = new AFRAME.THREE.Vector3();
			cameraEl.object3D.getWorldDirection(forward);
			forward.y = 0;
			forward.normalize();

			const up = new AFRAME.THREE.Vector3(0, 1, 0);
			const right = new AFRAME.THREE.Vector3();
			right.crossVectors(forward, up).normalize();

			const moveVec = new AFRAME.THREE.Vector3();
			moveVec.addScaledVector(forward, moveZ);
			moveVec.addScaledVector(right, moveX);

			if (moveVec.lengthSq() > 0) {
				moveVec.normalize();
				const displacement = moveVec.multiplyScalar(moveSpeed * delta);
				const pos = rig.getAttribute('position');
				const newPos = {
					x: parseFloat(pos.x) + displacement.x,
					y: parseFloat(pos.y) + displacement.y,
					z: parseFloat(pos.z) + displacement.z
				};
				rig.setAttribute('position', newPos);
				clampRigPosition();
			}

			footstepTimer += delta;
			if (footstepReady && footstepTimer >= 0.42) {
				playFootstep();
				footstepTimer = 0;
			}
		} else {
			footstepTimer = 0;
		}
	}

	requestAnimationFrame(updateMovement);
}

window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);
requestAnimationFrame(updateMovement);
