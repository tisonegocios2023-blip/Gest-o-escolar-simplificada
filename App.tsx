import React, { useState, useEffect } from 'react';
import { User, UserRole, Student, Transaction, StudentStatus, TransactionType, TransactionCategory } from './types';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Students } from './components/Students';
import { Finance } from './components/Finance';
import { Reports } from './components/Reports';
import { Login } from './components/Login';
import { HashRouter } from 'react-router-dom';

// Simple Login Component inline to avoid too many files for this prompt, usually separate
// Using HashRouter implicitly for structure although we use state routing here for simplicity in SPA

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState('dashboard');
  
  // -- State Data (Mock Database) --
  const [students, setStudents] = useState<Student[]>([
      { id: '1', name: 'João Silva', cpf: '123.456.789-00', email: 'joao@email.com', phone: '11999999999', grade: '5º Ano A', tuitionValue: 1200, enrollmentDate: '2023-01-15', status: StudentStatus.ACTIVE },
      { id: '2', name: 'Maria Souza', cpf: '321.654.987-00', email: 'maria@email.com', phone: '11888888888', grade: '3º Ano B', tuitionValue: 1100, enrollmentDate: '2023-02-10', status: StudentStatus.ACTIVE },
      { id: '3', name: 'Pedro Santos', cpf: '000.111.222-33', email: 'pedro@email.com', phone: '11777777777', grade: '9º Ano C', tuitionValue: 1400, enrollmentDate: '2023-01-20', status: StudentStatus.INACTIVE },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
      { id: '101', description: 'Mensalidade - João Silva', amount: 1200, type: TransactionType.INCOME, category: TransactionCategory.TUITION, date: '2023-10-01', dueDate: '2023-10-05', paymentDate: '2023-10-05', studentId: '1', paid: true },
      { id: '102', description: 'Salário Professores', amount: 8500, type: TransactionType.EXPENSE, category: TransactionCategory.SALARY, date: '2023-10-01', dueDate: '2023-10-05', paymentDate: '2023-10-05', paid: true },
      { id: '103', description: 'Material de Limpeza', amount: 450, type: TransactionType.EXPENSE, category: TransactionCategory.SUPPLIES, date: '2023-10-10', dueDate: '2023-10-10', paymentDate: '2023-10-10', paid: true },
      { id: '104', description: 'Mensalidade - Maria Souza', amount: 1100, type: TransactionType.INCOME, category: TransactionCategory.TUITION, date: '2023-10-01', dueDate: '2023-10-10', studentId: '2', paid: false },
  ]);

  // -- Handlers --
  
  const handleLogin = (u: User) => setUser(u);
  const handleLogout = () => setUser(null);

  const addStudent = (s: Student) => setStudents([...students, s]);
  const updateStudent = (s: Student) => setStudents(students.map(st => st.id === s.id ? s : st));
  const deleteStudent = (id: string) => setStudents(students.filter(s => s.id !== id));

  const addTransaction = (t: Transaction) => setTransactions([...transactions, t]);
  const updateTransaction = (t: Transaction) => setTransactions(transactions.map(tr => tr.id === t.id ? t : tr));
  const deleteTransaction = (id: string) => setTransactions(transactions.filter(t => t.id !== id));

  const generateMonthlyTuition = () => {
      const today = new Date();
      // Due date is 10 days from now by default for new batch
      const dueDate = new Date();
      dueDate.setDate(today.getDate() + 10);

      const newTransactions: Transaction[] = students
        .filter(s => s.status === StudentStatus.ACTIVE)
        .map(s => ({
            id: Date.now() + Math.random().toString(),
            description: `Mensalidade - ${s.name}`,
            amount: s.tuitionValue,
            type: TransactionType.INCOME,
            category: TransactionCategory.TUITION,
            date: today.toISOString().split('T')[0],
            dueDate: dueDate.toISOString().split('T')[0],
            studentId: s.id,
            paid: false
        }));
      
      setTransactions([...transactions, ...newTransactions]);
      alert(`${newTransactions.length} mensalidades geradas com sucesso!`);
  };

  if (!user) {
      return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        onLogout={handleLogout}
        userRole={user.role} 
      />
      
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        <div className="max-w-7xl mx-auto">
            {currentView === 'dashboard' && (
                <Dashboard transactions={transactions} studentCount={students.filter(s => s.status === StudentStatus.ACTIVE).length} />
            )}
            
            {currentView === 'students' && (
                <Students 
                    students={students} 
                    onAddStudent={addStudent} 
                    onUpdateStudent={updateStudent} 
                    onDeleteStudent={deleteStudent} 
                />
            )}

            {currentView === 'finance' && (
                <Finance 
                    transactions={transactions}
                    students={students}
                    onAddTransaction={addTransaction}
                    onUpdateTransaction={updateTransaction}
                    onDeleteTransaction={deleteTransaction}
                    onGenerateTuition={generateMonthlyTuition}
                />
            )}

            {currentView === 'reports' && (
                <Reports transactions={transactions} />
            )}
        </div>
      </main>
    </div>
  );
};

export default App;