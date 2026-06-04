import AuthForm from "@/components/common/AuthForm";

export default function ResetPasswordPage() {
  return (
    <AuthForm
      title="Reset password"
      subtitle="Choose a new password for your workspace."
      buttonLabel="Reset Password"
      fields={[
        { id: "password", label: "New Password", type: "password", placeholder: "New password" },
        { id: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "Confirm password" },
      ]}
      footerText="Back to"
      footerHref="/login"
      footerLabel="Login"
    />
  );
}
