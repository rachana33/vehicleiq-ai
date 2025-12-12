import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'default' | 'accent' | 'warning' | 'destructive';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard = ({ title, value, subtitle, icon: Icon, variant = 'default', trend }: StatCardProps) => {
  const variantStyles = {
    default: 'bg-card border-border',
    accent: 'bg-accent/10 border-accent/30',
    warning: 'bg-warning/10 border-warning/30',
    destructive: 'bg-destructive/10 border-destructive/30',
  };

  const iconStyles = {
    default: 'text-primary bg-primary/10',
    accent: 'text-accent bg-accent/20',
    warning: 'text-warning bg-warning/20',
    destructive: 'text-destructive bg-destructive/20',
  };

  return (
    <div className={cn(
      'relative p-4 rounded-lg border transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5',
      variantStyles[variant]
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
          {subtitle && (
            <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <div className={cn(
              'mt-2 inline-flex items-center text-xs font-medium',
              trend.isPositive ? 'text-accent' : 'text-destructive'
            )}>
              <span>{trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        <div className={cn(
          'p-2.5 rounded-lg',
          iconStyles[variant]
        )}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
