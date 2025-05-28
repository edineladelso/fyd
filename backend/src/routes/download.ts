import { Router } from "express";
import {
  downloadSingleVideo,
  downloadSingleAudio,
  downloadPlaylistVideo,
  downloadPlaylistAudio,
  listFormats,
  downloadByFormat
} from "../controllers/downloadController";

const router = Router();

router.post("/video", downloadSingleVideo);
router.post("/audio", downloadSingleAudio);
router.post("/playlist/video", downloadPlaylistVideo);
router.post("/playlist/audio", downloadPlaylistAudio);
router.post("/formats", listFormats);
router.post("/formats/download", downloadByFormat);

export default router;
