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

// Adiciona produto ao Firebase
function adicionarProduto() {
  const nome = document.getElementById("nome").value;
  const preco = parseFloat(document.getElementById("preco").value);
  const imagem = document.getElementById("imagem").value;

  if (!nome || isNaN(preco) || !imagem) {
    alert("Preencha todos os campos!");
    return;
  }

  firebase.database().ref("produtos").push({ nome, preco, imagem })
    .then(() => {
      alert("Produto salvo com sucesso!");
      listarProdutos();
    });

  // Limpar campos
  document.getElementById("nome").value = "";
  document.getElementById("preco").value = "";
  document.getElementById("imagem").value = "";
  document.getElementById("seletorImagem").value = "";

  const btn = document.getElementById("btn-salvar");
  btn.textContent = "Salvar";
  btn.onclick = adicionarProduto;
}

// Lista os produtos do Firebase
function listarProdutos() {
  const lista = document.getElementById("lista-produtos");
  const contador = document.getElementById("contador-produtos");

  firebase.database().ref("produtos").on("value", snapshot => {
    const produtos = snapshot.val();
    lista.innerHTML = "";
    let total = 0;

    for (const id in produtos) {
      const produto = produtos[id];
      total++;

      const div = document.createElement("div");
      div.className = "produto";
      div.innerHTML = `
        <strong>${produto.nome}</strong><br>
        Preço: R$ ${parseFloat(produto.preco).toFixed(2)}<br>
        <img src="${produto.imagem}" alt="" width="100"><br>
        <button onclick="removerProduto('${id}')">🗑️ Remover</button>
      `;
      lista.appendChild(div);
    }

    contador.textContent = `Total de produtos: ${total}`;
  });
}

// Remove produto do Firebase
function removerProduto(id) {
  if (confirm("Deseja realmente remover este produto?")) {
    firebase.database().ref("produtos/" + id).remove()
      .then(() => {
        alert("Produto removido!");
        listarProdutos();
      });
  }
}

// Filtro de busca (por nome na tela)
function filtrarProdutos() {
  const termo = document.getElementById("busca").value.toLowerCase();
  const produtos = document.querySelectorAll("#lista-produtos .produto");

  produtos.forEach(prod => {
    const nome = prod.querySelector("strong").textContent.toLowerCase();
    prod.style.display = nome.includes(termo) ? "block" : "none";
  });
}

// Preenche o campo de imagem ao selecionar arquivo
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