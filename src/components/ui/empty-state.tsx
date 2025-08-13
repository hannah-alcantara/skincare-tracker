import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          {Icon && (
            <div className="mx-auto w-12 h-12 text-muted-foreground">
              <Icon className="w-full h-full" />
            </div>
          )}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">{title}</h3>
            {description && (
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                {description}
              </p>
            )}
          </div>
          {action && (
            <Button
              asChild={!!action.href}
              onClick={action.onClick}
              className="mt-4"
            >
              {action.href ? (
                <a href={action.href}>{action.label}</a>
              ) : (
                action.label
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}