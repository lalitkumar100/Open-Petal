export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserData {
  userId: number;
  email: string;
  fullName: string;
  role: string;
  status: string;
  token: string;
  tokenType: string;
  expiresIn: number;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: UserData;
}
