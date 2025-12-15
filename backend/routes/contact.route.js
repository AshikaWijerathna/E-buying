import express from "express";
import { saveContactMessage } from "../controllers/contact.controller.js";

const router = express.Router();

router.post("/", saveContactMessage);

export default router;