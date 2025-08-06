let objetos = [];
let editandoId = null;

const form = document.getElementById("form-objeto");
const lista = document.getElementById("lista-objetos");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const local = document.getElementById("local").value;
  const imagem = document.getElementById("imagem").value;

  if (!nome || !local) {
    alert("Nome e local são obrigatórios!");
    return;
  }

  if (editandoId) {
    const objeto = objetos.find(o => o.id === editandoId);
    objeto.nome = nome;
    objeto.local = local;
    objeto.imagem = imagem;
    objeto.dataAtualizacao = new Date();
    editandoId = null;
  } else {
    const novoObjeto = {
      id: Date.now().toString(),
      nome,
      local,
      imagem,
      dataCriacao: new Date(),
    };
    objetos.push(novoObjeto);
  }

  form.reset();
  renderizarObjetos();
});

function renderizarObjetos() {
  lista.innerHTML = "";

  if (objetos.length === 0) {
    lista.innerHTML = "<p>Nenhum objeto cadastrado.</p>";
    return;
  }

  objetos.forEach((objeto) => {
    const div = document.createElement("div");
    div.className = "objeto";
    div.innerHTML = `
      <strong>${objeto.nome}</strong><br>
      Guardado em: ${objeto.local}<br>
      ${objeto.imagem ? `<img src="${objeto.imagem}" alt="Imagem">` : ""}
      <small>Data: ${new Date(objeto.dataCriacao).toLocaleString()}</small><br>
      <button onclick="editarObjeto('${objeto.id}')">Editar</button>
      <button onclick="excluirObjeto('${objeto.id}')">Excluir</button>
    `;

    lista.appendChild(div);
  });
}

function editarObjeto(id) {
  const objeto = objetos.find(o => o.id === id);
  document.getElementById("nome").value = objeto.nome;
  document.getElementById("local").value = objeto.local;
  document.getElementById("imagem").value = objeto.imagem;
  editandoId = id;
}

function excluirObjeto(id) {
  if (confirm("Tem certeza que deseja excluir?")) {
    objetos = objetos.filter(o => o.id !== id);
    renderizarObjetos();
  }
}
