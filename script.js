
document.addEventListener("DOMContentLoaded", () => {
    const produtos = document.querySelectorAll(".produto-card");
    const menuLateral = document.querySelector(".menu-lateral");

    const catalogo = document.querySelector(".catalogo-produtos");
    const pesquisa = document.createElement("input");

    pesquisa.type = "text";
    pesquisa.placeholder = "Pesquisar produtos...";
    pesquisa.className = "campo-pesquisa";
    pesquisa.style.cssText = `
        width: 100%;
        max-width: 400px;
        padding: 12px;
        margin: 10px 0 20px;
        border: 1px solid #ccc;
        border-radius: 8px;
        font-size: 16px;
    `;

    catalogo.insertBefore(pesquisa, catalogo.querySelector(".grade-produtos"));

    const carrinho = [];
    const areaCarrinho = document.createElement("section");

    areaCarrinho.id = "area-carrinho";
areaCarrinho.className = "secao-info";
areaCarrinho.innerHTML = `
  <h2>Meu carrinho (<span id="quantidade">0</span>)</h2>
  <div id="itens-carrinho"></div>
  <h3>Total: <span id="total">R$ 0,00</span></h3>
  <button id="limpar-carrinho">Limpar carrinho</button>
`;
const botaoLimpar = areaCarrinho.querySelector("#limpar-carrinho");
botaoLimpar.style.backgroundColor = "#007bff"; 
botaoLimpar.style.color = "#ffffff";           
botaoLimpar.style.border = "none";             
botaoLimpar.style.padding = "10px 15px";      
botaoLimpar.style.cursor = "pointer";        


    document.querySelector("main").after(areaCarrinho);

    function formatarPreco(valor) {
        return valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }

    function atualizarCarrinho() {
        const lista = document.querySelector("#itens-carrinho");
        const quantidade = document.querySelector("#quantidade");
        const totalElemento = document.querySelector("#total");

        lista.innerHTML = "";

        let total = 0;
        let quantidadeTotal = 0;

        carrinho.forEach((item, indice) => {
            total += item.preco * item.quantidade;
            quantidadeTotal += item.quantidade;

            const produto = document.createElement("div");

            produto.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 12px;
                flex-wrap: wrap;
                padding: 12px 0;
                border-bottom: 1px solid #ddd;
            `;

            const descricao = document.createElement("span");
            descricao.textContent =
                `${item.nome} — ${formatarPreco(item.preco)} x ${item.quantidade}`;

            const remover = document.createElement("button");
            remover.textContent = "Remover";
            remover.addEventListener("click", () => {
                carrinho.splice(indice, 1);
                atualizarCarrinho();
            });

            produto.append(descricao, remover);
            lista.appendChild(produto);
        });

        quantidade.textContent = quantidadeTotal;
        totalElemento.textContent = formatarPreco(total);

        if (carrinho.length === 0) {
            lista.textContent = "Seu carrinho está vazio.";
        }
    }

    produtos.forEach((produto) => {
        const nome = produto.querySelector("h4").textContent.trim();

        const textoPreco = produto
            .querySelector(".preco")
            .textContent
            .replace("R$", "")
            .trim()
            .replace(/\./g, "")
            .replace(",", ".");

        const preco = Number(textoPreco);

        const botao = document.createElement("button");
        botao.textContent = "Adicionar ao carrinho";
        botao.className = "botao-carrinho";

        botao.style.cssText = `
            background: #087f5b;
            color: white;
            border: none;
            border-radius: 6px;
            padding: 10px;
            margin-top: 10px;
            cursor: pointer;
            width: 100%;
        `;

        botao.addEventListener("click", () => {
            const itemExistente = carrinho.find(
                item => item.nome === nome
            );

            if (itemExistente) {
                itemExistente.quantidade++;
            } else {
                carrinho.push({
                    nome,
                    preco,
                    quantidade: 1
                });
            }

            atualizarCarrinho();

            botao.textContent = "Adicionado! ✓";

            setTimeout(() => {
                botao.textContent = "Adicionar ao carrinho";
            }, 1200);
        });

        produto.appendChild(botao);
    });

    pesquisa.addEventListener("input", () => {
        const termo = pesquisa.value
            .toLocaleLowerCase("pt-BR")
            .trim();

        produtos.forEach((produto) => {
            const nome = produto.textContent
                .toLocaleLowerCase("pt-BR");

            produto.style.display = nome.includes(termo)
                ? ""
                : "none";
        });
    });

    const categorias = {
        "Promoções": "#promocoes",
        "Skincare": ["protetor solar", "hidratante facial",
                     "sérum vitamina c", "hidratante labial",
                     "máscara de argila"],
        "Makes": ["tintas de cabelo", "pó descolorante"],
        "Infantil": ["fralda", "mucilon"],
        "Higiene": ["shampoo neutro", "escovas dentais"],
        "Suplementos": ["vitamina az"]
    };

    menuLateral.querySelectorAll(".categoria").forEach((categoria) => {
        const titulo = categoria.querySelector("h3")
            .textContent.trim();

        categoria.style.cursor = "pointer";

        categoria.addEventListener("click", () => {
            if (titulo === "Carrinho") {
                areaCarrinho.scrollIntoView({
                    behavior: "smooth"
                });
                return;
            }

            if (titulo === "Ajuda") {
                alert(
                    "Bem-vindo à Medifarma!\n\n" +
                    "Pesquise produtos, escolha uma categoria " +
                    "ou adicione itens ao carrinho."
                );
                return;
            }

            if (titulo === "Promoções") {
                pesquisa.value = "";
                produtos.forEach(p => p.style.display = "");
                catalogo.scrollIntoView({ behavior: "smooth" });
                return;
            }

            const nomes = categorias[titulo];

            if (!nomes) return;

            pesquisa.value = "";

            produtos.forEach((produto) => {
                const nome = produto.querySelector("h4")
                    .textContent.toLocaleLowerCase("pt-BR");

                produto.style.display = nomes.some(item =>
                    nome.includes(item)
                ) ? "" : "none";
            });

            catalogo.scrollIntoView({ behavior: "smooth" });
        });
    });

    // Limpar o carrinho
    document.querySelector("#limpar-carrinho")
        .addEventListener("click", () => {
            carrinho.length = 0;
            atualizarCarrinho();
        });

    atualizarCarrinho();
});
