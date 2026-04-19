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
export const db = getDatabase(app);

// Authentication Logic
const authBtn = document.getElementById('authBtn');
if(authBtn) {
    authBtn.onclick = async () => {
        const key = document.getElementById('accessKey').value;
        const snapshot = await get(ref(db, 'access_keys/' + key));
        
        if (snapshot.exists()) {
            localStorage.setItem('active_key', key);
            location.reload();
        } else {
            alert("WRONG KEY! ACCESS DENIED 💀");
        }
    };
}

// Auto-Login Check
if (localStorage.getItem('active_key')) {
    document.getElementById('keyOverlay').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
}
