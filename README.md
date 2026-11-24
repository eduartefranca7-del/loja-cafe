# Grão Mineiro - Loja de Cafés Especiais ☕

Trabalho da disciplina de **Desenvolvimento Web** (Prof.ª Janainny Sena).
Homepage de comércio eletrônico de uma loja de cafés, feita com **HTML, CSS e JavaScript puro**.

**Aluno:** Eduarte Amaral França Pinheiro

## Como abrir

Basta abrir o arquivo `index.html` no navegador (não precisa instalar nada).

## Estrutura de pastas

```
loja-cafe/
├── index.html      -> estrutura da página (HTML)
├── css/style.css   -> estilização (CSS)
├── js/script.js    -> funcionamento do carrinho, cupom e formulários (JavaScript)
└── img/            -> logo da loja (as fotos dos produtos vêm do Wikimedia Commons)
```

## Onde cada requisito foi usado

### 1. HTML
| Requisito | Onde está |
|---|---|
| Imagem | Logo no cabeçalho, fotos dos produtos e foto da seção "Por que comprar com a gente?" |
| Listas | Menu (`<ul>`), vantagens (`<ol>`) e links do rodapé (`<ul>`) |
| Formulários | Formulário de cupom e formulário "Fale Conosco" (input, select, textarea, checkbox) |
| Tabelas | Tabela de preços e tabela do carrinho |
| Links | Menu com âncoras (`#produtos`, `#carrinho`...), links externos e `mailto:` no rodapé |

### 2. CSS
| Requisito | Onde está |
|---|---|
| Classes e IDs | `.container`, `.card`, `.botao`, `#topo`, `#banner`, `#carrinho` etc. |
| Bordas | Cards, tabelas, caixa do cupom (`dashed`), `border-radius` nos botões |
| Cores, fontes e tamanho de texto | Paleta marrom/café, fontes Arial e Georgia, `font-size` nos títulos |
| Estilo de texto | `font-weight`, `font-style: italic`, `text-transform: uppercase`, `letter-spacing` |
| Modelo de caixa | `margin`, `padding`, `width`, `box-sizing: border-box` |
| Elementos flutuantes | Foto com `float: right` na seção "Sobre nós" + `clearfix` |
| Formatação de links | `:hover` no menu e no rodapé, `text-decoration`, `:visited` |
| Posicionamento | `sticky` (cabeçalho e resumo do carrinho), `relative`/`absolute` (etiqueta de desconto e linha do menu), `fixed` (botão voltar ao topo) |
| Extra (layout moderno) | Variáveis CSS (`:root`), Flexbox, CSS Grid, `transition`, `@media` para celular, fontes do Google Fonts |

### 3. JavaScript
| Requisito | Onde está |
|---|---|
| Arquivo JS externo | `js/script.js`, ligado com `<script src="js/script.js">` |
| Variáveis | `const` e `let` (ex.: `VALOR_FRETE`, `cupomAplicado`, `carrinho`) |
| Operações matemáticas e lógicas | Subtotal, desconto em %, frete; `&&`, `\|\|`, `!` em `calcularFrete()` e validações |
| Funções | `adicionarAoCarrinho()`, `calcularSubtotal()`, `aplicarCupom()`, `finalizarCompra()`... |
| Eventos | `submit` (formulários), `click` (botões), `scroll` (botão voltar ao topo) |
| DOM | `getElementById`, `innerHTML`, `textContent`, `style.display`, `className` |
| Estruturas condicionais | `if / else if / else`, `switch` e operador ternário |
| Estruturas de repetição | `for`, `for...of`, `while` e `forEach` |
| Tipos de dados | string, number, boolean, null, object e array (mostrados com `typeof` no console) |
| Arrays | `produtos`, `cupons` e `carrinho` (com `push`, `splice`, `filter`, `find`) |

### 4. Desafio - Projeto Cart
- **Cupom de desconto:** digite o cupom no carrinho e clique em "Aplicar".
  - `CAFE10` → 10% de desconto
  - `PRIMEIRA20` → 20% de desconto em compras a partir de R$ 80,00
  - `FRETEGRATIS` → frete grátis
- **Botão de compra:** "Finalizar compra" fica desativado com o carrinho vazio. Ao clicar, mostra o número do pedido e o valor total, e limpa o carrinho.
- Extra: o frete é grátis acima de R$ 150,00, com uma barra que mostra quanto falta para ganhar o frete grátis, e o carrinho fica salvo no `localStorage` se a página for recarregada.

## Créditos das fotos

As fotos são reais e foram tiradas do [Wikimedia Commons](https://commons.wikimedia.org), com licenças livres. Elas são carregadas direto da internet, então o site precisa de conexão para mostrar as fotos.

| Foto | Autor | Licença |
|---|---|---|
| [Grãos de café torrados](https://commons.wikimedia.org/wiki/File:Espresso-roasted_coffee_beans_(cropped).jpg) (banner) | Wikimedia Commons | CC BY-SA 3.0 |
| [Saca de café](https://commons.wikimedia.org/wiki/File:A_bag_of_coffee_J1.jpg) | Jamain | CC BY-SA 4.0 |
| [Cápsulas Nespresso](https://commons.wikimedia.org/wiki/File:Nespresso_capsules.jpg) | Jiří Sedláček | CC BY-SA 4.0 |
| [Cápsulas sortidas](https://commons.wikimedia.org/wiki/File:Nespresso-capsules_AB-01.jpg) | Andrzej Barabasz | CC BY-SA 4.0 |
| [Bialetti Moka Express](https://commons.wikimedia.org/wiki/File:Moka_Pot_(143327549).jpeg) | Matthew Bellemare | CC BY-SA 3.0 |
| [Coador Hario V60](https://commons.wikimedia.org/wiki/File:Hario_V60_dripper_(30519007832).jpg) | Olgierd Rudak | CC BY 2.0 |
| [Prensa francesa inox](https://commons.wikimedia.org/wiki/File:Stainless_steel_french_press.png) | Shisma | CC BY 4.0 |
| [Hario V60 e chaleira Buono](https://commons.wikimedia.org/wiki/File:Hario_V60_and_Buono_kettle.jpg) (seção Sobre) | Matt Wunderle | CC BY 2.0 |

## Como publicar no GitHub

1. Crie uma conta em https://github.com/?locale=pt-br e clique em **New repository** (ex.: `loja-cafe`).
2. Na página do repositório, clique em **Add file → Upload files** e arraste todo o conteúdo desta pasta (`index.html`, `css`, `js`, `img`, `README.md`).
3. Clique em **Commit changes**.
4. (Opcional) Para o site ficar online: **Settings → Pages → Branch: main → Save**. O link fica `https://SEU-USUARIO.github.io/loja-cafe/`.
5. Envie o link do repositório para a professora.
