import { ReactNode } from "react";

interface IconBadgeProps {
  icon: ReactNode;
  count: number;
  onClick?: () => void;
  className?: string;
}

export const IconBadge = ({ icon, count, onClick, className = "" }: IconBadgeProps) => {
  return (
    <button
      onClick={onClick}
      className={`relative p-2 transition-all duration-300 hover:scale-105 ${className}`}
    >
      {icon}
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 border-2 border-background shadow-md transform scale-110">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
};