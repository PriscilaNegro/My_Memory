<template>
  <div>
    <header class="fixed-header d-flex justify-content-between align-items-center px-4">
      <h1 class="header-title">My Memory 🧠</h1>
      <div class="user-info d-flex align-items-center">
        <span class="user-greeting me-2">Olá, {{ user.name }}</span>
        <img
          :src="user.photo || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'"
          alt="Foto de perfil"
          class="profile-pic"
        />
      </div>
    </header>

    <div class="main-wrapper d-flex justify-content-center">
      <div class="container main-content">
        <p class="main-subtitle mb-4 text-center">Esses são seus itens cadastrados:</p>

        <!-- Pesquisa no DESKTOP -->
        <div class="search-bar d-none d-md-flex justify-content-end align-items-center mb-3 gap-2">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Pesquisar..." 
            class="form-control w-auto"
          />
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
                    <button class="btn btn-sm btn-warning me-2" @click="openEditModal(item)">Editar</button>
                    <button class="btn btn-sm btn-outline-danger" @click="openDeleteModal(item)">Excluir</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div v-else class="alert alert-warning mt-3">
          Nenhum item encontrado para a pesquisa.
        </div>

        <!--  Pesquisa no MOBILE -->
        <div class="search-bar d-flex d-md-none justify-content-center align-items-center gap-2 mt-3 flex-wrap">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Pesquisar..." 
            class="form-control w-100"
          />
          <select v-model="searchCategory" class="form-select w-100">
            <option value="all">Todos</option>
            <option value="name">Itens</option>
            <option value="location">Locais</option>
            <option value="datetime">Datas</option>
          </select>
        </div>

        <!-- Botões de ação -->
        <div class="action-buttons d-flex justify-content-center gap-3 mt-4 flex-wrap">
          <button class="btn btn-primary btn-action" @click="openAddModal">Adicionar Novo Item</button>
          <button class="btn btn-secondary btn-action" @click="openLocationModal">Adicionar Novo Local</button>
        </div>
      </div>
    </div>

    <!-- MODAIS  -->

    <!-- Modal Adicionar Item -->
    <div class="modal fade" id="addModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Adicionar Item</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
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

    <!-- Modal Gerenciar Locais -->
    <div class="modal fade" id="locationModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Gerenciar Locais</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
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
              <li
                v-for="(loc, index) in locations"
                :key="loc"
                class="list-group-item d-flex justify-content-between align-items-center"
              >
                {{ loc }}
                <button class="btn btn-sm btn-outline-danger" @click="openDeleteLocationModal(loc, index)">
                  <i class="bi bi-trash"></i>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Editar Item -->
    <div class="modal fade" id="editModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Editar Item</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
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
                  <option v-for="loc in locations" :key="loc" :value="loc.id">{{ loc.name }}</option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary">Salvar</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Excluir Item -->
    <div class="modal fade" id="deleteModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title text-danger">Excluir Item</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            Tem certeza que deseja excluir o item
            <strong>{{ itemToDelete?.name }}</strong>?
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button class="btn btn-danger" @click="confirmDelete">Excluir</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Excluir Local -->
    <div class="modal fade" id="deleteLocationModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title text-danger">Excluir Local</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <p>
              Tem certeza que deseja excluir o local
              <strong>{{ locationToDelete?.name }}</strong>?
            </p>
            <div v-if="linkedItems.length" class="alert alert-warning mt-3">
              Atenção ⚠️ Este local está associado a
              <strong>{{ linkedItems.length }}</strong>
              item(s). Eles perderão a referência ao local.
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button class="btn btn-danger" @click="confirmDeleteLocation">Excluir</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import api from "../api";
import * as bootstrap from "bootstrap";

const user = ref({ name: "Priscila", photo: "" });
const items = ref([]);
const locations = ref([]);
const newLocation = ref("");
const newItem = ref({ name: "", location_id: "" });

let addModal = null;
let editModal = null;
let deleteModal = null;
let locationModal = null;
let deleteLocationModal = null;

const selectedItem = ref({ id: null, name: "", location_id: "" });
const itemToDelete = ref(null);
const locationToDelete = ref(null);
const linkedItems = ref([]);

// Estado da pesquisa
const searchQuery = ref("");
const searchCategory = ref("all");

// Função para buscar locais do backend
const fetchLocations = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.get("/locations", {
      headers: { Authorization: `Bearer ${token}` },
    });
    locations.value = response.data;
  } catch (err) {
    console.error("Erro ao buscar locais:", err);
  }
};

// Função para buscar itens
const fetchItems = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.get("/items", {
      headers: { Authorization: `Bearer ${token}` },
    });
    items.value = response.data;
  } catch (err) {
    console.error("Erro ao buscar itens:", err);
  }
};

// Assim que o componente carregar, busca tudo
onMounted(async () => {
  await fetchItems();
  await fetchLocations();
});

// Computed para filtragem
const filteredItems = computed(() => {
  if (!searchQuery.value) return items.value;
  const query = searchQuery.value.toLowerCase();

  return items.value.filter(item => {
    if (searchCategory.value === "all") {
      return (
        item.name.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        (item.datetime && item.datetime.toLowerCase().includes(query))
      );
    } else if (searchCategory.value === "name") {
      return item.name.toLowerCase().includes(query);
    } else if (searchCategory.value === "location") {
      return item.location.toLowerCase().includes(query);
    } else if (searchCategory.value === "datetime") {
      return item.datetime && item.datetime.toLowerCase().includes(query);
    }
  });
});

// Métodos dos modais
const openAddModal = () => {
  newItem.value = { name: "", location: "" };
  if (!addModal) addModal = new bootstrap.Modal(document.getElementById("addModal"));
  addModal.show();
};

const saveNewItem = async () => {
  try {
    const token = localStorage.getItem("token");
    // montar payload conforme o model espera
    const payload = {
      name: newItem.value.name,
      location_id: newItem.value.location_id,
      image: null,        // ou enviar se tiver
      description: null,  // ou enviar se tiver
    };

    await api.post("/items", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // melhor atualizar a lista inteira para garantir nomes (location_name)
    await fetchItems();

    newItem.value = { name: "", location_id: "" };
    addModal.hide();
  } catch (error) {
    console.error("Erro ao adicionar item:", error.response?.data || error);
  }
};

const openEditModal = (item) => {
  selectedItem.value = { ...item };
  if (!editModal) editModal = new bootstrap.Modal(document.getElementById("editModal"));
  editModal.show();
};

const updateItem = async () => {
  try {
    const token = localStorage.getItem("token");
    const payload = {
      name: selectedItem.value.name,
      location_id: selectedItem.value.location_id,
      image: selectedItem.value.image ?? null,
      description: selectedItem.value.description ?? null,
    };

    await api.put(`/items/${selectedItem.value.id}`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    await fetchItems();
    editModal.hide();
  } catch (error) {
    console.error("Erro ao atualizar item:", error.response?.data || error);
  }
};

const openDeleteModal = (item) => {
  itemToDelete.value = item;
  if (!deleteModal) deleteModal = new bootstrap.Modal(document.getElementById("deleteModal"));
  deleteModal.show();
};

const confirmDelete = async () => {
  try {
    const token = localStorage.getItem("token");
    await api.delete(`/items/${itemToDelete.value.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    items.value = items.value.filter(i => i.id !== itemToDelete.value.id);
    deleteModal.hide();
  } catch (error) {
    console.error("Erro ao deletar item:", error);
  }
};

const openLocationModal = () => {
  newLocation.value = "";
  if (!locationModal) locationModal = new bootstrap.Modal(document.getElementById("locationModal"));
  locationModal.show();
};

const saveNewLocation = async () => {
  try {
    const token = localStorage.getItem("token");
    const payload = { name: newLocation.value };

    const response = await api.post("/locations", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // adiciona o local recém-criado à lista reativa
    locations.value.push(response.data);

    newLocation.value = "";
  } catch (error) {
    console.error("Erro ao adicionar local:", error.response?.data || error);
  }
};

const openDeleteLocationModal = (loc) => {
  locationToDelete.value = loc;
  linkedItems.value = items.value.filter(item => item.location === loc);
  if (!deleteLocationModal) {
    deleteLocationModal = new bootstrap.Modal(document.getElementById("deleteLocationModal"));
  }
  deleteLocationModal.show();
};

const confirmDeleteLocation = async () => {
  if (!locationToDelete.value) return;

  try {
    const token = localStorage.getItem("token");
    await api.delete(`/locations/${locationToDelete.value.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    await fetchLocations(); // atualiza a lista
    deleteLocationModal.hide();
  } catch (error) {
    console.error("Erro ao deletar localização:", error);
  }
};


</script>

<style scoped>
.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 70px;
  background-color: #d8909fa8;
  color: #000;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.header-title {
  font-size: 2rem;
  font-weight: 500;
}

.user-greeting {
  font-size: 1.5rem;
  font-weight: 500;
}

.profile-pic {
  width: 40px;
  height: 40px;
  border-radius: 50%; 
  object-fit: cover;  
  border: 2px solid #fff; 
}

.main-wrapper {
  margin-top: 90px; 
  display: flex;
  justify-content: center; 
  align-items: center;
  width: 100%;
}

.main-content {
  max-width: 900px; 
  width: 100%;
}

.main-subtitle {
  font-size: 1.2rem;   
  font-weight: 500;    
  color: #000000;         
}

:deep(.custom-header th) {
  background-color:  #d85c6a6e;
  color: #000;
}

.btn-warning {
  background-color: #de7288a8;
  border: none;
  color: #fff;
}

.btn-warning:hover {
  background-color: #e05a75d6;
}

.btn-outline-danger {
  border-width: 1px;
}

.btn-primary {
  background-color: #de7288a8;
  border: none;
}

.btn-primary:hover {
  background-color: #e05a75d6;
}

.btn-secondary {
  background-color: #de7288a8;
  border: none;
  color: #fff;
}

.btn-secondary:hover {
  background-color: #e05a75d6;
}

.table {
  font-size: 1rem;     
}

.table th, .table td {
  padding: 12px 15px; 
}

.table th {
  font-size: 1.1rem;    
  font-weight: 500;
}

.btn-action {
  min-width: 150px; 
  max-width: 220px; 
  padding: 8px 16px;
  font-size: 0.9rem;
}

.search-bar input, 
.search-bar select {
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .main-wrapper {
    margin-left: 10px;
    margin-right: 10px;
  }

  .header-title {
    font-size: 1.5rem;
  }

  .user-greeting {
    font-size: 1rem;
  }

  .table th, .table td {
    padding: 8px 10px;
    font-size: 0.9rem;
  }

  .action-buttons button {
    width: 100%;
    margin-bottom: 8px;
  }
}

@media (max-width: 576px) {
  .header-title {
    font-size: 1.3rem;
  }

  .user-greeting {
    font-size: 0.9rem;
  }

  .table th, .table td {
    font-size: 0.8rem;
    padding: 6px 8px;
  }
}
</style>
