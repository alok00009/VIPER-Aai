import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-analytics.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "ghhhh-fb825.firebaseapp.com",
    databaseURL: "https://ghhhh-fb825-default-rtdb.firebaseio.com",
    projectId: "ghhhh-fb825",
    storageBucket: "ghhhh-fb825.firebasestorage.app",
    messagingSenderId: "229182122042",
    appId: "1:229182122042:web:07c4adf653f4f8c7d5ed03",
    measurementId: "G-74DGZ73EGF"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Windo variable to communicate authorization to other scripts
window.VIP_USER_ACTIVE = false;

document.getElementById('authBtn').addEventListener('click', function() {
    window.VIP_USER_ACTIVE = true; // Temporary flag for testing without real Firebase login
    localStorage.setItem('vipUserAuth', 'true');
    showDashboard();
});

document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('vipUserAuth');
    location.reload();
});

// Check if user is already authenticated
if (localStorage.getItem('vipUserAuth') === 'true') {
    showDashboard();
} else {
    showAuth();
}

function showDashboard() {
    document.getElementById('loadingPage').classList.add('hidden');
    document.getElementById('dashboardPage').classList.remove('hidden');
    document.getElementById('authPage').classList.add('hidden');
}

function showAuth() {
    document.getElementById('loadingPage').classList.add('hidden');
    document.getElementById('dashboardPage').classList.add('hidden');
    document.getElementById('authPage').classList.remove('hidden');
}
