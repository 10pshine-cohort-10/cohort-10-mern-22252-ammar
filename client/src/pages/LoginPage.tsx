import React from "react";
import { AuthScreen } from "@/components/auth/AuthScreen";

export const LoginPage: React.FC = () => {
  return <AuthScreen initialMode="login" />;
};
