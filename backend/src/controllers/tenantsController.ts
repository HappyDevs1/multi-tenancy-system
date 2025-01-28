import { Request, Response } from "express";
import redisClient from "../config/redis";
import Tenant from "../models/tenantsModel";

export const createTenant = async (req: Request, res: Response): Promise<any> => {
  try {
      const { name, email } = req.body;

      // Validate input
      if (!name || !email) {
          return res.status(400).json({
              message: "Name and email are required",
          });
      }

      // Check if a user with the same email already exists
      const existingUser = await Tenant.findOne({ email });
      if (existingUser) {
          return res.status(409).json({
              message: "User with this email already exists",
          });
      }

      // Create the new user in MongoDB
      const newUser = new Tenant({ name, email });
      await newUser.save();

      // Cache the new user in Redis
      await redisClient.set(`user:${newUser._id}`, JSON.stringify(newUser), { EX: 3600 }); // Cache for 1 hour

      res.status(201).json({
          message: "User created successfully",
          user: newUser,
      });
  } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({
          message: "Error creating user",
          error: error instanceof Error ? error.message : error,
      });
  }
};


export const findTenants = async (req: Request, res: Response): Promise<any> => {
  try {
      // Check if tenants are cached in Redis
      const cachedTenants = await redisClient.get("tenants");
      if (cachedTenants) {
          return res.status(200).json({
              message: "Tenants fetched successfully (from cache)",
              tenants: JSON.parse(cachedTenants),
          });
      }

      // Fetch tenants from MongoDB
      const tenants = await Tenant.find({});
      if (!tenants.length) {
          return res.status(404).json({
              message: "No tenants found",
          });
      }

      // Cache tenants in Redis for future requests
      await redisClient.set("tenants", JSON.stringify(tenants), { EX: 3600 }); // Cache for 1 hour

      res.status(200).json({
          message: "Tenants fetched successfully",
          tenants,
      });
  } catch (error) {
      console.error("Error fetching tenants:", error);
      res.status(500).json({
          message: "Error fetching tenants",
          error: error instanceof Error ? error.message : error,
      });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;

  try {
      // Check if user is cached in Redis
      const cachedUser = await redisClient.get(`user:${id}`);
      if (cachedUser) {
          return res.status(200).json({
              message: "User fetched successfully (from cache)",
              user: JSON.parse(cachedUser),
          });
      }

      // Fetch user from MongoDB
      const user = await Tenant.findById(id);
      if (!user) {
          return res.status(404).json({
              message: "User not found",
          });
      }

      // Cache user in Redis
      await redisClient.set(`user:${id}`, JSON.stringify(user), { EX: 3600 }); // Cache for 1 hour

      res.status(200).json({
          message: "User fetched successfully",
          user,
      });
  } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({
          message: "Error fetching user",
          error: error instanceof Error ? error.message : error,
      });
  }
};

export const updateTenant = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  const updateData = req.body;

  try {
      // Update tenant in MongoDB
      const updatedTenant = await Tenant.findByIdAndUpdate(id, updateData, {
          new: true, // Return the updated document
          runValidators: true, // Validate before updating
      });

      if (!updatedTenant) {
          return res.status(404).json({
              message: "Tenant not found",
          });
      }

      // Update tenant in Redis cache
      await redisClient.set(`user:${id}`, JSON.stringify(updatedTenant), { EX: 3600 }); // Cache for 1 hour

      res.status(200).json({
          message: "Tenant updated successfully",
          tenant: updatedTenant,
      });
  } catch (error) {
      console.error("Error updating tenant:", error);
      res.status(500).json({
          message: "Error updating tenant",
          error: error instanceof Error ? error.message : error,
      });
  }
};

export const deleteTenant = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;

  try {
      // Delete tenant from MongoDB
      const deletedTenant = await Tenant.findByIdAndDelete(id);

      if (!deletedTenant) {
          return res.status(404).json({
              message: "Tenant not found",
          });
      }

      // Remove tenant from Redis cache
      await redisClient.del(`user:${id}`);

      res.status(200).json({
          message: "Tenant deleted successfully",
          tenant: deletedTenant,
      });
  } catch (error) {
      console.error("Error deleting tenant:", error);
      res.status(500).json({
          message: "Error deleting tenant",
          error: error instanceof Error ? error.message : error,
      });
  }
};

