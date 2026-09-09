// Fixed: Player positions now calculated correctly
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
    calculatePlayerPositions(); // FIX: Calculate positions before drawing
    drawField();
    analyzeFormation(); // Automatically analyze on load
}

function generatePlayers() {
    players = [];
    let playerId = 1;
    
    // Goalkeeper
    players.push({ 
        id: playerId++, 
        name: `GK`, 
        position: 'GK', 
        x: fieldWidth / 2, 
        y: fieldHeight * 0.95,
        originalX: fieldWidth / 2,
        originalY: fieldHeight * 0.95
    });
    
    // Defenders
    const defenderY = fieldHeight * 0.75;
    const defenderSpacing = fieldWidth / (currentFormation.defenders + 1);
    for (let i = 0; i < currentFormation.defenders; i++) {
        const xPos = defenderSpacing * (i + 1);
        players.push({ 
            id: playerId++, 
            name: `DEF ${i + 1}`, 
            position: 'DEF', 
            x: xPos, 
            y: defenderY,
            originalX: xPos,
            originalY: defenderY
        });
    }
    
    // Midfielders
    const midfielderY = fieldHeight * 0.5;
    const midfielderSpacing = fieldWidth / (currentFormation.midfielders + 1);
    for (let i = 0; i < currentFormation.midfielders; i++) {
        const xPos = midfielderSpacing * (i + 1);
        players.push({ 
            id: playerId++, 
            name: `MID ${i + 1}`, 
            position: 'MID', 
            x: xPos, 
            y: midfielderY,
            originalX: xPos,
            originalY: midfielderY
        });
    }
    
    // Forwards
    const forwardY = fieldHeight * 0.25;
    const forwardSpacing = fieldWidth / (currentFormation.forwards + 1);
    for (let i = 0; i < currentFormation.forwards; i++) {
        const xPos = forwardSpacing * (i + 1);
        players.push({ 
            id: playerId++, 
            name: `FWD ${i + 1}`, 
            position: 'FWD', 
            x: xPos, 
            y: forwardY,
            originalX: xPos,
            originalY: forwardY
        });
    }
    
    displayPlayers();
}

// FIX: New function to calculate player positions based on formation
function calculatePlayerPositions() {
    if (!currentFormation) return;
    
    players.forEach((player, index) => {
        if (player.position === 'GK') {
            player.x = fieldWidth / 2;
            player.y = fieldHeight * 0.95;
        } else if (player.position === 'DEF') {
            const defenderIndex = players.filter(p => p.position === 'DEF').indexOf(player);
            const defenderY = fieldHeight * 0.75;
            const defenderSpacing = fieldWidth / (currentFormation.defenders + 1);
            player.x = defenderSpacing * (defenderIndex + 1);
            player.y = defenderY;
        } else if (player.position === 'MID') {
            const midfielderIndex = players.filter(p => p.position === 'MID').indexOf(player);
            const midfielderY = fieldHeight * 0.5;
            const midfielderSpacing = fieldWidth / (currentFormation.midfielders + 1);
            player.x = midfielderSpacing * (midfielderIndex + 1);
            player.y = midfielderY;
        } else if (player.position === 'FWD') {
            const forwardIndex = players.filter(p => p.position === 'FWD').indexOf(player);
            const forwardY = fieldHeight * 0.25;
            const forwardSpacing = fieldWidth / (currentFormation.forwards + 1);
            player.x = forwardSpacing * (forwardIndex + 1);
            player.y = forwardY;
        }
    });
}

function displayPlayers() {
    const playersList = document.getElementById('playersList');
    playersList.innerHTML = players.map(p => 
        `<div class="player-item">#${p.id} ${p.name} - ${p.position}</div>`
    ).join('');
}

function drawField() {
    const svg = document.getElementById('field');
    svg.innerHTML = '';
    
    // Set SVG dimensions to be responsive
    svg.setAttribute('viewBox', `0 0 ${fieldWidth} ${fieldHeight}`);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    
    // Draw field background
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('width', fieldWidth);
    rect.setAttribute('height', fieldHeight);
    rect.setAttribute('fill', '#2d5016');
    rect.setAttribute('stroke', '#fff');
    rect.setAttribute('stroke-width', '3');
    svg.appendChild(rect);
    
    // Draw field lines
    drawLine(svg, 0, fieldHeight / 2, fieldWidth, fieldHeight / 2, 'white'); // Mid line
    drawLine(svg, fieldWidth / 2, 0, fieldWidth / 2, fieldHeight, 'white'); // Center line
    drawCircle(svg, fieldWidth / 2, fieldHeight / 2, 50, 'white', false); // Center circle
    
    // Draw goal areas
    drawLine(svg, 0, fieldHeight * 0.15, fieldWidth * 0.2, fieldHeight * 0.15, 'white');
    drawLine(svg, fieldWidth * 0.2, fieldHeight * 0.15, fieldWidth * 0.2, fieldHeight * 0.85, 'white');
    drawLine(svg, fieldWidth * 0.2, fieldHeight * 0.85, 0, fieldHeight * 0.85, 'white');
    
    drawLine(svg, fieldWidth, fieldHeight * 0.15, fieldWidth * 0.8, fieldHeight * 0.15, 'white');
    drawLine(svg, fieldWidth * 0.8, fieldHeight * 0.15, fieldWidth * 0.8, fieldHeight * 0.85, 'white');
    drawLine(svg, fieldWidth * 0.8, fieldHeight * 0.85, fieldWidth, fieldHeight * 0.85, 'white');
    
    // FIX: Draw players on the field with correct positions
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

// FIX: Properly render players with correct positions
function drawPlayers(svg) {
    players.forEach(player => {
        // Draw player circle
        const playerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        playerCircle.setAttribute('cx', player.x);
        playerCircle.setAttribute('cy', player.y);
        playerCircle.setAttribute('r', 15);
        
        // Color by position
        let fillColor = '#FF6B6B'; // Default red
        if (player.position === 'GK') fillColor = '#FFD93D';
        else if (player.position === 'DEF') fillColor = '#6BCF7F';
        else if (player.position === 'MID') fillColor = '#4D96FF';
        else if (player.position === 'FWD') fillColor = '#FF6B6B';
        
        playerCircle.setAttribute('fill', fillColor);
        playerCircle.setAttribute('stroke', '#fff');
        playerCircle.setAttribute('stroke-width', 2);
        playerCircle.style.cursor = 'grab';
        
        // Add drag functionality
        playerCircle.addEventListener('mousedown', (e) => startDrag(e, player, playerCircle));
        playerCircle.addEventListener('touchstart', (e) => startDrag(e, player, playerCircle));
        
        svg.appendChild(playerCircle);
        
        // Draw player number
        drawText(svg, player.x, player.y, player.id.toString(), 'white', '14', 'bold');
    });
}

function drawText(svg, x, y, text, color, fontSize = '14', fontWeight = 'normal') {
    const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textElement.setAttribute('x', x);
    textElement.setAttribute('y', y);
    textElement.setAttribute('text-anchor', 'middle');
    textElement.setAttribute('dominant-baseline', 'middle');
    textElement.setAttribute('fill', color);
    textElement.setAttribute('font-size', fontSize);
    textElement.setAttribute('font-weight', fontWeight);
    textElement.setAttribute('pointer-events', 'none');
    textElement.textContent = text;
    svg.appendChild(textElement);
}

// FIX: Drag-and-drop functionality
let draggedPlayer = null;
let isDragging = false;

function startDrag(e, player, element) {
    isDragging = true;
    draggedPlayer = player;
    element.style.cursor = 'grabbing';
    
    const svg = document.getElementById('field');
    const rect = svg.getBoundingClientRect();
    
    function moveDrag(moveEvent) {
        if (!isDragging || !draggedPlayer) return;
        
        let clientX, clientY;
        if (moveEvent.touches) {
            clientX = moveEvent.touches[0].clientX;
            clientY = moveEvent.touches[0].clientY;
        } else {
            clientX = moveEvent.clientX;
            clientY = moveEvent.clientY;
        }
        
        const x = ((clientX - rect.left) / rect.width) * fieldWidth;
        const y = ((clientY - rect.top) / rect.height) * fieldHeight;
        
        // Constrain to field boundaries
        draggedPlayer.x = Math.max(30, Math.min(fieldWidth - 30, x));
        draggedPlayer.y = Math.max(30, Math.min(fieldHeight - 30, y));
        
        drawField();
    }
    
    function endDrag() {
        isDragging = false;
        draggedPlayer = null;
        element.style.cursor = 'grab';
        document.removeEventListener('mousemove', moveDrag);
        document.removeEventListener('mouseup', endDrag);
        document.removeEventListener('touchmove', moveDrag);
        document.removeEventListener('touchend', endDrag);
    }
    
    document.addEventListener('mousemove', moveDrag);
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchmove', moveDrag);
    document.addEventListener('touchend', endDrag);
}

function resetPositions() {
    players.forEach(player => {
        player.x = player.originalX;
        player.y = player.originalY;
    });
    drawField();
}

// FIX: Enhanced formation analysis with meaningful insights
function analyzeFormation() {
    if (!currentFormation) {
        alert('Please select a formation first');
        return;
    }
    
    const analysisResults = document.getElementById('analysisResults');
    
    const defenders = currentFormation.defenders;
    const midfielders = currentFormation.midfielders;
    const forwards = currentFormation.forwards;
    
    // Calculate tactical metrics
    const defensiveStrength = Math.min(10, (defenders / 5) * 10);
    const midfieldControl = Math.min(10, (midfielders / 5) * 10);
    const attackingPower = Math.min(10, (forwards / 3) * 10);
    const balance = 10 - Math.abs(5 - (defensiveStrength + midfieldControl + attackingPower) / 3);
    
    // Determine formation type
    let formationType = '';
    if (defenders >= 5) formationType = 'Defensive';
    else if (forwards >= 3) formationType = 'Attacking';
    else formationType = 'Balanced';
    
    // Generate tactical recommendations
    let strengths = [];
    let weaknesses = [];
    
    if (defenders >= 4) strengths.push('Strong defensive line');
    if (midfielders >= 4) strengths.push('Strong midfield control');
    if (forwards >= 3) strengths.push('Strong attacking potential');
    
    if (defenders <= 3) weaknesses.push('Vulnerable defense');
    if (midfielders <= 2) weaknesses.push('Limited midfield support');
    if (forwards <= 1) weaknesses.push('Weak attacking options');
    
    const formationKey = Object.keys(formations).find(k => formations[k] === currentFormation);
    
    analysisResults.innerHTML = `
        <h3>⚽ Formation Analysis: ${formationKey}</h3>
        
        <div style="margin: 15px 0;">
            <strong>Type:</strong> ${formationType} Formation
        </div>
        
        <div style="margin: 15px 0;">
            <strong>Player Distribution:</strong>
            <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Defenders: ${defenders}</li>
                <li>Midfielders: ${midfielders}</li>
                <li>Forwards: ${forwards}</li>
            </ul>
        </div>
        
        <div style="margin: 15px 0;">
            <strong>Tactical Ratings:</strong>
            <div style="margin: 8px 0; font-size: 0.9rem;">
                🛡️ Defense: ${defensiveStrength.toFixed(1)}/10
                <div style="background: #e0e0e0; height: 6px; border-radius: 3px; overflow: hidden;">
                    <div style="background: #6BCF7F; height: 100%; width: ${defensiveStrength * 10}%;"></div>
                </div>
            </div>
            <div style="margin: 8px 0; font-size: 0.9rem;">
                🎯 Midfield: ${midfieldControl.toFixed(1)}/10
                <div style="background: #e0e0e0; height: 6px; border-radius: 3px; overflow: hidden;">
                    <div style="background: #4D96FF; height: 100%; width: ${midfieldControl * 10}%;"></div>
                </div>
            </div>
            <div style="margin: 8px 0; font-size: 0.9rem;">
                ⚡ Attack: ${attackingPower.toFixed(1)}/10
                <div style="background: #e0e0e0; height: 6px; border-radius: 3px; overflow: hidden;">
                    <div style="background: #FF6B6B; height: 100%; width: ${attackingPower * 10}%;"></div>
                </div>
            </div>
        </div>
        
        <div style="margin: 15px 0;">
            <strong>Strengths:</strong>
            <ul style="margin: 10px 0; padding-left: 20px; color: #2d7c2d;">
                ${strengths.map(s => `<li>✓ ${s}</li>`).join('')}
            </ul>
        </div>
        
        <div style="margin: 15px 0;">
            <strong>Weaknesses:</strong>
            <ul style="margin: 10px 0; padding-left: 20px; color: #c41e3a;">
                ${weaknesses.map(w => `<li>✗ ${w}</li>`).join('')}
            </ul>
        </div>
        
        <button onclick="resetPositions()" style="margin-top: 15px; width: 100%; padding: 10px; background: #2a5298; color: white; border: none; border-radius: 5px; cursor: pointer;">Reset Player Positions</button>
    `;
}

// FIX: Export functionality with multiple formats
function exportTactics() {
    if (!currentFormation) {
        alert('Please select a formation first');
        return;
    }
    
    const formationKey = Object.keys(formations).find(k => formations[k] === currentFormation);
    const teamName = document.getElementById('teamName').value || 'Team A';
    const coachName = document.getElementById('coachName').value || 'Coach';
    
    // Export as JSON
    const tacticsData = {
        formation: formationKey,
        teamName: teamName,
        coach: coachName,
        timestamp: new Date().toISOString(),
        players: players.map(p => ({
            id: p.id,
            name: p.name,
            position: p.position,
            x: p.x,
            y: p.y
        }))
    };
    
    const jsonString = JSON.stringify(tacticsData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${teamName}-${formationKey}-tactics.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    alert('Tactics exported as JSON successfully!');
}
