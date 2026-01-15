'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { api } from '@/services/api';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

export default function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dateFilter, setDateFilter] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
        const query = `?page=${page}&limit=10${dateFilter ? `&date=${dateFilter}` : ''}`;
        const response = await api.get(`/web/logs${query}`);
        if (response.data) {
            setLogs(response.data.logs || []);
            setTotalPages(response.data.pagination?.totalPages || 1);
        }
    } catch (error) {
        console.error('Failed to fetch logs', error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, dateFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDateChange = (e) => {
    setDateFilter(e.target.value);
    setPage(1);
  };

  return (
    <div className="space-y-6 fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div>
                <h1 className="font-display text-2xl font-bold text-slate-800">Sensor Logs</h1>
                <p className="text-slate-500 text-sm">Historical sensor data readings</p>
            </div>
            
            <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                    type="date" 
                    className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={dateFilter}
                    onChange={handleDateChange}
                />
            </div>
        </div>

        <Card className="padding-0 overflow-hidden border-0 shadow-lg">
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50/50">
                        <tr>
                            <th className="px-6 py-4 font-medium">Time</th>
                            <th className="px-6 py-4 font-medium">Value (Lux)</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                             [...Array(5)].map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-32"></div></td>
                                    <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-16"></div></td>
                                    <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-20"></div></td>
                                </tr>
                             ))
                        ) : logs.length > 0 ? (
                            logs.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-700">
                                        {log.createdAt ? new Date(log.createdAt).toLocaleString() : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 font-mono">
                                        {log.lightValue}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                            ${log.lampStatus ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}
                                        `}>
                                            {log.lampStatus ? 'ON' : 'OFF'}
                                            {/* Logic needs to match backend threshold but we don't know it here easily without fetching config. 
                                                Let's simplify visual indicator or remove specific logic if unknown. 
                                                Or just display 'Logged'. 
                                                Actually let's assume > 0 is just logged. 
                                                Let's stick to simple styling. */}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="px-6 py-8 text-center text-slate-500">
                                    No logs found for this date.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
             </div>
             
             {/* Pagination */}
             <div className="flex items-center justify-between px-6 py-4 bg-slate-50/50 border-t border-slate-100">
                <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1 || loading}
                >
                    <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                <span className="text-xs font-medium text-slate-500">
                    Page {page} of {totalPages}
                </span>
                <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages || loading}
                >
                    Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
             </div>
        </Card>
    </div>
  );
}
