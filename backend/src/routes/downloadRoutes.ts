import { Router } from "express";
import { downloadSingleVideo } from "../controllers/downloadController";

const router = Router();

router.post("/video", downloadSingleVideo);

export default router;
