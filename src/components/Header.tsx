import React from "react";
import { ShoppingCart, Search, User } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="sticky top-0 z-50 bg-white">
      <div className="w-full bg-primary text-white text-center py-2 text-sm px-4">
        BLACK FRIDAY + FRETE GRÁTIS 🎉
      </div>
      <header className="container mx-auto py-3 px-4 flex justify-between items-center border-b">
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Search className="w-5 h-5" />
          </button>
        </div>
        <Link to="/" className="absolute left-1/2 -translate-x-1/2">
          <img 
            src="/lovable-uploads/afad369a-bb88-4bbc-aba2-54ae54f3591e.png" 
            alt="Logo" 
            className="h-7 md:h-8" 
          />
        </Link>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <User className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </header>
    </div>
  );
};

export default Header;