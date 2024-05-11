const sharp = require('sharp');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const compressImage = async (image) => {
    try {
        const compressedImageBuffer = await sharp(image.path)
            .resize({ width: 500 }) 
            .toFormat('jpeg') 
            .toBuffer();
        return compressedImageBuffer;
    } catch (error) {
        throw new Error(`Error compressing image: ${error.message}`);
    }
};

const compressAudio = async (audio) => {
    try {
        const command = `ffmpeg -i ${audio.path} -b:a 64k ${audio.destination}/compressed_${audio.originalname}`;
        
        await exec(command);

        return `${audio.destination}/compressed_${audio.originalname}`;
    } catch (error) {
        throw new Error(`Error compressing audio: ${error.message}`);
    }
};

module.exports = { compressImage, compressAudio };
