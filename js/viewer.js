async function loadLatestGame() {
  const files = await (await fetch("./data/games.json")).json();
  if(files.length===0){document.getElementById("latest-game").innerHTML="<p>No games available.</p>"; return;}

  const latest = await (await fetch("./data/"+files[files.length-1])).json();
  const container = document.getElementById("latest-game");
  let html = `<h2>Game on ${latest.date} (Pot Size: ${latest.potSize})</h2><table><thead><tr><th>Player</th>`;
  const rounds = Object.values(latest.players)[0].length;
  for(let i=1;i<=rounds;i++) html+=`<th>Round ${i}</th>`;
  html+=`<th>Total Earning</th></tr></thead><tbody>`;

  let bestPlayer=null,bestScore=-Infinity;
  for(const [p,scores] of Object.entries(latest.players)){
    const total = scores.reduce((a,b)=>a+b,0) - latest.potSize*rounds;
    html+=`<tr><td>${p}</td>`+scores.map(s=>`<td>${s}</td>`).join('')+`<td>${total}</td></tr>`;
    if(total>bestScore){bestScore=total; bestPlayer=p;}
  }
  html+=`</tbody></table><p><strong>Biggest Winner:</strong> ${bestPlayer} (+${bestScore})</p>`;
  container.innerHTML=html;

  const list = document.getElementById("past-games"); list.innerHTML="";
  for(let i=files.length-2;i>=0;i--){
    const g = await (await fetch("./data/"+files[i])).json();
    let best=null,score=-Infinity;
    const roundsCount = Object.values(g.players)[0].length;
    for(const [p,scores] of Object.entries(g.players)){const t = scores.reduce((a,b)=>a+b,0)-roundsCount*g.potSize; if(t>score){score=t; best=p;}}
    const li = document.createElement("li");
    li.innerHTML=`<a href="game.html?file=${files[i]}">${g.date}</a> (Pot: ${g.potSize}) - Winner: ${best} (+${score})`;
    list.appendChild(li);
  }
}
loadLatestGame();
