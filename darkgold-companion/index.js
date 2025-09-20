(function () {
    if (document.getElementById("darkgold-rail")) return;
    // ---- minimal CSS（黑金）----
    if (!document.getElementById('dg-inline-style')) {
      const css = document.createElement('style');
      css.id = 'dg-inline-style';
      css.textContent = `
      :root{--bg:#0b0b0b;--panel:#141414;--panel-2:#101010;--line:#2a2a2a;--gold:#d6b879;--gold-light:#f5e1a4;--text:#e0e0e0}
      #darkgold-rail{position:fixed;top:72px;right:10px;width:300px;height:60%;overflow:auto;background:#141414;
        border:1px solid var(--gold);border-radius:12px;color:var(--gold-light);padding:10px;z-index:9999;box-shadow:0 10px 30px rgba(0,0,0,.8)}
      #darkgold-bottom{position:fixed;left:10px;right:320px;bottom:10px;height:200px;display:grid;grid-template-columns:1fr 1fr;gap:12px;
        z-index:9999}
      .dg-pane{background:#141414;border:1px solid var(--gold);border-radius:12px;color:#ddd;overflow:auto}
      .dg-pane h4{margin:10px;color:var(--gold-light);border-bottom:1px solid var(--gold);padding-bottom:4px}
      .dg-entry{margin:8px 10px;padding:8px 10px;background:rgba(255,255,255,.04);border:1px solid var(--line);border-radius:10px}
      .dg-bullet{margin:6px 0;padding:6px 8px;background:rgba(255,255,255,.05);border:1px solid var(--line);border-left:3px solid var(--gold);border-radius:8px}
      `;
      document.head.appendChild(css);
    }
    // ---- 右欄：彈幕 ----
    const rail = document.createElement('aside');
    rail.id = 'darkgold-rail';
    rail.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
        <strong style="color:var(--gold-light)">コメント観測</strong>
        <label style="margin-left:auto">許可:
          <input id="dg-white" placeholder="冥冥,ナノヴィス,セリス" style="background:#0f0f0f;color:#ddd;border:1px solid var(--line);border-radius:8px;padding:4px 8px;min-width:160px">
        </label>
        <select id="dg-speed" style="background:#0f0f0f;color:#ddd;border:1px solid var(--line);border-radius:8px;padding:4px 6px">
          <option value="1200">通常</option><option value="800">速い</option><option value="1800">ゆっくり</option>
        </select>
      </div>
      <div id="dg-list"></div>`;
    document.body.appendChild(rail);
  
    // ---- 下方：心聲 / 日記 ----
    const bottom = document.createElement('section');
    bottom.id = 'darkgold-bottom';
    bottom.innerHTML = `
      <div class="dg-pane"><h4>詳細な心声（50〜300字）</h4><div id="dg-thoughts"></div></div>
      <div class="dg-pane"><h4>日記（5則ごとに要約）</h4><div id="dg-diaries"></div><div id="dg-summary" class="dg-entry" style="display:none"></div></div>`;
    document.body.appendChild(bottom);
  
    // ---- Demo / 邏輯 ----
    const list = document.getElementById('dg-list');
    const white = document.getElementById('dg-white');
    const speed = document.getElementById('dg-speed');
    white.value = localStorage.getItem('dg-white') || '冥冥,ナノヴィス,セリス';
    speed.value = localStorage.getItem('dg-speed') || '1200';
    white.onchange = () => localStorage.setItem('dg-white', white.value);
    speed.onchange = () => { localStorage.setItem('dg-speed', speed.value); start(); };
  
    const pool = [
      {who:'冥冥', text:'見てる。'}, {who:'ナノヴィス', text:'🍎 変わろうか。'},
      {who:'守護者', text:'セリス、深呼吸を。'}, {who:'観測者', text:'黒と金、相性が良い。'},
      {who:'冥冥', text:'願いは預かった。'}, {who:'ナノヴィス', text:'禁果は甘い、くふふ。'}
    ];
    let timer=null;
    function pick(){
      const allow = white.value.split(',').map(s=>s.trim()).filter(Boolean);
      const f = pool.filter(p=>allow.includes(p.who));
      return f.length ? f[Math.floor(Math.random()*f.length)] : null;
    }
    function bullet(it){
      const d=document.createElement('div'); d.className='dg-bullet';
      const now=new Date(), t=`${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
      d.textContent = `（${it.who}）${it.text}  ${t}`; list.appendChild(d); list.scrollTop=list.scrollHeight;
    }
    function tick(){ const it=pick(); if(it) bullet(it); }
    function start(){ if(timer) clearInterval(timer); timer=setInterval(tick, Number(speed.value||1200)); }
    start();
  
    const T = document.getElementById('dg-thoughts');
    const D = document.getElementById('dg-diaries');
    const S = document.getElementById('dg-summary');
    const thoughts=[], diaries=[];
    // 給你兩則初始展示
    ['君を守るためなら、闇に牙を立てよう。','金の光は、君の未来を祝うためにある。']
      .forEach(x=>{ const e=document.createElement('div'); e.className='dg-entry'; e.textContent=x; T.appendChild(e); thoughts.push(x); });
    ['セリスの誕生日。黒と金の狭間に誓いを置く。','静かな夜に、黄金の灯が未来を照らした。']
      .forEach(x=>{ const e=document.createElement('div'); e.className='dg-entry'; e.textContent=x; D.appendChild(e); diaries.push(x); });
  
    function summarize(){
      const last5 = diaries.slice(-5);
      if (last5.length < 5) { S.style.display='none'; return; }
      let sum = `【日記まとめ】` + last5.map(s=>s.slice(0,40)).join(' / ');
      while ([...sum].length < 200) sum += ' 今夜の記録は静かに積み重なり、黒と金の余韻が続く。';
      S.textContent = sum; S.style.display='block';
    }
    summarize();
  })();
  