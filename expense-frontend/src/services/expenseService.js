import { fetchWithAuth } from './api';

export const addExpense = async (expenseData) => fetchWithAuth('/expenses', {
  method: 'POST',
  body: JSON.stringify(expenseData),
});

export const getSettlement = async (tripId) => fetchWithAuth(`/expenses/settlement/${tripId}`);
export const getTripSummary = async (tripId) => fetchWithAuth(`/expenses/summary/${tripId}`);