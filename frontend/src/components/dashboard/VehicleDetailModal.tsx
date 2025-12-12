
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Gauge, Fuel, Thermometer, AlertTriangle, Activity, Video, Maximize } from "lucide-react";
import { cn } from "@/lib/utils";

interface Alert {
  id: string;
  type: string;
  message: string;
  value: string;
  timestamp: Date;
  acknowledged: boolean;
}

interface Vehicle {
  id: string;
  model: string;
  status: string;
  speed: number;
  fuel: number;
  temp: number;
  // Sensors
  lidar_active?: boolean;
  radar_objects?: number;
  camera_status?: 'ok' | 'warning' | 'error';
  emergency_braking?: boolean;
}

interface VehicleDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle | undefined;
  alerts: Alert[];
}
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VehicleSchematic } from "./VehicleSchematic";


const VehicleDetailModal = ({
  isOpen,
  onClose,
  vehicle,
  alerts,
}: VehicleDetailModalProps) => {
  if (!vehicle) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-card border-border">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              {vehicle.model}
              <Badge variant="outline" className="ml-2">
                {vehicle.id}
              </Badge>
            </DialogTitle>
            <div className="flex gap-2">
              {vehicle.lidar_active && <Badge variant="outline" className="animate-pulse bg-green-500/10 text-green-500 border-green-500/50">LIVE DATA</Badge>}
              <Badge
                variant={
                  vehicle.status === "active"
                    ? "default"
                    : vehicle.status === "maintenance"
                      ? "destructive"
                      : "secondary"
                }
              >
                {vehicle.status.toUpperCase()}
              </Badge>
            </div>
          </div>
          <DialogDescription>
            Real-time telemetry and optical feeds.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Diagnostics</TabsTrigger>
            <TabsTrigger value="video" className="group">
              <Video className="w-4 h-4 mr-2 group-data-[state=active]:text-red-500" />
              Live Feed
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 pt-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-muted/20 p-3 rounded-lg border border-border flex flex-col items-center">
                <Gauge className="w-5 h-5 text-primary mb-1" />
                <span className="text-2xl font-bold">{Math.round(vehicle.speed)}</span>
                <span className="text-xs text-muted-foreground">km/h</span>
              </div>
              <div className="bg-muted/20 p-3 rounded-lg border border-border flex flex-col items-center">
                <Fuel className="w-5 h-5 text-warning mb-1" />
                <span className="text-2xl font-bold">{Math.round(vehicle.fuel)}%</span>
                <span className="text-xs text-muted-foreground">Fuel Level</span>
              </div>
              <div className="bg-muted/20 p-3 rounded-lg border border-border flex flex-col items-center">
                <Thermometer className="w-5 h-5 text-destructive mb-1" />
                <span className="text-2xl font-bold">{Math.round(vehicle.temp)}°C</span>
                <span className="text-xs text-muted-foreground">Engine Temp</span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Component Inspector
              </h4>
              <VehicleSchematic vehicle={vehicle} />
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Active Alerts ({alerts.length})
              </h4>
              <ScrollArea className="h-[150px] w-full rounded-md border border-border bg-muted/10 p-4">
                {alerts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <p>No active alerts for this vehicle.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className="flex items-start justify-between p-3 rounded-lg bg-card border border-border"
                      >
                        <div>
                          <h5 className="font-semibold text-sm">{alert.message}</h5>
                          <p className="text-xs text-muted-foreground">
                            {alert.value} • {alert.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                        {!alert.acknowledged && (
                          <Badge variant="destructive" className="text-[10px] h-5">
                            NEW
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="video" className="pt-4 h-[400px]">
            <div className="relative w-full h-full rounded-lg overflow-hidden border border-border bg-black group">
              {/* Simulated Feed Source - A Generic Highway Loop */}
              {/* Using a reliable placeholder video */}
              <div className="w-full h-full bg-black relative overflow-hidden">
                {/* Perspective Grid - Synthetic Terrain */}
                <div className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(0, 255, 255, .3) 25%, rgba(0, 255, 255, .3) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, .3) 75%, rgba(0, 255, 255, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0, 255, 255, .3) 25%, rgba(0, 255, 255, .3) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, .3) 75%, rgba(0, 255, 255, .3) 76%, transparent 77%, transparent)',
                    backgroundSize: '50px 50px',
                    transform: 'perspective(500px) rotateX(60deg) translateY(0)',
                    animation: 'grid-move 2s linear infinite'
                  }}>
                </div>

                {/* Radar Sweep Animation */}
                <div className="absolute inset-0 bg-gradient-to-t from-green-500/20 to-transparent w-full h-[50%] top-0 animate-[scan_3s_linear_infinite] border-b-2 border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.5)]"></div>

                {/* Simulated Objects (Cubes) */}
                <div className="absolute top-1/2 left-1/3 w-8 h-8 border border-green-400 bg-green-500/20 animate-pulse"></div>
                <div className="absolute top-1/3 right-1/4 w-12 h-12 border border-red-500 bg-red-500/20 animate-[pulse_1.5s_infinite]"></div>

                {/* Center Target */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 border border-white/10 rounded-full flex items-center justify-center">
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                  </div>
                </div>

                <style>{`
                     @keyframes grid-move {
                       0% { transform: perspective(500px) rotateX(60deg) translateY(0); }
                       100% { transform: perspective(500px) rotateX(60deg) translateY(50px); }
                     }
                     @keyframes scan {
                       0% { top: -50%; opacity: 0; }
                       50% { opacity: 1; }
                       100% { top: 100%; opacity: 0; }
                     }
                   `}</style>
              </div>

              {/* HUD Overlay */}
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge variant="secondary" className="bg-black/50 border-white/20 text-white font-mono backdrop-blur-sm">
                  CAM-01 FRONT
                </Badge>
                <Badge variant="secondary" className="bg-black/50 border-white/20 text-white font-mono backdrop-blur-sm">
                  1080p
                </Badge>
              </div>

              <div className="absolute top-4 right-4 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-[pulse_1s_ease-in-out_infinite]"></div>
                <span className="font-mono font-bold text-red-500 text-sm tracking-widest">REC</span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <div className="font-mono text-xs text-green-400">
                  <div>LIDAR: ACTIVE</div>
                  <div>V2X: CONNECTED</div>
                  <div>LAT: {vehicle.speed > 0 ? "37.7749 N" : "---"}</div>
                </div>
                <div className="font-mono text-lg text-white/90 font-bold tabular-nums">
                  {new Date().toLocaleTimeString()}
                </div>
              </div>

              {/* Central Crosshair */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <Maximize className="w-12 h-12 text-white/50" />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleDetailModal;
