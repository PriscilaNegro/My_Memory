# Documentação do Projeto My Memory

## Visão Geral

O **My Memory** é um aplicativo voltado para a organização de objetos pessoais. A proposta é permitir que os usuários registrem onde guardaram cada objeto, com nome, local, imagem, data de armazenamento e demais informações úteis. Assim, o app ajuda os usuários a não esquecerem onde colocaram seus pertences.

---

## Casos de Uso

### 1. Cadastrar um novo objeto

**Ator Principal:** Usuário autenticado  
**Descrição:** O usuário insere as informações do objeto (nome, local onde foi guardado, e imagem (opcional)) e salva no sistema.  
**Pré-condições:** O usuário precisa estar autenticado no sistema.  
**Pós-condições:** O objeto é salvo no banco de dados e fica visível para consulta posterior.  
**Fluxo Principal:**
1. O usuário acessa a funcionalidade de cadastro de objeto
2. Preenche o formulário com os dados solicitados
3. Envia o formulário
4. O sistema salva o objeto no banco e exibe uma confirmação

---

### 2. Editar um objeto

**Ator Principal:** Usuário autenticado  
**Descrição:** O usuário pode modificar as informações de um objeto já cadastrado.  
**Pré-condições:** O objeto precisa estar registrado e o usuário deve estar autenticado.  
**Pós-condições:** Os dados do objeto são atualizados no sistema.  
**Fluxo Principal:**
1. O usuário acessa a lista de objetos cadastrados
2. Escolhe um objeto e clica em editar
3. Altera os campos desejados
4. Salva as alterações

---

### 3. Excluir um objeto

**Ator Principal:** Usuário autenticado  
**Descrição:** Permite a exclusão de um objeto da base de dados.  
**Pré-condições:** O objeto deve existir e o usuário deve estar autenticado.  
**Pós-condições:** O objeto é removido permanentemente do sistema.  
**Fluxo Principal:**
1. O usuário acessa seus objetos
2. Seleciona o objeto a ser excluído
3. Confirma a exclusão
4. O sistema apaga o registro do banco de dados

---

### 4. Buscar objeto por nome

**Ator Principal:** Usuário autenticado  
**Descrição:** O usuário pode pesquisar um objeto específico pelo nome.  
**Pré-condições:** Ter ao menos um objeto cadastrado  
**Pós-condições:** O sistema retorna os objetos que correspondem à busca  
**Fluxo Principal:**
1. O usuário digita um termo no campo de busca
2. O sistema filtra os resultados com base no nome

---

### 5. Cadastrar novo usuário

**Ator Principal:** Visitante  
**Descrição:** Criação de uma conta de usuário no sistema  
**Pré-condições:** Não estar autenticado  
**Pós-condições:** Conta criada com sucesso e usuário autenticado automaticamente  
**Fluxo Principal:**
1. O visitante acessa a tela de cadastro
2. Preenche os dados obrigatórios (nome, e-mail, senha)
3. O sistema valida e salva os dados (a senha é armazenada com hash por segurança)
4. O usuário é redirecionado para o sistema logado

---

## Regras de Negócio

- Um usuário só pode visualizar, editar ou excluir os objetos que ele mesmo cadastrou
- O nome e local do objeto são obrigatórios
- A senha do usuário deve ser armazenada de forma segura (criptografada com hash)
- A busca por objetos é limitada aos registros do próprio usuário
- Cada usuário deve ter um e-mail único
- O sistema deve registrar a data/hora da criação de cada objeto
- Um usuário deve estar autenticado para interagir com qualquer funcionalidade que envolva objetos

---

## Estrutura Sugerida do Projeto

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js + Express 
- **Banco de dados:** PostgreSQL
- **Autenticação:** JWT
- **Deploy:** Render


