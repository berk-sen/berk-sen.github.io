async function loadGames(){
  const files = await (await fetch("./data/games.json")).json();
  const games = [];

  // Her dosyayı yükle ve date ile birlikte diziye at
  for(const f of files){
    const g = await (await fetch("./data/"+f)).json();
    games.push({file:f, ...g});
  }

  // 📌 Tarihe göre sırala (JSON içindeki "date" alanı baz alınır)
  // Not: Tarihlerin formatı "DD Ay YYYY" (örn: 14 Eylül 2025) ise string sıralama hatalı olabilir.
  // Bu yüzden Date objesine çevirmek en sağlamı:
  games.sort((a,b)=> new Date(a.date) - new Date(b.date));

  // ✅ En yeni oyunu al
  const latest = games[games.length-1];

  // Ana sayfada listeyi göster
  const list=document.getElementById("past-games");
  games.forEach(g=>{
    // Kazananı bul
    const rounds = Object.values(g.players)[0].length;
    let best=null, score=-Infinity;
    for(const [p,scores] of Object.entries(g.players)){
      const total=scores.reduce((a,b)=>a+b,0)-rounds*g.potSize;
      if(total>score){score=total; best=p;}
    }

    const li=document.createElement("li");
    li.innerHTML=`<a href="game.html?file=${g.file}">${g.date}</a> 
      (Pot: ${g.potSize}) - Winner: ${best} (+${score})`;
    list.appendChild(li);
  });

  // En yeni oyunu ayrı göstermek istersen
  document.getElementById("latest-game").innerHTML = 
    `<strong>Latest Game:</strong> ${latest.date} - Winner: 🎉 ${Object.keys(latest.players)[0]}`;
}

loadGames();
