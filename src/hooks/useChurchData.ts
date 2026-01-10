import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Culto {
  id: string;
  title: string;
  date: string;
  description: string | null;
  summary: string | null;
  video_id: string | null;
  thumbnail_url: string | null;
  teachings: string[] | null;
  year: number | null;
  published: boolean | null;
}

export interface Estudo {
  id: string;
  title: string;
  author: string;
  date: string;
  excerpt: string | null;
  content: string | null;
  published: boolean | null;
}

export interface ScheduleItem {
  id: string;
  day: string;
  time: string;
  event: string;
  is_highlight: boolean | null;
  order_index: number | null;
}

export const useCultos = (year?: number) => {
  return useQuery({
    queryKey: ["cultos", year],
    queryFn: async () => {
      let query = supabase
        .from("cultos")
        .select("*")
        .eq("published", true)
        .order("date", { ascending: false });
      
      if (year) {
        query = query.eq("year", year);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as Culto[];
    },
  });
};

export const useCulto = (id: string) => {
  return useQuery({
    queryKey: ["culto", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cultos")
        .select("*")
        .eq("id", id)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      return data as Culto | null;
    },
    enabled: !!id,
  });
};

export const useCultosYears = () => {
  return useQuery({
    queryKey: ["cultos-years"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cultos")
        .select("year")
        .eq("published", true)
        .order("year", { ascending: false });
      if (error) throw error;
      
      const years = [...new Set(data?.map(c => c.year).filter(Boolean))] as number[];
      return years;
    },
  });
};

export const useRecentCultos = (limit = 3) => {
  return useQuery({
    queryKey: ["recent-cultos", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cultos")
        .select("*")
        .eq("published", true)
        .order("date", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data as Culto[];
    },
  });
};

export const useEstudos = () => {
  return useQuery({
    queryKey: ["estudos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("estudos")
        .select("*")
        .eq("published", true)
        .order("date", { ascending: false });
      if (error) throw error;
      return data as Estudo[];
    },
  });
};

export const useEstudo = (id: string) => {
  return useQuery({
    queryKey: ["estudo", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("estudos")
        .select("*")
        .eq("id", id)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      return data as Estudo | null;
    },
    enabled: !!id,
  });
};

export const useSchedule = () => {
  return useQuery({
    queryKey: ["schedule"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("schedule")
        .select("*")
        .order("order_index", { ascending: true });
      if (error) throw error;
      return data as ScheduleItem[];
    },
  });
};
