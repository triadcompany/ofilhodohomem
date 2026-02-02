import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  hero_title: string | null;
  hero_subtitle: string | null;
  section_subtitle: string | null;
  section_title: string | null;
  parent_menu: string | null;
  menu_order: number | null;
  show_in_menu: boolean | null;
  published: boolean | null;
  created_at: string;
  updated_at: string;
}

export const usePages = () => {
  return useQuery({
    queryKey: ["pages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pages")
        .select("*")
        .eq("published", true)
        .order("menu_order", { ascending: true });
      if (error) throw error;
      return data as Page[];
    },
  });
};

export const useMenuPages = () => {
  return useQuery({
    queryKey: ["menu-pages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pages")
        .select("*")
        .eq("published", true)
        .eq("show_in_menu", true)
        .order("menu_order", { ascending: true });
      if (error) throw error;
      return data as Page[];
    },
  });
};

export const usePage = (slug: string) => {
  return useQuery({
    queryKey: ["page", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pages")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      return data as Page | null;
    },
    enabled: !!slug,
  });
};

export const useAdminPages = () => {
  return useQuery({
    queryKey: ["admin-pages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pages")
        .select("*")
        .order("parent_menu", { ascending: true })
        .order("menu_order", { ascending: true });
      if (error) throw error;
      return data as Page[];
    },
  });
};

export const useCreatePage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (page: Omit<Page, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("pages")
        .insert(page)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-pages"] });
      queryClient.invalidateQueries({ queryKey: ["menu-pages"] });
      queryClient.invalidateQueries({ queryKey: ["pages"] });
      toast.success("Página criada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error("Erro ao criar página: " + error.message);
    },
  });
};

export const useUpdatePage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...page }: Partial<Page> & { id: string }) => {
      const { data, error } = await supabase
        .from("pages")
        .update(page)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-pages"] });
      queryClient.invalidateQueries({ queryKey: ["menu-pages"] });
      queryClient.invalidateQueries({ queryKey: ["pages"] });
      toast.success("Página atualizada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error("Erro ao atualizar página: " + error.message);
    },
  });
};

export const useDeletePage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("pages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-pages"] });
      queryClient.invalidateQueries({ queryKey: ["menu-pages"] });
      queryClient.invalidateQueries({ queryKey: ["pages"] });
      toast.success("Página excluída com sucesso!");
    },
    onError: (error: Error) => {
      toast.error("Erro ao excluir página: " + error.message);
    },
  });
};
