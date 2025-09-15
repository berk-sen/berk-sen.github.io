function getQueryParam(name){return new URLSearchParams(window.location.search).get(name);}
async function loadGame(){
  const file = getQueryParam("file"); if(!file){document.getElementById("game-details").innerHTML="<p>No game selected.</p>"; return;}
  const g = await (await fetch("./data/"+file)).json();
  const rounds = Object.values(g.players)[0].length;
  let best=null,bestScore=-Infinity; let html=`<h2>Game on ${g.date} (Pot Size: ${g.potSize})</h2><table><thead><tr><th>Player</th>`;
  for(let i=1;i<=rounds;i++) html+=`<th>Round ${i}</th>`;
  html+=`<th>Total Earning</th></tr></thead><tbody>`;
  for(const [p,scores] of Object.entries(g.players)){
    const total=scores.reduce((a,b)=>a+b,0)-rounds*g.potSize;
    html+=`<tr><td>${p}</td>`+scores.map(s=>`<td>${s}</td>`).join('')+`<td>${total}</td></tr>`;
    if(total>bestScore){bestScore=total; best=p;}
  }
  html+=`</tbody></table><p><strong>Biggest Winner:</strong> ${best} (+${bestScore})</p>`;
  document.getElementById("game-details").innerHTML=html;
}
loadGame();
