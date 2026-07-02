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
    window.location.href = '/connexion.html';
}

function updateNavbar() {
    const authLinks = document.getElementById('auth-links');
    const userInfo = document.getElementById('user-info');
    
    if (!authLinks) return;
    
    if (isAuthenticated()) {
        const user = getUser();
        if (user && user.nom) {
            if (authLinks) authLinks.style.display = 'none';
            if (userInfo) {
                userInfo.style.display = 'flex';
                const userNameSpan = document.getElementById('user-name');
                if (userNameSpan) userNameSpan.textContent = user.nom;
            }
        } else {
            logout();
        }
    } else {
        if (authLinks) authLinks.style.display = 'flex';
        if (userInfo) userInfo.style.display = 'none';
    }
}

async function loadAvis() {
    const container = document.getElementById('avis-container');
    if (!container) return;
    
    try {
        const response = await fetch(`${API_URL}/avis/publies`);
        const avis = await response.json();
        
        if (!avis || avis.length === 0) {
            container.innerHTML = '<p class="text-center">Aucun avis pour le moment.</p>';
            return;
        }
        
        container.innerHTML = avis.map(avis => `
            <div class="col-md-4">
                <div class="avis-item">
                    <div class="etoiles">
                        ${'⭐'.repeat(avis.note)}${'☆'.repeat(5 - avis.note)}
                    </div>
                    <p>"${avis.commentaire}"</p>
                    <div class="avis-nom">
                        ${avis.client_nom}
                        <small class="text-muted d-block">${new Date(avis.date_publication).toLocaleDateString('fr-FR')}</small>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erreur chargement avis:', error);
        if (container) container.innerHTML = '<p class="text-center">Erreur de chargement des avis.</p>';
    }
}

async function loadTrajetsAVenir() {
    const container = document.getElementById('trajets-container');
    if (!container) return;
    
    try {
        const response = await fetch(`${API_URL}/trajets/dans-2-jours`);
        const trajets = await response.json();
        
        if (!trajets || trajets.length === 0) {
            container.innerHTML = '<p class="text-center">Aucun trajet dans les 2 prochains jours.</p>';
            return;
        }
        
        container.innerHTML = trajets.map(trajet => `
            <div class="voyage-item">
                <div class="row align-items-center">
                    <div class="col-md-6">
                        <h5>${trajet.depart} → ${trajet.destination}</h5>
                        <p>${new Date(trajet.date_depart).toLocaleDateString('fr-FR')} - ${trajet.heure_depart.substring(0,5)}</p>
                        <span class="statut-confirme">Disponible</span>
                    </div>
                    <div class="col-md-3">
                        <span class="voyage-price">${trajet.frais.toLocaleString()} Ar</span>
                        <small class="text-muted d-block">par personne</small>
                    </div>
                    <div class="col-md-3 text-end">
                        <button class="btn btn-primary" onclick="reserverTrajet(${trajet.id})">Je réserve</button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erreur chargement trajets:', error);
        if (container) container.innerHTML = '<p class="text-center">Erreur de chargement des trajets.</p>';
    }
}

function reserverTrajet(id) {
    if (!isAuthenticated()) {
        window.location.href = '/connexion.html';
    } else {
        window.location.href = `/reservation.html?trajet=${id}`;
    }
}

function cleanAuth() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && !user) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    cleanAuth();
    updateNavbar();
    loadAvis();
    loadTrajetsAVenir();
});