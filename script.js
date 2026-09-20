// Interactive Script for Mom's 35th Birthday Card
// Modern liquid glass, spectacular fireworks, ambient pads & melody

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initCursorSpotlight();
  initFireworks();
  initCinematicAudio();
  initEnvelope();
  initCake();
  initCompliments();
  initPhotoTilt();
  initLightbox();
  initReasonsTiltAndShimmer();
  // New features
  initConfettiRain();
  initCakeDrag();
  initTopperEasterEgg();
  initParticleSparkles();
  // Design features
  initScrollReveal();
  initParallaxDepth();
  initHeroCounter();
  initSectionDividers();
});

/* ==========================================================
   3. SPECTACULAR REALISTIC FIREWORKS ENGINE (MOVIE GRADE PYROTECHNICS)
   ========================================================== */
let launchGrandFireworks = null;

function playFireworkSound(type = 'burst') {
  try {
    const ctx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    if (type === 'whistle') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.35);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.04, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.36);
    } else {
      // Boom/Blast sound with deep lowpass thud
      const bufferSize = ctx.sampleRate * 0.5;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.18));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(type === 'grand' ? 180 : 280, now);
      filter.frequency.exponentialRampToValueAtTime(40, now + 0.45);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(type === 'grand' ? 0.38 : 0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.48);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);
    }
  } catch (e) {
    // Audio fallback safe
  }
}

function initFireworks() {
  const canvas = document.getElementById('fireworks-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const fireworks = [];
  const sparks = [];
  const rings = [];
  let isLoopRunning = false;

  function startLoop() {
    if (!isLoopRunning) {
      isLoopRunning = true;
      requestAnimationFrame(loop);
    }
  }

  const PALETTES = [
    { name: 'Royal Gold & White', colors: ['#fde047', '#ffffff', '#fbbf24', '#fef08a'] },
    { name: 'Rose & Violet Dream', colors: ['#f472b6', '#ec4899', '#c084fc', '#ffffff'] },
    { name: 'Electric Cyan & Emerald', colors: ['#38bdf8', '#06b6d4', '#34d399', '#ffffff'] },
    { name: 'Imperial Magenta & Gold', colors: ['#e879f9', '#fde047', '#d946ef', '#f43f5e'] },
    { name: 'Rainbow Sparkle Cascade', colors: ['#f43f5e', '#38bdf8', '#fde047', '#a855f7', '#34d399', '#ffffff'] }
  ];

  class FireworkRocket {
    constructor(targetX, targetY, isGrand = false) {
      this.x = targetX + (Math.random() - 0.5) * 120;
      this.y = height + 15;
      this.targetX = targetX;
      this.targetY = targetY;
      this.isGrand = isGrand;
      this.speed = Math.random() * 3 + (isGrand ? 15 : 13);
      this.angle = Math.atan2(this.targetY - this.y, this.targetX - this.x);
      const chosenPalette = PALETTES[Math.floor(Math.random() * PALETTES.length)];
      this.palette = chosenPalette.colors;
      this.history = [];
      this.exploded = false;
      this.tailSparkInterval = 0;
      playFireworkSound('whistle');
    }

    update() {
      this.history.push({ x: this.x, y: this.y });
      if (this.history.length > 7) this.history.shift();

      const vx = Math.cos(this.angle) * this.speed;
      const vy = Math.sin(this.angle) * this.speed;

      this.x += vx;
      this.y += vy;
      this.speed *= 0.985;

      // Sparkling rocket exhaust
      this.tailSparkInterval++;
      if (this.tailSparkInterval % 2 === 0) {
        sparks.push(new TrailSpark(this.x, this.y, '#fde047'));
      }

      if (this.y <= this.targetY || this.speed < 2.2) {
        this.explode();
      }
    }

    draw() {
      ctx.globalAlpha = 1;
      ctx.strokeStyle = 'rgba(254, 240, 138, 0.9)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let i = 0; i < this.history.length; i++) {
        const pt = this.history[i];
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.lineTo(this.x, this.y);
      ctx.stroke();

      // Rocket head glow
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    explode() {
      this.exploded = true;
      playFireworkSound(this.isGrand ? 'grand' : 'burst');

      // Shockwave expansion ring
      rings.push(new ShockwaveRing(this.x, this.y, this.palette[0]));

      // Shell types: 0 = Chrysanthemum, 1 = Willow Willow (falling golden rain), 2 = Dual ring
      const shellType = Math.floor(Math.random() * 3);
      const sparkCount = this.isGrand ? 85 : (Math.floor(Math.random() * 25) + 55);

      for (let i = 0; i < sparkCount; i++) {
        if (shellType === 1) {
          // Willow / Kamuro: long burning golden weeping tails
          sparks.push(new WillowSpark(this.x, this.y, this.palette));
        } else if (shellType === 2) {
          // Double Ring Saturn
          const isOuter = i % 2 === 0;
          sparks.push(new RingSpark(this.x, this.y, this.palette, isOuter));
        } else {
          // Classic Glittering Chrysanthemum
          sparks.push(new ChrysanthemumSpark(this.x, this.y, this.palette, this.isGrand));
        }
      }

      // Flash background illumination effect
      flashScreen(this.palette[0]);
    }
  }

  function flashScreen(color) {
    const backdrop = document.querySelector('.cake-glow-backdrop');
    if (backdrop) {
      backdrop.style.opacity = '1';
      setTimeout(() => {
        backdrop.style.opacity = '0.7';
      }, 90);
    }
  }

  class TrailSpark {
    constructor(x, y, color) {
      this.x = x + (Math.random() - 0.5) * 4;
      this.y = y + (Math.random() - 0.5) * 4;
      this.vx = (Math.random() - 0.5) * 1.5;
      this.vy = Math.random() * 2 + 1;
      this.color = color;
      this.alpha = 0.85;
      this.decay = Math.random() * 0.06 + 0.04;
      this.size = Math.random() * 2 + 1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.decay;
    }
    draw() {
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  class ShockwaveRing {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.radius = 2;
      this.maxRadius = Math.random() * 35 + 60;
      this.color = color;
      this.alpha = 0.8;
      this.speed = Math.random() * 3 + 4;
    }
    update() {
      this.radius += this.speed;
      this.alpha = Math.max(0, 1 - (this.radius / this.maxRadius));
    }
    draw() {
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  class ChrysanthemumSpark {
    constructor(x, y, palette, isGrand = false) {
      this.x = x;
      this.y = y;
      const angle = Math.random() * Math.PI * 2;
      const speed = (Math.random() * (isGrand ? 8.5 : 7) + 2);
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.color = palette[Math.floor(Math.random() * palette.length)];
      this.alpha = 1;
      this.decay = Math.random() * 0.015 + 0.011;
      this.gravity = 0.085;
      this.friction = 0.965;
      this.size = Math.random() * 2.8 + 1.6;
      this.history = [];
      this.twinkle = Math.random() > 0.4;
    }

    update() {
      this.history.push({ x: this.x, y: this.y });
      if (this.history.length > 5) this.history.shift();

      this.vx *= this.friction;
      this.vy *= this.friction;
      this.vy += this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.decay;
    }

    draw() {
      let currentAlpha = this.alpha;
      if (this.twinkle) {
        currentAlpha *= (Math.sin(Date.now() * 0.03 + this.size) * 0.3 + 0.7);
      }
      ctx.globalAlpha = Math.max(0, currentAlpha);

      // Luminous spark trail
      if (this.history.length > 1) {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.size * 0.7;
        ctx.beginPath();
        for (let i = 0; i < this.history.length; i++) {
          const pt = this.history[i];
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
      }

      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  class WillowSpark {
    constructor(x, y, palette) {
      this.x = x;
      this.y = y;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4.5 + 1.5;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.color = '#fde047'; // Pure cascading gold
      this.alpha = 1;
      this.decay = Math.random() * 0.009 + 0.006; // Long burning
      this.gravity = 0.11; // Cascading downward
      this.friction = 0.98;
      this.size = Math.random() * 2 + 1.2;
      this.history = [];
    }

    update() {
      this.history.push({ x: this.x, y: this.y });
      if (this.history.length > 6) this.history.shift();

      this.vx *= this.friction;
      this.vy *= this.friction;
      this.vy += this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.decay;
    }

    draw() {
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = this.size;
      ctx.beginPath();
      for (let i = 0; i < this.history.length; i++) {
        const pt = this.history[i];
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.lineTo(this.x, this.y);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 0.7, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  class RingSpark {
    constructor(x, y, palette, isOuter) {
      this.x = x;
      this.y = y;
      const angle = Math.random() * Math.PI * 2;
      const speed = isOuter ? (Math.random() * 1.5 + 5.5) : (Math.random() * 1.5 + 3.2);
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.color = isOuter ? palette[0] : (palette[1] || '#ffffff');
      this.alpha = 1;
      this.decay = Math.random() * 0.013 + 0.01;
      this.gravity = 0.07;
      this.friction = 0.97;
      this.size = Math.random() * 2.3 + 1.4;
    }

    update() {
      this.vx *= this.friction;
      this.vy *= this.friction;
      this.vy += this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.decay;
    }

    draw() {
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);

    // Hardware-accelerated additive blending for radiant glowing fireworks
    ctx.globalCompositeOperation = 'lighter';

    // Update & draw shockwave rings
    for (let i = rings.length - 1; i >= 0; i--) {
      rings[i].update();
      if (rings[i].alpha <= 0 || rings[i].radius >= rings[i].maxRadius) {
        rings.splice(i, 1);
      } else {
        rings[i].draw();
      }
    }

    // Update & draw ascending rocket shells
    for (let i = fireworks.length - 1; i >= 0; i--) {
      fireworks[i].update();
      if (fireworks[i].exploded) {
        fireworks.splice(i, 1);
      } else {
        fireworks[i].draw();
      }
    }

    // Update & draw sparks
    for (let i = sparks.length - 1; i >= 0; i--) {
      sparks[i].update();
      if (sparks[i].alpha <= 0) {
        sparks.splice(i, 1);
      } else {
        sparks[i].draw();
      }
    }

    ctx.globalCompositeOperation = 'source-over';

    if (fireworks.length === 0 && sparks.length === 0 && rings.length === 0) {
      isLoopRunning = false;
      ctx.clearRect(0, 0, width, height);
    } else {
      requestAnimationFrame(loop);
    }
  }

  launchGrandFireworks = function(count = 6) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const targetX = Math.random() * (width * 0.74) + (width * 0.13);
        const targetY = Math.random() * (height * 0.45) + (height * 0.08);
        const isGrand = i % 3 === 0;
        fireworks.push(new FireworkRocket(targetX, targetY, isGrand));
        startLoop();
      }, i * 240);
    }
  };

  const confettiBtn = document.getElementById('confetti-trigger-btn');
  if (confettiBtn) {
    confettiBtn.addEventListener('click', () => {
      launchGrandFireworks(8);
      if (window.launchConfettiRain) window.launchConfettiRain();
    });
  }
}

/* ==========================================================
   4. CINEMATIC, WARM AMBIENT SOUNDTRACK (WEB AUDIO API)
   ========================================================== */
let audioCtx = null;
let isPlaying = false;
let chordInterval = null;
let melodyInterval = null;

function initCinematicAudio() {
  const musicBtn = document.getElementById('music-toggle-btn');
  if (!musicBtn) return;

  musicBtn.addEventListener('click', () => {
    if (!isPlaying) {
      startCinematicMusic();
      musicBtn.classList.add('active');
      musicBtn.querySelector('.btn-text').textContent = 'Музыка играет';
    } else {
      stopCinematicMusic();
      musicBtn.classList.remove('active');
      musicBtn.querySelector('.btn-text').textContent = 'Музыка';
    }
  });
}

let masterFilter = null;
let musicScrollListener = null;

function startCinematicMusic() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  isPlaying = true;

  // Master Gain & Filter
  masterFilter = audioCtx.createBiquadFilter();
  masterFilter.type = 'lowpass';
  masterFilter.frequency.setValueAtTime(1600, audioCtx.currentTime);

  const masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(0.35, audioCtx.currentTime);

  masterFilter.connect(masterGain);
  masterGain.connect(audioCtx.destination);

  // Adaptive Scroll Music Listener
  musicScrollListener = () => {
    if (!masterFilter || !audioCtx) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(1, Math.max(0, docHeight > 0 ? scrollTop / docHeight : 0));
    
    // progress: 0 (hero) -> 0.3 (letter) -> 0.6 (gallery) -> 1 (cake)
    // Map to frequencies: Hero (1600), Letter (600), Gallery (1000), Cake (2000)
    let targetFreq = 1600;
    if (progress < 0.3) {
      // 0 to 0.3: Hero to Letter
      targetFreq = 1600 - (progress / 0.3) * 1000;
    } else if (progress < 0.6) {
      // 0.3 to 0.6: Letter to Gallery
      targetFreq = 600 + ((progress - 0.3) / 0.3) * 400;
    } else {
      // 0.6 to 1: Gallery to Cake
      targetFreq = 1000 + ((progress - 0.6) / 0.4) * 1000;
    }
    masterFilter.frequency.setTargetAtTime(targetFreq, audioCtx.currentTime, 0.5);
  };
  window.addEventListener('scroll', musicScrollListener, { passive: true });

  // Emotional, Warm Chord Progression (Fmaj7 -> Gsus4 -> Em7 -> Am9)
  const chords = [
    [174.61, 220.00, 261.63, 329.63], // Fmaj7 (F3, A3, C4, E4)
    [196.00, 246.94, 293.66, 329.63], // G6/Gsus4 (G3, B3, D4, E4)
    [164.81, 196.00, 246.94, 293.66], // Em7 (E3, G3, B3, D4)
    [220.00, 261.63, 329.63, 493.88]  // Am9 (A3, C4, E4, B4)
  ];

  // Soft, touching music box top melody notes (Hz)
  const melodyNotes = [
    523.25, 659.25, 783.99, 987.77, 659.25, 587.33, 523.25, 659.25,
    783.99, 1046.50, 880.00, 659.25, 783.99, 587.33, 523.25, 659.25
  ];

  let chordIndex = 0;
  let melodyIndex = 0;

  // Function to play a lush, warm synth pad chord
  function playWarmPad(freqs) {
    if (!audioCtx || !isPlaying) return;
    freqs.forEach(freq => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle'; // gentle, warm acoustic tone
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      // Very soft envelope: 1.2s attack, 3.8s release
      const now = audioCtx.currentTime;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.045, now + 1.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 5.2);

      osc.connect(gain);
      gain.connect(masterFilter);

      osc.start(now);
      osc.stop(now + 5.3);
    });
  }

  // Function to play soft dreamy music box note
  function playDreamyBell(freq) {
    if (!audioCtx || !isPlaying) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine'; // pure sweet bell tone
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    const now = audioCtx.currentTime;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

    osc.connect(gain);
    gain.connect(masterFilter);

    osc.start(now);
    osc.stop(now + 1.9);
  }

  // Play initial chord
  playWarmPad(chords[0]);

  // Chords loop every 4.8 seconds
  chordInterval = setInterval(() => {
    if (!isPlaying) return;
    chordIndex = (chordIndex + 1) % chords.length;
    playWarmPad(chords[chordIndex]);
  }, 4800);

  // Relaxing melody loop every 600ms
  melodyInterval = setInterval(() => {
    if (!isPlaying) return;
    const note = melodyNotes[melodyIndex % melodyNotes.length];
    playDreamyBell(note);
    melodyIndex++;
  }, 600);
}

function stopCinematicMusic() {
  isPlaying = false;
  if (chordInterval) clearInterval(chordInterval);
  if (melodyInterval) clearInterval(melodyInterval);
  chordInterval = null;
  melodyInterval = null;
  if (musicScrollListener) {
    window.removeEventListener('scroll', musicScrollListener);
    musicScrollListener = null;
  }
}

/* ==========================================================
   5. INTERACTIVE ENVELOPE / LETTER
   ========================================================== */
function initEnvelope() {
  const letterPaper = document.getElementById('unfolded-letter');
  const sealArea = document.getElementById('envelope-seal-area');
  const closeBtn = document.getElementById('letter-close-btn');

  if (!sealArea || !letterPaper) return;

  sealArea.addEventListener('click', () => {
    playGentleChime(880);
    sealArea.style.display = 'none';
    letterPaper.classList.add('open');
    if (launchGrandFireworks) {
      launchGrandFireworks(5);
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      letterPaper.classList.remove('open');
      setTimeout(() => {
        sealArea.style.display = 'flex';
      }, 300);
    });
  }
}

/* ==========================================================
   6. INTERACTIVE CAKE & MAKE A WISH (Super Luxury 5-Candle System)
   ========================================================== */
function initCake() {
  const blowBtn = document.getElementById('blow-candles-btn');
  const relightBtn = document.getElementById('relight-candles-btn');
  const candleElements = document.querySelectorAll('.candle');
  const wishModal = document.getElementById('wish-modal');
  if (!blowBtn) return;

  let blownCount = 0;
  const totalCandles = candleElements.length;
  // Harmonious pentatonic chord notes for the 5 candles (C5, D5, E5, G5, A5)
  const candleHarmonics = [523.25, 587.33, 659.25, 783.99, 880.00];

  function blowOutSingleCandle(candle, index = 0) {
    const flame = candle.querySelector('.candle-flame');
    if (!flame || flame.classList.contains('blown-out')) return false;

    flame.classList.add('blown-out');
    blownCount++;
    playSoftBlowingSound();
    playGentleChime(candleHarmonics[Math.min(blownCount - 1, candleHarmonics.length - 1)]);

    if (launchGrandFireworks) {
      launchGrandFireworks(2);
    }

    if (blownCount >= totalCandles) {
      finishCakeCelebration();
    }
    return true;
  }

  function finishCakeCelebration() {
    blowBtn.style.display = 'none';
    if (relightBtn) {
      relightBtn.style.display = 'inline-flex';
    }
    const cakeVisual = document.getElementById('cake-visual');
    if (cakeVisual) {
      cakeVisual.classList.add('cake-celebrating');
    }
    if (wishModal) {
      wishModal.classList.add('active');
    }
    if (launchGrandFireworks) {
      launchGrandFireworks(14);
    }
    if (typeof launchConfettiRain === 'function') {
      launchConfettiRain();
    }
    playGrandFanfare();
  }

  function relightAllCandles() {
    blownCount = 0;
    const cakeVisual = document.getElementById('cake-visual');
    if (cakeVisual) {
      cakeVisual.classList.remove('cake-celebrating');
    }
    candleElements.forEach((candle, idx) => {
      setTimeout(() => {
        const flame = candle.querySelector('.candle-flame');
        if (flame) {
          flame.classList.remove('blown-out');
          playGentleChime(440 + idx * 95);
        }
      }, idx * 110);
    });

    setTimeout(() => {
      if (relightBtn) relightBtn.style.display = 'none';
      if (blowBtn) blowBtn.style.display = 'inline-flex';
      if (launchGrandFireworks) launchGrandFireworks(3);
    }, candleElements.length * 110 + 150);
  }

  candleElements.forEach((candle, idx) => {
    candle.addEventListener('click', () => {
      blowOutSingleCandle(candle, idx);
    });

    candle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        blowOutSingleCandle(candle, idx);
      }
    });
  });

  blowBtn.addEventListener('click', () => {
    let delay = 0;
    candleElements.forEach((candle, idx) => {
      const flame = candle.querySelector('.candle-flame');
      if (flame && !flame.classList.contains('blown-out')) {
        setTimeout(() => {
          blowOutSingleCandle(candle, idx);
        }, delay);
        delay += 90;
      }
    });
  });

  if (relightBtn) {
    relightBtn.addEventListener('click', relightAllCandles);
  }
}

function playSoftBlowingSound() {
  try {
    const ctx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const bufferSize = ctx.sampleRate * 0.45;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.28));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.25, ctx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
  } catch (e) {
    // Ignore audio fallback error
  }
}

function playGentleChime(freq = 659.25) {
  try {
    const ctx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.14, now + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 1.6);
  } catch (e) {
    // AudioContext autoplay fallback
  }
}

function playGrandFanfare() {
  const notes = [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51];
  notes.forEach((note, index) => {
    setTimeout(() => {
      playGentleChime(note);
    }, index * 130);
  });
}

/* ==========================================================
   7. COMPLIMENT GENERATOR
   ========================================================== */
const compliments = [
  "«Мама, марафон и 100 баллов твоих учеников - это реально мощно. Ты пример для меня.»",
  "«Тебе 35 лет, и ты отлично выглядишь, всегда на спорте и полна сил.»",
  "«Спасибо за поддержку и за то, что ты всегда веришь в меня.»",
  "«С тобой всегда можно спокойно поговорить обо всем и от души посмеяться.»",
  "«Горжусь, что у меня такая мама: сильная, умная и добрая.»",
  "«Ты круто преподаешь английский и вкладываешь душу в свое дело.»",
  "«Желаю тебе побольше свободных дней и чтобы все задуманное получалось.»",
  "«Очень тебя ценю и люблю. С днем рождения, Мама!»"
];

function initCompliments() {
  const btn = document.getElementById('new-compliment-btn');
  const box = document.getElementById('compliment-text');
  if (!btn || !box) return;

  let lastIdx = -1;

  btn.addEventListener('click', () => {
    let randIdx;
    do {
      randIdx = Math.floor(Math.random() * compliments.length);
    } while (randIdx === lastIdx && compliments.length > 1);

    lastIdx = randIdx;

    box.style.opacity = '0';
    box.style.transform = 'translateY(10px)';

    setTimeout(() => {
      box.textContent = compliments[randIdx];
      box.style.transition = 'all 0.4s ease';
      box.style.opacity = '1';
      box.style.transform = 'translateY(0)';
      if (launchGrandFireworks) {
        launchGrandFireworks(2);
      }
    }, 200);
  });
}

/* ==========================================================
   8. PHOTO TILT & HOVER INTERACTION
   ========================================================== */
function initPhotoTilt() {
  const cards = document.querySelectorAll('.photo-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const tiltX = (y / rect.height) * -6;
      const tiltY = (x / rect.width) * 6;
      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
}

/* ==========================================================
   9. PHOTO LIGHTBOX MODAL
   ========================================================== */
function initLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  const modalCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close-btn');
  const backdrop = document.getElementById('lightbox-backdrop');
  const triggers = document.querySelectorAll('.js-lightbox-trigger');

  if (!modal || !modalImg) return;

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const img = trigger.getAttribute('data-img');
      const title = trigger.getAttribute('data-title') || '';
      modalImg.src = img;
      modalCaption.textContent = title;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    });
  });

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    setTimeout(() => {
      modalImg.src = '';
    }, 300);
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* ==========================================================
   10. SCROLL PROGRESS INDICATOR & CURSOR SPOTLIGHT
   ========================================================== */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  const updateProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${progress}%`;
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

function initCursorSpotlight() {
  const spotlight = document.getElementById('cursor-spotlight');
  if (!spotlight) return;

  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let ticking = false;
    window.addEventListener('mousemove', (e) => {
      if (!ticking) {
        ticking = true;
        const x = e.clientX - 240;
        const y = e.clientY - 240;
        requestAnimationFrame(() => {
          spotlight.style.transform = `translate3d(${x}px, ${y}px, 0)`;
          ticking = false;
        });
      }
    }, { passive: true });
  } else {
    spotlight.style.display = 'none';
  }
}

/* ==========================================================
   11. PHOTO CARD LIKES (Floating Hearts & Audio Feedback)
   ========================================================== */
function initPhotoLikes() {
  const likeBtns = document.querySelectorAll('.photo-like-btn');
  likeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevents triggering the photo lightbox modal
      
      const countEl = btn.querySelector('.like-count');
      let currentCount = parseInt(countEl.textContent, 10) || 35;
      currentCount++;
      countEl.textContent = currentCount;
      btn.classList.add('liked');

      // Harmonic high sparkle chime
      playGentleChime(784 + Math.random() * 260);

      // Spawn 5 fluttering floating hearts with physics
      const rect = btn.getBoundingClientRect();
      const heartSymbols = ['❤️', '💖', '✨', '💕', '🥰', '🌸'];
      for (let i = 0; i < 5; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
        heart.style.left = `${rect.left + rect.width / 2 + (Math.random() - 0.5) * 36}px`;
        heart.style.top = `${rect.top + (Math.random() - 0.5) * 16}px`;
        heart.style.setProperty('--rx', `${(Math.random() - 0.5) * 70}px`);
        heart.style.setProperty('--rot', `${(Math.random() - 0.5) * 60}deg`);
        document.body.appendChild(heart);

        setTimeout(() => {
          heart.remove();
        }, 1250);
      }

      if (launchGrandFireworks) {
        launchGrandFireworks(1);
      }
    });
  });
}

/* ==========================================================
   12. 12 REASONS CARDS (Dynamic Liquid Glass Shimmer)
   ========================================================== */
function initReasonsTiltAndShimmer() {
  const reasonCards = document.querySelectorAll('.reason-card');
  reasonCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* ==========================================================
   13. CONFETTI RAIN SYSTEM
   ========================================================== */
window.launchConfettiRain = null;

function initConfettiRain() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const confetti = [];
  const colors = ['#ec4899', '#a855f7', '#fde047', '#38bdf8', '#f472b6', '#ffffff'];
  
  let animating = false;
  
  window.launchConfettiRain = function() {
    if (animating) return; // prevent overlap
    animating = true;
    
    // Create 110 high-impact fluttering pieces
    for(let i = 0; i < 110; i++) {
      confetti.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.4 - height * 0.4,
        w: Math.random() * 8 + 4,
        h: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 2.8 + 1.8,
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 8,
        type: Math.random() > 0.45 ? 'rect' : 'circle',
        life: 1.0 // opacity
      });
    }
    
    let startTime = Date.now();
    
    function render() {
      const elapsed = Date.now() - startTime;
      ctx.clearRect(0, 0, width, height);
      
      let allDead = true;
      
      for(let i = 0; i < confetti.length; i++) {
        let p = confetti[i];
        if (p.life <= 0) continue;
        allDead = false;
        
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.rotSpeed;
        
        // gravity & drag
        p.vy += 0.045;
        p.vx *= 0.99;
        
        // drift
        p.x += Math.sin(elapsed * 0.001 + i) * 0.4;
        
        // fade out after 3.5s
        if (elapsed > 3500) {
          p.life -= 0.025;
        }
        
        if (p.type === 'rect') {
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.life);
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot * Math.PI / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
          ctx.restore();
        } else {
          ctx.globalAlpha = Math.max(0, p.life);
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.w/2, 0, Math.PI*2);
          ctx.fill();
        }
      }
      
      if (!allDead) {
        requestAnimationFrame(render);
      } else {
        confetti.length = 0;
        animating = false;
        ctx.clearRect(0, 0, width, height);
      }
    }
    render();
  };
}

/* ==========================================================
   14. INTERACTIVE 3D CAKE DRAG ROTATION
   ========================================================== */
function initCakeDrag() {
  const cakeVisual = document.querySelector('.cake-visual');
  const topper = document.querySelector('.cake-topper-sparkler');
  if (!cakeVisual) return;

  let isDragging = false;
  let dragTicking = false;
  let startX = 0;
  let startY = 0;

  function onStart(x, y) {
    isDragging = true;
    startX = x;
    startY = y;
    cakeVisual.classList.add('dragging');
  }

  function onMove(x, y) {
    if (!isDragging || dragTicking) return;
    dragTicking = true;
    requestAnimationFrame(() => {
      if (!isDragging) {
        dragTicking = false;
        return;
      }
      const dx = x - startX;
      const dy = y - startY;
      
      // Sensitivity
      let newRotY = dx * 0.2; 
      let newRotX = -dy * 0.2;
      
      // Smooth limit to +/- 20 deg
      newRotY = Math.max(-20, Math.min(20, newRotY));
      newRotX = Math.max(-18, Math.min(18, newRotX));
      
      cakeVisual.style.transform = `rotateX(${10 + newRotX}deg) rotateY(${newRotY}deg) scale(1.02)`;
      
      if (topper) {
        topper.style.transform = `translateX(-50%) translateZ(30px) rotateY(${-newRotY * 0.7}deg) rotateX(${-newRotX * 0.7}deg) translateY(-8px)`;
      }
      dragTicking = false;
    });
  }

  function onEnd() {
    if (!isDragging) return;
    isDragging = false;
    cakeVisual.classList.remove('dragging');
    
    // Elastic spring back to default 3D view
    cakeVisual.style.transition = 'transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)';
    cakeVisual.style.transform = 'rotateX(10deg) rotateY(0deg) scale(1)';
    
    if (topper) {
      topper.style.transition = 'transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)';
      topper.style.transform = 'translateX(-50%) translateZ(30px) translateY(0)';
      setTimeout(() => {
        if (topper) topper.style.transition = '';
      }, 700);
    }
    
    setTimeout(() => {
      if (!isDragging && cakeVisual) {
        cakeVisual.style.transition = '';
      }
    }, 700);
  }

  cakeVisual.addEventListener('mousedown', (e) => onStart(e.clientX, e.clientY));
  window.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
  window.addEventListener('mouseup', onEnd);
  
  // Touch
  cakeVisual.addEventListener('touchstart', (e) => {
    if(e.touches.length > 0) onStart(e.touches[0].clientX, e.touches[0].clientY);
  }, {passive: true});
  window.addEventListener('touchmove', (e) => {
    if(e.touches.length > 0) onMove(e.touches[0].clientX, e.touches[0].clientY);
  }, {passive: true});
  window.addEventListener('touchend', onEnd);
}

/* ==========================================================
   15. SECRET TOPPER EASTER EGG
   ========================================================== */
function initTopperEasterEgg() {
  const topper = document.querySelector('.cake-topper-sparkler');
  const overlay = document.getElementById('easter-egg-overlay');
  const typewriter = document.getElementById('ee-typewriter');
  const subtitle = document.getElementById('ee-subtitle');
  if (!topper || !overlay || !typewriter || !subtitle) return;
  
  let triggered = false;

  topper.addEventListener('click', (e) => {
    // Only trigger once
    if (triggered) return;
    triggered = true;
    
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    
    if (launchGrandFireworks) launchGrandFireworks(14);
    if (window.launchConfettiRain) window.launchConfettiRain();
    
    const text = "С Днём Рождения, Мама!";
    let i = 0;
    typewriter.textContent = '';
    
    const typeInterval = setInterval(() => {
      if (i < text.length) {
        typewriter.textContent += text.charAt(i);
        i++;
        playGentleChime(600 + i * 20); // little type sound
      } else {
        clearInterval(typeInterval);
        subtitle.classList.add('show');
        
        // Close after 8 seconds
        setTimeout(closeEasterEgg, 8000);
      }
    }, 100);
  });
  
  function closeEasterEgg() {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
  }
  
  overlay.addEventListener('click', closeEasterEgg);
}

/* ==========================================================
   16. PARTICLE SPARKLE SYSTEM ON HOVER
   ========================================================== */
function initParticleSparkles() {
  const MAX_PARTICLES = 30;
  let activeParticles = 0;
  let lastSpawn = 0;

  function spawnParticle(x, y, color = '#fde047', shape = 'circle') {
    if (activeParticles >= MAX_PARTICLES) return;
    
    const particle = document.createElement('div');
    particle.className = 'particle-sparkle';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    
    const size = Math.random() * 4 + 2;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.backgroundColor = color;
    
    if (shape === 'heart') {
      particle.textContent = '❤';
      particle.style.background = 'transparent';
      particle.style.color = color;
      particle.style.fontSize = (size + 4) + 'px';
      particle.style.width = 'auto';
      particle.style.height = 'auto';
    }
    
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 35 + 10;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;
    
    particle.style.setProperty('--tx', tx + 'px');
    particle.style.setProperty('--ty', ty + 'px');
    
    const duration = Math.random() * 0.6 + 0.4;
    particle.style.animationDuration = duration + 's';
    
    document.body.appendChild(particle);
    activeParticles++;
    
    setTimeout(() => {
      if (particle.parentNode) particle.parentNode.removeChild(particle);
      activeParticles--;
    }, duration * 1000);
  }

  // Hook up hovers with lightweight cooldown
  document.querySelectorAll('.cake-berry').forEach(el => {
    el.addEventListener('mouseenter', () => {
      const now = Date.now();
      if (now - lastSpawn < 80) return;
      lastSpawn = now;
      const rect = el.getBoundingClientRect();
      for(let i = 0; i < 2; i++) {
        spawnParticle(rect.left + rect.width/2, rect.top + rect.height/2, '#fde047');
      }
    });
  });
  
  document.querySelectorAll('.reason-card').forEach(el => {
    el.addEventListener('mouseenter', (e) => {
      const now = Date.now();
      if (now - lastSpawn < 80) return;
      lastSpawn = now;
      const colors = ['#ec4899', '#38bdf8', '#a855f7', '#fde047'];
      for(let i = 0; i < 3; i++) {
        spawnParticle(e.clientX, e.clientY, colors[Math.floor(Math.random() * colors.length)]);
      }
    });
  });
  
  document.querySelectorAll('.hero-avatar-wrap').forEach(el => {
    el.addEventListener('mouseenter', () => {
      const now = Date.now();
      if (now - lastSpawn < 80) return;
      lastSpawn = now;
      const rect = el.getBoundingClientRect();
      for(let i = 0; i < 3; i++) {
        spawnParticle(rect.left + rect.width/2, rect.top + rect.height/2, '#f472b6', 'heart');
      }
    });
  });
}

/* ==========================================================
   17. SCROLL-REVEAL ANIMATIONS (IntersectionObserver)
   ========================================================== */
function initScrollReveal() {
  // Add reveal classes to sections and key elements
  const revealTargets = [
    { selector: '.letter-section', cls: '' },
    { selector: '.gallery-section', cls: '' },
    { selector: '.reasons-section', cls: '' },
    { selector: '.cake-section', cls: '' },
    { selector: '.compliment-generator', cls: 'reveal-scale' },
    { selector: '.envelope-card', cls: '' }
  ];

  revealTargets.forEach(({ selector, cls }) => {
    const el = document.querySelector(selector);
    if (el) {
      el.classList.add('reveal-on-scroll');
      if (cls) el.classList.add(cls);
    }
  });

  // Add staggered reveal to reason cards
  document.querySelectorAll('.reason-card').forEach((card, i) => {
    card.classList.add('reveal-on-scroll');
    card.style.transitionDelay = `${i * 0.07}s`;
  });

  // Add staggered reveal to photo cards
  document.querySelectorAll('.photo-card').forEach((card, i) => {
    card.classList.add('reveal-on-scroll');
    card.style.transitionDelay = `${i * 0.15}s`;
  });

  // IntersectionObserver
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Don't unobserve — let it stay revealed
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  document.querySelectorAll('.reveal-on-scroll').forEach(el => {
    observer.observe(el);
  });
}

/* ==========================================================
   18. PARALLAX DEPTH (Aurora orbs float smoothly via CSS GPU keyframes)
   ========================================================== */
function initParallaxDepth() {
  // Pure GPU compositor keyframe animations handled in CSS for zero main-thread lag
}

/* ==========================================================
   19. ANIMATED HERO COUNTER (0 → 35 count-up)
   ========================================================== */
function initHeroCounter() {
  const heroNumber = document.querySelector('.hero-number');
  const heroGlow = document.querySelector('.hero-number-glow');
  if (!heroNumber) return;

  const target = 35;
  const duration = 2200; // ms
  let started = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        animateCount(heroNumber, heroGlow, target, duration);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(heroNumber);
}

function animateCount(el, glowEl, target, duration) {
  const startTime = performance.now();
  const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

  function tick(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutCubic(progress);
    const current = Math.round(easedProgress * target);

    el.textContent = current;
    if (glowEl) glowEl.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      // Final burst effect
      el.style.transform = 'scale(1.08)';
      setTimeout(() => {
        el.style.transform = '';
      }, 300);
    }
  }
  requestAnimationFrame(tick);
}


/* ==========================================================
   21. DECORATIVE SECTION DIVIDERS (Floating dot separators)
   ========================================================== */
function initSectionDividers() {
  const sections = document.querySelectorAll('.page-container > section');

  sections.forEach((section, i) => {
    if (i === sections.length - 1) return; // Skip last

    const divider = document.createElement('div');
    divider.className = 'section-divider';
    divider.setAttribute('aria-hidden', 'true');

    // 3 floating dots
    for (let d = 0; d < 3; d++) {
      const dot = document.createElement('span');
      dot.className = 'divider-dot';
      dot.style.animationDelay = `${d * 0.3}s`;
      divider.appendChild(dot);
    }

    section.after(divider);
  });
}
