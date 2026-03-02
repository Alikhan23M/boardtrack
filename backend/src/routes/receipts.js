import express from "express";
import { getDealReceipt } from "../controllers/receiptsController.js";

const router = express.Router();

router.get("/deals/:dealId", getDealReceipt);

export default router;
