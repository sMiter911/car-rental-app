export interface User {
  user: {
    id: number;
    name: string;
    email: string;
    password: string;
    access_token?: string;
    expires_in?: number;
  };
}
