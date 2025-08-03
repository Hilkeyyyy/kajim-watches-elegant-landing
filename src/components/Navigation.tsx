import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavigationItem {
  label: string;
  href: string;
  isActive?: boolean;
}

interface NavigationProps {
  className?: string;
  orientation?: "horizontal" | "vertical";
  showMobileMenu?: boolean;
  onLinkClick?: () => void;
}

export const Navigation = React.memo(({ 
  className = "",
  orientation = "horizontal",
  showMobileMenu = false,
  onLinkClick 
}: NavigationProps) => {
  const location = useLocation();
  
  const navigationItems: NavigationItem[] = [
    { label: "Início", href: "/" },
    { label: "Produtos", href: "/#produtos" },
    { label: "Favoritos", href: "/favoritos" },
  ];

  const handleLinkClick = () => {
    if (onLinkClick) onLinkClick();
  };

  const isActive = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    if (href.startsWith("/#")) {
      return location.pathname === "/" && location.hash === href.substring(1);
    }
    return location.pathname === href;
  };

  const baseClasses = orientation === "horizontal" 
    ? "flex items-center space-x-6"
    : "flex flex-col space-y-2";

  const linkClasses = (href: string) => cn(
    "text-sm font-medium transition-colors hover:text-primary",
    isActive(href) ? "text-primary" : "text-muted-foreground",
    orientation === "vertical" && "w-full text-left px-3 py-2 rounded-md hover:bg-muted"
  );

  if (showMobileMenu && orientation === "vertical") {
    return (
      <nav className={cn(baseClasses, className)}>
        {navigationItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={linkClasses(item.href)}
            onClick={handleLinkClick}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav className={cn(baseClasses, className)}>
      {navigationItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={linkClasses(item.href)}
          onClick={handleLinkClick}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
});

Navigation.displayName = "Navigation";