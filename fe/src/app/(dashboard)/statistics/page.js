'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { api } from '@/services/api';
import { 
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
    LineChart, Line, XAxis, YAxis, CartesianGrid, Area, AreaChart
} from 'recharts';
import { Activity, ArrowUp, ArrowDown, Minus, Sun } from 'lucide-react';

const COLORS = ['#10b981', '#64748b']; // Emerald for ON, Slate for OFF

export default function StatisticsPage() {
  const [stats, setStats] = useState({
    totalLogs: 0,
    lampOnCount: 0,
    lampOffCount: 0,
    avgLightValue: 0,
    maxLightValue: 0,
    minLightValue: 0
  });
  const [chartData, setChartData] = useState([]);
  const [period, setPeriod] = useState('24h');
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(true);

  const fetchStats = async (showLoading = false) => {
      if (showLoading) setLoading(true);
      try {
          const response = await api.get(`/web/statistics?period=${period}`);
          if (response.data) {
              if (response.data.statistics) {
                  setStats(response.data.statistics);
              }
              if (response.data.chartData) {
                  // Format chart data for display
                  const formatted = response.data.chartData.map(item => ({
                      ...item,
                      time: new Date(item.time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                  }));
                  setChartData(formatted);
              }
          }
      } catch (error) {
          console.error('Failed to fetch stats', error);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
    fetchStats(true); // Initial load with loading state
    
    // Real-time polling every 5 seconds
    let interval;
    if (isLive) {
      interval = setInterval(() => fetchStats(false), 5000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [period, isLive]);

  const pieData = [
    { name: 'ON', value: stats.lampOnCount || 0 },
    { name: 'OFF', value: stats.lampOffCount || 0 },
  ];

  return (
    <div className="space-y-8 fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div className="flex items-center gap-3">
                <div>
                    <h1 className="font-display text-2xl font-bold text-slate-800">System Statistics</h1>
                    <p className="text-slate-500 text-sm">Aggregated performance metrics</p>
                </div>
                {isLive && (
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 rounded-full">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-xs font-medium text-emerald-600">LIVE</span>
                    </div>
                )}
            </div>
            
            <div className="flex items-center gap-3">
                <button
                    onClick={() => setIsLive(!isLive)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                        isLive 
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                    {isLive ? 'Pause' : 'Resume'}
                </button>
                
                <div className="flex bg-slate-100 p-1 rounded-xl">
                    {['24h', '7d', '30d'].map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                                period === p 
                                    ? 'bg-white text-indigo-600 shadow-sm' 
                                    : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="flex items-center justify-between p-6">
                 <div>
                    <p className="text-sm font-medium text-slate-500">Average Light</p>
                    <h3 className="text-3xl font-bold text-slate-800 mt-1">{stats.avgLightValue}</h3>
                    <p className="text-xs text-slate-400 mt-1">Lux Intensity</p>
                 </div>
                 <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <Minus className="h-6 w-6" />
                 </div>
            </Card>

            <Card className="flex items-center justify-between p-6">
                 <div>
                    <p className="text-sm font-medium text-slate-500">Maximum Peak</p>
                    <h3 className="text-3xl font-bold text-slate-800 mt-1">{stats.maxLightValue}</h3>
                    <p className="text-xs text-slate-400 mt-1">Highest Reading</p>
                 </div>
                 <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                    <ArrowUp className="h-6 w-6" />
                 </div>
            </Card>

            <Card className="flex items-center justify-between p-6">
                 <div>
                    <p className="text-sm font-medium text-slate-500">Minimum Low</p>
                    <h3 className="text-3xl font-bold text-slate-800 mt-1">{stats.minLightValue}</h3>
                    <p className="text-xs text-slate-400 mt-1">Lowest Reading</p>
                 </div>
                 <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                    <ArrowDown className="h-6 w-6" />
                 </div>
            </Card>
        </div>

        {/* Light Intensity Chart */}
        <Card>
            <div className="mb-6 flex items-center gap-3">
                <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                    <Sun className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="font-semibold text-slate-800">Light Intensity Over Time</h3>
                    <p className="text-sm text-slate-500">Real-time sensor readings (Lux)</p>
                </div>
            </div>
            <div className="h-72 w-full">
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorLux" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                            <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: 'white', 
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                                formatter={(value) => [`${value} Lux`, 'Intensity']}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="value" 
                                stroke="#f59e0b" 
                                strokeWidth={2}
                                fillOpacity={1} 
                                fill="url(#colorLux)" 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-slate-400">
                        No data available for this period
                    </div>
                )}
            </div>
        </Card>

        {/* Charts & Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
                <div className="mb-6">
                    <h3 className="font-semibold text-slate-800">Lamp Status Distribution</h3>
                    <p className="text-sm text-slate-500">Ratio of ON vs OFF states</p>
                </div>
                <div className="h-64 w-full flex items-center justify-center">
                    {(stats.lampOnCount > 0 || stats.lampOffCount > 0) ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="text-slate-400">No data available</div>
                    )}
                </div>
            </Card>

            <Card>
                <div className="mb-6">
                    <h3 className="font-semibold text-slate-800">Total Activity</h3>
                    <p className="text-sm text-slate-500">Data points collected</p>
                </div>
                <div className="flex flex-col items-center justify-center h-64 text-center">
                    <div className="p-4 bg-indigo-50 text-indigo-600 rounded-full mb-4">
                        <Activity className="h-10 w-10" />
                    </div>
                    <span className="text-5xl font-bold text-slate-800 tracking-tighter">
                        {stats.totalLogs}
                    </span>
                    <span className="text-sm text-slate-500 mt-2 font-medium bg-slate-100 px-3 py-1 rounded-full">
                        Total Readings Processed
                    </span>
                </div>
            </Card>
        </div>
    </div>
  );
}
