import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const memoryStore = new Map();
const serverStorage = {
  getItem: async (key) => memoryStore.get(key) ?? null,
  setItem: async (key, value) => {
    memoryStore.set(key, value);
  },
  removeItem: async (key) => {
    memoryStore.delete(key);
  },
};

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Expo public Supabase environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: typeof window === "undefined" ? serverStorage : AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
