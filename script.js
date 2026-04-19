import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-database.js";

// Firebase is already initialized in database.js, just connecting database here
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let predictBtn = document.getElementById('predictBtn');
let categoryTab = document.getElementById('openPredictionTab');
let dashboardPlaceholder = document.getElementById('categoryPlaceholder');
let predictionContent = document.getElementById('predictionContent');
let predictionData = document.getElementById('predictionData');

// FIX: Persistent Prediction
// Check for saved prediction on load (to prevent deletion on back)
window.addEventListener('load', function() {
    let savedPred = localStorage.getItem('vipLastPrediction');
    if (savedPred) {
        showPredictionPanel();
        predictionData.innerHTML = savedPred;
    }
});

// Flipkart like category click to open prediction
categoryTab.addEventListener('click', function() {
    if(!window.VIP_USER_ACTIVE) {
        alert("System Proxy: Link authorization required first.");
        return;
    }
    document.querySelectorAll('.category-tab').forEach(tab => tab.classList.remove('active'));
    categoryTab.classList.add('active');
    showPredictionPanel();
});

predictBtn.addEventListener('click', function() {
    predictionData.innerHTML = '<div class="text-xs text-gray-500 font-bold uppercase tracking-widest animate-pulse">Neural inject V15 logic...</div>';
    injectPrediction();
});

function showPredictionPanel() {
    dashboardPlaceholder.classList.add('hidden');
    predictionContent.classList.remove('hidden');
}

async function injectPrediction() {
    // Connect to external lottery data API to fetch Period and Numbers
    const res = await fetch("https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json");
    const data = await res.json();
    const latest = data.data.list[0];

    // Core VIP V15 Mathematical Logic
    let num = latest.number;
    let logic = Math.floor((num + 7) * 0.15);
    let size = logic >= 5 ? "BIG" : "SMALL";
    
    // Reverse RNG logic for Opposite Numbers
    let opp1 = Math.abs(latest.number - 9);
    let opp2 = Math.abs((latest.number + 5) % 10 - 4);
    
    // Strict pattern matching for VIP status
    let status = latest.number % 2 === 0 ? "WIN 🐯" : "RETRY 👾";

    // Period number structure: 20260418 + 01 + 0461 (for 1 minute Wingo)
    let period = latest.issueNumber;

    // Premium glowing UI structure (Design Copy from image)
    const HTML_STRUCTURE = `
        <div class="space-y-2">
            <p class="text-[10px] text-gray-500 uppercase tracking-widest font-bold">PERIOD: ${period}</p>
            <div class="prediction-text space-y-2">
                <p class="size-display ${size === 'BIG' ? 'text-[#ff3c73] size-glow-big' : 'text-[#10b981] size-glow-small'}">${size}</p>
            </div>
        </div>
        
        <div class="premium-opposite-box border border-dashed border-[#fffb13] p-5 rounded-2xl">
            <p class="text-xs text-[#fffb13] font-black uppercase tracking-widest mb-2">Opposite Numbers:</p>
            <div class="hacker-font text-2xl font-bold text-white tracking-widest text-shadow-glow">${opp1}, ${opp2}</div>
        </div>
    `;

    // Inject to UI
    predictionData.innerHTML = HTML_STRUCTURE;

    // FIX: Save prediction to localStorage to keep it persistent across page navigations
    localStorage.setItem('vipLastPrediction', HTML_STRUCTURE);
}

document.addEventListener('contextmenu', e => e.preventDefault());
