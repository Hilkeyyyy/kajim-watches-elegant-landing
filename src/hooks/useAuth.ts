
import { useState, useEffect } from 'react';
import { User } from '@/types';
import { apiService } from '@/services/api';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const response = await apiService.getCurrentUser();
      if (response.success) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Erro na verificação de auth:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const response = await apiService.signIn(email, password);
    if (response.success) {
      setUser(response.data);
      return { success: true };
    }
    return { success: false, error: response.error };
  };

  const signOut = async () => {
    const response = await apiService.signOut();
    if (response.success) {
      setUser(null);
      return { success: true };
    }
    return { success: false, error: response.error };
  };

  const isAdmin = user?.role === 'admin';

  return {
    user,
    loading,
    signIn,
    signOut,
    isAdmin,
    isAuthenticated: !!user
  };
};
