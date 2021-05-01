import AuthResponse from "../models/auth/AuthResponse";
import LoginRequest from "../models/auth/LoginRequest";
import apiService from "./ApiService";

class AuthService {
  async login(loginRequest: LoginRequest): Promise<AuthResponse> {
    const authResponse = (
      await apiService.post<AuthResponse>("/api/auth/login", loginRequest)
    ).data;
    apiService.defaults.headers.Authorization = `Bearer ${authResponse.token}`;
    return authResponse;
  }

  async logout(): Promise<void> {
    await apiService.post("/api/auth/logout");
    apiService.defaults.headers.Authorization = null;
  }

  async refresh(): Promise<AuthResponse> {
    const authResponse = (await apiService.post<AuthResponse>("/api/auth/refresh"))
      .data;
    apiService.defaults.headers.Authorization = `Bearer ${authResponse.token}`;
    return authResponse;
  }
}

export default new AuthService();
