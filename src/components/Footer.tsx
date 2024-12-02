import React from "react";

const Footer = () => {
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
            <h3 className="font-bold text-gray-900 mb-4">Redes Sociais</h3>
            <ul className="space-y-2 text-gray-600">
              <li>Instagram: @empresa</li>
              <li>Facebook: /empresa</li>
              <li>Twitter: @empresa</li>
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