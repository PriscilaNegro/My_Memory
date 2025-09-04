<template>
  <div class="container mt-5">
    <h1>Olá, {{ user.name }} 🧠</h1>
    <p class="mb-4">Esses são seus itens cadastrados:</p>

    <div v-if="items.length">
      <table class="table table-hover table-bordered align-middle text-center mt-3">
        <thead class="custom-header">
          <tr>
            <th>Nome do Item</th>
            <th>Local Armazenado</th>
            <th></th> 
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td>{{ item.name }}</td>
            <td>{{ item.location }}</td>
            <td>
              <button class="btn btn-sm btn-warning me-2" @click="editItem(item.id)">Editar</button>
              <button class="btn btn-sm btn-outline-danger" @click="deleteItem(item.id)">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="mt-3 alert alert-warning">
      Você ainda não cadastrou nenhum item.
    </div>

    <button class="btn btn-primary mt-4" @click="addItem">Adicionar Item</button>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

const user = ref({ name: "Priscila" })
const items = ref([
  { id: 1, name: "Notebook", location: "Mesa do escritório" },
  { id: 2, name: "Chave do carro", location: "Porta da sala" }
])

const addItem = () => {
  router.push("/add-item")
}

const editItem = (id) => {
  router.push(`/edit-item/${id}`)
}

const deleteItem = (id) => {
  if (confirm("Tem certeza que deseja excluir este item?")) {
    items.value = items.value.filter((item) => item.id !== id)
    localStorage.setItem("items", JSON.stringify(items.value))
  }
}
</script>

<style scoped>
:deep(.custom-header) {
  background-color: #de7288a8;
  color: #fff;
}

.btn-warning {
  background-color: #de7288a8;
  border: none;
  color: #fff;
}

.btn-outline-danger {
  border-width: 2px;
}

.btn-primary {
  background-color: #de7288a8;
  border: none;
}
</style>
