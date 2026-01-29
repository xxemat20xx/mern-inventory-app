import React, { useState} from 'react';
import {
  Package,
  ShieldCheck,
  User,
  ArrowRight,
} from 'lucide-react';

import { useAuthStore } from '../store/useAuthStore';

const Login = () => {

  const { login} = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async(e) => {
    e.preventDefault();
    await login(email, password)
  };

  return (
    
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="w-full max-w-md">
        <div className="rounded-3xl shadow-xl p-8 bg-slate-800">
          <div className="flex justify-between items-start mb-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none">
                <Package className="text-white" size={28} />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-50">Inventory App</h1>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2 text-slate-50">Welcome Back</h2>
            <p className="text-slate-500 dark:text-slate-500 text-sm">
              Sign in to manage your inventory and sales.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='Enter your email'
                  required
                  className="w-full text-slate-50 px-4 py-3 rounded-xl bg-slate-5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  name='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete=''
                  required
                  placeholder='**********'
                  className="w-full text-slate-50 px-4 py-3 rounded-xl bg-slate-5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-[0.99]"
            >
              Sign In <ArrowRight size={20} />
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-slate-400 uppercase tracking-widest font-semibold">
            Demo Account Access
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;