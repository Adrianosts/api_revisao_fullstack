import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
const { v4: uuidv4 } = require("uuid");

const app = express();
let PORT = 8080;

app.use(express.json());
app.use(cors());

app.get("/", (request, response) => {
  return response.json("OK");
});

app.listen(PORT, () => console.log("Servidor rodando na porta 8080"));

// Váriável de produto e preço
let nomeProduto;
let precoProduto;
let nomeProdutoAtualizar;

// Lista vazia para armazenar produtos e pessoas
let listaProdutos = [];
let listaPessoas = [];

// ------ CRIAR PESSOA USUÁRIA ----------

// Async e await pois a resposta do bcrypt retorna uma promisse

app.post("/criar-usuario", async (request, response) => {
  const { nomePessoaUsuaria, emailPessoaUsuaria, senhaPessoaUsuaria } =
    request.body;

  try {
    if (!nomePessoaUsuaria) {
      return response
        .status(400)
        .json({ message: "Nome inválido, informe o nome." });
    }

    if (!emailPessoaUsuaria) {
      return response.status(400).json({ message: "Insira um e-mail válido." });
    }

    if (!senhaPessoaUsuaria) {
      return response.status(400).json({ message: "Senha inválida." });
    }

    // Variavel para a criação de ID automático.
    const idAutomatico = uuidv4();

    // Variável que vai criptografar a (senhaPessoaUsuaria)
    const senhaHasheada = await bcrypt.hash(senhaPessoaUsuaria, 10);

    const novaPessoaUsuaria = {
      id: idAutomatico,
      nomePessoaUsuaria,
      emailPessoaUsuaria,
      senhaPessoaUsuaria: senhaHasheada,
    };

    // Adicionar a (novaPessoaUsuaria) no array de (ListaPessoas)
    listaPessoas.push(novaPessoaUsuaria);

    response
      .status(201)
      .json({ message: "Pessoa criada com sucesso", data: listaPessoas });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Erro interno" });
  }
});

// -------- LOGAR PESSOA USUÁRIA ------------

app.post("/login", async (request, response) => {
  try {
    // Pegar (emailPessoaUsuaria) e (senhaPessoaUsuaria) armazenados no corpo da requisição.
    const emailPessoaUsuaria = request.body.emailPessoaUsuaria;
    const senhaPessoaUsuaria = request.body.senhaPessoaUsuaria;

    // Se diferente de emailPessoaUsuaria
    if (!emailPessoaUsuaria) {
      return response.status(400).json({ message: "Passe um e-mail válido." });
    }

    // Se diferente de senhaPessoaUsuaria
    if (!senhaPessoaUsuaria) {
      return response.status(400).json({ message: "Senha inválida" });
    }

    // Buscar (emailPessoaUsuaria) na (listaPessoas) e verificar são iguais.
    const pessoaBuscada = listaPessoas.find(
      (pessoa) => pessoa.emailPessoaUsuaria === emailPessoaUsuaria
    );

    // Se diferente de pesssoBuscada
    if (!pessoaBuscada) {
      return response.status(404).json({
        message:
          "Pessoa usuária não encontrada no nosso banco. Verifique o e-mail passado.",
      });
    }

    // Comparar a senha da pessoa usuaria com a senha da pessoa buscada.
    const senhaEncontrada = await bcrypt.compare(
      senhaPessoaUsuaria,
      pessoaBuscada.senhaPessoaUsuaria
    );

    // Se diferente de senhaEncontrada
    if (!senhaEncontrada) {
      return response.status(400).json({ message: "Credenciais inválidas." });
    }

    response.status(200).json({
      message: "Login bem-sucedido!",
      userId: pessoaBuscada.id, // Idêntificador da pessoaBuscada
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Erro interno" });
  }
});


//-------- CRIAR PRODUTO (POST) ------ 

function criarProduto() {
  app.post("/criar-produtos", (req, res) => {
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

    res.status(201).json({ msg: "Produto cadastrado com sucesso!", data: listaProdutos });
  });
}

criarProduto();


//--------- LER PRODUTO (GET) --------

function listarProdutos() {
  // Verificar o tamanho da lista, e mostrar caso tenha produtos cadastrados.
  app.get("/listar-Produtos", (req, res) => {
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


//  ATUALIAR PRODUTO (PUT)

function atualizarProduto() {
  app.put("/listar-produtos/:nomeProdutoAtualizado", (req, res) => {
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

      res.status(201).json({
        message: "Produto atualizado com sucesso",
        data: listaProdutos,
      });
    } catch (error) {
      res.status(500).json({ "Erro interno": error });
    }
  });
}

atualizarProduto();


// -------- DELETAR PRODUTO (DELETE) -----------

function deletarProduto() {
  app.delete("/produtos/:nomeProdutoDeletado", (req, res) => {
    const nomeProdutoDeletado = req.params.nomeProduto;

    try {
      const indiceProdutoBuscado = listaProdutos.findIndex(
        (produto) => produto.nomeDoProduto === nomeProdutoDeletado
      );

      if (indiceProdutoBuscado === -1) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }

      listaProdutos.splice(indiceProdutoBuscado, 1);

      res.status(201).json({ message: "Produto deletado com sucesso" });
    } catch (error) {
      res.status(404).json("Erro interno");
    }
  });
}

deletarProduto();

// Imprimir o estoque atualizado
console.log("Estoque atualizado:", listaProdutos);
