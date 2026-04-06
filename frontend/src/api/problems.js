import axiosInstance from "../lib/axios.js";

export const problemApi = {
  getAllProblems: async () => {
    const response = await axiosInstance.get("/problems");
    return response.data;
  },

  getProblemById: async (id) => {
    const response = await axiosInstance.get(`/problems/${id}`);
    return response.data;
  },
};