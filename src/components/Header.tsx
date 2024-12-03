import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-gray-900">
            Loja
          </Link>
          <nav>
            <ul className="flex items-center space-x-6">
              <li>
                <Link 
                  to="/catalog" 
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Catálogo
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;