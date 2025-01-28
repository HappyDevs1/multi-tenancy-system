import Tenant from "../models/tenantsModel";

export const createTenantService = async (data: any) => {
  return await Tenant.create(data);
};

export const findTenantService = async () => {
  return await Tenant.find();
};
