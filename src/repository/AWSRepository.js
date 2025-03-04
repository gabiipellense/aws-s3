const AWS = require('aws-sdk');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const bucketName = 'top-care'
const path = require('path');
require('dotenv').config();

// Configuração das credenciais AWS usando variáveis de ambiente
AWS.config.update({
  region: 'us-east-1',
  accessKeyId: '{key}',
  secretAccessKey: '{secret}'
});

// Instância do S3
const s3 = new AWS.S3();

const mandarImagem = async (referencia) => {
  try {
    const filePath = '{copiar caminho do arquivo}';

    if (!fs.existsSync(filePath)) {
      console.error('Arquivo não encontrado:', filePath);
      return;
    }

    const fileUrl = await uploadFile(filePath, bucketName, referencia);
    console.log('Arquivo enviado com sucesso:', fileUrl);
  } catch (err) {
    console.error('Erro ao enviar o arquivo:', err);
  }
};

// Função para fazer o upload de um arquivo para o S3
const uploadFile = (filePath, bucketName, referencia) => {
  const fileContent = fs.readFileSync(filePath); // Lê o arquivo corretamente

  const params = {
    Bucket: bucketName,
    Key: referencia + '.jpeg',
    Body: fileContent // Agora Body está correto!
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        return reject(err);
      }

      resolve({
        fileUrl: data.Location
      });
    });
  });
};

// Função para baixar um arquivo do S3
const downloadFile = (referencia) => {
  const params = {
    Bucket: bucketName,
    Key: referencia + ".jpeg"
  };

  s3.getObject(params).promise()
    .then(data => {

      const downloadsPath = path.join(require('os').homedir(), 'Downloads');
      const filePath = path.join(downloadsPath, referencia + ".jpeg");
      fs.writeFileSync(filePath, data.Body);

      console.log('Arquivo baixado com sucesso:', filePath);

    })
    .catch(err => {
      console.error('Erro ao baixar o arquivo:', err);
    });
};

module.exports = {
  mandarImagem,
  downloadFile
};
