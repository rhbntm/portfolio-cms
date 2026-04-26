import { supabase } from './supabase';

export async function uploadImage(file, folder) {
  const filePath = `${folder}/${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from('images')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data: publicUrlData } = supabase.storage
    .from('images')
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}
