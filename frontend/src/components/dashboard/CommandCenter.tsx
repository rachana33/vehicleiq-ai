import * as React from "react";
import {
    CreditCard,
    Settings,
    User,
    Truck,
    Video,
    Layers,
    Activity
} from "lucide-react";

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command";

interface Vehicle {
    id: string;
    model: string;
    status: 'active' | 'idle' | 'maintenance';
}

interface CommandCenterProps {
    vehicles: Vehicle[];
    onSelectVehicle: (id: string) => void;
}

export function CommandCenter({ vehicles, onSelectVehicle }: CommandCenterProps) {
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    return (
        <>
            <div
                onClick={() => setOpen(true)}
                className="fixed bottom-4 right-4 z-[100] flex items-center gap-2 text-muted-foreground text-xs bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10 hidden md:flex cursor-pointer hover:bg-black/70 transition-colors"
            >
                <span>Press</span>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">⌘</span>K
                </kbd>
                <span>for Global Command</span>
            </div>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type a command or search vehicles..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Vehicles">
                        {vehicles.map((vehicle) => (
                            <CommandItem
                                key={vehicle.id}
                                onSelect={() => {
                                    onSelectVehicle(vehicle.id);
                                    setOpen(false);
                                }}
                            >
                                <Truck className="mr-2 h-4 w-4" />
                                <span>{vehicle.id} - {vehicle.model}</span>
                                <CommandShortcut>{vehicle.status}</CommandShortcut>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="System Controls">
                        <CommandItem>
                            <Layers className="mr-2 h-4 w-4" />
                            <span>Toggle Satellite View</span>
                        </CommandItem>
                        <CommandItem>
                            <Video className="mr-2 h-4 w-4" />
                            <span>Open Security Feed</span>
                        </CommandItem>
                        <CommandItem>
                            <Activity className="mr-2 h-4 w-4" />
                            <span>System Diagnostics</span>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Settings">
                        <CommandItem>
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                            <CommandShortcut>⌘P</CommandShortcut>
                        </CommandItem>
                        <CommandItem>
                            <CreditCard className="mr-2 h-4 w-4" />
                            <span>Billing</span>
                            <CommandShortcut>⌘B</CommandShortcut>
                        </CommandItem>
                        <CommandItem>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                            <CommandShortcut>⌘S</CommandShortcut>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    );
}
