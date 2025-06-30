function verificarSenha() {
  const senha = document.getElementById("senha").value;
  if (senha === "123") {
    document.getElementById("login").style.display = "none";
    document.getElementById("painel").style.display = "block";
    listarProdutos();
  } else {
    alert("Senha incorreta!");
  }
}

function adicionarProduto(editIndex = null) {
  const nome = document.getElementById("nome").value;
  const preco = parseFloat(document.getElementById("preco").value);
  const imagem = document.getElementById("imagem").value;

  if (!nome || isNaN(preco) || !imagem) {
    alert("Preencha todos os campos!");
    return;
  }

  let produtos = JSON.parse(localStorage.getItem("produtos") || "[]");

  if (editIndex !== null) {
    produtos[editIndex] = { nome, preco, imagem };
  } else {
    produtos.push({ nome, preco, imagem });
  }

  localStorage.setItem("produtos", JSON.stringify(produtos));
  listarProdutos();

  // Limpar campos
  document.getElementById("nome").value = "";
  document.getElementById("preco").value = "";
  document.getElementById("imagem").value = "";
  document.getElementById("seletorImagem").value = "";

  // Restaurar botão
  const btn = document.getElementById("btn-salvar");
  btn.textContent = "Salvar";
  btn.onclick = () => adicionarProduto();
}

function listarProdutos() {
  const produtos = JSON.parse(localStorage.getItem("produtos") || "[]");
  const lista = document.getElementById("lista-produtos");
  const contador = document.getElementById("contador-produtos");

  lista.innerHTML = "";

  produtos.forEach((produto, index) => {
    const div = document.createElement("div");
    div.className = "produto";
    div.innerHTML = `
      <strong>${produto.nome}</strong><br>
      Preço: R$ ${produto.preco.toFixed(2)}<br>
      <img src="${produto.imagem}" alt="" width="100"><br>
      <button onclick="editarProduto(${index})">✏️ Editar</button>
      <button onclick="removerProduto(${index})">🗑️ Remover</button>
    `;
    lista.appendChild(div);
  });

  if (contador) {
    contador.textContent = `Total de produtos: ${produtos.length}`;
  }
}

function editarProduto(index) {
  const produtos = JSON.parse(localStorage.getItem("produtos") || "[]");
  const produto = produtos[index];
  document.getElementById("nome").value = produto.nome;
  document.getElementById("preco").value = produto.preco;
  document.getElementById("imagem").value = produto.imagem;

  const btn = document.getElementById("btn-salvar");
  btn.textContent = "Salvar Alterações";
  btn.onclick = () => adicionarProduto(index);
}

function removerProduto(index) {
  const produtos = JSON.parse(localStorage.getItem("produtos") || "[]");
  produtos.splice(index, 1);
  localStorage.setItem("produtos", JSON.stringify(produtos));
  listarProdutos();
  filtrarProdutos(); // Atualiza busca após remoção
}

function filtrarProdutos() {
  const termo = document.getElementById("busca").value.toLowerCase();
  const produtos = document.querySelectorAll("#lista-produtos .produto");

  produtos.forEach(prod => {
    const nome = prod.querySelector("strong").textContent.toLowerCase();
    prod.style.display = nome.includes(termo) ? "block" : "none";
  });
}

// Preenche campo de URL ao escolher imagem
document.addEventListener("DOMContentLoaded", () => {
  const seletor = document.getElementById("seletorImagem");
  if (seletor) {
    seletor.addEventListener("change", function () {
      const file = this.files[0];
      if (file) {
        const url = URL.createObjectURL(file);
        document.getElementById("imagem").value = url;
      }
    });
  }
});