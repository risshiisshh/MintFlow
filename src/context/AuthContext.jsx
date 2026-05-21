import { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jwtToken, setJwtToken] = useState(null);
  const [currentChain, setCurrentChain] = useState('base');
  const [walletInfo, setWalletInfo] = useState(null);
  const [walletLoading, setWalletLoading] = useState(false);

  const fetchWallet = async (token, chain) => {
    setWalletLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const res = await fetch(`${apiUrl}/api/wallet?chain=${chain}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        throw new Error('Failed to fetch wallet info');
      }
      const data = await res.json();
      setWalletInfo(data);
    } catch (err) {
      console.error('Error fetching wallet info', err);
    } finally {
      setWalletLoading(false);
    }
  };

  useEffect(() => {
    if (user && jwtToken) {
      fetchWallet(jwtToken, currentChain);
    } else {
      setWalletInfo(null);
    }
  }, [user, jwtToken, currentChain]);

  // Sign in with a randomly generated Email and Password
  const loginWithRandomEmail = async () => {
    const randomString = Math.random().toString(36).substring(2, 10);
    const email = `tester_${randomString}@mintflow.app`;
    const password = 'MintFlowPassword123!';
    
    try {
      // Create a new user with this random email
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      console.error('Error creating random user', error);
      alert(`Login failed: ${error.message}`);
      throw error;
    }
  };

  // Sign out
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out', error);
      throw error;
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const token = await currentUser.getIdToken();
          setJwtToken(token);
          setUser(currentUser);
        } catch (err) {
          console.error('Error getting user token', err);
          setUser(currentUser);
        }
      } else {
        setUser(null);
        setJwtToken(null);
        setWalletInfo(null);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    jwtToken,
    currentChain,
    walletInfo,
    walletLoading,
    setCurrentChain,
    refetchWallet: () => {
      if (jwtToken) fetchWallet(jwtToken, currentChain);
    },
    loginWithRandomEmail,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
