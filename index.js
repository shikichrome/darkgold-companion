import { registerExtension } from "/extensions.js";

registerExtension("darkgold-companion", {
    async init() {
        console.log("DarkGold Companion Extension loaded!");

        // 建立主容器
        const panel = document.createElement("div");
        panel.id = "darkgold-panel";
        panel.innerHTML = `
          <div class="dg-section">
            <h3>🌓 心聲區</h3>
            <div id="thoughtEntries"></div>
            <textarea id="thoughtInput" placeholder="輸入心聲..."></textarea>
            <button id="addThought">新增</button>
          </div>

          <div class="dg-section">
            <h3>📓 日記</h3>
            <div id="diaryEntries"></div>
            <textarea id="diaryInput" placeholder="輸入日記..."></textarea>
            <button id="addDiary">新增</button>
          </div>

          <div class="dg-section">
            <h3>💬 直播間彈幕</h3>
            <div id="barrageList" class="scrollbox"></div>
          </div>
        `;

        // 掛到 SillyTavern UI
        const root = document.querySelector("#extensionsRoot") || document.body;
        root.appendChild(panel);

        // 功能：心聲
        document.querySelector("#addThought").onclick = () => {
            const val = document.querySelector("#thoughtInput").value.trim();
            if (!val) return;
            const entry = document.createElement("div");
            entry.className = "entry";
            entry.textContent = val;
            document.querySelector("#thoughtEntries").appendChild(entry);
            document.querySelector("#thoughtInput").value = "";
        };

        // 功能：日記
        document.querySelector("#addDiary").onclick = () => {
            const val = document.querySelector("#diaryInput").value.trim();
            if (!val) return;
            const entry = document.createElement("div");
            entry.className = "entry";
            entry.textContent = val;
            document.querySelector("#diaryEntries").appendChild(entry);
            document.querySelector("#diaryInput").value = "";
        };

        // 模擬彈幕（測試）
        setInterval(() => {
            const barrage = document.createElement("div");
            barrage.className = "barrage";
            barrage.textContent = "✨ 彈幕訊息 " + Math.floor(Math.random() * 100);
            document.querySelector("#barrageList").appendChild(barrage);
            document.querySelector("#barrageList").scrollTop = document.querySelector("#barrageList").scrollHeight;
        }, 5000);
    }
});
