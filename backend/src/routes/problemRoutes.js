import express from "express";
import {
  getAllProblems,
  getProblemById,
  createProblem,
  deleteProblem,
} from "../controllers/problemController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/", protectRoute, getAllProblems);
router.get("/:id", protectRoute, getProblemById);
router.post("/", protectRoute, createProblem);       // for seeding/admin : TODO
router.delete("/:id", protectRoute, deleteProblem);  // for admin : TODO

export default router;