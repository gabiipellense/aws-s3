
const UUID = require('uuid');
const bucketName = 'bucketmi74';
let s3;
let fs = require('fs');
const os = require('os');
const path = require('path');
const conexao = require('../database/database');
const AWS = require('aws-sdk');
AWS.config.update({
  region: 'us-east-1',  
  accessKeyId: '',
  secretAccessKey: ''
});

s3 = new AWS.S3();

const conectarAws = () => {
    
    console.log('Conectando ao AWS...');
}

const databaseCreateImage = ( idUser, filePath) => {
    return new Promise ((resolve, reject) => {
        const ref = UUID.v4();
        const sql = "INSERT INTO tabela_aws (referencia, id_usuario) VALUES (?, ? )";
        conexao.query(sql, [ref, idUser], (err, results) => {
            if (err) {
                reject(new Error("Erro ao criar imagem: " + err.message));
            } else {
                resolve(results);              
            }
        });
        
    mandarParaOAws(ref, filePath);
    });

}

const databaseGetImage = (id) => {
    return new Promise ((resolve, reject) => {
        const sql = "SELECT * FROM tabela_aws WHERE id = ?";
        conexao.query(sql, [id], (err, results) => {
            if (err) {
                reject(new Error("Erro ao buscar imagem: " + err.message));
            } else {
                resolve(results[0]);
            }
        });
    });
}

const downloadImage = ( arquivoNome ) => {
    pegarNoAws(arquivoNome);
}

const mandarParaOAws = ( ref, filePath ) => {

    console.log(filePath);
    const fileContent = fs.readFileSync(filePath);

    const params = {
        Bucket: bucketName, 
        Key: ref,       
        Body: fileContent,
        ContentType: 'image/jpeg' 
    };

    s3.upload(params, (err, data) => {
        if (err) {
            console.error('Erro ao fazer o upload:', err);
        } else {
            console.log('Arquivo carregado com sucesso:', data.Location);
        }
    });

}

const pegarNoAws = ( arquivoNome ) => {

    console.log('Pegando da AWS...');
    console.log(arquivoNome);

    if ( !s3 ) {
        conectarAws();
    }

    const downloadFile = (bucketName, arquivoNome) => {
      const params = {
        Bucket: bucketName,
        Key: arquivoNome
      };
    
      // Retorna a promessa para que possamos usar .then() e .catch() ao chamar a função
      return s3.getObject(params).promise()
        .then(data => {
          // Define o caminho de downloads e usa keyName como nome do arquivo
          const downloadsPath = path.join(os.homedir(), 'Downloads');
          const filePath = path.join(downloadsPath, arquivoNome);
          
          // Escreve o arquivo baixado
          fs.writeFileSync(filePath, data.Body);
          console.log('Arquivo baixado com sucesso:', filePath);
          
          // Retorna o caminho do arquivo baixado
          return filePath;
        })
        .catch(err => {
          console.error('Erro ao baixar o arquivo:', err);
          throw err;
        });
    };
    
    // Exemplo de uso:
    downloadFile('bucketmi74', 'harry-potter-the-series_s6p5.jpg')
      .then(filePath => {
        console.log('Download finalizado:', filePath);
      })
      .catch(err => {
        console.error('Falha no download:', err);
      });
    }

module.exports = { 
  databaseCreateImage, 
  databaseGetImage,
  downloadImage, 
};
