import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "Active" | "Maintenance" | "Retired" | "Available";
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const variants = {
    Active: "bg-success/10 text-success hover:bg-success/20 border-success/20",
    Maintenance: "bg-warning/10 text-warning hover:bg-warning/20 border-warning/20",
    Retired: "bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20",
    Available: "bg-primary/10 text-primary hover:bg-primary/20 border-primary/20"
  };

  return (
    <Badge variant="outline" className={cn("font-medium", variants[status])}>
      {status}
    </Badge>
  );
};
