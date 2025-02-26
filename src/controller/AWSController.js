const { create, get, getAWSImage } = require("../service/AWSService");

const createImage = async ( req, res ) => {
    const { usuario_id, filePath } = req.body;
    try {
        await create(usuario_id, filePath );
        res.status(200).json("Imagem adicionada");
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getImage = async ( req, res ) => {
    const { id } = req.params;
    try {    
        res.status(200).json( await get(id) );
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getImageAWS = async ( req, res ) => {
    const { arquivoNome } = req.params;

    try {
        res.status(200).json( await getAWSImage( arquivoNome) );
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = { 
createImage,
getImage,
getImageAWS,
};