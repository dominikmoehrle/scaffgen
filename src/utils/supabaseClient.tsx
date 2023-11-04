import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (
  typeof supabaseUrl === "undefined" ||
  typeof supabaseAnonKey === "undefined"
) {
  console.log("supabaseUrl is: " + supabaseUrl);
  console.log("supabaseAnonKey is: " + supabaseAnonKey);
  throw new Error("Env var `foo` is not defined");
}

console.log("supabaseUrl is: " + supabaseUrl);
console.log("supabaseAnonKey is: " + supabaseAnonKey);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;

//Client for Database
