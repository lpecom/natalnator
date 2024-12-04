import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import AdminHeader from "@/components/admin/AdminHeader";
import { parseCSV, mapRowsToProducts } from "@/utils/csvParser";
import { importProduct } from "@/services/productImport";

const ImportProducts = () => {
  const [importing, setImporting] = useState(false);
  const navigate = useNavigate();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/csv") {
      toast.error("Please upload a CSV file");
      return;
    }

    setImporting(true);
    try {
      console.log('\nStarting import process');
      console.log('File name:', file.name);
      console.log('File size:', file.size, 'bytes');
      
      const text = await file.text();
      const { headers, rows } = parseCSV(text);
      const products = mapRowsToProducts(headers, rows);
      
      console.log('\nBeginning product import');
      console.log('Products to import:', products.length);
      
      let successCount = 0;
      let errorCount = 0;

      for (const product of products) {
        const success = await importProduct(product);
        if (success) {
          successCount++;
        } else {
          errorCount++;
        }
        
        console.log('\nImport progress:', {
          total: products.length,
          success: successCount,
          failed: errorCount,
          remaining: products.length - (successCount + errorCount)
        });
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