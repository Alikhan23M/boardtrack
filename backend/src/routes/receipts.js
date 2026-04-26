import express from "express";
import { getDealReceipt } from "../controllers/receiptsController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/deals/:dealId",auth, getDealReceipt);

export default router;
