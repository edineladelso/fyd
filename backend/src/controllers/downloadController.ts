import path from "path";
import { execFile } from "child_process";
import fs from "fs";
import { Request, Response } from "express";

const ytdlp = path.join(__dirname, "../..", "bin", "yt-dlp");
const ffmpeg = path.join(__dirname, "../..", "bin", "ffmpeg");

const OUT = path.join(__dirname, "..", "..", "downloads");
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT);

function handleExec(args: string[], res: Response, extractRe: RegExp) {
  execFile(ytdlp, args, (err, stdout, stderr) => {
    if (err) return res.status(500).json({ error: stderr });
    const m = stdout.match(extractRe);
    if (!m) return res.status(500).json({ error: "Não foi possível localizar o ficheiro." });
    const file = path.resolve(OUT, m[1]);
    res.download(file);
  });
}

export const downloadSingleVideo = (req: Request, res: Response) => {
  const { url } = req.body;
  const args = [
    url,
    "-o", path.join(OUT, "%(title).100s.%(ext)s"),
    "--ffmpeg-location", ffmpeg,
    "-f", "bestvideo[height<=360]+bestaudio/best[height<=360]"
  ];
  handleExec(args, res, /Destination: (.+\.mp4)/);
};

export const downloadSingleAudio = (req: Request, res: Response) => {
  const { url } = req.body;
  const args = [
    url,
    "-x", "--audio-format", "mp3",
    "-o", path.join(OUT, "%(title).100s.%(ext)s"),
    "--ffmpeg-location", ffmpeg
  ];
  handleExec(args, res, /Destination: (.+\.mp3)/);
};

export const downloadPlaylistVideo = (req: Request, res: Response) => {
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

export const downloadPlaylistAudio = (req: Request, res: Response) => {
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

export const listFormats = (req: Request, res: Response) => {
  const { url } = req.body;
  execFile(ytdlp, ["-F", url], (err, stdout, stderr) => {
    if (err) return res.status(500).json({ error: stderr });
    res.json({ formats: stdout.split("\n") });
  });
};

export const downloadByFormat = (req: Request, res: Response) => {
  const { url, formatCode } = req.body;
  const args = [
    url,
    "-f", formatCode,
    "-o", path.join(OUT, "%(title).100s.%(ext)s"),
    "--ffmpeg-location", ffmpeg
  ];
  handleExec(args, res, /Destination: (.+\.\w+)/);
};
