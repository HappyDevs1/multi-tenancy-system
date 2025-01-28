import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api/tenants";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const createTenant = async (userData: FormData) => {
  try {
    const response = await apiClient.post("/create", userData);
    console.log(response.data.tenant._id);
    return response.data;
  } catch (error) {
    console.error("Error creating a new tenant", error);
    throw error;
  }
};

export const getTenants = async () => {
  try {
    const response = await apiClient.get("/")
  } catch (error) {
    console.error("Error fetching tenants")
  }
}