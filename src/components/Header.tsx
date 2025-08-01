import React, { useState, useCallback } from "react";
import { Search, ShoppingCart, Heart, Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOptimizedCart } from "@/hooks/useOptimizedCart";
import { useOptimizedFavorites } from "@/hooks/useOptimizedFavorites";
import { CartSheet } from "@/components/CartSheet";
import { IconBadge } from "@/components/IconBadge";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";

const Header = React.memo(() => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getTotalItems } = useOptimizedCart();
  const { getFavoritesCount } = useOptimizedFavorites();
  const { isLoading } = useApp();
  const navigate = useNavigate();
  
  const totalItems = getTotalItems();
  const favoritesCount = getFavoritesCount();

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality here
    console.log("Searching for:", searchQuery);
  }, [searchQuery]);

  const handleCartOpen = useCallback(() => setIsCartOpen(true), []);
  const handleCartClose = useCallback(() => setIsCartOpen(false), []);
  const handleFavoritesClick = useCallback(() => navigate("/favoritos"), [navigate]);
  const toggleMobileMenu = useCallback(() => setIsMobileMenuOpen(prev => !prev), []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Cart and Favorites Icons */}
            <div className="flex items-center space-x-2">
              <IconBadge
                icon={<ShoppingCart className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />}
                count={totalItems}
                onClick={handleCartOpen}
                className="group hover:bg-muted rounded-lg"
              />
              
              <IconBadge
                icon={<Heart className="w-5 h-5 text-muted-foreground group-hover:text-red-600 transition-colors" />}
                count={favoritesCount}
                onClick={handleFavoritesClick}
                className="group hover:bg-muted rounded-lg"
              />
            </div>

            {/* Center - Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8">
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="font-medium hover:text-primary transition-colors"
              >
                Ver produtos
              </Button>
              
              <Button
                variant="ghost"
                onClick={() => navigate("/favoritos")}
                className="font-medium hover:text-primary transition-colors"
              >
                Produtos salvos
              </Button>
              
              <Button
                variant="ghost"
                className="font-medium hover:text-primary transition-colors"
              >
                <User className="w-4 h-4 mr-2" />
                Login
              </Button>
            </nav>

            {/* Right side - Search */}
            <div className="hidden md:flex items-center max-w-xs">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Buscar relógios..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-muted/50 border-border focus:bg-background w-full"
                  />
                </div>
              </form>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMobileMenu}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-border">
              <div className="px-2 pt-2 pb-3 space-y-3">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Buscar relógios..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </form>
                
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      navigate("/");
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full justify-start"
                  >
                    Ver produtos
                  </Button>
                  
                  <Button
                    variant="ghost"
                    onClick={() => {
                      navigate("/favoritos");
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full justify-start"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Produtos salvos ({favoritesCount})
                  </Button>
                  
                  <Button
                    variant="ghost"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full justify-start"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCartOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full justify-start"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Carrinho ({totalItems})
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <CartSheet isOpen={isCartOpen} onClose={handleCartClose} />
    </>
  );
});

export default Header;