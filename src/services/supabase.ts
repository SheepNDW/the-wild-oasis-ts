import { createClient } from '@supabase/supabase-js';
import type { Database } from '~/types/supabase';

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
export const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export default supabase;
