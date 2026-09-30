/* =========================================================
   DSA LAB — graphs.js
   Drives pages/graphs.html. Fetches the sample graph's node
   positions + adjacency from GET /api/graph, then the
   traversal trace from POST /api/graph/{algorithm}.
   ========================================================= */

const GRAPH_ALGOS = {
  bfs: { name: 'Breadth-First Search', struct: 'Queue' },
  dfs: { name: 'Depth-First Search', struct: 'Stack' },
};

const graphState = {
  algo: 'bfs',
  start: 'A',
  nodes: {},
  edges: [],
  steps: [],
  stepIndex: 0,
  playing: false,
  timer: null,
};

document.addEventListener('DOMContentLoaded', async () => {
  markActiveNav('graphs');
  const params = new URLSearchParams(window.location.search);
  graphState.algo = params.get('algo') || 'bfs';
  if (!GRAPH_ALGOS[graphState.algo]) graphState.algo = 'bfs';

  document.getElementById('algoSelect').value = graphState.algo;
  highlightSidebar(graphState.algo);

  document.getElementById('algoSelect').addEventListener('change', (e) => {
    window.location.search = '?algo=' + e.target.value;
  });
  document.getElementById('prevBtn').addEventListener('click', stepPrev);
  document.getElementById('playBtn').addEventListener('click', playPause);
  document.getElementById('nextBtn').addEventListener('click', stepNext);
  document.getElementById('resetBtn').addEventListener('click', resetPlayback);
  document.getElementById('stepSlider').addEventListener('input', (e) => seek(e.target.value));

  await loadMeta();
  await loadGraphAndRun();
});

function highlightSidebar(algo) {
  document.querySelectorAll('.sidebar a').forEach((a) => a.classList.toggle('active', a.dataset.algo === algo));
}

async function loadMeta() {
  let meta = null;
  try { meta = await DsaApi.getMeta(graphState.algo); } catch (err) { meta = null; }
  document.getElementById('metaName').textContent = meta ? meta.name : GRAPH_ALGOS[graphState.algo].name;
  document.getElementById('metaTime').textContent = meta ? meta.time : '—';
  document.getElementById('metaSpace').textContent = meta ? meta.space : '—';
  document.getElementById('structLabel').textContent = GRAPH_ALGOS[graphState.algo].struct;
  document.getElementById('structLabel2').textContent = GRAPH_ALGOS[graphState.algo].struct;
  document.getElementById('vizTitle').textContent = '◈ Graph Visualizer — ' + (meta ? meta.name : GRAPH_ALGOS[graphState.algo].name);
}

async function loadGraphAndRun() {
  DsaUtil.hideBanner('errorBanner');
  document.getElementById('graphSvg').innerHTML = '';
  document.getElementById('graphExplainText').textContent = 'Loading graph…';
  setControlsEnabled(false);
  try {
    const structure = await DsaApi.getGraph();
    graphState.nodes = structure.nodes;
    graphState.edges = [];
    Object.keys(structure.adjacency).forEach((from) => {
      structure.adjacency[from].forEach((to) => {
        const already = graphState.edges.some((e) => (e[0] === to && e[1] === from));
        if (!already) graphState.edges.push([from, to]);
      });
    });

    const result = await DsaApi.traverseGraph(graphState.algo, graphState.start);
    graphState.steps = result.steps;
    graphState.stepIndex = 0;
    document.getElementById('stepSlider').max = graphState.steps.length - 1;
    setControlsEnabled(true);
    paintStep();
  } catch (err) {
    DsaUtil.showBanner('errorBanner', err.message);
    document.getElementById('graphExplainText').textContent = 'Nothing to show — fix the connection above and try again.';
  }
}

function setControlsEnabled(enabled) {
  ['prevBtn', 'playBtn', 'nextBtn', 'resetBtn', 'stepSlider'].forEach((id) => { document.getElementById(id).disabled = !enabled; });
}

function nodeColor(id, step) {
  if (step.current === id) return 'var(--pink)';
  const visited = step.visited || [];
  if (visited.includes(id)) return 'var(--green)';
  const struct = step.queue || step.stack || [];
  if (struct.includes(id)) return 'var(--blue)';
  return 'var(--purple-dim)';
}

function paintStep() {
  const step = graphState.steps[graphState.stepIndex];
  if (!step) return;
  const nodes = graphState.nodes;

  const edgesSvg = graphState.edges.map(([a, b]) => {
    if (!nodes[a] || !nodes[b]) return '';
    return '<line x1="' + nodes[a].x + '" y1="' + nodes[a].y + '" x2="' + nodes[b].x + '" y2="' + nodes[b].y + '" stroke="var(--border)" stroke-width="2"/>';
  }).join('');

  const nodesSvg = Object.keys(nodes).map((id) => {
    const { x, y } = nodes[id];
    const fill = nodeColor(id, step);
    const textColor = fill === 'var(--purple-dim)' ? 'var(--text-dim)' : '#171226';
    return '<g><circle cx="' + x + '" cy="' + y + '" r="20" fill="' + fill + '" stroke="var(--border)" stroke-width="1.5"/>' +
      '<text x="' + x + '" y="' + (y + 5) + '" text-anchor="middle" font-family="JetBrains Mono, monospace" font-weight="700" font-size="15" fill="' + textColor + '">' + id + '</text></g>';
  }).join('');

  const xs = Object.values(nodes).map((p) => p.x);
  const ys = Object.values(nodes).map((p) => p.y);
  const maxX = xs.length ? Math.max(...xs) + 40 : 430;
  const maxY = ys.length ? Math.max(...ys) + 40 : 340;
  document.getElementById('graphSvg').setAttribute('viewBox', '0 0 ' + maxX + ' ' + maxY);
  document.getElementById('graphSvg').innerHTML = edgesSvg + nodesSvg;

  const struct = step.queue || step.stack || [];
  document.getElementById('dsItems').innerHTML = struct.length
    ? struct.map((n) => '<div class="ds-chip">' + n + '</div>').join('')
    : '<span style="color:var(--text-faint);font-size:13px;">empty</span>';

  const visited = step.visited || [];
  document.getElementById('visitedItems').innerHTML = visited.length
    ? visited.map((n) => '<div class="visited-chip">' + n + '</div>').join('')
    : '<span style="color:var(--text-faint);font-size:13px;">none yet</span>';

  document.getElementById('graphExplainText').textContent = step.message || '';
  document.getElementById('graphStatStep').textContent = graphState.stepIndex + ' / ' + (graphState.steps.length - 1);
  document.getElementById('graphStepLabel').textContent = 'Step ' + graphState.stepIndex + ' of ' + (graphState.steps.length - 1);
  document.getElementById('stepSlider').value = graphState.stepIndex;
  document.getElementById('playBtn').textContent = graphState.playing ? '⏸' : '▶';
}

function stepNext() {
  if (graphState.stepIndex < graphState.steps.length - 1) { graphState.stepIndex++; paintStep(); }
  else pause();
}
function stepPrev() { if (graphState.stepIndex > 0) { graphState.stepIndex--; paintStep(); } }
function seek(v) { graphState.stepIndex = parseInt(v, 10); paintStep(); }
function resetPlayback() { pause(); graphState.stepIndex = 0; paintStep(); }

function playPause() { graphState.playing ? pause() : play(); }
function play() {
  if (graphState.stepIndex >= graphState.steps.length - 1) graphState.stepIndex = 0;
  graphState.playing = true;
  document.getElementById('playBtn').textContent = '⏸';
  graphState.timer = setInterval(() => {
    if (graphState.stepIndex >= graphState.steps.length - 1) { pause(); return; }
    stepNext();
  }, 750);
}
function pause() {
  graphState.playing = false;
  clearInterval(graphState.timer);
  const btn = document.getElementById('playBtn');
  if (btn) btn.textContent = '▶';
}
