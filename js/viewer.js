async function loadLatestGame() {
  const response = await fetch("data/games.json");
  const gameFiles = await response.json();

  if (gameFiles.length === 0) {
    document.getElementById("latest-game").innerHTML = "<p>No games available.</p>";
    return;
  }

  // --- Latest Game ---
  const latestFile = gameFiles[gameFiles.length - 1];
  const latestResponse = await fetch("data/" + latestFile);
  const latestGame = await latestResponse.json();

  const container = document.getElementById("latest-game");
  let html = `<h2>Game on ${latestGame.date} (Pot Size: ${latestGame.potSize})</h2>`;
  html += `<table><thead><tr><th>Player</th>`;

  const rounds = Object.values(latestGame.players)[0].length;
  for (let i = 1; i <= rounds; i++) html += `<th>Round ${i}</th>`;
  html += `<th>Total Earning</th></tr></thead><tbody>`;

  let bestPlayer = null, bestScore = -Infinity;
  for (const [player, scores] of Object.entries(latestGame.players)) {
    const sum = scores.reduce((a, b) => a + b, 0);
    const total = sum - (latestGame.potSize * rounds);

    html += `<tr><td>${player}</td>`;
    scores.forEach(s => html += `<td>${s}</td>`);
    html += `<td>${total}</td></tr>`;

    if (total > bestScore) { bestScore = total; bestPlayer = player; }
  }
  html += `</tbody></table>`;
  html += `<p><strong>Biggest Winner:</strong> ${bestPlayer} (+${bestScore})</p>`;
  container.innerHTML = html;

  // --- Past Games ---
  const listContainer = document.getElementById("past-games");
  listContainer.innerHTML = "";
  for (let i = gameFiles.length - 2; i >= 0; i--) {
    const f = gameFiles[i];
    const res = await fetch("data/" + f);
    const game = await res.json();

    let weeklyBestPlayer = null, weeklyBestScore = -Infinity;
    const roundsCount = Object.values(game.players)[0].length;
    for (const [player, scores] of Object.entries(game.players)) {
      const total = scores.reduce((a, b) => a + b, 0) - (game.potSize * roundsCount);
      if (total > weeklyBestScore) { weeklyBestScore = total; weeklyBestPlayer = player; }
    }

    const li = document.createElement("li");
    li.innerHTML = `<a href="game.html?file=${f}">${game.date}</a> (Pot: ${game.potSize}) - Winner: ${weeklyBestPlayer} (+${weeklyBestScore})`;
    listContainer.appendChild(li);
  }
}

loadLatestGame();
