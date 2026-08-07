import { createClient } from '@supabase/supabase-js';

// Carrega as variáveis do Vite. Se não definidas, o cliente será nulo e usará fallback de desenvolvimento.
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;
