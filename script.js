let items = [];
let editandoId = null;

const form = document.getElementById("form-item");
const lista = document.getElementById("lista-items");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const local = document.getElementById("local").value;
  const imagem = document.getElementById("imagem").value;

  if (!nome || !local) {
    alert("Nome e local são obrigatórios!");
    return;
  }

  if (editandoId !==null) {
    const item = items.find(i => i.id === editandoId);
    item.nome = nome;
    item.local = local;
    item.imagem = imagem;
    item.dataAtualizacao = new Date();
    editandoId = null;
  } else {
    const novoItem = {
      id: Date.now().toString(),
      nome,
      local,
      imagem,
      dataCriacao: new Date(),
    };
    items.push(novoItem);
  }

  form.reset();
  renderizarItems();
});

function renderizarItems() {
  lista.innerHTML = "";

  if (items.length === 0) {
    lista.innerHTML = "<p>Nenhum item cadastrado.</p>";
    return;
  }

  items.forEach((item) => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <strong>${item.nome}</strong><br>
      Guardado em: ${item.local}<br>
      ${item.imagem ? `<img src="${item.imagem}" alt="Imagem">` : ""}
      <small>Data: ${new Date(item.dataCriacao).toLocaleString()}</small><br>
      <button onclick="editarItem('${item.id}')">Editar</button>
      <button onclick="excluirItem('${item.id}')">Excluir</button>
    `;

    lista.appendChild(div);
  });
}

function editarItem(id) {
  const item = items.find(i => i.id === id);
  document.getElementById("nome").value = item.nome;
  document.getElementById("local").value = item.local;
  document.getElementById("imagem").value = item.imagem;
  editandoId = id;
}

function excluirItem(id) {
  if (confirm("Tem certeza que deseja excluir?")) {
    items = items.filter(i => i.id !== id);
    renderizarItems();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderizarItems();
});