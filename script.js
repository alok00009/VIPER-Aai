import { db } from './database.js';
import { ref, set, push, onValue } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-database.js";

let lastNum = null;
let lastPeriod = null;
const userKey = localStorage.getItem('active_key');

// API Results Fetch
async function getRealResults() {
    try {
        const res = await fetch("https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json");
        const json = await res.json();
        return json.data.list;
    } catch (e) { return []; }
}

// Logic & Prediction
document.getElementById('btnPredict').onclick = () => {
    if (!lastNum) return;
    const loader = document.getElementById('aiLoader');
    loader.classList.remove('hidden');

    setTimeout(async () => {
        const n = parseInt(lastNum);
        let size = (n % 2 === 0) ? "BIG" : "SMALL";
        let op = (size === "BIG") ? "1, 3" : "7, 9";

        // Save to Firebase
        const nextIssue = (BigInt(lastPeriod) + 1n).toString();
        const historyRef = push(ref(db, `user_history/${userKey}`));
        await set(historyRef, {
            period: nextIssue,
            prediction: size,
            time: new Date().toLocaleTimeString()
        });

        // Update UI
        const resDisp = document.getElementById('wRes');
        resDisp.innerText = size;
        resDisp.className = `hacker-font text-8xl ${size === 'BIG' ? 'text-red-500' : 'text-emerald-500'}`;
        document.getElementById('opNums').innerText = op;
        loader.classList.add('hidden');
    }, 1200);
};

// History Real-time Sync
function loadHistory() {
    const listDiv = document.getElementById('historyList');
    const historyRef = ref(db, `user_history/${userKey}`);

    onValue(historyRef, async (snapshot) => {
        const realData = await getRealResults();
        if (!snapshot.exists()) {
            listDiv.innerHTML = "<p class='text-center py-10 text-gray-800 text-[9px] font-black'>No Hacks Found</p>";
            return;
        }

        listDiv.innerHTML = "";
        const data = snapshot.val();
        Object.values(data).reverse().forEach(item => {
            const match = realData.find(r => String(r.issueNumber) === String(item.period));
            let status = "JK 🎲", border = "border-gray-800", sCol = "text-gray-500";

            if (match) {
                const realSize = match.number >= 5 ? "BIG" : "SMALL";
                if (item.prediction === realSize) {
                    status = "WIN 🐯"; border = "border-emerald-500/30"; sCol = "text-emerald-500";
                } else {
                    status = "LOSS 💀"; border = "border-red-500/30"; sCol = "text-red-500";
                }
            }

            listDiv.innerHTML += `
                <div class="history-card p-4 border ${border} flex justify-between items-center transition-all">
                    <div>
                        <p class="text-[7px] text-gray-600 font-bold uppercase">PRD: ${item.period.toString().slice(-3)}</p>
                        <p class="hacker-font text-[10px] text-white/80 uppercase">Pred: ${item.prediction}</p>
                    </div>
                    <div class="text-right">
                        <p class="hacker-font text-[10px] ${sCol}">${status}</p>
                        <p class="text-[7px] text-white/10 font-bold">${item.time}</p>
                    </div>
                </div>
            `;
        });
    });
}

// API Sync
async function syncAPI() {
    const data = await getRealResults();
    if(data.length > 0) {
        lastNum = data[0].number;
        lastPeriod = data[0].issueNumber;
        document.getElementById("nextPeriod").innerText = "PERIOD: " + (BigInt(lastPeriod) + 1n).toString();
    }
}

setInterval(syncAPI, 5000);
syncAPI();
loadHistory();
