import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar sesión - Co-workers Cloud Users",
  description: "Accede a tu panel de administración ingresando tus credenciales. Bienvenido de nuevo a Co-workers Cloud Users.",
};

export default function SignIn() {
  return <SignInForm />;
}
