const dashboardBtn = document.getElementById('dashboard-btn');
const budgetBtn = document.getElementById('budget-btn');
const upcomingBtn = document.getElementById('upcoming-btn');
const goalsBtn = document.getElementById('goals-btn');
const historyBtn = document.getElementById('history-btn');
const settingsBtn = document.getElementById('settings-btn');


dashboardBtn.addEventListener('click', () => {
    console.log('Dashboard button clicked');
});

const months = [
    "Janvier", "Février", "Mars", "Avril",
    "Mai", "Juin", "Juillet", "Août",
    "Septembre", "Octobre", "Novembre", "Décembre"
];

let currentMonth = 3; // Avril
let year = 2026;

const monthDisplay = document.getElementById("month");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

// 👉 DONNÉES PAR MOIS
const financeData = {
    "Mars 2026": {
        solde: "300 000 Ar",
        revenus: "1 200 000 Ar",
        depenses: "900 000 Ar",
    },
    "Avril 2026": {
        solde: "450 000 Ar",
        revenus: "1 500 000 Ar",
        depenses: "1 050 000 Ar",
    },
    "Mai 2026": {
        solde: "600 000 Ar",
        revenus: "1 800 000 Ar",
        depenses: "1 200 000 Ar",
    }
};

// 👉 update UI
function updateUI() {
    const key = months[currentMonth] + " " + year;

    monthDisplay.textContent = key;

    if (financeData[key]) {
        document.getElementById("solde").textContent = financeData[key].solde;
        document.getElementById("revenus").textContent = financeData[key].revenus;
        document.getElementById("depenses").textContent = financeData[key].depenses;
        document.getElementById("total-depenses").textContent = financeData[key].totalDepenses;
    }
}

// ◀ mois précédent
prevBtn.addEventListener("click", () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        year--;
    }
    updateUI();
});

// ▶ mois suivant
nextBtn.addEventListener("click", () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        year++;
    }
    updateUI();
});

// init
updateUI();

budgetBtn.addEventListener('click', () => {
    console.log('Budget button clicked');
});

upcomingBtn.addEventListener('click', () => {
    console.log('Upcoming button clicked');
});

goalsBtn.addEventListener('click', () => {
    console.log('Goals button clicked');
});

historyBtn.addEventListener('click', () => {
    console.log('History button clicked');
});

settingsBtn.addEventListener('click', () => {
    console.log('Settings button clicked');
});
