/* =========================================================
   DSA LAB — linked-list.js
   Drives pages/linked-list.html. Runs entirely in the
   browser — there is no /api/linked-list endpoint on the
   backend (see backend/README.md if you want to add one).
   ========================================================= */

const llState = {
  list: [12, 47, 8, 23],
  operation: 'insertHead',
  value: 99,
  position: 1,
  steps: [],
  stepIndex: 0,
  playing: false,
  timer: null,
};

document.addEventListener('DOMContentLoaded', () => {
  markActiveNav('linked-list');
  document.getElementById('listInput').value = llState.list.join(', ');
  document.getElementById('valueInput').value = llState.value;
  document.getElementById('positionInput').value = llState.position;
  document.getElementById('opSelect').addEventListener('change', onOpChange);
  onOpChange();

  document.getElementById('applyListBtn').addEventListener('click', applyList);
  document.getElementById('randomListBtn').addEventListener('click', randomizeList);
  document.getElementById('runBtn').addEventListener('click', runOperation);
  document.getElementById('prevBtn').addEventListener('click', stepPrev);
  document.getElementById('playBtn').addEventListener('click', playPause);
  document.getElementById('nextBtn').addEventListener('click', stepNext);
  document.getElementById('resetBtn').addEventListener('click', resetPlayback);
  document.getElementById('stepSlider').addEventListener('input', (e) => seek(e.target.value));

  runOperation();
});

function onOpChange() {
  llState.operation = document.getElementById('opSelect').value;
  const needsPosition = llState.operation === 'insertAt';
  document.getElementById('positionField').style.display = needsPosition ? 'flex' : 'none';
  const needsValue = llState.operation !== 'traverse';
  document.getElementById('valueField').style.display = needsValue ? 'flex' : 'none';
}

function applyList() {
  const arr = DsaUtil.parseArrayInput(document.getElementById('listInput').value, { max: 12 });
  llState.list = arr;
  runOperation();
}
function randomizeList() {
  llState.list = DsaUtil.randomArray(5, 90);
  document.getElementById('listInput').value = llState.list.join(', ');
  runOperation();
}

/* ---------- Step generators ---------- */
function llSnap(list, opts) {
  return Object.assign({ list: [...list], highlight: null, newIndex: null, removedIndex: null, foundIndex: null, message: '' }, opts);
}

function stepsInsertHead(list, value) {
  const steps = [];
  steps.push(llSnap(list, { message: 'Creating a new node with value ' + value + '.' }));
  const next = [value, ...list];
  steps.push(llSnap(next, { newIndex: 0, message: 'Point the new node to the old head, then make it the new head.' }));
  steps.push(llSnap(next, { message: 'Insertion at head complete.' }));
  return steps;
}
function stepsInsertTail(list, value) {
  const steps = [];
  steps.push(llSnap(list, { message: 'Traversing the list to find the last node.' }));
  for (let i = 0; i < list.length; i++) {
    steps.push(llSnap(list, { highlight: i, message: 'Visiting node ' + list[i] + ' at position ' + i + '.' }));
  }
  const next = [...list, value];
  steps.push(llSnap(next, { newIndex: next.length - 1, message: 'Reached the end (next = NULL). Linking new node ' + value + ' here.' }));
  steps.push(llSnap(next, { message: 'Insertion at tail complete.' }));
  return steps;
}
function stepsInsertAt(list, value, pos) {
  pos = Math.max(0, Math.min(pos, list.length));
  const steps = [];
  if (pos === 0) return stepsInsertHead(list, value);
  steps.push(llSnap(list, { message: 'Traversing to position ' + pos + '.' }));
  for (let i = 0; i < pos; i++) {
    steps.push(llSnap(list, { highlight: i, message: 'Visiting node ' + list[i] + ' at position ' + i + '.' }));
  }
  const next = [...list.slice(0, pos), value, ...list.slice(pos)];
  steps.push(llSnap(next, { newIndex: pos, message: 'Inserting ' + value + ' at position ' + pos + ', relinking neighbors.' }));
  steps.push(llSnap(next, { message: 'Insertion complete.' }));
  return steps;
}
function stepsDelete(list, value) {
  const steps = [];
  steps.push(llSnap(list, { message: 'Searching for a node with value ' + value + ' to delete.' }));
  let idx = -1;
  for (let i = 0; i < list.length; i++) {
    steps.push(llSnap(list, { highlight: i, message: 'Checking node ' + list[i] + ' at position ' + i + '.' }));
    if (list[i] === value) { idx = i; break; }
  }
  if (idx === -1) {
    steps.push(llSnap(list, { message: 'Value ' + value + ' was not found in the list. Nothing deleted.' }));
    return steps;
  }
  steps.push(llSnap(list, { highlight: idx, removedIndex: idx, message: 'Found it. Re-linking the previous node to skip over this one.' }));
  const next = list.filter((_, i) => i !== idx);
  steps.push(llSnap(next, { message: 'Node removed. Deletion complete.' }));
  return steps;
}
function stepsSearch(list, value) {
  const steps = [];
  for (let i = 0; i < list.length; i++) {
    steps.push(llSnap(list, { highlight: i, message: 'Checking node ' + list[i] + ' at position ' + i + ': is it ' + value + '?' }));
    if (list[i] === value) {
      steps.push(llSnap(list, { foundIndex: i, message: 'Found ' + value + ' at position ' + i + '!' }));
      return steps;
    }
  }
  steps.push(llSnap(list, { message: value + ' was not found in the list.' }));
  return steps;
}
function stepsTraverse(list) {
  const steps = [];
  steps.push(llSnap(list, { message: 'Starting traversal from the head.' }));
  for (let i = 0; i < list.length; i++) {
    steps.push(llSnap(list, { highlight: i, message: 'Visiting node ' + list[i] + ' at position ' + i + '.' }));
  }
  steps.push(llSnap(list, { message: 'Reached NULL — end of list.' }));
  return steps;
}

function runOperation() {
  DsaUtil.hideBanner('errorBanner');
  llState.operation = document.getElementById('opSelect').value;
  llState.value = parseInt(document.getElementById('valueInput').value, 10);
  llState.position = parseInt(document.getElementById('positionInput').value, 10) || 0;

  let steps;
  switch (llState.operation) {
    case 'insertHead': steps = stepsInsertHead(llState.list, llState.value); break;
    case 'insertTail': steps = stepsInsertTail(llState.list, llState.value); break;
    case 'insertAt': steps = stepsInsertAt(llState.list, llState.value, llState.position); break;
    case 'delete': steps = stepsDelete(llState.list, llState.value); break;
    case 'search': steps = stepsSearch(llState.list, llState.value); break;
    case 'traverse': steps = stepsTraverse(llState.list); break;
    default: steps = stepsTraverse(llState.list);
  }
  llState.steps = steps;
  llState.stepIndex = 0;
  document.getElementById('stepSlider').max = steps.length - 1;
  paintStep();
}

function paintStep() {
  const step = llState.steps[llState.stepIndex];
  if (!step) return;
  const list = step.list;

  if (list.length === 0) {
    document.getElementById('listViz').innerHTML = '<div class="ll-empty">The list is empty. HEAD → NULL</div>';
  } else {
    let html = '';
    list.forEach((v, idx) => {
      let cls = '';
      if (step.highlight === idx) cls = 'current';
      if (step.newIndex === idx) cls = 'new';
      if (step.foundIndex === idx) cls = 'found';
      const headTag = idx === 0 ? '<span class="head-tag">HEAD</span>' : '';
      html += '<div class="ll-node"><div class="ll-box ' + cls + '">' + headTag + v + '</div>';
      html += '<div class="ll-arrow">→</div></div>';
    });
    html += '<div class="ll-null">NULL</div>';
    document.getElementById('listViz').innerHTML = html;
  }

  document.getElementById('explainText').textContent = step.message;
  document.getElementById('statLen').textContent = list.length;
  document.getElementById('statOp').textContent = document.getElementById('opSelect').selectedOptions[0].textContent;
  document.getElementById('statStep').textContent = llState.stepIndex + ' / ' + (llState.steps.length - 1);
  document.getElementById('stepLabel').textContent = 'Step ' + llState.stepIndex + ' of ' + (llState.steps.length - 1);
  document.getElementById('stepSlider').value = llState.stepIndex;
  document.getElementById('playBtn').textContent = llState.playing ? '⏸' : '▶';
}

function stepNext() { if (llState.stepIndex < llState.steps.length - 1) { llState.stepIndex++; paintStep(); } else pause(); }
function stepPrev() { if (llState.stepIndex > 0) { llState.stepIndex--; paintStep(); } }
function seek(v) { llState.stepIndex = parseInt(v, 10); paintStep(); }
function resetPlayback() { pause(); llState.stepIndex = 0; paintStep(); }
function playPause() { llState.playing ? pause() : play(); }
function play() {
  if (llState.stepIndex >= llState.steps.length - 1) llState.stepIndex = 0;
  llState.playing = true;
  document.getElementById('playBtn').textContent = '⏸';
  llState.timer = setInterval(() => {
    if (llState.stepIndex >= llState.steps.length - 1) { pause(); return; }
    stepNext();
  }, 700);
}
function pause() {
  llState.playing = false;
  clearInterval(llState.timer);
  const btn = document.getElementById('playBtn');
  if (btn) btn.textContent = '▶';
}
