// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentChain, setCurrentChain] = useState("base");
  const [walletInfo, setWalletInfo] = useState(null);
  const [walletLoading, setWalletLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "" : "http://localhost:8080");

  // --------------------------
  // FETCH WALLET (SAFE)
  // --------------------------
  const fetchWallet = async (firebaseUser, chain = "base") => {
    if (!firebaseUser) return;
    setWalletLoading(true);
    try {
      const token = await firebaseUser.getIdToken(true);
      const res = await fetch(`${apiUrl}/api/wallet?chain=${chain}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(`Wallet API failed: ${res.status}`);
      setWalletInfo(data);
    } catch (err) {
      console.error("Wallet fetch error:", err);
      setWalletInfo(null);
    } finally {
      setWalletLoading(false);
    }
  };

  // --------------------------
  // AUTH LISTENER (FIXED)
  // --------------------------
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setWalletInfo(null);
        setLoading(false);
        return;
      }
      setUser(firebaseUser);
      await fetchWallet(firebaseUser, currentChain);
      setLoading(false);
    });
    return () => unsub();
  }, [currentChain]);

  // --------------------------
  // EMAIL/PASSWORD AUTH
  // --------------------------
  const signup = async (email, password) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  };

  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  };

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  };

  // --------------------------
  // GUEST (random email)
  // --------------------------
  const guestLogin = async () => {
    const email = `guest_${Math.random().toString(36).substring(2, 10)}@mintflow.app`;
    const password = "MintFlowGuest123!";
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  };

  // --------------------------
  // LOGOUT
  // --------------------------
  const logout = () => signOut(auth);

  // --------------------------
  // MANUAL WALLET REFRESH
  // --------------------------
  const refetchWallet = () => {
    if (user) fetchWallet(user, currentChain);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        currentChain,
        walletInfo,
        walletLoading,
        setCurrentChain,
        refetchWallet,
        signup,
        login,
        loginWithGoogle,
        guestLogin,
        logout
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}