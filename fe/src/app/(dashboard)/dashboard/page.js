'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { api } from '@/services/api';
import { Sun, Lightbulb, Settings2, Zap, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function Dashboard() {
  const [data, setData] = useState({
    logs: { value: 0 },
    status: 'OFF',
    config: { threshold: 0, mode: 'manual' },
    lastReading: null,
    updatedBy: '-'
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const result = await api.get('/web/status');
      if (result.data) {
          // Map backend structure to local state structure
          // backend: { latestSensorData: { lightValue, lampStatus ... }, currentConfig: { threshold, manualMode ... } }
          const { latestSensorData, currentConfig } = result.data;
          
          setData({
            logs: { value: latestSensorData?.lightValue || 0, timestamp: latestSensorData?.createdAt },
            status: latestSensorData?.lampStatus ? 'ON' : 'OFF',
            config: { 
                threshold: currentConfig?.threshold || 0, 
                mode: currentConfig?.manualMode ? 'manual' : 'automatic',
                updatedBy: currentConfig?.User?.username || currentConfig?.updatedBy || '-'
            },
            lastReading: latestSensorData
          });
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // 10s auto refresh
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1,2,3,4].map(i => <div key={i} className="h-40 bg-slate-200 rounded-2xl"></div>)}
        </div>
    );
  }

  return (
    <div className="space-y-8 fade-in">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="font-display text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    Dashboard
                </h1>
                <p className="text-slate-500 mt-1">Real-time System Overview</p>
            </div>
            <Button variant="secondary" onClick={handleRefresh} isLoading={refreshing} size="sm">
                <RefreshCcw className="mr-2 h-4 w-4" /> Refresh
            </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Light Intensity */}
            <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Sun className="h-24 w-24 text-amber-500" />
                </div>
                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-xl bg-amber-100 text-amber-600">
                            <Sun className="h-6 w-6" />
                        </div>
                        <h3 className="font-semibold text-slate-700">Light Intensity</h3>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-slate-800 tracking-tight">
                            {data.logs?.value || 0}
                        </div>
                        <p className="text-sm text-slate-500 mt-1">Current Lux Value</p>
                    </div>
                </div>
            </Card>

            {/* Lamp Status */}
            <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Lightbulb className={`h-24 w-24 ${data.status === 'ON' ? 'text-emerald-500' : 'text-slate-500'}`} />
                </div>
                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`p-3 rounded-xl ${data.status === 'ON' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                            <Lightbulb className="h-6 w-6" />
                        </div>
                        <h3 className="font-semibold text-slate-700">Lamp Status</h3>
                    </div>
                    <div>
                        <div className={`text-4xl font-bold tracking-tight ${data.status === 'ON' ? 'text-emerald-600' : 'text-slate-500'}`}>
                            {data.status}
                        </div>
                        <p className="text-sm text-slate-500 mt-1">Current State</p>
                    </div>
                </div>
            </Card>

            {/* Threshold */}
             <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Settings2 className="h-24 w-24 text-indigo-500" />
                </div>
                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-xl bg-indigo-100 text-indigo-600">
                            <Settings2 className="h-6 w-6" />
                        </div>
                        <h3 className="font-semibold text-slate-700">Threshold</h3>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-slate-800 tracking-tight">
                            {data.config?.threshold || 0}
                        </div>
                        <p className="text-sm text-slate-500 mt-1">Trigger Value</p>
                    </div>
                </div>
            </Card>
        </div>

        {/* Mode & Status Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Card className="flex items-center justify-between group hover:shadow-lg transition-all">
                <div className="flex items-center gap-4">
                     <div className="p-4 rounded-xl bg-violet-100 text-violet-600">
                        <Zap className="h-8 w-8" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Operating Mode</h3>
                        <p className="text-slate-500 text-sm">System Control Strategy</p>
                    </div>
                </div>
                <div className="px-6 py-2 rounded-full bg-violet-50 text-violet-700 font-bold uppercase tracking-wider text-sm border border-violet-100">
                    {data.config?.mode || 'Unknown'}
                </div>
             </Card>

             <Card className="bg-slate-900 text-white glass-panel border-slate-800"> 
                 {/* Dark card for contrast */}
                 <div className="flex flex-col h-full justify-center">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400 text-sm font-medium uppercase tracking-wider">Last Reading</span>
                        <span className="text-xs text-slate-500">
                            {data.logs?.timestamp ? new Date(data.logs.timestamp).toLocaleString() : '-'}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                         <span className="text-slate-400 text-sm font-medium uppercase tracking-wider">Config Updated By</span>
                         <span className="text-xs text-emerald-400 font-mono">
                            {data.config?.updatedBy || '-'}
                         </span>
                    </div>
                 </div>
             </Card>
        </div>
    </div>
  );
}
