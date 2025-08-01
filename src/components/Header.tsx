import { useState } from "react";
import { Search, ShoppingCart, Heart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/useCart";
import { useFavorites } from "@/hooks/useFavorites";
import { CartSheet } from "@/components/CartSheet";
import { IconBadge } from "@/components/IconBadge";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getTotalItems } = useCart();
  const { getFavoritesCount } = useFavorites();
  const navigate = useNavigate();
  
  const totalItems = getTotalItems();
  const favoritesCount = getFavoritesCount();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality here
    console.log("Searching for:", searchQuery);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <button 
                onClick={() => navigate("/")}
                className="font-playfair text-2xl font-bold text-primary hover:text-primary/80 transition-colors"
              >
                KAJIM WATCHES
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6 flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Buscar relógios..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-muted/50 border-border focus:bg-background"
                  />
                </div>
              </form>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-3">
              <IconBadge
                icon={<Heart className="w-5 h-5 text-muted-foreground group-hover:text-red-600 transition-colors" />}
                count={favoritesCount}
                onClick={() => navigate("/favoritos")}
                className="group hover:bg-muted rounded-lg"
              />
              
              <IconBadge
                icon={<ShoppingCart className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />}
                count={totalItems}
                onClick={() => setIsCartOpen(true)}
                className="group hover:bg-muted rounded-lg"
              />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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
                
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <IconBadge
                      icon={
                        <div className="flex items-center w-full">
                          <Heart className="w-5 h-5 mr-2" />
                          <span>Favoritos</span>
                        </div>
                      }
                      count={favoritesCount}
                      onClick={() => {
                        navigate("/favoritos");
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full hover:bg-muted rounded-lg p-2 flex justify-start"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <IconBadge
                      icon={
                        <div className="flex items-center w-full">
                          <ShoppingCart className="w-5 h-5 mr-2" />
                          <span>Carrinho</span>
                        </div>
                      }
                      count={totalItems}
                      onClick={() => {
                        setIsCartOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full hover:bg-muted rounded-lg p-2 flex justify-start"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <CartSheet isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Header;