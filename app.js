// ================= MOCK DATA INITIALIZATION =================
let transactions = [
  { id: "1", description: "Salário Mensal", amount: 8500.00, type: "INCOME", category: "SALARIO", date: "2026-06-05" },
  { id: "2", description: "Freelance UI Design", amount: 950.00, type: "INCOME", category: "EXTRA", date: "2026-06-15" },
  { id: "3", description: "Almoço de Negócios", amount: 120.00, type: "EXPENSE", category: "ALIMENTACAO", date: "2026-06-10" },
  { id: "4", description: "Supermercado Semanal", amount: 480.50, type: "EXPENSE", category: "MERCADO", date: "2026-06-12" },
  { id: "5", description: "Combustível Semanal", amount: 220.00, type: "EXPENSE", category: "TRANSPORTE", date: "2026-06-08" },
  { id: "6", description: "Assinatura Netflix", amount: 55.90, type: "EXPENSE", category: "OUTROS", date: "2026-06-05" },
  { id: "7", description: "Jantar Delivery", amount: 98.00, type: "EXPENSE", category: "ALIMENTACAO", date: "2026-06-18" },
  { id: "8", description: "Corrida de Uber", amount: 35.40, type: "EXPENSE", category: "TRANSPORTE", date: "2026-06-20" },
  { id: "9", description: "Compra de Farmácia", amount: 85.00, type: "EXPENSE", category: "OUTROS", date: "2026-06-22" }
];

// Categorias e seus metadados (Emojis e Nomes de exibição)
const CATEGORIES_METADATA = {
  SALARIO: { name: "Salário", emoji: "💼", color: "#10b981" },
  EXTRA: { name: "Renda Extra", emoji: "💸", color: "#10b981" },
  ALIMENTACAO: { name: "Alimentação", emoji: "🍔", color: "#f59e0b" },
  MERCADO: { name: "Mercado", emoji: "🛒", color: "#3b82f6" },
  TRANSPORTE: { name: "Transporte", emoji: "🚗", color: "#ec4899" },
  OUTROS: { name: "Outros", emoji: "📦", color: "#8b5cf6" }
};

// ================= ESTADO GLOBAL DO APLICATIVO =================
let currentFilter = "ALL";
let selectedType = "EXPENSE"; // Default no Modal
let selectedCategory = ""; 

// ================= ELEMENTOS DO DOM =================
const screenDashboard = document.getElementById("screen-dashboard");
const screenHistory = document.getElementById("screen-history");
const navDashboard = document.getElementById("nav-dashboard");
const navHistory = document.getElementById("nav-history");
const btnFabAdd = document.getElementById("btn-fab-add");
const btnSeeAll = document.getElementById("btn-see-all");
const btnHistoryBack = document.getElementById("btn-history-back");

const addSheetOverlay = document.getElementById("add-sheet-overlay");
const btnCloseAdd = document.getElementById("btn-close-add");
const typeExpense = document.getElementById("type-expense");
const typeIncome = document.getElementById("type-income");
const addForm = document.getElementById("add-transaction-form");
const categorySelectorGrid = document.getElementById("category-selector-grid");

const editSheetOverlay = document.getElementById("edit-sheet-overlay");
const btnCloseEdit = document.getElementById("btn-close-edit");
const editForm = document.getElementById("edit-transaction-form");
const btnDeleteTransaction = document.getElementById("btn-delete-transaction");
const editCategorySelectorGrid = document.getElementById("edit-category-selector-grid");

// ================= INICIALIZAÇÃO =================
document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  updateUI();
});

// ================= LISTENERS DE EVENTO =================
function setupEventListeners() {
  // Navegação entre telas
  navDashboard.addEventListener("click", () => navigateTo("dashboard"));
  navHistory.addEventListener("click", () => navigateTo("history"));
  btnSeeAll.addEventListener("click", () => navigateTo("history"));
  btnHistoryBack.addEventListener("click", () => navigateTo("dashboard"));

  // Abrir e fechar Bottom Sheets
  btnFabAdd.addEventListener("click", openAddSheet);
  btnCloseAdd.addEventListener("click", closeAddSheet);
  btnCloseEdit.addEventListener("click", closeEditSheet);
  
  // Fechar clicando no background do overlay
  addSheetOverlay.addEventListener("click", (e) => {
    if (e.target === addSheetOverlay) closeAddSheet();
  });
  editSheetOverlay.addEventListener("click", (e) => {
    if (e.target === editSheetOverlay) closeEditSheet();
  });

  // Alternar Tipo no Formulário de Adicionar (Receita vs Despesa)
  typeExpense.addEventListener("click", () => setFormType("EXPENSE"));
  typeIncome.addEventListener("click", () => setFormType("INCOME"));

  // Submissão dos Formulários
  addForm.addEventListener("submit", handleAddSubmit);
  editForm.addEventListener("submit", handleEditSubmit);

  // Exclusão de Transações
  btnDeleteTransaction.addEventListener("click", handleDeleteTransaction);

  // Filtros na tela de histórico
  document.querySelectorAll(".filter-pill").forEach(pill => {
    pill.addEventListener("click", (e) => {
      document.querySelectorAll(".filter-pill").forEach(p => p.classList.remove("active"));
      e.target.classList.add("active");
      currentFilter = e.target.dataset.filter;
      renderHistoryList();
    });
  });
}

// ================= FLUXO DE NAVEGAÇÃO =================
function navigateTo(screenName) {
  if (screenName === "dashboard") {
    screenDashboard.classList.add("active");
    screenHistory.classList.remove("active");
    navDashboard.classList.add("active");
    navHistory.classList.remove("active");
  } else if (screenName === "history") {
    screenHistory.classList.add("active");
    screenDashboard.classList.remove("active");
    navHistory.classList.add("active");
    navDashboard.classList.remove("active");
    renderHistoryList();
  }
}

// ================= CONTROLADORES DOS MODAIS / GAVETAS =================
function openAddSheet() {
  addSheetOverlay.classList.add("active");
  setFormType("EXPENSE"); // Reinicia para despesa por padrão
  document.getElementById("add-amount").value = "";
  document.getElementById("add-description").value = "";
  document.getElementById("add-amount").focus();
}

function closeAddSheet() {
  addSheetOverlay.classList.remove("active");
}

function openEditSheet(transaction) {
  editSheetOverlay.classList.add("active");
  
  document.getElementById("edit-id").value = transaction.id;
  document.getElementById("edit-amount").value = transaction.amount;
  document.getElementById("edit-description").value = transaction.description;
  
  // Atualiza exibição de tipo
  const editTypeDisplay = document.getElementById("edit-type-display");
  if (transaction.type === "INCOME") {
    editTypeDisplay.textContent = "Receita";
    editTypeDisplay.style.color = "var(--color-income)";
  } else {
    editTypeDisplay.textContent = "Despesa";
    editTypeDisplay.style.color = "var(--color-expense)";
  }

  // Gera grid de categorias de edição baseados no tipo
  selectedCategory = transaction.category;
  renderCategoryGrid(transaction.type, editCategorySelectorGrid, true);
}

function closeEditSheet() {
  editSheetOverlay.classList.remove("active");
}

// ================= CONTROLES DE FORMULÁRIO DE CADASTRO =================
function setFormType(type) {
  selectedType = type;
  if (type === "EXPENSE") {
    typeExpense.classList.add("active");
    typeIncome.classList.remove("active");
    selectedCategory = "ALIMENTACAO"; // Categoria default
  } else {
    typeIncome.classList.add("active");
    typeExpense.classList.remove("active");
    selectedCategory = "SALARIO"; // Categoria default
  }
  renderCategoryGrid(type, categorySelectorGrid, false);
}

// Renderiza a lista visual de categorias (botões circulares com emoji)
function renderCategoryGrid(type, targetGrid, isEdit) {
  targetGrid.innerHTML = "";
  
  const cats = type === "EXPENSE" 
    ? ["ALIMENTACAO", "MERCADO", "TRANSPORTE", "OUTROS"]
    : ["SALARIO", "EXTRA"];

  cats.forEach(catKey => {
    const cat = CATEGORIES_METADATA[catKey];
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `cat-select-btn ${selectedCategory === catKey ? "selected" : ""}`;
    btn.innerHTML = `
      <span class="cat-select-icon">${cat.emoji}</span>
      <span class="cat-select-label">${cat.name}</span>
    `;
    btn.addEventListener("click", () => {
      selectedCategory = catKey;
      // Atualiza seleção visual dos botões no grid
      targetGrid.querySelectorAll(".cat-select-btn").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
    });
    targetGrid.appendChild(btn);
  });
}

// ================= CONTROLADORES DE SUBMISSÃO (CRUD EM MEMÓRIA) =================
function handleAddSubmit(e) {
  e.preventDefault();
  
  const amountVal = parseFloat(document.getElementById("add-amount").value);
  const descVal = document.getElementById("add-description").value.trim();
  const today = new Date().toISOString().split("T")[0];

  const newTx = {
    id: Date.now().toString(),
    description: descVal || CATEGORIES_METADATA[selectedCategory].name,
    amount: amountVal,
    type: selectedType,
    category: selectedCategory,
    date: today
  };

  transactions.unshift(newTx); // Adiciona no início do array
  closeAddSheet();
  updateUI();
  
  // Feedback visual rápido
  showToast("Lançamento adicionado com sucesso!");
}

function handleEditSubmit(e) {
  e.preventDefault();

  const id = document.getElementById("edit-id").value;
  const amountVal = parseFloat(document.getElementById("edit-amount").value);
  const descVal = document.getElementById("edit-description").value.trim();

  const txIdx = transactions.findIndex(t => t.id === id);
  if (txIdx !== -1) {
    transactions[txIdx].amount = amountVal;
    transactions[txIdx].description = descVal || CATEGORIES_METADATA[selectedCategory].name;
    transactions[txIdx].category = selectedCategory;
    
    closeEditSheet();
    updateUI();
    showToast("Lançamento atualizado com sucesso!");
  }
}

function handleDeleteTransaction() {
  const id = document.getElementById("edit-id").value;
  const confirmDelete = confirm("Deseja realmente excluir este lançamento?");
  if (confirmDelete) {
    transactions = transactions.filter(t => t.id !== id);
    closeEditSheet();
    updateUI();
    showToast("Lançamento removido.");
  }
}

// ================= ATUALIZAÇÃO DA INTERFACE (UI ENGINE) =================
function updateUI() {
  calculateAndRenderBalances();
  renderDashboardRecent();
  renderCategoryBars();
}

function calculateAndRenderBalances() {
  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach(t => {
    if (t.type === "INCOME") {
      totalIncome += t.amount;
    } else {
      totalExpense += t.amount;
    }
  });

  const leftover = totalIncome - totalExpense;
  
  // Calcula a Taxa de Poupança (economia)
  const savingsRate = totalIncome > 0 
    ? Math.max(0, Math.round((leftover / totalIncome) * 100)) 
    : 0;

  // Renderiza no topo
  const dbLeftover = document.getElementById("dashboard-leftover");
  dbLeftover.textContent = formatCurrency(leftover);
  
  // Altera estilo do saldo se ficar negativo
  if (leftover < 0) {
    dbLeftover.style.color = "var(--color-expense)";
  } else {
    dbLeftover.style.color = ""; // Reseta para o gradiente
  }

  document.getElementById("dashboard-income").textContent = formatCurrency(totalIncome);
  document.getElementById("dashboard-expense").textContent = formatCurrency(totalExpense);
  document.getElementById("savings-rate-label").textContent = `${savingsRate}% economizado`;
}

// Renderiza a lista recente de 5 lançamentos no Dashboard
function renderDashboardRecent() {
  const recentContainer = document.getElementById("dashboard-recent-transactions");
  recentContainer.innerHTML = "";

  const recents = transactions.slice(0, 5);
  
  if (recents.length === 0) {
    recentContainer.innerHTML = `<div class="empty-state">Nenhum lançamento registrado</div>`;
    return;
  }

  recents.forEach(t => {
    const item = createTransactionHTMLItem(t);
    recentContainer.appendChild(item);
  });
}

// Renderiza a lista de histórico (com filtros)
function renderHistoryList() {
  const listContainer = document.getElementById("history-transactions-list");
  listContainer.innerHTML = "";

  const filtered = transactions.filter(t => {
    if (currentFilter === "ALL") return true;
    return t.category === currentFilter;
  });

  if (filtered.length === 0) {
    listContainer.innerHTML = `<div class="empty-state">Nenhum lançamento para este filtro</div>`;
    return;
  }

  filtered.forEach(t => {
    const item = createTransactionHTMLItem(t);
    listContainer.appendChild(item);
  });
}

// Renderiza as barras horizontais de progresso/distribuição dos gastos
function renderCategoryBars() {
  const container = document.getElementById("categories-progress-container");
  container.innerHTML = "";

  // Somatório das despesas por categoria
  const categoryTotals = {
    ALIMENTACAO: 0,
    MERCADO: 0,
    TRANSPORTE: 0,
    OUTROS: 0
  };

  let totalExpense = 0;

  transactions.forEach(t => {
    if (t.type === "EXPENSE" && categoryTotals.hasOwnProperty(t.category)) {
      categoryTotals[t.category] += t.amount;
      totalExpense += t.amount;
    }
  });

  const categoriesOrdered = ["ALIMENTACAO", "MERCADO", "TRANSPORTE", "OUTROS"];

  categoriesOrdered.forEach(catKey => {
    const amount = categoryTotals[catKey];
    const percentage = totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0;
    const catMeta = CATEGORIES_METADATA[catKey];

    const progressItem = document.createElement("div");
    progressItem.className = "category-progress-item";
    progressItem.dataset.cat = catKey;
    progressItem.innerHTML = `
      <div class="category-progress-info">
        <div class="cat-name-box">
          <span class="cat-emoji">${catMeta.emoji}</span>
          <span class="cat-name">${catMeta.name}</span>
        </div>
        <div class="cat-values">
          <span>${formatCurrency(amount)}</span>
          <span class="cat-percent">(${percentage}%)</span>
        </div>
      </div>
      <div class="progress-bar-bg">
        <div class="progress-bar-fill" style="width: 0%"></div>
      </div>
    `;

    container.appendChild(progressItem);

    // Micro-delay para ativar transição de crescimento da barra CSS
    setTimeout(() => {
      const fillBar = progressItem.querySelector(".progress-bar-fill");
      if (fillBar) fillBar.style.width = `${percentage}%`;
    }, 50);
  });
}

// ================= MÉTODOS AUXILIARES E UTILS =================

// Cria o item HTML visual padrão para transações
function createTransactionHTMLItem(t) {
  const meta = CATEGORIES_METADATA[t.category];
  const item = document.createElement("div");
  item.className = "transaction-item";
  item.dataset.category = t.category;
  
  const sign = t.type === "INCOME" ? "+" : "-";
  const amountClass = t.type === "INCOME" ? "income" : "expense";
  const formattedDate = formatDateString(t.date);

  item.innerHTML = `
    <div class="transaction-left">
      <div class="transaction-avatar">${meta.emoji}</div>
      <div class="transaction-details">
        <span class="transaction-title">${t.description}</span>
        <span class="transaction-meta">${meta.name} • ${formattedDate}</span>
      </div>
    </div>
    <div class="transaction-right">
      <span class="transaction-amount ${amountClass}">${sign} ${formatCurrency(t.amount)}</span>
    </div>
  `;

  // Clique no item para abrir o Modal de Edição
  item.addEventListener("click", () => openEditSheet(t));

  return item;
}

// Formata data YYYY-MM-DD para DD/MM
function formatDateString(dateStr) {
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}`;
  }
  return dateStr;
}

// Formata valor número para Real Brasileiro (BRL)
function formatCurrency(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

// Toast de feedback rápido na tela
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast-message";
  toast.textContent = message;
  document.body.appendChild(toast);
  
  // Animação CSS inline rápida
  Object.assign(toast.style, {
    position: "absolute",
    bottom: "90px",
    left: "50%",
    transform: "translateX(-50%) translateY(20px)",
    background: "#1f2937",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "500",
    boxShadow: "0 10px 20px rgba(0,0,0,0.3)",
    zIndex: "9999",
    opacity: "0",
    transition: "all 0.3s ease"
  });

  setTimeout(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateX(-50%) translateY(0)";
  }, 10);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(-10px)";
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}
