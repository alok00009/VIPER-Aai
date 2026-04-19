import { db } from './database.js';
import { ref, set, push } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-database.js";

let lastNum = null;
let lastPeriod = null;

// API Fetching
async function fetchAPI() {
    try {
        const res = await fetch("https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json");
        const json = await res.json();
        const latest = json.data.list[0];

        lastNum = latest.number;
        lastPeriod = latest.issueNumber;
        
        const nextIssue = (BigInt(latest.issueNumber) + 1n).toString();
        document.getElementById("nextPeriod").innerText = "PERIOD: " + nextIssue;
    } catch (e) { console.log("API Sync Error"); }
}

// Prediction Logic
document.getElementById('btnPredict').onclick = () => {
    if (!lastNum) return;
    const loader = document.getElementById('aiLoader');
    loader.classList.remove('hidden');

    setTimeout(async () => {
        const n = parseInt(lastNum);
        let size, op;

        // Nobita Strict Logic V15
        if (n % 2 === 0) {
            size = "BIG"; op = "1, 3";
        } else {
            size = "SMALL"; op = "7, 9";
        }

        // Save to Firebase History
        const key = localStorage.getItem('active_key');
        const nextIssue = (BigInt(lastPeriod) + 1n).toString();
        const historyRef = push(ref(db, `user_history/${key}`));
        
        await set(historyRef, {
            period: nextIssue,
            prediction: size,
            time: new Date().toLocaleTimeString()
        });

        // Update UI
        const resDisp = document.getElementById('wRes');
        resDisp.innerText = size;
        resDisp.className = `hacker-font text-8xl ${size === 'BIG' ? 'text-red-500 shadow-red-500' : 'text-emerald-500 shadow-emerald-500'}`;
        document.getElementById('opNums').innerText = op;
        
        loader.classList.add('hidden');
    }, 1200);
};

// History Redirection
document.getElementById('historyBtn').onclick = () => {
    window.location.href = "history.html";
};

setInterval(fetchAPI, 5000);
fetchAPI();
