import React, { useState } from 'react';
import { Transaction, TransactionType, TransactionCategory, Student } from '../types';
import { Plus, Filter, CheckCircle, XCircle, Trash2, Calendar, Search } from 'lucide-react';

interface FinanceProps {
  transactions: Transaction[];
  students: Student[];
  onAddTransaction: (t: Transaction) => void;
  onUpdateTransaction: (t: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  onGenerateTuition: () => void;
}

export const Finance: React.FC<FinanceProps> = ({ 
    transactions, students, onAddTransaction, onUpdateTransaction, onDeleteTransaction, onGenerateTuition 
}) => {
  const [filterType, setFilterType] = useState<TransactionType | 'ALL'>('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const today = new Date().toISOString().split('T')[0];
  
  const [currentTransaction, setCurrentTransaction] = useState<Partial<Transaction>>({
      type: TransactionType.EXPENSE,
      category: TransactionCategory.MAINTENANCE,
      paid: false,
      date: today,
      dueDate: today
  });

  // Filtros rápidos de data
  const applyDateFilter = (period: 'this_month' | 'last_month' | 'this_year' | 'clear') => {
      const now = new Date();
      let start = '';
      let end = '';

      if (period === 'this_month') {
          start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
          end = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
      } else if (period === 'last_month') {
          start = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];
          end = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];
      } else if (period === 'this_year') {
          start = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
          end = new Date(now.getFullYear(), 11, 31).toISOString().split('T')[0];
      }

      setStartDate(start);
      setEndDate(end);
  };

  const filteredTransactions = transactions
    .filter(t => {
        // Filtro de Tipo
        if (filterType !== 'ALL' && t.type !== filterType) return false;
        
        // Filtro de Data
        if (startDate && t.date < startDate) return false;
        if (endDate && t.date > endDate) return false;
        
        return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newTransaction: Transaction = {
        ...currentTransaction as Transaction,
        id: Date.now().toString(),
    };
    onAddTransaction(newTransaction);
    setIsModalOpen(false);
    setCurrentTransaction({ 
        type: TransactionType.EXPENSE, 
        category: TransactionCategory.MAINTENANCE, 
        paid: false, 
        date: today,
        dueDate: today,
        paymentDate: ''
    });
  };

  const togglePaid = (t: Transaction) => {
    const isPaid = !t.paid;
    onUpdateTransaction({ 
        ...t, 
        paid: isPaid,
        paymentDate: isPaid ? today : undefined 
    });
  };

  const getStudentName = (id?: string) => {
      if (!id) return null;
      return students.find(s => s.id === id)?.name || "Aluno desconhecido";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Financeiro</h2>
        <div className="flex space-x-2">
            <button 
                onClick={onGenerateTuition}
                className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
            >
                <CheckCircle size={16} />
                <span>Gerar Mensalidades (Mês Atual)</span>
            </button>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center space-x-2 bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
                <Plus size={20} />
                <span>Nova Transação</span>
            </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        {/* Header de Filtros */}
        <div className="p-4 border-b border-slate-200 space-y-4">
            {/* Linha 1: Tipo de Transação */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-slate-500">
                        <Filter size={20} />
                        <span className="text-sm font-semibold">Tipo:</span>
                    </div>
                    <div className="flex space-x-2">
                        <button 
                            onClick={() => setFilterType('ALL')}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filterType === 'ALL' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                            Todas
                        </button>
                        <button 
                            onClick={() => setFilterType(TransactionType.INCOME)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filterType === TransactionType.INCOME ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                            Receitas
                        </button>
                        <button 
                            onClick={() => setFilterType(TransactionType.EXPENSE)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filterType === TransactionType.EXPENSE ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                            Despesas
                        </button>
                    </div>
                </div>

                {/* Filtros de Período Rápido */}
                <div className="flex items-center space-x-2 text-sm">
                    <span className="text-slate-500 font-medium hidden md:inline">Período:</span>
                    <button onClick={() => applyDateFilter('this_month')} className="px-2 py-1 hover:bg-slate-100 rounded text-slate-600">Este Mês</button>
                    <button onClick={() => applyDateFilter('last_month')} className="px-2 py-1 hover:bg-slate-100 rounded text-slate-600">Mês Passado</button>
                    <button onClick={() => applyDateFilter('this_year')} className="px-2 py-1 hover:bg-slate-100 rounded text-slate-600">Este Ano</button>
                    <button onClick={() => applyDateFilter('clear')} className="px-2 py-1 hover:bg-red-50 text-red-500 rounded font-medium">Limpar</button>
                </div>
            </div>
            
            {/* Linha 2: Intervalo de Data Manual */}
            <div className="flex items-center space-x-4 bg-slate-50 p-2 rounded-lg w-fit">
                <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium text-slate-500 uppercase">De</span>
                    <input 
                        type="date" 
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="bg-white border border-slate-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-primary outline-none"
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium text-slate-500 uppercase">Até</span>
                    <input 
                        type="date" 
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="bg-white border border-slate-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-primary outline-none"
                    />
                </div>
                {startDate && endDate && (
                    <div className="text-xs text-blue-600 font-medium flex items-center">
                        <Search size={12} className="mr-1" />
                        Filtrando intervalo
                    </div>
                )}
            </div>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="px-4 py-3 font-semibold text-slate-600">Descrição</th>
                        <th className="px-4 py-3 font-semibold text-slate-600">Vencimento</th>
                        <th className="px-4 py-3 font-semibold text-slate-600">Valor</th>
                        <th className="px-4 py-3 font-semibold text-slate-600">Status</th>
                        <th className="px-4 py-3 font-semibold text-slate-600">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {filteredTransactions.length > 0 ? (
                        filteredTransactions.map(t => (
                        <tr key={t.id} className="hover:bg-slate-50">
                            <td className="px-4 py-3">
                                <p className="font-medium text-slate-800">{t.description}</p>
                                <div className="flex flex-col text-xs text-slate-500">
                                    {t.studentId && <span>{getStudentName(t.studentId)}</span>}
                                    <span className="text-slate-400">Emissão: {new Date(t.date).toLocaleDateString('pt-BR')}</span>
                                    <span className="text-slate-400">Categoria: {t.category}</span>
                                </div>
                            </td>
                            <td className="px-4 py-3 text-slate-600 text-sm">
                                <div className="flex items-center space-x-2">
                                    <Calendar size={14} className="text-slate-400" />
                                    <span className={new Date(t.dueDate) < new Date() && !t.paid ? "text-red-500 font-medium" : ""}>
                                        {new Date(t.dueDate).toLocaleDateString('pt-BR')}
                                    </span>
                                </div>
                                {t.paid && t.paymentDate && (
                                    <div className="text-xs text-emerald-600 mt-1">
                                        Pago em: {new Date(t.paymentDate).toLocaleDateString('pt-BR')}
                                    </div>
                                )}
                            </td>
                            <td className={`px-4 py-3 font-medium ${t.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-red-600'}`}>
                                {t.type === TransactionType.EXPENSE ? '-' : '+'} R$ {t.amount.toFixed(2)}
                            </td>
                            <td className="px-4 py-3">
                                <button 
                                    onClick={() => togglePaid(t)}
                                    className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-bold border ${
                                        t.paid 
                                        ? 'bg-green-50 text-green-700 border-green-200' 
                                        : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                    }`}
                                >
                                    {t.paid ? <CheckCircle size={12}/> : <XCircle size={12}/>}
                                    <span>{t.paid ? 'Pago' : 'Pendente'}</span>
                                </button>
                            </td>
                            <td className="px-4 py-3">
                                <button onClick={() => onDeleteTransaction(t.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                                    <Trash2 size={18} />
                                </button>
                            </td>
                        </tr>
                    ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                                Nenhuma transação encontrada para este período.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
             <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Nova Transação</h3>
                <form onSubmit={handleSave} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
                            <select 
                                className="w-full border border-slate-300 rounded-lg px-3 py-2"
                                value={currentTransaction.type}
                                onChange={e => setCurrentTransaction({...currentTransaction, type: e.target.value as TransactionType})}
                            >
                                <option value={TransactionType.INCOME}>Receita</option>
                                <option value={TransactionType.EXPENSE}>Despesa</option>
                            </select>
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
                             <select 
                                className="w-full border border-slate-300 rounded-lg px-3 py-2"
                                value={currentTransaction.category}
                                onChange={e => setCurrentTransaction({...currentTransaction, category: e.target.value as TransactionCategory})}
                            >
                                {Object.values(TransactionCategory).map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
                        <input 
                            required
                            className="w-full border border-slate-300 rounded-lg px-3 py-2"
                            value={currentTransaction.description || ''}
                            onChange={e => setCurrentTransaction({...currentTransaction, description: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Valor (R$)</label>
                            <input 
                                required
                                type="number"
                                step="0.01"
                                className="w-full border border-slate-300 rounded-lg px-3 py-2"
                                value={currentTransaction.amount || ''}
                                onChange={e => setCurrentTransaction({...currentTransaction, amount: parseFloat(e.target.value)})}
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Data de Emissão</label>
                            <input 
                                required
                                type="date"
                                className="w-full border border-slate-300 rounded-lg px-3 py-2"
                                value={currentTransaction.date || ''}
                                onChange={e => setCurrentTransaction({...currentTransaction, date: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Data de Vencimento</label>
                            <input 
                                required
                                type="date"
                                className="w-full border border-slate-300 rounded-lg px-3 py-2"
                                value={currentTransaction.dueDate || ''}
                                onChange={e => setCurrentTransaction({...currentTransaction, dueDate: e.target.value})}
                            />
                        </div>
                        {currentTransaction.paid && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Data de Pagamento</label>
                                <input 
                                    required
                                    type="date"
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                                    value={currentTransaction.paymentDate || ''}
                                    onChange={e => setCurrentTransaction({...currentTransaction, paymentDate: e.target.value})}
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex items-center space-x-2 bg-slate-50 p-3 rounded-lg">
                        <input 
                            type="checkbox"
                            id="isPaid"
                            checked={currentTransaction.paid}
                            onChange={e => {
                                const isPaid = e.target.checked;
                                setCurrentTransaction({
                                    ...currentTransaction, 
                                    paid: isPaid,
                                    paymentDate: isPaid ? (currentTransaction.paymentDate || today) : ''
                                });
                            }}
                            className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary"
                        />
                        <label htmlFor="isPaid" className="text-sm font-medium text-slate-700">
                            Já foi pago/recebido?
                        </label>
                    </div>

                    <div className="flex justify-end pt-4 space-x-3">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancelar</button>
                        <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700">Salvar</button>
                    </div>
                </form>
             </div>
        </div>
      )}
    </div>
  );
};