// src/service/AWSService.js
const AWSRepository = require('../repository/AWSRepository');
const imagemRepository = require('../repository/imagemRepository')

// Função para fazer o upload de um arquivo para o S3
const uploadFileToS3 = async (referencia) => {
  try {
    const imagem = await imagemRepository.buscarImagem(referencia)
    await AWSRepository.mandarImagem(imagem.referencia);
    return { message: "Upload concluido"};  // Retorna a URL e o ID do usuário
  } catch (err) {
    throw new Error('Erro ao fazer o upload: ' + err.message);
  }
};

// Função para fazer o download de um arquivo do S3
const downloadFileFromS3 = async (imagemId) => {
  try {
    const imagem = await imagemRepository.buscarImagem(imagemId)
    AWSRepository.downloadFile(imagem.referencia);
    return { };  // Retorna o caminho e o ID do usuário
  } catch (err) {
    throw new Error('Erro ao fazer o download: ' + err.message);
  }
};

const obterImagemURL = async (bucketName, keyName) => {
    const params = {
      Bucket: bucketName,
      Expires: 60 * 5 // O link expira em 5 minutos, você pode ajustar esse tempo
    };
  
    try {
      const url = AWSRepository.downloadFile(); // Gerando um URL assinado
      return url;
    } catch (error) {
      throw new Error('Erro ao obter a imagem: ' + error.message);
    }
  };

module.exports = {
  uploadFileToS3,
  downloadFileFromS3,
  obterImagemURL
};
