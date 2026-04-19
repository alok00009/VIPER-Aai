let lastNum = null;
let lastPeriod = null;
let currentPrediction = null;
let historyData = [];

async function fetchAPI() {
    try {
        const res = await fetch("https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json");
        const data = await res.json();
        const latest = data.data.list[0];

        // Agar naya period aaya hai toh win/loss check karo
        if (lastPeriod && latest.issueNumber !== lastPeriod) {
            updateHistory(latest);
        }

        lastNum = latest.number;
        lastPeriod = latest.issueNumber;
        const nextIssue = (BigInt(latest.issueNumber) + 1n).toString();
        document.getElementById("nextPeriod").innerText = "Next: " + nextIssue;
    } catch (e) { console.error("API Error"); }
}

function updateHistory(latest) {
    if (!currentPrediction) return;
    
    const actualSize = latest.number >= 5 ? "BIG" : "SMALL";
    const status = (currentPrediction === actualSize) ? "WIN 🐯" : "LOSS 💀";
    const statusColor = (currentPrediction === actualSize) ? "text-green-500" : "text-red-500";

    const row = `<tr class="border-b border-white/5">
        <td class="py-2">${latest.issueNumber.toString().slice(-3)}</td>
        <td class="py-2">${currentPrediction}</td>
        <td class="py-2">${latest.number}</td>
        <td class="py-2 ${statusColor}">${status}</td>
    </tr>`;
    
    document.getElementById('historyBody').insertAdjacentHTML('afterbegin', row);
    currentPrediction = null; // Reset
}

document.getElementById('btnPredict').onclick = () => {
    if (lastNum === null) return;
    const loader = document.getElementById('aiLoader');
    loader.classList.remove('hidden');

    setTimeout(() => {
        const num = parseInt(lastNum);
        let size, op1, op2;

        // V15 STRICT LOGIC
        if (num % 2 === 0) {
            size = "BIG"; op1 = 1; op2 = 3;
        } else {
            size = "SMALL"; op1 = 7; op2 = 9;
        }

        currentPrediction = size;
        document.getElementById('wRes').innerText = size;
        document.getElementById('wRes').className = `prediction-text text-8xl ${size === 'BIG' ? 'size-glow-big' : 'size-glow-small'}`;
        document.getElementById('opNums').innerText = `${op1}, ${op2}`;
        loader.classList.add('hidden');
    }, 1000);
};

document.getElementById('historyToggle').onclick = () => {
    document.getElementById('historyPanel').classList.toggle('hidden');
};

setInterval(fetchAPI, 5000);
fetchAPI();
