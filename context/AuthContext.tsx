import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { Donor, UserContextType } from '../types';

const AuthContext = createContext<UserContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  setUser: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Donor | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch additional user details from Realtime Database
          const snapshot = await get(ref(db, `users/${firebaseUser.uid}`));
          if (snapshot.exists()) {
            const userData = snapshot.val();
            const fullUser = { ...userData, uid: firebaseUser.uid };
            setUser(fullUser);
            // Determine Admin status based on database role
            setIsAdmin(fullUser.role === 'admin');
          } else {
            // User authenticated but no DB record (rare edge case)
            setUser(null);
            setIsAdmin(false);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null);
          setIsAdmin(false);
        }
      } else {
        // Not authenticated
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setIsAdmin(false);
  };

  const handleSetUser = (u: Donor | null) => {
    setUser(u);
    if(!u) logout();
  }

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, setUser: handleSetUser }}>
      <AuthContextWithLogout user={user} loading={loading} isAdmin={isAdmin} logout={logout} setUser={handleSetUser}>
        {children}
      </AuthContextWithLogout>
    </AuthContext.Provider>
  );
};

// Internal wrapper to pass logout function properly
interface AuthContextValue extends UserContextType {
    logout: () => Promise<void>;
}
const InternalAuthContext = createContext<AuthContextValue | null>(null);

const AuthContextWithLogout: React.FC<AuthContextValue & {children: React.ReactNode}> = ({children, ...props}) => {
    return <InternalAuthContext.Provider value={props}>{children}</InternalAuthContext.Provider>
}

// Hook override
export const useAuth = () => {
    const context = useContext(InternalAuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};