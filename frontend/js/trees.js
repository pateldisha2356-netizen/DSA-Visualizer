/* =========================================================
   DSA LAB — trees.js
   Drives pages/trees.html. A Binary Search Tree visualizer
   that runs entirely in the browser — there is no
   /api/tree endpoint on the backend (see backend/README.md
   if you want to add one).
   ========================================================= */

const treeState = {
  root: null,
  operation: 'insert',
  value: 50,
  steps: [],
  stepIndex: 0,
  playing: false,
  timer: null,
};

document.addEventListener('DOMContentLoaded', () => {
  markActiveNav('trees');
  document.getElementById('buildInput').value = '50, 30, 70, 20, 40, 65, 80';
  document.getElementById('valueInput').value = treeState.value;

  document.getElementById('opSelect').addEventListener('change', onOpChange);
  onOpChange();

  document.getElementById('buildBtn').addEventListener('click', buildFromInput);
  document.getElementById('randomBuildBtn').addEventListener('click', randomBuild);
  document.getElementById('runBtn').addEventListener('click', runOperation);
  document.getElementById('prevBtn').addEventListener('click', stepPrev);
  document.getElementById('playBtn').addEventListener('click', playPause);
  document.getElementById('nextBtn').addEventListener('click', stepNext);
  document.getElementById('resetBtn').addEventListener('click', resetPlayback);
  document.getElementById('stepSlider').addEventListener('input', (e) => seek(e.target.value));

  buildFromInput();
});

function onOpChange() {
  treeState.operation = document.getElementById('opSelect').value;
  const needsValue = treeState.operation === 'insert' || treeState.operation === 'search';
  document.getElementById('valueField').style.display = needsValue ? 'flex' : 'none';
}

/* ---------- Tree helpers ---------- */
function cloneTree(node) {
  if (!node) return null;
  return { value: node.value, left: cloneTree(node.left), right: cloneTree(node.right) };
}
function insertRaw(root, value) {
  if (!root) return { value, left: null, right: null };
  let cur = root;
  while (true) {
    if (value === cur.value) return root;
    if (value < cur.value) {
      if (!cur.left) { cur.left = { value, left: null, right: null }; return root; }
      cur = cur.left;
    } else {
      if (!cur.right) { cur.right = { value, left: null, right: null }; return root; }
      cur = cur.right;
    }
  }
}
function treeHeight(node) {
  if (!node) return 0;
  return 1 + Math.max(treeHeight(node.left), treeHeight(node.right));
}
function treeCount(node) {
  if (!node) return 0;
  return 1 + treeCount(node.left) + treeCount(node.right);
}
function computeLayout(root) {
  const positions = {};
  let counter = 0;
  function assign(node, depth) {
    if (!node) return;
    assign(node.left, depth + 1);
    positions[node.value] = { x: counter * 64 + 50, y: depth * 78 + 40 };
    counter++;
    assign(node.right, depth + 1);
  }
  assign(root, 0);
  return { positions, width: Math.max(counter * 64 + 40, 300) };
}
function collectEdges(node, edges) {
  edges = edges || [];
  if (!node) return edges;
  if (node.left) edges.push([node.value, node.left.value]);
  if (node.right) edges.push([node.value, node.right.value]);
  collectEdges(node.left, edges);
  collectEdges(node.right, edges);
  return edges;
}

/* ---------- Build ---------- */
function buildFromInput() {
  const arr = DsaUtil.parseArrayInput(document.getElementById('buildInput').value, { max: 20 });
  let root = null;
  arr.forEach((v) => { root = insertRaw(root, v); });
  treeState.root = root;
  treeState.steps = [treeSnap(root, { message: 'Tree built from [' + arr.join(', ') + ']. Choose an operation below.' })];
  treeState.stepIndex = 0;
  document.getElementById('stepSlider').max = 0;
  paintStep();
}
function randomBuild() {
  const arr = DsaUtil.randomArray(7, 99);
  document.getElementById('buildInput').value = arr.join(', ');
  buildFromInput();
}

/* ---------- Step generators ---------- */
function treeSnap(root, opts) {
  return Object.assign({ root, current: null, newValue: null, foundValue: null, orderSoFar: null, message: '' }, opts);
}

function stepsInsert(root, value) {
  const steps = [];
  if (!root) {
    const newRoot = { value, left: null, right: null };
    steps.push(treeSnap(root, { message: 'The tree is empty.' }));
    steps.push(treeSnap(newRoot, { newValue: value, message: value + ' becomes the root.' }));
    return { steps, newRoot };
  }
  let cur = root;
  steps.push(treeSnap(root, { message: 'Starting at the root, looking for where ' + value + ' belongs.' }));
  while (true) {
    steps.push(treeSnap(root, { current: cur.value, message: 'Comparing ' + value + ' with node ' + cur.value + '.' }));
    if (value === cur.value) {
      steps.push(treeSnap(root, { current: cur.value, message: value + ' already exists in the tree — no duplicate inserted.' }));
      return { steps, newRoot: root };
    } else if (value < cur.value) {
      if (!cur.left) {
        const newRoot = cloneTree(root);
        insertRaw(newRoot, value);
        steps.push(treeSnap(newRoot, { current: cur.value, newValue: value, message: value + ' < ' + cur.value + ' — empty spot on the left, inserting here.' }));
        return { steps, newRoot };
      }
      steps.push(treeSnap(root, { current: cur.value, message: value + ' < ' + cur.value + ', going left.' }));
      cur = cur.left;
    } else {
      if (!cur.right) {
        const newRoot = cloneTree(root);
        insertRaw(newRoot, value);
        steps.push(treeSnap(newRoot, { current: cur.value, newValue: value, message: value + ' > ' + cur.value + ' — empty spot on the right, inserting here.' }));
        return { steps, newRoot };
      }
      steps.push(treeSnap(root, { current: cur.value, message: value + ' > ' + cur.value + ', going right.' }));
      cur = cur.right;
    }
  }
}

function stepsSearch(root, value) {
  const steps = [];
  if (!root) { steps.push(treeSnap(root, { message: 'The tree is empty.' })); return steps; }
  let cur = root;
  while (cur) {
    steps.push(treeSnap(root, { current: cur.value, message: 'Comparing ' + value + ' with node ' + cur.value + '.' }));
    if (value === cur.value) {
      steps.push(treeSnap(root, { foundValue: cur.value, message: 'Found ' + value + '!' }));
      return steps;
    } else if (value < cur.value) {
      steps.push(treeSnap(root, { current: cur.value, message: value + ' < ' + cur.value + ', going left.' }));
      cur = cur.left;
    } else {
      steps.push(treeSnap(root, { current: cur.value, message: value + ' > ' + cur.value + ', going right.' }));
      cur = cur.right;
    }
  }
  steps.push(treeSnap(root, { message: value + ' was not found in the tree.' }));
  return steps;
}

function traversalOrder(root, type) {
  const order = [];
  function rec(node) {
    if (!node) return;
    if (type === 'preorder') order.push(node.value);
    rec(node.left);
    if (type === 'inorder') order.push(node.value);
    rec(node.right);
    if (type === 'postorder') order.push(node.value);
  }
  rec(root);
  return order;
}
function stepsTraversal(root, type) {
  const order = traversalOrder(root, type);
  const steps = [];
  const label = type[0].toUpperCase() + type.slice(1);
  steps.push(treeSnap(root, { orderSoFar: [], message: 'Starting ' + label + ' traversal.' }));
  for (let i = 0; i < order.length; i++) {
    steps.push(treeSnap(root, { current: order[i], orderSoFar: order.slice(0, i + 1), message: 'Visiting node ' + order[i] + '.' }));
  }
  steps.push(treeSnap(root, { orderSoFar: order, message: label + ' traversal complete: ' + order.join(' → ') }));
  return steps;
}

function runOperation() {
  treeState.operation = document.getElementById('opSelect').value;
  treeState.value = parseInt(document.getElementById('valueInput').value, 10);
  let steps;
  if (treeState.operation === 'insert') {
    const result = stepsInsert(treeState.root, treeState.value);
    steps = result.steps;
    treeState.root = result.newRoot;
  } else if (treeState.operation === 'search') {
    steps = stepsSearch(treeState.root, treeState.value);
  } else {
    steps = stepsTraversal(treeState.root, treeState.operation);
  }
  treeState.steps = steps;
  treeState.stepIndex = 0;
  document.getElementById('stepSlider').max = steps.length - 1;
  paintStep();
}

/* ---------- Rendering ---------- */
function nodeColor(value, step) {
  if (step.current === value || step.newValue === value || step.foundValue === value) return 'var(--pink)';
  if (step.orderSoFar && step.orderSoFar.includes(value)) return 'var(--green)';
  return 'var(--purple-dim)';
}

function paintStep() {
  const step = treeState.steps[treeState.stepIndex];
  if (!step) return;
  const root = step.root;

  if (!root) {
    document.getElementById('treeSvg').innerHTML = '';
    document.getElementById('treeSvgBox').querySelector('.empty-msg')?.remove();
    const box = document.getElementById('treeSvgBox');
    const msg = document.createElement('div');
    msg.className = 'loading-line empty-msg';
    msg.textContent = 'The tree is empty.';
    box.appendChild(msg);
  } else {
    document.getElementById('treeSvgBox').querySelector('.empty-msg')?.remove();
    const { positions, width } = computeLayout(root);
    const height = (treeHeight(root)) * 78 + 60;
    const edges = collectEdges(root);
    const edgesSvg = edges.map(([a, b]) => {
      const pa = positions[a], pb = positions[b];
      return '<line x1="' + pa.x + '" y1="' + pa.y + '" x2="' + pb.x + '" y2="' + pb.y + '" stroke="var(--border)" stroke-width="2"/>';
    }).join('');
    const nodesSvg = Object.keys(positions).map((valStr) => {
      const value = parseInt(valStr, 10);
      const { x, y } = positions[valStr];
      const fill = nodeColor(value, step);
      const textColor = fill === 'var(--purple-dim)' ? 'var(--text-dim)' : '#171226';
      return '<g><circle cx="' + x + '" cy="' + y + '" r="20" fill="' + fill + '" stroke="var(--border)" stroke-width="1.5"/>' +
        '<text x="' + x + '" y="' + (y + 5) + '" text-anchor="middle" font-family="JetBrains Mono, monospace" font-weight="700" font-size="13" fill="' + textColor + '">' + value + '</text></g>';
    }).join('');
    const svg = document.getElementById('treeSvg');
    svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
    svg.style.height = Math.max(height, 220) + 'px';
    svg.innerHTML = edgesSvg + nodesSvg;
  }

  document.getElementById('orderLine').innerHTML = step.orderSoFar
    ? step.orderSoFar.map((v) => '<span class="tree-order-chip visited">' + v + '</span>').join('')
    : '';

  document.getElementById('explainText').textContent = step.message;
  document.getElementById('statNodes').textContent = treeCount(root);
  document.getElementById('statHeight').textContent = treeHeight(root);
  document.getElementById('statStep').textContent = treeState.stepIndex + ' / ' + (treeState.steps.length - 1);
  document.getElementById('stepLabel').textContent = 'Step ' + treeState.stepIndex + ' of ' + (treeState.steps.length - 1);
  document.getElementById('stepSlider').value = treeState.stepIndex;
  document.getElementById('playBtn').textContent = treeState.playing ? '⏸' : '▶';
}

function stepNext() { if (treeState.stepIndex < treeState.steps.length - 1) { treeState.stepIndex++; paintStep(); } else pause(); }
function stepPrev() { if (treeState.stepIndex > 0) { treeState.stepIndex--; paintStep(); } }
function seek(v) { treeState.stepIndex = parseInt(v, 10); paintStep(); }
function resetPlayback() { pause(); treeState.stepIndex = 0; paintStep(); }
function playPause() { treeState.playing ? pause() : play(); }
function play() {
  if (treeState.stepIndex >= treeState.steps.length - 1) treeState.stepIndex = 0;
  treeState.playing = true;
  document.getElementById('playBtn').textContent = '⏸';
  treeState.timer = setInterval(() => {
    if (treeState.stepIndex >= treeState.steps.length - 1) { pause(); return; }
    stepNext();
  }, 700);
}
function pause() {
  treeState.playing = false;
  clearInterval(treeState.timer);
  const btn = document.getElementById('playBtn');
  if (btn) btn.textContent = '▶';
}
