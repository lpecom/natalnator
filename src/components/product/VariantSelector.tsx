import React from "react";
import { Button } from "@/components/ui/button";

interface VariantSelectorProps {
  optionName: string;
  values: string[];
  selectedValue: string;
  onValueChange: (value: string) => void;
}

const VariantSelector = ({ optionName, values, selectedValue, onValueChange }: VariantSelectorProps) => {
  if (!values.length) return null;

  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        {optionName}: <span className="text-primary">{selectedValue || `Selecione ${optionName}`}</span>
      </label>
      <div className="flex gap-2">
        {values.map((value) => (
          <Button
            key={value}
            variant="outline"
            className={`px-4 py-2 border-2 rounded font-medium text-sm ${
              selectedValue === value
                ? "border-primary text-primary"
                : "border-gray-200 text-gray-500"
            }`}
            onClick={() => onValueChange(value)}
          >
            {value}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default VariantSelector;