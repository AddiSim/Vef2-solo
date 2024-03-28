// src/components/Transactions/index.tsx
import React, { useState, useEffect } from 'react';

type Transaction = {
    id: string;
    category: string;
    amount: number;
    date: string;
    description: string;
};

const Transactions: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}transactions`);
          if (!response.ok) throw new Error('Network response was not ok.');
    
          const result = await response.json();
          if (!Array.isArray(result.rows)) {
            console.error('Data is not an array:', result);
            throw new Error('Expected an array of transactions.');
          }
          setTransactions(result.rows);
        } catch (error) {
          console.error("Fetching transactions failed:", error);
        }
    };
      
    return (
        <div>
            <h2>Transactions</h2>
            <ul>
                {transactions.map((transaction) => (
                    <li key={transaction.id}>
                        {transaction.date}: {transaction.category} - ${transaction.amount} ({transaction.description})
                    </li>
                ))}
            </ul>
            {/* Add/Edit transaction form should go here */}
        </div>
    );
};

export default Transactions;
