'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Lightbulb, UserPlus, ArrowLeft } from 'lucide-react';
import { api } from '@/services/api';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await api.post('/auth/signup', { 
        username: formData.username, 
        password: formData.password 
      });
      // Redirect to login on success
      router.push('/login?registered=true');
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
      {/* Background Abstract Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-200/30 blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-200/30 blur-3xl animate-pulse delay-1000" />
      </div>

      <Card className="w-full max-w-md p-8 relative z-10 glass-card border-white/50 shadow-2xl shadow-indigo-500/10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30 mb-6">
            <UserPlus className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-800 mb-2">Create Account</h1>
          <p className="text-slate-500">Join Smart Light System today</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-medium animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Username"
            type="text"
            placeholder="Choose a username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
            fullWidth
          />
          
          <Input
            label="Password"
            type="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            fullWidth
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
            fullWidth
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={loading}
            icon={UserPlus}
            className="mt-2"
          >
            Register
          </Button>
        </form>

        <div className="mt-8 text-center">
            <Link href="/login" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Login
            </Link>
        </div>
      </Card>
      
      {/* Footer Branding */}
      <div className="absolute bottom-6 text-center w-full z-10">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-widest opacity-70">
          Smart Light IoT System
        </p>
      </div>
    </div>
  );
}
