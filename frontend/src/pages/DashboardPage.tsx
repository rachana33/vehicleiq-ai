import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Car, Gauge, Fuel, Thermometer } from 'lucide-react';
import Header from '@/components/dashboard/Header';
import FleetMap from '@/components/dashboard/FleetMap';
import StatCard from '@/components/dashboard/StatCard';
import VehicleTable from '@/components/dashboard/VehicleTable';
import VehicleFilters, { type FilterState } from '@/components/dashboard/VehicleFilters';
import AlertPanel from '@/components/dashboard/AlertPanel';
import TelemetryChart from '@/components/dashboard/TelemetryChart';
import AIAssistant from '@/components/dashboard/AIAssistant';
import type { RootState } from '../store/store';
import { setSelectedVehicle } from '../store/vehicleSlice';
import { vehicleApi } from '@/services/api';
import type { Telemetry } from '@/types';
import VehicleDetailModal from '@/components/dashboard/VehicleDetailModal';
import { CommandCenter } from '@/components/dashboard/CommandCenter';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { vehicles, telemetryData, selectedVehicleId } = useSelector((state: RootState) => state.vehicles);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: 'all',
    lowFuel: false,
    highTemp: false,
  });

  // Merge static vehicle data with real-time telemetry
  const mergedVehicles = useMemo(() => {
    return vehicles.map(v => {
      const telemetry = telemetryData[v.vehicle_id];
      return {
        id: v.vehicle_id,
        model: `${v.make} ${v.model}`,
        status: v.status as 'active' | 'idle' | 'maintenance',
        lat: telemetry?.latitude || 37.7749,
        lng: telemetry?.longitude || -122.4194,
        speed: telemetry?.speed || 0,
        fuel: telemetry?.fuel_level || 0,
        temp: telemetry?.engine_temp || 0,
      };
    });
  }, [vehicles, telemetryData]);

  // Generate alerts from real data
  const alerts = useMemo(() => {
    const alertList: Array<{
      id: string;
      type: 'temperature' | 'fuel' | 'maintenance' | 'general';
      vehicleId: string;
      message: string;
      value: string;
      timestamp: Date;
      acknowledged: boolean;
    }> = [];

    mergedVehicles.forEach((v) => {
      if (v.temp > 100) {
        alertList.push({
          id: `temp-${v.id}`,
          type: 'temperature',
          vehicleId: v.id,
          message: 'Critical Temperature',
          value: `Engine temp is ${v.temp.toFixed(0)}°C`,
          timestamp: new Date(),
          acknowledged: false,
        });
      } else if (v.temp > 95) {
        alertList.push({
          id: `temp-${v.id}`,
          type: 'temperature',
          vehicleId: v.id,
          message: 'High Temperature',
          value: `Engine temp is ${v.temp.toFixed(0)}°C`,
          timestamp: new Date(),
          acknowledged: false,
        });
      }
      if (v.fuel < 20) {
        alertList.push({
          id: `fuel-${v.id}`,
          type: 'fuel',
          vehicleId: v.id,
          message: 'Low Fuel Warning',
          value: `Fuel level at ${v.fuel.toFixed(0)}%`,
          timestamp: new Date(),
          acknowledged: false,
        });
      }
      // Mock Battery Alert
      if (parseInt(v.id.split('-')[1]) % 3 === 0) {
        alertList.push({
          id: `batt-${v.id}`,
          type: 'general',
          vehicleId: v.id,
          message: 'Low Battery Voltage',
          value: '11.2V',
          timestamp: new Date(),
          acknowledged: false,
        });
      }
      // Mock Tire Pressure Alert
      if (parseInt(v.id.split('-')[1]) % 4 === 0) {
        alertList.push({
          id: `tire-${v.id}`,
          type: 'maintenance',
          vehicleId: v.id,
          message: 'Low Tire Pressure',
          value: '28 PSI (FL)',
          timestamp: new Date(),
          acknowledged: false,
        });
      }
      // Mock Maintenance Alert
      if (v.id === 'VEH-002' || v.id === 'VEH-009') {
        alertList.push({
          id: `maint-${v.id}`,
          type: 'maintenance',
          vehicleId: v.id,
          message: 'Scheduled Maintenance',
          value: 'Oil Change Due',
          timestamp: new Date(),
          acknowledged: false,
        });
      }
    });

    return alertList;
  }, [mergedVehicles]);

  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<Set<string>>(new Set());

  const handleAcknowledge = (id: string) => {
    setAcknowledgedAlerts((prev) => new Set([...prev, id]));
  };

  const displayAlerts = alerts.map((a) => ({
    ...a,
    acknowledged: acknowledgedAlerts.has(a.id),
  }));

  // Filter vehicles
  const filteredVehicles = useMemo(() => {
    return mergedVehicles.filter((v) => {
      // Search filter
      if (filters.search) {
        const search = filters.search.toLowerCase();
        if (!v.id.toLowerCase().includes(search) && !v.model.toLowerCase().includes(search)) {
          return false;
        }
      }
      // Status filter
      if (filters.status !== 'all' && v.status !== filters.status) {
        return false;
      }
      // Low fuel filter
      if (filters.lowFuel && v.fuel >= 20) {
        return false;
      }
      // High temp filter
      if (filters.highTemp && v.temp <= 95) {
        return false;
      }
      return true;
    });
  }, [mergedVehicles, filters]);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleViewVehicle = (id: string) => {
    dispatch(setSelectedVehicle(id));
    setIsDetailModalOpen(true);
  };

  const activeVehicles = mergedVehicles.filter((v) => v.status === 'active').length;
  const avgSpeed = mergedVehicles.length > 0
    ? Math.round(mergedVehicles.reduce((acc, v) => acc + v.speed, 0) / mergedVehicles.length * 10) / 10
    : 0;
  const lowFuelVehicles = mergedVehicles.filter((v) => v.fuel < 20).length;
  const highTempVehicles = mergedVehicles.filter((v) => v.temp > 95).length;

  // Mock historical data for the chart for now, or fetch real history
  // Fetch real historical data
  const [history, setHistory] = useState<any[]>([]);

  // useEffect to fetch history when selected vehicle changes
  useEffect(() => {
    if (selectedVehicleId) {
      vehicleApi.getHistory(selectedVehicleId)
        .then(res => {
          // Assuming API returns array of Telemetry
          const formatted = res.data.map((t: Telemetry) => ({
            time: new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            speed: t.speed,
            temp: t.engine_temp
          }));
          // Reverse if needed, or sort. Usually history is newest first or oldest first. 
          // Let's assume we want time ascending.
          setHistory(formatted);
        })
        .catch(console.error);
    } else {
      setHistory([]);
    }
  }, [selectedVehicleId]);

  const chartData = history;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="p-6">
        {/* Top Section: Map + Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          {/* Map */}
          <div className="lg:col-span-3 h-[400px] rounded-lg overflow-hidden border border-border">
            <FleetMap
              vehicles={mergedVehicles}
              selectedVehicleId={selectedVehicleId}
            />
          </div>

          {/* Stats */}
          <div className="space-y-4">
            <StatCard
              title="Fleet Status"
              value={`${activeVehicles}/${mergedVehicles.length}`}
              subtitle="Active vehicles on road"
              icon={Car}
              variant="accent"
            />
            <StatCard
              title="Avg Speed"
              value={`${avgSpeed}`}
              subtitle="km/h fleet average"
              icon={Gauge}
            />
            <StatCard
              title="Low Fuel"
              value={lowFuelVehicles}
              subtitle="Vehicles < 20%"
              icon={Fuel}
              variant={lowFuelVehicles > 0 ? 'warning' : 'default'}
            />
            <StatCard
              title="High Temp"
              value={highTempVehicles}
              subtitle="Vehicles > 95°C"
              icon={Thermometer}
              variant={highTempVehicles > 0 ? 'destructive' : 'default'}
            />
          </div>
        </div>

        {/* Middle Section: Vehicle Table + Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 space-y-4">
            <VehicleFilters
              filters={filters}
              onFilterChange={setFilters}
              vehicleCount={mergedVehicles.length}
              filteredCount={filteredVehicles.length}
            />
            <VehicleTable vehicles={filteredVehicles} onViewVehicle={handleViewVehicle} />
          </div>
          <div className="relative h-[500px] lg:h-auto">
            <div className="lg:absolute lg:inset-0">
              <AlertPanel alerts={displayAlerts} onAcknowledge={handleAcknowledge} />
            </div>
          </div>
        </div>

        {/* Bottom Section: Telemetry + AI Assistant */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TelemetryChart
              data={chartData}
              selectedVehicle={selectedVehicleId || ''}
              vehicles={mergedVehicles.map((v) => v.id)}
              onVehicleChange={(id) => dispatch(setSelectedVehicle(id))}
            />
          </div>
          <div className="relative h-[500px] lg:h-auto">
            <div className="lg:absolute lg:inset-0">
              <AIAssistant />
            </div>
          </div>
        </div>
      </main>

      <CommandCenter
        vehicles={mergedVehicles}
        onSelectVehicle={handleViewVehicle}
      />

      <VehicleDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        vehicle={mergedVehicles.find(v => v.id === selectedVehicleId)}
        alerts={alerts.filter(a => a.vehicleId === selectedVehicleId)}
      />
    </div>
  );
};

export default DashboardPage;
