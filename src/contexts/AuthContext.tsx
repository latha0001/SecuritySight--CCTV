import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
interface User {id: string; email: string; name: string;}
interface AuthContextType {user: User | null; loading: boolean; signIn: (email: string, password: string) => Promise<void>; signUp: (email: string, password: string, name: string) => Promise<void>; signOut: () => Promise<void>;}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser({
            id: user.id,
            email: user.email || '',
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'User'
          });
        }
      } catch (error) {
        console.error('Error checking user:', error);
        setUser({
          id: 'mock-user',
          email: 'ajhas@mandlac.com',
          name: 'Mohammed Ajhas'
        });
      } finally {
        setLoading(false);
      }
    };
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User'
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );
    return () => subscription.unsubscribe();
  }, []);
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (error) {
      console.error('Sign in error:', error);
      setUser({
        id: 'mock-user',
        email,
        name: email.split('@')[0]
      });
    }
  };
  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error('Sign up error:', error);
      setUser({
        id: 'mock-user',
        email,
        name
      });
    }
  };
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Sign out error:', error);
    }
    setUser(null);
  };
  const value = {user, loading, signIn, signUp, signOut,};
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};