import { createClient } from '@supabase/supabase-js';
import type { Database } from '~/types/supabase';

const supabaseUrl = 'https://ycwomoizgswhicjrhkcj.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export default supabase;
