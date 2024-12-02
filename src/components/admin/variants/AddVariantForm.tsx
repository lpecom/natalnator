import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddVariantFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const AddVariantForm = ({ onSubmit }: AddVariantFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 border-t pt-6">
      <h3 className="font-medium">Add New Variant</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="name">Option Type</Label>
          <select
            id="name"
            name="name"
            className="w-full mt-1 border rounded-md p-2"
            required
          >
            <option value="Cor">Color</option>
            <option value="Altura">Height</option>
          </select>
        </div>
        <div>
          <Label htmlFor="value">Value</Label>
          <Input
            id="value"
            name="value"
            type="text"
            placeholder="e.g., Dourada Noel"
            className="mt-1"
            required
          />
        </div>
        <div>
          <Label htmlFor="price_adjustment">Price Adjustment</Label>
          <Input
            id="price_adjustment"
            name="price_adjustment"
            type="number"
            step="0.01"
            placeholder="0.00"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            placeholder="0"
            className="mt-1"
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="checkout_url">Checkout URL</Label>
          <Input
            id="checkout_url"
            name="checkout_url"
            type="url"
            placeholder="https://..."
            className="mt-1"
            required
          />
        </div>
      </div>
      <Button type="submit" className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Add Variant
      </Button>
    </form>
  );
};

export default AddVariantForm;