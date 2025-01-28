import { Request, Response, NextFunction } from "express";
import prisma from "../util/prismaClient";

export const tenantMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract tenant ID from the request (can be from headers, JWT, or subdomain)
    const tenantId = req.headers["x-tenant-id"] as string;

    if (!tenantId) {
      return res.status(400).json({ message: "Tenant ID is required in the headers" });
    }

    // Validate the tenant in the database using Prisma
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // Attach tenant details to the request for downstream usage
    req.body.tenant = tenant;

    next(); // Continue to the next middleware or route handler
  } catch (error) {
    console.error("Error in tenantMiddleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
