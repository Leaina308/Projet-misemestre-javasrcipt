let transactions = [];
let upcoming = [];
let goals = [];
let categories = [];
let currentDisplayMonth = new Date();
function init() {
    loadData();
        if (categories.length === 0) initDefaultCategories();
        if (transactions.length === 0) initDefaultTransactions();
        if (upcoming.length === 0) initDefaultUpcoming();
        if (goals.length === 0) initDefaultGoals();
        saveData();
        renderAll();
}
function initDefaultCategories() {
    categories = [
        { id: 1, name: "Logement", color: "#3b82f6", subCategories: [{ id: 11, name: "Loyer" }, { id: 12, name: "Électricité" }, { id: 13, name: "Internet" }] },
        { id: 2, name: "Transport", color: "#f59e0b", subCategories: [{ id: 21, name: "Essence" }, { id: 22, name: "Transport en commun" }] },
        { id: 3, name: "Loisirs", color: "#8b5cf6", subCategories: [{ id: 31, name: "Cinéma" }, { id: 32, name: "Sport" }, { id: 33, name: "Netflix" }] },
        { id: 4, name: "Alimentation", color: "#10b981", subCategories: [{ id: 41, name: "Supermarché" }, { id: 42, name: "Restaurant" }] },
        { id: 5, name: "Revenus", color: "#ef4444", subCategories: [{ id: 51, name: "Salaire" }, { id: 52, name: "Freelance" }] }
    ];
}
function initDefaultTransactions() {
    const today = new Date().toISOString().split('T')[0];
    transactions = [
        { id: 1, type: "income", label: "Salaire", amount: 1500000, categoryId: 5, subCategoryId: 51, date: today },
        { id: 2, type: "expense", label: "Loyer", amount: 470000, categoryId: 1, subCategoryId: 11, date: today },
        { id: 3, type: "expense", label: "Essence", amount: 210000, categoryId: 2, subCategoryId: 21, date: today },
        { id: 4, type: "expense", label: "Cinéma", amount: 158000, categoryId: 3, subCategoryId: 31, date: today },
        { id: 5, type: "expense", label: "Supermarché", amount: 126000, categoryId: 4, subCategoryId: 41, date: today },
        { id: 6, type: "expense", label: "Divers", amount: 86000, categoryId: 1, subCategoryId: 12, date: today }
    ];
}
function initDefaultUpcoming() {
    const today = new Date();
    upcoming = [
        { id: 1, label: "loyer", amount: 600000, categoryId: 1, frequency: "monthly", nextDate: getDateString(today, 3) },
        { id: 2, label: "Netflix", amount: 32000, categoryId: 3, frequency: "monthly", nextDate: getDateString(today, 6) },
        { id: 3, label: "Crédit voiture", amount: 180000, categoryId: 2, frequency: "monthly", nextDate: getDateString(today, 8) }
    ];
}
function getDateString(date, daysToAdd) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + daysToAdd);
    return newDate.toISOString().split('T')[0];
}
function initDefaultGoals() {
    goals = [
    { id: 1, name: "Vacances été", targetAmount: 2500000, savedAmount: 1550000, deadline: "2026-08-01", deposits: [], status: "active" },
    { id: 2, name: "Nouvel ordinateur", targetAmount: 4000000, savedAmount: 1120000, deadline: "2026-12-01", deposits: [], status: "active" }
    ];
}
function loadData() {
    const saved = localStorage.getItem("pfm_transactions");
        if (saved) transactions = JSON.parse(saved);
            const savedUp = localStorage.getItem("pfm_upcoming");
        if (savedUp) upcoming = JSON.parse(savedUp);
            const savedGoals = localStorage.getItem("pfm_goals");
        if (savedGoals) goals = JSON.parse(savedGoals);
            const savedCats = localStorage.getItem("pfm_categories");
        if (savedCats) categories = JSON.parse(savedCats);
}
function saveData() {
    localStorage.setItem("pfm_transactions", JSON.stringify(transactions));
    localStorage.setItem("pfm_upcoming", JSON.stringify(upcoming));
    localStorage.setItem("pfm_goals", JSON.stringify(goals));
    localStorage.setItem("pfm_categories", JSON.stringify(categories));
}
function getCategoryName(id) {
    const cat = categories.find(c => c.id === id);
    return cat ? cat.name : "Autre";
}
function getCategoryColor(id) {
    const cat = categories.find(c => c.id === id);
    return cat ? cat.color : "#64748b";
}
function changeMonth(delta) {
    currentDisplayMonth.setMonth(currentDisplayMonth.getMonth() + delta);
    renderDashboard();
}
function getMonthTransactions() {
    const year = currentDisplayMonth.getFullYear();
    const month = currentDisplayMonth.getMonth();
    return transactions.filter(t => {
        const d = new Date(t.date);
         return d.getFullYear() === year && d.getMonth() === month;
    });
}
function renderAll() {
    renderDashboard();
    renderBudget();
    renderUpcoming();
    renderGoals();
    renderHistory();
    renderSettings();
}
function renderDashboard() {
    const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    const year = currentDisplayMonth.getFullYear();
    const month = currentDisplayMonth.getMonth();
    document.getElementById('currentMonth').innerText = `${monthNames[month]} ${year}`;
        const monthTransactions = getMonthTransactions();
        const totalIncome = monthTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
        const totalExpense = monthTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
        const balance = totalIncome - totalExpense;
        const incomeCount = monthTransactions.filter(t => t.type === 'income').length;
        const expenseCount = monthTransactions.filter(t => t.type === 'expense').length;
    document.getElementById('dashboardKpis').innerHTML = `
        <div class="kpi-card">
            <div class="kpi-label">💰 SOLDE ACTUEL</div>
            <div class="kpi-value">${balance.toLocaleString()} Ar</div>
            <div class="kpi-sub"><span class="trend-up">+5.2%</span> vs mois dernier</div>
        </div>
        <div class="kpi-card">
            <div class="kpi-label">📈 REVENUS</div>
            <div class="kpi-value">${totalIncome.toLocaleString()} Ar</div>
            <div class="kpi-sub"><span class="trend-neutral">${incomeCount} entrées</span> ce mois</div>
        </div>
        <div class="kpi-card">
            <div class="kpi-label">📉 DÉPENSES</div>
            <div class="kpi-value">${totalExpense.toLocaleString()} Ar</div>
            <div class="kpi-sub"><span class="trend-neutral">${expenseCount} transactions</span></div>
        </div>`;
    // Expense breakdown
    const expensesByCat = {};
        monthTransactions.filter(t => t.type === 'expense').forEach(t => {
            const catName = getCategoryName(t.categoryId);
            const catColor = getCategoryColor(t.categoryId);
            if (!expensesByCat[catName]) {
                expensesByCat[catName] = { amount: 0, color: catColor };
            }
            expensesByCat[catName].amount += t.amount;
        });
    const totalExpenses = Object.values(expensesByCat).reduce((s, c) => s + c.amount, 0);
    const expenseCategories = Object.entries(expensesByCat).sort((a, b) => b[1].amount - a[1].amount);
        let expenseHtml = `
            <div class="expense-total">
                <span class="expense-total-label">Total</span>
                <span class="expense-total-value">${totalExpenses.toLocaleString()} Ar</span>
            </div>`;
        expenseCategories.forEach(([catName, data]) => {
            const percent = totalExpenses > 0 ? ((data.amount / totalExpenses) * 100).toFixed(0) : 0;
            expenseHtml += `
            <div class="expense-item">
                <div class="expense-item-left">
                    <div class="expense-color" style="background: ${data.color}"></div>
                        <span class="expense-name">${catName}</span>
                </div>
                <div>
                    <span class="expense-amount">${data.amount.toLocaleString()} Ar</span>
                    <span class="expense-percent">${percent}%</span>
                </div>
            </div>`;
        });
    document.getElementById('expenseBreakdown').innerHTML = expenseHtml;
    // Weekly upcoming
    const today = new Date();
    const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + 7);
        const weeklyUpcoming = upcoming.filter(u => {
        const nextDate = new Date(u.nextDate);
            return nextDate >= today && nextDate <= endOfWeek;
        }).sort((a, b) => new Date(a.nextDate) - new Date(b.nextDate));
        const daysLeft = (dateStr) => {
        const diff = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
            return diff === 0 ? "aujourd'hui" : `dans ${diff} jours`;
        };
        const upcomingHtml = weeklyUpcoming.map(u => `
            <div class="upcoming-item">
                <div class="upcoming-info">
                    <h4>${u.label}</h4>
                    <div class="upcoming-date">${u.nextDate} - ${daysLeft(u.nextDate)}</div>
                </div>
                <div>
                    <div class="upcoming-amount">${u.amount.toLocaleString()} Ar</div>
                </div>
            </div>`).join('');
    document.getElementById('weeklyUpcoming').innerHTML = upcomingHtml || '<p style="color: var(--gray); text-align: center;">Aucune charge cette semaine</p>';
        // Goals progress
        const goalsHtml = goals.map(g => {
            const percent = (g.savedAmount / g.targetAmount) * 100;
            return `
                <div class="goal-item">
                    <div class="goal-header">
                        <span class="goal-name">${g.name}</span>
                        <span class="goal-percent">${Math.round(percent)}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${percent}%"></div>
                    </div>
                    <div class="goal-stats">
                        ${g.savedAmount.toLocaleString()} Ar sur ${g.targetAmount.toLocaleString()} Ar
                    </div>
                </div>`;
        }).join('');
    document.getElementById('dashboardGoals').innerHTML = goalsHtml || '<p style="color: var(--gray);">Aucun objectif défini</p>';}
function renderBudget() {
    const year = currentDisplayMonth.getFullYear();
    const month = currentDisplayMonth.getMonth();
    const monthTransactions = transactions.filter(t => {
    const d = new Date(t.date);
        return d.getFullYear() === year && d.getMonth() === month;
    });
    const tbody = document.querySelector('#transactionsList');
    tbody.innerHTML = monthTransactions.map(t => `
        <tr>
            <td>${t.date}</td>
            <td>${t.label}</td>
            <td>${getCategoryName(t.categoryId)}</td>
            <td style="color: ${t.type === 'income' ? '#10b981' : '#ef4444'}">${t.type === 'income' ? '+' : '-'} ${t.amount.toLocaleString()} Ar</td>
            <td><button class="btn btn-danger" style="padding: 4px 8px;" onclick="deleteTransaction(${t.id})">Supprimer</button></td>
        </tr>`).join('');
    const catSelect = document.getElementById('transCategory');
        catSelect.innerHTML = categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
        updateSubCategories();
    document.getElementById('transDate').value = new Date().toISOString().split('T')[0];}
function updateSubCategories() {
    const catId = parseInt(document.getElementById('transCategory').value);
    const cat = categories.find(c => c.id === catId);
    const subSelect = document.getElementById('transSubCategory');
        if (cat) {
            subSelect.innerHTML = cat.subCategories.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
        }
}
function deleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    saveData();
    renderBudget();
    renderDashboard();
}
    document.getElementById('transactionForm').addEventListener('submit', (e) => {
        e.preventDefault();
        transactions.push({
            id: Date.now(),
            type: document.getElementById('transType').value,
            label: document.getElementById('transLabel').value,
            amount: parseInt(document.getElementById('transAmount').value),
            categoryId: parseInt(document.getElementById('transCategory').value),
            subCategoryId: parseInt(document.getElementById('transSubCategory').value),
            date: document.getElementById('transDate').value
        });
        saveData();
        renderBudget();
        renderDashboard();
        e.target.reset();
        document.getElementById('transDate').value = new Date().toISOString().split('T')[0];
    });
function renderUpcoming() {
    const container = document.getElementById('upcomingList');
    container.innerHTML = upcoming.map(u => `
        <div class="upcoming-item">
            <div class="upcoming-info">
                <h4>${u.label}</h4>
                <p style="font-size: 0.75rem; color: var(--gray);">${u.frequency === 'monthly' ? 'Mensuel' : 'Annuel'} - ${u.nextDate}</p>
            </div>
            <div>
                <strong class="upcoming-amount">${u.amount.toLocaleString()} Ar</strong><br>
                <button class="btn btn-danger" style="padding: 2px 8px; margin-top: 5px;" onclick="deleteUpcoming(${u.id})">Supprimer</button>
            </div>
        </div>`).join('');
}
function deleteUpcoming(id) {
    upcoming = upcoming.filter(u => u.id !== id);
    saveData();
    renderUpcoming();
    renderDashboard();
}
    document.getElementById('upcomingForm').addEventListener('submit', (e) => {
        e.preventDefault();
        upcoming.push({
            id: Date.now(),
            label: document.getElementById('upLabel').value,
            amount: parseInt(document.getElementById('upAmount').value),
            categoryId: 3,
            frequency: document.getElementById('upFrequency').value,
            nextDate: document.getElementById('upNextDate').value
        });
        saveData();
        renderUpcoming();
        renderDashboard();
        e.target.reset();
    });
function renderGoals() {
    const container = document.getElementById('goalsList');
    container.innerHTML = goals.map(g => {
    const percent = (g.savedAmount / g.targetAmount) * 100;
        return `
            <div class="goal-card">
                <h3>🎯 ${g.name}</h3>
                <div style="margin: 1rem 0;">
                    <svg width="100" height="100" viewBox="0 0 120 120" style="margin: 0 auto; display: block;">
                        <circle cx="60" cy="60" r="50" fill="none" stroke="#e2e8f0" stroke-width="8"/>
                        <circle cx="60" cy="60" r="50" fill="none" stroke="#2463eb" stroke-width="8" 
                        stroke-dasharray="${2 * Math.PI * 50}" stroke-dashoffset="${2 * Math.PI * 50 * (1 - percent/100)}"
                        transform="rotate(-90 60 60)" stroke-linecap="round"/>
                        <text x="60" y="65" text-anchor="middle" font-size="14" fill="#1e293b">${Math.round(percent)}%</text>
                    </svg>
                </div>
                <p><strong>${g.savedAmount.toLocaleString()}</strong> / ${g.targetAmount.toLocaleString()} Ar</p>
                ${g.deadline ? `<p style="font-size: 0.75rem; color: var(--gray);">📅 ${g.deadline}</p>` : ''}
                <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                    <input type="number" id="deposit-${g.id}" placeholder="Montant" style="flex: 1;">
                    <button class="btn btn-success" onclick="depositToGoal(${g.id})">Verser</button>
                    <button class="btn btn-danger" onclick="deleteGoal(${g.id})">🗑️</button>
                </div>
            </div>`;
    }).join('');
}
function depositToGoal(id) {
    const input = document.getElementById(`deposit-${id}`);
    const amount = parseInt(input.value);
        if (amount > 0) {
            const goal = goals.find(g => g.id === id);
            goal.savedAmount = Math.min(goal.savedAmount + amount, goal.targetAmount);
            if (goal.savedAmount >= goal.targetAmount) goal.status = "completed";
                saveData();
                renderGoals();
                renderDashboard();
            }
        input.value = '';
}
function deleteGoal(id) {
    goals = goals.filter(g => g.id !== id);
    saveData();
    renderGoals();
    renderDashboard();
}
document.getElementById('goalForm').addEventListener('submit', (e) => {
    e.preventDefault();
    goals.push({
        id: Date.now(),
        name: document.getElementById('goalName').value,
        targetAmount: parseInt(document.getElementById('goalTarget').value),
        savedAmount: 0,
        deadline: document.getElementById('goalDeadline').value,
        deposits: [],
        status: "active"
    });
    saveData();
    renderGoals();
    renderDashboard();
    e.target.reset();
});
function renderHistory() {
    const catSelect = document.getElementById('historyCategory');
    catSelect.innerHTML = '<option value="">Toutes</option>' + categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    applyHistoryFilters();
}
function applyHistoryFilters() {
    let filtered = [...transactions];
    const period = document.getElementById('historyPeriod').value;
    const now = new Date();
        if (period === 'month') {
            filtered = filtered.filter(t => new Date(t.date).getMonth() === now.getMonth() && new Date(t.date).getFullYear() === now.getFullYear());
        } 
        else if (period === '3months') {
            const threeMonthsAgo = new Date(); threeMonthsAgo.setMonth(now.getMonth() - 3);
            filtered = filtered.filter(t => new Date(t.date) >= threeMonthsAgo);
        } 
        else if (period === 'year') {
            filtered = filtered.filter(t => new Date(t.date).getFullYear() === now.getFullYear());
        } 
        else if (period === 'custom') {
            const start = document.getElementById('dateStart').value;
            const end = document.getElementById('dateEnd').value;
            if (start) filtered = filtered.filter(t => t.date >= start);
            if (end) filtered = filtered.filter(t => t.date <= end);
        }
    const category = document.getElementById('historyCategory').value;
        if (category) filtered = filtered.filter(t => t.categoryId === parseInt(category));
    const type = document.getElementById('historyType').value;
        if (type) filtered = filtered.filter(t => t.type === type);
    const tbody = document.getElementById('historyList');
        tbody.innerHTML = filtered.map(t => `
            <tr>
                <td>${t.date}</td>
                <td>${t.label}</td>
                <td>${getCategoryName(t.categoryId)}</td><td>${t.type === 'income' ? 'Revenu' : 'Dépense'}</td>
                <td style="color: ${t.type === 'income' ? '#10b981' : '#ef4444'}">${t.type === 'income' ? '+' : '-'} ${t.amount.toLocaleString()} Ar</td>
            </tr>`).join('');
    const totalIncome = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const totalExpense = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    document.getElementById('historySummary').innerHTML = `
        <div class="kpi-card"><div class="kpi-label">Revenus</div><div class="kpi-value positive">${totalIncome.toLocaleString()} Ar</div></div>
        <div class="kpi-card"><div class="kpi-label">Dépenses</div><div class="kpi-value negative">${totalExpense.toLocaleString()} Ar</div></div>
        <div class="kpi-card"><div class="kpi-label">Solde net</div><div class="kpi-value">${(totalIncome - totalExpense).toLocaleString()} Ar</div></div>`;
}
function toggleCustomDate() {
    document.getElementById('customDateRange').style.display = document.getElementById('historyPeriod').value === 'custom' ? 'flex' : 'none';
}
function exportToCSV() {
    let csv = "Date,Libellé,Type,Catégorie,Montant (Ar)\n";
    transactions.forEach(t => {
        csv += `${t.date},${t.label},${t.type === 'income' ? 'Revenu' : 'Dépense'},${getCategoryName(t.categoryId)},${t.amount}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
}
function renderSettings() {
    const container = document.getElementById('categoriesList');
    container.innerHTML = categories.map(c => `
        <div class="category-item">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div><span style="display: inline-block; width: 16px; height: 16px; background: ${c.color}; border-radius: 4px;"></span> <strong>${c.name}</strong></div>
                <button class="btn btn-danger" style="padding: 4px 8px;" onclick="deleteCategory(${c.id})">Supprimer</button>
            </div>
            <div style="margin-top: 8px; padding-left: 20px;">
                Sous-catégories: ${c.subCategories.map(s => `<span class="chip">${s.name}</span>`).join(' ')}
            </div>
        </div>`).join('');
}
function addCategory() {
    const name = document.getElementById('newCategoryName').value;
    const color = document.getElementById('newCategoryColor').value;
        if (name) {
            categories.push({
                id: Date.now(),
                    name: name,
                    color: color,
                    ubCategories: []
            });
            saveData();
            renderSettings();
            document.getElementById('newCategoryName').value = '';
        }
}
function deleteCategory(id) {
    categories = categories.filter(c => c.id !== id);
    saveData();
    renderSettings();
}
function resetAllData() {
    if (confirm("Êtes-vous sûr de vouloir réinitialiser toutes les données ?")) {
        localStorage.clear();
        init();
    }
}
function switchToView(viewName) {
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    document.querySelector(`.nav-item[data-view="${viewName}"]`).classList.add('active');
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(viewName).classList.add('active');
        if (viewName === 'dashboard') renderDashboard();
        if (viewName === 'budget') renderBudget();
        if (viewName === 'upcoming') renderUpcoming();
        if (viewName === 'goals') renderGoals();
        if (viewName === 'history') renderHistory();
        if (viewName === 'settings') renderSettings();
}
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
    switchToView(item.dataset.view);
    });
});
init();