import { Router } from "express";
import { adivinar, reiniciar } from "../controllers/guess.controller.js";

const router = Router();

router.post("/guess", adivinar);
router.post("/reset", reiniciar);

export default router;