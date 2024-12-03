import React from "react";
import { Palette } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ThemeSettings } from "@/types/site";

interface ColorSettingsProps {
  settings: ThemeSettings;
  onColorChange: (colorKey: string, value: string) => void;
}

export const ColorSettings = ({ settings, onColorChange }: ColorSettingsProps) => {
  return (
    <div className="p-6 border rounded-lg">
      <div className="flex items-center gap-2 mb-6">
        <Palette className="w-5 h-5" />
        <h2 className="text-xl font-semibold">Theme Colors</h2>
      </div>

      <div className="grid gap-6">
        {Object.entries(settings.colors).map(([key, value]) => (
          <div key={key} className="flex flex-col gap-2">
            <label className="text-sm font-medium capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            <div className="flex gap-4">
              <Input
                type="color"
                value={value}
                onChange={(e) => onColorChange(key, e.target.value)}
                className="w-20 h-10 p-1"
              />
              <Input
                type="text"
                value={value}
                onChange={(e) => onColorChange(key, e.target.value)}
                className="font-mono"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};