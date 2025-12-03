<template>
  <header class="dashboard-header">
    <div class="header-left">
      <img src="../assets/brainneon.png" class="brain-logo" alt="Logo" />
    </div>

    <div class="header-right" @click="toggleMenu">
      <span>Olá, {{ userName }}</span>
      <span class="arrow">▼</span>

      <div v-if="menuOpen" class="dropdown-menu">
        <button @click="goToConfig">Configurações</button>
        <button @click="logout">Sair</button>
      </div>
    </div>
  </header>

  <div class="top-actions" role="toolbar" aria-label="Ações rápidas">
    <button type="button" class="neon-btn" @click="showAddModal = true">+ Novo Item</button>
    <button type="button" class="neon-btn" @click="showLocationModal = true">+ Novo Local</button>
  </div>

  <!-- Pesquisa MOBILE: logo após os botões -->
  <div class="search-bar d-flex d-md-none justify-content-center align-items-center gap-2 mt-3 flex-wrap">
    <input v-model="searchQuery" type="text" placeholder="Pesquisar..." class="form-control w-100" />
    <select v-model="searchCategory" class="form-select w-100">
      <option value="all">Todos</option>
      <option value="name">Itens</option>
      <option value="location">Locais</option>
      <option value="datetime">Datas</option>
    </select>
  </div>

  <div class="main-wrapper d-flex justify-content-center">
    <div class="container main-content">
      <p class="main-subtitle mb-4 text-center">Esses são seus itens cadastrados:</p>

      <!-- Pesquisa DESKTOP -->
      <div class="search-bar d-none d-md-flex justify-content-end align-items-center mb-3 gap-2">
        <input v-model="searchQuery" type="text" placeholder="Pesquisar..." class="form-control w-auto" />
        <select v-model="searchCategory" class="form-select w-auto">
          <option value="all">Todos</option>
          <option value="name">Itens</option>
          <option value="location">Locais</option>
          <option value="datetime">Datas</option>
        </select>
      </div>

      <!-- Tabela filtrada -->
      <div v-if="filteredItems.length">
        <div class="table-responsive">
          <table class="table table-hover table-bordered align-middle text-center mt-3">
            <thead class="custom-header">
              <tr>
                <th>Item</th>
                <th>Local Armazenado</th>
                <th>Data/Hora</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredItems" :key="item.id">
                <td>{{ item.name }}</td>
                <td>{{ item.location_name }}</td>
                <td>{{ item.datetime }}</td>
                <td>
                  <button class="btn btn-sm table-edit-btn me-2" @click="openEdit(item)">Editar</button>
                  <button class="btn btn-sm btn-outline-danger" @click="openDelete(item)">Excluir</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-else class="alert alert-warning mt-3">
        Nenhum item encontrado para a pesquisa.
      </div>
    </div>
  </div>

  <!-- Adicionar Item -->
  <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Adicionar Item</h5>
          <button type="button" class="btn-close" @click="showAddModal = false"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveNewItem">
            <div class="mb-3">
              <label class="form-label">Nome do Item</label>
              <input v-model="newItem.name" type="text" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Local Armazenado</label>
              <select v-model="newItem.location_id" class="form-select" required>
                <option disabled value="">Selecione um local</option>
                <option v-for="loc in locations" :key="loc.id" :value="loc.id">{{ loc.name }}</option>
              </select>
            </div>
            <button type="submit" class="btn btn-primary mt-3">Adicionar</button>
          </form>
        </div>
      </div>
    </div>
  </div>

  <!-- Editar Item -->
  <div v-if="showEditModal" class="modal-overlay" @click.self="showEditModal = false">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Editar Item</h5>
          <button type="button" class="btn-close" @click="showEditModal = false"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="updateItem">
            <div class="mb-3">
              <label class="form-label">Nome do Item</label>
              <input v-model="selectedItem.name" type="text" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Local Armazenado</label>
              <select v-model="selectedItem.location_id" class="form-select" required>
                <option disabled value="">Selecione um local</option>
                <option v-for="loc in locations" :key="loc.id" :value="loc.id">{{ loc.name }}</option>
              </select>
            </div>
            <button type="submit" class="btn btn-primary">Salvar</button>
          </form>
        </div>
      </div>
    </div>
  </div>

  <!-- Excluir Item -->
  <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title text-danger">Excluir Item</h5>
          <button type="button" class="btn-close" @click="showDeleteModal = false"></button>
        </div>
        <div class="modal-body">
          Tem certeza que deseja excluir o item <strong>{{ itemToDelete?.name }}</strong>?
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showDeleteModal = false">Cancelar</button>
          <button class="btn btn-danger" @click="confirmDelete">Excluir</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Gerenciar Locais -->
  <div v-if="showLocationModal" class="modal-overlay" @click.self="showLocationModal = false">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Gerenciar Locais</h5>
          <button type="button" class="btn-close" @click="showLocationModal = false"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveNewLocation">
            <div class="mb-3">
              <label class="form-label">Nome do Local</label>
              <input v-model="newLocation" type="text" class="form-control" required />
            </div>
            <button type="submit" class="btn btn-primary">Adicionar Local</button>
          </form>
          <ul class="list-group mt-3">
            <li v-for="(loc, index) in locations" :key="loc.id" class="list-group-item d-flex justify-content-between align-items-center">
              {{ loc.name }}
              <button class="btn btn-sm btn-outline-danger" @click="openDeleteLocation(loc)">Excluir</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <!-- Excluir Local -->
  <div v-if="showDeleteLocationModal" class="modal-overlay" @click.self="showDeleteLocationModal = false">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title text-danger">Excluir Local</h5>
          <button type="button" class="btn-close" @click="showDeleteLocationModal = false"></button>
        </div>
        <div class="modal-body">
          Tem certeza que deseja excluir o local <strong>{{ locationToDelete?.name }}</strong>?
          <div v-if="linkedItems.length" class="alert alert-warning mt-3">
            Atenção ⚠️ Este local está associado a <strong>{{ linkedItems.length }}</strong> item(s). Eles perderão a referência ao local.
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showDeleteLocationModal = false">Cancelar</button>
          <button class="btn btn-danger" @click="confirmDeleteLocation">Excluir</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import api from "../api";

const menuOpen = ref(false);
const userName = localStorage.getItem("name") || "Usuário";
const toggleMenu = () => menuOpen.value = !menuOpen.value;
const logout = () => { localStorage.clear(); window.location.href = "/login"; };
const goToConfig = () => alert("Tela de configurações ainda não implementada.");

const items = ref([]);
const locations = ref([]);
const newItem = ref({ name: "", location_id: "" });
const newLocation = ref("");
const selectedItem = ref({});
const itemToDelete = ref(null);
const locationToDelete = ref(null);
const linkedItems = ref([]);

const searchQuery = ref("");
const searchCategory = ref("all");

// Variáveis de controle dos modais
const showAddModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const showLocationModal = ref(false);
const showDeleteLocationModal = ref(false);

const fetchItems = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.get("/items", { headers: { Authorization: `Bearer ${token}` } });
    items.value = response.data;
  } catch (err) { console.error(err); }
};

const fetchLocations = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.get("/locations", { headers: { Authorization: `Bearer ${token}` } });
    locations.value = response.data;
  } catch (err) { console.error(err); }
};

onMounted(async () => {
  await fetchItems();
  await fetchLocations();
});

const filteredItems = computed(() => {
  if (!searchQuery.value) return items.value;
  const query = searchQuery.value.toLowerCase();
  return items.value.filter(item => {
    if (searchCategory.value === "all") {
      return (
        item.name.toLowerCase().includes(query) ||
        item.location_name.toLowerCase().includes(query) ||
        (item.datetime && item.datetime.toLowerCase().includes(query))
      );
    } else if (searchCategory.value === "name") return item.name.toLowerCase().includes(query);
    else if (searchCategory.value === "location") return item.location_name.toLowerCase().includes(query);
    else if (searchCategory.value === "datetime") return item.datetime && item.datetime.toLowerCase().includes(query);
  });
});

// Métodos de modais
const openEdit = (item) => { selectedItem.value = { ...item }; showEditModal.value = true; };
const openDelete = (item) => { itemToDelete.value = item; showDeleteModal.value = true; };
const openDeleteLocation = (loc) => { locationToDelete.value = loc; linkedItems.value = items.value.filter(i => i.location_name === loc.name); showDeleteLocationModal.value = true; };

// CRUD
const saveNewItem = async () => {
  try {
    const token = localStorage.getItem("token");
    await api.post("/items", { name: newItem.value.name, location_id: newItem.value.location_id }, { headers: { Authorization: `Bearer ${token}` } });
    await fetchItems();
    newItem.value = { name: "", location_id: "" };
    showAddModal.value = false;
  } catch (err) { console.error(err); }
};

const updateItem = async () => {
  try {
    const token = localStorage.getItem("token");
    await api.put(`/items/${selectedItem.value.id}`, { name: selectedItem.value.name, location_id: selectedItem.value.location_id }, { headers: { Authorization: `Bearer ${token}` } });
    await fetchItems();
    showEditModal.value = false;
  } catch (err) { console.error(err); }
};

const confirmDelete = async () => {
  try {
    const token = localStorage.getItem("token");
    await api.delete(`/items/${itemToDelete.value.id}`, { headers: { Authorization: `Bearer ${token}` } });
    items.value = items.value.filter(i => i.id !== itemToDelete.value.id);
    showDeleteModal.value = false;
  } catch (err) { console.error(err); }
};

const saveNewLocation = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.post("/locations", { name: newLocation.value }, { headers: { Authorization: `Bearer ${token}` } });
    locations.value.push(response.data);
    newLocation.value = "";
  } catch (err) { console.error(err); }
};

const confirmDeleteLocation = async () => {
  try {
    const token = localStorage.getItem("token");
    await api.delete(`/locations/${locationToDelete.value.id}`, { headers: { Authorization: `Bearer ${token}` } });
    await fetchLocations();
    showDeleteLocationModal.value = false;
  } catch (err) { console.error(err); }
};
</script>

<style scoped>
body, #app {
  background: linear-gradient(180deg, #12002f, #000428);
  min-height: 100vh;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 25px;
  width: 100%;
  background: transparent;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2000;
}

.brain-logo {
  width: 70px;
  animation: pulse 2.2s infinite ease-in-out;
}

@keyframes pulse {
  0% { transform: scale(1); filter: drop-shadow(0 0 2px #a020f0); }
  50% { transform: scale(1.05); filter: drop-shadow(0 0 10px #a020f0); }
  100% { transform: scale(1); filter: drop-shadow(0 0 2px #a020f0); }
}

.header-right {
  position: relative;
  cursor: pointer;
  color: #c7d9ff;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 16px;
}

.arrow {
  font-size: 12px;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 35px;
  background: #1b0032;
  border: 1px solid #a020f055;
  padding: 8px;
  border-radius: 10px;
  width: 150px;
  z-index: 3000;
  box-shadow: 0 0 15px rgba(160, 32, 240, 0.35);
}

.top-actions {
  margin-top: 100px;
  display: flex;
  gap: 15px;
  justify-content: center;
}

.neon-btn {
  background: transparent;
  border: 2px solid #a020f0;
  color: #a020f0;
  padding: 10px 20px;
  border-radius: 12px;
  font-weight: 600;
  transition: 0.25s ease;
}

.neon-btn:hover {
  box-shadow: 0 0 12px #4f87ff;
  border: #5a00ff;
  color: #c7d9ff;
  transform: translateY(-2px);
}

.neon-btn:focus {
  outline: 3px solid rgba(160,32,240,0.18);
  outline-offset: 3px;
}

.main-wrapper {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}

.main-content {
  margin-top: 40px;
  background: rgba(10, 0, 32, 0.6);
  backdrop-filter: blur(6px);
  padding: 25px;
  border-radius: 15px;
  width: 100%;
  max-width: 1000px;
  box-shadow: 0 0 25px rgba(160, 32, 240, 0.15);
  color: #c7d9ff;
}

.table {
  overflow: visible !important;
  background: transparent;
  overflow: hidden;
  color:  #c7d9ff;
}

.table thead th {
  background: rgba(10, 0, 32, 0.55) !important;
  color: #c7d9ff;
  border-bottom: 2px solid #a020f0 !important;
}

.table tbody tr:hover {
  background: rgba(10, 0, 32, 0.55) !important;
}

.table td {
  color: #c7d9ff !important;
  border-top: none !important;
}

.table th,
.table td {
  background: rgba(20, 0, 40, 0.4) !important;
  border-color: #5a00ff !important;
  color: #e9dfff !important;
}

.table-hover tbody tr:hover td {
  background: rgba(100, 28, 172, 0.5) !important;
}

:deep(.table) {
  border-collapse: separate !important;
  border-spacing: 0 !important;
  border-radius: 12px !important;
  overflow: hidden !important;
  border: 1px solid rgba(6, 170, 246, 0.25) !important;
}

:deep(.table th),
:deep(.table td) {
  border: none !important;
}

:deep(.table tbody tr:not(:last-child) td) {
  border-bottom: 1px solid rgba(6, 170, 246, 0.25) !important;
}

.table-edit-btn {
  background: transparent;
  border: 1px solid #ffbb00; 
  padding: 10px;
  color: #ffbb00 ;
  padding: 6px 14px;
  font-size: 14px;
  cursor: pointer;
  transition: 0.3s ease;
}

.table-edit-btn:hover {
  background: #ffbb00;
  color: white;
}

.custom-header {
  background: #6e14a3;
  color:#c7d9ff;
  font-weight: bold;
}

.custom-header th {
  background: rgba(85, 0, 170, 0.6) !important;
  color: #fff !important;
  font-weight: bold;
  text-shadow: 0 0 5px #a020f0;
}

.modal-overlay {
  position: fixed;
  top:0; left:0; right:0; bottom:0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5000;
}

.modal-dialog {
  background: rgba(17, 0, 32, 0.957);
  padding: 20px;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  color: #c7d9ff;
  box-shadow: 0 0 20px  #a020f0; 
}

.modal-dialog .modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-dialog input,
.modal-dialog select,
.modal-dialog textarea {
  background: rgba(10, 0, 32, 0.3); 
  border: 2px solid #a020f0;      
  color: #c7d9ff;
  padding: 8px 12px;
  border-radius: 8px;
  width: 100%;
  transition: 0.25s ease;
}

.modal-dialog input:focus,
.modal-dialog select:focus,
.modal-dialog textarea:focus {
  outline: none;
  box-shadow: 0 0 10px  #c7d9ff;;
  border-color:  #5a00ff;
  background: rgba(10, 0, 32, 0.4);
}

.modal-dialog .btn-close {
  width: 24px;
  height: 24px;
  background: transparent;
  border: none;
  position: relative;
  cursor: pointer;
}

.modal-dialog .btn-close::before,
.modal-dialog .btn-close::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  width: 2px;
  height: 16px;
  background-color: #fff; 
  transform-origin: center;
}

.modal-dialog .btn-close::before {
  transform: translate(-50%, -50%) rotate(45deg);
}

.modal-dialog .btn-close::after {
  transform: translate(-50%, -50%) rotate(-45deg);
}

.modal-dialog .btn-close:hover::before,
.modal-dialog .btn-close:hover::after {
  background-color:  #c7d9ff;;
  box-shadow: 0 0 8px #4f87ff;
}
.modal-dialog .btn-primary {
  background-color: transparent;   
  border-color: #a020f0;    
  box-shadow:  #b654ff;  
  color: #d796ff;               
  transition: 0.25s ease;
}

.modal-dialog .btn-primary:hover {
  background-color: transparent;    
  color:#c7d9ff;
  border-color: #4f87ff;
  box-shadow: 0 0 10px #4f87ff;
  transform: translateY(-2px);
}

.modal-content .form-select {
  color: #c7d9ff;               
  border: 1px solid #9b4dff; 
  box-shadow: 0 0 6px #9b4dff;
}

.modal-content .form-select option {
  background-color: rgba(160, 32, 240, 0.15);
  color: #2b0047;             
}

.modal-content .form-select option:hover {
  background-color: #2b0047;
}

.modal-content .form-select:focus {
  border-color: #c67aff;
  box-shadow: 0 0 10px #c67aff;
}

.list-group {
  background: transparent;
  border-radius: 10px;
  padding: 10px;
}

.list-group-item {
  background-color: transparent; 
  color:  #c7d9ff; 
  border: 1px solid #5a00ff;
}

.list-group-item:hover {
  transform: scale(1.02);
  transition: 0.2s;
}

.search-bar input.form-control,
.search-bar select.form-select,
.table-responsive select.form-select {
  background: rgba(10, 0, 32, 0.3);    
  border: 2px solid #a020f0;           
  color: #c7d9ff;
  padding: 8px 12px;
  border-radius: 8px;
  transition: 0.25s ease;
}

.search-bar input.form-control::placeholder {
  color:#c7d9ff;
}

.search-bar input.form-control:focus,
.search-bar select.form-select:focus,
.table-responsive select.form-select:focus {
  outline: none;
  border-color: #5a00ff;
  background: rgba(10, 0, 32, 0.45);
  box-shadow: 0 0 10px #a020f0;
}

.search-bar select.form-select option {
  background: #1b0032;
  color: #c7d9ff;
}

@media (min-width: 769px) {
  .main-wrapper {
    max-height: calc(100vh - 70px);
    overflow-y: auto;
  }
}

@media (max-width: 768px) {

  .top-actions {
    flex-direction: column;
    margin-top: 110px;
  }

  .brain-logo {
    width: 55px;
  }

  .main-content {
    padding: 18px;
  }
}
</style>
