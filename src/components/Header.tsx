import React from "react";
import { ShoppingCart, Search, User } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <>
      <div className="w-full bg-primary text-white text-center py-2 text-sm">
        BLACK FRIDAY + FRETE GRÁTIS 🎉
      </div>
      <header className="container mx-auto py-4 px-6 flex justify-between items-center">
        <button className="p-2">
          <Search className="w-5 h-5" />
        </button>
        <Link to="/" className="text-2xl font-bold">
          <img src="/lovable-uploads/afad369a-bb88-4bbc-aba2-54ae54f3591e.png" alt="Logo" className="h-8" />
        </Link>
        <div className="flex gap-4">
          <button className="p-2">
            <User className="w-5 h-5" />
          </button>
          <button className="p-2">
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </header>
    </>
  );
};

export default Header;