import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import { getDatabase, ref, get, onValue } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-database.js";

// --- NOBITA HACK FIREBASE CONFIG ---
const firebaseConfig = {
    apiKey: "AIzaSyBeHnf50EYOl87DM-D-etB3rgqqhZlt7fw",
    authDomain: "ghhhh-fb825.firebaseapp.com",
    databaseURL: "https://ghhhh-fb825-default-rtdb.firebaseio.com",
    projectId: "ghhhh-fb825",
    storageBucket: "ghhhh-fb825.firebasestorage.app",
    messagingSenderId: "229182122042",
    appId: "1:229182122042:web:07c4adf653f4f8c7d5ed03",
    measurementId: "G-74DGZ73EGF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

// --- ELEMENTS ---
const authBtn = document.getElementById('authBtn');
const keyInput = document.getElementById('accessKey');
const keyOverlay = document.getElementById('keyOverlay');
const mainApp = document.getElementById('mainApp');

// --- AUTHENTICATION LOGIC ---
if (authBtn) {
    authBtn.onclick = async () => {
        const inputKey = keyInput.value.trim().toUpperCase();
        
        if (!inputKey) {
            alert("BHAI, KEY TOH DALO! 💀");
            return;
        }

        try {
            // Firebase mein 'access_keys' folder ke andar key check karega
            const keyRef = ref(db, 'access_keys/' + inputKey);
            const snapshot = await get(keyRef);

            if (snapshot.exists()) {
                // Key valid hai, local storage mein save karo
                localStorage.setItem('active_key', inputKey);
                location.reload(); // Page refresh karke hack unlock karega
            } else {
                alert("INVALID KEY! ACCESS DENIED 💀");
            }
        } catch (error) {
            console.error("Auth Error:", error);
            alert("DATABASE CONNECTION ERROR!");
        }
    };
}

// --- SESSION & REAL-TIME SECURITY ---
const savedKey = localStorage.getItem('active_key');

if (savedKey) {
    // Pehle check karo ki key database mein abhi bhi active hai ya nahi
    const userKeyRef = ref(db, 'access_keys/' + savedKey);
    
    onValue(userKeyRef, (snapshot) => {
        if (snapshot.exists()) {
            // Key active hai, App dikhao
            keyOverlay.classList.add('hidden');
            mainApp.classList.remove('hidden');
        } else {
            // Agar Admin ne key delete kar di, toh auto-logout
            localStorage.removeItem('active_key');
            alert("YOUR KEY HAS EXPIRED OR DELETED! 💀");
            location.reload();
        }
    });
} else {
    // Key nahi hai, login screen dikhao
    keyOverlay.classList.remove('hidden');
    mainApp.classList.add('hidden');
}
