import axiosInstance from "./axiosInstance";

export const fetchVisionMission = async () => {
  try {
    const response = await axiosInstance.get("/vision-mission");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching vision and mission:", error);
    throw error;
  }
};

export const updateVisionMission = async (formData) => {
  try {
    const response = await axiosInstance.put("/vision-mission", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating vision and mission:", error);
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    const response = await axiosInstance.get("/auth/profile");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const fetchData = async (tableName) => {
  try {
    const response = await axiosInstance.get(`${tableName}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching data from ${tableName}:`, error.response || error.message);
    throw error;
  }
};

export const updateData = async (tableName, id, formData) => {
  try {
    const response = await axiosInstance.put(`${tableName}/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.data;
  } catch (error) {
    console.error(`Error updating data in ${tableName}:`, error.response || error.message);
    throw error;
  }
};

export const createData = async (tableName, formData) => {
  try {
    const response = await axiosInstance.post(`${tableName}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.data;
  } catch (error) {
    console.error(`Error creating data in ${tableName}:`, error.response || error.message);
    throw error;
  }
};

export const deleteArticle = async (id, email, password) => {
  try {
    // console.log("ID yang diterima:", id, "dengan tipe:", typeof id);

    if (typeof id !== "string" && typeof id !== "number") {
      throw new Error("Invalid article ID");
    }

    const response = await axiosInstance.delete(`/article/${id}`, {
      data: { email, password },
    });

    // console.log("Respons dari server:", response.data);
    return response.data.data;
  } catch (error) {
    // console.error("Gagal menghapus artikel:", error.response?.data || error.message);
    throw new Error("Gagal menghapus artikel: " + error.message);
  }
};
