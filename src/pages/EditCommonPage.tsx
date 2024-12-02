import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import RichTextEditor from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";

const EditCommonPage = () => {
  const { id } = useParams();
  const { toast } = useToast();

  const { data: page, refetch } = useQuery({
    queryKey: ["common-page", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("common_pages")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const handleSave = async (content: string, html: string) => {
    const { error } = await supabase
      .from("common_pages")
      .update({
        content,
        content_html: html,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save page content",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Page content saved successfully",
    });
    refetch();
  };

  if (!page) return null;

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{page.title}</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <RichTextEditor
          initialContent={page.content}
          onSave={handleSave}
        />
      </div>
    </div>
  );
};

export default EditCommonPage;