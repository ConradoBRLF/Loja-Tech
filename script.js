function falarWhatsApp() {
  window.open("https://wa.me/5541995972538", "_blank");
}

let carrinho = [];

function adicionarCarrinho(nome, preco, imagem) {
  const itemExistente = carrinho.find(item => item.nome === nome);
  if (itemExistente) {
    itemExistente.quantidade += 1;
  } else {
    carrinho.push({ nome, preco, imagem, quantidade: 1 });
  }
  atualizarCarrinho();
}

function alterarQuantidade(nome, valor) {
  const item = carrinho.find(i => i.nome === nome);
  if (!item) return;

  item.quantidade += valor;

  if (item.quantidade <= 0) {
    carrinho = carrinho.filter(i => i.nome !== nome);
  }

  atualizarCarrinho();
}

function removerItem(nome) {
  carrinho = carrinho.filter(item => item.nome !== nome);
  atualizarCarrinho();
}

function atualizarCarrinho() {
  const carrinhoDiv = document.getElementById('carrinho');
  const totalSpan = document.getElementById('total');
  carrinhoDiv.innerHTML = '';

  let total = 0;

  carrinho.forEach(item => {
    const div = document.createElement('div');
    div.classList.add('item-carrinho');
    div.innerHTML = `
      <img src="${item.imagem}" alt="${item.nome}" />
      <div class="info">
        <strong>${item.nome}</strong>
        <p>R$ ${(item.preco * item.quantidade).toFixed(2)}</p>
        <div class="quantidade">
          <button onclick="alterarQuantidade('${item.nome}', -1)">-</button>
          <span>${item.quantidade}</span>
          <button onclick="alterarQuantidade('${item.nome}', 1)">+</button>
        </div>
      </div>
    `;
    carrinhoDiv.appendChild(div);
    total += item.preco * item.quantidade;
  });

  totalSpan.textContent = `Total: R$ ${total.toFixed(2)}`;

  const contador = document.getElementById('contador-carrinho');
  if (contador) {
    const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
    contador.textContent = totalItens;
  }

  // Salvar carrinho no localStorage
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

function toggleCarrinho() {
  const popup = document.getElementById('carrinho-popup');
  popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
}

function finalizarPedido() {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }

  let mensagem = "Olá! Gostaria de finalizar meu pedido com os seguintes itens:%0A";
  carrinho.forEach(item => {
    mensagem += `- ${item.nome} (x${item.quantidade}): R$ ${(item.preco * item.quantidade).toFixed(2)}%0A`;
  });

  const total = carrinho.reduce((soma, item) => soma + item.preco * item.quantidade, 0);
  mensagem += `%0ATotal: R$ ${total.toFixed(2)}`;

  window.open(`https://wa.me/5541995972538?text=${mensagem}`, '_blank');
}

function carregarProdutosDoAdmin() {
  const produtos = JSON.parse(localStorage.getItem("produtos") || "[]");
  const grid = document.getElementById("grid-produtos");
  if (!grid) return;

  grid.innerHTML = "";

  produtos.forEach(produto => {
    const div = document.createElement("div");
    div.className = "produto";
    div.innerHTML = `
      <img src="${produto.imagem}" alt="${produto.nome}" />
      <h3>${produto.nome}</h3>
      <p>R$ ${parseFloat(produto.preco).toFixed(2)} <br><small>envio para todo o Brasil</small></p>
      <button onclick="adicionarCarrinho('${produto.nome}', ${parseFloat(produto.preco)}, '${produto.imagem}')">Adicionar ao carrinho</button>
    `;
    grid.appendChild(div);
  });
}

// ✅ Apenas um window.onload com tudo dentro
window.onload = function () {
  const salvo = localStorage.getItem('carrinho');
  if (salvo) {
    carrinho = JSON.parse(salvo);
    atualizarCarrinho();
  }

  carregarProdutosDoAdmin();
};

    // Carregar os produtos cadastrados pelo admin
    window.onload = function () {
      // Carrinho salvo
      const salvo = localStorage.getItem('carrinho');
      if (salvo) {
        carrinho = JSON.parse(salvo);
        atualizarCarrinho();
      }

      // Produtos do admin
      carregarProdutosDoAdmin();
    };