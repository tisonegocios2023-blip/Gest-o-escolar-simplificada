export enum UserRole {
  ADMIN = 'ADMIN',
  SECRETARY = 'SECRETARY',
  TEACHER = 'TEACHER'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export enum StudentStatus {
  ACTIVE = 'Ativo',
  INACTIVE = 'Inativo',
  GRADUATED = 'Formado'
}

export interface Student {
  id: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  grade: string; // Série/Turma
  tuitionValue: number;
  enrollmentDate: string;
  status: StudentStatus;
}

export enum TransactionType {
  INCOME = 'Receita',
  EXPENSE = 'Despesa'
}

export enum TransactionCategory {
  TUITION = 'Mensalidade',
  SALARY = 'Salário',
  MAINTENANCE = 'Manutenção',
  SUPPLIES = 'Materiais',
  OTHER = 'Outros'
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  date: string; // Data de Emissão
  dueDate: string; // Data de Vencimento
  paymentDate?: string; // Data de Pagamento
  studentId?: string; // Optional, links to a student if it's a tuition payment
  paid: boolean;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  pendingTuition: number;
}