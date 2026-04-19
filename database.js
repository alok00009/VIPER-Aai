import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBeHnf50EYOl87DM-D-etB3rgqqhZlt7fw",
    authDomain: "ghhhh-fb825.firebaseapp.com",
    databaseURL: "https://ghhhh-fb825-default-rtdb.firebaseio.com",
    projectId: "ghhhh-fb825",
    storageBucket: "ghhhh-fb825.firebasestorage.app",
    appId: "1:229182122042:web:07c4adf653f4f8c7d5ed03"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Simple Key System
window.checkKey = async (userKey) => {
    // Firebase mein 'keys' folder mein key check karega
    const snapshot = await get(ref(db, 'access_keys/' + userKey));
    if (snapshot.exists()) {
        localStorage.setItem('viper_auth', 'true');
        return true;
    }
    return false;
};

// Check if already logged in
if (localStorage.getItem('viper_auth') === 'true') {
    document.getElementById('keyOverlay').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
}

document.getElementById('authBtn').onclick = async () => {
    const key = document.getElementById('accessKey').value;
    const ok = await window.checkKey(key);
    if (ok) location.reload(); else alert("Invalid Key!");
};
