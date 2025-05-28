import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { execFile } from 'child_process';
import downloadRoutes from './routes/download';

const app = express();
app.use(express.json());

// Rota compatível com index.html para download de vídeo
app.post('/api/video', (req: Request, res: Response) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL é obrigatória' });

  const OUT = path.join(__dirname, '..', '..', 'downloads');
  if (!fs.existsSync(OUT)) fs.mkdirSync(OUT);

  const filename = `video_${Date.now()}.mp4`;
  const filepath = path.join(OUT, filename);

  const ytdlpPath = path.join(__dirname, '..', 'bin', 'yt-dlp');
  const ffmpegPath = path.join(__dirname, '..', 'bin', 'ffmpeg');

  const args = [
    url,
    '-o', filepath,
    '--ffmpeg-location', ffmpegPath,
    '-f', 'bestvideo[height<=360]+bestaudio/best[height<=360]',
    '--merge-output-format', 'mp4'
  ];

  interface ExecFileCallback {
    (error: NodeJS.ErrnoException | null, stdout: string, stderr: string): void;
  }

  const execFileCallback: ExecFileCallback = (err, stdout, stderr) => {
    if (err) {
      return res.status(500).json({ error: stderr || err.message });
    }
    res.download(filepath, filename, (err: Error | undefined) => {
      fs.unlink(filepath, () => {}); // Limpa o arquivo após envio
      if (err) res.status(500).end();
    });
  };

  execFile(ytdlpPath, args, execFileCallback);
});

// Rotas principais já existentes
app.use('/api', downloadRoutes);

app.listen(3000, '0.0.0.0', () => {
  console.log('Servidor ativo em http://0.0.0.0:3000');
});
