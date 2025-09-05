<template>
  <div class="container mt-5">
    <h1>Olá, {{ user.name }} 🧠</h1>
    <p class="mb-4">Esses são seus itens cadastrados:</p>

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
              <button
                class="btn btn-sm btn-warning me-2"
                @click="openEditModal(item)"
              >
                Editar
              </button>
              <button
                class="btn btn-sm btn-outline-danger"
                @click="openDeleteModal(item)"
              >
                Excluir
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="mt-3 alert alert-warning">
      Você ainda não cadastrou nenhum item.
    </div>

    <!-- Botão para abrir modal de adicionar -->
    <button class="btn btn-primary mt-4" @click="openAddModal">
      Adicionar Item
    </button>

    <!-- Modal Adicionar -->
    <div class="modal fade" id="addModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Adicionar Item</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveNewItem">
              <div class="mb-3">
                <label class="form-label">Nome do Item</label>
                <input
                  v-model="newItem.name"
                  type="text"
                  class="form-control"
                  required
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Local Armazenado</label>
                <input
                  v-model="newItem.location"
                  type="text"
                  class="form-control"
                  required
                />
              </div>
              <button type="submit" class="btn btn-primary">Adicionar</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Editar -->
    <div class="modal fade" id="editModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Editar Item</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="updateItem">
              <div class="mb-3">
                <label class="form-label">Nome do Item</label>
                <input
                  v-model="selectedItem.name"
                  type="text"
                  class="form-control"
                  required
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Local Armazenado</label>
                <input
                  v-model="selectedItem.location"
                  type="text"
                  class="form-control"
                  required
                />
              </div>
              <button type="submit" class="btn btn-primary">Salvar</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Excluir -->
    <div class="modal fade" id="deleteModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title text-danger">Excluir Item</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div class="modal-body">
            Tem certeza que deseja excluir o item
            <strong>{{ itemToDelete?.name }}</strong>?
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">
              Cancelar
            </button>
            <button class="btn btn-danger" @click="confirmDelete">Excluir</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import * as bootstrap from "bootstrap";

const user = ref({ name: "Priscila" });
const items = ref([
  { id: 1, name: "Notebook", location: "Mesa do escritório" },
  { id: 2, name: "Chave do carro", location: "Porta da sala" },
]);

// Novo item
const newItem = ref({ name: "", location: "" });
let addModal = null;

const selectedItem = ref({ id: null, name: "", location: "" });
const itemToDelete = ref(null);

let editModal = null;
let deleteModal = null;

// Abrir modal de adicionar
const openAddModal = () => {
  newItem.value = { name: "", location: "" };
  if (!addModal) {
    addModal = new bootstrap.Modal(document.getElementById("addModal"));
  }
  addModal.show();
};

// Salvar novo item
const saveNewItem = () => {
  const id = items.value.length
    ? Math.max(...items.value.map((i) => i.id)) + 1
    : 1;
  items.value.push({ id, ...newItem.value });
  localStorage.setItem("items", JSON.stringify(items.value));
  addModal.hide();
};

// Editar
const openEditModal = (item) => {
  selectedItem.value = { ...item }; 
  if (!editModal) {
    editModal = new bootstrap.Modal(document.getElementById("editModal"));
  }
  editModal.show();
};

const updateItem = () => {
  const index = items.value.findIndex((i) => i.id === selectedItem.value.id);
  if (index !== -1) {
    items.value[index] = { ...selectedItem.value };
    localStorage.setItem("items", JSON.stringify(items.value));
  }
  editModal.hide();
};

// Excluir
const openDeleteModal = (item) => {
  itemToDelete.value = item;
  if (!deleteModal) {
    deleteModal = new bootstrap.Modal(document.getElementById("deleteModal"));
  }
  deleteModal.show();
};

const confirmDelete = () => {
  if (itemToDelete.value) {
    items.value = items.value.filter((i) => i.id !== itemToDelete.value.id);
    localStorage.setItem("items", JSON.stringify(items.value));
  }
  deleteModal.hide();
};
</script>

<style scoped>
:deep(.custom-header th) {
  background-color: #de7288a8;
  color: #000000;
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
</style>
