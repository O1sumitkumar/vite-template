export type AuthProp = {
  isLoader: boolean;
  token: string;
  role: string;
  userData: any;
};

export const initialState: AuthProp = {
  isLoader: false,
  token: "",
  role: "business",
  userData: {},
};
