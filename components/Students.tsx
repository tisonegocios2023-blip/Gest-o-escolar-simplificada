import React, { useState } from 'react';
import { Student, StudentStatus } from '../types';
import { Plus, Search, Edit, Trash2, X } from 'lucide-react';

interface StudentsProps {
  students: Student[];
  onAddStudent: (student: Student) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
}

export const Students: React.FC<StudentsProps> = ({ students, onAddStudent, onUpdateStudent, onDeleteStudent }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentStudent, setCurrentStudent] = useState<Partial<Student>>({});

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStudent.id) {
        onUpdateStudent(currentStudent as Student);
    } else {
        const newStudent: Student = {
            ...currentStudent as Student,
            id: Date.now().toString(),
            enrollmentDate: new Date().toISOString().split('T')[0],
            status: StudentStatus.ACTIVE
        };
        onAddStudent(newStudent);
    }
    closeModal();
  };

  const openModal = (student?: Student) => {
    if (student) {
        setCurrentStudent(student);
    } else {
        setCurrentStudent({
            status: StudentStatus.ACTIVE,
            tuitionValue: 1200 // Default Value
        });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentStudent({});
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.cpf.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Gestão de Alunos</h2>
        <button 
          onClick={() => openModal()}
          className="flex items-center space-x-2 bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={20} />
          <span>Novo Aluno</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="relative mb-4">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={20} />
            <input 
                type="text" 
                placeholder="Buscar por nome ou CPF..." 
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th className="px-4 py-3 font-semibold text-slate-600">Nome</th>
                        <th className="px-4 py-3 font-semibold text-slate-600">Série</th>
                        <th className="px-4 py-3 font-semibold text-slate-600">Mensalidade</th>
                        <th className="px-4 py-3 font-semibold text-slate-600">Status</th>
                        <th className="px-4 py-3 font-semibold text-slate-600">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {filteredStudents.length > 0 ? (
                        filteredStudents.map(student => (
                            <tr key={student.id} className="hover:bg-slate-50">
                                <td className="px-4 py-3">
                                    <p className="font-medium text-slate-800">{student.name}</p>
                                    <p className="text-xs text-slate-500">{student.email}</p>
                                </td>
                                <td className="px-4 py-3 text-slate-600">{student.grade}</td>
                                <td className="px-4 py-3 text-slate-600">R$ {student.tuitionValue.toFixed(2)}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                        student.status === StudentStatus.ACTIVE ? 'bg-emerald-100 text-emerald-700' : 
                                        student.status === StudentStatus.INACTIVE ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                    }`}>
                                        {student.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex space-x-2">
                                        <button onClick={() => openModal(student)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded">
                                            <Edit size={18} />
                                        </button>
                                        <button onClick={() => onDeleteStudent(student.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                                Nenhum aluno encontrado.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6 animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-800">{currentStudent.id ? 'Editar Aluno' : 'Novo Aluno'}</h3>
                    <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                        <X size={24} />
                    </button>
                </div>
                
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
                        <input 
                            required 
                            type="text" 
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
                            value={currentStudent.name || ''}
                            onChange={e => setCurrentStudent({...currentStudent, name: e.target.value})}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">CPF</label>
                            <input 
                                required 
                                type="text" 
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
                                value={currentStudent.cpf || ''}
                                onChange={e => setCurrentStudent({...currentStudent, cpf: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Telefone</label>
                            <input 
                                required 
                                type="text" 
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
                                value={currentStudent.phone || ''}
                                onChange={e => setCurrentStudent({...currentStudent, phone: e.target.value})}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input 
                            required 
                            type="email" 
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
                            value={currentStudent.email || ''}
                            onChange={e => setCurrentStudent({...currentStudent, email: e.target.value})}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Série/Turma</label>
                            <input 
                                required 
                                type="text" 
                                placeholder="ex: 5º Ano A"
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
                                value={currentStudent.grade || ''}
                                onChange={e => setCurrentStudent({...currentStudent, grade: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Mensalidade (R$)</label>
                            <input 
                                required 
                                type="number" 
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
                                value={currentStudent.tuitionValue || ''}
                                onChange={e => setCurrentStudent({...currentStudent, tuitionValue: parseFloat(e.target.value)})}
                            />
                        </div>
                    </div>
                    
                    {currentStudent.id && (
                        <div>
                             <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                             <select 
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
                                value={currentStudent.status}
                                onChange={e => setCurrentStudent({...currentStudent, status: e.target.value as StudentStatus})}
                             >
                                <option value={StudentStatus.ACTIVE}>Ativo</option>
                                <option value={StudentStatus.INACTIVE}>Inativo</option>
                                <option value={StudentStatus.GRADUATED}>Formado</option>
                             </select>
                        </div>
                    )}

                    <div className="flex justify-end pt-4">
                        <button type="button" onClick={closeModal} className="mr-3 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancelar</button>
                        <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};