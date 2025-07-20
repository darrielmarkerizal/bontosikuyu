import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const uploadImageToSupabase = async (file: File): Promise<string> => {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `articles/${fileName}`;

  // First, try to upload with anon key
  const { error } = await supabase.storage
    .from("laiyolobaru-bucket")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Upload error details:", error);

    // If RLS error, provide specific guidance
    if (error.message.includes("row-level security policy")) {
      throw new Error(
        "Storage bucket requires authentication. Please configure RLS policies or use service role key."
      );
    }

    throw new Error(`Upload failed: ${error.message}`);
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("laiyolobaru-bucket").getPublicUrl(filePath);

  return publicUrl;
};
