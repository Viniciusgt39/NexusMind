
// src/hooks/useAuth.tsx
"use client";

import { useState, useEffect, useContext, createContext, ReactNode, useCallback } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase'; // Import your initialized auth instance
import { Loader2 } from 'lucide-react';

// Define a more specific user type for simulation if needed, or use Firebase User
interface SimulatedUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextType {
  user: User | SimulatedUser | null; // Allow Firebase User or SimulatedUser
  loading: boolean;
  login: () => void; // Add login function
  logout: () => void; // Add logout function
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

interface AuthProviderProps {
    children: ReactNode;
}

// Simulated user data
const dummyUser: SimulatedUser = {
  uid: "simulated-user-123",
  email: "usuario@exemplo.com",
  displayName: "Usuário Simulado",
  photoURL: "/placeholder-user.png",
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | SimulatedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUsingFirebaseAuth, setIsUsingFirebaseAuth] = useState(false); // Track if Firebase auth is active

  useEffect(() => {
    // Listen for Firebase authentication state changes ONLY if auth is available
    let unsubscribe: (() => void) | undefined;
    if (auth) {
       unsubscribe = onAuthStateChanged(auth, (currentUser) => {
         setUser(currentUser);
         setLoading(false);
         setIsUsingFirebaseAuth(true); // Indicate Firebase auth is being used
       });
     } else {
       // If Firebase auth is not configured, fall back to simulation after a brief delay
       console.warn("Firebase Auth not initialized, using simulated login.");
       setTimeout(() => setLoading(false), 500); // Simulate loading delay
       setIsUsingFirebaseAuth(false);
     }


    // Cleanup subscription on unmount
    return () => {
       if (unsubscribe) unsubscribe();
    };
  }, []);

   // Simulated login function
   const login = useCallback(() => {
    if (!isUsingFirebaseAuth) {
      console.log("Simulating login...");
      setUser(dummyUser);
      setLoading(false); // Ensure loading is false
    } else {
      console.log("Firebase Auth is active. Please use Firebase login methods.");
      // Optionally, redirect to a Firebase login page or trigger Firebase login flow
    }
  }, [isUsingFirebaseAuth]);

  // Simulated logout function
   const logout = useCallback(() => {
    if (!isUsingFirebaseAuth) {
      console.log("Simulating logout...");
      setUser(null);
    } else if (auth) {
       console.log("Logging out with Firebase...");
       auth.signOut().then(() => {
         setUser(null); // Update state after successful Firebase sign-out
       }).catch((error) => {
         console.error("Firebase logout error:", error);
       });
     } else {
        console.error("Cannot logout: Firebase Auth not initialized.");
     }
   }, [isUsingFirebaseAuth]);


  // Display a loading indicator while checking auth state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
