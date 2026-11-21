import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  User as UserIcon,
  Edit3,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { authService } from "@/services/auth/authService";
import { cn } from "@/utils";
import axios from "axios";

interface AuthScreenProps {
  initialMode?: "login" | "register";
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  initialMode = "login",
}) => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [mode, setMode] = useState<"login" | "register">(initialMode);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Password validation checks
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const isPasswordValid = hasMinLength && hasUpper && hasLower && hasNumber && hasSpecial;

  const switchMode = (newMode: "login" | "register") => {
    setMode(newMode);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;

    setErrorMessage(null);
    setSuccessMessage(null);

    if (mode === "register" && !isPasswordValid) {
      setErrorMessage("Please ensure your password meets all complexity requirements below.");
      return;
    }

    setIsLoading(true);

    try {
      if (mode === "register") {
        if (!name.trim()) {
          setErrorMessage("Please enter your name");
          setIsLoading(false);
          return;
        }

        const res = await authService.signup({
          name: name.trim(),
          email: email.trim(),
          password,
        });

        if (res.success) {
          // Reset fields and redirect to Login tab with success confirmation message
          setPassword("");
          setName("");
          setMode("login");
          setSuccessMessage("Account created successfully! Please sign in with your credentials.");
        }
      } else {
        const res = await authService.login({
          email: email.trim(),
          password,
        });

        if (res.success && res.data) {
          setAuth(res.data.user, res.data.token);
          navigate("/dashboard");
        }
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setErrorMessage(err.response.data.message);
      } else if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Authentication failed. Please check your credentials.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#090c1f] p-4 sm:p-8 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Outer Card Container */}
      <div className="w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row min-h-[640px]">
        {/* Left Side: Dark Hero Section */}
        <div className="lg:w-1/2 bg-gradient-to-br from-[#0c0f24] via-[#0e122f] to-[#1a1b47] text-white p-10 sm:p-14 flex flex-col justify-between relative overflow-hidden">
          {/* Background Ambient Glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

          {/* Logo & Headline */}
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#5850ec] flex items-center justify-center shadow-lg shadow-indigo-600/40">
                <Edit3 className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                NotesApp
              </span>
            </div>
            <p className="text-sm text-slate-400 font-medium pl-1">
              Capture. Organize. Be Productive.
            </p>
          </div>

          {/* 3D-Styled Note & Pen Illustration matching screenshot */}
          <div className="relative z-10 py-12 flex items-center justify-center">
            <div className="relative w-64 h-64 flex items-center justify-center">
              <div className="absolute inset-0 bg-[#5850ec]/20 rounded-full blur-2xl transform scale-90" />

              <div className="relative w-48 h-56 bg-gradient-to-b from-white to-slate-50 rounded-2xl shadow-2xl transform -rotate-6 border border-white/20 p-5 flex flex-col justify-center space-y-3.5">
                <div className="w-12 h-2.5 rounded-full bg-indigo-500/80" />
                <div className="w-32 h-2 rounded-full bg-slate-200" />
                <div className="w-36 h-2 rounded-full bg-slate-200" />
                <div className="w-24 h-2 rounded-full bg-slate-200" />
                <div className="w-32 h-2 rounded-full bg-slate-200" />
                <div className="w-20 h-2 rounded-full bg-indigo-400/60" />
              </div>

              <div className="absolute -bottom-1 right-2 transform rotate-45 flex flex-col items-center drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[14px] border-b-slate-800" />
                <div className="w-4 h-20 bg-gradient-to-r from-purple-500 via-[#5850ec] to-indigo-600 rounded-t-sm" />
                <div className="w-4 h-4 bg-slate-200 rounded-b-md" />
              </div>
            </div>
          </div>

          <div className="relative z-10 text-xs text-slate-500">
            &copy; 2026 NotesApp &bull; Built with React & Node.js
          </div>
        </div>

        {/* Right Side: Form Card */}
        <div className="lg:w-1/2 bg-white p-8 sm:p-12 flex flex-col justify-between overflow-y-auto max-h-[85vh]">
          <div>
            {/* Top Navigation Tabs */}
            <div className="flex items-center justify-end gap-8 mb-6 border-b border-slate-100 pb-3">
              <button
                type="button"
                onClick={() => switchMode("login")}
                className={cn(
                  "text-sm font-bold pb-2 transition-all relative",
                  mode === "login"
                    ? "text-[#5850ec]"
                    : "text-slate-400 hover:text-slate-600"
                )}
              >
                <span>Login</span>
                {mode === "login" && (
                  <span className="absolute bottom-[-13px] left-0 right-0 h-0.5 bg-[#5850ec] rounded-full" />
                )}
              </button>

              <button
                type="button"
                onClick={() => switchMode("register")}
                className={cn(
                  "text-sm font-bold pb-2 transition-all relative",
                  mode === "register"
                    ? "text-[#5850ec]"
                    : "text-slate-400 hover:text-slate-600"
                )}
              >
                <span>Register</span>
                {mode === "register" && (
                  <span className="absolute bottom-[-13px] left-0 right-0 h-0.5 bg-[#5850ec] rounded-full" />
                )}
              </button>
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-1.5 mb-5">
              <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                <span>{mode === "login" ? "Welcome Back" : "Create Account"}</span>
                <span className="text-2xl">{mode === "login" ? "👋" : "🚀"}</span>
              </h1>
              <p className="text-sm text-slate-400">
                {mode === "login"
                  ? "Sign in to your account to continue"
                  : "Sign up to start organizing your thoughts"}
              </p>
            </div>

            {/* Success Message Alert */}
            {successMessage && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-700 font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2.5 text-xs text-red-600 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Full Name (in Register mode) */}
              {mode === "register" && (
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5850ec]/20 focus:border-[#5850ec] transition-all"
                  />
                </div>
              )}

              {/* Email Address */}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5850ec]/20 focus:border-[#5850ec] transition-all"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-11 pr-11 py-3 bg-white rounded-2xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5850ec]/20 focus:border-[#5850ec] transition-all"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Dynamic Password Criteria Indicators in Register Mode */}
              {mode === "register" && password.length > 0 && (
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl space-y-1.5 text-xs">
                  <div className="font-semibold text-slate-600 mb-1">Password Requirements:</div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className={cn("flex items-center gap-1.5 font-medium transition-colors", hasMinLength ? "text-emerald-600" : "text-rose-500")}>
                      {hasMinLength ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      <span>At least 8 chars</span>
                    </div>
                    <div className={cn("flex items-center gap-1.5 font-medium transition-colors", hasUpper ? "text-emerald-600" : "text-rose-500")}>
                      {hasUpper ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      <span>Uppercase (A-Z)</span>
                    </div>
                    <div className={cn("flex items-center gap-1.5 font-medium transition-colors", hasLower ? "text-emerald-600" : "text-rose-500")}>
                      {hasLower ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      <span>Lowercase (a-z)</span>
                    </div>
                    <div className={cn("flex items-center gap-1.5 font-medium transition-colors", hasNumber ? "text-emerald-600" : "text-rose-500")}>
                      {hasNumber ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      <span>At least 1 number</span>
                    </div>
                    <div className={cn("flex items-center gap-1.5 font-medium transition-colors col-span-2", hasSpecial ? "text-emerald-600" : "text-rose-500")}>
                      {hasSpecial ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      <span>Special character (!@#$%^&*)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Remember me & Forgot password (Login Mode) */}
              {mode === "login" && (
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-[#5850ec] focus:ring-[#5850ec] border-slate-300"
                    />
                    <span>Remember me</span>
                  </label>

                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      window.alert("Password recovery instructions would be emailed.");
                    }}
                    className="text-[#5850ec] hover:underline font-semibold"
                  >
                    Forgot password?
                  </a>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || (mode === "register" && !isPasswordValid)}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#5850ec] hover:bg-[#4a42db] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                <span>
                  {isLoading
                    ? mode === "login"
                      ? "Signing in..."
                      : "Registering..."
                    : mode === "login"
                    ? "Login"
                    : "Register"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Divider: or */}
              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100" />
                </div>
                <span className="relative bg-white px-3 text-xs text-slate-400">
                  or
                </span>
              </div>

              {/* Continue with Google */}
              <button
                type="button"
                disabled={isLoading}
                onClick={() => {
                  window.alert("Google OAuth will be connected with Google Cloud Console credentials.");
                }}
                className="w-full py-3 px-4 rounded-2xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2.5 hover:bg-slate-50 transition-colors shadow-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>
            </form>
          </div>

          {/* Footer toggle prompt */}
          <div className="pt-4 text-center text-xs text-slate-500">
            {mode === "login" ? (
              <>
                <span>Don&apos;t have an account? </span>
                <button
                  type="button"
                  onClick={() => switchMode("register")}
                  className="text-[#5850ec] font-bold hover:underline"
                >
                  Register
                </button>
              </>
            ) : (
              <>
                <span>Already have an account? </span>
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className="text-[#5850ec] font-bold hover:underline"
                >
                  Login
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
