import React from "react";
import { cn } from "@/lib/utils";

interface VariantSelectorProps {
  optionName: string;
  values: string[];
  selectedValue: string;
  onValueChange: (value: string) => void;
}

const VariantSelector = ({ 
  optionName, 
  values, 
  selectedValue, 
  onValueChange 
}: VariantSelectorProps) => {
  if (!values.length) return null;

  // Format the title to be more user-friendly
  const formattedTitle = optionName === 'Option1' ? 'Color' : 
                        optionName === 'Option2' ? 'Size' : 
                        optionName === 'Option3' ? 'Style' : 
                        optionName;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-medium mb-2">
        {formattedTitle}: {selectedValue}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {values.map((value) => (
          <button
            key={value}
            onClick={() => onValueChange(value)}
            className={cn(
              "relative p-3 rounded-lg border-2 transition-all",
              selectedValue === value
                ? "border-primary bg-primary/5"
                : "border-gray-200 hover:border-gray-300"
            )}
          >
            {selectedValue === value && (
              <div className="absolute -top-2 -left-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <svg 
                  className="w-4 h-4 text-white" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M5 13l4 4L19 7" 
                  />
                </svg>
              </div>
            )}
            <span className="block text-center font-medium">
              {value}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default VariantSelector;