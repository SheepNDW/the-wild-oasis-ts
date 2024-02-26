import { Tables } from '~/types/supabase';
import supabase, { supabaseUrl } from '~/services/supabase';

export type Cabin = Tables<'cabins'>;

export async function getCabins() {
  const { data, error } = await supabase.from('cabins').select('*');

  if (error) {
    console.error(error.message);
    throw new Error(error.message);
  }

  return data;
}

export type NewCabin = Omit<Tables<'cabins'>, 'id'> & { image: File };

export async function createEditCabin(newCabin: NewCabin, id?: number) {
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);

  const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll('/', '');
  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  // create/edit cabin
  const queryBuilder = supabase.from('cabins');
  let queryFilter: ReturnType<typeof queryBuilder.insert | typeof queryBuilder.update>;

  // A) CREATE
  if (!id) {
    queryFilter = queryBuilder.insert([{ ...newCabin, image: imagePath }]);
  } else {
    // B) EDIT
    queryFilter = queryBuilder.update({ ...newCabin, image: imagePath }).eq('id', id);
  }

  const { data, error } = await queryFilter.select().single();

  if (error) {
    console.error(error.message);
    throw new Error('Cabin could not be created');
  }

  if (hasImagePath) return data;

  // upload image
  const { error: storageError } = await supabase.storage
    .from('cabin-images')
    .upload(imageName, newCabin.image);

  // delete the cabin if there was an error uploading the image
  if (storageError) {
    await supabase.from('cabins').delete().eq('id', data.id);
    console.error(storageError.message);
    throw new Error('Cabin image could not be uploaded and the cabin was not created');
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
