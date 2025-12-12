import { Car, Bell, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="bg-sidebar border-b border-sidebar-border px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary">
            <Car className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">VehicleIQ AI</h1>
            <p className="text-xs text-sidebar-foreground/60">Fleet Management System</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent">
            <Bell className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent">
            <Settings className="w-5 h-5" />
          </Button>
          <div className="w-px h-6 bg-sidebar-border mx-2" />
          <Button variant="ghost" size="icon" className="rounded-full bg-sidebar-accent">
            <User className="w-5 h-5 text-sidebar-accent-foreground" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
