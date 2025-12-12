import { AlertTriangle, Check, Thermometer, Fuel, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Alert {
  id: string;
  type: 'temperature' | 'fuel' | 'maintenance' | 'general';
  vehicleId: string;
  message: string;
  value?: string;
  timestamp: Date;
  acknowledged: boolean;
}

interface AlertPanelProps {
  alerts: Alert[];
  onAcknowledge?: (id: string) => void;
}

const AlertPanel = ({ alerts, onAcknowledge }: AlertPanelProps) => {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'temperature':
        return Thermometer;
      case 'fuel':
        return Fuel;
      case 'maintenance':
        return AlertCircle;
      default:
        return AlertTriangle;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'temperature':
        return 'text-destructive bg-destructive/10 border-destructive/30';
      case 'fuel':
        return 'text-warning bg-warning/10 border-warning/30';
      case 'maintenance':
        return 'text-primary bg-primary/10 border-primary/30';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const unacknowledgedCount = alerts.filter(a => !a.acknowledged).length;

  return (
    <div className="bg-card rounded-lg border border-border h-full flex flex-col">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-foreground">System Alerts</h3>
          {unacknowledgedCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium bg-destructive text-destructive-foreground rounded-full">
              {unacknowledgedCount}
            </span>
          )}
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Check className="w-8 h-8 mx-auto mb-2 text-accent" />
              <p className="text-sm">No active alerts</p>
            </div>
          ) : (
            alerts.map((alert) => {
              const Icon = getAlertIcon(alert.type);
              return (
                <div
                  key={alert.id}
                  className={cn(
                    'p-3 rounded-lg border flex items-start gap-3 transition-all',
                    alert.acknowledged ? 'opacity-50' : '',
                    getAlertColor(alert.type)
                  )}
                >
                  <div className="p-1.5 rounded-md bg-background/50">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {alert.message} - {alert.vehicleId}
                    </p>
                    {alert.value && (
                      <p className="text-xs text-muted-foreground mt-0.5">{alert.value}</p>
                    )}
                  </div>
                  {!alert.acknowledged && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs h-7 px-2 shrink-0"
                      onClick={() => onAcknowledge?.(alert.id)}
                    >
                      ACK
                    </Button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default AlertPanel;
