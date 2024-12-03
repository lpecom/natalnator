import React from "react";
import { Image } from "lucide-react";
import BannerForm from "@/components/admin/banners/BannerForm";
import BannerList from "@/components/admin/banners/BannerList";

const BannerAdmin = () => {
  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center gap-2 mb-8">
        <Image className="w-6 h-6" />
        <h1 className="text-2xl font-bold">Banner Management</h1>
      </div>

      <div className="grid gap-8">
        <BannerForm />
        <BannerList />
      </div>
    </div>
  );
};

export default BannerAdmin;