// DarkGold Companion — no-ESM version (for ST extension loader)
(function () {
  const EXT_ID = "darkgold-companion";

  function mountUI() {
    // 避免重複
    if (document.getElementById("darkgold-panel")) return;

    // 主容器（出現在 Extensions 區）
    const panel = document.createElement("div");
    panel.id = "darkgold-panel";
    panel.innerHTML = `
      <div class="dg-section">
        <h3>🌓 心聲區</h3>
        <div id="thoughtEntries"></div>
        <textarea id="thoughtInput" placeholder="輸入心聲（50–300字）"></textarea>
        <button id="addThought">新增</button>
      </div>

      <div class="dg-section">
        <h3>📓 日記</h3>
        <div id="diaryEntries"></div>
        <textarea id="diaryInput" placeholder="輸入日記"></textarea>
        <button id="addDiary">新增</button>
        <div id="diarySummary" class="entry" style="display:none"></div>
      </div>

      <div class="dg-section">
        <h3>💬 直播間彈幕</h3>
        <div style="margin-bottom:6px">
          許可白名單：<input id="dgWhite" placeholder="冥冥,ナノヴィス,セリス" />
          速度：
          <select id="dgSpeed">
            <option value="1200">通常</option>
            <option value="800">快</option>
            <option value="1800">慢</option>
          </select>
          <button id="dgPause">一時停止</button>
          <button id="dgClear">清空</button>
        </div>
        <div id="barrageList" class="scrollbox"></div>
      </div>
    `;

    // 掛到擴充容器；找不到就掛 body（後備）
    const root = document.querySelector("#extensionsRoot") || document.body;
    root.appendChild(panel);

    // —— 行為邏輯 ——
    const tBox = document.getElementById("thoughtEntries");
    const tInput = document.getElementById("thoughtInput");
    document.getElementById("addThought").onclick = () => {
      const txt = (tInput.value || "").trim();
      const n = [...txt].length;
      if (n < 50 || n > 300) return alert("心聲需 50–300 字");
      appendEntry(tBox, { text: txt });
      tInput.value = "";
    };

    const dBox = document.getElementById("diaryEntries");
    const dInput = document.getElementById("diaryInput");
    const dSum = document.getElementById("diarySummary");
    const diaries = [];
    document.getElementById("addDiary").onclick = () => {
      const txt = (dInput.value || "").trim();
      if (!txt) return;
      diaries.push(txt);
      appendEntry(dBox, { text: txt });
      dInput.value = "";
      if (diaries.length % 5 === 0) {
        dSum.style.display = "block";
        dSum.textContent = autoSummary(diaries.slice(-5));
      }
    };

    // 彈幕
    const list = document.getElementById("barrageList");
    const white = document.getElementById("dgWhite");
    const speed = document.getElementById("dgSpeed");
    const pause = document.getElementById("dgPause");
    const clear = document.getElementById("dgClear");
    white.value = localStorage.getItem("dgWhite") || "冥冥,ナノヴィス,セリス";
    speed.value = localStorage.getItem("dgSpeed") || "1200";
    white.onchange = () => localStorage.setItem("dgWhite", white.value);
    speed.onchange = () => { localStorage.setItem("dgSpeed", speed.value); start(); };

    const pool = [
      { who: "冥冥", text: "見てる。" },
      { who: "ナノヴィス", text: "🍎 変わろうか。" },
      { who: "守護者", text: "セリス、深呼吸を。" },
      { who: "観測者", text: "黒と金、相性が良い。" },
      { who: "冥冥", text: "願いは預かった。" },
      { who: "ナノヴィス", text: "禁果は甘い、くふふ。" }
    ];
    let timer = null, paused = false;
    function pick() {
      const allow = white.value.split(",").map(s => s.trim()).filter(Boolean);
      const f = pool.filter(p => allow.includes(p.who));
      return f.length ? f[Math.floor(Math.random() * f.length)] : null;
    }
    function addBullet(it) {
      const now = new Date();
      const t = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
      const div = document.createElement("div");
      div.className = "barrage";
      div.textContent = `（${it.who}）${it.text}  ${t}`;
      list.appendChild(div); list.scrollTop = list.scrollHeight;
    }
    function tick() { if (!paused) { const it = pick(); if (it) addBullet(it); } }
    function start() { if (timer) clearInterval(timer); timer = setInterval(tick, Number(speed.value || 1200)); }
    start();
    pause.onclick = () => { paused = !paused; pause.textContent = paused ? "再開" : "一時停止"; };
    clear.onclick = () => { list.innerHTML = ""; };

    function appendEntry(root, it) {
      const e = document.createElement("div");
      e.className = "entry";
      e.textContent = it.text;
      root.appendChild(e);
      root.scrollTop = root.scrollHeight;
    }
    function autoSummary(last5) {
      let sum = "【日記まとめ】" + last5.map(s => s.replace(/\s+/g, " ").slice(0, 40)).join(" / ");
      while ([...sum].length < 200) sum += " 今夜の記録は静かに積み重なり、黒と金の余韻が続く。";
      return sum;
    }
  }

  // 若有全域 registerExtension，正規註冊；沒有就直接自我注入當後備
  if (typeof window.registerExtension === "function") {
    try {
      window.registerExtension(EXT_ID, {
        async init() {
          console.log("DarkGold Companion registered.");
          mountUI();
        }
      });
    } catch (e) {
      console.error("registerExtension failed, fallback to self-inject", e);
      mountUI();
    }
  } else {
    // 沒有擴充 API（舊版/關閉）→ 直接自我注入
    mountUI();
  }
})();
