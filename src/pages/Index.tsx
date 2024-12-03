import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingBag, Star, Truck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { data: featuredProducts, isLoading } = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const { data } = await supabase
        .from("landing_page_products")
        .select(`
          *,
          product_images (*)
        `)
        .limit(4);
      return data;
    },
  });

  const benefits = [
    {
      icon: <Truck className="w-6 h-6" />,
      title: "Frete Grátis",
      description: "Em todos os pedidos acima de R$99",
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Garantia de Qualidade",
      description: "100% de satisfação garantida",
    },
    {
      icon: <ShoppingBag className="w-6 h-6" />,
      title: "Pagamento Seguro",
      description: "Diversas formas de pagamento",
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Descubra Produtos Incríveis
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                As melhores ofertas com entrega rápida e segura para todo o Brasil
              </p>
              <Link to="/catalog">
                <Button size="lg" className="text-lg px-8">
                  Ver Catálogo
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="border-none shadow-soft hover:shadow-card transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                      {benefit.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Produtos em Destaque
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {isLoading ? (
                Array(4).fill(0).map((_, index) => (
                  <Card key={index} className="animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-t-lg" />
                    <CardContent className="p-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </CardContent>
                  </Card>
                ))
              ) : (
                featuredProducts?.map((product) => (
                  <Link key={product.id} to={`/p/${product.id}`}>
                    <Card className="hover:shadow-lg transition-shadow group">
                      <div className="aspect-square overflow-hidden rounded-t-lg">
                        <img
                          src={product.product_images?.[0]?.url || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium mb-2 line-clamp-2">
                          {product.name}
                        </h3>
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-primary">
                            R$ {product.price.toFixed(2)}
                          </span>
                          {product.original_price && (
                            <span className="text-sm text-gray-500 line-through">
                              R$ {product.original_price.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              )}
            </div>
            <div className="text-center mt-12">
              <Link to="/catalog">
                <Button variant="outline" size="lg">
                  Ver Todos os Produtos
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;