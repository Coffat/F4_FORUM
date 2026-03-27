"use client";

import { useState, useActionState } from "react";
import { Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";
import { loginAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, isPending] = useActionState(loginAction, { error: null });

  return (
    <div className="min-h-screen w-full flex bg-[#F9FAFB] font-sans text-slate-900">
      {/* Left side (Image and Text Area) */}
      <div className="hidden lg:flex w-3/5 relative bg-slate-900 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center object-cover opacity-80 mix-blend-overlay max-h-screen"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80")',
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/90 via-blue-900/80 to-transparent flex items-end justify-center p-12">
          {/* Glassmorphism Card */}
          <div className="w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-2xl shadow-2xl flex flex-col justify-end space-y-6">
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-white text-blue-600 p-2 rounded-lg shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" />
                </svg>
              </div>
              <span className="text-white text-xl font-bold tracking-wide">
                F4 Forum
              </span>
            </div>
            <h1 className="text-white text-5xl font-extrabold leading-tight tracking-tight">
              Fast, Focus, Future, <br />
              Foundation
            </h1>
            <p className="text-blue-100 text-lg max-w-xl font-medium leading-relaxed">
              The premium academic curator for elite learners.
              <br />
              Elevate your potential with our collaborative
              <br />
              research ecosystem.
            </p>
          </div>
        </div>
      </div>

      {/* Right side (Login Form) */}
      <div className="w-full lg:w-2/5 flex flex-col pt-12 px-8 sm:px-16 md:px-24 justify-start bg-[#FAF9F6]">
        {/* Back Link */}
        <div className="w-full max-w-md mx-auto mb-10 pt-4">
          <button className="flex items-center text-blue-600 font-semibold hover:text-blue-700 transition">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to main
          </button>
        </div>

        {/* Login Box */}
        <div className="w-full max-w-md mx-auto bg-white p-10 border border-slate-100 rounded-3xl shadow-xl shadow-slate-200/50">
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
            Welcome back
          </h2>
          <p className="text-slate-500 mt-2 mb-8 pr-4">
            Enter your credentials to access your F4 academic portal.
          </p>

          <form className="space-y-5" action={formAction}>
            {state?.error && (
              <div className="p-3 text-sm font-medium text-red-600 bg-red-100 rounded-xl border border-red-200">
                {state.error}
              </div>
            )}
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="text-xs font-bold text-slate-700 tracking-wider uppercase"
              >
                Email or Username
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="admin"
                disabled={isPending}
                className="h-12 bg-slate-50 border-transparent focus:border-blue-500 focus:bg-white text-base rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-xs font-bold text-slate-700 tracking-wider uppercase"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  disabled={isPending}
                  className="h-12 bg-slate-50 border-transparent focus:border-blue-500 focus:bg-white text-base rounded-xl pr-10 tracking-widest"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" name="remember" className="rounded-md border-slate-300" />
                <Label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-600 cursor-pointer"
                >
                  Remember me
                </Label>
              </div>
              <a
                href="#"
                className="text-sm font-bold text-blue-700 hover:underline"
              >
                Forgot Password?
              </a>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-12 mt-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-base rounded-xl shadow-md transition-all flex justify-center items-center"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-400 font-semibold tracking-wider">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-12 bg-slate-50 border-transparent hover:bg-slate-100 hover:border-slate-200 text-slate-700 font-semibold rounded-xl flex items-center justify-center shadow-none"
            >
              <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  opaciy="1"
                  d="M23.4938 12.2749C23.4938 11.4255 23.4182 10.6015 23.2841 9.80518H12V14.4784H18.4526C18.17 16.0028 17.3093 17.2917 16.0279 18.1408V21.1685H19.897C22.1648 19.0833 23.4938 15.9616 23.4938 12.2749Z"
                  fill="#4285F4"
                />
                <path
                  opaciy="1"
                  d="M12 24C15.2343 24 17.9461 22.9292 19.897 21.1685L16.0279 18.1408C14.9708 18.8488 13.5936 19.2801 12 19.2801C8.91746 19.2801 6.30919 17.199 5.37346 14.4172H1.3916V17.5024C3.34298 21.383 7.33744 24 12 24Z"
                  fill="#34A853"
                />
                <path
                  opaciy="1"
                  d="M5.37346 14.4172C5.13253 13.693 4.99842 12.8584 4.99842 12C4.99842 11.1416 5.13253 10.307 5.37346 9.5828V6.49756H1.3916C0.587391 8.09458 0.124512 9.99283 0.124512 12C0.124512 14.0072 0.587391 15.9054 1.3916 17.5024L5.37346 14.4172Z"
                  fill="#FBBC04"
                />
                <path
                  opaciy="1"
                  d="M12 4.71991C13.7631 4.71991 15.338 5.32653 16.5821 6.51468L20.0039 3.09292C17.9324 1.16644 15.2205 0 12 0C7.33744 0 3.34298 2.61699 1.3916 6.49756L5.37346 9.5828C6.30919 6.80105 8.91746 4.71991 12 4.71991Z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>
            <Button
              variant="outline"
              className="h-12 bg-slate-50 border-transparent hover:bg-slate-100 hover:border-slate-200 text-slate-700 font-semibold rounded-xl flex items-center justify-center shadow-none"
            >
              <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 21 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10 0H0V10H10V0Z" fill="#F25022" />
                <path d="M21 0H11V10H21V0Z" fill="#7FBA00" />
                <path d="M10 11H0V21H10V11Z" fill="#00A4EF" />
                <path d="M21 11H11V21H21V11Z" fill="#FFB900" />
              </svg>
              Microsoft
            </Button>
          </div>
        </div>
        
        {/* Footer Link */}
        <div className="text-center mt-10 mb-8">
          <p className="text-slate-600 font-medium text-sm">
            New to F4 Forum?{" "}
            <a href="#" className="text-blue-700 font-bold hover:underline">
              Create an account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
