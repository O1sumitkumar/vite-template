import { doFetch, REQUEST_METHODS } from "../fetcher";

import { RegisterProps } from "@/interface/auth.interface";

const Register = (data: RegisterProps) =>
  doFetch("/auth/signup", REQUEST_METHODS.POST, data);
const Login = (data: {
  email: RegisterProps["email"];
  password: RegisterProps["password"];
}) => doFetch("/auth/login", REQUEST_METHODS.POST, data);

const GetUser = () => doFetch("/auth/user", "GET");

export { Register, Login, GetUser };
