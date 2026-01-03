import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Lock, User as UserIcon } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('admin@escola.com');
  const [password, setPassword] = useState('admin');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulated auth logic
    if (email === 'admin@escola.com' && password === 'admin') {
        onLogin({
            id: '1',
            name: 'Administrador',
            email: email,
            role: UserRole.ADMIN
        });
    } else {
        setError('Credenciais inválidas. Tente admin@escola.com / admin');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
        <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                <Lock size={32} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">EduFinance Pro</h1>
            <p className="text-slate-500">Acesse sua conta para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <div className="relative">
                    <UserIcon className="absolute left-3 top-2.5 text-slate-400" size={20} />
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="seu@email.com"
                    />
                </div>
            </div>
            
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-2.5 text-slate-400" size={20} />
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="••••••••"
                    />
                </div>
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button 
                type="submit" 
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
                Entrar
            </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
            <p>Demo Login: admin@escola.com / admin</p>
        </div>
      </div>
    </div>
  );
};