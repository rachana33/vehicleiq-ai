import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Vehicle {
  id: string;
  lat: number;
  lng: number;
  model: string;
  status: string;
  heading?: number;
}

interface FleetMapProps {
  vehicles: Vehicle[];
  selectedVehicleId?: string | null;
}

const FleetMap = ({ vehicles, selectedVehicleId }: FleetMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    mapInstanceRef.current = L.map(mapRef.current, {
      center: [37.7749, -122.4194],
      zoom: 12,
      zoomControl: false,
    });

    const darkTiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 20
    });

    const satelliteTiles = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri',
      maxZoom: 19
    });

    // Set default layer
    darkTiles.addTo(mapInstanceRef.current);

    // Add layer control
    const baseMaps = {
      "Cyber Dark": darkTiles,
      "Satellite": satelliteTiles
    };
    L.control.layers(baseMaps).addTo(mapInstanceRef.current);

    L.control.zoom({ position: 'topright' }).addTo(mapInstanceRef.current);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Store history for trails
  const [trails, setTrails] = useState<Record<string, [number, number][]>>({});

  useEffect(() => {
    setTrails((prev: Record<string, [number, number][]>) => {
      const newTrails = { ...prev };
      vehicles.forEach(v => {
        if (!newTrails[v.id]) newTrails[v.id] = [];
        const trail = newTrails[v.id];
        // Only add if position changed significantly to avoid clutter
        const lastPos = trail[trail.length - 1];
        if (!lastPos || lastPos[0] !== v.lat || lastPos[1] !== v.lng) {
          trail.push([v.lat, v.lng]);
          if (trail.length > 20) trail.shift(); // Keep last 20 points
        }
      });
      return newTrails;
    });
  }, [vehicles]);



  // Calculate cone vertices for "Vision" visualization
  const getConePath = (lat: number, lng: number, heading: number, distance: number = 0.003, fov: number = 60) => {
    const toRad = (d: number) => d * Math.PI / 180;

    // Simple lat/lng offset approximation
    // Lat scale is const, Lon scale depends on Lat
    const latScale = 1;
    const lonScale = 1 / Math.cos(toRad(lat));

    // Left Point
    const leftBearing = toRad(heading - fov / 2);
    const leftLat = lat + distance * Math.cos(leftBearing);
    const leftLng = lng + distance * Math.sin(leftBearing) * lonScale;

    // Right Point
    const rightBearing = toRad(heading + fov / 2);
    const rightLat = lat + distance * Math.cos(rightBearing);
    const rightLng = lng + distance * Math.sin(rightBearing) * lonScale;

    return [[lat, lng], [leftLat, leftLng], [rightLat, rightLng], [lat, lng]];
  };

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing layers
    mapInstanceRef.current.eachLayer((layer) => {
      // Remove markers and polylines, but keep the Base Layers/Tiles
      // We can identify base layers by checking if they are TileLayers? 
      // Safest is to remove specific types we added, or clear a LayerGroup. 
      // For now, removing marker/polygon/polyline is safe. 
      // IMPORTANT: Don't remove the TileLayer (which we add once in init)
      if (layer instanceof L.Marker || layer instanceof L.Polyline || layer instanceof L.Polygon) {
        layer.remove();
      }
    });


    // Draw trails
    Object.entries(trails).forEach(([_, path]) => {
      if ((path as [number, number][]).length > 1) {
        L.polyline(path as [number, number][], {
          color: '#00e5ff', // Neon cyan
          weight: 2,
          opacity: 0.3,
          dashArray: '5, 10',
          lineCap: 'round'
        }).addTo(mapInstanceRef.current!);
      }
    });

    // Add vehicle markers, Cones, and Ghost Trails
    vehicles.forEach((vehicle) => {
      // 0. Calculate Ghost/Predicted Position (5 seconds ahead)
      // Only for active vehicles with speed > 0
      if (vehicle.status === 'active' && (vehicle as any).speed > 0) {
        const speedMPS = ((vehicle as any).speed || 0) / 3.6; // km/h to m/s
        const predictionTime = 5; // seconds
        const distanceMeters = speedMPS * predictionTime;

        // Simple flat-earth approximation for short distances is fine
        // 1 deg lat = ~111111 meters
        const R = 6378137; // Earth Radius in meters
        const dLat = (distanceMeters * Math.cos((vehicle.heading || 0) * Math.PI / 180)) / R * (180 / Math.PI);
        const dLng = (distanceMeters * Math.sin((vehicle.heading || 0) * Math.PI / 180)) / (R * Math.cos(vehicle.lat * Math.PI / 180)) * (180 / Math.PI);

        const predictedLat = vehicle.lat + dLat;
        const predictedLng = vehicle.lng + dLng;

        // Draw Prediction Line
        L.polyline([[vehicle.lat, vehicle.lng], [predictedLat, predictedLng]], {
          color: '#d500f9', // Neon Purple for prediction
          weight: 1,
          opacity: 0.6,
          dashArray: '4, 8'
        }).addTo(mapInstanceRef.current!);

        // Draw Ghost Marker
        const ghostIcon = L.divIcon({
          className: 'ghost-marker',
          html: `
              <div style="transform: rotate(${vehicle.heading || 0}deg); opacity: 0.4;">
                <div class="w-8 h-8 rounded-full border-2 border-dashed border-[#d500f9] flex items-center justify-center">
                  <div class="w-1 h-1 bg-[#d500f9] rounded-full"></div>
                </div>
              </div>
            `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        L.marker([predictedLat, predictedLng], { icon: ghostIcon, interactive: false }).addTo(mapInstanceRef.current!);
      }

      // 1. Draw Vision Cone (LiDAR Field of View)
      // Only draw if active moving or just for style? Let's do all.
      const conePath = getConePath(vehicle.lat, vehicle.lng, vehicle.heading || 0);
      L.polygon(conePath as L.LatLngExpression[], {
        color: '#00e5ff',
        weight: 1,
        fillColor: '#00e5ff',
        fillOpacity: 0.1,
        dashArray: '2, 4'
      }).addTo(mapInstanceRef.current!);


      // 2. Draw Rotated Marker
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div class="relative transition-all duration-300 ease-linear" style="transform: rotate(${vehicle.heading || 0}deg)">
            <div class="w-8 h-8 rounded-full bg-primary/90 flex items-center justify-center shadow-lg border-2 border-primary-foreground">
              <!-- Arrow Icon pointing UP (North) which aligns with 0 deg rotation -->
              <svg class="w-5 h-5 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
              </svg>
            </div>
            ${vehicle.status === 'active' ? '<div class="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-accent rounded-full animate-pulse shadow-[0_0_10px_#00e5ff]"></div>' : ''}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16], // Center anchor for rotation
      });


      const marker = L.marker([vehicle.lat, vehicle.lng], { icon })
        .addTo(mapInstanceRef.current!)
        .bindPopup(`
          <div class="p-2 min-w-[120px]">
            <div class="flex items-center justify-between mb-2">
                <p class="font-bold text-lg">${vehicle.id}</p>
                <div class="px-2 py-0.5 text-[10px] rounded-full bg-accent text-accent-foreground font-mono">
                 ${Math.round(vehicle.heading || 0)}°
                </div>
            </div>
            <p class="text-xs text-muted-foreground mb-1">${vehicle.model}</p>
            <div class="flex gap-1 mt-2">
                <span class="w-2 h-2 rounded-full ${vehicle.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}"></span>
                <span class="text-xs capitalize">${vehicle.status}</span>
            </div>
          </div>
        `);

      // Add simple tooltip
      marker.bindTooltip(
        `<div class="font-mono text-xs">${vehicle.id}</div>`,
        {
          permanent: false,
          direction: 'bottom',
          offset: [0, 20],
          className: 'custom-tooltip'
        }
      );
    });
  }, [vehicles, trails]);

  // Fly to selected vehicle
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedVehicleId) return;

    const vehicle = vehicles.find(v => v.id === selectedVehicleId);
    if (vehicle) {
      mapInstanceRef.current.flyTo([vehicle.lat, vehicle.lng], 15, {
        animate: true,
        duration: 1.5
      });
    }
  }, [selectedVehicleId, vehicles]);


  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden" style={{ minHeight: '400px' }}>
      <div ref={mapRef} className="absolute inset-0" style={{ height: '100%', width: '100%' }} />
      <style>{`
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
        .ghost-marker {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-popup-content-wrapper {
          background: hsl(var(--card));
          color: hsl(var(--card-foreground));
          border-radius: 0.5rem;
          border: 1px solid hsl(var(--border));
        }
        .leaflet-popup-tip {
          background: hsl(var(--card));
        }
        .leaflet-control-zoom {
          border: none !important;
          overflow: hidden;
          border-radius: 0.5rem;
        }
        .leaflet-control-zoom a {
          background: hsl(var(--card)) !important;
          color: hsl(var(--card-foreground)) !important;
          border-color: hsl(var(--border)) !important;
        }
        .leaflet-control-zoom a:hover {
          background: hsl(var(--muted)) !important;
        }
        .custom-tooltip {
          background: hsl(var(--card)) !important;
          border: 1px solid hsl(var(--border)) !important;
          color: hsl(var(--card-foreground)) !important;
          border-radius: 4px !important;
          padding: 4px 8px !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
          font-family: inherit !important;
        }
        .custom-tooltip::before {
          border-top-color: hsl(var(--border)) !important;
        }
      `}</style>
    </div>

  );
};

export default FleetMap;
