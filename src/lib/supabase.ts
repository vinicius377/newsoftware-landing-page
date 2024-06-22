import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.SUPABASE_URL || ''
console.log("🚀 ~ supabaseUrl:", supabaseUrl)
const supabaseKey = import.meta.env.SUPABASE_KEY || ''
console.log("🚀 ~ supabaseKey:", supabaseKey)

export const supabase = createClient(supabaseUrl, supabaseKey)
