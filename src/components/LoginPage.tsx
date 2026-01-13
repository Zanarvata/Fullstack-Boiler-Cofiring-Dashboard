import React, { useState } from 'react';
import { Flame, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await login(username, password);
    
    setLoading(false);
    
    if (!success) {
      setError('Username atau password salah');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-orange-900 dark:from-slate-950 dark:via-slate-900 dark:to-orange-950">
      <div className="w-full max-w-md p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-orange-500 p-4 rounded-2xl mb-4">
            <Flame className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Boiler Cofiring</h1>
          <p className="text-slate-600 dark:text-slate-400">Monitoring & Optimization System</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              required
              className="mt-1"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </Button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 font-medium">Demo Credentials:</p>
          <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
            <p>👤 Admin: <code className="bg-slate-200 dark:bg-slate-600 px-1 rounded">admin</code> / <code className="bg-slate-200 dark:bg-slate-600 px-1 rounded">admin123</code></p>
            <p>👤 Operator: <code className="bg-slate-200 dark:bg-slate-600 px-1 rounded">operator</code> / <code className="bg-slate-200 dark:bg-slate-600 px-1 rounded">operator123</code></p>
          </div>
        </div>
      </div>
    </div>
  );
}
