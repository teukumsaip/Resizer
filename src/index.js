const express = require("express");
const path = require("path");
const collection = require("./config");
const bcrypt = require('bcrypt');
const { compressImage, compressAudio } = require("./compress");
const { ImageModel, AudioModel } = require("./config");


const app = express();
app.use(express.json());

app.use(express.static("public"));

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("home"); 
});

app.get("/imgcomp", (req, res) => {
    res.render("imgcomp");
});

app.get("/audcomp", (req, res) => {
    res.render("audcomp"); 
});

app.post("/compress-image", upload.single('image'), async (req, res) => {
    try {
        const image = req.file;

        if (!image) {
            return res.status(400).send("No image uploaded.");
        }

        const compressedImage = await compressImage(image);

        const newImage = new ImageModel({
            filename: image.filename,
            originalSize: image.size,
            compressedSize: compressedImage.length, 
            compressionType: 'JPEG',
            compressionQuality: 85,
        });

        await newImage.save();

        res.set('Content-Type', 'image/jpeg');

        res.send(compressedImage);
    } catch (error) {
        console.error("Error compressing image:", error);
        res.status(500).send("Internal server error.");
    }
});


app.post("/compress-audio", upload.single('audio'), async (req, res) => {
    try {
        const audio = req.file;

        if (!audio) {
            return res.status(400).send("No audio uploaded.");
        }

        const compressedAudio = await compressAudio(audio);

        const newAudio = new AudioModel({
            filename: audio.filename,
            originalSize: audio.size,
            compressedSize: compressedAudio.length, 
            compressionType: 'MP3',
            compressionQuality: 64,
        });

        await newAudio.save();

        const outputFileName = 'compressed_audio.mp3';

        res.download(compressedAudio, outputFileName);
    } catch (error) {
        console.error("Error compressing audio:", error);
        res.status(500).send("Internal server error.");
    }
});

const port = 5000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});