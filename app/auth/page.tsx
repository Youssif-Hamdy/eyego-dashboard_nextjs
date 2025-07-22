"use client";

import React, { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { AiFillGithub, AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { motion } from "framer-motion";
import { auth } from "../firebase/config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedEmail = localStorage.getItem('authEmail');
    const savedName = localStorage.getItem('authName');
    if (savedEmail) setEmail(savedEmail);
    if (savedName) setName(savedName);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        localStorage.setItem('authEmail', email);
        localStorage.setItem('authName', name);
        toast.success("Registration successful! Redirecting...");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        localStorage.setItem('authEmail', email);
        toast.success("Welcome back! Redirecting...");
      }

      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (err: any) {
      const msg = isSignUp
        ? "Registration failed. Please try again."
        : "Invalid credentials. Please check your email and password.";

      toast.error(msg);
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-gray-50 p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-indigo-100 opacity-20 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-indigo-200 opacity-20 blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-indigo-800 mb-4">
            Welcome to PharmaTrack
          </h1>
          <p className="text-indigo-600 text-lg max-w-2xl mx-auto">
            {isSignUp
              ? "Create your account to manage your pharmacy network"
              : "Sign in to access your pharmacy dashboard"}
          </p>
        </motion.div>

        <motion.div
          className="relative flex flex-col md:flex-row w-full max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden"
          style={{ height: '600px' }} 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div 
            className={`w-full md:w-1/2 bg-gradient-to-br from-indigo-600 to-indigo-500 text-white p-8 flex flex-col items-center justify-center transition-transform duration-500 ease-in-out ${
              isSignUp ? "md:translate-x-full" : ""
            }`}
            style={{ height: '600px' }} 
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <h2 className="text-3xl font-bold mb-4">
                {isSignUp ? "Already Registered?" : "New Here?"}
              </h2>
              <p className="mb-8 px-4">
                {isSignUp
                  ? "Sign in with your existing account to access your dashboard"
                  : "Create an account to start managing your pharmacies"}
              </p>
              <motion.button
                onClick={() => setIsSignUp(!isSignUp)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white text-indigo-600 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </motion.button>
            </motion.div>
          </div>

          <div 
            className={`w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center transition-transform duration-500 ease-in-out ${
              isSignUp ? "md:-translate-x-full" : ""
            }`}
            style={{ height: '600px' }} 
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-3xl font-bold text-indigo-800">
                {isSignUp ? "Create Account" : "Welcome Back"}
              </h2>

              {isSignUp && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-sm font-medium text-indigo-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: isSignUp ? 0.1 : 0 }}
              >
                <label className="block text-sm font-medium text-indigo-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-3 border ${
                    error ? "border-red-400" : "border-indigo-200"
                  } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all`}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: isSignUp ? 0.2 : 0.1 }}
                className="relative"
              >
                <label className="block text-sm font-medium text-indigo-700 mb-1">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-3 border ${
                    error ? "border-red-400" : "border-indigo-200"
                  } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 bottom-3 text-indigo-400 hover:text-indigo-600 transition-colors"
                >
                  {showPassword ? (
                    <AiFillEyeInvisible size={20} />
                  ) : (
                    <AiFillEye size={20} />
                  )}
                </button>
              </motion.div>

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-sm"
                >
                  {error}
                </motion.p>
              )}

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
                className={`w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-all ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : isSignUp ? (
                  "Create Account"
                ) : (
                  "Sign In"
                )}
              </motion.button>

              <div className="flex items-center my-6">
                <div className="flex-1 border-t border-indigo-200"></div>
                <span className="px-4 text-indigo-500 text-sm">OR</span>
                <div className="flex-1 border-t border-indigo-200"></div>
              </div>

              <div className="flex justify-center gap-4">
                <motion.button
                  type="button"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 bg-white border border-indigo-100 rounded-lg shadow-sm hover:shadow-md transition-all"
                >
                  <FcGoogle size={20} />
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 bg-white border border-indigo-100 rounded-lg shadow-sm hover:shadow-md transition-all"
                >
                  <AiFillGithub size={20} className="text-gray-800" />
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="border border-indigo-100 shadow-lg"
      />
    </div>
  );
};

export default AuthPage;