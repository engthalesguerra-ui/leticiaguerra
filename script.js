// ==============================================================================
// CONFIGURAÇÃO DA CONEXÃO COM O APPS SCRIPT
// ==============================================================================
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwUUfvD7KUm6cySUXCwO0pK-sDANm-8xNwPES8noX0EeEnQENHDDTvvGOaywzXX2Z4z/exec";

// Imagem padrão de reserva caso a foto do catálogo falhe
const FALLBACK_IMAGE = "assets/catalogo/placeholder-default.jpg";

// ==============================================================================
// REQUISIÇÃO AO BACKEND (APPS SCRIPT)
// ==============================================================================
/**
 * Envia as escolhas do quiz para o Apps Script e busca o produto recomendado
 * @param {string} categoria - Ex: 'perfumaria', 'cuidados', 'cabelos'
 * @param {string} subcategoria - Ex: 'marcante', 'refrescante', 'suave'
 */
async function buscarRecomendacao(categoria, subcategoria) {
  try {
    const url = `${WEB_APP_URL}?categoria=${encodeURIComponent(categoria)}&subcategoria=${encodeURIComponent(subcategoria)}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "sucesso" && data.produto) {
      exibirProdutoNaTela(data.produto);
    } else {
      console.warn("Produto não encontrado no catálogo. Exibindo padrão.");
      exibirProdutoNaTela({
        name: "Produto Recomendado",
        description: "Confira as opções completas do nosso catálogo Boticário.",
        image: FALLBACK_IMAGE,
        link: "https://www.boticario.com.br"
      });
    }
  } catch (error) {
    console.error("Erro na comunicação com o Apps Script:", error);
  }
}

// ==============================================================================
// RENDERIZAÇÃO DA INTERFACE (DOM)
// ==============================================================================
/**
 * Preenche os elementos do cartão de recomendação na tela
 */
function exibirProdutoNaTela(produto) {
  const imgElement = document.getElementById("res-product-img");
  const nameElement = document.getElementById("res-product-name");
  const descElement = document.getElementById("res-product-desc");
  const linkElement = document.getElementById("res-product-link");

  if (!imgElement || !nameElement || !descElement || !linkElement) {
    console.error("Elementos do DOM não encontrados. Verifique as IDs no seu HTML.");
    return;
  }

  // Atualiza imagem, nome, descrição e link de compra
  imgElement.src = produto.image;
  imgElement.alt = produto.name;
  imgElement.classList.remove("img-fallback-fit");

  nameElement.innerText = produto.name;
  descElement.innerText = produto.description;
  linkElement.href = produto.link;
}

/**
 * Tratamento de falha no carregamento da imagem (ativado via onerror no HTML)
 */
function handleImageFallback(imgElement) {
  if (imgElement.src !== FALLBACK_IMAGE) {
    imgElement.src = FALLBACK_IMAGE;
    imgElement.classList.add("img-fallback-fit");
  }
}

// ==============================================================================
// GATILHO DE EXECUÇÃO DO QUIZ
// ==============================================================================
/**
 * Chame esta função no evento de clique das opções do quiz
 * Exemplo: finalizarQuiz('perfumaria', 'marcante');
 */
function finalizarQuiz(categoriaSelecionada, subcategoriaSelecionada) {
  buscarRecomendacao(categoriaSelecionada, subcategoriaSelecionada);
}
