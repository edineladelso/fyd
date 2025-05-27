const express = require("express");
const {
  downloadSingleVideo,
  downloadSingleAudio,
  downloadPlaylistVideo,
  downloadPlaylistAudio,
  listFormats,
  downloadByFormat
} = require("../controllers/downloadController");

const router = express.Router();

// 1. Sacar vídeo MP4
router.post("/video", downloadSingleVideo);
// 2. Sacar áudio MP3
router.post("/audio", downloadSingleAudio);
// 3. Sacar playlist em vídeo MP4
router.post("/playlist/video", downloadPlaylistVideo);
// 4. Sacar playlist em áudio MP3
router.post("/playlist/audio", downloadPlaylistAudio);
// 5a. Listar formatos disponíveis
router.post("/formats", listFormats);
// 5b. Baixar por código de formato
router.post("/formats/download", downloadByFormat);

module.exports = router;