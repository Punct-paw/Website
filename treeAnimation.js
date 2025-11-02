const canvas = document.getElementById('tree-canvas');
const ctx = canvas.getContext('2d');

// --- Canvas Setup ---
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

// Radii for outer and inner layers
const outerRadius = 300;
const innerRadius = 170;

let rotation = 0;
let zoom = 1; // zoom factor (1 = normal size)

// === Outer Layer: Main Domains ===
const outerNodes = [
  'Structural Engineering',
  'Mathematics',
  'Artificial Intelligence',
  'Programming',
  'Bridge Design',
  'Concrete Technology',
  'Sustainability',
  'Automation',
  'Design Optimization',
  'Project Management'
].map((label, i) => ({
  label,
  angle: (2 * Math.PI / 10) * i
}));

// === Inner Layer: Subtopics ===
const innerNodes = [
  'Finite Element Analysis',
  'Machine Learning',
  'Deep Learning',
  'Structural Dynamics',
  'Earthquake Engineering',
  'Steel Structures',
  'Reinforced Concrete',
  'Computational Mechanics',
  'Data Analysis',
  'Python & MATLAB',
  'BIM & Digital Twins',
  'Smart Materials',
  'Sustainable Design',
  'Optimization Algorithms',
  'AI for Structural Health'
].map((label, i) => ({
  label,
  angle: (2 * Math.PI / 15) * i
}));

// Cross-connections between layers
const crossConnections = [
  [0, 4], [0, 6],
  [1, 8], [1, 13],
  [2, 1], [2, 2], [2, 14],
  [3, 9],
  [4, 0], [4, 3],
  [5, 6],
  [6, 12],
  [7, 13],
  [8, 10],
  [9, 8], [9, 11]
];

// Interconnect outer and inner nodes (circular)
const outerConnections = outerNodes.map((_, i) => [i, (i + 1) % outerNodes.length]);
const innerConnections = innerNodes.map((_, i) => [i, (i + 1) % innerNodes.length]);

// === Draw a Node ===
function drawNode(x, y, label, fillColor, borderColor) {
  const nodeRadius = 20;
  ctx.beginPath();
  ctx.arc(x, y, nodeRadius, 0, 2 * Math.PI);
  ctx.fillStyle = fillColor;
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = borderColor;
  ctx.stroke();

  // Text inside the circle
  ctx.fillStyle = 'black';
  ctx.font = `${9 / zoom}px Arial`; // smaller, responsive text
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Split long labels into multiple lines if needed
  const words = label.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const testLine = line + word + ' ';
    if (ctx.measureText(testLine).width > nodeRadius * 2.5) {
      lines.push(line.trim());
      line = word + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line.trim());

  const lineHeight = 10 / zoom;
  const startY = y - ((lines.length - 1) * lineHeight) / 2;

  lines.forEach((text, i) => {
    ctx.fillText(text, x, startY + i * lineHeight);
  });
}

// === Draw a Connection Line ===
function drawLine(x1, y1, x2, y2, color = '#003366', width = 1.2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = width / zoom; // adjust line width with zoom
  ctx.stroke();
}

// === Animation Loop ===
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();

  // Apply zoom centered at canvas center
  ctx.translate(centerX, centerY);
  ctx.scale(zoom, zoom);
  ctx.translate(-centerX, -centerY);

  // Compute node positions
  const outerPositions = outerNodes.map(node => {
    const angle = node.angle + rotation * 0.5;
    return {
      x: centerX + outerRadius * Math.cos(angle),
      y: centerY + outerRadius * Math.sin(angle),
      label: node.label
    };
  });

  const innerPositions = innerNodes.map(node => {
    const angle = node.angle - rotation;
    return {
      x: centerX + innerRadius * Math.cos(angle),
      y: centerY + innerRadius * Math.sin(angle),
      label: node.label
    };
  });

  // Draw layer connections
  outerConnections.forEach(([a, b]) => {
    const o1 = outerPositions[a];
    const o2 = outerPositions[b];
    drawLine(o1.x, o1.y, o2.x, o2.y, '#0b3d91', 1);
  });

  innerConnections.forEach(([a, b]) => {
    const i1 = innerPositions[a];
    const i2 = innerPositions[b];
    drawLine(i1.x, i1.y, i2.x, i2.y, '#1a5fb4', 0.8);
  });

  crossConnections.forEach(([outIdx, inIdx]) => {
    const o = outerPositions[outIdx];
    const i = innerPositions[inIdx];
    drawLine(o.x, o.y, i.x, i.y, '#1177cc', 0.7);
  });

  // Draw nodes
  innerPositions.forEach(pos => drawNode(pos.x, pos.y, pos.label, '#9fd3f0', '#02577a'));
  outerPositions.forEach(pos => drawNode(pos.x, pos.y, pos.label, '#5aa9e6', '#003366'));

  ctx.restore();

  rotation += 0.007;
  requestAnimationFrame(animate);
}

// === Zoom Controls (Mouse Wheel) ===
canvas.addEventListener('wheel', e => {
  e.preventDefault();
  const zoomAmount = e.deltaY * -0.001;
  zoom += zoomAmount;
  zoom = Math.min(Math.max(zoom, 0.4), 2.5); // clamp zoom between 0.4x and 2.5x
});

animate();
