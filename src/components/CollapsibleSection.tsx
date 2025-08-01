import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";

interface CollapsibleSectionProps {
  title: string;
  section: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export const CollapsibleSection = memo(({ 
  title, 
  section, 
  isOpen, 
  onToggle, 
  children 
}: CollapsibleSectionProps) => (
  <Collapsible open={isOpen} onOpenChange={onToggle}>
    <CollapsibleTrigger asChild>
      <Button variant="ghost" className="flex items-center justify-between w-full p-4 text-left">
        <h3 className="text-lg font-semibold">{title}</h3>
        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </Button>
    </CollapsibleTrigger>
    <CollapsibleContent className="px-4 pb-4">
      {children}
    </CollapsibleContent>
  </Collapsible>
));

CollapsibleSection.displayName = "CollapsibleSection";