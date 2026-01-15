'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api } from '@/services/api';
import { Save, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ConfigPage() {
  const [config, setConfig] = useState({
    threshold: 0,
    mode: 'manual',
    lampStatus: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
        // We reuse /web/status which returns { config: ... } 
        // Or we should assume there's a specific GET config?
        // Using /web/status is safe based on previous experience.
        const response = await api.get('/web/status');
        const data = response.data; // Unwrap first
        
        if (data && data.currentConfig) {
            setConfig({
                threshold: data.currentConfig.threshold,
                mode: data.currentConfig.manualMode ? 'manual' : 'automatic',
                lampStatus: data.currentConfig.lampStatus || false
            });
        }
    } catch (error) {
        console.error('Fetch config error', error);
    } finally {
        setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
        const payload = {
            threshold: config.threshold,
            manualMode: config.mode === 'manual',
            lampStatus: config.lampStatus
        };
        await api.patch('/web/config', payload);
        setMessage({ type: 'success', text: 'Configuration saved successfully!' });
    } catch (error) {
        setMessage({ type: 'error', text: error.message || 'Failed to save configuration.' });
    } finally {
        setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 fade-in">
        <div>
            <h1 className="font-display text-2xl font-bold text-slate-800">System Configuration</h1>
            <p className="text-slate-500 text-sm">Manage sensor thresholds and operation modes</p>
        </div>

        <Card>
            <form onSubmit={handleSave} className="space-y-8">
                {/* Threshold Setting */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Light Threshold (Lux)
                    </label>
                    <p className="text-xs text-slate-500 mb-3">
                        If intensity drops below this value, the light will turn ON automatically (in Automatic mode).
                    </p>
                    <div className="flex gap-4 items-center">
                        <Input 
                            type="number" 
                            value={config.threshold} 
                            onChange={(e) => setConfig({ ...config, threshold: Number(e.target.value) })}
                            min="0"
                            max="5000"
                            className="max-w-[200px] text-lg font-mono"
                        />
                        <span className="text-sm font-medium text-slate-400">Lux</span>
                    </div>
                </div>

                <div className="h-px bg-slate-100" />

                {/* Mode Setting */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                        Operating Mode
                    </label>
                    <div className="flex gap-3">
                        {['manual', 'automatic'].map((m) => (
                            <div 
                                key={m}
                                onClick={() => setConfig({ ...config, mode: m })}
                                className={`
                                    cursor-pointer px-5 py-3 rounded-xl border-2 transition-all flex-1 text-center font-medium capitalize
                                    ${config.mode === m 
                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                                        : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}
                                `}
                            >
                                {m}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Manual Lamp Control - Only visible in Manual Mode */}
                {config.mode === 'manual' && (
                    <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                         <div className="h-px bg-slate-100 mb-8" />
                         
                         <label className="block text-sm font-medium text-slate-700 mb-3">
                            Manual Lamp Control
                        </label>
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                             <div className={`p-3 rounded-full transition-colors ${config.lampStatus ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-500'}`}>
                                <AlertCircle className="w-6 h-6" /> {/* Using AlertCircle as icon placeholder */}
                             </div>
                             <div className="flex-1">
                                 <h4 className="font-semibold text-slate-800">{config.lampStatus ? 'Light is ON' : 'Light is OFF'}</h4>
                                 <p className="text-xs text-slate-500">Force the light state regardless of sensor.</p>
                             </div>
                             
                             <button
                                type="button"
                                onClick={() => setConfig({...config, lampStatus: !config.lampStatus})}
                                className={`
                                    relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2
                                    ${config.lampStatus ? 'bg-indigo-600' : 'bg-slate-200'}
                                `}
                             >
                                <span className="sr-only">Toggle Light</span>
                                <span
                                    aria-hidden="true"
                                    className={`
                                        pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                                        ${config.lampStatus ? 'translate-x-6' : 'translate-x-0'}
                                    `}
                                    style={{ marginTop: '-2px', marginLeft: '-2px' }}
                                />
                             </button>
                        </div>
                    </div>
                )}

                {message && (
                    <div className={`p-4 rounded-xl flex items-center gap-3 ${
                        message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                        {message.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                        <span className="text-sm font-medium">{message.text}</span>
                    </div>
                )}

                <div className="flex justify-end pt-4">
                    <Button type="submit" isLoading={saving} className="w-full md:w-auto">
                        <Save className="h-4 w-4 mr-2" /> 
                        Save Changes
                    </Button>
                </div>
            </form>
        </Card>
    </div>
  );
}
