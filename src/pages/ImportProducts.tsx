import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import AdminHeader from "@/components/admin/AdminHeader";

interface ShopifyProduct {
  Handle: string;
  Title: string;
  "Body (HTML)": string;
  "Variant Price": string;
  "Variant Compare At Price": string;
  "Image Src": string;
  "Image Alt Text": string;
  "Option1 Name": string;
  "Option1 Value": string;
  "Option2 Name": string;
  "Option2 Value": string;
  Status: string;
}

const ImportProducts = () => {
  const [importing, setImporting] = useState(false);
  const navigate = useNavigate();

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const parseCSV = (text: string): { headers: string[], rows: string[][] } => {
    // Split by newlines but filter out empty lines and carriage returns
    const lines = text.split(/\r?\n/).filter(line => line.trim());
    
    // Parse headers
    const headers = lines[0].split(',').map(header => header.trim().replace(/^"/, '').replace(/"$/, ''));
    console.log('Headers found:', headers);

    // Parse rows, handling quoted values correctly
    const rows = lines.slice(1).map(line => {
      const row = [];
      let inQuotes = false;
      let currentValue = '';
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          if (line[i + 1] === '"') {
            // Handle escaped quotes
            currentValue += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (char === ',' && !inQuotes) {
          row.push(currentValue.trim());
          currentValue = '';
        } else {
          currentValue += char;
        }
      }
      row.push(currentValue.trim()); // Push the last value
      return row;
    });

    return { headers, rows };
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/csv") {
      toast.error("Please upload a CSV file");
      return;
    }

    setImporting(true);
    try {
      const text = await file.text();
      const { headers, rows } = parseCSV(text);
      
      console.log(`Total rows found: ${rows.length}`);

      // Map rows to products
      const products: ShopifyProduct[] = rows.map((values, index) => {
        const product = headers.reduce((obj: any, header, i) => {
          obj[header] = values[i] || '';
          return obj;
        }, {});
        
        if (index === 0) {
          console.log('First product sample:', product);
        }
        return product;
      });

      let successCount = 0;
      let errorCount = 0;

      for (const product of products) {
        try {
          if (!product.Title || !product["Variant Price"]) {
            console.log('Skipping product due to missing required fields:', product);
            errorCount++;
            continue;
          }

          // Use Handle as slug if available, otherwise generate from Title
          const slug = product.Handle || generateSlug(product.Title);
          
          console.log('Creating landing page for:', {
            title: product.Title,
            slug: slug,
            price: product["Variant Price"]
          });

          // Create landing page
          const { data: landingPage, error: landingPageError } = await supabase
            .from("landing_pages")
            .insert({
              title: product.Title,
              slug: slug,
              status: product.Status?.toLowerCase() === 'active' ? 'published' : 'draft',
              template_name: 'default',
              route_type: 'product'
            })
            .select()
            .single();

          if (landingPageError) {
            console.error('Landing page creation error:', landingPageError);
            throw landingPageError;
          }

          // Create product
          const { error: productError } = await supabase
            .from("landing_page_products")
            .insert({
              landing_page_id: landingPage.id,
              name: product.Title,
              description_html: product["Body (HTML)"],
              price: parseFloat(product["Variant Price"]) || 0,
              original_price: parseFloat(product["Variant Compare At Price"]) || null,
              source: 'shopify',
              external_metadata: { shopify_handle: product.Handle }
            });

          if (productError) {
            console.error('Product creation error:', productError);
            throw productError;
          }

          // Add product image if available
          if (product["Image Src"]) {
            const { error: imageError } = await supabase
              .from("product_images")
              .insert({
                product_id: landingPage.id,
                url: product["Image Src"],
                alt_text: product["Image Alt Text"] || product.Title,
                is_primary: true,
                display_order: 0
              });

            if (imageError) {
              console.error('Image creation error:', imageError);
              throw imageError;
            }
          }

          successCount++;
        } catch (error) {
          console.error("Error importing product:", error);
          errorCount++;
        }
      }

      if (successCount > 0) {
        toast.success(`Import completed: ${successCount} products imported successfully, ${errorCount} failed`);
        navigate("/admin/products");
      } else {
        toast.error(`Import failed: ${errorCount} products failed to import. Check console for details.`);
      }
    } catch (error) {
      console.error("Error processing CSV:", error);
      toast.error("Failed to process the CSV file");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="p-8">
      <AdminHeader title="Import Products" />
      <div className="max-w-xl mx-auto mt-8">
        <div className="bg-white p-6 rounded-lg border">
          <div className="space-y-4">
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold">Import Shopify Products</h3>
              <p className="mt-1 text-sm text-gray-500">
                Upload a CSV file exported from Shopify to import products
              </p>
            </div>
            <div className="mt-4">
              <Input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                disabled={importing}
              />
            </div>
            {importing && (
              <div className="text-center text-sm text-gray-500">
                Importing products... Please wait.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportProducts;