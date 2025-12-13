import { useEffect, useState } from 'react';
import { Loader2, Server, CheckCircle2, AlertCircle } from 'lucide-react';

interface BackendSyncPopupProps {
    isVisible: boolean;
    status: 'connecting' | 'syncing' | 'ready' | 'error';
    message?: string;
}

const BackendSyncPopup = ({ isVisible, status, message }: BackendSyncPopupProps) => {
    const [dots, setDots] = useState('');

    useEffect(() => {
        if (status === 'connecting' || status === 'syncing') {
            const interval = setInterval(() => {
                setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
            }, 500);
            return () => clearInterval(interval);
        }
    }, [status]);

    if (!isVisible) return null;

    const getStatusConfig = () => {
        switch (status) {
            case 'connecting':
                return {
                    icon: <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />,
                    title: 'Connecting to Backend',
                    subtitle: `Establishing connection${dots}`,
                    bgGradient: 'from-blue-500/20 to-purple-500/20',
                    borderColor: 'border-blue-500/30',
                };
            case 'syncing':
                return {
                    icon: <Server className="w-12 h-12 text-purple-400 animate-pulse" />,
                    title: 'Backend Syncing',
                    subtitle: `Initializing services${dots}`,
                    bgGradient: 'from-purple-500/20 to-pink-500/20',
                    borderColor: 'border-purple-500/30',
                };
            case 'ready':
                return {
                    icon: <CheckCircle2 className="w-12 h-12 text-green-400" />,
                    title: 'Ready!',
                    subtitle: 'All systems operational',
                    bgGradient: 'from-green-500/20 to-emerald-500/20',
                    borderColor: 'border-green-500/30',
                };
            case 'error':
                return {
                    icon: <AlertCircle className="w-12 h-12 text-red-400" />,
                    title: 'Connection Error',
                    subtitle: message || 'Unable to connect to backend',
                    bgGradient: 'from-red-500/20 to-orange-500/20',
                    borderColor: 'border-red-500/30',
                };
        }
    };

    const config = getStatusConfig();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div
                className={`
          relative overflow-hidden rounded-2xl border ${config.borderColor}
          bg-gradient-to-br ${config.bgGradient}
          backdrop-blur-xl shadow-2xl
          p-8 max-w-md w-full mx-4
          animate-in zoom-in-95 duration-500
        `}
            >
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" />

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                    {/* Icon */}
                    <div className="relative">
                        {config.icon}
                        {(status === 'connecting' || status === 'syncing') && (
                            <div className="absolute inset-0 animate-ping opacity-20">
                                <div className="w-12 h-12 rounded-full bg-current" />
                            </div>
                        )}
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                        {config.title}
                    </h2>

                    {/* Subtitle */}
                    <p className="text-gray-300 text-sm">
                        {config.subtitle}
                    </p>

                    {/* Progress bar for loading states */}
                    {(status === 'connecting' || status === 'syncing') && (
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-4">
                            <div className="h-full bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse"
                                style={{ width: status === 'connecting' ? '40%' : '70%' }} />
                        </div>
                    )}

                    {/* Additional info for error state */}
                    {status === 'error' && (
                        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <p className="text-xs text-red-200">
                                The backend service may still be starting up on Render's free tier.
                                This can take 30-60 seconds. Please wait...
                            </p>
                        </div>
                    )}
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl -translate-y-16 translate-x-16" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-2xl translate-y-12 -translate-x-12" />
            </div>
        </div>
    );
};

export default BackendSyncPopup;
