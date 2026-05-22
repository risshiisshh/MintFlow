// src/pages/LoginPage.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { login, signup, loginWithGoogle, guestLogin, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [remember, setRemember] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (isSignup) {
        await signup(email, password);
      } else {
        await login(email, password);
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = (e) => {
    e.preventDefault();
    // Do NOT set loading to true here, as React's state batching may delay
    // the popup invocation, causing mobile browsers to block the popup.
    loginWithGoogle()
      .then(() => {
        // Will be redirected by useEffect
      })
      .catch((err) => {
        setError(err.message || "Google login failed");
        setLoading(false);
      });
  };

  const handleGuest = async () => {
    setLoading(true);
    try {
      await guestLogin();
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Guest login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="glass-panel border border-primary/20 rounded-2xl shadow-2xl p-10 w-full max-w-md space-y-6">
        {/* Logo */}
        <img src="/logo.svg" alt="MintFlow" className="mx-auto h-12 mb-2 animate-bounce" />
        <h1 className="text-3xl font-bold text-center text-primary mb-4">
          MintFlow {isSignup ? "Sign Up" : "Sign In"}
        </h1>
        {error && <div className="text-sm text-error text-center mb-2" role="alert">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">mail</span>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2 rounded-md border border-outline bg-surface-variant focus:outline-none focus:border-primary transition"
            />
          </div>
          {/* Password */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">lock</span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-12 py-2 rounded-md border border-outline bg-surface-variant focus:outline-none focus:border-primary transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <span className="material-symbols-outlined">{showPassword ? "visibility_off" : "visibility"}</span>
            </button>
          </div>
          {/* Remember me + Forgot */}
          <div className="flex items-center justify-between text-sm text-on-surface-variant">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
                className="rounded border-outline text-primary focus:ring-primary"
              />
              <span>Remember me</span>
            </label>
            <button type="button" className="hover:underline" onClick={() => {/* placeholder */}}>
              Forgot password?
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded-md hover:brightness-95 transition transform hover:scale-[1.02]"
          >
            {loading ? (isSignup ? "Creating..." : "Signing In...") : (isSignup ? "Create Account" : "Sign In")}
          </button>
        </form>
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-outline-variant" />
          <span className="px-3 text-on-surface-variant text-sm">or</span>
          <div className="flex-grow border-t border-gray-300" />
        </div>
        <div className="space-y-2">
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center bg-white/70 border border-outline-variant rounded-md py-2 hover:bg-white/80 transition"
          >
            Sign In with Google
          </button>
          <button
            onClick={handleGuest}
            disabled={loading}
            className="w-full bg-surface-container-high text-on-surface-high py-2 rounded-md hover:brightness-95 transition"
          >
            Continue as Guest
          </button>
        </div>
        <p className="text-center text-sm text-gray-600 mt-4">
          {isSignup ? "Already have an account?" : "Don’t have an account?"}{" "}
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-primary underline"
          >
            {isSignup ? "Sign In" : "Create Account"}
          </button>
        </p>
      </div>
    </div>
  );
}
