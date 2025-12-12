import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, X } from 'lucide-react';

export interface FilterState {
  search: string;
  status: 'all' | 'active' | 'idle' | 'maintenance';
  lowFuel: boolean;
  highTemp: boolean;
}

interface VehicleFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  vehicleCount: number;
  filteredCount: number;
}

const VehicleFilters = ({ filters, onFilterChange, vehicleCount, filteredCount }: VehicleFiltersProps) => {
  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = filters.search || filters.status !== 'all' || filters.lowFuel || filters.highTemp;

  const clearFilters = () => {
    onFilterChange({
      search: '',
      status: 'all',
      lowFuel: false,
      highTemp: false,
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by ID or model..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Status Filters */}
        <div className="flex gap-2 flex-wrap">
          {(['all', 'active', 'idle', 'maintenance'] as const).map((status) => (
            <Button
              key={status}
              variant={filters.status === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateFilter('status', status)}
              className="capitalize"
            >
              {status === 'all' ? 'All Status' : status}
            </Button>
          ))}
        </div>
      </div>

      {/* Alert Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Button
          variant={filters.lowFuel ? 'destructive' : 'outline'}
          size="sm"
          onClick={() => updateFilter('lowFuel', !filters.lowFuel)}
        >
          Low Fuel (&lt;20%)
        </Button>
        <Button
          variant={filters.highTemp ? 'destructive' : 'outline'}
          size="sm"
          onClick={() => updateFilter('highTemp', !filters.highTemp)}
        >
          High Temp (&gt;95°C)
        </Button>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
            <X className="w-3 h-3" />
            Clear Filters
          </Button>
        )}

        <div className="ml-auto">
          <Badge variant="secondary">
            Showing {filteredCount} of {vehicleCount}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default VehicleFilters;
