import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface AnniversaryPhoto {
  id: string;
  category: string;
  photo_url: string;
  caption: string | null;
  display_order: number | null;
  created_at: string;
}

export const PHOTO_CATEGORIES = [
  { value: "sexta", label: "Culto de Sexta" },
  { value: "sabado", label: "Culto de Sábado" },
  { value: "domingo", label: "Companheirismo Domingo" },
] as const;

export const useAnniversaryPhotos = (category?: string) => {
  return useQuery({
    queryKey: ["anniversary-photos", category],
    queryFn: async () => {
      let query = supabase
        .from("anniversary_photos")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: true });
      if (category) query = query.eq("category", category);
      const { data, error } = await query;
      if (error) throw error;
      return data as AnniversaryPhoto[];
    },
  });
};

export const useUploadPhoto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, category, caption }: { file: File; category: string; caption?: string }) => {
      const ext = file.name.split(".").pop();
      const fileName = `${category}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("anniversary-photos")
        .upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("anniversary-photos")
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from("anniversary_photos")
        .insert({ category, photo_url: urlData.publicUrl, caption: caption || null });
      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["anniversary-photos"] });
      toast.success("Foto enviada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error("Erro ao enviar foto: " + error.message);
    },
  });
};

export const useDeletePhoto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (photo: AnniversaryPhoto) => {
      // Extract file path from URL
      const url = new URL(photo.photo_url);
      const pathParts = url.pathname.split("/anniversary-photos/");
      if (pathParts[1]) {
        await supabase.storage.from("anniversary-photos").remove([decodeURIComponent(pathParts[1])]);
      }
      const { error } = await supabase.from("anniversary_photos").delete().eq("id", photo.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["anniversary-photos"] });
      toast.success("Foto excluída!");
    },
    onError: (error: Error) => {
      toast.error("Erro ao excluir foto: " + error.message);
    },
  });
};
