function isAuthenticated() {
    const token = localStorage.getItem('token');
    return token !== null;
}

function getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/index.html';
}

function updateClientNavbar() {
    const userNameSpan = document.getElementById('client-user-name');
    if (userNameSpan && isAuthenticated()) {
        const user = getUser();
        if (user && user.nom) {
            userNameSpan.innerText = user.nom;
        }
    }
}

function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = '/connexion.html';
    }
}

function redirectToDashboard() {
    const user = getUser();
    if (user && user.role === 'admin') {
        window.location.href = '/dashboard-admin.html';
    } else {
        window.location.href = '/dashboard-client.html';
    }
}

function initClientPage() {
    requireAuth();
    updateClientNavbar();
}

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('/dashboard-client.html') ||
        window.location.pathname.includes('/reservation.html') ||
        window.location.pathname.includes('/historique.html')) {
        initClientPage();
    }
});