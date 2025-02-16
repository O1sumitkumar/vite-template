import * as Yup from "yup";

import { LoginProps, RegisterProps } from "@/interface/auth.interface";

// Auth validation
export const registerValidation = Yup.object({
  name: Yup.string()
    .required("Please enter your name")
    .notOneOf(["admin"], "Nice try! Choose a different username"),
  email: Yup.string()
    .required("Please enter your email")
    .email("Please enter a valid email address"),
  password: Yup.string()
    .required("Password is required")
    .min(4, "Password must be 4 characters or more")
    .matches(/[A-Z]/, "Password needs at least 1 uppercase letter")
    .matches(/[^A-Za-z]/, "Password needs at least 1 symbol"),
  country: Yup.string().required("Please select your country"),
  terms: Yup.boolean().oneOf([true], "Please accept the terms"),
});

export const loginValidation = Yup.object({
  email: Yup.string()
    .required("Please enter your email")
    .email("Please enter a valid email address"),
  password: Yup.string().required("Password is required"),
});

// initial values
export const registerInitialValues: RegisterProps = {
  name: "",
  email: "",
  password: "",
  country: "",
  terms: false,
};

export const loginInitialValues: LoginProps = {
  email: "",
  password: "",
};
