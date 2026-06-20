/**
 * FINTRACK Auth Guard
 * Include this script on every protected page.
 * It checks for a valid JWT token and redirects to Login if not found.
 */

// Auto-detect: pakai Railway jika bukan localhost
const RAILWAY_URL = 'https://fintrack-production-b81d.up.railway.app/api';
const API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:5000/api'
    : RAILWAY_URL;


// --- Auth Guard (for all protected pages) ---
function checkAuth() {
    const token = localStorage.getItem('fintrack_token');
    if (!token) {
        window.location.href = 'Login.html';
        return null;
    }
    return token;
}

// --- Admin Guard (only for admin.html) ---
function checkAdmin() {
    const token = localStorage.getItem('fintrack_token');
    if (!token) { window.location.href = 'Login.html'; return null; }
    const user = getCurrentUser();
    if (!user || user.role !== 'admin') {
        window.location.href = 'dashboard.html';
        return null;
    }
    return token;
}

// --- Get Current User from localStorage ---
function getCurrentUser() {
    const user = localStorage.getItem('fintrack_user');
    return user ? JSON.parse(user) : null;
}

// --- Get Role ---
function getRole() {
    const user = getCurrentUser();
    return user ? user.role : null;
}

// --- Logout ---
function logout() {
    localStorage.removeItem('fintrack_token');
    localStorage.removeItem('fintrack_user');
    window.location.href = 'Login.html';
}

// --- Authenticated Fetch Wrapper ---
async function apiFetch(endpoint, options = {}) {
    const token = checkAuth();
    if (!token) return null;
    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...(options.headers || {})
        }
    });
    if (res.status === 401) {
        logout();
        return null;
    }
    return res.json();
}

// --- Admin Fetch (uses checkAdmin guard, no redirect loop) ---
async function adminFetch(endpoint, options = {}) {
    const token = localStorage.getItem('fintrack_token');
    if (!token) { window.location.href = 'Login.html'; return null; }
    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...(options.headers || {})
        }
    });
    if (res.status === 401) { logout(); return null; }
    if (res.status === 403) {
        alert('Akses ditolak. Anda bukan Admin.');
        window.location.href = 'dashboard.html';
        return null;
    }
    return res.json();
}

// --- Populate User Info in UI ---
function populateUserUI() {
    const user = getCurrentUser();
    if (!user) return;

    const initials = user.nama_lengkap
        ? user.nama_lengkap.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()
        : 'FT';

    document.querySelectorAll('[data-user-name]').forEach(el => {
        el.textContent = user.nama_lengkap || 'Pengguna';
    });
    document.querySelectorAll('[data-user-email]').forEach(el => {
        el.textContent = user.email || '';
    });
    document.querySelectorAll('[data-user-initials]').forEach(el => {
        el.textContent = initials;
    });
    document.querySelectorAll('[data-user-greeting]').forEach(el => {
        const firstName = user.nama_lengkap ? user.nama_lengkap.split(' ')[0] : 'Pengguna';
        el.textContent = `Halo, ${firstName}!`;
    });
}

// --- Format Currency ---
function formatRupiah(amount) {
    if (!amount && amount !== 0) return 'Rp 0';
    return 'Rp ' + parseFloat(amount).toLocaleString('id-ID');
}

// --- Format Date ---
function formatTanggal(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}
