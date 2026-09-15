import { supabase } from "@/lib/supabase";

export async function uploadDocument(file: File) {
  const filePath = `${crypto.randomUUID()}-${file.name}`;

  const { data, error } = await supabase.storage
    .from("documents")
    .upload(filePath, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error("Upload error:", error);
    throw error;
  }

  const { data: publicUrlData } = supabase.storage
    .from("documents")
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
}