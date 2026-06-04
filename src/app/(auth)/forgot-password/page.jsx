import AuthForm from "@/components/common/AuthForm";

export default function ForgotPasswordPage() {
  return (
    <AuthForm
      title="Forgot password"
      subtitle="Request a secure reset link for your EstatePilot account."
      buttonLabel="Send Reset Link"
      fields={[{ id: "email", label: "Email", type: "email", placeholder: "you@company.com" }]}
      footerText="Remembered it?"
      footerHref="/login"
      footerLabel="Login"
    />
  );
}
