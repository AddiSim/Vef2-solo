import React, { useState, useEffect } from 'react';

type Budget = {
    id: string;
    user_id: number;
    category_id: number;
    amount: number;
    period_start: string;
    period_end: string;
};

const Budgets: React.FunctionComponent = () => {
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [category_id, setCategory_id] = useState('');
    const [amount, setAmount] = useState('');
    const [period_start, setperiod_start] = useState('');
    const [period_end, setperiod_end] = useState('');

    useEffect(() => {
        fetchBudgets();
    }, []); 

    const fetchBudgets = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}budgets`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) throw new Error('Failed to fetch budgets');
    
            const result = await response.json();
            setBudgets(result.rows);
        } catch (error) {
            console.error("Error fetching budgets:", error);
        }
    };
    
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const userid = localStorage.getItem('id');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}budgets`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userid,
                    category_id: category_id,
                    amount: Number(amount),
                    period_start: period_start,
                    period_end: period_end
                }),
            });
        
            if (!response.ok) throw new Error('Failed to create a new budget');
            
            const newBudget = await response.json();
            setBudgets(prevBudgets => [...prevBudgets, newBudget]);
            setCategory_id('');
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
          value={category_id}
          onChange={(e) => setCategory_id(e.target.value)}
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
        <input
          type="date"
          value={period_start}
          onChange={(e) => setperiod_start(e.target.value)}
          placeholder="period start"
          required
        />
        <input
          type="date"
          value={period_end}
          onChange={(e) => setperiod_end(e.target.value)}
          placeholder="period end"
          required
        />
        <button type="submit">Add Budget</button>
      </form>
      <ul>
      {budgets.map((budget) => (
        <li key={budget.id}>
            {budget.category_id}: ${budget.amount} from{' '}
            {new Date(budget.period_start).toISOString().split('T')[0]} to{' '}
            {new Date(budget.period_end).toISOString().split('T')[0]}
        </li>
        ))}
      </ul>
    </div>
  );
};

export default Budgets;
