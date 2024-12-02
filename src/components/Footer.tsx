import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Footer = () => {
  const { data: commonPages } = useQuery({
    queryKey: ["common-pages-footer"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("common_pages")
        .select("title, slug")
        .eq("is_active", true)
        .order("title");
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <footer className="bg-gray-100 mt-16">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Sobre nós</h3>
            <p className="text-gray-600">
              Oferecemos os melhores produtos com preços imbatíveis e garantia de satisfação.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Contato</h3>
            <ul className="space-y-2 text-gray-600">
              <li>Email: contato@empresa.com</li>
              <li>Telefone: (11) 9999-9999</li>
              <li>WhatsApp: (11) 9999-9999</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Links Úteis</h3>
            <ul className="space-y-2 text-gray-600">
              {commonPages?.map((page) => (
                <li key={page.slug}>
                  <Link 
                    to={`/pages/${page.slug}`}
                    className="hover:text-gray-900 transition-colors"
                  >
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
          <p>© 2024 Empresa. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;