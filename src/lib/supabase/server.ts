import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { Database } from "@/types";

export default function createServerClient() {
  try {
    const cookieStore = cookies();
    
    // Check if environment variables are set
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase credentials. Please check your .env.local file.");
      throw new Error("Missing Supabase credentials");
    }
    
    return createClient<Database>(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );
  } catch (error) {
    console.error("Failed to create Supabase client:", error);
    throw error;
  }
} 