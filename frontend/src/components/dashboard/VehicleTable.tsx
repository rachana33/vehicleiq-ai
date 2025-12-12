import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Fuel, Gauge, Thermometer } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Vehicle {
  id: string;
  model: string;
  status: 'active' | 'idle' | 'maintenance';
  speed: number;
  fuel: number;
  temp: number;
}

interface VehicleTableProps {
  vehicles: Vehicle[];
  onViewVehicle?: (id: string) => void;
}

const VehicleTable = ({ vehicles, onViewVehicle }: VehicleTableProps) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'idle':
        return 'secondary';
      case 'maintenance':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getTempColor = (temp: number) => {
    if (temp > 100) return 'text-destructive';
    if (temp > 95) return 'text-warning';
    return 'text-foreground';
  };

  const getFuelColor = (fuel: number) => {
    if (fuel < 20) return 'text-destructive';
    if (fuel < 40) return 'text-warning';
    return 'text-foreground';
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Fleet Vehicles</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Model</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <Gauge className="w-3.5 h-3.5" />
                  Speed
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <Fuel className="w-3.5 h-3.5" />
                  Fuel
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5" />
                  Temp
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-foreground">{vehicle.id}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-foreground">{vehicle.model}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={getStatusVariant(vehicle.status)} className="capitalize">
                    {vehicle.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-foreground">{Math.round(vehicle.speed)} km/h</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all',
                          vehicle.fuel > 40 ? 'bg-accent' : vehicle.fuel > 20 ? 'bg-warning' : 'bg-destructive'
                        )}
                        style={{ width: `${vehicle.fuel}%` }}
                      />
                    </div>
                    <span className={cn('text-sm', getFuelColor(vehicle.fuel))}>{Math.round(vehicle.fuel)}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={cn('text-sm font-medium', getTempColor(vehicle.temp))}>
                    {Math.round(vehicle.temp)}°C
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewVehicle?.(vehicle.id)}
                    className="gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VehicleTable;
