'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { api } from '@/services/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { User, Shield, Clock, Trash2, Plus, X } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '', role: 'user' });
  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAddUser = async (e) => {
      e.preventDefault();
      setFormLoading(true);
      setMessage('');
      try {
          await api.post('/auth/register', formData);
          setMessage('User added successfully!');
          setFormData({ username: '', password: '', role: 'user' });
          setIsModalOpen(false);
          fetchUsers(); // Refresh list
      } catch (error) {
          setMessage(error?.response?.data?.message || 'Failed to add user');
      } finally {
          setFormLoading(false);
      }
  };

  const deleteUser = async (id) => {
      if(!confirm('Are you sure you want to delete this user?')) return;
      try {
          await api.delete(`/users/${id}`);
          fetchUsers();
      } catch(error) {
          alert('Failed to delete user');
      }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
        const response = await api.get('/users');
        if (response.data && response.data.users) {
            setUsers(response.data.users);
        }
    } catch (error) {
        console.error('Failed to fetch users', error);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="space-y-6 fade-in">
        <div className="flex items-center justify-between">
        <div>
            <h1 className="font-display text-2xl font-bold text-slate-800">User Management</h1>
            <p className="text-slate-500 text-sm">System access control list</p>
        </div>
        <Button icon={Plus} onClick={() => setIsModalOpen(true)}>Add User</Button>
      </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
          <Card key={user.id} className="relative overflow-hidden group hover:border-indigo-200 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
               <button 
                onClick={() => deleteUser(user.id)}
                className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
               >
                   <Trash2 className="w-4 h-4" />
               </button>
            </div>
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                <User className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-slate-800 truncate mb-1">
                                {user.username}
                            </h3>
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wide
                                    ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}
                                `}>
                                    <Shield className="h-3 w-3 mr-1" />
                                    {user.role}
                                </span>
                            </div>
                            <div className="flex items-center text-xs text-slate-400">
                                <Clock className="h-3 w-3 mr-1" />
                                Created: {new Date(user.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 transition-all duration-300">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 relative animate-in fade-in zoom-in-95 duration-200">
                <button 
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
                
                <div className="mb-6">
                    <h2 className="text-2xl font-display font-bold text-slate-800">Add New User</h2>
                    <p className="text-slate-500">Create a new access account</p>
                </div>
                
                {message && (
                    <div className={`mb-6 p-4 rounded-xl text-sm font-medium flex items-center gap-2 ${message.includes('success') ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleAddUser} className="space-y-5">
                    <div className="space-y-4">
                        <Input 
                            label="Username"
                            placeholder="Enter username"
                            value={formData.username}
                            onChange={e => setFormData({...formData, username: e.target.value})}
                            required
                            className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                        />
                        <Input 
                            label="Password"
                            type="password"
                            placeholder="Set a password"
                            value={formData.password}
                            onChange={e => setFormData({...formData, password: e.target.value})}
                            required
                            className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                        />
                        
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Role</label>
                            <div className="relative">
                                <select 
                                    className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all appearance-none cursor-pointer"
                                    value={formData.role}
                                    onChange={e => setFormData({...formData, role: e.target.value})}
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                                <div className="absolute right-4 top-3.5 pointer-events-none text-slate-500">
                                    <Shield className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} fullWidth className="text-slate-500 hover:text-slate-700">Cancel</Button>
                        <Button type="submit" isLoading={formLoading} fullWidth className="shadow-lg shadow-indigo-500/20">Create Cloud Account</Button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}
