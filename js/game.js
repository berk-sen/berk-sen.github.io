function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

async function loadGame() {
  const file = getQueryParam("file");
  if (!file) {
    document.getElementById("game-details").innerHTML = "<p>No game selected.</p>";
    return;
  }

  const response = await fetch("data/" + file);
  const game = await response.json();

  const container = document.getElementById("game-details");
  let html = `<h2>Game on ${game.date} (Pot Size: ${game.potSize})</h2>`;
  html += `<table><thead><tr><th>Player</th>`;

  const rounds = Object.values(game.players)[0].length;
  for (let i = 1; i <= rounds; i++) html += `<th>Round ${i}</th>`;
  html += `<th>Total Earning</th></tr></thead><tbody>`;

  let bestPlayer = null, bestScore = -Infinity;
  for (const [player, scores] of Object.entries(game.players)) {
    const sum = scores.reduce((a, b) => a + b, 0);
    const total = sum - (game.potSize * rounds);

    html += `<tr><td>${player}</td>`;
    scores.forEach(s => html += `<td>${s}</td>`);
    html += `<td>${total}</td></tr>`;

    if (total > bestScore) { bestScore = total; bestPlayer = player; }
  }

  html += `</tbody></table>`;
  html += `<p><strong>Biggest Winner:</strong> ${bestPlayer} (+${bestScore})</p>`;
  container.innerHTML = html;
}

loadGame();
