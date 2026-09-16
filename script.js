const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');
toggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('#site-nav a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  toggle?.setAttribute('aria-expanded', 'false');
}));

// V2.7 — living risk network over the Helene landscape.
// Nodes drift independently while every connecting line is redrawn each frame.
(() => {
  const svg = document.querySelector('.landslide-analysis');
  if (!svg) return;

  const circles = [...svg.querySelectorAll('.risk-nodes circle')];
  const lineGroup = svg.querySelector('.risk-lines');
  if (!circles.length || !lineGroup) return;

  const anchors = circles.map((circle, i) => ({
    x: Number(circle.getAttribute('cx')),
    y: Number(circle.getAttribute('cy')),
    phaseX: i * 1.37,
    phaseY: i * 2.11,
    speedX: 0.00042 + (i % 5) * 0.000035,
    speedY: 0.00036 + ((i + 2) % 5) * 0.000032,
    ampX: 1.05 + (i % 4) * 0.22,
    ampY: 0.85 + ((i + 1) % 4) * 0.20
  }));

  // Main risk corridor + branches toward homes, road, and surrounding systems.
  // Every node participates in at least one connection.
  const edges = [
    [0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],
    [2,10],[10,3],[10,11],[11,4],[11,5],
    [5,12],[12,6],[12,7],
    [7,13],[13,8],[13,14],[14,9],
    [8,15],[15,9],[15,7]
  ];

  const ns = 'http://www.w3.org/2000/svg';
  lineGroup.replaceChildren();
  const lines = edges.map(() => {
    const line = document.createElementNS(ns, 'line');
    lineGroup.appendChild(line);
    return line;
  });

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const positions = anchors.map(a => ({ x: a.x, y: a.y }));

  function draw(time = 0) {
    anchors.forEach((a, i) => {
      const x = reduced ? a.x : a.x
        + Math.sin(time * a.speedX + a.phaseX) * a.ampX
        + Math.sin(time * a.speedX * 0.47 + a.phaseY) * 0.36;
      const y = reduced ? a.y : a.y
        + Math.cos(time * a.speedY + a.phaseY) * a.ampY
        + Math.sin(time * a.speedY * 0.61 + a.phaseX) * 0.30;

      positions[i].x = x;
      positions[i].y = y;
      circles[i].setAttribute('cx', x.toFixed(3));
      circles[i].setAttribute('cy', y.toFixed(3));
    });

    edges.forEach(([from, to], i) => {
      const p = positions[from];
      const q = positions[to];
      const line = lines[i];
      line.setAttribute('x1', p.x.toFixed(3));
      line.setAttribute('y1', p.y.toFixed(3));
      line.setAttribute('x2', q.x.toFixed(3));
      line.setAttribute('y2', q.y.toFixed(3));
    });

    if (!reduced) requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
})();
