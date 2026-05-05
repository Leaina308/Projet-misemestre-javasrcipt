// Dashboard
const dashboardBtn = document.getElementById('dashboard-btn');
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
function updateUI() {
    const key = months[currentMonth] + " " + year;

    monthDisplay.textContent = key;

    if (financeData[key]) {
        document.getElementById("solde").textContent = financeData[key].solde;
        document.getElementById("revenus").textContent = financeData[key].revenus;
        document.getElementById("depenses").textContent = financeData[key].depenses;
}
}
prevBtn.addEventListener("click", () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        year--;
    }
    updateUI();
});
nextBtn.addEventListener("click", () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        year++;
    }
    updateUI();
});
updateUI();

// // Budget
// const mois = [
//   "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
//   "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
// ];
// let currentMonth = 3; // Avril (index 3)
// let currentYear = 2026;
// const monthSpan = document.getElementById("month");
// const prevBtn = document.getElementById("prev");
// const nextBtn = document.getElementById("next");
// function updateMonth() {
//   monthSpan.textContent = `${mois[currentMonth]} ${currentYear}`;
// }
// prevBtn.addEventListener("click", () => {
//   currentMonth--;
//   if (currentMonth < 0) {
//     currentMonth = 11;
//     currentYear--;
//   }
//   updateMonth();
// });
// nextBtn.addEventListener("click", () => {
//   currentMonth++;
//   if (currentMonth > 11) {
//     currentMonth = 0;
//     currentYear++;
//   }
//   updateMonth();
// });
// updateMonth();


// // A venir
// document.querySelectorAll("tbody tr").forEach(row => {
//   row.addEventListener("click", () => {
//     alert("Détails de la dépense : " + row.cells[1].textContent);
//   });
// });

// Objectifs



// Historique

