import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [adminLoading, setAdminLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Set up auth state listener FIRST to prevent race conditions
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Admin check
        if (session?.user) {
          setAdminLoading(true);
          checkAdminStatus(session.user.id).finally(() => setAdminLoading(false));
        } else {
          setIsAdmin(false);
          setAdminLoading(false);
        }
        
        setAuthLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setAdminLoading(true);
        checkAdminStatus(session.user.id).finally(() => setAdminLoading(false));
      } else {
        setAdminLoading(false);
      }
      
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (userId: string) => {
    try {
      console.log('Checking admin status for user:', userId);
      // Usa a função RPC is_admin, que já considera super admins
      const { data, error } = await supabase.rpc('is_admin', { user_id: userId });
      if (error) {
        console.error('Error checking admin status via RPC:', error);
        setIsAdmin(false);
        return;
      }
      const isUserAdmin = data === true;
      console.log('Admin status result (RPC):', isUserAdmin);
      setIsAdmin(isUserAdmin);
    } catch (error) {
      console.error('Exception checking admin status (RPC):', error);
      setIsAdmin(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('AuthContext - Starting login for:', email);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      console.log('AuthContext - Login result:', error ? 'Error' : 'Success');
      return { error };
    } catch (exception) {
      console.error('AuthContext - Login exception:', exception);
      return { error: exception };
    }
  };

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const loading = authLoading || adminLoading;

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};