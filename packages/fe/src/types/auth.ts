export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface RegisterWithCodeData extends RegisterData {
  invitationid: string;
}

export interface UpdatePasswordData {
  token: string;
  newPassword: string;
}
