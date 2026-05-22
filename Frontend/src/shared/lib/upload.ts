import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/features/auth/authStore";

export async function uploadProfileImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${ext}`;

  // guarantee the supabase client session is active before storage upload
  const { session } = useAuthStore.getState();
  if (!session) throw new Error("Not authenticated");

  await supabase.auth.setSession({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
  });

  const { data, error } = await supabase.storage
    .from("profile-pictures")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from("profile-pictures")
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}