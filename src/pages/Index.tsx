import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingBag, Star, Truck, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const isMobile = useIsMobile();

  const { data: mainBanner } = useQuery({
    queryKey: ["main-banner"],
    queryFn: async () => {
      const { data } = await supabase
        .from("banners")
        .select("*")
        .eq("banner_type", "main")
        .eq("is_active", true)
        .order("display_order")
        .limit(1)
        .single();
      return data;
    },
  });

  const { data: smallBanners } = useQuery({
    queryKey: ["small-banners"],
    queryFn: async () => {
      const { data } = await supabase
        .from("banners")
        .select("*")
        .eq("banner_type", "small")
        .eq("is_active", true)
        .order("display_order")
        .limit(3);
      return data;
    },
  });

  const { data: featuredProducts, isLoading } = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const { data } = await supabase
        .from("landing_page_products")
        .select(`
          *,
          product_images (*),
          landing_page:landing_pages(slug)
        `)
        .limit(6);
      return data;
    },
  });

  const benefits = [
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Frete Grátis",
      description: "Em todos os pedidos acima de R$99",
      color: "bg-primary/10 text-primary",
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Garantia de Qualidade",
      description: "100% de satisfação garantida",
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      icon: <ShoppingBag className="w-8 h-8" />,
      title: "Pagamento Seguro",
      description: "Diversas formas de pagamento",
      color: "bg-blue-100 text-blue-700",
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Main Banner Section */}
        {mainBanner && (
          <section className="w-full">
            {mainBanner.link_url ? (
              <Link to={mainBanner.link_url}>
                <img
                  src={isMobile ? mainBanner.mobile_image_url : mainBanner.desktop_image_url}
                  alt={mainBanner.name}
                  className="w-full h-auto object-cover"
                />
              </Link>
            ) : (
              <img
                src={isMobile ? mainBanner.mobile_image_url : mainBanner.desktop_image_url}
                alt={mainBanner.name}
                className="w-full h-auto object-cover"
              />
            )}
          </section>
        )}

        {/* Featured Products Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">
                Em Destaque
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold">
                Produtos Mais Vendidos
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6">
              {isLoading
                ? Array(6)
                    .fill(0)
                    .map((_, index) => (
                      <Card key={index} className="animate-pulse">
                        <div className="aspect-square bg-gray-200 rounded-t-lg" />
                        <CardContent className="p-4">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                          <div className="h-4 bg-gray-200 rounded w-1/2" />
                        </CardContent>
                      </Card>
                    ))
                : featuredProducts?.map((product) => (
                    <Link 
                      key={product.id} 
                      to={`/p/${product.landing_page?.slug}`}
                    >
                      <Card className="hover:shadow-lg transition-all duration-300 group h-full">
                        <div className="aspect-square overflow-hidden rounded-t-lg relative">
                          <img
                            src={product.product_images?.[0]?.url || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {product.original_price && (
                            <Badge 
                              variant="destructive"
                              className="absolute top-2 right-2"
                            >
                              {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
                            </Badge>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-medium mb-2 line-clamp-2 min-h-[2.5rem]">
                            {product.name}
                          </h3>
                          <div className="flex flex-col gap-1">
                            {product.original_price && (
                              <span className="text-sm text-gray-500 line-through">
                                R$ {product.original_price.toFixed(2)}
                              </span>
                            )}
                            <span className="text-xl font-bold text-primary">
                              R$ {product.price.toFixed(2)}
                            </span>
                          </div>
                          <Button 
                            variant="secondary" 
                            className="w-full mt-4"
                          >
                            Ver Detalhes
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
            </div>
          </div>
        </section>

        {/* Small Banners Section */}
        {smallBanners && smallBanners.length > 0 && (
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {smallBanners.map((banner) => (
                  <div key={banner.id} className="relative overflow-hidden rounded-lg">
                    {banner.link_url ? (
                      <Link to={banner.link_url}>
                        <img
                          src={isMobile ? banner.mobile_image_url : banner.desktop_image_url}
                          alt={banner.name}
                          className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </Link>
                    ) : (
                      <img
                        src={isMobile ? banner.mobile_image_url : banner.desktop_image_url}
                        alt={banner.name}
                        className="w-full h-auto object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Benefits Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {benefits.map((benefit, index) => (
                <Card 
                  key={index} 
                  className="border-none shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-xl ${benefit.color}`}>
                        {benefit.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                        <p className="text-gray-600">{benefit.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
