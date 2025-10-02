import { createContext, useContext, useEffect, useState } from "react";
import { createClient, type User, type Session, type SupabaseClient } from "@supabase/supabase-js";
import type { Profile } from "@shared/schema";

let supabaseInstance: SupabaseClient | null = null;
let configPromise: Promise<any> | null = null;

async function getSupabaseConfig() {
  if (!configPromise) {
    configPromise = fetch('/api/config/supabase').then(r => r.json());
  }
  return configPromise;
}

export let supabase: SupabaseClient;

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, phone?: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    async function initAuth() {
      try {
        const config = await getSupabaseConfig();
        supabaseInstance = createClient(config.url, config.anonKey);
        
        const { data: { session } } = await supabaseInstance.auth.getSession();
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          if (session?.user) {
            await loadProfile(session.user.id);
          } else {
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    }
    
    initAuth();
    
    return () => {
      mounted = false;
    };
  }, []);
  
  useEffect(() => {
    if (!supabaseInstance) return;
    
    supabaseInstance.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabaseInstance.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabaseInstance]);

  const loadProfile = async (userId: string) => {
    if (!supabaseInstance) return;
    
    try {
      const { data, error } = await supabaseInstance
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error loading profile:", error);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!supabaseInstance) throw new Error('Supabase not initialized');
    
    const { error } = await supabaseInstance.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string, fullName: string, phone?: string) => {
    if (!supabaseInstance) throw new Error('Supabase not initialized');
    
    const { data, error } = await supabaseInstance.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      const { error: profileError } = await supabaseInstance.from("profiles").insert({
        id: data.user.id,
        email,
        full_name: fullName,
        phone: phone || null,
        role: "client",
      });

      if (profileError) {
        console.error("Error creating profile:", profileError);
      }
    }
  };

  const signOut = async () => {
    if (!supabaseInstance) throw new Error('Supabase not initialized');
    
    const { error } = await supabaseInstance.auth.signOut();
    if (error) throw error;
  };

  const isAdmin = profile?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
