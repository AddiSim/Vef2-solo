import React, { useState, useEffect } from 'react';

type Budget = {
    id: string;
    category: string;
    amount: number;
    periodStart: string;
    periodEnd: string;
};

const Budgets: React.FunctionComponent = () => {
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState('');

    useEffect(() => {
        fetchBudgets();
    }, []); // The empty dependency array tells React to run this effect once, after initial render

    const fetchBudgets = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}budgets`);
            if (!response.ok) throw new Error('Failed to fetch budgets');

            const result = await response.json();
            if (!Array.isArray(result.rows)) {
                console.error('Data is not an array:', result);
                throw new Error('Expected an array of budgets.');
            }
            setBudgets(result.rows);
        } catch (error) {
            console.error("Error fetching budgets:", error);
        }
};
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}budgets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    category,
                    amount: Number(amount),
                }),
            });
        
            if (!response.ok) throw new Error('Failed to create a new budget');
            
            const newBudget = await response.json();
            setBudgets(prevBudgets => [...prevBudgets, newBudget]);
            setCategory('');
            setAmount('');
        } catch (error) {
            console.error("Error creating a new budget:", error);
        }
    };

  return (
    <div>
      <h2>Budgets</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
          required
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          required
        />
        <button type="submit">Add Budget</button>
      </form>
      <ul>
        {budgets.map((budget) => (
          <li key={budget.id}>
            {budget.category}: ${budget.amount} from {budget.periodStart} to {budget.periodEnd}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Budgets;
