import api from "@/lib/api-config";

export const loginUser = async (email, password) => {
  const response = await api.post("/users/login", { email, password });
  return response.data;
};

export const registerUser = async ({ username, email, password, name }) => {
  const response = await api.post("/users/register", {
    username,
    email,
    password,
    name,
  });
  return response.data;
};
