import React from "react";
import { Settings } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { LogoUpload } from "@/components/admin/LogoUpload";
import { ColorSettings } from "@/components/admin/ColorSettings";
import { ThemeSettings } from "@/types/site";
import { Tables, Json } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";

const SiteAdmin = () => {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'theme')
        .single();

      if (error) throw error;
      return data as Tables<'site_settings'> & { value: ThemeSettings };
    }
  });

  const updateSettings = useMutation({
    mutationFn: async (newSettings: ThemeSettings) => {
      const { error } = await supabase
        .from('site_settings')
        .update({ 
          value: newSettings as unknown as Json,
          updated_at: new Date().toISOString()
        })
        .eq('key', 'theme');

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      toast.success("Configurações atualizadas com sucesso");
    },
    onError: () => {
      toast.error("Falha ao atualizar configurações");
    }
  });

  const handleColorChange = (colorKey: string, value: string) => {
    if (!settings) return;

    const newSettings = {
      ...settings.value as ThemeSettings,
      colors: {
        ...(settings.value as ThemeSettings).colors,
        [colorKey]: value
      }
    };

    updateSettings.mutate(newSettings);
  };

  const handleSetDefaultLogo = () => {
    if (!settings) return;

    const newSettings = {
      ...settings.value as ThemeSettings,
      logo: {
        url: 'https://iili.io/21Ody1p.png',
        alt: 'Logo do Site'
      }
    };

    updateSettings.mutate(newSettings);
  };

  if (isLoading) {
    return <div className="p-8">Carregando...</div>;
  }

  if (!settings) {
    return <div className="p-8">Nenhuma configuração encontrada</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center gap-2 mb-8">
        <Settings className="w-6 h-6" />
        <h1 className="text-2xl font-bold">Administração do Site</h1>
      </div>

      <div className="grid gap-8">
        <div className="p-6 border rounded-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              <h2 className="text-xl font-semibold">Logo do Site</h2>
            </div>
            <Button onClick={handleSetDefaultLogo}>
              Carregar Logo Padrão
            </Button>
          </div>

          <div className="space-y-4">
            {settings.value.logo?.url && (
              <div className="w-48 h-24 relative border rounded-lg overflow-hidden">
                <img 
                  src={settings.value.logo.url} 
                  alt="Logo do Site"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>
        </div>
        <ColorSettings
          settings={settings.value as ThemeSettings}
          onColorChange={handleColorChange}
        />
      </div>
    </div>
  );
};

export default SiteAdmin;