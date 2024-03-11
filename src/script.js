import express from "express";
import cors from "cors";

const app = express();
let PORT = 8080; 

app.use(express.json());

app.get("/", (request, response) => {
  return response.json("OK");
});

app.listen(PORT, () => console.log("Servidor rodando na porta 8080"));

// Váriável de produto e preço
let nomeProduto;
let precoProduto;
let nomeProdutoAtualizar;

// Lista vazia para armazenar os produtos
let listaProdutos = [];

function listarProdutos() {
  // Verificar o tamanho da lista, e mostrar caso tenha produtos cadastrados.
  app.get("/listaProdutos", (req, res) => {
    if (listaProdutos.length > 0) {
      console.log("Produtos no estoque");
      listaProdutos.forEach((produto) => {
        console.log(
          `Nome: ${produto.nomeProduto}, Preço ${produto.precoProduto}`
        );
      });
    } else {
      res.status(400).json({ msg: "Estoque vazio, cadastre um produto" });
      console.log("Estoque vazio, cadastre um produto");
    }

    return res
      .status(200)
      .json({ msg: "Lista retornada com sucesso", data: listaProdutos });
  });
}

listarProdutos();

function criarProduto() {
  app.post("/listaProdutos", (req, res) => {
    const data = req.body;

    // Variavel do novo produto
    const novoProduto = {
      nomeProduto: data.nomeProduto,
      precoProduto: data.precoProduto,
    };

    // Verifique se o nome e preço foram passados e adicione o novo produto à lista
    if (novoProduto.nomeProduto && novoProduto.precoProduto) {
      listaProdutos.push(novoProduto);
    } else {
      res.status(500).json({ msg: "Nenhum produto foi adicionado na lista" });
    }

    res.status(201).json({ msg: "Produto cadastrado com sucesso!" });
  });
}

criarProduto();

function atualizarProduto() {
  app.put("/listaProdutos/:nomeProdutoAtualizado", (req, res) => {
    const nomeProdutoAtualizado = req.params.nomeProdutoAtualizado; // Parametro do produto a ser atualizado
    const nomeProduto = req.body.nomeProduto;
    const precoProduto = req.body.precoProduto;

    try {
      const indiceProdutoBuscado = listaProdutos.findIndex(
        (produto) => produto.nomeProduto === nomeProdutoAtualizado // Buscar (nomeProduto) escolhido e atualizar pelo (novoProdutoAtualizado)
      );

      if (indiceProdutoBuscado === -1) {
        // Produto buscado -1 (Não encontrado)
        return res.status(404).json({ message: "Produto não encontrado" });
      }

      const novoProduto = {
        // Array do (novoProduto)
        nomeProduto,
        precoProduto,
      };

      listaProdutos[indiceProdutoBuscado] = novoProduto; //Buscar na (listaProdutos) o indice do (nomeProduto) e atualizar pelo (novoProduto)

      res
        .status(201)
        .json({
          message: "Produto atualizado com sucesso",
          data: listaProdutos,
        });
    } catch (error) {
      res.status(500).json({ "Erro interno": error });
    }
  });
}

atualizarProduto();


function deletarProduto() {
  app.delete("/produtos/:nomeProdutoDeletado", (req, res) => {
    const nomeProdutoDeletado = req.params.nomeProduto

    try {

      const indiceProdutoBuscado = listaProdutos.findIndex(
        (produto) => produto.nomeDoProduto === nomeProdutoDeletado
      );

      if (indiceProdutoBuscado === -1) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }
      
      listaProdutos.splice(indiceProdutoBuscado, 1)

      res.status(201).json({message: "Produto deletado com sucesso"})

    } catch (error) {
      res.status(404).json("Erro interno");
    }
  });
}

deletarProduto();

// Imprimir o estoque atualizado
console.log("Estoque atualizado:", listaProdutos);
