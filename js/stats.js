async function loadStats() {
  const gamesResponse = await fetch("data/games.json");
  const gameFiles = await gamesResponse.json();

  const playersTotals = {};
  const playersRounds = {};
  let weeklyWinners = [];
  let timeline = {};
  let dates = [];

  for (const file of gameFiles) {
    const response = await fetch("data/" + file);
    const game = await response.json();

    const rounds = Object.values(game.players)[0].length;
    let bestPlayer = null, bestScore = -Infinity;
    dates.push(game.date);

    for (const [player, scores] of Object.entries(game.players)) {
      const sum = scores.reduce((a, b) => a + b, 0);
      const total = sum - (game.potSize * rounds);

      if (!playersTotals[player]) playersTotals[player] = 0;
      if (!playersRounds[player]) playersRounds[player] = 0;
      if (!timeline[player]) timeline[player] = [];

      playersTotals[player] += total;
      playersRounds[player] += rounds;

      const prev = timeline[player].length > 0 ? timeline[player][timeline[player].length - 1] : 0;
      timeline[player].push(prev + total);

      if (total > bestScore) { bestScore = total; bestPlayer = player; }
    }

    weeklyWinners.push({ date: game.date, file, player: bestPlayer, score: bestScore });
  }

  const container = document.getElementById("stats-container");
  let html = `<h2>All-Time Totals</h2>`;
  html += `<table><thead><tr><th>Player</th><th>Total Earnings</th><th>Rounds Played</th></tr></thead><tbody>`;
  for (const player in playersTotals) {
    html += `<tr><td>${player}</td><td>${playersTotals[player]}</td><td>${playersRounds[player]}</td></tr>`;
  }
  html += `</tbody></table>`;

  html += `<h2>Weekly Biggest Winners</h2>`;
  html += `<table><thead><tr><th>Date</th><th>Winner</th><th>Earnings</th></tr></thead><tbody>`;
  weeklyWinners.forEach(w => {
    html += `<tr>
      <td><a href="game.html?file=${w.file}">${w.date}</a></td>
      <td>${w.player}</td>
      <td>${w.score}</td>
    </tr>`;
  });
  html += `</tbody></table>`;
  container.innerHTML = html;

  // --- Charts ---
  new Chart(document.getElementById("totalsChart"), {
    type: 'bar',
    data: {
      labels: Object.keys(playersTotals),
      datasets: [{ label: 'Total Earnings', data: Object.values(playersTotals), backgroundColor: 'rgba(54, 162, 235, 0.6)', borderColor: 'rgba(54, 162, 235, 1)', borderWidth: 1 }]
    },
    options: { scales: { y: { beginAtZero: true } } }
  });

  const datasets = Object.keys(timeline).map(player => ({
    label: player,
    data: timeline[player],
    fill: false,
    borderColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
    tension: 0.2
  }));

  new Chart(document.getElementById("timelineChart"), {
    type: 'line',
    data: { labels: dates, datasets: datasets },
    options: { responsive: true, interaction: { mode: 'index', intersect: false }, plugins: { tooltip: { enabled: true } }, scales: { y: { beginAtZero: true } } }
  });
}

loadStats();
