/* ==========================================================
   Grão Mineiro - JavaScript
   Arquivo externo ligado no index.html com:
   <script src="js/script.js"></script>
   ========================================================== */

// ---------- VARIÁVEIS E TIPOS DE DADOS ----------
const NOME_LOJA = "Grão Mineiro";      // string
const VALOR_FRETE = 15.0;              // number
const DESCONTO_PIX = 5;                // porcentagem de desconto no Pix
const PARCELAS = 3;                    // parcelas sem juros
const FRETE_GRATIS_A_PARTIR = 150;     // number
let cupomAplicado = null;              // null (nenhum cupom ainda)
let compraFinalizada = false;          // boolean

// ---------- ARRAYS ----------
// Array de objetos com os produtos da loja
// As fotos são reais e vêm do Wikimedia Commons (licenças livres - ver README)
const URL_FOTOS = "https://upload.wikimedia.org/wikipedia/commons/thumb/";
const produtos = [
    { id: 1, nota: 4.9, avaliacoes: 128, nome: "Café Especial em Grãos", categoria: "Café", preco: 42.90, precoAntigo: null,
      imagem: URL_FOTOS + "0/0b/A_bag_of_coffee_J1.jpg/500px-A_bag_of_coffee_J1.jpg",
      descricao: "Grãos 100% arábica do Sul de Minas, torra média. Pacote de 500 g.", promocao: false },
    { id: 2, nota: 4.8, avaliacoes: 342, nome: "Cápsulas Nespresso Original", categoria: "Cápsulas", preco: 29.90, precoAntigo: 34.90,
      imagem: URL_FOTOS + "f/f8/Nespresso_capsules.jpg/500px-Nespresso_capsules.jpg",
      descricao: "Caixa com 10 cápsulas de alumínio. Intensidade 8.", promocao: true },
    { id: 3, nota: 4.7, avaliacoes: 76, nome: "Kit Cápsulas Sortidas", categoria: "Cápsulas", preco: 129.90, precoAntigo: null,
      imagem: URL_FOTOS + "c/cc/Nespresso-capsules_AB-01.jpg/500px-Nespresso-capsules_AB-01.jpg",
      descricao: "50 cápsulas de sabores variados, compatíveis com Nespresso.", promocao: false },
    { id: 4, nota: 5.0, avaliacoes: 211, nome: "Cafeteira Bialetti Moka Express", categoria: "Acessórios", preco: 249.90, precoAntigo: 289.90,
      imagem: URL_FOTOS + "1/1b/Moka_Pot_%28143327549%29.jpeg/500px-Moka_Pot_%28143327549%29.jpeg",
      descricao: "A clássica cafeteira italiana de alumínio. Faz 6 xícaras.", promocao: true },
    { id: 5, nota: 4.8, avaliacoes: 94, nome: "Coador Hario V60", categoria: "Acessórios", preco: 89.90, precoAntigo: null,
      imagem: URL_FOTOS + "4/42/Hario_V60_dripper_%2830519007832%29.jpg/500px-Hario_V60_dripper_%2830519007832%29.jpg",
      descricao: "Coador japonês de cerâmica, tamanho 02. Ideal para café filtrado.", promocao: false },
    { id: 6, nota: 4.6, avaliacoes: 57, nome: "Prensa Francesa Inox", categoria: "Acessórios", preco: 159.90, precoAntigo: null,
      imagem: URL_FOTOS + "4/44/Stainless_steel_french_press.png/500px-Stainless_steel_french_press.png",
      descricao: "Prensa de aço inoxidável com capacidade de 1 litro.", promocao: false }
];

// Array de objetos com os cupons de desconto válidos
const cupons = [
    { codigo: "CAFE10",      tipo: "porcentagem", valor: 10, minimo: 0  },
    { codigo: "PRIMEIRA20",  tipo: "porcentagem", valor: 20, minimo: 80 },
    { codigo: "FRETEGRATIS", tipo: "frete",       valor: 0,  minimo: 0  }
];

// Array de depoimentos de clientes
const depoimentos = [
    { nome: "Mariana S.", cidade: "Belo Horizonte - MG", estrelas: 5,
      texto: "O café em grãos chegou fresquinho, com a data da torra no pacote. Dá para sentir a diferença na xícara!" },
    { nome: "Carlos A.", cidade: "São Paulo - SP", estrelas: 5,
      texto: "Comprei a Moka Express e as cápsulas. Entrega rápida e tudo muito bem embalado." },
    { nome: "Juliana R.", cidade: "Curitiba - PR", estrelas: 4,
      texto: "Atendimento excelente e preço justo. Já virei cliente fiel do coador V60." }
];

// Carrinho: começa vazio e recebe objetos { id, nome, preco, quantidade }
let carrinho = [];

// ---------- DOM: pegando os elementos da página ----------
const listaProdutos   = document.getElementById("lista-produtos");
const itensCarrinho   = document.getElementById("itens-carrinho");
const carrinhoVazio   = document.getElementById("carrinho-vazio");
const contador        = document.getElementById("contador-carrinho");
const campoSubtotal   = document.getElementById("valor-subtotal");
const campoDesconto   = document.getElementById("valor-desconto");
const campoFrete      = document.getElementById("valor-frete");
const campoTotal      = document.getElementById("valor-total");
const formCupom       = document.getElementById("form-cupom");
const campoCupom      = document.getElementById("campo-cupom");
const mensagemCupom   = document.getElementById("mensagem-cupom");
const botaoComprar    = document.getElementById("botao-comprar");
const mensagemCompra  = document.getElementById("mensagem-compra");
const formContato     = document.getElementById("form-contato");
const mensagemContato = document.getElementById("mensagem-contato");
const botaoTopo       = document.getElementById("voltar-topo");
const campoBusca      = document.getElementById("campo-busca");
const nenhumProduto   = document.getElementById("nenhum-produto");
const avisoCarrinho   = document.getElementById("aviso-carrinho");
const botoesFiltro    = document.querySelectorAll(".filtro");

// Categoria escolhida nos filtros ("Todos" mostra tudo)
let categoriaAtual = "Todos";

// ---------- FUNÇÕES ----------

// Formata um número para o padrão de dinheiro brasileiro (R$ 0,00)
function formatarMoeda(valor) {
    return "R$ " + valor.toFixed(2).replace(".", ",");
}

// Monta as estrelinhas de avaliação (ESTRUTURA DE REPETIÇÃO for)
function gerarEstrelas(nota) {
    let estrelas = "";
    for (let i = 1; i <= 5; i++) {
        // Math.round arredonda a nota (ex.: 4,6 vira 5 estrelas)
        if (i <= Math.round(nota)) {
            estrelas += "★";
        } else {
            estrelas += "☆";
        }
    }
    return estrelas;
}

// Mostra os produtos na tela.
// Recebe uma lista (array) para poder mostrar só os produtos filtrados.
function mostrarProdutos(lista) {
    let html = "";

    for (let i = 0; i < lista.length; i++) {
        const p = lista[i];
        let etiquetas = "";

        // ESTRUTURA CONDICIONAL: só mostra a etiqueta se o produto estiver em promoção
        if (p.promocao === true) {
            // Calcula a porcentagem de desconto da promoção
            const porcentagem = Math.round((1 - p.preco / p.precoAntigo) * 100);
            etiquetas += '<span class="etiqueta">' + porcentagem + '% OFF</span>';
        }
        // Operador lógico: produto muito bem avaliado E com muitas avaliações
        if (p.nota >= 4.8 && p.avaliacoes > 100) {
            etiquetas += '<span class="etiqueta preta">MAIS VENDIDO</span>';
        }

        // Se tiver preço antigo, mostra ele riscado (operador ternário)
        const precoAntigo = p.precoAntigo !== null
            ? `<span class="preco-antigo">${formatarMoeda(p.precoAntigo)}</span>`
            : "";

        // Operações matemáticas: preço no Pix e valor de cada parcela
        const precoPix = p.preco - (p.preco * DESCONTO_PIX / 100);
        const valorParcela = p.preco / PARCELAS;

        html += `
            <div class="card">
                <div class="etiquetas">${etiquetas}</div>
                <div class="card-imagem">
                    <img src="${p.imagem}" alt="${p.nome}">
                </div>
                <div class="card-corpo">
                    <span class="categoria">${p.categoria}</span>
                    <h3>${p.nome}</h3>
                    <p class="descricao">${p.descricao}</p>
                    <p class="estrelas">${gerarEstrelas(p.nota)} <small>(${p.avaliacoes})</small></p>
                    <p>${precoAntigo}<span class="preco">${formatarMoeda(p.preco)}</span></p>
                    <p class="parcelas">ou ${PARCELAS}x de ${formatarMoeda(valorParcela)} sem juros</p>
                    <p class="preco-pix">${formatarMoeda(precoPix)} no Pix (${DESCONTO_PIX}% off)</p>
                    <button class="botao botao-adicionar" onclick="adicionarAoCarrinho(${p.id})">Adicionar ao carrinho</button>
                </div>
            </div>
        `;
    }

    listaProdutos.innerHTML = html;

    // Mostra a mensagem quando a busca não encontra nada
    nenhumProduto.style.display = lista.length === 0 ? "block" : "none";
}

// Deixa o texto em minúsculas e sem acentos (ex.: "Cápsulas" vira "capsulas")
function normalizarTexto(texto) {
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Filtra os produtos pela categoria escolhida e pelo texto da busca
function filtrarProdutos() {
    const textoBusca = normalizarTexto(campoBusca.value.trim());

    const filtrados = produtos.filter(function (produto) {
        const categoriaOk = categoriaAtual === "Todos" || produto.categoria === categoriaAtual;
        const buscaOk = normalizarTexto(produto.nome).includes(textoBusca);
        return categoriaOk && buscaOk;
    });

    mostrarProdutos(filtrados);
}

// Mostra os depoimentos dos clientes (repetição com forEach)
function mostrarDepoimentos() {
    const lista = document.getElementById("lista-depoimentos");
    let html = "";

    depoimentos.forEach(function (d) {
        html += `
            <div class="depoimento">
                <p class="estrelas">${gerarEstrelas(d.estrelas)}</p>
                <p>"${d.texto}"</p>
                <div class="autor">
                    <span class="avatar">${d.nome.charAt(0)}</span>
                    <div><strong>${d.nome}</strong><small>${d.cidade}</small></div>
                </div>
            </div>
        `;
    });

    lista.innerHTML = html;
}

// Mostra o aviso "Produto adicionado" por 2 segundos
let tempoAviso;
function mostrarAvisoCarrinho(nomeProduto) {
    avisoCarrinho.textContent = "✔ " + nomeProduto + " adicionado ao carrinho";
    avisoCarrinho.classList.add("visivel");
    clearTimeout(tempoAviso);
    tempoAviso = setTimeout(function () {
        avisoCarrinho.classList.remove("visivel");
    }, 2000);
}

// Procura um produto pelo id
function buscarProduto(id) {
    return produtos.find(function (produto) {
        return produto.id === id;
    });
}

// Adiciona um produto no carrinho (ou aumenta a quantidade se já existir)
function adicionarAoCarrinho(id) {
    if (compraFinalizada) {
        // Se já comprou, começa um carrinho novo
        compraFinalizada = false;
        mensagemCompra.textContent = "";
    }

    const produto = buscarProduto(id);
    const itemExistente = carrinho.find(function (item) {
        return item.id === id;
    });

    if (itemExistente) {
        itemExistente.quantidade++;          // operação matemática (incremento)
    } else {
        carrinho.push({
            id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            quantidade: 1
        });
    }

    atualizarCarrinho();
    mostrarAvisoCarrinho(produto.nome);
}

// Muda a quantidade de um item (+1 ou -1)
function alterarQuantidade(id, mudanca) {
    for (let i = 0; i < carrinho.length; i++) {
        if (carrinho[i].id === id) {
            carrinho[i].quantidade = carrinho[i].quantidade + mudanca;

            // Se a quantidade chegar a zero, remove o item
            if (carrinho[i].quantidade <= 0) {
                carrinho.splice(i, 1);
            }
            break;
        }
    }
    atualizarCarrinho();
}

// Remove um item do carrinho usando filter
function removerDoCarrinho(id) {
    carrinho = carrinho.filter(function (item) {
        return item.id !== id;
    });
    atualizarCarrinho();
}

// Soma o valor de todos os itens do carrinho
function calcularSubtotal() {
    let soma = 0;
    carrinho.forEach(function (item) {
        soma += item.preco * item.quantidade;   // multiplicação e soma
    });
    return soma;
}

// Conta quantas unidades existem no carrinho (usando WHILE)
function contarItens() {
    let total = 0;
    let i = 0;
    while (i < carrinho.length) {
        total += carrinho[i].quantidade;
        i++;
    }
    return total;
}

// Calcula o desconto do cupom aplicado
function calcularDesconto(subtotal) {
    if (cupomAplicado === null) {
        return 0;
    }

    // Se o subtotal caiu abaixo do mínimo do cupom, ele deixa de valer
    if (subtotal < cupomAplicado.minimo) {
        return 0;
    }

    switch (cupomAplicado.tipo) {
        case "porcentagem":
            return subtotal * (cupomAplicado.valor / 100);
        case "frete":
            return 0; // esse cupom não dá desconto no produto, só no frete
        default:
            return 0;
    }
}

// Calcula o frete
function calcularFrete(subtotal) {
    // OPERADORES LÓGICOS: carrinho vazio OU subtotal acima do limite OU cupom de frete
    const temCupomFrete = cupomAplicado !== null && cupomAplicado.tipo === "frete";

    if (subtotal === 0 || subtotal >= FRETE_GRATIS_A_PARTIR || temCupomFrete) {
        return 0;
    }
    return VALOR_FRETE;
}

// Redesenha o carrinho na tela e recalcula os valores
function atualizarCarrinho() {
    let linhas = "";

    for (const item of carrinho) {
        const subtotalItem = item.preco * item.quantidade;
        linhas += `
            <tr>
                <td>${item.nome}</td>
                <td>${formatarMoeda(item.preco)}</td>
                <td>
                    <div class="controle-qtd">
                        <button class="botao-qtd" onclick="alterarQuantidade(${item.id}, -1)">-</button>
                        <span>${item.quantidade}</span>
                        <button class="botao-qtd" onclick="alterarQuantidade(${item.id}, 1)">+</button>
                    </div>
                </td>
                <td>${formatarMoeda(subtotalItem)}</td>
                <td><button class="botao-remover" onclick="removerDoCarrinho(${item.id})">Remover</button></td>
            </tr>
        `;
    }

    itensCarrinho.innerHTML = linhas;

    // Mostra ou esconde a mensagem de carrinho vazio
    if (carrinho.length === 0) {
        carrinhoVazio.style.display = "block";
    } else {
        carrinhoVazio.style.display = "none";
    }

    const subtotal = calcularSubtotal();
    const desconto = calcularDesconto(subtotal);
    const frete    = calcularFrete(subtotal);
    const total    = subtotal - desconto + frete;

    campoSubtotal.textContent = formatarMoeda(subtotal);
    campoDesconto.textContent = "- " + formatarMoeda(desconto);
    campoFrete.textContent    = frete === 0 ? "Grátis" : formatarMoeda(frete);
    campoTotal.textContent    = formatarMoeda(total);
    contador.textContent      = contarItens();

    atualizarBarraFrete(subtotal);

    // O botão de compra só fica ativo se tiver algo no carrinho
    botaoComprar.disabled = carrinho.length === 0;

    // Avisa se o cupom deixou de valer por causa do valor mínimo
    if (cupomAplicado !== null && subtotal > 0 && subtotal < cupomAplicado.minimo) {
        mostrarMensagem(mensagemCupom,
            "O cupom " + cupomAplicado.codigo + " exige compra mínima de " + formatarMoeda(cupomAplicado.minimo) + ".",
            "erro");
    }

    salvarCarrinho();
}

// Atualiza a barra que mostra quanto falta para o frete grátis
function atualizarBarraFrete(subtotal) {
    const textoFrete = document.getElementById("texto-frete");
    const barraFrete = document.getElementById("barra-frete");
    const temCupomFrete = cupomAplicado !== null && cupomAplicado.tipo === "frete";

    // Porcentagem preenchida da barra (no máximo 100%)
    let porcentagem = (subtotal / FRETE_GRATIS_A_PARTIR) * 100;
    if (porcentagem > 100 || temCupomFrete) {
        porcentagem = 100;
    }
    barraFrete.style.width = porcentagem + "%";

    if (subtotal === 0) {
        textoFrete.textContent = "Adicione produtos para ganhar frete grátis.";
    } else if (subtotal >= FRETE_GRATIS_A_PARTIR || temCupomFrete) {
        textoFrete.innerHTML = "🎉 Você ganhou <strong>frete grátis</strong>!";
    } else {
        const falta = FRETE_GRATIS_A_PARTIR - subtotal;
        textoFrete.innerHTML = "Faltam <strong>" + formatarMoeda(falta) + "</strong> para o frete grátis.";
    }
}

// Mostra uma mensagem colorida (classe "sucesso" ou "erro" do CSS)
function mostrarMensagem(elemento, texto, tipo) {
    elemento.textContent = texto;
    elemento.className = tipo;
}

// ---------- CUPOM DE DESCONTO ----------
function aplicarCupom(codigoDigitado) {
    const codigo = codigoDigitado.trim().toUpperCase();

    if (codigo === "") {
        mostrarMensagem(mensagemCupom, "Digite um cupom.", "erro");
        return;
    }

    if (carrinho.length === 0) {
        mostrarMensagem(mensagemCupom, "Adicione produtos antes de usar um cupom.", "erro");
        return;
    }

    // Procura o cupom no array
    let cupomEncontrado = null;
    for (let i = 0; i < cupons.length; i++) {
        if (cupons[i].codigo === codigo) {
            cupomEncontrado = cupons[i];
        }
    }

    if (cupomEncontrado === null) {
        cupomAplicado = null;
        mostrarMensagem(mensagemCupom, "Cupom inválido!", "erro");
    } else if (calcularSubtotal() < cupomEncontrado.minimo) {
        mostrarMensagem(mensagemCupom,
            "Esse cupom só vale para compras acima de " + formatarMoeda(cupomEncontrado.minimo) + ".",
            "erro");
    } else {
        cupomAplicado = cupomEncontrado;
        if (cupomEncontrado.tipo === "porcentagem") {
            mostrarMensagem(mensagemCupom, "Cupom aplicado: " + cupomEncontrado.valor + "% de desconto!", "sucesso");
        } else {
            mostrarMensagem(mensagemCupom, "Cupom aplicado: frete grátis!", "sucesso");
        }
    }

    atualizarCarrinho();
}

// ---------- BOTÃO DE COMPRA ----------
function finalizarCompra() {
    if (carrinho.length === 0) {
        mostrarMensagem(mensagemCompra, "Seu carrinho está vazio.", "erro");
        return;
    }

    const total = calcularSubtotal() - calcularDesconto(calcularSubtotal()) + calcularFrete(calcularSubtotal());
    const numeroPedido = Math.floor(Math.random() * 90000) + 10000; // número aleatório de 5 dígitos

    mostrarMensagem(mensagemCompra,
        "Compra finalizada! Pedido nº " + numeroPedido + " no valor de " + formatarMoeda(total) +
        ". Obrigado por comprar na " + NOME_LOJA + "!",
        "sucesso");

    // Limpa o carrinho e o cupom
    compraFinalizada = true;
    carrinho = [];
    cupomAplicado = null;
    campoCupom.value = "";
    mensagemCupom.textContent = "";
    atualizarCarrinho();
}

// ---------- localStorage: guarda o carrinho se a página for recarregada ----------
function salvarCarrinho() {
    localStorage.setItem("carrinhoGraoMineiroV2", JSON.stringify(carrinho));
}

function carregarCarrinho() {
    const dados = localStorage.getItem("carrinhoGraoMineiroV2");
    if (dados !== null) {
        carrinho = JSON.parse(dados);
    }
}

// ---------- EVENTOS ----------

// Envio do formulário do cupom
formCupom.addEventListener("submit", function (evento) {
    evento.preventDefault(); // não deixa a página recarregar
    aplicarCupom(campoCupom.value);
});

// Clique no botão de compra
botaoComprar.addEventListener("click", finalizarCompra);

// Envio do formulário de contato com validação simples
formContato.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const mensagem = document.getElementById("mensagem").value.trim();

    if (nome === "" || email === "" || mensagem === "") {
        mostrarMensagem(mensagemContato, "Preencha nome, e-mail e mensagem.", "erro");
    } else if (!email.includes("@")) {
        mostrarMensagem(mensagemContato, "Digite um e-mail válido.", "erro");
    } else {
        mostrarMensagem(mensagemContato, "Obrigado, " + nome + "! Responderemos em breve.", "sucesso");
        formContato.reset();
    }
});

// Clique nos botões de categoria
botoesFiltro.forEach(function (botao) {
    botao.addEventListener("click", function () {
        // Tira a classe "ativo" de todos e coloca só no botão clicado
        botoesFiltro.forEach(function (b) {
            b.classList.remove("ativo");
        });
        botao.classList.add("ativo");

        categoriaAtual = botao.dataset.categoria;
        filtrarProdutos();
    });
});

// Busca: filtra enquanto a pessoa digita (evento "input")
campoBusca.addEventListener("input", filtrarProdutos);

// Ao apertar Enter na busca, vai até a seção de produtos
document.getElementById("form-busca").addEventListener("submit", function (evento) {
    evento.preventDefault();
    document.getElementById("produtos").scrollIntoView();
});

// Perguntas frequentes: abre e fecha a resposta ao clicar (acordeão)
const perguntas = document.querySelectorAll(".faq-pergunta");
for (const pergunta of perguntas) {
    pergunta.addEventListener("click", function () {
        const item = pergunta.parentElement;
        const resposta = item.querySelector(".faq-resposta");

        if (item.classList.contains("aberto")) {
            item.classList.remove("aberto");
            resposta.style.maxHeight = null;
        } else {
            item.classList.add("aberto");
            resposta.style.maxHeight = resposta.scrollHeight + "px";
        }
    });
}

// Mostra o botão "voltar ao topo" depois de rolar 400px
window.addEventListener("scroll", function () {
    if (window.scrollY > 400) {
        botaoTopo.style.display = "block";
    } else {
        botaoTopo.style.display = "none";
    }
});

// ---------- INÍCIO ----------
// Exemplo de "typeof" para mostrar os tipos de dados no console
console.log("Loja:", NOME_LOJA, "- tipo:", typeof NOME_LOJA);
console.log("Frete:", VALOR_FRETE, "- tipo:", typeof VALOR_FRETE);
console.log("Compra finalizada?", compraFinalizada, "- tipo:", typeof compraFinalizada);
console.log("Produtos é um array?", Array.isArray(produtos));

carregarCarrinho();
mostrarProdutos(produtos);
mostrarDepoimentos();
atualizarCarrinho();
