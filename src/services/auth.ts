import { api } from "@/utils/api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  email: string;
  roles: string[];
  actorType: string;
  tipoPersona: string;
  message: string;
}

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const res = await fetch("http://localhost:8080/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Credenciales inválidas");
  }

  return res.json();
};