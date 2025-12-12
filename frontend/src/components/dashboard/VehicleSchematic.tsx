import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Zap, Disc, Activity, Thermometer, Wifi } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VehicleSchematicProps {
    vehicle: any; // Using any for flexibility with simulation data
}

export function VehicleSchematic({ vehicle }: VehicleSchematicProps) {
    const [activePart, setActivePart] = useState<string | null>(null);

    // Determine system health based on alerts or random simulation
    const getSystemStatus = (system: string) => {
        // In a real app, check specific vehicle alerts
        // For demo, we simulate occasional warnings
        if (system === 'brakes' && Math.random() > 0.9) return 'warning';
        if (system === 'battery' && (vehicle.fuel < 20)) return 'critical';
        return 'healthy';
    };

    const systems = [
        { id: 'engine', name: 'Powertrain', icon: Zap, x: 50, y: 25, status: getSystemStatus('engine') },
        { id: 'brakes_front', name: 'Front Brakes', icon: Disc, x: 25, y: 20, status: getSystemStatus('brakes') },
        { id: 'brakes_rear', name: 'Rear Brakes', icon: Disc, x: 75, y: 20, status: 'healthy' },
        { id: 'battery', name: 'HV Battery', icon: Activity, x: 50, y: 60, status: getSystemStatus('battery') },
        { id: 'sensors', name: 'Sensor Array', icon: Wifi, x: 50, y: 10, status: 'healthy' },
        { id: 'thermal', name: 'Cooling', icon: Thermometer, x: 50, y: 40, status: 'healthy' },
    ];

    return (
        <div className="relative w-full aspect-[4/3] bg-black/40 rounded-lg border border-white/10 overflow-hidden group">
            {/* Grid Background */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: 'radial-gradient(circle, #00e5ff 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}
            />

            {/* Car Hull (CSS-only Wireframe representation) */}
            <div className="absolute inset-0 flex items-center justify-center">
                {/* Simple Top-Down Car Shape */}
                <div className="relative w-[180px] h-[300px] border-2 border-white/20 rounded-[40px] shadow-[0_0_50px_rgba(0,229,255,0.1)] transition-all duration-500 hover:shadow-[0_0_80px_rgba(0,229,255,0.2)]">
                    {/* Cab */}
                    <div className="absolute top-[80px] left-[10px] right-[10px] bottom-[60px] border border-white/10 rounded-[30px] bg-white/5"></div>

                    {/* Wheels */}
                    <div className="absolute top-[40px] -left-[10px] w-[10px] h-[40px] bg-white/20 rounded-l"></div>
                    <div className="absolute top-[40px] -right-[10px] w-[10px] h-[40px] bg-white/20 rounded-r"></div>
                    <div className="absolute bottom-[40px] -left-[10px] w-[10px] h-[40px] bg-white/20 rounded-l"></div>
                    <div className="absolute bottom-[40px] -right-[10px] w-[10px] h-[40px] bg-white/20 rounded-r"></div>

                    {/* Headlights */}
                    <div className="absolute top-[10px] left-[20px] w-[20px] h-[10px] bg-cyan-500/50 blur-sm rounded-full"></div>
                    <div className="absolute top-[10px] right-[20px] w-[20px] h-[10px] bg-cyan-500/50 blur-sm rounded-full"></div>
                </div>
            </div>

            {/* Interactive Hotspots */}
            <TooltipProvider delayDuration={0}>
                {systems.map((sys) => (
                    <Tooltip key={sys.id}>
                        <TooltipTrigger asChild>
                            <button
                                className={cn(
                                    "absolute w-10 h-10 -ml-5 -mt-5 rounded-full flex items-center justify-center transition-all duration-300 z-10",
                                    "hover:scale-125 focus:outline-none",
                                    activePart === sys.id ? "scale-125 bg-black/80 border-2 border-white" : "bg-black/40 border border-white/20",
                                    sys.status === 'critical' ? "shadow-[0_0_20px_#ef4444] border-red-500" :
                                        sys.status === 'warning' ? "shadow-[0_0_15px_#eab308] border-yellow-500" :
                                            "hover:bg-cyan-500/20 hover:border-cyan-400 shadow-[0_0_10px_rgba(0,229,255,0.3)]"
                                )}
                                style={{ left: `${sys.x}%`, top: `${sys.y}%` }}
                                onMouseEnter={() => setActivePart(sys.id)}
                                onMouseLeave={() => setActivePart(null)}
                            >
                                <sys.icon className={cn(
                                    "w-5 h-5",
                                    sys.status === 'critical' ? "text-red-500 animate-pulse" :
                                        sys.status === 'warning' ? "text-yellow-500" :
                                            "text-cyan-400"
                                )} />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="bg-black/90 border-white/20 text-white p-3 backdrop-blur-xl">
                            <div className="space-y-1">
                                <div className="font-bold flex items-center gap-2">
                                    {sys.name}
                                    <Badge variant={sys.status === 'healthy' ? 'outline' : 'destructive'} className="text-[10px] h-5">
                                        {sys.status.toUpperCase()}
                                    </Badge>
                                </div>
                                <div className="text-xs text-muted-foreground w-[150px]">
                                    {sys.id === 'engine' ? `Temp: ${vehicle.temp.toFixed(1)}°C | RPM: ${(vehicle.speed * 80).toFixed(0)}` :
                                        sys.id === 'battery' ? `Voltage: 400V | Charge: ${vehicle.fuel}%` :
                                            sys.id === 'sensors' ? 'All LiDAR/Radar nodes online' :
                                                'System functioning within normal parameters.'}
                                </div>
                            </div>
                        </TooltipContent>
                    </Tooltip>
                ))}
            </TooltipProvider>

            {/* Scanner Effect */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent h-[20%] w-full animate-[scan_4s_ease-in-out_infinite]" />

            <div className="absolute bottom-4 left-4 right-4 flex justify-between text-[10px] font-mono text-cyan-500/50">
                <span>CHASSIS: {vehicle.model.toUpperCase()}</span>
                <span>ID: {vehicle.id}</span>
            </div>
        </div>
    );
}
