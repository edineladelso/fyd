// index.js
const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());

app.post('/api/video', (req, res) => {
  const { url } = req.body;

  if (!url) return res.status(400).json({ error: 'URL é obrigatória' });

  const filename = 'video.mp4';
  const filepath = path.join(__dirname, filename);

  // Remove ficheiro anterior se existir
  if (fs.existsSync(filepath)) fs.unlinkSync(filepath);

  // Executar o yt-dlp com ffmpeg direto para MP4
  const cmd = `yt-dlp -f best --merge-output-format mp4 -o "${filename}" "${url}"`;

  exec(cmd, (err, stdout, stderr) => {
    if (err) {
      return res.status(500).json({ error: stderr });
    }

    res.download(filepath, filename, (err) => {
      if (err) {
        console.error('Erro ao enviar:', err);
        res.status(500).end();
      } else {
        fs.unlinkSync(filepath); // Limpar depois do envio
      }
    });
  });
});

app.listen(3000, '0.0.0.0', () => {
  console.log('Servidor ativo em http://0.0.0.0:3000');
});