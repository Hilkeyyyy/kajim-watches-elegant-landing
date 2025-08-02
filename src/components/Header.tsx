import React, { useState, useCallback } from "react";
import { Search, ShoppingCart, Heart, Menu, X, User, LogIn, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOptimizedCart } from "@/hooks/useOptimizedCart";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/contexts/AuthContext";
import { CartSheet } from "@/components/CartSheet";
import { IconBadge } from "@/components/IconBadge";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = React.memo(() => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getTotalItems } = useOptimizedCart();
  const { count: favoritesCount } = useFavorites();
  const { user, signOut, isAdmin } = useAuth();
  const { isLoading } = useApp();
  const navigate = useNavigate();
  
  const totalItems = getTotalItems();
  

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  }, [searchQuery]);

  const handleCartOpen = useCallback(() => setIsCartOpen(true), []);
  const handleCartClose = useCallback(() => setIsCartOpen(false), []);
  const handleFavoritesClick = useCallback(() => navigate("/favoritos"), [navigate]);
  const toggleMobileMenu = useCallback(() => setIsMobileMenuOpen(prev => !prev), []);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleAuthClick = () => {
    navigate("/auth");
    setIsMobileMenuOpen(false);
  };

  const handleAdminClick = () => {
    navigate("/admin");
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 xs:h-16">
            {/* Left side - Cart and Favorites Icons */}
            <div className="flex items-center space-x-1 xs:space-x-2">
              <IconBadge
                icon={<ShoppingCart className="w-4 h-4 xs:w-5 xs:h-5 text-muted-foreground group-hover:text-primary transition-colors" />}
                count={totalItems}
                onClick={handleCartOpen}
                className="group hover:bg-muted rounded-lg p-1.5 xs:p-2"
              />
              
              <IconBadge
                icon={<Heart className="w-4 h-4 xs:w-5 xs:h-5 text-muted-foreground group-hover:text-red-600 transition-colors" />}
                count={favoritesCount}
                onClick={handleFavoritesClick}
                className="group hover:bg-muted rounded-lg p-1.5 xs:p-2"
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
              
              {/* User Menu */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                      <User className="w-4 h-4 mr-2" />
                      Conta
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem disabled>
                      {user.email}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {isAdmin && (
                      <>
                        <DropdownMenuItem onClick={handleAdminClick}>
                          <Settings className="mr-2 h-4 w-4" />
                          Painel Admin
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogIn className="mr-2 h-4 w-4" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="ghost" onClick={handleAuthClick}>
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
              )}
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
            <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-sm">
              <div className="px-3 xs:px-4 pt-3 pb-4 space-y-3">
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

                  {/* Mobile User Menu */}
                  {user ? (
                    <>
                      <div className="px-4 py-2 border-t border-b">
                        <p className="text-sm font-medium">{user.email}</p>
                      </div>
                      {isAdmin && (
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={handleAdminClick}
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Painel Admin
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={handleSignOut}
                      >
                        <LogIn className="mr-2 h-4 w-4" />
                        Sair
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={handleAuthClick}
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      Entrar / Cadastrar
                    </Button>
                  )}
                  
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