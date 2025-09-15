async function loadStats(){
  const files = await (await fetch("./data/games.json")).json();
  const totals={}, rounds={}, timeline={}, weekly=[]; let dates=[];

  for(const f of files){
    const g = await (await fetch("./data/"+f)).json();
    const r = Object.values(g.players)[0].length; dates.push(g.date);
    let best=null,bestScore=-Infinity;
    for(const [p,scores] of Object.entries(g.players)){
      const total = scores.reduce((a,b)=>a+b,0)-r*g.potSize;
      if(!totals[p]){totals[p]=0; rounds[p]=0; timeline[p]=[];}
      totals[p]+=total; rounds[p]+=r;
      timeline[p].push((timeline[p].slice(-1)[0]||0)+total);
      if(total>bestScore){bestScore=total; best=p;}
    }
    weekly.push({date:g.date, file:f, player:best, score:bestScore});
  }

  let html=`<h2>All-Time Totals</h2><table><thead><tr><th>Player</th><th>Total Earnings</th><th>Rounds Played</th></tr></thead><tbody>`;
  for(const p in totals) html+=`<tr><td>${p}</td><td>${totals[p]}</td><td>${rounds[p]}</td></tr>`;
  html+=`</tbody></table><h2>Weekly Biggest Winners</h2><table><thead><tr><th>Date</th><th>Winner</th><th>Earnings</th></tr></thead><tbody>`;
  weekly.forEach(w=>{html+=`<tr><td><a href="game.html?file=${w.file}">${w.date}</a></td><td>${w.player}</td><td>${w.score}</td></tr>`;});
  html+=`</tbody></table>`; document.getElementById("stats-container").innerHTML=html;

  new Chart(document.getElementById("totalsChart"),{type:'bar',data:{labels:Object.keys(totals),datasets:[{label:'Total Earnings',data:Object.values(totals),backgroundColor:'rgba(54,162,235,0.6)',borderColor:'rgba(54,162,235,1)',borderWidth:1}]},options:{scales:{y:{beginAtZero:true}}}});
  const datasets=Object.keys(timeline).map(p=>({label:p,data:timeline[p],fill:false,borderColor:`hsl(${Math.random()*360},70%,50%)`,tension:0.2}));
  new Chart(document.getElementById("timelineChart"),{type:'line',data:{labels:dates,datasets:datasets},options:{responsive:true,interaction:{mode:'index',intersect:false},plugins:{tooltip:{enabled:true}},scales:{y:{beginAtZero:true}}}});
}
loadStats();
