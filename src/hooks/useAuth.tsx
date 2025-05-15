
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
    let unsubscribe: (() => void) | undefined;
    if (auth) { // Firebase SDK's auth object exists
      console.log("AuthProvider: Attempting to use Firebase Auth initialization.");
      unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        console.log("AuthProvider: Firebase onAuthStateChanged currentUser:", currentUser);
        // Only set Firebase user if not overridden by a simulated login action
        // This prevents Firebase null user from clearing a dummyUser set by explicit login button
        if (!user || user.uid !== dummyUser.uid) {
            setUser(currentUser);
        }
        setLoading(false);
        setIsUsingFirebaseAuth(true);
      }, (error) => {
         console.error("AuthProvider: Firebase onAuthStateChanged error:", error);
         setUser(null); // Ensure user is null on auth error
         setLoading(false);
         setIsUsingFirebaseAuth(false); // Fallback to fully simulated mode if onAuthStateChanged itself errors
      });
    } else { // Firebase SDK's auth object does NOT exist (e.g. firebase.ts failed to init auth)
      console.warn("AuthProvider: Firebase Auth object not available, using fully simulated mode.");
      setTimeout(() => {
        setLoading(false);
        setIsUsingFirebaseAuth(false);
      }, 500);
    }

    return () => {
       if (unsubscribe) {
        console.log("AuthProvider: Unsubscribing from onAuthStateChanged.");
        unsubscribe();
       }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]); // Depend on auth object from firebase.ts

   // Simulated login function for the "Entrar (Simulado)" button
   const login = useCallback(() => {
    console.log("Login function called: Simulating login with dummy user.");
    setUser(dummyUser);
    setLoading(false); // Ensure loading is false so UI updates immediately
  }, []);

  // Logout function
   const logout = useCallback(() => {
    // If real Firebase auth was active and resulted in a Firebase user, sign out from Firebase.
    // Otherwise, just clear the simulated user.
    if (isUsingFirebaseAuth && auth && auth.currentUser) {
       console.log("Logout function called: Logging out from Firebase...");
       auth.signOut().then(() => {
         setUser(null);
         console.log("AuthProvider: Firebase user signed out.");
       }).catch((error) => {
         console.error("AuthProvider: Firebase logout error:", error);
         setUser(null); // Fallback to clearing local state
       });
     } else {
       console.log("Logout function called: Simulating logout (clearing local user state).");
       setUser(null);
     }
   }, [isUsingFirebaseAuth, auth]);


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

