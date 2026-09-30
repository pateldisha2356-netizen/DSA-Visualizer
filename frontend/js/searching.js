/* =========================================================
   DSA LAB — searching.js
   Drives pages/searching.html. Calls the real backend
   (POST /api/search/{algorithm}) to get a step trace.
   ========================================================= */

const SEARCH_ALGOS = {
  linear: { name: 'Linear Search' },
  binary: { name: 'Binary Search' },
};

const searchState = {
  algo: 'linear',
  array: [4, 8, 2, 9, 5, 1, 7, 3],
  target: 9,
  steps: [],
  stepIndex: 0,
  playing: false,
  timer: null,
};

document.addEventListener('DOMContentLoaded', async () => {
  markActiveNav('searching');
  const params = new URLSearchParams(window.location.search);
  searchState.algo = params.get('algo') || 'linear';
  if (!SEARCH_ALGOS[searchState.algo]) searchState.algo = 'linear';

  document.getElementById('algoSelect').value = searchState.algo;
  document.getElementById('arrInput').value = searchState.array.join(', ');
  document.getElementById('targetInput').value = searchState.target;
  highlightSidebar(searchState.algo);

  document.getElementById('algoSelect').addEventListener('change', (e) => {
    window.location.search = '?algo=' + e.target.value;
  });
  document.getElementById('startBtn').addEventListener('click', applyConfig);
  document.getElementById('randomBtn').addEventListener('click', randomizeArray);
  document.getElementById('prevBtn').addEventListener('click', stepPrev);
  document.getElementById('playBtn').addEventListener('click', playPause);
  document.getElementById('nextBtn').addEventListener('click', stepNext);
  document.getElementById('resetBtn').addEventListener('click', resetPlayback);
  document.getElementById('stepSlider').addEventListener('input', (e) => seek(e.target.value));

  await loadMeta();
  await runAlgorithm();
});

function highlightSidebar(algo) {
  document.querySelectorAll('.sidebar a').forEach((a) => a.classList.toggle('active', a.dataset.algo === algo));
}

async function loadMeta() {
  let meta = null;
  try { meta = await DsaApi.getMeta(searchState.algo); } catch (err) { meta = null; }
  document.getElementById('metaName').textContent = meta ? meta.name : SEARCH_ALGOS[searchState.algo].name;
  document.getElementById('metaTime').textContent = meta ? meta.time : '—';
  document.getElementById('metaSpace').textContent = meta ? meta.space : '—';
  document.getElementById('vizTitle').textContent = '◎ Search Visualizer — ' + (meta ? meta.name : SEARCH_ALGOS[searchState.algo].name);
}

async function runAlgorithm() {
  DsaUtil.hideBanner('errorBanner');
  document.getElementById('vizBox').innerHTML = '<div class="loading-line">Running ' + SEARCH_ALGOS[searchState.algo].name + ' on the backend…</div>';
  setControlsEnabled(false);
  try {
    const result = await DsaApi.search(searchState.algo, searchState.array, searchState.target);
    searchState.steps = result.steps;
    searchState.stepIndex = 0;
    document.getElementById('stepSlider').max = searchState.steps.length - 1;
    setControlsEnabled(true);
    paintStep();
  } catch (err) {
    DsaUtil.showBanner('errorBanner', err.message);
    document.getElementById('vizBox').innerHTML = '';
    document.getElementById('explainText').textContent = 'Nothing to show — fix the connection above and try again.';
  }
}

function setControlsEnabled(enabled) {
  ['prevBtn', 'playBtn', 'nextBtn', 'resetBtn', 'stepSlider'].forEach((id) => { document.getElementById(id).disabled = !enabled; });
}

function applyConfig() {
  const arr = DsaUtil.parseArrayInput(document.getElementById('arrInput').value, { max: 16 });
  if (arr.length < 2) { alert('Please enter at least 2 numbers.'); return; }
  const target = parseInt(document.getElementById('targetInput').value, 10);
  if (isNaN(target)) { alert('Please enter a valid target number.'); return; }
  searchState.array = arr;
  searchState.target = target;
  pause();
  runAlgorithm();
}

function randomizeArray() {
  const arr = DsaUtil.randomArray(8, 40);
  searchState.array = arr;
  searchState.target = arr[Math.floor(Math.random() * arr.length)];
  document.getElementById('arrInput').value = arr.join(', ');
  document.getElementById('targetInput').value = searchState.target;
  pause();
  runAlgorithm();
}

function paintStep() {
  const step = searchState.steps[searchState.stepIndex];
  if (!step) return;
  const arr = step.array || [];
  document.getElementById('vizBox').innerHTML = '<div class="box-row">' + arr.map((v, idx) => {
    let cls = '';
    if (step.current === idx) cls = 'comparing';
    if (step.found === idx) cls = 'found';
    if (step.low != null && step.high != null && (idx < step.low || idx > step.high)) cls = 'eliminated';
    let tag = '';
    if (step.mid === idx) tag = 'mid';
    else if (step.low === idx) tag = 'lo';
    else if (step.high === idx) tag = 'hi';
    return '<div class="box ' + cls + '">' + (tag ? '<span class="tag">' + tag + '</span>' : '') + v + '</div>';
  }).join('') + '</div>';

  document.getElementById('explainText').textContent = step.message || '';
  document.getElementById('statComp').textContent = step.comparisons != null ? step.comparisons : 0;
  document.getElementById('statStep').textContent = searchState.stepIndex + ' / ' + (searchState.steps.length - 1);
  document.getElementById('stepLabel').textContent = 'Step ' + searchState.stepIndex + ' of ' + (searchState.steps.length - 1);
  document.getElementById('stepSlider').value = searchState.stepIndex;
  document.getElementById('playBtn').textContent = searchState.playing ? '⏸' : '▶';
}

function stepNext() {
  if (searchState.stepIndex < searchState.steps.length - 1) { searchState.stepIndex++; paintStep(); }
  else pause();
}
function stepPrev() { if (searchState.stepIndex > 0) { searchState.stepIndex--; paintStep(); } }
function seek(v) { searchState.stepIndex = parseInt(v, 10); paintStep(); }
function resetPlayback() { pause(); searchState.stepIndex = 0; paintStep(); }

function playPause() { searchState.playing ? pause() : play(); }
function play() {
  if (searchState.stepIndex >= searchState.steps.length - 1) searchState.stepIndex = 0;
  searchState.playing = true;
  document.getElementById('playBtn').textContent = '⏸';
  searchState.timer = setInterval(() => {
    if (searchState.stepIndex >= searchState.steps.length - 1) { pause(); return; }
    stepNext();
  }, 700);
}
function pause() {
  searchState.playing = false;
  clearInterval(searchState.timer);
  const btn = document.getElementById('playBtn');
  if (btn) btn.textContent = '▶';
}
