import React, { ReactNode } from "react";

interface IconBadgeProps {
  icon: ReactNode;
  count: number;
  onClick?: () => void;
  className?: string;
}

export const IconBadge = React.memo(({ icon, count, onClick, className = "" }: IconBadgeProps) => {
  return (
    <button
      onClick={onClick}
      className={`relative p-2 transition-all duration-300 hover:scale-105 ${className}`}
    >
      {icon}
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-muted-foreground text-white text-xs font-medium rounded-full min-w-[16px] h-4 flex items-center justify-center px-1 border border-background shadow-sm">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
});