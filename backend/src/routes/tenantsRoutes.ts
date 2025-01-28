import { Router } from "express";
import { createTenant, findTenants } from "../controllers/tenantsController";

const router = Router();

router.post("/create", createTenant);
router.get("/", findTenants);

export default router;
