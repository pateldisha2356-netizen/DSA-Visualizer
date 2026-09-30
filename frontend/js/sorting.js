/* =========================================================
   DSA LAB — sorting.js
   Drives pages/sorting.html. Calls the real backend
   (POST /api/sort/{algorithm}) to get a step trace, then
   plays it back with full user control.
   ========================================================= */

const SORT_ALGOS = {
  bubble: { name: 'Bubble Sort' },
  selection: { name: 'Selection Sort' },
  insertion: { name: 'Insertion Sort' },
  merge: { name: 'Merge Sort' },
  quick: { name: 'Quick Sort' },
};

const sortState = {
  algo: 'bubble',
  array: [7, 2, 9, 1, 5, 4, 8],
  steps: [],
  stepIndex: 0,
  playing: false,
  timer: null,
  speed: 450,
  meta: null,
};

function getQueryParam(name, fallback) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name) || fallback;
}

document.addEventListener('DOMContentLoaded', async () => {
  markActiveNav('sorting');
  sortState.algo = getQueryParam('algo', 'bubble');
  if (!SORT_ALGOS[sortState.algo]) sortState.algo = 'bubble';

  document.getElementById('algoSelect').value = sortState.algo;
  document.getElementById('customArr').value = sortState.array.join(', ');
  highlightSidebar(sortState.algo);

  document.getElementById('algoSelect').addEventListener('change', (e) => {
    window.location.search = '?algo=' + e.target.value;
  });
  document.getElementById('applyBtn').addEventListener('click', applyCustomArray);
  document.getElementById('randomBtn').addEventListener('click', randomizeArray);
  document.getElementById('speedSlider').addEventListener('input', (e) => updateSpeed(e.target.value));
  document.getElementById('prevBtn').addEventListener('click', stepPrev);
  document.getElementById('playBtn').addEventListener('click', playPause);
  document.getElementById('nextBtn').addEventListener('click', stepNext);
  document.getElementById('resetBtn').addEventListener('click', resetPlayback);
  document.getElementById('stepSlider').addEventListener('input', (e) => seek(e.target.value));

  await loadMeta();
  await runAlgorithm();
});

function highlightSidebar(algo) {
  document.querySelectorAll('.sidebar a').forEach((a) => {
    a.classList.toggle('active', a.dataset.algo === algo);
  });
}

async function loadMeta() {
  try {
    sortState.meta = await DsaApi.getMeta(sortState.algo);
  } catch (err) {
    sortState.meta = null;
  }
  const m = sortState.meta;
  document.getElementById('metaName').textContent = m ? m.name : SORT_ALGOS[sortState.algo].name;
  document.getElementById('metaTime').textContent = m ? m.time : '—';
  document.getElementById('metaSpace').textContent = m ? m.space : '—';
  document.getElementById('vizTitle').textContent = '▤ Sorting Visualizer — ' + (m ? m.name : SORT_ALGOS[sortState.algo].name);
}

async function runAlgorithm() {
  DsaUtil.hideBanner('errorBanner');
  document.getElementById('vizBox').innerHTML = '<div class="loading-line">Running ' + SORT_ALGOS[sortState.algo].name + ' on the backend…</div>';
  setControlsEnabled(false);
  try {
    const result = await DsaApi.sort(sortState.algo, sortState.array);
    sortState.steps = result.steps;
    sortState.stepIndex = 0;
    document.getElementById('stepSlider').max = sortState.steps.length - 1;
    setControlsEnabled(true);
    paintStep();
  } catch (err) {
    DsaUtil.showBanner('errorBanner', err.message);
    document.getElementById('vizBox').innerHTML = '';
    document.getElementById('explainText').textContent = 'Nothing to show — fix the connection above and try again.';
  }
}

function setControlsEnabled(enabled) {
  ['prevBtn', 'playBtn', 'nextBtn', 'resetBtn', 'stepSlider'].forEach((id) => {
    document.getElementById(id).disabled = !enabled;
  });
}

function applyCustomArray() {
  const arr = DsaUtil.parseArrayInput(document.getElementById('customArr').value, { max: 20 });
  if (arr.length < 2) { alert('Please enter at least 2 numbers.'); return; }
  sortState.array = arr;
  pause();
  runAlgorithm();
}

function randomizeArray() {
  sortState.array = DsaUtil.randomArray(7 + Math.floor(Math.random() * 3));
  document.getElementById('customArr').value = sortState.array.join(', ');
  pause();
  runAlgorithm();
}

function updateSpeed(sliderValue) {
  sortState.speed = 1050 - sliderValue;
  if (sortState.playing) { clearInterval(sortState.timer); startTimer(); }
}

function paintStep() {
  const step = sortState.steps[sortState.stepIndex];
  if (!step) return;
  const arr = step.array || [];
  const maxVal = Math.max(...arr, 1);
  const compare = step.compare || [];
  const swap = step.swap || [];
  const sorted = step.sorted || [];
  const pivot = step.pivot;

  document.getElementById('vizBox').innerHTML = arr.map((v, idx) => {
    let cls = 'normal';
    if (sorted.includes(idx)) cls = 'sorted';
    if (pivot === idx) cls = 'pivot';
    if (compare.includes(idx)) cls = 'comparing';
    if (swap.includes(idx)) cls = 'swapping';
    const h = 30 + (v / maxVal) * 170;
    return '<div class="bar-col"><div class="bar ' + cls + '" style="height:' + h + 'px"><span>' + v + '</span></div><div class="bar-idx">' + idx + '</div></div>';
  }).join('');

  document.getElementById('explainText').textContent = step.message || '';
  document.getElementById('statComp').textContent = step.comparisons != null ? step.comparisons : 0;
  document.getElementById('statSwap').textContent = step.swaps != null ? step.swaps : 0;
  document.getElementById('statStep').textContent = sortState.stepIndex + ' / ' + (sortState.steps.length - 1);
  document.getElementById('stepLabel').textContent = 'Step ' + sortState.stepIndex + ' of ' + (sortState.steps.length - 1);
  document.getElementById('stepSlider').value = sortState.stepIndex;
  document.getElementById('playBtn').textContent = sortState.playing ? '⏸' : '▶';
}

function stepNext() {
  if (sortState.stepIndex < sortState.steps.length - 1) { sortState.stepIndex++; paintStep(); }
  else pause();
}
function stepPrev() {
  if (sortState.stepIndex > 0) { sortState.stepIndex--; paintStep(); }
}
function seek(v) { sortState.stepIndex = parseInt(v, 10); paintStep(); }
function resetPlayback() { pause(); sortState.stepIndex = 0; paintStep(); }

function startTimer() {
  sortState.timer = setInterval(() => {
    if (sortState.stepIndex >= sortState.steps.length - 1) { pause(); return; }
    stepNext();
  }, sortState.speed);
}
function playPause() { sortState.playing ? pause() : play(); }
function play() {
  if (sortState.stepIndex >= sortState.steps.length - 1) sortState.stepIndex = 0;
  sortState.playing = true;
  document.getElementById('playBtn').textContent = '⏸';
  startTimer();
}
function pause() {
  sortState.playing = false;
  clearInterval(sortState.timer);
  const btn = document.getElementById('playBtn');
  if (btn) btn.textContent = '▶';
}
