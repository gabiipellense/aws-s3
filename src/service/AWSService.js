const { databaseCreateImage, databaseGetImage, downloadImage } = require("../repository/AWSRepository");

async function create ( idUser, filePath ) {
    try {
        return await databaseCreateImage( idUser, filePath );
    } catch ( error ) {
        console.error ( "Erro ao criar imagem: ", error.message);
        throw error;
    }
}

async function getById ( referencia ) {
    try {
        return await databaseGetImage( referencia );
    } catch ( error ) {
        console.error ( "Erro ao pegar imagem: ", error.message);
        throw error;
    }
}

async function getAWSImage ( arquivoNome ) {
    try {
        return await downloadImage( arquivoNome );
    } catch ( error ) {
        console.error ( "Erro ao baixar imagem: ", error.message);
        throw error;
    }
}

module.exports = { 
create,
getById, 
getAWSImage,
};