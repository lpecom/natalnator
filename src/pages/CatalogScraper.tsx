import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const CatalogScraper = () => {
  const handleScrape = async () => {
    try {
      toast.info("Starting catalog scrape...");
      
      const { data, error } = await supabase.functions.invoke('scrape-catalog');
      
      if (error) throw error;
      
      // Create a blob from the CSV data
      const blob = new Blob([data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = 'catalog.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success("Catalog scraped successfully!");
    } catch (error) {
      console.error('Error scraping catalog:', error);
      toast.error("Failed to scrape catalog");
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Catalog Scraper</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <p className="text-gray-600 mb-6">
            Click the button below to scrape the catalog from Luca Atacadista and download
            the results as a CSV file.
          </p>
          
          <Button 
            onClick={handleScrape}
            className="w-full"
          >
            Scrape Catalog
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CatalogScraper;