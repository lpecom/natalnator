import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
});

const CreateLandingPage = () => {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // First create the landing page
      const { data: landingPage, error: landingPageError } = await supabase
        .from("landing_pages")
        .insert([
          {
            title: values.title,
            slug: values.slug,
          },
        ])
        .select()
        .single();

      if (landingPageError) throw landingPageError;

      // Then create a default product for this landing page
      const { error: productError } = await supabase
        .from("landing_page_products")
        .insert([
          {
            landing_page_id: landingPage.id,
            name: values.title,
            price: 99.90,
            original_price: 187.00,
            stock: 10,
            source: "manual",
          },
        ]);

      if (productError) throw productError;

      toast.success("Landing page created successfully");
      navigate(`/landing-pages/${landingPage.id}/edit`);
    } catch (error) {
      console.error("Error creating landing page:", error);
      toast.error("Error creating landing page");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Create Landing Page</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter page title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="enter-page-slug" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/landing-pages")}
              >
                Cancel
              </Button>
              <Button type="submit">Create Landing Page</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateLandingPage;