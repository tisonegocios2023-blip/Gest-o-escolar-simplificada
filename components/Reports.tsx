import React, { useState } from 'react';
import { Transaction } from '../types';
import { generateFinancialReport } from '../services/geminiService';
import { Bot, Sparkles, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ReportsProps {
  transactions: Transaction[];
}

export const Reports: React.FC<ReportsProps> = ({ transactions }) => {
  const [report, setReport] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateReport = async () => {
    setIsLoading(true);
    setReport('');
    try {
        const result = await generateFinancialReport(transactions);
        setReport(result);
    } catch (e) {
        setReport("Erro ao gerar relatório. Tente novamente.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-800">Relatório Inteligente</h2>
        <p className="text-slate-500">Utilize nossa IA para analisar a saúde financeira da sua escola e obter insights estratégicos.</p>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg flex flex-col items-center justify-center text-center">
         <Bot size={48} className="mb-4 opacity-90" />
         <h3 className="text-xl font-semibold mb-2">Consultor Financeiro Virtual</h3>
         <p className="mb-6 max-w-lg opacity-90">Análise de fluxo de caixa, inadimplência e sugestões de redução de custos baseadas nos seus dados atuais.</p>
         <button 
            onClick={handleGenerateReport}
            disabled={isLoading}
            className={`flex items-center space-x-2 bg-white text-blue-600 px-6 py-3 rounded-full font-bold shadow-md transition-transform hover:scale-105 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
         >
            {isLoading ? (
                <>
                    <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                    <span>Analisando dados...</span>
                </>
            ) : (
                <>
                    <Sparkles size={20} />
                    <span>Gerar Relatório Agora</span>
                </>
            )}
         </button>
      </div>

      {report && (
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden animate-fade-in">
            <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center space-x-2">
                <FileTextIcon />
                <h3 className="font-bold text-slate-700">Resultado da Análise</h3>
            </div>
            <div className="p-8 prose prose-slate max-w-none">
                <ReactMarkdown>{report}</ReactMarkdown>
            </div>
        </div>
      )}

      {!report && !isLoading && (
          <div className="flex items-center justify-center p-12 text-slate-400 bg-white rounded-xl border border-dashed border-slate-300">
              <p>Nenhum relatório gerado ainda. Clique no botão acima para começar.</p>
          </div>
      )}

      <div className="flex items-start space-x-3 bg-yellow-50 p-4 rounded-lg text-yellow-800 text-sm">
        <AlertCircle size={20} className="shrink-0 mt-0.5" />
        <p>A análise é gerada por Inteligência Artificial (Gemini) baseada nos dados inseridos. Use as sugestões como apoio à tomada de decisão.</p>
      </div>
    </div>
  );
};

const FileTextIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
);