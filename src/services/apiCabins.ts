import { Tables } from '~/types/supabase';
import supabase from './supabase';

export async function getCabins() {
  const { data, error } = await supabase.from('cabins').select('*');

  if (error) {
    console.error(error.message);
    throw new Error(error.message);
  }

  return data;
}

export type NewCabin = Omit<Tables<'cabins'>, 'id'>;

export async function createCabin(newCabin: NewCabin) {
  const { data, error } = await supabase.from('cabins').insert([newCabin]).select();

  if (error) {
    console.error(error.message);
    throw new Error('Cabin could not be created');
  }

  return data;
}

export async function deleteCabin(id: number) {
  const { data, error } = await supabase.from('cabins').delete().eq('id', id);

  if (error) {
    console.error(error.message);
    throw new Error('Cabin could not be deleted');
  }

  return data;
}
