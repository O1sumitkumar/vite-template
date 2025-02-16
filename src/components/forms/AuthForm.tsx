import { Form } from "@heroui/react";
import React, { FC } from "react";

interface AuthFormProps {
  children: React.ReactNode;
  errors: any;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}
const AuthForm: FC<AuthFormProps> = ({ children, errors, onSubmit }) => {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg justify-center">
        <Form
          className="w-full justify-center items-center space-y-4"
          validationBehavior="native"
          validationErrors={errors}
          onSubmit={onSubmit}
        >
          <div className="flex flex-col gap-4 max-w-md">{children}</div>
        </Form>
      </div>
    </section>
  );
};

export default AuthForm;
