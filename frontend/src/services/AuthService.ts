import axios from "./AxiosService";

import AuthResponse from "../models/AuthResponse";
import LoginRequest from "../models/LoginRequest";

class AuthService {
  async login(loginRequest: LoginRequest): Promise<AuthResponse> {
    const authResponse = (
      await axios.post<AuthResponse>("/api/auth/login", loginRequest)
    ).data;
    axios.defaults.headers.Authorization = `Bearer ${authResponse.token}`;
    return authResponse;
  }

  async refresh(): Promise<AuthResponse> {
    const authResponse = (await axios.post<AuthResponse>("/api/auth/refresh"))
      .data;
    axios.defaults.headers.Authorization = `Bearer ${authResponse.token}`;
    return authResponse;
  }
}

export default new AuthService();
