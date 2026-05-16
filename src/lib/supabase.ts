import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface UnavailableDate {
  id: string;
  start_date: string;
  end_date: string;
}

export async function getUnavailableDates(): Promise<UnavailableDate[]> {
  const { data, error } = await supabase
    .from('camper_unavailable_dates')
    .select('*');
  
  if (error) {
    console.error('Error fetching unavailable dates:', error);
    return [];
  }
  
  return data || [];
}

export async function addUnavailableDate(startDate: string, endDate: string): Promise<boolean> {
  const { error } = await supabase
    .from('camper_unavailable_dates')
    .insert([{ start_date: startDate, end_date: endDate }]);
  
  if (error) {
    console.error('Error adding unavailable date:', error);
    return false;
  }
  
  return true;
}

export async function deleteUnavailableDate(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('camper_unavailable_dates')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting unavailable date:', error);
    return false;
  }
  
  return true;
}
