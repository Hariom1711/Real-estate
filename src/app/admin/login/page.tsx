"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Eye, EyeOff, Lock, Mail, AlertTriangle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password. Please try again.");
        setIsLoading(false);
      } else {
        router.refresh();
        router.push("/admin");
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-zinc-950 flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
      {/* Cinematic Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover opacity-20 blur-md pointer-events-none z-0"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4"
      />

      {/* Background Decorative Gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-white/5 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] bg-white/5 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-6 duration-700 relative z-10">
        <Card className="liquid-glass border-white/10 bg-transparent text-white shadow-2xl backdrop-blur-xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold tracking-tight font-sans">
              PUNE REALTY
            </CardTitle>
            <CardDescription className="text-gray-400 text-xs font-light">
              Enter credentials to access the admin management portal
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="flex flex-col gap-4 pt-4">
              
              {/* Error Callout */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-3.5 py-3 rounded-lg flex items-start gap-2 animate-in fade-in duration-200">
                  <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Email Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@punerealty.com"
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-lg focus:border-white/20 h-10 w-full"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <Input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-lg focus:border-white/20 h-10 w-full"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition cursor-pointer select-none"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

            </CardContent>

            <CardFooter className="flex flex-col gap-4 pt-4 pb-6">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white text-black font-semibold text-sm h-10 rounded-lg hover:bg-gray-200 active:scale-98 transition cursor-pointer"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>

              {/* Demo Credentials Helper */}
              <div className="w-full bg-white/5 border border-white/5 p-3 rounded-lg text-center">
                <span className="text-[10px] text-gray-400 block mb-0.5">Demo Admin Account</span>
                <span className="text-xs font-semibold text-gray-200">
                  admin@punerealty.com <span className="text-gray-500">/</span> admin123
                </span>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  );
}
