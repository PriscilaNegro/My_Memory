<template>
  <div>
    <header class="fixed-header d-flex justify-content-between align-items-center px-4">
      <h1 class="header-title">My Memory 🧠</h1>
      <div class="user-info d-flex align-items-center">
        <span class="user-greeting me-2">Olá, {{ user.name }}</span>
        <img
         :src="user.photo || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'"
         alt="Foto de perfil"
         class="profile-pic"/>
      </div>
    </header>

    <aside class="sidebar d-flex flex-column p-3">
      <button class="btn btn-primary mb-2" @click="openAddModal">Adicionar Item</button>
      <button class="btn btn-secondary" @click="openLocationModal">Adicionar Local</button>
    </aside>

    <div class="main-wrapper d-flex justify-content-center">
      <div class="container main-content">
        <p class="main-subtitle mb-4">Esses são seus itens cadastrados:</p>

        <div v-if="items.length">
          <table class="table table-hover table-bordered align-middle text-center mt-3">
            <thead class="custom-header">
              <tr>
                <th>Item</th>
                <th>Local Armazenado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in items" :key="item.id">
                <td>{{ item.name }}</td>
                <td>{{ item.location }}</td>
                <td>
                  <button class="btn btn-sm btn-warning me-2" @click="openEditModal(item)">Editar</button>
                  <button class="btn btn-sm btn-outline-danger" @click="openDeleteModal(item)">Excluir</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="mt-3 alert alert-warning">
          Você ainda não cadastrou nenhum item.
        </div>
      </div>
    </div>

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
                <select v-model="newItem.location" class="form-select" required>
                  <option disabled value="">Selecione um local</option>
                  <option v-for="loc in locations" :key="loc" :value="loc">{{ loc }}</option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary mt-3">Adicionar</button>
            </form>
          </div>
        </div>
      </div>
    </div>

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
                <select v-model="selectedItem.location" class="form-select" required>
                  <option disabled value="">Selecione um local</option>
                  <option v-for="loc in locations" :key="loc" :value="loc">{{ loc }}</option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary">Salvar</button>
            </form>
          </div>
        </div>
      </div>
    </div>

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
import { ref } from "vue";
import * as bootstrap from "bootstrap";

const user = ref({ name: "Priscila", photo: "" });
const items = ref([
  { id: 1, name: "Notebook", location: "Mesa do escritório" },
  { id: 2, name: "Chave do carro", location: "Porta da sala" },
]);

const locations = ref(["Mesa do escritório", "Porta da sala"]);
const newLocation = ref("");

const newItem = ref({ name: "", location: "" });
let addModal = null;

const selectedItem = ref({ id: null, name: "", location: "" });
let editModal = null;

const itemToDelete = ref(null);
let deleteModal = null;

let locationModal = null;

const locationToDelete = ref(null);
let deleteLocationModal = null;

const linkedItems = ref([]);

const openAddModal = () => {
  newItem.value = { name: "", location: "" };
  if (!addModal) addModal = new bootstrap.Modal(document.getElementById("addModal"));
  addModal.show();
};

const saveNewItem = () => {
  const id = items.value.length ? Math.max(...items.value.map(i => i.id)) + 1 : 1;
  items.value.push({ id, ...newItem.value });
  localStorage.setItem("items", JSON.stringify(items.value));
  addModal.hide();
};

const openEditModal = (item) => {
  selectedItem.value = { ...item };
  if (!editModal) editModal = new bootstrap.Modal(document.getElementById("editModal"));
  editModal.show();
};

const updateItem = () => {
  const index = items.value.findIndex(i => i.id === selectedItem.value.id);
  if (index !== -1) {
    items.value[index] = { ...selectedItem.value };
    localStorage.setItem("items", JSON.stringify(items.value));
  }
  editModal.hide();
};

const openDeleteModal = (item) => {
  itemToDelete.value = item;
  if (!deleteModal) deleteModal = new bootstrap.Modal(document.getElementById("deleteModal"));
  deleteModal.show();
};

const confirmDelete = () => {
  if (itemToDelete.value) {
    items.value = items.value.filter(i => i.id !== itemToDelete.value.id);
    localStorage.setItem("items", JSON.stringify(items.value));
  }
  deleteModal.hide();
};

const openLocationModal = () => {
  newLocation.value = "";
  if (!locationModal) locationModal = new bootstrap.Modal(document.getElementById("locationModal"));
  locationModal.show();
};

const saveNewLocation = () => {
  locations.value.push(newLocation.value);
  localStorage.setItem("locations", JSON.stringify(locations.value));
  newLocation.value = "";
};

const openDeleteLocationModal = (loc, index) => {
  locationToDelete.value = { name: loc, index };
  linkedItems.value = items.value.filter(item => item.location === loc);
  if (!deleteLocationModal) deleteLocationModal = new bootstrap.Modal(document.getElementById("deleteLocationModal"));
  deleteLocationModal.show();
};

const confirmDeleteLocation = () => {
  if (locationToDelete.value) {
    const removed = locations.value.splice(locationToDelete.value.index, 1);
    items.value.forEach(item => {
      if (item.location === removed[0]) item.location = "";
    });
    localStorage.setItem("locations", JSON.stringify(locations.value));
    localStorage.setItem("items", JSON.stringify(items.value));
  }
  deleteLocationModal.hide();
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

.sidebar {
  position: fixed;
  top: 70px;
  left: 0;
  width: 220px;
  height: calc(100% - 70px);
  background-color: #f8f9fa;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0,0,0,0.1);
  z-index: 900;
}

.sidebar .btn {
  width: 100%;
  font-weight: 500;
}

.main-wrapper {
  margin-top: 30px;
  margin-left: 240px; 
  display: flex;
  justify-content: center; 
}

.main-content {
  max-width: 900px; 
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

</style>
