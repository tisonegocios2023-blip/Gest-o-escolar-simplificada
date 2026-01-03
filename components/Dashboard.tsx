import React, { useMemo } from 'react';
import { Transaction, TransactionType } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { DollarSign, TrendingDown, TrendingUp, Users } from 'lucide-react';

interface DashboardProps {
  transactions: Transaction[];
  studentCount: number;
}

const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#3b82f6'];

export const Dashboard: React.FC<DashboardProps> = ({ transactions, studentCount }) => {
  
  const stats = useMemo(() => {
    const income = transactions
      .filter(t => t.type === TransactionType.INCOME && t.paid)
      .reduce((acc, curr) => acc + curr.amount, 0);
    
    const expense = transactions
      .filter(t => t.type === TransactionType.EXPENSE && t.paid)
      .reduce((acc, curr) => acc + curr.amount, 0);

    const pending = transactions
      .filter(t => t.type === TransactionType.INCOME && !t.paid)
      .reduce((acc, curr) => acc + curr.amount, 0);

    return { income, expense, pending, balance: income - expense };
  }, [transactions]);

  const chartData = useMemo(() => {
    // Simple mock aggregation by category for Pie Chart
    const categories: Record<string, number> = {};
    transactions.forEach(t => {
      if (t.paid) {
         categories[t.category] = (categories[t.category] || 0) + t.amount;
      }
    });
    return Object.keys(categories).map(key => ({ name: key, value: categories[key] }));
  }, [transactions]);

  const barData = useMemo(() => {
      // Mock monthly data - in a real app would aggregate by date
      return [
          { name: 'Jan', Receita: stats.income * 0.8, Despesa: stats.expense * 0.9 },
          { name: 'Fev', Receita: stats.income * 0.9, Despesa: stats.expense * 0.8 },
          { name: 'Mar', Receita: stats.income, Despesa: stats.expense },
      ]
  }, [stats]);


  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Visão Geral</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-slate-500">Saldo Atual</p>
                    <h3 className={`text-2xl font-bold ${stats.balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        R$ {stats.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </h3>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                    <DollarSign className="text-blue-600" size={24} />
                </div>
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-slate-500">Receitas</p>
                    <h3 className="text-2xl font-bold text-emerald-600">
                        R$ {stats.income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </h3>
                </div>
                <div className="p-2 bg-emerald-50 rounded-lg">
                    <TrendingUp className="text-emerald-600" size={24} />
                </div>
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-slate-500">Despesas</p>
                    <h3 className="text-2xl font-bold text-red-600">
                        R$ {stats.expense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </h3>
                </div>
                <div className="p-2 bg-red-50 rounded-lg">
                    <TrendingDown className="text-red-600" size={24} />
                </div>
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-slate-500">Alunos Ativos</p>
                    <h3 className="text-2xl font-bold text-slate-800">
                        {studentCount}
                    </h3>
                </div>
                <div className="p-2 bg-indigo-50 rounded-lg">
                    <Users className="text-indigo-600" size={24} />
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-4">Fluxo de Caixa (Trimestre)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Receita" fill="#10b981" />
                <Bar dataKey="Despesa" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-4">Distribuição Financeira</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};