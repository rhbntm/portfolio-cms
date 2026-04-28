import { supabase } from './supabase';
import { validateImageFile } from './validation';

export async function uploadImage(file, folder) {
  validateImageFile(file);
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const filePath = `${folder}/${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from('images')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data: publicUrlData } = supabase.storage
    .from('images')
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}
