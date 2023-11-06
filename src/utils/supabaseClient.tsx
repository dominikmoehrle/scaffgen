import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (supabaseUrl === undefined || supabaseAnonKey === undefined) {
  throw new Error("Env variables are incorrectly loaded");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
