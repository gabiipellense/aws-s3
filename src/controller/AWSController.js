const imagemService = require('../service/imagemService');
const usuarioService = require('../service/usuarioService');
const awsService = require('../service/AWSService'); // Certifique-se de que esse caminho está correto

const awsListarImagens = async (req, res) => {
    try {
      const imagens = await imagemService.listarImagens();
      res.status(200).json(imagens);
    } catch (err) {
      res.status(500).json({ erro: err.message });
    }
};

const awsListarUsuarios = async (req, res) => {
    try {
      const usuarios = await usuarioService.listarUsuarios();
      res.status(200).json(usuarios);
    } catch (err) {
      res.status(500).json({ erro: err.message });
    }
};

// Função para lidar com o upload de arquivo
const awsUploadFile = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ erro: 'id obrigatório.' });
  }

  try {
    const fileData = await awsService.uploadFileToS3(id);
    res.status(200).json({ mensagem: 'Arquivo carregado com sucesso', fileUrl: fileData.fileUrl });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// Função para lidar com o download de arquivo
const awsDownloadFile = async (req, res) => {
  const { imagemId } = req.body;

  if (!imagemId) {
    return res.status(400).json({ erro: 'imagemId obrigatório.' });
  }

  try {
    const downloadedFile = await awsService.downloadFileFromS3(imagemId);
    res.status(200).json({ mensagem: 'Arquivo baixado com sucesso', downloadedFilePath: downloadedFile.downloadedFilePath });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};   

const obterImagem = async (req, res) => {
  const { id_usuario, nome_imagem } = req.params; // Pega o id do usuário e nome da imagem
  
  const bucketName = 'nome-do-seu-bucket';  // Nome do seu bucket

  try {
    const urlImagem = await awsService.obterImagemURL(bucketName);
    res.status(200).json({ url: urlImagem });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};

module.exports = {
    awsListarImagens,
    awsListarUsuarios,
    awsUploadFile,
    awsDownloadFile,
    obterImagem
}; 
