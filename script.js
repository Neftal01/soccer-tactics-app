// BUG: Player positions not calculated correctly
const formations = {
    '433': { defenders: 4, midfielders: 3, forwards: 3 },
    '442': { defenders: 4, midfielders: 4, forwards: 2 },
    '352': { defenders: 3, midfielders: 5, forwards: 2 },
    '541': { defenders: 5, midfielders: 4, forwards: 1 },
    '523': { defenders: 5, midfielders: 2, forwards: 3 }
};

let currentFormation = null;
let players = [];
let fieldWidth = 600;
let fieldHeight = 800;

function loadFormation() {
    const formationSelect = document.getElementById('formation');
    const selectedFormation = formationSelect.value;
    
    if (!selectedFormation) return;
    
    currentFormation = formations[selectedFormation];
    generatePlayers();
    drawField();
    // BUG: Players not positioned on the field
}

function generatePlayers() {
    players = [];
    let playerId = 1;
    
    // Goalkeeper
    players.push({ id: playerId++, name: `GK ${playerId}`, position: 'GK', x: 300, y: 50 });
    
    // Defenders
    for (let i = 0; i < currentFormation.defenders; i++) {
        players.push({ id: playerId++, name: `DEF ${i + 1}`, position: 'DEF', x: 0, y: 0 });
    }
    
    // Midfielders
    for (let i = 0; i < currentFormation.midfielders; i++) {
        players.push({ id: playerId++, name: `MID ${i + 1}`, position: 'MID', x: 0, y: 0 });
    }
    
    // Forwards
    for (let i = 0; i < currentFormation.forwards; i++) {
        players.push({ id: playerId++, name: `FWD ${i + 1}`, position: 'FWD', x: 0, y: 0 });
    }
    
    displayPlayers();
}

function displayPlayers() {
    const playersList = document.getElementById('playersList');
    playersList.innerHTML = players.map(p => 
        `<div class="player-item">${p.name} - ${p.position}</div>`
    ).join('');
}

function drawField() {
    const svg = document.getElementById('field');
    svg.innerHTML = '';
    
    // Draw field background
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('width', fieldWidth);
    rect.setAttribute('height', fieldHeight);
    rect.setAttribute('fill', '#2d5016');
    svg.appendChild(rect);
    
    // Draw field lines
    drawLine(svg, 0, fieldHeight / 2, fieldWidth, fieldHeight / 2, 'white'); // Mid line
    drawLine(svg, fieldWidth / 2, 0, fieldWidth / 2, fieldHeight, 'white'); // Center line
    drawCircle(svg, fieldWidth / 2, fieldHeight / 2, 50, 'white', false); // Center circle
    
    // BUG: Player positions not rendered on the field
    drawPlayers(svg);
}

function drawLine(svg, x1, y1, x2, y2, color) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', color);
    line.setAttribute('stroke-width', 2);
    svg.appendChild(line);
}

function drawCircle(svg, cx, cy, r, color, fill = false) {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', r);
    circle.setAttribute('stroke', color);
    circle.setAttribute('stroke-width', 2);
    circle.setAttribute('fill', fill ? color : 'none');
    svg.appendChild(circle);
}

function drawPlayers(svg) {
    // BUG: Missing implementation to position players correctly
    players.forEach(player => {
        drawCircle(svg, player.x, player.y, 15, '#FF6B6B', true);
        drawText(svg, player.x, player.y, player.id.toString(), 'white');
    });
}

function drawText(svg, x, y, text, color) {
    const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textElement.setAttribute('x', x);
    textElement.setAttribute('y', y);
    textElement.setAttribute('text-anchor', 'middle');
    textElement.setAttribute('dominant-baseline', 'middle');
    textElement.setAttribute('fill', color);
    textElement.setAttribute('font-size', '14');
    textElement.setAttribute('font-weight', 'bold');
    textElement.textContent = text;
    svg.appendChild(textElement);
}

function analyzeFormation() {
    if (!currentFormation) {
        alert('Please select a formation first');
        return;
    }
    
    // BUG: Analysis logic incomplete and doesn't provide meaningful insights
    const analysisResults = document.getElementById('analysisResults');
    const stats = {
        totalPlayers: players.length,
        defensive: currentFormation.defenders,
        midfield: currentFormation.midfielders,
        attacking: currentFormation.forwards
    };
    
    analysisResults.innerHTML = `
        <h3>Formation Analysis: ${Object.keys(formations).find(k => formations[k] === currentFormation)}</h3>
        <p>Total Players: ${stats.totalPlayers}</p>
        <p>Defensive Line: ${stats.defensive}</p>
        <p>Midfield: ${stats.midfield}</p>
        <p>Attack: ${stats.attacking}</p>
    `;
}

function exportTactics() {
    // BUG: Export functionality not implemented
    alert('Export feature coming soon!');
}
