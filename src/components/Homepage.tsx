import React, { useState, useEffect } from 'react';
import BudgetPieChart from './BudgetPieChart';

interface Budget {
    id: number; 
    user_id: number;
    category_id: number;
    amount: number;
    period_start: Date | string;
    period_end: Date | string;
}

interface Transaction {
    id: number; 
    user_id: number;
    category_id: number;
    amount: number;
    description: string;
    transaction_date: Date | string; 
}

const Homepage = () => {
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [selectedBudgetId, setSelectedBudgetId] = useState<number>(0);
    const [spentAmount, setSpentAmount] = useState<number>(0);

    useEffect(() => {
        const fetchBudgets = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}budgets`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                if (!response.ok) throw new Error('Failed to fetch budgets');
        
                const result = await response.json();
                console.log(result); 
                
                if (result.rows && Array.isArray(result.rows)) {
                    setBudgets(result.rows);
                } else {
                    console.error('Unexpected data format:', result);
                    throw new Error('Data format is not as expected');
                }
            } catch (error) {
                console.error("Error fetching budgets:", error);
            }
        };
    
        fetchBudgets();
    }, []);
    

    useEffect(() => {
        const calculateSpentAmount = async () => {
            if (!selectedBudgetId) return;
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}transactions`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                if (!response.ok) throw new Error('Failed to fetch transactions');
                const result = await response.json();
                const transactions = result.rows; 
                console.log(transactions); 
                const selectedBudget = budgets.find(budget => budget.id === selectedBudgetId);
                
                const totalSpent = transactions
                    .filter((transaction: Transaction) =>
                        selectedBudget &&
                        new Date(transaction.transaction_date) >= new Date(selectedBudget.period_start) &&
                        new Date(transaction.transaction_date) <= new Date(selectedBudget.period_end) &&
                        transaction.category_id === selectedBudget.category_id 
                    )
                    .reduce((acc: number, transaction: Transaction) => acc + transaction.amount, 0);

                setSpentAmount(totalSpent);
            } catch (error) {
                console.error('Error calculating spent amount:', error);
            }
        };
        
        calculateSpentAmount();
    }, [selectedBudgetId, budgets]);
    
    return (
        <div>
            <h1>Dashboard</h1>
            <select onChange={(e) => setSelectedBudgetId(Number(e.target.value))} value={selectedBudgetId}>
                <option value="">Select a budget</option>
                {budgets.map((budget: Budget) => (
                    <option key={budget.id} value={budget.id}>
                        {budget.category_id} - {budget.amount}
                    </option>
                ))}
            </select>
            {selectedBudgetId && (
                <div className="pieChartContainer">
                <BudgetPieChart
                    budgetAmount={budgets.find(budget => budget.id === selectedBudgetId)?.amount || 0}
                    spentAmount={spentAmount}
                />
                </div>
            )}
        </div>
    );
};

export default Homepage;
