import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface PageSettingsProps {
  landingPage: any;
  onUpdate: (updates: any) => Promise<void>;
}

const PageSettings = ({ landingPage, onUpdate }: PageSettingsProps) => {
  return (
    <div className="bg-white p-6 rounded-lg border space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Page Title</Label>
          <Input
            id="title"
            value={landingPage.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">URL Slug</Label>
          <Input
            id="slug"
            value={landingPage.slug}
            onChange={(e) => onUpdate({ slug: e.target.value })}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="template">Template</Label>
          <Select
            value={landingPage.template_name}
            onValueChange={(value) => onUpdate({ template_name: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default Template</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={landingPage.status}
            onValueChange={(value) => onUpdate({ status: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_homepage"
          checked={landingPage.is_homepage}
          onCheckedChange={(checked) => onUpdate({ is_homepage: checked })}
        />
        <Label htmlFor="is_homepage">Set as Homepage</Label>
      </div>
    </div>
  );
};

export default PageSettings;