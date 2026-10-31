"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowLeft,
  BookOpen,
  Sparkles,
  Home,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "sonner";
import GoogleButton from "@/components/social-login/GoogleButton";
import FacebookButton from "@/components/social-login/FacebookButton";
import AppleButton from "@/components/social-login/AppleButton";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { login, register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL the user was on before being sent to login (e.g. a book details page)
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  // Only allow relative paths to prevent open-redirect attacks
  const isSafeUrl = (url: string) =>
    url.startsWith("/") && !url.startsWith("//");

  const redirectAfterAuth = () => {
    router.push(isSafeUrl(callbackUrl) ? callbackUrl : "/");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast.success("Welcome back!");
        redirectAfterAuth();
      } else {
        if (formData.password !== formData.confirmPassword) {
          toast.warning("Passwords don't match", {
            description: "Please make sure your passwords match.",
          });
          setIsLoading(false);
          return;
        }

        await register(formData.email, formData.password, formData.name);
        toast.success("Account created!", {
          description: "Welcome to Core Learning Centre.",
        });
        redirectAfterAuth();
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Floating particles for ambient background
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 5,
  }));

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white flex flex-col lg:flex-row">
      {/* Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary/15 blur-[120px]" />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-amber-200/20 blur-[100px]"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-[40%] left-[30%] w-[300px] h-[300px] rounded-full bg-accent/15 blur-[80px]"
          style={{ animationDelay: "4s" }}
        />

        {/* Floating particles (only 8 on phones, all 20 from sm up) */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className={`absolute rounded-full bg-slate-300/40 ${
              p.id >= 8 ? "hidden sm:block" : ""
            }`}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
            }}
            animate={{ y: [0, -30, 0], opacity: [0.2, 0.6, 0.2] }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.15) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Mobile banner: same library image as desktop, fades into the page */}
      <div className="lg:hidden absolute inset-x-0 top-0 h-56 z-0 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&h=600&fit=crop"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-white" />
      </div>

      {/* Left Side - Form */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full lg:w-1/2 flex items-center justify-center px-4 pt-36 pb-8 lg:p-12"
      >
        {/* Mobile: floating card. Desktop: plain wrapper */}
        <div className="w-full max-w-[420px] rounded-3xl border border-white/60 bg-white p-5 shadow-xl shadow-slate-900/10 sm:p-8 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
          {/* Back link (desktop only; the mobile brand badge already links home) */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="hidden lg:block"
          >
            <Link
              href="/"
              className="group inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-all duration-300 mb-10"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-slate-200 group-hover:border-slate-300 group-hover:bg-slate-50 transition-all duration-300 shadow-sm">
                <Home className="w-4 h-4" />
              </div>
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mb-6 lg:mb-10"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-slate-900 tracking-tight leading-[1.1] mb-2 lg:mb-3">
              {isLogin ? (
                <>
                  Welcome <span className="">back</span>
                </>
              ) : (
                <>
                  Start your{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-accent">
                    journey
                  </span>
                </>
              )}
            </h1>
            {/* <p className="text-slate-600 text-sm lg:text-base leading-relaxed">
              {isLogin
                ? "Sign in to access your curated library and continue exploring worlds within pages."
                : "Join thousands of readers. Your next favorite story is waiting to be discovered."}
            </p> */}
          </motion.div>

          {/* Social Login Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-3 mb-6 lg:mb-8"
          >
            <GoogleButton onSuccess={redirectAfterAuth} />
            {/**  <FacebookButton onSuccess={() => router.push("/")} />
            <AppleButton onSuccess={() => router.push("/")} /> */}
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="relative mb-6 lg:mb-8"
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 lg:px-4 text-[10px] lg:text-xs font-medium text-slate-500 tracking-widest uppercase">
                Or continue with email
              </span>
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            onSubmit={handleSubmit}
            className="space-y-4 lg:space-y-5"
          >
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-2 overflow-hidden"
                >
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-slate-700 ml-1"
                  >
                    Full Name
                  </Label>
                  <div className="relative group">
                    <div
                      className={`absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm ${
                        focusedField === "name" ? "opacity-100" : ""
                      }`}
                    />
                    <div className="relative flex items-center">
                      <User
                        className={`absolute left-4 w-[18px] h-[18px] transition-colors duration-300 ${
                          focusedField === "name"
                            ? "text-primary"
                            : "text-slate-400"
                        }`}
                      />
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        onFocus={() => setFocusedField("name")}
                        onBlur={() => setFocusedField(null)}
                        className="pl-11 pr-4 h-12 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-slate-700 ml-1"
              >
                Email Address
              </Label>
              <div className="relative group">
                <div
                  className={`absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm ${
                    focusedField === "email" ? "opacity-100" : ""
                  }`}
                />
                <div className="relative flex items-center">
                  <Mail
                    className={`absolute left-4 w-[18px] h-[18px] transition-colors duration-300 ${
                      focusedField === "email"
                        ? "text-primary"
                        : "text-slate-400"
                    }`}
                  />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    className="pl-11 pr-4 h-12 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-slate-700 ml-1"
              >
                Password
              </Label>
              <div className="relative group">
                <div
                  className={`absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm ${
                    focusedField === "password" ? "opacity-100" : ""
                  }`}
                />
                <div className="relative flex items-center">
                  <Lock
                    className={`absolute left-4 w-[18px] h-[18px] transition-colors duration-300 ${
                      focusedField === "password"
                        ? "text-primary"
                        : "text-slate-400"
                    }`}
                  />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    className="pl-11 pr-12 h-12 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200 p-2"
                  >
                    {showPassword ? (
                      <EyeOff className="w-[18px] h-[18px]" />
                    ) : (
                      <Eye className="w-[18px] h-[18px]" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-2 overflow-hidden"
                >
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium text-slate-700 ml-1"
                  >
                    Confirm Password
                  </Label>
                  <div className="relative group">
                    <div
                      className={`absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm ${
                        focusedField === "confirmPassword" ? "opacity-100" : ""
                      }`}
                    />
                    <div className="relative flex items-center">
                      <Lock
                        className={`absolute left-4 w-[18px] h-[18px] transition-colors duration-300 ${
                          focusedField === "confirmPassword"
                            ? "text-primary"
                            : "text-slate-400"
                        }`}
                      />
                      <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            confirmPassword: e.target.value,
                          })
                        }
                        onFocus={() => setFocusedField("confirmPassword")}
                        onBlur={() => setFocusedField(null)}
                        className="pl-11 pr-4 h-12 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {isLogin && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex justify-end"
              >
                <button
                  type="button"
                  className="text-sm text-slate-500 hover:text-primary transition-colors duration-300 font-medium py-1"
                >
                  Forgot password?
                </button>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Button
                type="submit"
                disabled={isLoading}
                className="relative w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all duration-500 border border-primary/20 shadow-lg shadow-primary/15 hover:shadow-xl hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <span className="relative flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Please wait...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      {isLogin ? "Sign In" : "Create Account"}
                    </>
                  )}
                </span>
              </Button>
            </motion.div>
          </motion.form>

          {/* Toggle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-6 lg:mt-8 text-center"
          >
            <p className="text-slate-500 text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:text-primary-hover font-semibold transition-colors duration-300 relative group"
              >
                {isLogin ? "Sign up" : "Sign in"}
                <span className="absolute bottom-0 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-300" />
              </button>
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Image (desktop only) */}
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:block lg:w-1/2 relative overflow-hidden"
      >
        <img
          src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&h=1600&fit=crop"
          alt="Library"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />

        {/* Decorative corner elements */}
        <div className="absolute top-8 right-8 w-20 h-20 border-t border-r border-slate-300/60 rounded-tr-2xl" />
        <div className="absolute bottom-8 left-8 w-20 h-20 border-b border-l border-slate-300/60 rounded-bl-2xl" />
      </motion.div>
    </div>
  );
};

export default LoginPage;
