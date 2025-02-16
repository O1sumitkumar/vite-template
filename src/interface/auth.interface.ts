export interface AuthInterface {
  login(email: string, password: string): Promise<any>;
  register(email: string, password: string): Promise<any>;
}

export interface RegisterProps {
  name: string;
  email: string;
  password: string;
  country: string;
  terms: boolean;
  role?: string;
}
export interface LoginProps {
  email: string;
  password: string;
}
