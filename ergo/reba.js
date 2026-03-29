// ─── REBA Lookup Tables ───────────────────────────────────────────
const TABLE_A = [
  // [neck=1][neck=2]  x  legs 1..3
  // trunk 1
  [[1,2,3],[1,2,3]],
  // trunk 2
  [[2,3,4],[3,4,5]],
  // trunk 3
  [[3,4,5],[4,5,6]],
  // trunk 4
  [[4,5,6],[4,6,7]],
  // trunk 5
  [[5,6,7],[5,7,8]],
];
// TABLE_A[trunk-1][neck-1][leg-1]

const TABLE_B = [
  // [lower_arm=1][lower_arm=2]  x  wrist 1..3
  // upper_arm 1
  [[1,2,2],[1,2,3]],
  // upper_arm 2
  [[1,2,3],[2,3,4]],
  // upper_arm 3
  [[3,4,5],[4,5,5]],
  // upper_arm 4
  [[4,5,5],[5,6,7]],
  // upper_arm 5
  [[5,6,7],[7,8,8]],
  // upper_arm 6
  [[7,8,8],[8,9,9]],
];
// TABLE_B[upper_arm-1][lower_arm-1][wrist-1]

const TABLE_C = [
  //scoreB: 1  2  3  4  5  6  7  8  9  10  11  12
  [1,  1,  1,  2,  3,  3,  4,  5,  6,  7,  7,  7], // scoreA=1
  [1,  2,  2,  3,  4,  4,  5,  6,  6,  7,  7,  8], // scoreA=2
  [2,  3,  3,  3,  4,  5,  6,  7,  7,  8,  8,  8], // scoreA=3
  [3,  4,  4,  4,  5,  6,  7,  8,  8,  9,  9,  9], // scoreA=4
  [4,  4,  4,  5,  6,  7,  8,  8,  9,  9, 10, 10], // scoreA=5
  [6,  6,  6,  7,  8,  8,  9,  9, 10, 10, 11, 11], // scoreA=6
  [7,  7,  7,  8,  9,  9,  9, 10, 11, 11, 11, 12], // scoreA=7
  [8,  8,  8,  9, 10, 10, 10, 11, 11, 12, 12, 12], // scoreA=8
  [9,  9,  9,  9, 10, 10, 11, 11, 12, 12, 12, 12], // scoreA=9
  [10,10, 10, 10, 11, 11, 11, 12, 12, 12, 12, 12], // scoreA=10
  [11,11, 11, 11, 11, 12, 12, 12, 12, 12, 12, 12], // scoreA=11
  [12,12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12], // scoreA=12
];

// ─── Steps Config ─────────────────────────────────────────────────
const steps = [
  {
    id: 'trunk', label: 'Gövde', title: 'Gövde (Trunk) Açısı', img: 'R1.png',
    desc: 'Gövdenin fleksiyon/ekstansiyon açısını girin.',
    unit: '°', min: 0, max: 120, type: 'number',
    extras: [
      { label: 'Yana doğru dönme ya da eğilme (Twist/Side-flexion)', key: 'trunkTwist', points: 1 }
    ]
  },
  {
    id: 'neck', label: 'Boyun', title: 'Boyun (Neck) Açısı', img: 'R2.png',
    desc: 'Başın fleksiyon/ekstansiyon açısını girin.',
    unit: '°', min: 0, max: 60, type: 'number',
    extras: [
      { label: 'Yana doğru dönme ya da eğilme (Twist/Side-flexion)', key: 'neckTwist', points: 1 }
    ]
  },
  {
    id: 'legs', label: 'Bacaklar', title: 'Bacak & Diz Pozisyonu', img: 'R3.png',
    desc: 'Ağırlık dağılımını ve diz pozisyonunu seçin.',
    unit: '', min: 0, max: 0, type: 'select',
    options: [
      { value: 1, label: 'Ağırlığın iki bacak üzerinde olması, yürüme ya da oturma' },
      { value: 2, label: 'Ağırlığın tek bacak üzerinde olması, dengesiz halde' },
    ],
    extras: [
      { label: 'Dizde 30°-60° fleksiyon varsa', key: 'kneeFlexionSmall', points: 1 },
      { label: 'Dizde >60° fleksiyon varsa (ayakta durma durumunda)', key: 'kneeFlexionLarge', points: 2 },
    ]
  },
  {
    id: 'upper_arm', label: 'Omuz', title: 'Üst Kol (Omuz) Açısı', img: 'R4.png',
    desc: 'Üst kolun gövdeyle yaptığı açıyı girin. Kol yanınızda: 0°.',
    unit: '°', min: 0, max: 150, type: 'number',
    extras: [
      { label: 'Kol öne / dışa kalkık mı? (abdüksiyon)', key: 'armAbducted', points: 1 },
      { label: 'Omuz yükseltilmiş mi?', key: 'shoulderRaised', points: 1 },
      { label: 'Kollar destekli / yerçekimi yardımlı mı?', key: 'armSupported', points: -1 },
    ]
  },
  {
    id: 'lower_arm', label: 'Dirsek', title: 'Alt Kol (Dirsek) Açısı', img: 'R5.png',
    desc: 'Dirsek fleksiyon açısını girin. Tam açık: 0°, tam kıvrık: 150°.',
    unit: '°', min: 0, max: 150, type: 'number'
  },
  {
    id: 'wrist', label: 'Bilek', title: 'Bilek Açısı', img: 'R6.png',
    desc: 'Bileğin fleksiyon/ekstansiyon açısını girin.',
    unit: '°', min: 0, max: 90, type: 'number',
    extra: { label: 'Bilek güçlü bükümlü mü? (±15° ötesi)', key: 'wristTwist', points: 1 }
  },
  {
    id: 'activity', label: 'Aktivite', title: 'Aktivite & Yük Skoru', img: null,
    desc: 'Çalışma koşullarını belirtin.',
    type: 'activity'
  }
];

// ─── App State ────────────────────────────────────────────────────
let currentStep = 0;
const answers = {};
let geminiApiKey = 'AIzaSyBBHlaX_IRAJ6CWc3QYX_Ed5yD9TQ1Pchs';

// ─── Scoring ──────────────────────────────────────────────────────
function scoreTrunk(deg) {
  if (deg === 0) return 1;
  if (deg <= 20) return 2;
  if (deg <= 60) return 3;
  return 4;
}
function scoreNeck(deg) { return deg < 20 ? 1 : 2; }
function scoreLegs(val) { return parseInt(val); }
function scoreUpperArm(deg) {
  if (deg < 20) return 1;
  if (deg <= 45) return 2;
  if (deg <= 90) return 3;
  return 4;
}
function scoreLowerArm(deg) { return (deg >= 60 && deg <= 100) ? 1 : 2; }
function scoreWrist(deg) { return deg < 15 ? 1 : 2; }

function getScoreA(trunk, neck, legs) {
  let t = Math.min(trunk - 1, 4);
  let n = Math.min(neck - 1, 1);
  let l = Math.min(legs - 1, 2);
  return TABLE_A[t][n][l];
}
function getScoreB(upperArm, lowerArm, wrist) {
  let u = Math.min(upperArm - 1, 5);
  let lo = Math.min(lowerArm - 1, 1);
  let w = Math.min(wrist - 1, 2);
  return TABLE_B[u][lo][w];
}
function getScoreC(scoreA, scoreB) {
  let a = Math.min(scoreA - 1, 11);
  let b = Math.min(scoreB - 1, 11);
  return TABLE_C[a][b];
}

function getRiskLevel(finalScore) {
  if (finalScore <= 1) return { level: 'Göz ardı edilebilir', color: 'risk-low', badge: 'bg-emerald-500', icon: '✓', action: 'Müdahale gerekmeyebilir.' };
  if (finalScore <= 3) return { level: 'Düşük', color: 'risk-low', badge: 'bg-emerald-500', icon: '↓', action: 'Değişiklik gerekebilir.' };
  if (finalScore <= 7) return { level: 'Orta', color: 'risk-medium', badge: 'bg-amber-500', icon: '!', action: 'Araştırın ve değişiklik yapın.' };
  if (finalScore <= 10) return { level: 'Yüksek', color: 'risk-high', badge: 'bg-red-500', icon: '!!', action: 'Kısa sürede araştırın ve değişiklik yapın.' };
  return { level: 'Çok Yüksek', color: 'risk-very-high', badge: 'bg-purple-500', icon: '!!!', action: 'Şimdi araştırın ve değişiklik yapın!' };
}

function calculateREBA() {
  const trunk = scoreTrunk(parseFloat(answers.trunk || 0));
  const neckRaw = scoreNeck(parseFloat(answers.neck || 0));
  const legs = scoreLegs(answers.legs || 1);
  const upperArm = scoreUpperArm(parseFloat(answers.upper_arm || 0));
  const lowerArm = scoreLowerArm(parseFloat(answers.lower_arm || 0));
  const wrist = scoreWrist(parseFloat(answers.wrist || 0));

  // extras
  let trunkAdj = trunk + (answers.trunkTwist ? 1 : 0);
  let neckAdj = neckRaw + (answers.neckTwist ? 1 : 0);
  let legAdj = legs + (answers.kneeFlexionLarge ? 2 : (answers.kneeFlexionSmall ? 1 : 0));
  
  let upperArmAdj = upperArm
    + (answers.armAbducted ? 1 : 0)
    + (answers.shoulderRaised ? 1 : 0)
    + (answers.armSupported ? -1 : 0);
  upperArmAdj = Math.max(1, upperArmAdj); // en az 1
  let wristAdj = wrist + (answers.wristTwist ? 1 : 0);

  const scoreA = getScoreA(Math.min(trunkAdj, 5), Math.min(neckAdj, 2), Math.min(legAdj, 4));
  const scoreB = getScoreB(Math.min(upperArmAdj, 6), lowerArm, Math.min(wristAdj, 3));

  const loadScore = parseInt(answers.load || 0);
  const actScore = (answers.isStatic || answers.isRepetitive) ? 1 : 0;

  const scoreAFinal = scoreA + loadScore;
  const scoreC = getScoreC(Math.min(scoreAFinal, 12), scoreB);
  const finalScore = scoreC + actScore;

  return {
    trunk, neckRaw, legs, upperArm, lowerArm, wrist,
    trunkAdj, neckAdj, upperArmAdj, wristAdj,
    scoreA, scoreB, scoreAFinal, scoreC,
    loadScore, actScore, finalScore
  };
}

// ─── Render Helpers ────────────────────────────────────────────────
function renderStepDots() {
  const el = document.getElementById('stepDots');
  el.innerHTML = steps.map((s, i) => `
    <div class="flex flex-col items-center gap-1">
      <div class="step-dot w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer
        ${i < currentStep ? 'bg-indigo-500 text-white' : i === currentStep ? 'bg-blue-400 text-white ring-2 ring-blue-400/40' : 'bg-slate-700 text-slate-400'}"
        onclick="if(${i} < ${currentStep}) goToStep(${i})">
        ${i < currentStep ? '✓' : i + 1}
      </div>
      <span class="text-xs hidden sm:block ${i === currentStep ? 'text-blue-300' : 'text-slate-500'}">${s.label}</span>
    </div>
  `).join('');
}

function renderStep(idx) {
  const s = steps[idx];
  const container = document.getElementById('stepContainer');
  document.getElementById('stepLabel').textContent = `Adım ${idx + 1} / ${steps.length}`;
  document.getElementById('stepName').textContent = s.title;
  document.getElementById('progressBar').style.width = `${((idx + 1) / steps.length) * 100}%`;
  renderStepDots();

  let bodyHtml = '';

  if (s.type === 'number') {
    const val = answers[s.id] !== undefined ? answers[s.id] : '';
    const extrasHtml = (s.extras || (s.extra ? [s.extra] : [])).map((ex, i) => {
      const pointsLabel = ex.points > 0 ? `(+${ex.points} puan)` : `(${ex.points} puan)`;
      const pointsColor = ex.points > 0 ? 'text-amber-400' : 'text-emerald-400';
      return `<label class="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition">
        <input type="checkbox" id="extraCheck_${i}" data-key="${ex.key}" class="extraChk w-4 h-4 accent-blue-500" ${answers[ex.key] ? 'checked' : ''}>
        <span class="text-sm text-slate-300">${ex.label} <span class="${pointsColor}">${pointsLabel}</span></span>
      </label>`;
    }).join('');
    bodyHtml = `
      <div class="flex flex-col sm:flex-row gap-6 items-center">
        ${s.img ? `<div class="w-48 h-48 flex-shrink-0 rounded-2xl overflow-hidden bg-white/5 flex items-center justify-center p-2">
          <img src="${s.img}" alt="${s.label}" class="object-contain w-full h-full rounded-xl">
        </div>` : ''}
        <div class="flex-1 w-full">
          <p class="text-slate-300 text-sm mb-4">${s.desc}</p>
          <div class="flex items-center gap-3 mb-2">
            <input type="number" id="mainInput" min="${s.min}" max="${s.max}" step="1"
              value="${val}" placeholder="Açıyı girin..."
              class="angle-input flex-1 bg-slate-800 border border-slate-600 rounded-xl px-5 py-3 text-2xl font-bold text-white text-center focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
              oninput="previewScore('${s.id}', this.value)">
            <span class="text-slate-400 text-lg font-medium">${s.unit}</span>
          </div>
          <div id="scorePreview" class="text-center text-sm text-slate-400 mb-4"></div>
          ${extrasHtml ? `<div class="flex flex-col gap-2 mt-3">${extrasHtml}</div>` : ''}
        </div>
      </div>`;
  } else if (s.type === 'select') {
    const extrasHtml = (s.extras || []).map((ex, i) => {
      const pointsLabel = ex.points > 0 ? `(+${ex.points} puan)` : `(${ex.points} puan)`;
      const pointsColor = ex.points > 0 ? 'text-amber-400' : 'text-emerald-400';
      return `<label class="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition">
        <input type="checkbox" id="extraCheckSelect_${i}" data-key="${ex.key}" class="extraChk w-4 h-4 accent-blue-500" ${answers[ex.key] ? 'checked' : ''}>
        <span class="text-sm text-slate-300">${ex.label} <span class="${pointsColor}">${pointsLabel}</span></span>
      </label>`;
    }).join('');
    bodyHtml = `
      <div class="flex flex-col sm:flex-row gap-6 items-center">
        <div class="w-48 h-48 flex-shrink-0 rounded-2xl overflow-hidden bg-white/5 flex items-center justify-center p-2">
          <img src="${s.img}" alt="${s.label}" class="object-contain w-full h-full rounded-xl">
        </div>
        <div class="flex-1 w-full">
          <p class="text-slate-300 text-sm mb-4">${s.desc}</p>
          <div class="flex flex-col gap-3">
            ${s.options.map(o => `
              <label class="flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all group
                ${answers[s.id] == o.value ? 'border-blue-400 bg-blue-500/10' : 'border-slate-600 bg-slate-800/50 hover:border-slate-400'}">
                <input type="radio" name="selectOpt" value="${o.value}" class="accent-blue-500" ${answers[s.id] == o.value ? 'checked' : ''}>
                <span class="text-sm font-medium ${answers[s.id] == o.value ? 'text-blue-300' : 'text-slate-300'}">${o.label}</span>
              </label>`).join('')}
          </div>
          ${extrasHtml ? `<div class="flex flex-col gap-2 mt-4">${extrasHtml}</div>` : ''}
        </div>
      </div>`;
  } else if (s.type === 'activity') {
    bodyHtml = `
      <div class="space-y-5">
        <p class="text-slate-300 text-sm">${s.desc}</p>
        <div>
          <h3 class="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Yük / Kuvvet Skoru</h3>
          <div class="flex flex-col gap-3">
            ${[{v:0,l:'< 5 kg (Hafif yük) – +0 puan'},{v:1,l:'5–10 kg – +1 puan'},{v:2,l:'> 10 kg veya ani kuvvet – +2 puan'}].map(o=>`
            <label class="flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all
              ${answers.load == o.v ? 'border-blue-400 bg-blue-500/10' : 'border-slate-600 bg-slate-800/50 hover:border-slate-400'}">
              <input type="radio" name="loadOpt" value="${o.v}" class="accent-blue-500" ${answers.load == o.v ? 'checked' : ''}>
              <span class="text-sm font-medium ${answers.load == o.v ? 'text-blue-300' : 'text-slate-300'}">${o.l}</span>
            </label>`).join('')}
          </div>
        </div>
        <div>
          <h3 class="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Aktivite Skoru (+1)</h3>
          <div class="flex flex-col gap-3">
            <label class="flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all
              ${answers.isStatic ? 'border-blue-400 bg-blue-500/10' : 'border-slate-600 bg-slate-800/50 hover:border-slate-400'}">
              <input type="checkbox" id="isStatic" class="w-4 h-4 accent-blue-500" ${answers.isStatic ? 'checked' : ''}>
              <span class="text-sm text-slate-300">İş statik mi? (1 dakika veya daha fazla süren pozisyon)</span>
            </label>
            <label class="flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all
              ${answers.isRepetitive ? 'border-blue-400 bg-blue-500/10' : 'border-slate-600 bg-slate-800/50 hover:border-slate-400'}">
              <input type="checkbox" id="isRepetitive" class="w-4 h-4 accent-blue-500" ${answers.isRepetitive ? 'checked' : ''}>
              <span class="text-sm text-slate-300">Tekrarlı hareket mi? (Dakikada 4+ kez)</span>
            </label>
          </div>
        </div>
      </div>`;
  }

  container.innerHTML = `
    <div class="step-card glass rounded-2xl p-6 sm:p-8 fade-in glow">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-sm">${idx + 1}</div>
        <h2 class="text-xl font-bold text-white">${s.title}</h2>
      </div>
      ${bodyHtml}
      <div class="flex justify-between mt-8 pt-6 border-t border-white/10">
        <button onclick="prevStep()" class="px-5 py-2.5 rounded-xl border border-slate-600 text-slate-300 hover:border-slate-400 hover:text-white transition text-sm font-medium ${idx === 0 ? 'opacity-30 cursor-not-allowed' : ''}">
          ← Geri
        </button>
        <button onclick="nextStep()" class="btn-primary px-7 py-2.5 rounded-xl text-white font-semibold text-sm">
          ${idx === steps.length - 1 ? 'Hesapla & Analiz Et →' : 'İleri →'}
        </button>
      </div>
    </div>`;

  // attach event to preview on number inputs
  if (s.type === 'number') {
    previewScore(s.id, answers[s.id] || '');
  }
}

function previewScore(id, val) {
  const el = document.getElementById('scorePreview');
  if (!el || val === '' || isNaN(val)) { if (el) el.textContent = ''; return; }
  const v = parseFloat(val);
  let score, label;
  if (id === 'trunk') { score = scoreTrunk(v); }
  else if (id === 'neck') { score = scoreNeck(v); }
  else if (id === 'upper_arm') { score = scoreUpperArm(v); }
  else if (id === 'lower_arm') { score = scoreLowerArm(v); }
  else if (id === 'wrist') { score = scoreWrist(v); }
  if (score !== undefined) {
    const colors = ['', 'text-emerald-400', 'text-yellow-400', 'text-orange-400', 'text-red-400'];
    el.innerHTML = `<span class="font-semibold ${colors[score] || 'text-white'}">Ham Puan: ${score}</span>`;
  }
}

function collectCurrent() {
  const s = steps[currentStep];
  if (s.type === 'number') {
    const v = document.getElementById('mainInput')?.value;
    if (v === '' || isNaN(v)) { alert('Lütfen geçerli bir açı değeri girin.'); return false; }
    answers[s.id] = parseFloat(v);
    // collect single extra
    if (s.extra) answers[s.extra.key] = document.getElementById('extraCheck_0')?.checked || false;
    // collect multiple extras
    if (s.extras) {
      document.querySelectorAll('.extraChk').forEach(el => {
        answers[el.dataset.key] = el.checked;
      });
    }
  } else if (s.type === 'select') {
    const sel = document.querySelector('input[name="selectOpt"]:checked');
    if (!sel) { alert('Lütfen bir seçenek işaretleyin.'); return false; }
    answers[s.id] = parseInt(sel.value);
    // collect extras for select steps
    if (s.extras) {
      document.querySelectorAll('.extraChk').forEach(el => {
        answers[el.dataset.key] = el.checked;
      });
    }
  } else if (s.type === 'activity') {
    const load = document.querySelector('input[name="loadOpt"]:checked');
    answers.load = load ? parseInt(load.value) : 0;
    answers.isStatic = document.getElementById('isStatic')?.checked || false;
    answers.isRepetitive = document.getElementById('isRepetitive')?.checked || false;
  }
  return true;
}

function nextStep() {
  if (!collectCurrent()) return;
  if (currentStep < steps.length - 1) {
    currentStep++;
    renderStep(currentStep);
  } else {
    document.getElementById('stepContainer').innerHTML = '';
    document.getElementById('progressSection').style.display = 'none';
    showResult();
  }
}

function prevStep() {
  if (currentStep === 0) return;
  collectCurrent();
  currentStep--;
  renderStep(currentStep);
}

function goToStep(idx) {
  collectCurrent();
  currentStep = idx;
  renderStep(currentStep);
}

// ─── Results ───────────────────────────────────────────────────────
function showResult() {
  const r = calculateREBA();
  const risk = getRiskLevel(r.finalScore);
  const sec = document.getElementById('resultSection');
  sec.classList.remove('hidden');

  sec.innerHTML = `
    <div class="fade-in space-y-6">
      <!-- Score Card -->
      <div class="rounded-2xl border-2 p-6 sm:p-8 ${risk.color} border-opacity-60 text-center relative overflow-hidden">
        <div class="absolute inset-0 opacity-10 pointer-events-none" style="background:radial-gradient(circle at 50% 0%,white,transparent 70%)"></div>
        <div class="relative">
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-xs font-semibold uppercase tracking-wider mb-4">
            ${risk.icon} ${risk.level} Risk
          </div>
          <div class="text-7xl font-black mb-2">${r.finalScore}</div>
          <div class="text-lg font-semibold opacity-90 mb-1">REBA Final Skoru</div>
          <div class="text-sm opacity-70">${risk.action}</div>
        </div>
      </div>

      <!-- Score Breakdown -->
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
        ${[
          ['Tablo A Skoru', r.scoreA, 'Gövde+Boyun+Bacak'],
          ['Tablo B Skoru', r.scoreB, 'Omuz+Dirsek+Bilek'],
          ['Yük Skoru', r.loadScore, 'Kuvvet/yük eklentisi'],
          ['Skor A+Yük', r.scoreAFinal, 'Tablo A + Yük'],
          ['Skor C', r.scoreC, 'Tablo C sonucu'],
          ['Aktivite', r.actScore, 'Statik/tekrarlı'],
        ].map(([t,v,s]) => `
        <div class="glass rounded-xl p-4 text-center">
          <div class="text-2xl font-bold text-white mb-1">${v}</div>
          <div class="text-xs font-semibold text-slate-300">${t}</div>
          <div class="text-xs text-slate-500 mt-0.5">${s}</div>
        </div>`).join('')}
      </div>

      <!-- Individual Scores -->
      <div class="glass rounded-2xl p-6">
        <h3 class="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Bölgesel Puanlar</h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          ${[
            ['Gövde', r.trunkAdj, r.trunk !== r.trunkAdj ? `(ham: ${r.trunk})` : ''],
            ['Boyun', r.neckAdj, r.neckRaw !== r.neckAdj ? `(ham: ${r.neckRaw})` : ''],
            ['Bacaklar', r.legs, ''],
            ['Üst Kol', r.upperArmAdj, r.upperArm !== r.upperArmAdj ? `(ham: ${r.upperArm})` : ''],
            ['Alt Kol', r.lowerArm, ''],
            ['Bilek', r.wristAdj, r.wrist !== r.wristAdj ? `(ham: ${r.wrist})` : ''],
          ].map(([name,val,note]) => `
          <div class="flex items-center justify-between bg-slate-800/50 rounded-xl px-4 py-3">
            <span class="text-sm text-slate-300">${name}</span>
            <div class="text-right">
              <span class="font-bold text-white">${val}</span>
              ${note ? `<div class="text-xs text-slate-500">${note}</div>` : ''}
            </div>
          </div>`).join('')}
        </div>
      </div>

      <!-- Gemini Section -->
      <div class="glass rounded-2xl p-6">
        <div class="flex items-center justify-between mb-5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-blue-600/20 border border-violet-500/30 flex items-center justify-center text-lg">🤖</div>
            <div>
              <h3 class="text-base font-bold text-white">AI Ergonomi Önerileri</h3>
              <p class="text-xs text-slate-400">Gemini yapay zekası ile kişiselleştirilmiş analiz</p>
            </div>
          </div>
          <span class="text-xs text-violet-400 bg-violet-500/10 border border-violet-500/20 px-3 py-1 rounded-full font-medium">Powered by Gemini</span>
        </div>
        <div id="geminiResult">
          <button onclick="fetchGeminiSuggestions()" id="geminiBtn"
            class="w-full py-3.5 rounded-xl font-semibold text-sm text-white transition-all"
            style="background: linear-gradient(135deg, #7c3aed, #3b82f6); box-shadow: 0 4px 20px rgba(124,58,237,0.3);">
            ✨ Yapay Zeka ile Analiz Et
          </button>
        </div>
      </div>

      <button onclick="location.reload()" class="w-full py-3 rounded-xl border border-slate-600 text-slate-300 hover:border-slate-400 hover:text-white transition text-sm font-medium">
        ↺ Yeni Değerlendirme
      </button>
    </div>`;
}

async function fetchGeminiSuggestions() {
  const key = geminiApiKey;

  const r = calculateREBA();
  const risk = getRiskLevel(r.finalScore);
  const resultEl = document.getElementById('geminiResult');

  resultEl.innerHTML = `<div class="flex flex-col items-center gap-3 text-slate-400 text-sm p-6 bg-slate-800/50 rounded-xl">
    <div class="w-8 h-8 border-2 border-violet-400 border-t-transparent rounded-full animate-spin"></div>
    <span>Gemini analiz yapıyor...</span>
  </div>`;

  const scores = {
    govde_puani: r.trunkAdj,
    boyun_puani: r.neckAdj,
    bacak_puani: r.legs,
    ust_kol_puani: r.upperArmAdj,
    alt_kol_puani: r.lowerArm,
    bilek_puani: r.wristAdj,
    tablo_A_skoru: r.scoreA,
    tablo_B_skoru: r.scoreB,
    skor_C: r.scoreC,
    yuk_skoru: r.loadScore,
    aktivite_skoru: r.actScore,
    final_REBA_skoru: r.finalScore,
    risk_seviyesi: risk.level,
    oneri_eylemi: risk.action
  };

  const prompt = `Sen uzman bir endüstriyel ergonomi danışmanısın. Aşağıdaki REBA (Rapid Entire Body Assessment) analiz sonuçlarını inceleyerek Türkçe olarak 3 başlıkta somut ve uygulanabilir öneriler sun.

REBA Skorları: ${JSON.stringify(scores, null, 2)}

Lütfen şu 3 başlıkta yanıt ver (her başlık için 2-3 madde, somut ve kısa):

## 🔧 Mühendislik İyileştirmeleri
(Örn: masa yüksekliği, ekipman düzeni, otomasyon)

## 📋 İdari Kontroller  
(Örn: mola süreleri, rotasyon, eğitim)

## 🏃 Kişisel Koruma & Egzersiz
(Örn: germe egzersizleri, doğru duruş, destekler)

Her madde kısa, net ve direkt uygulanabilir olsun.`;

  try {
    const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    if (!resp.ok) { const e = await resp.json(); throw new Error(e.error?.message || resp.statusText); }
    const data = await resp.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Yanıt alınamadı.';
    resultEl.innerHTML = formatGeminiResponse(text);
  } catch (err) {
    resultEl.innerHTML = `<div class="p-4 bg-red-900/30 border border-red-500/30 rounded-xl text-sm text-red-300 mb-3">
      <strong>Hata:</strong> ${err.message}
    </div>
    <button onclick="fetchGeminiSuggestions()" class="w-full py-3 rounded-xl font-semibold text-sm text-white" style="background:linear-gradient(135deg,#7c3aed,#3b82f6)">
      ↺ Tekrar Dene
    </button>`;
  }
}

function formatGeminiResponse(text) {
  const icons = { 'Mühendislik': '🔧', 'İdari': '📋', 'Kişisel': '🏃' };
  const colors = { 'Mühendislik': 'blue', 'İdari': 'amber', 'Kişisel': 'emerald' };
  const sections = text.split(/##\s+/).filter(Boolean);
  if (sections.length < 2) {
    // fallback plain render
    return `<div class="prose prose-invert prose-sm max-w-none p-4 bg-slate-800/50 rounded-xl text-slate-300 whitespace-pre-wrap text-sm">${text}</div>`;
  }
  return sections.map(sec => {
    const lines = sec.split('\n').filter(Boolean);
    const title = lines[0];
    const body = lines.slice(1).join('\n');
    const key = Object.keys(colors).find(k => title.includes(k)) || 'default';
    const color = colors[key] || 'slate';
    const items = body.split('\n').filter(l => l.trim()).map(l =>
      `<li class="text-slate-300 text-sm">${l.replace(/^[-*•]\s*/, '')}</li>`
    ).join('');
    return `<div class="mb-4 p-4 bg-${color}-500/10 border border-${color}-500/20 rounded-xl">
      <h4 class="font-bold text-${color}-300 mb-3 text-sm">${title.trim()}</h4>
      <ul class="space-y-2 list-disc list-inside">${items}</ul>
    </div>`;
  }).join('');
}

// ─── Init ──────────────────────────────────────────────────────────
renderStep(0);
