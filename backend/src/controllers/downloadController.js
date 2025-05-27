const path = require("path");
const { execFile } = require("child_process");
const fs = require("fs");

// Ajuste de caminho: subir 2 níveis para chegar a backend/bin
const ytdlp = path.join(__dirname, "../..", "bin", "yt-dlp");
const ffmpeg = path.join(__dirname, "../..", "bin", "ffmpeg");

// Pasta de saída: backend/downloads
const OUT = path.join(__dirname, "..", "..", "downloads");
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT);

function handleExec(args, res, extractRe) {
  execFile(ytdlp, args, (err, stdout, stderr) => {
    if (err) return res.status(500).json({ error: stderr });
    const m = stdout.match(extractRe);
    if (!m) return res.status(500).json({ error: "Não foi possível localizar o ficheiro." });
    const file = path.resolve(OUT, m[1]);
    res.download(file);
  });
}

// 1. Vídeo único MP4 (360p)
const downloadSingleVideo = (req, res) => {
  const { url } = req.body;
  const args = [
    url,
    "-o", path.join(OUT, "%(title).100s.%(ext)s"),
    "--ffmpeg-location", ffmpeg,
    "-f", "bestvideo[height<=360]+bestaudio/best[height<=360]"
  ];
  handleExec(args, res, /Destination: (.+\.mp4)/);
};

// 2. Áudio único MP3
const downloadSingleAudio = (req, res) => {
  const { url } = req.body;
  const args = [
    url,
    "-x", "--audio-format", "mp3",
    "-o", path.join(OUT, "%(title).100s.%(ext)s"),
    "--ffmpeg-location", ffmpeg
  ];
  handleExec(args, res, /Destination: (.+\.mp3)/);
};

// 3. Playlist em vídeo MP4 (360p)
const downloadPlaylistVideo = (req, res) => {
  const { url } = req.body;
  const args = [
    url,
    "--yes-playlist",
    "-o", path.join(OUT, "%(playlist_title)s/%(title).100s.%(ext)s"),
    "--ffmpeg-location", ffmpeg,
    "-f", "bestvideo[height<=360]+bestaudio/best[height<=360]"
  ];
  handleExec(args, res, /Destination: (.+\.mp4)/);
};

// 4. Playlist em áudio MP3
const downloadPlaylistAudio = (req, res) => {
  const { url } = req.body;
  const args = [
    url,
    "--yes-playlist",
    "-x", "--audio-format", "mp3",
    "-o", path.join(OUT, "%(playlist_title)s/%(title).100s.%(ext)s"),
    "--ffmpeg-location", ffmpeg
  ];
  handleExec(args, res, /Destination: (.+\.mp3)/);
};

// 5a. Listar formatos disponíveis
const listFormats = (req, res) => {
  const { url } = req.body;
  execFile(ytdlp, ["-F", url], (err, stdout, stderr) => {
    if (err) return res.status(500).json({ error: stderr });
    res.json({ formats: stdout.split("\n") });
  });
};

// 5b. Download por código de formato
const downloadByFormat = (req, res) => {
  const { url, formatCode } = req.body;
  const args = [
    url,
    "-f", formatCode,
    "-o", path.join(OUT, "%(title).100s.%(ext)s"),
    "--ffmpeg-location", ffmpeg
  ];
  handleExec(args, res, /Destination: (.+\.\w+)/);
};

module.exports = {
  downloadSingleVideo,
  downloadSingleAudio,
  downloadPlaylistVideo,
  downloadPlaylistAudio,
  listFormats,
  downloadByFormat
};