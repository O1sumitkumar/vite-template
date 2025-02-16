import { Button, Card } from "@heroui/react";
import { useFormik } from "formik";

import AuthForm from "@/components/forms/AuthForm";
import DefaultLayout from "@/layouts/default";
import TextField from "@/components/textFields/TextField";
import CheckBoxUI from "@/components/checkBox/CheckBox";
import {
  registerInitialValues,
  registerValidation,
} from "@/validations/auth.validation";
import DropDown from "@/components/dropDowns/DropDown";

export default function RegisterPage() {
  const formik = useFormik({
    initialValues: registerInitialValues,
    validationSchema: registerValidation,
    onSubmit: async (values, { resetForm }) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 8000)); // Simulate API Call
        resetForm();
      } catch (error) {
        console.error("Submission error:", error);
      }
    },
  });

  return (
    <DefaultLayout isCenter>
      <AuthForm errors={formik.errors} onSubmit={formik.handleSubmit}>
        <Card className="w-full max-w-md p-4 gap-4">
          <h1 className="text-2xl font-bold mb-4 ">Register</h1>
          <TextField
            isRequired
            errorMessage={formik.errors.name}
            isInvalid={formik.touched.name && Boolean(formik.errors.name)}
            label="Name"
            placeholder="Enter your name"
            {...formik.getFieldProps("name")}
          />

          <TextField
            isRequired
            label="Email"
            placeholder="Enter your email"
            type="email"
            {...formik.getFieldProps("email")}
            errorMessage={formik.errors.email}
            isInvalid={formik.touched.email && Boolean(formik.errors.email)}
          />

          <TextField
            isRequired
            label="Password"
            placeholder="Enter your password"
            type="password"
            {...formik.getFieldProps("password")}
            errorMessage={formik.errors.password}
            isInvalid={
              formik.touched.password && Boolean(formik.errors.password)
            }
          />

          <DropDown
            isRequired
            errorMessage={formik.errors.country}
            isInvalid={formik.touched.country && Boolean(formik.errors.country)}
            label="Country"
            name={"country"}
            options={[
              { value: "ar", label: "Argentina" },
              { value: "br", label: "Brazil" },
            ]}
            placeholder="Select country"
            selectedKeys={formik.values.country ? [formik.values.country] : []}
            onBlur={() => formik.setFieldTouched("country", true)}
            onSelectionChange={(keys) =>
              formik.setFieldValue("country", Array.from(keys)[0])
            }
          />

          <CheckBoxUI
            error={(formik.touched.terms && formik.errors.terms) || ""}
            isInvalid={formik.touched.terms && Boolean(formik.errors.terms)}
            isSelected={formik.values.terms}
            text="I agree to the terms and conditions"
            onBlur={() => formik.setFieldTouched("terms", true)}
            onChange={(e) => formik.setFieldValue("terms", e.target.checked)}
          />

          <div className="flex gap-4 mt-4">
            <Button
              className="w-full"
              color="primary"
              isLoading={formik.isSubmitting}
              type="submit"
            >
              {formik.isSubmitting ? "Submitting..." : "Submit"}
            </Button>
            <Button
              type="reset"
              variant="bordered"
              onPress={formik.handleReset}
            >
              Reset
            </Button>
          </div>
        </Card>
      </AuthForm>
    </DefaultLayout>
  );
}
