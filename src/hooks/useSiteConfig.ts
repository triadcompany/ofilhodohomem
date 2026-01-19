import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SiteConfig {
  church_name: string;
  church_subtitle: string;
  description: string;
  address_line1: string;
  address_line2: string;
  phone: string;
  email: string;
  facebook_url: string;
  instagram_url: string;
  youtube_url: string;
  hero_welcome_text: string;
  hero_title: string;
  hero_subtitle: string;
  hero_verse: string;
  hero_verse_reference: string;
  hero_image_url: string;
}

const defaultConfig: SiteConfig = {
  church_name: "Tabernáculo",
  church_subtitle: "O Filho do Homem",
  description: "Uma comunidade de fé dedicada a proclamar a mensagem de Cristo e servir ao próximo com amor.",
  address_line1: "Rua Exemplo, 123",
  address_line2: "Centro - Cidade/UF",
  phone: "(00) 00000-0000",
  email: "contato@tabernaculo.com",
  facebook_url: "",
  instagram_url: "",
  youtube_url: "",
  hero_welcome_text: "Bem-vindo ao",
  hero_title: "Tabernáculo",
  hero_subtitle: "O Filho do Homem",
  hero_verse: "Porque o Filho do Homem veio buscar e salvar o que se havia perdido.",
  hero_verse_reference: "Lucas 19:10",
  hero_image_url: "",
};

export const useSiteConfig = () => {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data, error } = await supabase
          .from("church_info")
          .select("key, value");

        if (error) throw error;

        if (data && data.length > 0) {
          const configFromDb: Partial<SiteConfig> = {};
          data.forEach((item) => {
            if (item.key in defaultConfig) {
              configFromDb[item.key as keyof SiteConfig] = item.value || "";
            }
          });
          setConfig({ ...defaultConfig, ...configFromDb });
        }
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  return { config, loading };
};
