'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Lightbulb, Lock, User } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      // Redirect handled in login function
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 relative overflow-hidden">
        {/* Abstract Background Blobs */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-rose-500/20 rounded-full blur-[100px]" />

      <Card className="w-full max-w-md relative z-10 border-white/60 bg-white/60 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-xl shadow-indigo-500/30">
            <Lightbulb className="h-8 w-8" />
          </div>
          <h1 className="font-display text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="mt-2 text-slate-500">Sign in to manage your smart home</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Username</label>
            <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input 
                    placeholder="Enter username" 
                    className="pl-10" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>
          </div>
          
          <div className="space-y-1">
             <label className="text-sm font-medium text-slate-700">Password</label>
             <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input 
                    type="password" 
                    placeholder="Enter password" 
                    className="pl-10" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
             </div>
          </div>

          {error && (
            <div className="rounded-lg bg-rose-50 p-3 text-sm text-rose-600 border border-rose-100 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />    
                {error}
            </div>
          )}

          <Button type="submit" className="w-full mt-2" size="lg" isLoading={loading}>
            Sign In
          </Button>

          <div className="mt-6 text-center text-xs text-slate-400">
            Demo: admin_cahaya / password123
          </div>
        </form>
      </Card>
    </div>
  );
}
