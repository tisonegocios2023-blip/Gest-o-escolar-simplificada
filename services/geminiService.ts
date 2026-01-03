import { GoogleGenAI } from "@google/genai";
import { Transaction, TransactionType } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateFinancialReport = async (transactions: Transaction[]): Promise<string> => {
  if (!apiKey) {
    return "API Key não configurada. Não é possível gerar relatórios inteligentes.";
  }

  // Summarize data for the AI to save tokens
  const incomes = transactions.filter(t => t.type === TransactionType.INCOME);
  const expenses = transactions.filter(t => t.type === TransactionType.EXPENSE);
  
  const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  
  // Get last 5 large expenses
  const topExpenses = [...expenses]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5)
    .map(t => `${t.description}: R$ ${t.amount}`);

  const dataSummary = `
    Total Receitas: R$ ${totalIncome.toFixed(2)}
    Total Despesas: R$ ${totalExpense.toFixed(2)}
    Saldo: R$ ${(totalIncome - totalExpense).toFixed(2)}
    Top 5 Despesas: ${topExpenses.join(', ')}
    Total de Transações: ${transactions.length}
  `;

  const prompt = `
    Atue como um consultor financeiro escolar experiente.
    Analise os seguintes dados financeiros resumidos de uma escola:
    ${dataSummary}

    Por favor, forneça:
    1. Uma análise breve da saúde financeira.
    2. Identificação de possíveis pontos de atenção (ex: despesas altas).
    3. 3 sugestões estratégicas para melhorar o fluxo de caixa.
    
    Use formatação Markdown. Seja direto e profissional.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Não foi possível gerar a análise no momento.";
  } catch (error) {
    console.error("Erro ao chamar Gemini:", error);
    return "Erro ao comunicar com o serviço de IA. Verifique sua conexão ou chave de API.";
  }
};